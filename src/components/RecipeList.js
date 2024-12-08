import React from 'react';  
import { Grid, CircularProgress, Box, Typography } from '@mui/material';  
import { useRecipes } from '../context/RecipeContext';  
import RecipeCard from './RecipeCard';  

const RecipeList = () => {  
  const { recipes, loading} = useRecipes(); // Assuming `fetchNewRecipe` is provided by the context  

  if (loading) {  
    return (  
      <Box  
        sx={{  
          display: 'flex',  
          justifyContent: 'center',  
          alignItems: 'center',  
          minHeight: '200px',  
        }}  
      >  
        <CircularProgress />  
      </Box>  
    );  
  }  

  if (recipes.length === 0) {  
    return (  
      <Box  
        sx={{  
          display: 'flex',  
          justifyContent: 'center',  
          alignItems: 'center',  
          minHeight: '200px',  
        }}  
      >  
        <Typography variant="h6" color="text.secondary">  
          Add ingredients and generate your first recipe!  
        </Typography>  
      </Box>  
    );  
  }  

  return (  
    <Grid container spacing={3} sx={{ mt: 2 }}>  
      {recipes.map((recipe, index) => (  
        <Grid item xs={12} sm={6} md={4} key={index}>  
          <RecipeCard  
            recipe={recipe}  
          />  
        </Grid>  
      ))}  
    </Grid>  
  );  
};  

export default RecipeList;  