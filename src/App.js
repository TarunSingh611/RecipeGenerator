import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import { theme } from './styles/theme';
import { RecipeProvider } from './context/RecipeContext';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import RecipeList from './components/RecipeList';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RecipeProvider>
        <Box sx={{ pb: { xs: 7, sm: 0 } }}>
          <Navbar />
          <Container maxWidth="lg">
            <SearchBar />
            <RecipeList />
          </Container>
          <BottomNav />
        </Box>
      </RecipeProvider>
    </ThemeProvider>
  );
}

export default App;