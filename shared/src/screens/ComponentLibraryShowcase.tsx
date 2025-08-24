import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert as RNAlert, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Theme
import { useTheme, createThemedStyles } from '../theme';

// Our newly extracted components
import { ToggleCard, ControlCard, FilterComponent, OptionMenu, TabBar, StrokeTab, SegmentedControl, IconTabBar, Alert as ToastAlert, MenuList, MetricPool, Stations, LoadingSpinner, NotificationList } from '../components/ui';
import { EmptySearchResult } from '../components/ui/EmptySearchResult';
import { SelectOptions, SelectOption } from '../components/ui/SelectOptions';
import { FormDropdown, DropdownOption } from '../components/ui/FormDropdown';
import { HeaderComponent } from '../components/ui/HeaderComponent';

// Showcase Sections
import UIComponentsSection from './showcase/sections/UIComponentsSection';
import SearchSection from './showcase/sections/SearchSection';
import CalendarSection from './showcase/sections/CalendarSection';
import PerformanceSection from './showcase/sections/PerformanceSection';
import AcademySection from './showcase/sections/AcademySection';
import ModalsSection from './showcase/sections/ModalsSection';
import SchedulingSection from './showcase/sections/SchedulingSection';
import StudentSection from './showcase/sections/StudentSection';
import AdvancedSection from './showcase/sections/AdvancedSection';
import HooksSection from './showcase/sections/HooksSection';
import HeaderSection from './showcase/sections/HeaderSection';

// Phase 4: Enhanced UI Components
import { CustomButton } from '../components/forms/CustomButton';

// Search System Components
import { Chip } from '../components/ui/Chip';

// Hooks
import { useScreenDimensions } from '../hooks/useScreenDimensions';

type ShowcaseSection = 
  | 'overview'
  | 'ui' 
  | 'modals'
  | 'headers'
  | 'search' 
  | 'calendar' 
  | 'performance' 
  | 'scheduling'
  | 'student'
  | 'academy'
  | 'advanced'
  | 'hooks';

