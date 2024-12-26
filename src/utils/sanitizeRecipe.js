// Function to parse and sanitize the semicolon-separated recipe string  
export const parseAndSanitizeRecipe = (recipeString) => {  
    
    // Split the input string by semicolon and trim each field  
    const fields = recipeString.split(';').map((field) => field.trim());  
    
    // Map the fields to their respective keys with default values  
    const parsedRecipe = {  
        title: fields[0] || 'Untitled Recipe',  
        ingredients: fields[1]?.split(',').map((item) => item.trim()) || [], // Ingredients are comma-separated  
        instructions: fields[2]?.split(',').map((step) => step.trim()) || ['No instructions provided'],  
        cookingTime: fields[3] || 'N/A',  
        image: fields[4].slice(fields[4].indexOf(' ') + 1) || 'https://via.placeholder.com/400', // Default placeholder image if none is provided  
        difficulty: fields[5] || 'Unknown', // Default difficulty if not specified  
    };  
    // console.log(fields);
    // console.log(parsedRecipe);
    
    // Sanitize the parsed recipe to ensure clean and valid output  
    return {  
        title: parsedRecipe.title,  
        ingredients: Array.isArray(parsedRecipe.ingredients)  
            ? parsedRecipe.ingredients.filter((ingredient) => ingredient)  
            : [],  
        instructions: Array.isArray(parsedRecipe.instructions)  
            ? parsedRecipe.instructions.filter((step) => step)  
            : ['No instructions provided'],  
        cookingTime: parsedRecipe.cookingTime.trim(),  
        image: parsedRecipe.image.trim(),  
        difficulty: parsedRecipe.difficulty.trim(),  
    };  
};
