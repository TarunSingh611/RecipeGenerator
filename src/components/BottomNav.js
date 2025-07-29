import React from 'react';
import {
  Paper,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
} from '@mui/material';
import {
  Restaurant,
} from '@mui/icons-material';
import { useRecipes } from '../context/RecipeContext';

const BottomNav = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { recipes } = useRecipes();

  if (!isMobile) return null;

  const getStats = () => {
    const totalRecipes = recipes.length;
    const quickRecipes = recipes.filter(r => r.cookingTime <= 30).length;
    
    return { totalRecipes, quickRecipes };
  };

  const stats = getStats();

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: 0,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        borderTop: '1px solid',
        borderColor: 'divider',
        background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
      }}
      elevation={8}
    >
      {/* Quick Stats Bar */}
      {stats.totalRecipes > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)' 
              : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Restaurant sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {stats.totalRecipes} recipes
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: 'success.main',
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {stats.quickRecipes} quick
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default BottomNav;