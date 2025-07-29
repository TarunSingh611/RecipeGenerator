import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, Alert, Snackbar } from '@mui/material';
import { theme } from './styles/theme';
import { RecipeProvider, useRecipes } from './context/RecipeContext';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import RecipeList from './components/RecipeList';
import BottomNav from './components/BottomNav';

// Main App Content Component
const AppContent = () => {
  const { error, setError, themeMode } = useRecipes();

  const handleCloseError = () => {
    setError(null);
  };

  // Create theme with current mode
  const currentTheme = React.useMemo(() => {
    return {
      ...theme,
      palette: {
        ...theme.palette,
        mode: themeMode,
      },
    };
  }, [themeMode]);

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        background: themeMode === 'dark' 
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        pb: { xs: 8, sm: 0 } // Add padding bottom for mobile to account for bottom nav
      }}>
        <Navbar />

        <Container
          maxWidth="xl"
          sx={{
            pt: { xs: 2, sm: 3 },
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <SearchBar />
          <RecipeList />
        </Container>

        <BottomNav />

        {/* Global Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseError}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

// Main App Component
function App() {
  return (
    <RecipeProvider>
      <AppContent />
    </RecipeProvider>
  );
}

export default App;