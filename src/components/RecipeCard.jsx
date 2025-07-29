import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Timer,
  TrendingUp,
  Share,
  ContentCopy,
  Delete,
  ExpandMore,
  ExpandLess,
  Restaurant,
  Refresh,
} from '@mui/icons-material';
import { useRecipes } from '../context/RecipeContext';
import { generateRecipe } from '../services/RecipeService';

const RecipeCard = ({ recipe }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { deleteRecipe, addRecipe, setLoading, setError } = useRecipes();
  
  const [expanded, setExpanded] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setLocalError] = useState('');

  // Add null checks and default values
  if (!recipe) {
    return (
      <Card sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Recipe not found
        </Typography>
      </Card>
    );
  }

  // Ensure all required properties exist with defaults
  const safeRecipe = {
    id: recipe.id || Date.now().toString(),
    title: recipe.title || 'Untitled Recipe',
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    cookingTime: recipe.cookingTime || 30,
    difficulty: recipe.difficulty || 'medium',
    imageUrl: recipe.imageUrl || '',
    createdAt: recipe.createdAt || new Date().toISOString(),
  };

  const handleCopy = async () => {
    try {
      const recipeText = `
${safeRecipe.title}

Ingredients:
${safeRecipe.ingredients.map(ingredient => `• ${ingredient}`).join('\n')}

Instructions:
${safeRecipe.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

Cooking Time: ${safeRecipe.cookingTime} minutes
Difficulty: ${safeRecipe.difficulty}
      `.trim();

      await navigator.clipboard.writeText(recipeText);
      setShowShareDialog(false);
    } catch (err) {
      setLocalError('Failed to copy recipe');
    }
  };

  const handleGenerateSimilar = async () => {
    setIsGenerating(true);
    setLocalError('');

    try {
      const similarRecipe = await generateRecipe(safeRecipe.ingredients, {
        dietary: 'all',
        difficulty: safeRecipe.difficulty,
        cookingTime: safeRecipe.cookingTime,
      });
      
      addRecipe(similarRecipe);
      setShowShareDialog(false);
    } catch (err) {
      setLocalError(err.message || 'Failed to generate similar recipe');
      setError(err.message || 'Failed to generate similar recipe');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = () => {
    deleteRecipe(safeRecipe.id);
    setShowDeleteDialog(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTimeColor = (time) => {
    const minutes = parseInt(time);
    if (minutes <= 30) return 'success';
    if (minutes <= 60) return 'warning';
    return 'error';
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: `1px solid ${theme.palette.mode === 'dark' ? '#404040' : '#e0e0e0'}`,
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 8px 25px rgba(0,0,0,0.3)'
              : '0 8px 25px rgba(0,0,0,0.15)',
          },
        }}
      >
        {/* Recipe Image with Action Buttons Overlay */}
        {safeRecipe.imageUrl && (
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image={safeRecipe.imageUrl}
              alt={safeRecipe.title}
              sx={{
                objectFit: 'cover',
                borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#404040' : '#e0e0e0'}`,
              }}
            />
            
            {/* Action Buttons Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 1,
                zIndex: 10,
              }}
            >
              <Tooltip title="Share Recipe">
                <IconButton
                  size="small"
                  onClick={() => setShowShareDialog(true)}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <Share fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Delete Recipe">
                <IconButton
                  size="small"
                  onClick={() => setShowDeleteDialog(true)}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        <CardContent 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            maxHeight: '400px',
            overflow: 'hidden',
          }}
        >
          {/* Recipe Title */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
              lineHeight: 1.3,
            }}
          >
            {safeRecipe.title}
          </Typography>

          {/* Recipe Stats */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<Timer />}
              label={`${safeRecipe.cookingTime} min`}
              color={getTimeColor(safeRecipe.cookingTime)}
              size="small"
              variant="outlined"
              sx={{
                borderColor: theme.palette.mode === 'dark' ? '#606060' : '#e0e0e0',
              }}
            />
            <Chip
              icon={<TrendingUp />}
              label={safeRecipe.difficulty}
              color={getDifficultyColor(safeRecipe.difficulty)}
              size="small"
              variant="outlined"
              sx={{
                borderColor: theme.palette.mode === 'dark' ? '#606060' : '#e0e0e0',
              }}
            />
          </Box>

          {/* Scrollable Content Area */}
          <Box 
            sx={{ 
              flexGrow: 1,
              overflow: 'auto',
              mb: 2,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: theme.palette.mode === 'dark' ? '#404040' : '#f1f1f1',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.palette.mode === 'dark' ? '#606060' : '#c1c1c1',
                borderRadius: '3px',
                '&:hover': {
                  background: theme.palette.mode === 'dark' ? '#808080' : '#a8a8a8',
                },
              },
            }}
          >
            {/* Ingredients Preview */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
                }}
              >
                Ingredients ({safeRecipe.ingredients.length})
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary',
                  lineHeight: 1.4,
                }}
              >
                {safeRecipe.ingredients.join(', ')}
              </Typography>
            </Box>

            {/* Instructions Preview */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
                }}
              >
                Instructions ({safeRecipe.instructions.length} steps)
              </Typography>
              <Box component="ol" sx={{ pl: 2, m: 0 }}>
                {safeRecipe.instructions.map((instruction, index) => (
                  <Typography
                    key={index}
                    component="li"
                    variant="body2"
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary',
                      lineHeight: 1.4,
                      mb: 0.5,
                    }}
                  >
                    {instruction}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary' }}>
          Share Recipe
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body2" sx={{ mb: 2, color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary' }}>
            Choose an action for "{safeRecipe.title}"
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowShareDialog(false)}
            sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCopy}
            startIcon={<ContentCopy />}
            variant="outlined"
            sx={{
              borderColor: theme.palette.mode === 'dark' ? '#606060' : '#e0e0e0',
              color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
            }}
          >
            Copy Recipe
          </Button>
          <Button
            onClick={handleGenerateSimilar}
            startIcon={isGenerating ? <Refresh /> : <Restaurant />}
            variant="contained"
            disabled={isGenerating}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#4CAF50' : 'primary.main',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#45a049' : 'primary.dark',
              },
            }}
          >
            {isGenerating ? 'Generating...' : 'Generate Similar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary' }}>
          Delete Recipe
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary' }}>
            Are you sure you want to delete "{safeRecipe.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RecipeCard;