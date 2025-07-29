import React from 'react';

export const parseAndSanitizeRecipe = (recipeString) => {
  if (!recipeString || typeof recipeString !== 'string') {
    throw new Error('Invalid recipe string provided');
  }

  // First, try to parse as semicolon-separated format (API response)
  const parts = recipeString.split(';').map(part => part.trim()).filter(part => part.length > 0);
  
  if (parts.length >= 6) {
    // API format: title; ingredients; instructions; cookingTime; imageUrl; difficulty
    const recipe = {
      title: cleanText(parts[0]),
      ingredients: parseIngredients(parts[1]),
      instructions: parseInstructions(parts[2]),
      cookingTime: parseInt(parts[3]) || 30,
      imageUrl: parseImageUrl(parts[4]),
      difficulty: parseDifficulty(parts[5]),
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    // Validate and set defaults
    if (!recipe.title) recipe.title = 'Delicious Recipe';
    if (recipe.ingredients.length === 0) recipe.ingredients = ['Ingredients not specified'];
    if (recipe.instructions.length === 0) recipe.instructions = ['Instructions not specified'];
    if (recipe.cookingTime === 0) recipe.cookingTime = 30;
    if (!recipe.difficulty) recipe.difficulty = 'medium';
    if (!recipe.imageUrl) {
      recipe.imageUrl = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop';
    }

    return recipe;
  }

  // Fallback to the original parsing method for other formats
  const sections = recipeString.split(/\n+/).filter(section => section.trim());

  // Initialize recipe object
  const recipe = {
    title: '',
    ingredients: [],
    instructions: [],
    cookingTime: 0,
    imageUrl: '',
    difficulty: 'medium',
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  let currentSection = '';

  for (const section of sections) {
    const trimmedSection = section.trim();
    if (!trimmedSection) continue;

    // Detect section type based on keywords
    if (trimmedSection.toLowerCase().includes('ingredients') || 
        trimmedSection.toLowerCase().includes('ingredient')) {
      currentSection = 'ingredients';
      continue;
    } else if (trimmedSection.toLowerCase().includes('instructions') || 
               trimmedSection.toLowerCase().includes('directions') ||
               trimmedSection.toLowerCase().includes('steps') ||
               trimmedSection.toLowerCase().includes('method')) {
      currentSection = 'instructions';
      continue;
    } else if (trimmedSection.toLowerCase().includes('time') || 
               trimmedSection.toLowerCase().includes('duration') ||
               trimmedSection.toLowerCase().includes('minutes') ||
               trimmedSection.toLowerCase().includes('mins')) {
      currentSection = 'time';
      continue;
    } else if (trimmedSection.toLowerCase().includes('difficulty') || 
               trimmedSection.toLowerCase().includes('level')) {
      currentSection = 'difficulty';
      continue;
    } else if (trimmedSection.toLowerCase().includes('image') || 
               trimmedSection.toLowerCase().includes('photo') ||
               trimmedSection.toLowerCase().includes('picture')) {
      currentSection = 'image';
      continue;
    }

    // Parse based on current section
    switch (currentSection) {
      case 'ingredients':
        const ingredients = parseIngredients(trimmedSection);
        recipe.ingredients.push(...ingredients);
        break;
      case 'instructions':
        const instructions = parseInstructions(trimmedSection);
        recipe.instructions.push(...instructions);
        break;
      case 'time':
        const time = parseCookingTime(trimmedSection);
        if (time > 0) recipe.cookingTime = time;
        break;
      case 'difficulty':
        const difficulty = parseDifficulty(trimmedSection);
        if (difficulty) recipe.difficulty = difficulty;
        break;
      case 'image':
        const imageUrl = parseImageUrl(trimmedSection);
        if (imageUrl) recipe.imageUrl = imageUrl;
        break;
      default:
        // If no section is identified, try to parse as title
        if (!recipe.title && trimmedSection.length > 0) {
          recipe.title = cleanText(trimmedSection);
        }
        break;
    }
  }

  // If no title was found, try to extract from the beginning
  if (!recipe.title && sections.length > 0) {
    const firstSection = sections[0].trim();
    if (firstSection && !firstSection.toLowerCase().includes('ingredient') && 
        !firstSection.toLowerCase().includes('instruction')) {
      recipe.title = cleanText(firstSection);
    }
  }

  // Validate and set defaults
  if (!recipe.title) recipe.title = 'Delicious Recipe';
  if (recipe.ingredients.length === 0) recipe.ingredients = ['Ingredients not specified'];
  if (recipe.instructions.length === 0) recipe.instructions = ['Instructions not specified'];
  if (recipe.cookingTime === 0) recipe.cookingTime = 30;
  if (!recipe.difficulty) recipe.difficulty = 'medium';
  if (!recipe.imageUrl) {
    recipe.imageUrl = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop';
  }

  return recipe;
};

const cleanText = (text) => {
  return text
    .replace(/[^\w\s\-.,!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const parseIngredients = (text) => {
  const ingredients = [];
  
  // Split by common separators
  const parts = text.split(/[,;•]/);
  
  for (const part of parts) {
    const cleaned = cleanText(part);
    if (cleaned && cleaned.length > 2) {
      ingredients.push(cleaned);
    }
  }
  
  return ingredients;
};

const parseInstructions = (text) => {
  const instructions = [];
  
  // Split by numbers followed by periods or dots, or by new lines
  const parts = text.split(/(?:\d+\.|\n|\.\s+)/);
  
  for (const part of parts) {
    const cleaned = cleanText(part);
    if (cleaned && cleaned.length > 10) {
      // Add proper numbering starting from 1
      instructions.push(cleaned);
    }
  }
  
  // If no instructions were parsed, try a different approach
  if (instructions.length === 0) {
    // Split by common instruction separators
    const altParts = text.split(/(?:\.\s+|;\s+|,\s+)/);
    for (const part of altParts) {
      const cleaned = cleanText(part);
      if (cleaned && cleaned.length > 10) {
        instructions.push(cleaned);
      }
    }
  }
  
  // Ensure proper numbering starting from 1
  return instructions.map((instruction, index) => {
    // Remove any existing numbers at the beginning
    const cleanedInstruction = instruction.replace(/^\d+\.?\s*/, '');
    return cleanedInstruction;
  });
};

const parseCookingTime = (text) => {
  const timeMatch = text.match(/(\d+)\s*(?:minutes?|mins?|min)/i);
  if (timeMatch) {
    return parseInt(timeMatch[1]);
  }
  
  // Look for just numbers
  const numberMatch = text.match(/(\d+)/);
  if (numberMatch) {
    const time = parseInt(numberMatch[1]);
    return time > 0 && time < 300 ? time : 30; // Reasonable range
  }
  
  return 30; // Default
};

const parseDifficulty = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('easy')) return 'easy';
  if (lowerText.includes('medium')) return 'medium';
  if (lowerText.includes('hard') || lowerText.includes('difficult')) return 'hard';
  return 'medium'; // Default
};

const parseImageUrl = (text) => {
  // Look for URLs
  const urlMatch = text.match(/https?:\/\/[^\s]+/i);
  if (urlMatch) {
    const url = urlMatch[0];
    // Validate that it's a proper image URL
    if (url.includes('unsplash.com') || url.includes('pexels.com') || url.includes('pixabay.com')) {
      return url;
    }
  }
  
  // Look for image hosting patterns
  const imagePatterns = [
    /unsplash\.com\/[^\s]+/i,
    /pexels\.com\/[^\s]+/i,
    /pixabay\.com\/[^\s]+/i,
    /images\.unsplash\.com\/[^\s]+/i
  ];
  
  for (const pattern of imagePatterns) {
    const match = text.match(pattern);
    if (match) {
      return `https://${match[0]}`;
    }
  }
  
  // Return a reliable fallback image based on the recipe type
  return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop';
};
