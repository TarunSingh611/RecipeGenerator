import React, { createContext, useContext, useState, useMemo } from 'react';
import { generateRecipe } from '../services/RecipeService';

const RecipeContext = createContext();

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    difficulty: 'all',
    cookingTime: 'all',
  });
  const [themeMode, setThemeMode] = useState('light');

  // Memoized filtered recipes
  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(query)
        )
      );
    }

    // Apply difficulty filter
    if (filterOptions.difficulty !== 'all') {
      filtered = filtered.filter(recipe =>
        recipe.difficulty === filterOptions.difficulty
      );
    }

    // Apply cooking time filter
    if (filterOptions.cookingTime !== 'all') {
      filtered = filtered.filter(recipe => {
        const time = parseInt(recipe.cookingTime);
        switch (filterOptions.cookingTime) {
          case 'quick':
            return time <= 30;
          case 'medium':
            return time > 30 && time <= 60;
          case 'long':
            return time > 60;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [recipes, searchQuery, filterOptions]);

  const addRecipe = (recipe) => {
    setRecipes(prev => [recipe, ...prev]);
  };

  const updateRecipe = (id, updatedRecipe) => {
    setRecipes(prev => prev.map(recipe =>
      recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe
    ));
  };

  const deleteRecipe = (id) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  const clearRecipes = () => {
    setRecipes([]);
  };

  const clearSearchAndFilters = () => {
    setSearchQuery('');
    setFilterOptions({
      difficulty: 'all',
      cookingTime: 'all',
    });
  };

  const updateFilterOptions = (newOptions) => {
    setFilterOptions(prev => ({ ...prev, ...newOptions }));
  };

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    recipes,
    loading,
    error,
    searchQuery,
    filterOptions,
    filteredRecipes,
    themeMode,
    setRecipes,
    setLoading,
    setError,
    setSearchQuery,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    clearRecipes,
    clearSearchAndFilters,
    updateFilterOptions,
    toggleTheme,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};