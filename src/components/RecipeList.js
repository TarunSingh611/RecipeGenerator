import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Clear,
  Sort,
  FilterList,
  Restaurant,
  Timer,
  TrendingUp,
} from '@mui/icons-material';
import { useRecipes } from '../context/RecipeContext';
import RecipeCard from './RecipeCard';

const RecipeList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    recipes,
    loading,
    filteredRecipes,
    searchQuery,
    filterOptions,
    setSearchQuery,
    updateFilterOptions,
    clearSearchAndFilters,
  } = useRecipes();

  const [sortBy, setSortBy] = useState('newest');

  const getStats = () => {
    const totalRecipes = recipes.length;
    const quickRecipes = recipes.filter(r => r.cookingTime <= 30).length;
    const mediumRecipes = recipes.filter(r => r.cookingTime > 30 && r.cookingTime <= 60).length;
    const longRecipes = recipes.filter(r => r.cookingTime > 60).length;
    
    return { totalRecipes, quickRecipes, mediumRecipes, longRecipes };
  };

  const stats = getStats();

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const getSortedRecipes = () => {
    const sorted = [...filteredRecipes];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'time':
        return sorted.sort((a, b) => parseInt(a.cookingTime) - parseInt(b.cookingTime));
      default:
        return sorted;
    }
  };

  const sortedRecipes = getSortedRecipes();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Generating your recipe...
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
          This may take a few moments
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Stats */}
      {recipes.length > 0 && (
        <Box
          sx={{
            mb: 3,
            p: 3,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: 3,
            border: `1px solid ${theme.palette.mode === 'dark' ? '#404040' : '#e0e0e0'}`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
              }}
            >
              Recipe Collection
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<Restaurant />}
                label={`${stats.totalRecipes} total`}
                color="primary"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.mode === 'dark' ? '#606060' : '#e0e0e0',
                  color: theme.palette.mode === 'dark' ? '#ffffff' : 'primary.main',
                }}
              />
              <Chip
                icon={<Timer />}
                label={`${stats.quickRecipes} quick`}
                color="success"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.mode === 'dark' ? '#606060' : '#e0e0e0',
                  color: theme.palette.mode === 'dark' ? '#ffffff' : 'success.main',
                }}
              />
            </Box>
          </Box>

          {/* Search and Filter Controls */}
          <Stack spacing={2}>
            {/* Search Bar */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search recipes by title or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    sx={{ color: 'text.secondary' }}
                  >
                    <Clear />
                  </IconButton>
                ),
              }}
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

            {/* Filter Controls */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary' }}>
                  Difficulty
                </InputLabel>
                <Select
                  value={filterOptions.difficulty}
                  onChange={(e) => updateFilterOptions({ difficulty: e.target.value })}
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
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary' }}>
                  Time
                </InputLabel>
                <Select
                  value={filterOptions.cookingTime}
                  onChange={(e) => updateFilterOptions({ cookingTime: e.target.value })}
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
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="quick">Quick</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="long">Long</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: theme.palette.mode === 'dark' ? '#b0b0b0' : 'text.secondary' }}>
                  Sort By
                </InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
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
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="time">Cooking Time</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                onClick={clearSearchAndFilters}
                startIcon={<Clear />}
                size="small"
                sx={{
                  borderColor: theme.palette.mode === 'dark' ? '#606060' : '#e0e0e0',
                  color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
                  '&:hover': {
                    borderColor: theme.palette.mode === 'dark' ? '#808080' : '#bdbdbd',
                    backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#f5f5f5',
                  },
                }}
              >
                Clear
              </Button>
            </Box>
          </Stack>
        </Box>
      )}

      {/* Recipe Grid */}
      {sortedRecipes.length > 0 ? (
        <Grid container spacing={3}>
          {sortedRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      ) : recipes.length > 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
          }}
        >
          <Search sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            No recipes found
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
          }}
        >
          <Restaurant sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            No recipes yet
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Generate your first recipe using the search bar above
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RecipeList;  