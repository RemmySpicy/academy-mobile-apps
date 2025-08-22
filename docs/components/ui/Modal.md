# Modal Components

The Academy Modal System provides a comprehensive set of modal and overlay components designed for different use cases with Academy theming and accessibility.

## 🎯 Component Overview

### Core Modal Components

#### 🔧 Design System Components (Basic)
Located in **Design System Showcase** - Core modal building blocks:

1. **CustomModal** - Standard modal with multiple positioning options
2. **CustomModalWithDot** - Mobile-optimized bottom sheet with close indicator
3. **BottomSheet** - Enhanced bottom sheet with snap points and advanced features

#### 🎯 Feature Components (Business Logic)
Located in **Extracted Components Showcase** - Feature-specific implementations:

1. **OnboardingModal** - User authentication and registration flows
2. **StudentProfile** - Student information and management modal
3. **PerformanceTimes** - Performance tracking and analytics modal
4. **ClassroomGrading** - Grade management and classroom tools

---

## 🔧 CustomModal (Standard Modal)

Flexible modal component with multiple positioning options and comprehensive Academy theming.

### Props Interface

```typescript
interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  position?: 'center' | 'bottom' | 'top' | 'fullscreen';
  children: React.ReactNode;
  backdropStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  animationType?: 'fade' | 'slide' | 'none';
  closeOnBackdrop?: boolean;
  keyboardBehavior?: 'padding' | 'height' | 'position' | 'none';
}
```

### Usage Examples

```typescript
import { CustomModal, CustomButton } from '@academy/mobile-shared';

// Center Modal (Default)
<CustomModal
  isVisible={modalVisible}
  onClose={() => setModalVisible(false)}
  position="center"
>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Confirmation</Text>
    <Text style={styles.modalText}>Are you sure you want to proceed?</Text>
    <View style={styles.modalButtons}>
      <CustomButton 
        title="Cancel" 
        variant="outline" 
        onPress={() => setModalVisible(false)}
        style={{ flex: 1 }}
      />
      <CustomButton 
        title="Confirm" 
        variant="primary"
        onPress={handleConfirm}
        style={{ flex: 1 }}
      />
    </View>
  </View>
</CustomModal>

// Bottom Sheet Style
<CustomModal
  isVisible={bottomModalVisible}
  onClose={() => setBottomModalVisible(false)}
  position="bottom"
  animationType="slide"
>
  <View style={styles.bottomSheetContent}>
    {/* Bottom sheet content */}
  </View>
</CustomModal>
```

### Features

- **Multiple Positions**: center, bottom, top, fullscreen
- **Backdrop Control**: Customizable backdrop behavior
- **Keyboard Handling**: Automatic keyboard avoidance
- **Accessibility**: Full screen reader and keyboard navigation support
- **Academy Theming**: Automatic theme integration

---

## 📱 CustomModalWithDot (Bottom Sheet)

Mobile-optimized bottom sheet modal with close dot indicator and swipe gestures.

### Props Interface

```typescript
interface CustomModalWithDotProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseDot?: boolean;
  swipeToClose?: boolean;
  maxHeightPercentage?: number;
  minHeightPercentage?: number;
  backdropStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}
```

### Usage Examples

```typescript
import { CustomModalWithDot, CustomButton } from '@academy/mobile-shared';

<CustomModalWithDot
  visible={bottomSheetVisible}
  onClose={() => setBottomSheetVisible(false)}
  showCloseDot={true}
  swipeToClose={true}
  maxHeightPercentage={0.8}
>
  <View style={styles.bottomSheetContent}>
    <Text style={styles.title}>Quick Actions</Text>
    <View style={styles.actionButtons}>
      <CustomButton 
        title="Edit Student" 
        variant="primary"
        onPress={handleEdit}
        style={{ flex: 1 }}
      />
      <CustomButton 
        title="View Details" 
        variant="outline"
        onPress={handleView}
        style={{ flex: 1 }}
      />
    </View>
  </View>
</CustomModalWithDot>
```

### Features

- **Close Dot Indicator**: Visual handle for mobile users
- **Swipe-to-Close**: Intuitive gesture support
- **Height Control**: Customizable height constraints
- **Mobile Optimized**: Touch-friendly interface
- **Academy Styling**: Consistent design system integration

---

## 🚀 BottomSheet (Enhanced)

Advanced bottom sheet with snap points, provider management, and enhanced gesture handling.

### Props Interface

```typescript
interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  
  // Snap Points
  snapPoints?: BottomSheetSnapPoint[];
  initialSnapPoint?: BottomSheetSnapPoint;
  currentSnapPoint?: BottomSheetSnapPoint;
  onSnapPointChange?: (snapPoint: BottomSheetSnapPoint) => void;
  
  // Behavior
  closeOnBackdrop?: boolean;
  showDragHandle?: boolean;
  enablePanDownToClose?: boolean;
  animationDuration?: number;
  
  // Header
  title?: string;
  showCloseButton?: boolean;
  headerComponent?: React.ReactNode;
  
  // Content
  scrollable?: boolean;
  keyboardBehavior?: 'padding' | 'height' | 'position' | 'none';
}

type BottomSheetSnapPoint = 'small' | 'medium' | 'large' | 'full' | number;
```

