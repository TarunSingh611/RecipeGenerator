import axios from 'axios';
import { parseAndSanitizeRecipe } from '../utils/sanitizeRecipe';

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

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
  let dietaryConstraints = '';
  if (dietary !== 'all') {
    switch (dietary) {
      case 'vegetarian':
        dietaryConstraints = 'CRITICAL DIETARY RESTRICTION: This MUST be a vegetarian recipe. DO NOT use any meat, fish, poultry, or animal products. If the user provided meat ingredients like chicken, beef, pork, lamb, fish, or any animal products, you MUST substitute them with vegetarian alternatives like tofu, tempeh, seitan, mushrooms, eggplant, or vegetables. NEVER include meat, fish, or poultry in the recipe. The recipe must be 100% vegetarian. IMPORTANT: If the user provided "chicken", "beef", or "pork", you MUST create a vegetarian version using the same cooking techniques but with vegetarian substitutes. Do NOT use the meat ingredients as-is.';
        break;
      case 'vegan':
        dietaryConstraints = 'CRITICAL DIETARY RESTRICTION: This MUST be a vegan recipe. DO NOT use any animal products including meat, fish, poultry, dairy, eggs, or honey. If the user provided non-vegan ingredients, you MUST substitute them with plant-based alternatives. NEVER include any animal products in the recipe. The recipe must be 100% vegan.';
        break;
      case 'gluten-free':
        dietaryConstraints = 'CRITICAL DIETARY RESTRICTION: This MUST be a gluten-free recipe. DO NOT use wheat, barley, rye, oats, or any gluten-containing ingredients. Use gluten-free alternatives like rice, quinoa, corn, or certified gluten-free oats.';
        break;
      case 'low-carb':
        dietaryConstraints = 'CRITICAL DIETARY RESTRICTION: This MUST be a low-carbohydrate recipe. Minimize grains, sugars, and starchy vegetables. Focus on protein, healthy fats, and non-starchy vegetables.';
        break;
      case 'keto':
        dietaryConstraints = 'CRITICAL DIETARY RESTRICTION: This MUST be a ketogenic recipe. Very low carb (under 20g net carbs), high fat, moderate protein. No grains, sugars, or high-carb vegetables.';
        break;
      case 'paleo':
        dietaryConstraints = 'CRITICAL DIETARY RESTRICTION: This MUST be a paleo recipe. No grains, legumes, dairy, or processed foods. Use only whole foods like meat, fish, eggs, vegetables, fruits, nuts, and seeds.';
        break;
      default:
        dietaryConstraints = '';
    }
  }

  // Build difficulty constraints
  let difficultyConstraints = '';
  if (difficulty !== 'all') {
    switch (difficulty) {
      case 'easy':
        difficultyConstraints = 'Make this an easy recipe suitable for beginners with simple techniques and common ingredients.';
        break;
      case 'medium':
        difficultyConstraints = 'Make this a medium difficulty recipe with some intermediate cooking techniques.';
        break;
      case 'hard':
        difficultyConstraints = 'Make this a challenging recipe with advanced techniques and complex flavor profiles.';
        break;
      default:
        difficultyConstraints = '';
    }
  }

  // Build cooking time constraints
  let timeConstraints = '';
  if (cookingTime !== 'all') {
    switch (cookingTime) {
      case 'quick':
        timeConstraints = 'Make this a quick recipe that takes 30 minutes or less to prepare and cook.';
        break;
      case 'medium':
        timeConstraints = 'Make this a medium-time recipe that takes between 30-60 minutes to prepare and cook.';
        break;
      case 'long':
        timeConstraints = 'Make this a longer recipe that takes more than 60 minutes to prepare and cook.';
        break;
      default:
        timeConstraints = '';
    }
  }

  const userPrompt = `
    You are a professional chef and culinary expert who creates innovative, delicious recipes tailored to specific ingredients and preferences.
    
    CRITICAL INGREDIENT CONSTRAINT: You MUST use ONLY the following ingredients provided by the user: ${ingredients.join(', ')}. You may add minimal additional ingredients (like salt, pepper, oil, water) that are absolutely necessary for cooking, but the main ingredients must be from the user's list. DO NOT add any ingredients that are not in the user's list.
    
    ${dietaryConstraints}
    ${difficultyConstraints}
    ${timeConstraints}
    
    Use the seed ${Date.now()} for uniqueness and creativity.
    
    Format the response as a simple string where each field is separated by a semicolon (;):
    
    - Recipe title (be creative and descriptive, but NEVER mention meat if vegetarian diet is selected)
    - List of ingredients with quantities (separated by commas, ONLY use ingredients from user's list plus basic cooking essentials)
    - Step-by-step cooking instructions (each step separated by commas)
    - Estimated cooking time in minutes (just the number)
    - A valid URL of a free image from Unsplash, Pexels, or Pixabay that visually represents the recipe
    - Difficulty level (easy, medium, or hard)
    
    Requirements:
    1. The recipe must be practical and achievable
    2. Use ONLY the provided ingredients as the main components
    3. Add only minimal additional ingredients (salt, pepper, oil, water) if absolutely necessary
    4. Provide clear, detailed cooking instructions
    5. Ensure the image URL corresponds specifically to the recipe
    6. Make the recipe title appealing and descriptive
    7. Include appropriate cooking times and difficulty levels
    8. Consider food safety and best practices
    9. Add interesting flavor combinations and techniques
    10. Make the recipe suitable for home cooking
    11. ${dietary !== 'all' ? 'STRICTLY follow the dietary restrictions specified above. If any provided ingredients violate the dietary restriction (like meat in vegetarian diet), you MUST substitute them with appropriate alternatives and clearly state the substitution in the recipe.' : ''}
    12. NEVER use ingredients that are not in the user's list unless they are basic cooking essentials (salt, pepper, oil, water)
    13. If the user provided meat ingredients but selected a vegetarian diet, you MUST create a vegetarian version using the same cooking techniques but with vegetarian substitutes
    14. DO NOT add mushrooms, vegetables, or any other ingredients unless they are in the user's original list
    15. The recipe title must reflect the actual ingredients used, not meat if vegetarian diet is selected
    
    Ensure all fields are accurately formatted and the recipe is clear, concise, and easy to follow.
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
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }
      
      if (error.response?.status === 403) {
        throw new Error('API access denied. Please check your API key configuration.');
      }
      
      console.error('Gemini API Error:', error.response?.data);
      throw new Error(
        error.response?.data?.error?.message || 
        'Failed to generate recipe. Please check your API key and try again.'
      );
    }
    
    console.error('Recipe generation error:', error);
    throw new Error('An unexpected error occurred. Please try again.');
  }
};
