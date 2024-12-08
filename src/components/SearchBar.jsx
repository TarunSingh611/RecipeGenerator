import React, { useState } from 'react';
import { TextField, Button, Chip, Box, Paper } from '@mui/material';
import { generateRecipe } from '../services/RecipeService';
import { useRecipes } from '../context/RecipeContext';
import {parseAndSanitizeRecipe} from '../utils/sanitizeRecipe';

const SearchBar = () => {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState('');
  const { setRecipes, setLoading } = useRecipes();

  const handleAddIngredient = () => {
    if (input.trim() && !ingredients.includes(input.trim())) {
      // Split the input by commas, semicolons, or spaces, and trim each ingredient  
      const newIngredients = input
        .split(/[,; ]+/) // Split by commas, semicolons, or spaces  
        .map((ingredient) => ingredient.trim()) // Trim each ingredient  
        .filter((ingredient) => ingredient); // Remove empty strings  

      // Add the new ingredients to the existing list, avoiding duplicates  
      setIngredients([...new Set([...ingredients, ...newIngredients])]);

      // Clear the input field  
      setInput('');
    }
  };

  const handleDelete = (ingredientToDelete) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToDelete));
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length > 0) {
      setLoading(true);
      try {
        const recipe = await generateRecipe(ingredients, "healthy");
        const parsedRecipe = parseAndSanitizeRecipe(recipe);
        setRecipes(prevRecipes => [...prevRecipes, parsedRecipe]);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
          placeholder="Add ingredients..."
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {ingredients.map((ingredient) => (
            <Chip
              key={ingredient}
              label={ingredient}
              onDelete={() => handleDelete(ingredient)}
            />
          ))}
        </Box>
        <Button
          variant="contained"
          onClick={handleGenerateRecipe}
          disabled={ingredients.length === 0}
        >
          Generate Recipe
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchBar;