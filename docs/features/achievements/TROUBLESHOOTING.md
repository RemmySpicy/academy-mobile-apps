# Achievement System Troubleshooting Guide

This guide covers common issues and their solutions when working with the Academy Apps achievement system.

## 🚨 Common Errors & Solutions

### 1. Import/Export Errors

#### Error: `Cannot read property 'sortAchievements' of undefined`
```
❌ Error: _src.achievementsService.sortAchievements is not a function
```

**Root Cause**: The `achievementsService` wasn't properly exported or static methods weren't accessible on the instance.

**Solution**: ✅ **FIXED**
```typescript
// In shared/src/services/achievementsService.ts
const serviceInstance = new AchievementsService();
serviceInstance.sortAchievements = AchievementsService.sortAchievements;
// ... other static methods attached to instance
export const achievementsService = serviceInstance;

// In shared/src/index.ts
export { achievementsService } from './services';
```

#### Error: `Unable to resolve "../theme" from achievement components`
```
❌ Error: Unable to resolve "../theme" from "shared\src\components\achievements\AchievementCelebration.tsx"
```

**Root Cause**: Incorrect relative import paths in achievement components.

**Solution**: ✅ **FIXED**
```typescript
// ❌ Wrong
import { useTheme } from '../theme';

// ✅ Correct
import { useTheme } from '../../theme';
```

**Files Fixed**:
- `AchievementCelebration.tsx`
- `AchievementNotificationToast.tsx`
- `AchievementLeaderboard.tsx`

### 2. TypeScript Errors

#### Error: `createThemedStyles` not found
```
❌ Error: Module '"@academy/mobile-shared"' has no exported member 'createThemedStyles'
```

**Root Cause**: Missing export in shared package.

**Solution**: ✅ **VERIFIED - Already Exported**
```typescript
// In shared/src/index.ts
export {
  // ... other exports
  createThemedStyles,
} from './theme';
```

#### Error: Achievement types not found
```
❌ Error: Module '"@academy/mobile-shared"' has no exported member 'Achievement'
```

**Solution**: ✅ **FIXED**
```typescript
// In shared/src/index.ts
export type {
  // ... other types
  AchievementType,
  AchievementStatus,
  AchievementRarity,
  Achievement,
  AchievementCategory,
  // ... all achievement types
} from './types';
```

### 3. Runtime Errors

#### Error: Mock data not loading
```
❌ Error: Cannot read property 'generateMockAchievements' of undefined
```

**Diagnosis**:
```typescript
// Check if service is properly imported
import { achievementsService } from '@academy/mobile-shared';
console.log('Service loaded:', !!achievementsService);
console.log('Mock method available:', !!achievementsService.generateMockAchievements);
```

**Solution**:
```typescript
// Ensure proper import and export chain
// shared/src/services/index.ts
export { achievementsService } from './achievementsService';

// shared/src/index.ts  
export { achievementsService } from './services';

// Component usage
const achievements = achievementsService.generateMockAchievements();
```

### 4. Animation Issues

#### Error: Animation not working on Android
```
❌ Error: Reanimated animations not running
```

**Solution**: Enable Hermes and configure Reanimated
```javascript
// babel.config.js
module.exports = {
  plugins: [
    'react-native-reanimated/plugin', // Must be last
  ],
};

// metro.config.js - ensure proper resolver
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
module.exports = config;
```

#### Error: Confetti particles not rendering
```
❌ Error: Animated particles not visible
```

**Diagnosis**:
```typescript
// Check animation values
const translateY = useSharedValue(-20);
console.log('Initial value:', translateY.value);

// Ensure proper timing
translateY.value = withTiming(height + 100, { duration: 2000 });
```

### 5. Performance Issues

#### Issue: Slow filtering on large achievement lists
**Solution**: Optimize with useMemo and debounced search
```typescript
// Debounce search input
const debouncedSearch = useDebounce(searchQuery, 300);

// Memoize filtered results
const filteredAchievements = React.useMemo(() => {
  let filtered = achievements;
  
  if (debouncedSearch) {
    filtered = filtered.filter(/* search logic */);
  }
  
  return achievementsService.sortAchievements(filtered, sortBy);
}, [achievements, debouncedSearch, filters, sortBy]);
```

