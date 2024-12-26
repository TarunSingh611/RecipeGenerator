import axios from 'axios';

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

export const generateRecipe = async (ingredients, preferences) => {
  if (!API_KEY) {
    throw new Error('Google API Key is not defined');
  }
  const date = new Date();

  const userPrompt = `
    You are a professional chef who creates recipes tailored to specific ingredients and preferences.
    Create a recipe using the following ingredients: ${ingredients.join(', ')}.
    Preferences: ${preferences}.
    Use the seed ${date.now} for uniqueness.
    Format the response as a simple string where each field (field is title, ingredients, instructions, cookingTime, image, difficulty) is separated by a semicolon(;).:
    - Ingredients are listed with quantities, separated by commas.
    - Instructions are detailed in steps, with each step separated by a comma.
    Include the following fields in the output:
    - The name of the recipe.
    -  A list of ingredients with quantities.
    - Step-by-step cooking instructions.
    - Estimated cooking time in minutes.
    -  A valid URL of a free image from the internet that visually represents the recipe (e.g., from Unsplash, Pexels, or Pixabay).
    -  Difficulty level (easy, medium, hard).
    Ensure:
    1. The image URL corresponds specifically to the recipe.
    2. The recipe is clear, concise, and easy to follow.
    3. All fields are accurately formatted.
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
  };

  try {
    const response = await axios.post(
      `${API_BASE_URL}/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedText = response.data.candidates[0]?.content.parts[0]?.text || '';
    return generatedText;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Gemini API Error:', error.response?.data);
      throw new Error(error.response?.data?.error?.message || 'Failed to generate content');
    }
    throw error;
  }
};