### Usage Examples

```typescript
import { BottomSheet, CustomButton } from '@academy/mobile-shared';

// Basic Bottom Sheet with Snap Points
<BottomSheet
  visible={advancedSheetVisible}
  onClose={() => setAdvancedSheetVisible(false)}
  title="Student Management"
  snapPoints={['medium', 'large']}
  initialSnapPoint="medium"
  showDragHandle={true}
  enablePanDownToClose={false}
  closeOnBackdrop={true}
>
  <View style={styles.content}>
    <Text style={styles.description}>
      Drag the handle to resize between medium and large views.
    </Text>
    <View style={styles.actions}>
      <CustomButton 
        title="Resize to Large" 
        variant="outline"
        onPress={() => console.log('Resize requested')}
        style={{ flex: 1 }}
      />
      <CustomButton 
        title="Close" 
        variant="primary"
        onPress={() => setAdvancedSheetVisible(false)}
        style={{ flex: 1 }}
      />
    </View>
  </View>
</BottomSheet>

// Scrollable Content
<BottomSheet
  visible={scrollableSheetVisible}
  onClose={() => setScrollableSheetVisible(false)}
  title="Long Content List"
  snapPoints={['medium', 'large']}
  scrollable={true}
>
  <View>
    {longContentList.map((item, index) => (
      <View key={index} style={styles.listItem}>
        <Text>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
    ))}
  </View>
</BottomSheet>
```

### Features

- **Snap Points**: Dynamic height with predefined stops (small, medium, large, full)
- **Advanced Gestures**: Drag handle, swipe controls, and pan gestures
- **Provider Support**: Global state management for multiple sheets
- **Scrollable Content**: Built-in scroll view support
- **Header Management**: Optional titles and close buttons
- **Accessibility**: Full keyboard and screen reader support

### **⚠️ Important Configuration**

To prevent modal closing when dragging down from larger snap points:

```typescript
<BottomSheet
  snapPoints={['medium', 'large']}
  initialSnapPoint="medium"
  enablePanDownToClose={false}  // Prevents accidental closing
  showDragHandle={true}         // Shows resize handle
  closeOnBackdrop={true}        // Allows backdrop close
>
```

---

## 🎯 Feature Modal Components

### OnboardingModal (Authentication)

Complete user authentication modal with social login options.

```typescript
import { OnboardingModal } from '@academy/mobile-shared';

<OnboardingModal
  visible={onboardingVisible}
  onClose={() => setOnboardingVisible(false)}
  onLogin={() => navigateToLogin()}
  onSignup={() => navigateToSignup()}
  title="Welcome to Academy"
  subtitle="Choose how you'd like to get started"
  showSocialAuth={true}
  socialAuthConfig={{
    enableGoogle: true,
    enableApple: true,
    enableFacebook: true,
  }}
/>
```

### StudentProfile Modal

Comprehensive student information and management interface.

```typescript
import { StudentProfile } from '@academy/mobile-shared';

<StudentProfile
  visible={profileVisible}
  onClose={() => setProfileVisible(false)}
  student={selectedStudent}
  onEdit={handleEditStudent}
  onViewProgress={handleViewProgress}
  showEditButton={true}
  showProgressButton={true}
/>
```

### PerformanceTimes Modal

Performance tracking and analytics interface.

```typescript
import { PerformanceTimes } from '@academy/mobile-shared';

<PerformanceTimes
  visible={performanceVisible}
  onClose={() => setPerformanceVisible(false)}
  studentId={studentId}
  performanceData={performanceMetrics}
  onUpdatePerformance={handleUpdatePerformance}
/>
```

---

## 🎨 Academy Theming Integration

All modal components automatically integrate with the Academy theme system:

```typescript
import { useTheme } from '@academy/mobile-shared';

const MyModalContent = () => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    modalContent: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
    },
    modalTitle: {
      ...theme.typography.heading.h4,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    modalText: {
      ...theme.typography.body.base,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      width: '100%',
      justifyContent: 'space-between',
    },
  });
  
  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Modal Title</Text>
      <Text style={styles.modalText}>Modal description text</Text>
      <View style={styles.modalButtons}>
        <CustomButton 
          title="Cancel" 
          variant="outline"
          style={{ flex: 1 }}
        />
        <CustomButton 
          title="Confirm" 
          variant="primary"
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};
```

### Button Layout Best Practices

**✅ Recommended Button Layout:**