const ComponentLibraryShowcase: React.FC = () => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const styles = useThemedStyles();
  const screenDimensions = useScreenDimensions();

  // Component states for demo
  const [currentSection, setCurrentSection] = useState<ShowcaseSection>('overview');

  const renderNavigation = () => (
    <View style={styles.navigation}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navScrollContent}
      >
        {(['overview', 'ui', 'modals', 'headers', 'search', 'calendar', 'performance', 'scheduling', 'student', 'academy', 'advanced', 'hooks'] as const).map((section) => (
          <Chip
            key={section}
            label={section.charAt(0).toUpperCase() + section.slice(1)}
            value={section}
            selected={currentSection === section}
            onPress={(value) => setCurrentSection(value as ShowcaseSection)}
            variant="primary"
            size="md"
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎨 Academy Components Library</Text>
      <Text style={styles.sectionDescription}>
        Complete component library for Academy Apps with 80+ components, utilities, and hooks.
        Supports multi-program academies (swimming, football, basketball, music, coding) with
        unified theming, accessibility, and React 19 compatibility.
      </Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>35</Text>
          <Text style={styles.statLabel}>Core UI Components</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>15</Text>
          <Text style={styles.statLabel}>Form Components</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Academy-Specific</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Header Components</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Search & Navigation</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Calendar & Scheduling</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>10+</Text>
          <Text style={styles.statLabel}>Performance & Charts</Text>
        </View>
      </View>

      <Text style={styles.subsectionTitle}>✅ Phase 5 Features</Text>
      <View style={styles.featureList}>
        <Text style={styles.featureItem}>• 83+ Production-ready components</Text>
        <Text style={styles.featureItem}>• Advanced notification management</Text>
        <Text style={styles.featureItem}>• Comprehensive metrics & analytics</Text>
        <Text style={styles.featureItem}>• Student grouping & classroom management</Text>
        <Text style={styles.featureItem}>• Enhanced onboarding flows</Text>
        <Text style={styles.featureItem}>• Zero TypeScript errors across all components</Text>
        <Text style={styles.featureItem}>• Academy Design System integration</Text>
        <Text style={styles.featureItem}>• Complete responsive mobile/tablet support</Text>
      </View>

      <Text style={styles.deviceInfo}>
        Current Device: {screenDimensions.isTablet ? 'Tablet' : 'Phone'} 
        ({screenDimensions.width}x{screenDimensions.height})
      </Text>
    </View>
  );











  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'overview':
        return renderOverview();
      case 'ui':
        return <UIComponentsSection theme={theme} styles={styles} screenDimensions={screenDimensions} />;
      case 'modals':
        return <ModalsSection theme={theme} styles={styles} screenDimensions={screenDimensions} />;
      case 'headers':
        return <HeaderSection theme={theme} styles={styles} screenDimensions={screenDimensions} />;
      case 'search':
        return <SearchSection theme={theme} styles={styles} screenDimensions={screenDimensions} />;
      case 'calendar':
        return <CalendarSection theme={theme} styles={styles} screenDimensions={screenDimensions} />;
      case 'performance':
        return <PerformanceSection theme={theme} styles={styles} screenDimensions={screenDimensions} />;
      case 'scheduling':
        return <SchedulingSection theme={theme} styles={styles} screenDimensions={screenDimensions} />;
      case 'student':
        return <StudentSection theme={theme} styles={styles} screenDimensions={screenDimensions} />;
      case 'academy':
        return <AcademySection theme={theme} styles={styles} screenDimensions={screenDimensions} />;
      case 'advanced':
        return <AdvancedSection theme={theme} styles={styles} screenDimensions={screenDimensions} />;
      case 'hooks':
        return <HooksSection theme={theme} styles={styles} screenDimensions={screenDimensions} />;
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>🎨 Component Library</Text>
            <Text style={styles.subtitle}>Academy Apps Design System</Text>
          </View>
          <View style={styles.themeSelector}>
            <CustomButton
              title={themeMode === 'system' ? '🌓' : themeMode === 'dark' ? '🌙' : themeMode === 'night' ? '🌚' : '☀️'}
              variant="outline"
              size="sm"
              onPress={toggleTheme}
              accessibilityLabel={`Current theme: ${themeMode}. Tap to cycle themes`}
              accessibilityHint="Cycles between light, dark, and night themes"
              style={styles.themeSelectorButton}
            />
          </View>
        </View>
      </View>

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
      backgroundColor: theme.colors.background.elevated,
      shadowColor: theme.colors.shadow.default,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },

    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 48,
    },

    headerContent: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: theme.spacing[12], // Leave space for absolute positioned theme selector
    },

    themeSelector: {
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: [{ translateY: -22 }], // Center vertically (half of button height)
    },

    themeSelectorButton: {
      minWidth: 44,
      minHeight: 44,
      paddingHorizontal: theme.spacing[2],
      borderRadius: theme.borderRadius.md,
    },

    title: {
      ...theme.typography.heading.h2,
      color: theme.colors.text.primary,
      textAlign: 'center',
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },

    subtitle: {
      ...theme.typography.body.base,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing[1],
      opacity: 0.8,
    },

    navigation: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.secondary,
    },

    navScrollContent: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      gap: theme.spacing[2],
    },


    content: {
      flex: 1,
    },

    contentContainer: {
      padding: theme.spacing[4],
    },

    section: {
      marginBottom: theme.spacing[6],
    },

    sectionTitle: {
      ...theme.typography.heading.h3,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[3],
    },

    sectionDescription: {
      ...theme.typography.body.base,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[4],
      lineHeight: 24,
    },

    subsectionTitle: {
      ...theme.typography.heading.h5,
      color: theme.colors.text.primary,
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[2],
    },

    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[4],
    },

    statCard: {
      flex: 1,
      minWidth: 100,
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },

    statNumber: {
      ...theme.typography.heading.h2,
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },

    statLabel: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing[1],
    },

    featureList: {
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      marginBottom: theme.spacing[4],
    },

    featureItem: {
      ...theme.typography.body.sm,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
      lineHeight: 20,
    },

    deviceInfo: {
      ...theme.typography.caption.base,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      fontStyle: 'italic',
    },

    cardContent: {
      ...theme.typography.body.base,
      color: theme.colors.text.secondary,
      lineHeight: 22,
    },

    demoText: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[2],
      fontFamily: 'monospace',
    },

    chipContainer: {
      flexDirection: 'row',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[3],
    },

    hookDemo: {
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      marginBottom: theme.spacing[3],
    },

    hookDescription: {
      ...theme.typography.body.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
    },

    dimensionInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[3],
    },

    successText: {
      ...theme.typography.body.base,
      color: theme.colors.status.success,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      textAlign: 'center',
    },

    // New component organization styles
    componentSection: {
      marginBottom: theme.spacing[6],
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
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

    componentDescription: {
      ...theme.typography.body.sm,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[2],
      lineHeight: 20,
      fontStyle: 'italic',
    },

    showcaseButton: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing[3],
      alignItems: 'center',
      justifyContent: 'center',
    },

    showcaseButtonText: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
  })
);

export default ComponentLibraryShowcase;