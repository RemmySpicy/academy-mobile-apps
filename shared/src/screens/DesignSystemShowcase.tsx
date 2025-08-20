import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Theme
import { useTheme, createThemedStyles, ExtendedThemeMode } from '../theme/ThemeProvider';

// Components
import { CustomInput } from '../components/forms/CustomInput';
import { CustomButton } from '../components/forms/CustomButton';
import { LoadingSpinner, Alert } from '../components/ui';
import { CustomCheckBox } from '../components/forms/CustomCheckBox';
import CustomModal from '../components/ui/CustomModal';
import CustomModalWithDot from '../components/ui/CustomModalWithDot';
import { BottomSheet } from '../components/ui';
import CustomAlert from '../components/ui/CustomAlert';

const DesignSystemShowcase: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const styles = useThemedStyles();

  // Component states for demo
  const [inputValue, setInputValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalWithDotVisible, setModalWithDotVisible] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  
  // Alert state management
  const [alertStates, setAlertStates] = useState({
    success: false,
    error: false,
    warning: false,
    info: false,
  });
  const [currentSection, setCurrentSection] = useState<'buttons' | 'inputs' | 'modals' | 'alerts' | 'loaders'>('buttons');

  const themeOptions: { label: string; value: ExtendedThemeMode }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Night', value: 'night' },
    { label: 'System', value: 'system' },
  ];

  // Alert helper functions - Simple feedback system
  const showAlert = (type: keyof typeof alertStates) => {
    // For design showcase, just show a simple confirmation
    console.log(`${type} alert would be shown here`);
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} Alert Demo\n\nThis would show a ${type} alert with proper theming and animations in the actual app.`);
  };

  const hideAlert = (type: keyof typeof alertStates) => {
    setAlertStates(prev => ({ ...prev, [type]: false }));
  };

  const renderThemeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Theme Selector</Text>
      <View style={styles.themeSelector}>
        {themeOptions.map((option) => (
          <Pressable 
            key={option.value}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, [
              styles.themeOption,
              themeMode === option.value && styles.themeOptionActive,
            ]]}
            onPress={() => setThemeMode(option.value)}
          >
            <Text style={[
              styles.themeOptionText,
              themeMode === option.value && styles.themeOptionTextActive,
            ]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderButtons = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Academy CustomButton - Enhanced</Text>
      <Text style={styles.sectionDescription}>
        Enhanced Academy button with 18 variants, icon support, and comprehensive design system integration
      </Text>
      
      <Text style={styles.subsectionTitle}>Primary Variants</Text>
      <View style={styles.componentGrid}>
        <CustomButton title="Primary" variant="primary" onPress={() => {}} />
        <CustomButton title="Teal" variant="teal" onPress={() => {}} />
        <CustomButton title="Secondary" variant="secondary" onPress={() => {}} />
        <CustomButton title="Ghost" variant="ghost" onPress={() => {}} />
      </View>
      
      <Text style={styles.subsectionTitle}>Outline Variants</Text>
      <View style={styles.componentGrid}>
        <CustomButton title="Outline" variant="outline" onPress={() => {}} />
        <CustomButton title="Outline Theme" variant="outlineTheme" onPress={() => {}} />
        <CustomButton title="Outline Teal" variant="outlineTeal" onPress={() => {}} />
      </View>
      
      <Text style={styles.subsectionTitle}>Status Variants</Text>
      <View style={styles.componentGrid}>
        <CustomButton title="Success" variant="success" onPress={() => {}} />
        <CustomButton title="Warning" variant="warning" onPress={() => {}} />
        <CustomButton title="Danger" variant="danger" onPress={() => {}} />
        <CustomButton title="Info" variant="info" onPress={() => {}} />
      </View>
      
      <Text style={styles.subsectionTitle}>Utility Variants</Text>
      <View style={styles.componentGrid}>
        <CustomButton title="Faded" variant="faded" onPress={() => {}} />
        <CustomButton title="Orange" variant="orange" onPress={() => {}} />
        <CustomButton title="Gray" variant="gray" onPress={() => {}} />
        <CustomButton title="Light Gray" variant="lightGray" onPress={() => {}} />
        <CustomButton title="Black" variant="black" onPress={() => {}} />
        <CustomButton title="Cancel" variant="cancel" onPress={() => {}} />
        <CustomButton title="Normal" variant="normal" onPress={() => {}} />
      </View>

      <Text style={styles.subsectionTitle}>Button Sizes</Text>
      <View style={styles.componentGrid}>
        <CustomButton title="Small" size="sm" onPress={() => {}} />
        <CustomButton title="Medium" size="md" onPress={() => {}} />
      </View>

      <Text style={styles.subsectionTitle}>Button States</Text>  
      <View style={styles.componentGrid}>
        <CustomButton title="Normal" onPress={() => {}} />
        <CustomButton title="Disabled" disabled onPress={() => {}} />
        <CustomButton title="Loading" isLoading onPress={() => {}} />
        <CustomButton 
          title="With Icons" 
          startIcon={<Ionicons name="star-outline" size={16} color="white" />}
          endIcon={<Ionicons name="arrow-forward-outline" size={16} color="white" />}
          onPress={() => {}} 
        />
      </View>
    </View>
  );

  const renderInputs = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>CustomInput - Complete Form System</Text>
      <Text style={styles.sectionDescription}>
        Comprehensive input component with 4 variants, 3 sizes, icon support, and advanced features
      </Text>
      
      <Text style={styles.subsectionTitle}>Input Variants</Text>
      <View style={styles.componentGrid}>
        <CustomInput
          name="demo-standard"
          label="Standard Input"
          placeholder="Standard variant (default)"
          variant="standard"
          value=""
          onChangeText={() => {}}
        />
        
        <CustomInput
          name="demo-outline"
          label="Outline Input"
          placeholder="Outline variant with border"
          variant="outline"
          value=""
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-ghost"
          label="Ghost Input"
          placeholder="Ghost variant (borderless)"
          variant="ghost"
          value=""
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-password-variant"
          label="Password Variant"
          placeholder="Password variant styling"
          variant="password"
          value=""
          onChangeText={() => {}}
        />
      </View>

      <Text style={styles.subsectionTitle}>Input Sizes</Text>
      <View style={styles.componentGrid}>
        <CustomInput
          name="demo-small"
          label="Small Input"
          placeholder="Small size (36px height)"
          size="small"
          value=""
          onChangeText={() => {}}
        />
        
        <CustomInput
          name="demo-medium"
          label="Medium Input"
          placeholder="Medium size (44px height)"
          size="medium"
          value=""
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-large"
          label="Large Input"
          placeholder="Large size (52px height)"
          size="large"
          value=""
          onChangeText={() => {}}
        />
      </View>

      <Text style={styles.subsectionTitle}>Input with Icons</Text>
      <View style={styles.componentGrid}>
        <CustomInput
          name="demo-start-icon"
          label="Start Icon"
          placeholder="Search with start icon..."
          startIcon={<Ionicons name="search-outline" size={20} color={theme.colors.text.tertiary} />}
          value=""
          onChangeText={() => {}}
        />
        
        <CustomInput
          name="demo-end-icon"
          label="End Icon"
          placeholder="Input with end icon..."
          endIcon={<Ionicons name="star-outline" size={20} color={theme.colors.text.tertiary} />}
          value=""
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-both-icons"
          label="Both Icons"
          placeholder="Both start and end icons..."
          startIcon={<Ionicons name="person-outline" size={20} color={theme.colors.text.tertiary} />}
          endIcon={<Ionicons name="checkmark-outline" size={20} color={theme.colors.status.success} />}
          value=""
          onChangeText={() => {}}
        />
      </View>

      <Text style={styles.subsectionTitle}>Password Inputs</Text>
      <View style={styles.componentGrid}>
        <CustomInput
          name="demo-password-basic"
          label="Basic Password"
          placeholder="Enter password..."
          secureTextEntry
          value=""
          onChangeText={() => {}}
        />
        
        <CustomInput
          name="demo-password-toggle"
          label="Password with Toggle"
          placeholder="Password with visibility toggle..."
          secureTextEntry
          showPasswordToggle
          value=""
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-password-icon"
          label="Password with Icon"
          placeholder="Password with custom icon..."
          secureTextEntry
          showPasswordToggle
          startIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.tertiary} />}
          value=""
          onChangeText={() => {}}
        />
      </View>

      <Text style={styles.subsectionTitle}>Keyboard Types & Text Content</Text>
      <View style={styles.componentGrid}>
        <CustomInput
          name="demo-email"
          label="Email Input"
          placeholder="Enter email address..."
          keyboardType="email-address"
          autoCapitalize="none"
          startIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.text.tertiary} />}
          value=""
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-phone"
          label="Phone Number"
          placeholder="Enter phone number..."
          keyboardType="phone-pad"
          startIcon={<Ionicons name="call-outline" size={20} color={theme.colors.text.tertiary} />}
          value=""
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-numeric"
          label="Numeric Input"
          placeholder="Enter numbers only..."
          keyboardType="numeric"
          startIcon={<Ionicons name="calculator-outline" size={20} color={theme.colors.text.tertiary} />}
          value=""
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-url"
          label="URL Input"
          placeholder="Enter website URL..."
          keyboardType="url"
          autoCapitalize="none"
          startIcon={<Ionicons name="link-outline" size={20} color={theme.colors.text.tertiary} />}
          value=""
          onChangeText={() => {}}
        />
      </View>

      <Text style={styles.subsectionTitle}>Multiline & Text Areas</Text>
      <View style={styles.componentGrid}>
        <CustomInput
          name="demo-multiline-basic"
          label="Basic Multiline"
          placeholder="Enter multiple lines of text..."
          multiline
          numberOfLines={3}
          value=""
          onChangeText={() => {}}
        />
        
        <CustomInput
          name="demo-multiline-large"
          label="Large Text Area"
          placeholder="Large text area for longer content..."
          multiline
          numberOfLines={5}
          size="large"
          value=""
          onChangeText={() => {}}
        />
      </View>

      <Text style={styles.subsectionTitle}>Input States</Text>
      <View style={styles.componentGrid}>
        <CustomInput
          name="demo-normal"
          label="Normal State"
          placeholder="Normal input state..."
          value={inputValue}
          onChangeText={setInputValue}
        />

        <CustomInput
          name="demo-focused"
          label="Auto-Focus Input"
          placeholder="This input auto-focuses..."
          autoFocus
          value=""
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-disabled"
          label="Disabled Input"
          placeholder="Disabled state..."
          disabled
          value="Cannot edit this"
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-error"
          label="Error State"
          placeholder="Input with error..."
          value=""
          error="This field is required"
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-max-length"
          label="Character Limit"
          placeholder="Max 20 characters..."
          maxLength={20}
          value=""
          onChangeText={() => {}}
        />
      </View>

      <Text style={styles.subsectionTitle}>Checkbox Components</Text>
      <View style={styles.componentGrid}>
        <CustomCheckBox
          label="Primary Checkbox"
          value={checkboxValue}
          onValueChange={setCheckboxValue}
          variant="primary"
        />
        
        <CustomCheckBox
          label="Success Checkbox"
          value={false}
          onValueChange={() => {}}
          variant="success"
        />

        <CustomCheckBox
          label="Warning Checkbox"
          value={false}
          onValueChange={() => {}}
          variant="warning"
        />

        <CustomCheckBox
          label="Disabled Checkbox"
          value={false}
          onValueChange={() => {}}
          disabled
        />

        <CustomCheckBox
          label="Indeterminate Checkbox"
          value={false}
          onValueChange={() => {}}
          indeterminate
        />
      </View>
    </View>
  );

  const renderModals = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🔧 Modal & Overlay Components</Text>
      <Text style={styles.sectionDescription}>
        Core modal and overlay components for dialogs, bottom sheets, and content overlays with Academy theming
      </Text>
      
      {/* CustomModal - Standard Modal */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>CustomModal (Standard Modal)</Text>
        <View style={styles.componentGrid}>
          <CustomButton 
            title="Center Modal" 
            onPress={() => setModalVisible(true)} 
            variant="primary"
          />
        </View>
        <Text style={styles.componentDescription}>
          Flexible modal component with multiple positioning options (center, bottom, top, fullscreen). Features backdrop controls, keyboard avoidance, accessibility support, and smooth animations.
        </Text>
      </View>

      {/* CustomModalWithDot - Bottom Sheet Modal */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>CustomModalWithDot (Bottom Sheet)</Text>
        <View style={styles.componentGrid}>
          <CustomButton 
            title="Bottom Sheet with Dot" 
            onPress={() => setModalWithDotVisible(true)} 
            variant="secondary"
          />
        </View>
        <Text style={styles.componentDescription}>
          Mobile-optimized bottom sheet with close dot indicator, swipe-to-close gestures, and customizable height. Perfect for mobile-first interfaces and quick actions.
        </Text>
      </View>

      {/* BottomSheet - Advanced Bottom Sheet */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>BottomSheet (Enhanced)</Text>
        <View style={styles.componentGrid}>
          <CustomButton 
            title="Advanced Bottom Sheet" 
            onPress={() => setBottomSheetVisible(true)} 
            variant="outline"
          />
        </View>
        <Text style={styles.componentDescription}>
          Enhanced bottom sheet with snap points (small, medium, large), advanced gesture handling, scrollable content support, and provider-based state management.
        </Text>
      </View>

      {/* Modal Variants Showcase */}
      <View style={styles.componentGroup}>
        <Text style={styles.subsectionTitle}>Modal Positioning Variants</Text>
        <Text style={styles.componentDescription}>
          CustomModal supports multiple positioning modes for different use cases:
          {'\n'}• Center: Standard dialog modals
          {'\n'}• Bottom: Mobile-friendly bottom sheets
          {'\n'}• Top: Notification or banner overlays
          {'\n'}• Fullscreen: Immersive content views
        </Text>
      </View>

      {/* Modal Usage Examples */}
      <View style={styles.componentGroup}>
        <Text style={styles.subsectionTitle}>Integration Notes</Text>
        <Text style={styles.componentDescription}>
          These modal components integrate seamlessly with the Academy theme system:
          {'\n'}• Automatic theme adaptation (light/dark/night modes)
          {'\n'}• Consistent typography and spacing
          {'\n'}• Academy brand colors and design tokens
          {'\n'}• Accessibility compliance (WCAG 2.1)
          {'\n'}• Safe area handling for modern devices
        </Text>
      </View>

      {/* Modal Implementations - Hidden */}
      <CustomModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        position="center"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Academy Design System</Text>
          <Text style={styles.modalText}>
            This modal demonstrates the Academy design system with center positioning, theme integration, and proper button layouts.
          </Text>
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
              onPress={() => setModalVisible(false)}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </CustomModal>

      <CustomModalWithDot
        visible={modalWithDotVisible}
        onClose={() => setModalWithDotVisible(false)}
        showCloseDot={true}
        swipeToClose={true}
        maxHeightPercentage={0.75}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Bottom Sheet Interface</Text>
          <Text style={styles.modalText}>
            This bottom sheet includes a close dot indicator and supports swipe-to-close gestures. 
            It's optimized for mobile interfaces with touch-friendly interactions.
          </Text>
          <View style={styles.modalButtons}>
            <CustomButton 
              title="Option 1" 
              variant="outline"
              onPress={() => console.log('Option 1 selected')}
              style={{ flex: 1 }}
            />
            <CustomButton 
              title="Done" 
              variant="primary"
              onPress={() => setModalWithDotVisible(false)}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </CustomModalWithDot>

      <BottomSheet
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        title="Enhanced Bottom Sheet"
        snapPoints={['medium', 'large']}
        initialSnapPoint="medium"
        closeOnBackdrop={true}
        showDragHandle={true}
        enablePanDownToClose={false}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Advanced Features</Text>
          <Text style={styles.modalText}>
            This enhanced bottom sheet features snap points for dynamic sizing, advanced gesture handling, 
            and provider-based state management. Try dragging the handle to resize.
          </Text>
          <View style={styles.modalButtons}>
            <CustomButton 
              title="Resize to Medium" 
              variant="outline"
              onPress={() => console.log('Resize requested')}
              style={{ flex: 1 }}
            />
            <CustomButton 
              title="Close" 
              variant="primary"
              onPress={() => setBottomSheetVisible(false)}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );

  const renderAlerts = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Alert Components</Text>
      <Text style={styles.sectionDescription}>
        Interactive alert system with multiple types and modern animation
      </Text>
      
      <Text style={styles.subsectionTitle}>Modern Alert Component</Text>
      <View style={styles.componentGrid}>
        <CustomButton 
          title="Show Success Alert" 
          variant="success"
          size="sm"
          onPress={() => showAlert('success')} 
        />
        
        <CustomButton 
          title="Show Error Alert" 
          variant="danger"
          size="sm"
          onPress={() => showAlert('error')} 
        />

        <CustomButton 
          title="Show Warning Alert" 
          variant="warning"
          size="sm"
          onPress={() => showAlert('warning')} 
        />

        <CustomButton 
          title="Show Info Alert" 
          variant="info"
          size="sm"
          onPress={() => showAlert('info')} 
        />
      </View>

      <Text style={styles.subsectionTitle}>Alert Variants Preview</Text>
      <Text style={styles.sectionDescription}>
        Static preview of alert variants (non-interactive)
      </Text>
      <View style={styles.alertPreviewContainer}>
        <View style={styles.alertPreview}>
          <View style={[styles.alertPreviewItem, { backgroundColor: theme.colors.status.successBackground, borderColor: theme.colors.status.successBorder }]}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.status.success} />
            <View style={styles.alertPreviewText}>
              <Text style={[styles.alertPreviewTitle, { color: theme.colors.text.primary }]}>Success Alert</Text>
              <Text style={[styles.alertPreviewMessage, { color: theme.colors.text.primary }]}>Operation completed successfully!</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.alertPreview}>
          <View style={[styles.alertPreviewItem, { backgroundColor: theme.colors.status.errorBackground, borderColor: theme.colors.status.errorBorder }]}>
            <Ionicons name="close-circle" size={20} color={theme.colors.status.error} />
            <View style={styles.alertPreviewText}>
              <Text style={[styles.alertPreviewTitle, { color: theme.colors.text.primary }]}>Error Alert</Text>
              <Text style={[styles.alertPreviewMessage, { color: theme.colors.text.primary }]}>Something went wrong. Please try again.</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.alertPreview}>
          <View style={[styles.alertPreviewItem, { backgroundColor: theme.colors.status.warningBackground, borderColor: theme.colors.status.warningBorder }]}>
            <Ionicons name="warning" size={20} color={theme.colors.status.warning} />
            <View style={styles.alertPreviewText}>
              <Text style={[styles.alertPreviewTitle, { color: theme.colors.text.primary }]}>Warning Alert</Text>
              <Text style={[styles.alertPreviewMessage, { color: theme.colors.text.primary }]}>This action requires attention.</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.alertPreview}>
          <View style={[styles.alertPreviewItem, { backgroundColor: theme.colors.status.infoBackground, borderColor: theme.colors.status.infoBorder }]}>
            <Ionicons name="information-circle" size={20} color={theme.colors.status.info} />
            <View style={styles.alertPreviewText}>
              <Text style={[styles.alertPreviewTitle, { color: theme.colors.text.primary }]}>Information Alert</Text>
              <Text style={[styles.alertPreviewMessage, { color: theme.colors.text.primary }]}>Here's some helpful information.</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.subsectionTitle}>Interactive Alert Testing</Text>
      <Text style={styles.sectionDescription}>
        Click the buttons above to test interactive alerts with animations and positioning. 
        Alerts will appear at the top of the screen with proper theming and auto-dismiss functionality.
      </Text>
      
      {/* Note: Interactive alerts are rendered globally and positioned absolutely at the screen level */}
      {/* They appear above this component when triggered by the buttons above */}
    </View>
  );

  const renderLoaders = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Loading Components</Text>
      <Text style={styles.sectionDescription}>
        Loading indicators and spinners with Academy theming
      </Text>
      
      <Text style={styles.subsectionTitle}>Loading Spinner Variants</Text>
      <View style={styles.componentGrid}>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <LoadingSpinner size="small" />
          <Text style={styles.componentDescription}>Small</Text>
        </View>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <LoadingSpinner size="medium" />
          <Text style={styles.componentDescription}>Medium</Text>
        </View>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <LoadingSpinner size="large" />
          <Text style={styles.componentDescription}>Large</Text>
        </View>
      </View>

      <Text style={styles.subsectionTitle}>Loading States</Text>
      <View style={styles.componentGrid}>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <LoadingSpinner color={theme.colors.interactive.primary} />
          <Text style={styles.componentDescription}>Academy Purple</Text>
        </View>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <LoadingSpinner color={theme.colors.status.success} />
          <Text style={styles.componentDescription}>Success Green</Text>
        </View>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <LoadingSpinner color={theme.colors.status.warning} />
          <Text style={styles.componentDescription}>Warning Orange</Text>
        </View>
      </View>

      <Text style={styles.subsectionTitle}>Loading with Text</Text>
      <View style={{ alignItems: 'center', padding: 20 }}>
        <LoadingSpinner size="medium" />
        <Text style={[styles.componentDescription, { marginTop: 8 }]}>Loading content...</Text>
      </View>
    </View>
  );

  const renderNavigation = () => (
    <View style={styles.navigation}>
      {(['buttons', 'inputs', 'modals', 'alerts', 'loaders'] as const).map((section) => (
        <Pressable 
          key={section}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, [
            styles.navItem,
            currentSection === section && styles.navItemActive,
          ]]}
          onPress={() => setCurrentSection(section)}
        >
          <Text style={[
            styles.navText,
            currentSection === section && styles.navTextActive,
          ]}>
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'buttons':
        return renderButtons();
      case 'inputs':
        return renderInputs();
      case 'modals':
        return renderModals();
      case 'alerts':
        return renderAlerts();
      case 'loaders':
        return renderLoaders();
      default:
        return renderButtons();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Academy Design System</Text>
        <Text style={styles.subtitle}>Component Showcase</Text>
      </View>

      {renderThemeSelector()}
      {renderNavigation()}

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentSection()}
      </ScrollView>
    </SafeAreaView>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },

    header: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },

    title: {
      ...theme.typography.heading.h2,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },

    subtitle: {
      ...theme.typography.body.base,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing[1],
    },

    section: {
      marginBottom: theme.spacing[6],
    },

    sectionTitle: {
      ...theme.typography.heading.h4,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[4],
    },

    sectionDescription: {
      ...theme.typography.body.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[4],
    },

    subsectionTitle: {
      ...theme.typography.heading.h6,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[3],
    },

    themeSelector: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
    },

    themeOption: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },

    themeOptionActive: {
      backgroundColor: theme.colors.interactive.primary,
      borderColor: theme.colors.interactive.primary,
    },

    themeOptionText: {
      ...theme.typography.button.sm,
      color: theme.colors.text.primary,
    },

    themeOptionTextActive: {
      color: theme.colors.text.inverse,
    },

    navigation: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },

    navItem: {
      flex: 1,
      paddingVertical: theme.spacing[2],
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },

    navItemActive: {
      borderBottomColor: theme.colors.interactive.primary,
    },

    navText: {
      ...theme.typography.button.sm,
      color: theme.colors.text.secondary,
    },

    navTextActive: {
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },

    content: {
      flex: 1,
    },

    contentContainer: {
      padding: theme.spacing[4],
    },

    componentGrid: {
      gap: theme.spacing[3],
    },

    componentGroup: {
      marginBottom: theme.spacing[5],
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[3],
      borderWidth: 1,
      borderColor: theme.colors.border.secondary,
    },

    componentTitle: {
      ...theme.typography.heading.h6,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },

    modalContent: {
      alignItems: 'center',
    },

    modalTitle: {
      ...theme.typography.heading.h4,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[3],
      textAlign: 'center',
    },

    modalText: {
      ...theme.typography.body.base,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing[4],
    },

    modalButtons: {
      flexDirection: 'row',
      gap: theme.spacing[3],
      width: '100%',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },

    alertPreviewContainer: {
      gap: theme.spacing[3],
      marginTop: theme.spacing[2],
    },

    alertPreview: {
      marginBottom: theme.spacing[2],
    },

    alertPreviewItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
    },

    alertPreviewText: {
      flex: 1,
      marginLeft: theme.spacing[3],
    },

    alertPreviewTitle: {
      ...theme.typography.heading.h6,
      marginBottom: theme.spacing[1],
    },

    alertPreviewMessage: {
      ...theme.typography.body.sm,
    },

    componentDescription: {
      ...theme.typography.body.sm,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[2],
      lineHeight: 20,
      fontStyle: 'italic',
    },

    alertExample: {
      marginTop: theme.spacing[4],
      position: 'relative',
      minHeight: 100,
    },
  })
);

export default DesignSystemShowcase;