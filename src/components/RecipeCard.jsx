import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Stack,
} from '@mui/material';
import { AccessTime, Restaurant, ContentCopy, Refresh } from '@mui/icons-material';
import { generateRecipe } from '../services/RecipeService';
import { parseAndSanitizeRecipe } from '../utils/sanitizeRecipe';
import { useRecipes } from '../context/RecipeContext';

const RecipeCard = ({ recipe }) => {
  const { setRecipes } = useRecipes();

  const onCopy = (recipe) => {
    if (!recipe) {
      alert('No recipe to copy!');
      return;
    }

    const recipeText = `
      Title: ${recipe.title}
      Ingredients: ${recipe.ingredients.join(', ')}
      Instructions: ${recipe.instructions.join('\n')}
      Cooking Time: ${recipe.cookingTime}
      Difficulty: ${recipe.difficulty}
    `;

    navigator.clipboard.writeText(recipeText)
      .then(() => alert('Recipe copied to clipboard!'))
      .catch((error) => {
        console.error('Failed to copy recipe:', error);
        alert('Failed to copy recipe. Please try again.');
      });
  };

  const handleGenerateRecipe = async (ingredients) => {
    if (!ingredients || ingredients.length === 0) {
      alert('No ingredients provided to generate a recipe!');
      return;
    }

    try {
      const newRecipe = await generateRecipe(ingredients, 'healthy');
      const parsedRecipe = parseAndSanitizeRecipe(newRecipe);
      setRecipes((prevRecipes) => [...prevRecipes, parsedRecipe]);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      alert('Failed to generate a new recipe. Please try again.');
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        borderRadius: 4,
        boxShadow: 3,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Uncomment the CardMedia below if you want to display an image */}
      {/*
      <CardMedia
        component="img"
        height="200"
        image={recipe.image || 'https://via.placeholder.com/400'}
        alt={recipe.title || 'Recipe Image'}
        sx={{ borderRadius: 2, mb: 2 }}
      />
      */}

      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {recipe.title || 'Untitled Recipe'}
        </Typography>

        <Stack direction="row" spacing={1} mb={2}>
          <Chip
            icon={<AccessTime />}
            label={`${recipe.cookingTime || 'N/A'} min`}
            size="small"
            color="primary"
          />
          <Chip
            icon={<Restaurant />}
            label={recipe.difficulty || 'Unknown'}
            size="small"
            color="secondary"
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" mb={2}>
          <strong>Ingredients:</strong> {recipe.ingredients?.join(', ') || 'No ingredients provided'}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          <strong>Instructions:</strong>
          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
            {recipe.instructions.length > 0 ? (
              recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No instructions provided</Typography>
            )}
          </Box>
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ContentCopy />}
            onClick={() => onCopy(recipe)}
            fullWidth
          >
            Copy Recipe
          </Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => handleGenerateRecipe(recipe?.ingredients)}
            fullWidth
          >
            Get Another
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;