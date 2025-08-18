# Component Showcase Guide

This guide explains how to access and use the Academy Apps component showcases for development and testing.

## 🎨 Available Showcases

The Academy Apps shared library includes three comprehensive showcase screens:

### 1. **DesignSystemShowcase** - Core Design System
- **Purpose**: Demonstrates the foundational design system components
- **Components**: CustomButton, CustomInput, CustomCheckBox, CustomModal, CustomAlert
- **Features**: Theme switching (Light/Dark/Night/System), component variants, states
- **Use Case**: Understanding basic Academy design patterns

### 2. **FormExamplesScreen** - Form Components in Action  
- **Purpose**: Real-world form implementations using Academy components
- **Components**: Login forms, Profile forms, Feedback forms with validation
- **Features**: React Hook Form integration, validation, social auth components
- **Use Case**: Learning form patterns and validation strategies

### 3. **ExtractedComponentsShowcase** - Newly Extracted Components
- **Purpose**: Showcases all 18 components extracted from instructor app existing code
- **Components**: Search system, Calendar, Performance cards, UI components, Hooks
- **Features**: Interactive demos, responsive design, TypeScript compliance
- **Use Case**: Testing and understanding newly extracted components

## 🚀 How to Access Showcases

### Option 1: Import into Your App (Recommended)

```typescript
// In your App.tsx or development screen
import { 
  DesignSystemShowcase, 
  FormExamplesScreen,
  ExtractedComponentsShowcase 
} from '@academy/mobile-shared';

// Use in your navigation or development menu
const DevShowcaseScreen = () => {
  return (
    <View>
      <Button title="Design System" onPress={() => navigate('DesignSystem')} />
      <Button title="Form Examples" onPress={() => navigate('Forms')} />
      <Button title="Extracted Components" onPress={() => navigate('Extracted')} />
    </View>
  );
};
```

### Option 2: Direct Navigation Setup

```typescript
// In your navigation setup
import { createStackNavigator } from '@react-navigation/stack';
import { 
  DesignSystemShowcase, 
  FormExamplesScreen,
  ExtractedComponentsShowcase 
} from '@academy/mobile-shared';

const DevStack = createStackNavigator();

const DevNavigator = () => (
  <DevStack.Navigator>
    <DevStack.Screen 
      name="DesignSystem" 
      component={DesignSystemShowcase}
      options={{ title: 'Academy Design System' }}
    />
    <DevStack.Screen 
      name="Forms" 
      component={FormExamplesScreen}
      options={{ title: 'Form Examples' }}
    />
    <DevStack.Screen 
      name="Extracted" 
      component={ExtractedComponentsShowcase}
      options={{ title: 'Extracted Components' }}
    />
  </DevStack.Navigator>
);
```

### Option 3: Development Menu Integration

```typescript
// Create a development menu for easy access
const DevMenu = () => {
  const navigation = useNavigation();
  
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Academy Dev Tools
      </Text>
      
      <CustomButton
        title="🎨 Design System Showcase"
        onPress={() => navigation.navigate('DesignSystem')}
        style={{ marginBottom: 10 }}
      />
      
      <CustomButton
        title="📝 Form Examples"
        onPress={() => navigation.navigate('Forms')}
        style={{ marginBottom: 10 }}
      />
      
      <CustomButton
        title="🚀 Extracted Components"
        onPress={() => navigation.navigate('Extracted')}
        style={{ marginBottom: 10 }}
      />
    </ScrollView>
  );
};
```

## 📱 What Each Showcase Contains

### DesignSystemShowcase Sections:
- **Theme Selector**: Switch between Light/Dark/Night/System themes
- **Buttons**: All button variants, sizes, and states
- **Inputs**: Text inputs, passwords, validation states
- **Modals**: Modal positioning and theming
- **Alerts**: Alert types and positioning

### FormExamplesScreen Sections:
- **Login Form**: Email/password with validation + social auth
- **Profile Form**: Comprehensive user profile with multiple field types
- **Feedback Form**: Rating system with preferences

### ExtractedComponentsShowcase Sections:
- **Overview**: Statistics and features of extracted components
- **UI Components**: ToggleCard, SelectOptions, HeaderComponent, EmptySearchResult
- **Search System**: SearchInput, FilterChip, QuickFilterBar, SearchBar
- **Calendar**: Calendar component and DatePicker with events
- **Performance**: WorkoutCard and ClassroomCard with sample data
- **Hooks**: Live demos of useDebounce, useScreenDimensions

## 🛠️ Development Workflow

### 1. Component Development
```typescript
// When developing new components, test in showcases
import { ExtractedComponentsShowcase } from '@academy/mobile-shared';

// Add your component to the showcase for testing
// Follow the existing patterns for consistent demo experience
```

### 2. Theme Testing
```typescript
// Use DesignSystemShowcase to test theme compatibility
// Switch themes to ensure your components work in all modes
// Check color contrast and accessibility
```

### 3. Responsive Testing
```typescript
// Use ExtractedComponentsShowcase to test responsive behavior
// Check both phone and tablet layouts
// Verify useScreenDimensions hook functionality
```

### 4. Form Pattern Learning
```typescript
// Study FormExamplesScreen for form implementation patterns
// Learn validation strategies and error handling
// Understand Academy form design patterns
```

## 🎯 Best Practices

### For Developers:
1. **Always test new components** in the appropriate showcase
2. **Follow Academy theming** patterns shown in existing showcases
3. **Test responsiveness** across device sizes using showcase examples
4. **Validate accessibility** using showcase implementations as reference

### For Designers:
1. **Use showcases to understand** component capabilities and variants
2. **Test theme variations** to ensure designs work across all themes
3. **Verify responsive behavior** using the device info in showcases

### For QA:
1. **Use showcases for comprehensive testing** of component states
2. **Verify theme switching** works correctly across all components
3. **Test accessibility features** demonstrated in showcases

## 🔧 Customization

### Adding New Showcase Sections:
```typescript
// In ExtractedComponentsShowcase.tsx
const renderYourNewSection = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>🆕 Your New Section</Text>
    {/* Your demo components */}
  </View>
);

// Add to navigation and section rendering
```

### Creating Custom Showcases:
```typescript
// Follow the existing patterns for new showcase screens
import { createThemedStyles } from '../theme/ThemeProvider';

const YourCustomShowcase: React.FC = () => {
  const styles = useThemedStyles();
  // Implementation following existing patterns
};
```

## 📊 Component Coverage

### Currently Showcased:
- ✅ All 18 extracted components
- ✅ Core design system components  
- ✅ Form components with validation
- ✅ Theme system integration
- ✅ Responsive design patterns
- ✅ Hook implementations

### Future Additions:
- 🔄 Animation showcases
- 🔄 Performance monitoring
- 🔄 Accessibility testing tools
- 🔄 Component documentation integration

## 🎉 Getting Started

1. **Choose your showcase** based on what you want to explore
2. **Import the component** into your development environment
3. **Navigate to the showcase** in your app
4. **Interact with components** to understand their behavior
5. **Switch themes** to test compatibility
6. **Refer to source code** for implementation patterns

The showcases are living documentation that evolve with the Academy Apps design system. Use them as your primary reference for component behavior, theming, and implementation patterns!