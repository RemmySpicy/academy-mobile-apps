# Icon Prop Standardization Update

## 📋 Overview

This document outlines the standardization of icon props across the Academy Mobile Apps form components to ensure consistency and eliminate backwards compatibility complexity.

## 🎯 Changes Made

### **CustomInput Component**

**Before (Legacy)**:
- `icon` prop (deprecated)
- `leftIcon` prop (deprecated) 
- `rightIcon` prop (deprecated)

**After (Standardized)**:
- `startIcon` prop - Icon displayed at the start (left) of the input
- `endIcon` prop - Icon displayed at the end (right) of the input

### **Updated Files**

1. **`shared/src/components/forms/CustomInput.tsx`**
   - Removed legacy icon props from interface
   - Updated destructuring parameters
   - Simplified icon rendering logic

2. **`instructors-app/src/features/auth/screens/LoginScreen.tsx`**
   - Changed `icon` prop to `startIcon` for email input
   - Changed `icon` prop to `startIcon` for password input
   - Added `showPasswordToggle={true}` for proper password visibility

3. **`shared/src/screens/FormExamplesScreen.tsx`**
   - Updated "Forgot Password" to use text-style Pressable (matching LoginScreen)
   - Added "Sign Up" link text (matching LoginScreen experience)
   - Added necessary styles for consistent appearance

4. **`docs/components/forms/CUSTOM_INPUT.md`**
   - Updated prop documentation table
   - Updated all code examples to use `startIcon`/`endIcon`
   - Changed examples from `Iconify` to `Ionicons` (Academy standard)

## 🎨 Benefits

### **1. Consistency**
- All form inputs now use the same icon prop naming convention
- No more confusion between `icon`, `leftIcon`, and `startIcon`

### **2. Clarity** 
- `startIcon` and `endIcon` clearly indicate positioning in RTL/LTR layouts
- More semantic than left/right terminology

### **3. Maintainability**
- Removed backwards compatibility code paths
- Cleaner component implementation
- Easier to understand and maintain

### **4. User Experience Consistency**
- Login screens across apps now have consistent styling
- Forgot password uses preferred text-button style
- Sign up options available where expected

## 🔧 Migration Guide

### **For Existing Code**

If you have existing `CustomInput` usage with legacy props:

```typescript
// ❌ Old (no longer supported)
<CustomInput
  name="email" 
  control={control}
  icon={<Ionicons name="mail-outline" size={20} />}
/>

// ❌ Old (no longer supported)  
<CustomInput
  name="email"
  control={control} 
  leftIcon={<Ionicons name="mail-outline" size={20} />}
/>

// ✅ New (standardized)
<CustomInput
  name="email"
  control={control}
  startIcon={<Ionicons name="mail-outline" size={20} />}
/>
```

### **For Right-aligned Icons**

```typescript
// ❌ Old (no longer supported)
<CustomInput
  name="search"
  control={control}
  rightIcon={<Ionicons name="search-outline" size={20} />}
/>

// ✅ New (standardized) 
<CustomInput
  name="search"
  control={control}
  endIcon={<Ionicons name="search-outline" size={20} />}
/>
```

### **For Password Inputs**

```typescript
// ✅ Best practice for password inputs
<CustomInput
  name="password"
  control={control}
  placeholder="Enter your password"
  secureTextEntry={true}
  showPasswordToggle={true} // Built-in password visibility toggle
  startIcon={<Ionicons name="lock-closed-outline" size={20} />}
/>
```

## 📱 Form Pattern Examples

### **Login Form (Standardized)**

```typescript
// Email Input
<CustomInput
  name="email"
  control={control}
  placeholder="Enter your email"
  keyboardType="email-address"
  autoCapitalize="none"
  startIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.text.tertiary} />}
/>

// Password Input  
<CustomInput
  name="password"
  control={control}
  placeholder="Enter your password"
  secureTextEntry={true}
  showPasswordToggle={true}
  startIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.tertiary} />}
/>

// Forgot Password (Text Style)
<Pressable onPress={handleForgotPassword} style={styles.forgotPassword}>
  <Text style={styles.forgotPasswordText}>
    Forgot Password?
  </Text>
</Pressable>

// Sign Up Link (Text Style)
<View style={styles.registerSection}>
  <Text style={styles.registerText}>
    Don't have an account?{' '}
  </Text>
  <Pressable onPress={handleSignUp}>
    <Text style={styles.registerLink}>
      Sign Up
    </Text>
  </Pressable>
</View>
```

## ✅ Validation

The changes maintain full TypeScript compatibility and follow Academy Design System patterns:

- **Icons**: Using `@expo/vector-icons` (Ionicons) as the standard
- **Colors**: Using theme colors (`theme.colors.text.tertiary`)
- **Typography**: Using theme typography (`theme.typography.body.sm`)
- **Spacing**: Using theme spacing (`theme.spacing.md`)

## 🚨 Breaking Changes

**This is a breaking change** for any code using the legacy icon props:

- `icon` prop → **Removed** 
- `leftIcon` prop → **Removed**
- `rightIcon` prop → **Removed**

**Migration Required**: Update all `CustomInput` usages to use `startIcon`/`endIcon`.

## 🎉 Summary

This standardization eliminates prop confusion, improves code clarity, and ensures consistent user experiences across all Academy Mobile Apps. The `startIcon`/`endIcon` approach is more semantic and better supports internationalization with RTL layouts.

All form examples and documentation have been updated to reflect these changes, providing a clean foundation for future development.