```typescript
// Use flex: 1 for equal button sizing
<View style={styles.modalButtons}>
  <CustomButton 
    title="Cancel" 
    variant="outline"
    style={{ flex: 1 }}  // Equal width
  />
  <CustomButton 
    title="Confirm" 
    variant="primary"
    style={{ flex: 1 }}  // Equal width
  />
</View>

// Style with proper spacing
const styles = StyleSheet.create({
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',  // Prevents overflow
  },
});
```

---

## ♿ Accessibility Features

All modal components include comprehensive accessibility support:

### Screen Reader Support
```typescript
<CustomModal
  isVisible={modalVisible}
  onClose={() => setModalVisible(false)}
  accessibilityLabel="Confirmation modal"
  accessibilityHint="Confirm or cancel the action"
>
  <View 
    accessibilityRole="dialog"
    accessibilityLabel="Confirmation dialog"
  >
    <Text accessibilityRole="header">Confirm Action</Text>
    <Text>Are you sure you want to proceed?</Text>
    <CustomButton 
      title="Confirm"
      accessibilityLabel="Confirm action button"
      accessibilityHint="Confirms the action and closes the modal"
    />
  </View>
</CustomModal>
```

### Keyboard Navigation
- **Tab Order**: Logical focus progression
- **Escape Key**: Closes modal when focused
- **Enter/Space**: Activates focused buttons
- **Focus Trapping**: Keeps focus within modal

### Touch Targets
- **Minimum 44px**: All interactive elements
- **Adequate Spacing**: Between touch targets
- **Visual Feedback**: Clear pressed states

---

## 🔧 Common Patterns

### Modal with Form
```typescript
const FormModal = () => {
  const [formData, setFormData] = useState({});
  
  return (
    <CustomModal
      isVisible={modalVisible}
      onClose={() => setModalVisible(false)}
      position="center"
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Edit Student</Text>
        
        <CustomInput
          label="Student Name"
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
        />
        
        <CustomInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
          keyboardType="email-address"
        />
        
        <View style={styles.formButtons}>
          <CustomButton 
            title="Cancel" 
            variant="outline"
            onPress={() => setModalVisible(false)}
            style={{ flex: 1 }}
          />
          <CustomButton 
            title="Save" 
            variant="primary"
            onPress={handleSave}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </CustomModal>
  );
};
```

### Confirmation Modal
```typescript
const ConfirmationModal = ({ visible, onClose, onConfirm, title, message }) => (
  <CustomModal
    isVisible={visible}
    onClose={onClose}
    position="center"
  >
    <View style={styles.confirmationContent}>
      <Text style={styles.confirmationTitle}>{title}</Text>
      <Text style={styles.confirmationMessage}>{message}</Text>
      <View style={styles.confirmationButtons}>
        <CustomButton 
          title="Cancel" 
          variant="outline"
          onPress={onClose}
          style={{ flex: 1 }}
        />
        <CustomButton 
          title="Confirm" 
          variant="primary"
          onPress={() => {
            onConfirm();
            onClose();
          }}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  </CustomModal>
);
```

### Action Sheet Bottom Modal
```typescript
const ActionSheet = ({ visible, onClose, actions }) => (
  <CustomModalWithDot
    visible={visible}
    onClose={onClose}
    showCloseDot={true}
    swipeToClose={true}
  >
    <View style={styles.actionSheetContent}>
      <Text style={styles.actionSheetTitle}>Choose Action</Text>
      {actions.map((action, index) => (
        <CustomButton
          key={index}
          title={action.title}
          variant={action.variant || 'outline'}
          onPress={() => {
            action.onPress();
            onClose();
          }}
          style={styles.actionButton}
        />
      ))}
    </View>
  </CustomModalWithDot>
);
```

---

## 🔄 Migration Guide

### From Legacy Modal Components

**Old Approach (❌):**
```typescript
import CustomModal from '../components/modals/customModal';
import customModalWithDot from '../components/modals/customModalWithDot';
```

**New Approach (✅):**
```typescript
import { 
  CustomModal, 
  CustomModalWithDot, 
  BottomSheet 
} from '@academy/mobile-shared';
```

### Common Migration Issues

1. **Button Overflow**: Add `style={{ flex: 1 }}` to modal buttons
2. **Snap Point Behavior**: Use `enablePanDownToClose={false}` for BottomSheet
3. **Theme Integration**: Use `useTheme()` hook for styling
4. **Accessibility**: Add proper accessibility props

---

## 📚 Related Documentation

- **[CustomButton](../forms/CustomButton.md)** - Button component used in modals
- **[Academy Theme System](../../THEME_SYSTEM.md)** - Complete theming reference
- **[Design System](../../design-system/README.md)** - Academy design principles
- **[Component Showcase](../README.md#component-showcase)** - Live demos and examples

The Academy Modal System provides a comprehensive, accessible, and theme-integrated solution for all overlay and modal needs in Academy applications.