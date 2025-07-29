import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add,
  Clear,
  Restaurant,
  Delete,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useRecipes } from '../context/RecipeContext';
import { generateRecipe } from '../services/RecipeService';

const SearchBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addRecipe, setLoading, setError } = useRecipes();
  
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [cookingTime, setCookingTime] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setLocalError] = useState('');

  const suggestions = [
    'chicken', 'beef', 'pork', 'fish', 'shrimp', 'eggs', 'milk', 'cheese',
    'tomatoes', 'onions', 'garlic', 'potatoes', 'carrots', 'broccoli',
    'rice', 'pasta', 'bread', 'flour', 'sugar', 'butter', 'olive oil'
  ];

  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim().toLowerCase())) {
      setIngredients([...ingredients, currentIngredient.trim().toLowerCase()]);
      setCurrentIngredient('');
      setLocalError('');
    }
  };

  const handleDeleteIngredient = (ingredientToDelete) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToDelete));
  };

  const handleSuggestionClick = (suggestion) => {
    if (!ingredients.includes(suggestion)) {
      setIngredients([...ingredients, suggestion]);
    }
  };

  const handleClearAll = () => {
    setIngredients([]);
    setCurrentIngredient('');
    setDietaryPreference('all');
    setDifficulty('all');
    setCookingTime('all');
    setLocalError('');
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setLocalError('Please add at least one ingredient');
      return;
    }

    setLoading(true);
    setLocalError('');

    try {
      // Create preferences object with all advanced options
      const preferences = {
        dietary: dietaryPreference,
        difficulty: difficulty,
        cookingTime: cookingTime,
      };

      console.log('Generating recipe with preferences:', preferences);
      console.log('Ingredients:', ingredients);

      const recipe = await generateRecipe(ingredients, preferences);
      console.log('Recipe:', recipe);
      addRecipe(recipe);
      // Removed handleClearAll() to prevent form reset
    } catch (err) {
      console.error('Recipe generation error:', err);
      setLocalError(err.message || 'Failed to generate recipe');
      setError(err.message || 'Failed to generate recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddIngredient();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: `1px solid ${theme.palette.mode === 'dark' ? '#404040' : '#e0e0e0'}`,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
          textAlign: 'center',
        }}
      >
        Generate AI Recipe
      </Typography>

      {/* Ingredients Input */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
          }}
        >
          Ingredients
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add an ingredient..."
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#ffffff',
                '& fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? '#606060' : '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? '#808080' : '#bdbdbd',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputBase-input': {
                color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
              },
              '& .MuiInputBase-input::placeholder': {
                color: theme.palette.mode === 'dark' ? '#b0b0b0' : '#757575',
                opacity: 1,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddIngredient}
            sx={{
              minWidth: 'auto',
              px: 2,
              backgroundColor: theme.palette.mode === 'dark' ? '#4CAF50' : 'primary.main',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#45a049' : 'primary.dark',
              },
            }}
          >
            <Add />
          </Button>
        </Box>

        {/* Ingredients Chips */}
        {ingredients.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {ingredients.map((ingredient, index) => (
                <Chip
                  key={index}
                  label={ingredient}
                  onDelete={() => handleDeleteIngredient(ingredient)}
                  deleteIcon={<Delete />}
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#e3f2fd',
                    color: theme.palette.mode === 'dark' ? '#ffffff' : 'primary.main',
                    '& .MuiChip-deleteIcon': {
                      color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'primary.main',
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Suggestions */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary',
            }}
          >
            Quick suggestions:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {suggestions.slice(0, 8).map((suggestion) => (
              <Chip
                key={suggestion}
                label={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: theme.palette.mode === 'dark' ? '#606060' : '#e0e0e0',
                  color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#f5f5f5',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Advanced Options */}
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          endIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
          sx={{
            color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
            mb: showAdvanced ? 2 : 0,
          }}
        >
          Advanced Options
        </Button>

        <Collapse in={showAdvanced}>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary' }}>
                Dietary Preference
              </InputLabel>
              <Select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.mode === 'dark' ? '#606060' : '#e0e0e0',
                  },
                  '& .MuiSelect-icon': {
                    color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary',
                  },
                }}
              >
                <MenuItem value="all">Any Diet</MenuItem>
                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                <MenuItem value="vegan">Vegan</MenuItem>
                <MenuItem value="gluten-free">Gluten-Free</MenuItem>
                <MenuItem value="low-carb">Low-Carb</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary' }}>
                Difficulty Level
              </InputLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.mode === 'dark' ? '#606060' : '#e0e0e0',
                  },
                  '& .MuiSelect-icon': {
                    color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary',
                  },
                }}
              >
                <MenuItem value="all">Any Difficulty</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary' }}>
                Cooking Time
              </InputLabel>
              <Select
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.mode === 'dark' ? '#606060' : '#e0e0e0',
                  },
                  '& .MuiSelect-icon': {
                    color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary',
                  },
                }}
              >
                <MenuItem value="all">Any Time</MenuItem>
                <MenuItem value="quick">Quick (≤30 min)</MenuItem>
                <MenuItem value="medium">Medium (30-60 min)</MenuItem>
                <MenuItem value="long">Long (>60 min)</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Collapse>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setLocalError('')}
        >
          {error}
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={handleClearAll}
          startIcon={<Clear />}
          sx={{
            borderColor: theme.palette.mode === 'dark' ? '#606060' : '#e0e0e0',
            color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
            '&:hover': {
              borderColor: theme.palette.mode === 'dark' ? '#808080' : '#bdbdbd',
              backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#f5f5f5',
            },
          }}
        >
          Clear All
        </Button>
        
        <Button
          variant="contained"
          onClick={handleGenerateRecipe}
          startIcon={<Restaurant />}
          size="large"
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#4CAF50' : 'primary.main',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#45a049' : 'primary.dark',
            },
          }}
        >
          Generate Recipe
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchBar;