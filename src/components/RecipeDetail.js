import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
} from '@mui/material';
import { AccessTime, Restaurant } from '@mui/icons-material';

const RecipeDetail = ({ recipe, open, onClose }) => {
  if (!recipe) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {recipe.title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <Chip
            icon={<AccessTime />}
            label={`${recipe.cookingTime} mins`}
          />
          <Chip
            icon={<Restaurant />}
            label={recipe.difficulty}
          />
        </Box>

        <Typography variant="h6" gutterBottom>
          Ingredients:
        </Typography>
        <List>
          {recipe.ingredients.map((ingredient, index) => (
            <ListItem key={index}>
              <ListItemText primary={ingredient} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" gutterBottom>
          Instructions:
        </Typography>
        <List>
          {recipe.instructions.map((step, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Step ${index + 1}`}
                secondary={step}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeDetail;