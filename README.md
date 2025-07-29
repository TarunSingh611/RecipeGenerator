# CookSmart AI Recipe Generator

A professional, responsive React application that generates delicious recipes using AI. Built with modern React principles, Material-UI, and Google's Gemini AI API.

## 🚀 Features

### Core Functionality
- **AI-Powered Recipe Generation**: Create unique recipes from any combination of ingredients
- **Smart Ingredient Suggestions**: Auto-complete with common ingredients
- **Advanced Filtering**: Filter by dietary preferences, difficulty, and cooking time
- **Recipe Management**: Save, favorite, and organize your recipes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Advanced Features
- **Dietary Preferences**: Support for vegetarian, vegan, gluten-free, low-carb, keto, and paleo diets
- **Difficulty Levels**: Easy, medium, and hard recipes with appropriate techniques
- **Cooking Time Categories**: Quick (<30 min), medium (30-60 min), and long (>60 min) recipes
- **Recipe Sharing**: Copy recipes to clipboard with formatted text
- **Favorites System**: Save and manage your favorite recipes
- **Search & Filter**: Find recipes by title, ingredients, difficulty, or cooking time
- **Recipe Statistics**: Track your recipe collection with detailed analytics

### User Experience
- **Professional UI/UX**: Modern, intuitive interface with smooth animations
- **Mobile-First Design**: Optimized for mobile devices with bottom navigation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Beautiful loading animations and progress indicators
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🛠️ Technology Stack

- **Frontend**: React 18, Material-UI v6
- **State Management**: React Context API with custom hooks
- **Styling**: Material-UI theming system with custom design tokens
- **API Integration**: Google Gemini AI API for recipe generation
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with advanced controls
- **Tablet**: Adaptive layout with touch-friendly interactions
- **Mobile**: Mobile-first design with bottom navigation and optimized touch targets

## 🎨 Design System

### Color Palette
- **Primary**: Professional green (#2E7D32) for main actions
- **Secondary**: Warm orange (#FF6F00) for accents
- **Success**: Green (#4CAF50) for positive actions
- **Warning**: Orange (#FF9800) for medium difficulty
- **Error**: Red (#F44336) for errors and hard difficulty

### Typography
- **Font Family**: Inter (with Roboto fallback)
- **Hierarchy**: Clear typographic scale with proper contrast ratios
- **Responsive**: Fluid typography that scales across devices

### Components
- **Cards**: Elevated cards with hover effects and smooth transitions
- **Buttons**: Consistent button styles with proper states
- **Forms**: Accessible form controls with validation
- **Navigation**: Intuitive navigation with clear visual hierarchy

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RecipeGenerator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_GOOGLE_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables
- `REACT_APP_GOOGLE_API_KEY`: Your Google Gemini AI API key

### API Configuration
The application uses Google's Gemini AI API for recipe generation. Ensure your API key has access to the Gemini model.

## 📖 Usage

### Generating Recipes
1. **Add Ingredients**: Type ingredients in the search bar or select from suggestions
2. **Set Preferences**: Choose dietary restrictions, difficulty, and cooking time
3. **Generate**: Click "Generate Recipe" to create a unique recipe
4. **Save**: Favorite recipes to save them for later

### Managing Recipes
- **Search**: Use the search bar to find recipes by title or ingredients
- **Filter**: Apply filters by difficulty, cooking time, or dietary preferences
- **Sort**: Sort recipes by newest, oldest, title, cooking time, or difficulty
- **Share**: Copy recipes to clipboard with formatted text
- **Delete**: Remove recipes you no longer need

### Mobile Features
- **Bottom Navigation**: Easy access to main features
- **Touch Optimized**: Large touch targets and smooth gestures
- **Quick Stats**: View recipe statistics at a glance

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── Navbar.js          # Main navigation with user menu
│   ├── SearchBar.jsx      # Recipe generation interface
│   ├── RecipeList.js      # Recipe grid with search/filter
│   ├── RecipeCard.jsx     # Individual recipe display
│   └── BottomNav.js       # Mobile bottom navigation
├── context/
│   └── RecipeContext.js   # Global state management
├── services/
│   └── RecipeService.js   # API integration
├── utils/
│   └── sanitizeRecipe.js  # Recipe parsing utilities
└── styles/
    └── theme.js           # Material-UI theme configuration
```

### State Management
- **RecipeContext**: Centralized state for recipes, favorites, and UI state
- **Custom Hooks**: Reusable logic for common operations
- **Error Handling**: Comprehensive error states and user feedback

### SOLID Principles
- **Single Responsibility**: Each component has a clear, focused purpose
- **Open/Closed**: Extensible design for new features
- **Liskov Substitution**: Consistent component interfaces
- **Interface Segregation**: Focused, specific component APIs
- **Dependency Inversion**: Loose coupling through context and props

## 🎯 Key Features Explained

### AI Recipe Generation
The application uses Google's Gemini AI to generate unique recipes based on:
- **Ingredients**: Primary ingredients provided by the user
- **Dietary Preferences**: Vegetarian, vegan, gluten-free, etc.
- **Difficulty Level**: Easy, medium, or hard cooking techniques
- **Cooking Time**: Quick, medium, or long preparation times

### Smart Filtering
- **Real-time Search**: Instant filtering as you type
- **Multi-criteria Filtering**: Combine multiple filter criteria
- **Sorting Options**: Multiple sorting algorithms for different use cases
- **Clear Filters**: Easy reset of all filters and search

### Responsive Design
- **Mobile-First**: Designed for mobile devices first
- **Progressive Enhancement**: Additional features on larger screens
- **Touch-Friendly**: Optimized for touch interactions
- **Performance**: Optimized for fast loading and smooth interactions

## 🔒 Security & Performance

### Security
- **API Key Protection**: Environment variables for sensitive data
- **Input Validation**: Comprehensive validation of user inputs
- **Error Handling**: Secure error messages without exposing internals

### Performance
- **Lazy Loading**: Components load only when needed
- **Memoization**: Optimized re-renders with React.memo and useMemo
- **Efficient State**: Minimal state updates and optimized context usage
- **Image Optimization**: Responsive images with proper sizing

## 🧪 Testing

### Manual Testing Checklist
- [ ] Recipe generation with various ingredients
- [ ] Filtering and sorting functionality
- [ ] Mobile responsiveness across devices
- [ ] Error handling and user feedback
- [ ] Accessibility features
- [ ] Performance on different network conditions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
Ensure all environment variables are properly configured for production.

### Hosting Recommendations
- **Vercel**: Excellent for React applications
- **Netlify**: Great for static sites with CI/CD
- **AWS S3 + CloudFront**: For enterprise deployments

## 🤝 Contributing

### Development Guidelines
1. Follow the existing code style and architecture
2. Add comprehensive error handling
3. Ensure mobile responsiveness
4. Test across different devices and browsers
5. Update documentation for new features

### Code Quality
- **ESLint**: Code linting and style enforcement
- **Prettier**: Consistent code formatting
- **TypeScript**: Consider migrating for better type safety

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI**: For powerful recipe generation capabilities
- **Material-UI**: For the comprehensive component library
- **React Community**: For the excellent documentation and tools

## 📞 Support

For support or questions:
- Check the documentation above
- Review the code comments
- Test with different ingredients and preferences
- Ensure your API key is properly configured

---

**CookSmart AI Recipe Generator** - Making cooking accessible and enjoyable for everyone! 🍳✨