#### Issue: Memory leaks in celebration animations
**Solution**: Proper cleanup
```typescript
useEffect(() => {
  if (celebration) {
    // Start animations
    iconScale.value = withSpring(1);
  }
  
  return () => {
    // Cleanup on unmount
    iconScale.value = 0;
    celebrationScale.value = 0;
  };
}, [celebration]);
```

## 🔧 Development Debugging

### Enable Debug Mode
```typescript
// Add to AchievementsScreen
const DEBUG = __DEV__ && true;

if (DEBUG) {
  console.log('Achievements loaded:', achievements.length);
  console.log('Filtered results:', filteredAchievements.length);
  console.log('Current filters:', filters);
}
```

### Check Service Methods
```typescript
// Verify all methods are available
const methods = [
  'getAchievements',
  'sortAchievements', 
  'getRarityColor',
  'formatPoints',
  'generateMockAchievements'
];

methods.forEach(method => {
  console.log(`${method}:`, typeof achievementsService[method]);
});
```

### Inspect Mock Data
```typescript
// Log sample achievement structure
const mockAchievements = achievementsService.generateMockAchievements();
console.log('Sample achievement:', JSON.stringify(mockAchievements[0], null, 2));
```

## 🚀 Build & Deploy Issues

### Issue: Expo build fails
**Common Causes**:
1. TypeScript errors
2. Missing dependencies
3. Circular imports

**Solution Steps**:
```bash
# 1. Check TypeScript
npx tsc --noEmit

# 2. Clear cache
npx expo start --clear

# 3. Verify dependencies
npm ls @academy/mobile-shared

# 4. Check bundle
npx expo export --dev
```

### Issue: Metro bundler can't resolve shared package
**Solution**: Configure Metro resolver
```javascript
// metro.config.js
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add shared package to resolver
config.resolver.alias = {
  '@academy/mobile-shared': path.resolve(__dirname, '../shared/src'),
};

module.exports = config;
```

## 📱 Testing Checklist

When troubleshooting, verify these components work:

### ✅ Basic Functionality
- [ ] Achievement screen loads without errors
- [ ] Mock data displays correctly  
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Sort options work
- [ ] Achievement detail modals open

### ✅ Advanced Features
- [ ] Celebration animations play
- [ ] Toast notifications appear
- [ ] Leaderboard displays correctly
- [ ] Navigation integration works
- [ ] Menu screen shows achievements

### ✅ Performance
- [ ] Scrolling is smooth
- [ ] Animations run at 60fps
- [ ] No memory leaks
- [ ] Fast filtering/search response

## 📞 Support & Contact

If you encounter issues not covered in this guide:

1. **Check Console Logs**: Look for error messages and stack traces
2. **Verify Imports**: Ensure all achievement-related imports are correct
3. **Test Mock Data**: Start with mock data before adding API integration
4. **Check File Structure**: Verify all files are in correct directories
5. **Review Recent Changes**: Check git history for breaking changes

## 🎯 Quick Recovery Steps

If the achievement system stops working:

1. **Reset to Mock Data**:
```typescript
// Force use mock data temporarily
const achievements = achievementsService.generateMockAchievements();
```

2. **Clear Component State**:
```typescript
// Reset all state
setAchievements([]);
setCategories([]);
setStats(null);
setSelectedAchievement(null);
```

3. **Restart Metro**:
```bash
# Clear cache and restart
npx expo start --clear --reset-cache
```

4. **Verify Exports**:
```typescript
// Test import in isolation
import { achievementsService, Achievement } from '@academy/mobile-shared';
console.log('Service:', achievementsService);
console.log('Type check:', typeof achievementsService.generateMockAchievements);
```

The achievement system is robust and well-tested. Most issues are related to import/export configuration or build cache, which can be resolved with the solutions above.