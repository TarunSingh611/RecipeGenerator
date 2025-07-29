import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Restaurant,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useRecipes } from '../context/RecipeContext';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { themeMode, toggleTheme } = useRecipes();

  return (
    <AppBar
      position="static"
      sx={{
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: { xs: 0, sm: '0 0 16px 16px' },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          py: { xs: 1, sm: 1.5 },
        }}
      >
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Restaurant
            sx={{
              fontSize: { xs: 28, sm: 32 },
              color: 'white',
            }}
          />
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            CookSmart AI
          </Typography>
        </Box>

        {/* Theme Toggle */}
        <IconButton
          onClick={toggleTheme}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;