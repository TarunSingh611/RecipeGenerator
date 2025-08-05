import axios from 'axios';
import { parseAndSanitizeRecipe } from '../utils/sanitizeRecipe';

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to calculate exponential backoff delay
const getBackoffDelay = (attempt) => {
  return Math.min(BASE_DELAY * Math.pow(2, attempt), 10000); // Max 10 seconds
};

export const generateRecipe = async (ingredients, preferences = {}) => {
  if (!API_KEY) {
    throw new Error('Google API Key is not defined. Please check your environment variables.');
  }

  if (!ingredients || ingredients.length === 0) {
    throw new Error('No ingredients provided. Please add at least one ingredient.');
  }

  const date = new Date();
  
  // Parse preferences
  const dietary = preferences.dietary || 'all';
  const difficulty = preferences.difficulty || 'all';
  const cookingTime = preferences.cookingTime || 'all';

  // Build dietary constraints with stronger enforcement
  // let dietaryConstraints = '';
  // if (dietary !== 'all') {
  //   switch (dietary) {
  //     case 'vegetarian':
  //       dietaryConstraints = 'CRITICAL DIETARY RESTRICTION: This MUST be a vegetarian recipe. DO NOT use any meat, fish, poultry, or animal products. If the user provided meat ingredients like chicken, beef, pork, lamb, fish, or any animal products, you MUST substitute them with vegetarian alternatives like tofu, tempeh, seitan, mushrooms, eggplant, or vegetables. NEVER include meat, fish, or poultry in the recipe. The recipe must be 100% vegetarian. IMPORTANT: If the user provided "chicken", "beef", or "pork", you MUST create a vegetarian version using the same cooking techniques but with vegetarian substitutes. Do NOT use the meat ingredients as-is.';
  //       break;
  //     case 'vegan':
  //       dietaryConstraints = 'CRITICAL DIETARY RESTRICTION: This MUST be a vegan recipe. DO NOT use any animal products including meat, fish, poultry, dairy, eggs, or honey. If the user provided non-vegan ingredients, you MUST substitute them with plant-based alternatives. NEVER include any animal products in the recipe. The recipe must be 100% vegan.';
  //       break;
  //     case 'gluten-free':
  //       dietaryConstraints = 'CRITICAL DIETARY RESTRICTION: This MUST be a gluten-free recipe. DO NOT use wheat, barley, rye, oats, or any gluten-containing ingredients. Use gluten-free alternatives like rice, quinoa, corn, or certified gluten-free oats.';
  //       break;
  //     case 'low-carb':
  //       dietaryConstraints = 'CRITICAL DIETARY RESTRICTION: This MUST be a low-carbohydrate recipe. Minimize grains, sugars, and starchy vegetables. Focus on protein, healthy fats, and non-starchy vegetables.';
  //       break;
  //     case 'keto':
  //       dietaryConstraints = 'CRITICAL DIETARY RESTRICTION: This MUST be a ketogenic recipe. Very low carb (under 20g net carbs), high fat, moderate protein. No grains, sugars, or high-carb vegetables.';
  //       break;
  //     case 'paleo':
  //       dietaryConstraints = 'CRITICAL DIETARY RESTRICTION: This MUST be a paleo recipe. No grains, legumes, dairy, or processed foods. Use only whole foods like meat, fish, eggs, vegetables, fruits, nuts, and seeds.';
  //       break;
  //     default:
  //       dietaryConstraints = '';
  //   }
  // }

  // Build difficulty constraints
  let difficultyConstraints = '';
  // if (difficulty !== 'all') {
  //   switch (difficulty) {
  //     case 'easy':
  //       difficultyConstraints = 'Make this an easy recipe suitable for beginners with simple techniques and common ingredients.';
  //       break;
  //     case 'medium':
  //       difficultyConstraints = 'Make this a medium difficulty recipe with some intermediate cooking techniques.';
  //       break;
  //     case 'hard':
  //       difficultyConstraints = 'Make this a challenging recipe with advanced techniques and complex flavor profiles.';
  //       break;
  //     default:
  //       difficultyConstraints = '';
  //   }
  // }

  // Build cooking time constraints
  let timeConstraints = '';
  // if (cookingTime !== 'all') {
  //   switch (cookingTime) {
  //     case 'quick':
  //       timeConstraints = 'Make this a quick recipe that takes 30 minutes or less to prepare and cook.';
  //       break;
  //     case 'medium':
  //       timeConstraints = 'Make this a medium-time recipe that takes between 30-60 minutes to prepare and cook.';
  //       break;
  //     case 'long':
  //       timeConstraints = 'Make this a longer recipe that takes more than 60 minutes to prepare and cook.';
  //       break;
  //     default:
  //       timeConstraints = '';
  //   }
  // }

  const userPrompt = `
  You are a professional chef. Create a creative, delicious recipe based ONLY on the user's input.
  
  Ingredients: ${ingredients.join(', ')}
  
  STRICT RULES:
  - Use ONLY the provided ingredients. Basic essentials (salt, pepper, oil, water) are allowed.
  - DO NOT add any other ingredients.
  - Do NOT suggest ingredients not in the list (e.g., no mushrooms unless given).
  - Recipe title must match actual ingredients used.
  
  
  FORMAT:
  - Title;
  - Ingredients with quantities;
  - Step-by-step instructions;
  - Total cooking time in minutes (just the number);
  - A relevant free image URL (Unsplash, Pexels, or Pixabay);
  - Difficulty level (easy, medium, hard).
  `;
  

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: userPrompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
            
      if (!generatedText) {
        throw new Error('No recipe content was generated. Please try again.');
      }

      // Parse the generated text into a structured recipe object
      const parsedRecipe = parseAndSanitizeRecipe(generatedText);
      
      return parsedRecipe;
    } catch (error) {
      lastError = error;
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.error?.message;
        
        // Handle specific error cases
        if (status === 503 || errorMessage?.includes('overloaded')) {
          if (attempt < MAX_RETRIES) {
            const delayMs = getBackoffDelay(attempt);
            console.log(`API overloaded, retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
            await delay(delayMs);
            continue; // Retry the request
          } else {
            throw new Error('The AI service is currently overloaded. Please wait a few minutes and try again.');
          }
        }
        
        if (error.code === 'ECONNABORTED') {
          if (attempt < MAX_RETRIES) {
            const delayMs = getBackoffDelay(attempt);
            console.log(`Request timed out, retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
            await delay(delayMs);
            continue; // Retry the request
          } else {
            throw new Error('Request timed out after multiple attempts. Please check your internet connection and try again.');
          }
        }
        
        if (status === 429) {
          if (attempt < MAX_RETRIES) {
            const delayMs = getBackoffDelay(attempt);
            console.log(`Rate limited, retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
            await delay(delayMs);
            continue; // Retry the request
          } else {
            throw new Error('Too many requests. Please wait a moment and try again.');
          }
        }
        
        if (status === 403) {
          throw new Error('API access denied. Please check your API key configuration.');
        }
        
        if (status === 400) {
          throw new Error('Invalid request. Please check your input and try again.');
        }
        
        if (status === 500 || status === 502) {
          if (attempt < MAX_RETRIES) {
            const delayMs = getBackoffDelay(attempt);
            console.log(`Server error, retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
            await delay(delayMs);
            continue; // Retry the request
          } else {
            throw new Error('Server error occurred. Please try again later.');
          }
        }
        
        console.error('Gemini API Error:', error.response?.data);
        throw new Error(
          errorMessage || 
          'Failed to generate recipe. Please check your API key and try again.'
        );
      }
      
      // For non-Axios errors, don't retry
      console.error('Recipe generation error:', error);
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
  
  // If we get here, all retries failed
  throw lastError;
};
