import React from 'react';

export const parseAndSanitizeRecipe = (recipeString) => {
  if (!recipeString || typeof recipeString !== 'string') {
    throw new Error('Invalid recipe string provided');
  }

  // Check for numbered section format (0: title, 1: ingredients, 2: instructions, etc.)
  const numberedSectionPattern = /(\d+)\s*:\s*"([^"]+)"/g;
  const numberedMatches = [...recipeString.matchAll(numberedSectionPattern)];
  
  if (numberedMatches.length >= 3) {
    // Sort by section number
    numberedMatches.sort((a, b) => parseInt(a[1]) - parseInt(b[1]));
    
    const recipe = {
      title: '',
      ingredients: [],
      instructions: [],
      cookingTime: 30,
      imageUrl: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop',
      difficulty: 'medium',
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    let currentSection = '';
    
    for (const match of numberedMatches) {
      const sectionNumber = parseInt(match[1]);
      const content = match[2].trim();
      
      // Determine section based on content and position
      if (sectionNumber === 0 || (!currentSection && content.length > 0 && !content.toLowerCase().includes('ingredient'))) {
        recipe.title = cleanText(content);
        currentSection = 'title';
      } else if (content.toLowerCase().includes('ingredient') || currentSection === 'ingredients') {
        currentSection = 'ingredients';
        if (!content.toLowerCase().includes('ingredient')) {
          const ingredients = parseIngredients(content);
          recipe.ingredients.push(...ingredients);
        }
      } else if (content.toLowerCase().includes('instruction') || currentSection === 'instructions') {
        currentSection = 'instructions';
        if (!content.toLowerCase().includes('instruction')) {
          const instructions = parseInstructions(content);
          recipe.instructions.push(...instructions);
        }
      } else if (content.toLowerCase().includes('time') || content.toLowerCase().includes('cooking')) {
        const time = parseCookingTime(content);
        if (time > 0) recipe.cookingTime = time;
      } else if (content.toLowerCase().includes('difficulty') || content.toLowerCase().includes('level')) {
        const difficulty = parseDifficulty(content);
        if (difficulty) recipe.difficulty = difficulty;
      } else if (content.toLowerCase().includes('image') || content.toLowerCase().includes('url')) {
        const imageUrl = parseImageUrl(content);
        if (imageUrl) recipe.imageUrl = imageUrl;
      } else if (currentSection === 'ingredients') {
        const ingredients = parseIngredients(content);
        recipe.ingredients.push(...ingredients);
      } else if (currentSection === 'instructions') {
        const instructions = parseInstructions(content);
        recipe.instructions.push(...instructions);
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

    // More precise section detection - look for section headers specifically
    const lowerSection = trimmedSection.toLowerCase();
    
    // Check if this is a section header (starts with ** or contains specific patterns)
    const isSectionHeader = trimmedSection.startsWith('**') || 
                           /^(ingredients|instructions|directions|steps|method|time|duration|difficulty|level|image|photo|picture):/i.test(trimmedSection);
    
    if (isSectionHeader) {
      if (lowerSection.includes('ingredient')) {
        currentSection = 'ingredients';
        continue;
      } else if (lowerSection.includes('instruction') || 
                 lowerSection.includes('direction') ||
                 lowerSection.includes('step') ||
                 lowerSection.includes('method')) {
        currentSection = 'instructions';
        continue;
      } else if (lowerSection.includes('time') || 
                 lowerSection.includes('duration') ||
                 lowerSection.includes('minutes') ||
                 lowerSection.includes('mins')) {
        currentSection = 'time';
        continue;
      } else if (lowerSection.includes('difficulty') || 
                 lowerSection.includes('level')) {
        currentSection = 'difficulty';
        continue;
      } else if (lowerSection.includes('image') || 
                 lowerSection.includes('photo') ||
                 lowerSection.includes('picture')) {
        currentSection = 'image';
        continue;
      }
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
  
  // Split by bullet points, asterisks, or other common separators
  const parts = text.split(/[*•\n]/);
  
  for (const part of parts) {
    const cleaned = cleanText(part);
    // Remove any leading/trailing asterisks and clean up
    const cleanedIngredient = cleaned.replace(/^\*+\s*/, '').replace(/\*+$/, '').trim();
    if (cleanedIngredient && cleanedIngredient.length > 2) {
      ingredients.push(cleanedIngredient);
    }
  }
  
  return ingredients;
};

const parseInstructions = (text) => {
  const instructions = [];
  
  // Handle numbered instructions (1. 2. 3. etc.)
  const numberedPattern = /(\d+)\.\s*(.+?)(?=\d+\.|$)/gs;
  const numberedMatches = [...text.matchAll(numberedPattern)];
  
  if (numberedMatches.length > 0) {
    // Sort by the number to ensure correct order
    numberedMatches.sort((a, b) => parseInt(a[1]) - parseInt(b[1]));
    
    for (const match of numberedMatches) {
      const instruction = cleanText(match[2]);
      if (instruction && instruction.length > 5) {
        instructions.push(instruction);
      }
    }
  } else {
    // Fallback: Split by common separators and clean up
    const parts = text.split(/(?:\n|\.\s+|;\s+)/);
    
    for (const part of parts) {
      const cleaned = cleanText(part);
      // Remove any leading numbers and clean up
      const cleanedInstruction = cleaned.replace(/^\d+\.?\s*/, '').trim();
      if (cleanedInstruction && cleanedInstruction.length > 10) {
        instructions.push(cleanedInstruction);
      }
    }
  }
  
  return instructions;
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
