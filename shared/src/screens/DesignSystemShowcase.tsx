import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Theme
import { useTheme, createThemedStyles, ExtendedThemeMode } from '../theme/ThemeProvider';

// Components
import { CustomInput } from '../components/forms/CustomInput';
import { CustomButton } from '../components/forms/CustomButton';
import { CustomCheckBox } from '../components/forms/CustomCheckBox';
import CustomModal from '../components/ui/CustomModal';
import CustomAlert from '../components/ui/CustomAlert';

const DesignSystemShowcase: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const styles = useThemedStyles();

  // Component states for demo
  const [inputValue, setInputValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState<'buttons' | 'inputs' | 'modals' | 'alerts'>('buttons');

  const themeOptions: { label: string; value: ExtendedThemeMode }[] = [
    { label: '☀️ Light', value: 'light' },
    { label: '🌙 Dark', value: 'dark' },
    { label: '🌚 Night', value: 'night' },
    { label: '⚙️ System', value: 'system' },
  ];

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
      <Text style={styles.sectionTitle}>Button Variants</Text>
      
      <View style={styles.componentGrid}>
        <CustomButton title="Primary" variant="primary" onPress={() => {}} />
        <CustomButton title="Outline" variant="outline" onPress={() => {}} />
        <CustomButton title="Outline Theme" variant="outlineTheme" onPress={() => {}} />
        <CustomButton title="Faded" variant="faded" onPress={() => {}} />
        <CustomButton title="Orange" variant="orange" onPress={() => {}} />
        <CustomButton title="Danger" variant="danger" onPress={() => {}} />
        <CustomButton title="Gray" variant="gray" onPress={() => {}} />
        <CustomButton title="Black" variant="black" onPress={() => {}} />
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
      <Text style={styles.sectionTitle}>Input Components</Text>
      
      <View style={styles.componentGrid}>
        <CustomInput
          name="demo-text"
          label="Text Input"
          placeholder="Enter text..."
          value={inputValue}
          onChangeText={setInputValue}
        />
        
        <CustomInput
          name="demo-password"
          label="Password Input"
          placeholder="Enter password..."
          secureTextEntry
          value=""
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-email"
          label="Email Input"
          placeholder="Enter email..."
          keyboardType="email-address"
          value=""
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-disabled"
          label="Disabled Input"
          placeholder="Disabled..."
          disabled
          value=""
          onChangeText={() => {}}
        />

        <CustomInput
          name="demo-error"
          label="Error Input"
          placeholder="Has error..."
          value=""
          error="This field is required"
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
      <Text style={styles.sectionTitle}>Modal Components</Text>
      
      <View style={styles.componentGrid}>
        <CustomButton 
          title="Show Center Modal" 
          onPress={() => setModalVisible(true)} 
        />
      </View>

      <CustomModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        position="center"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Academy Modal</Text>
          <Text style={styles.modalText}>
            This modal adapts to the current theme and demonstrates the Academy design system.
          </Text>
          <View style={styles.modalButtons}>
            <CustomButton 
              title="Close" 
              variant="outline" 
              onPress={() => setModalVisible(false)} 
            />
            <CustomButton 
              title="Confirm" 
              onPress={() => setModalVisible(false)} 
            />
          </View>
        </View>
      </CustomModal>
    </View>
  );

  const renderAlerts = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Alert Components</Text>
      
      <View style={styles.componentGrid}>
        <CustomButton 
          title="Show Success Alert" 
          variant="success"
          onPress={() => {
            // In a real app, you'd use the notification store
            console.log('Show success alert');
          }} 
        />
        
        <CustomButton 
          title="Show Error Alert" 
          variant="danger"
          onPress={() => {
            console.log('Show error alert');
          }} 
        />

        <CustomButton 
          title="Show Warning Alert" 
          variant="orange"
          onPress={() => {
            console.log('Show warning alert');
          }} 
        />

        <CustomButton 
          title="Show Info Alert" 
          variant="gray"
          onPress={() => {
            console.log('Show info alert');
          }} 
        />
      </View>

      {/* Example alert component */}
      <View style={styles.alertExample}>
        <CustomAlert
          type="success"
          title="Success!"
          message="Your Academy design system is working perfectly across all themes."
          position="center"
          duration={0} // No auto dismiss for demo
          dismissible={false}
        />
      </View>
    </View>
  );

  const renderNavigation = () => (
    <View style={styles.navigation}>
      {(['buttons', 'inputs', 'modals', 'alerts'] as const).map((section) => (
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
    },

    alertExample: {
      marginTop: theme.spacing[4],
      position: 'relative',
      minHeight: 100,
    },
  })
);

export default DesignSystemShowcase;