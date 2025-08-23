import React from 'react';
import { View, Text } from 'react-native';
import { ShowcaseSectionProps } from '../types/showcaseTypes';

export const OverviewSection: React.FC<ShowcaseSectionProps> = ({ theme, styles }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>🎨 Academy Components Library</Text>
    <Text style={styles.sectionDescription}>
      Complete component library for Academy Apps with 85+ components, utilities, and hooks.
      Supports multi-program academies (swimming, football, basketball, music, coding) with
      unified theming, accessibility, and React 19 compatibility.
    </Text>

    <View style={styles.statsGrid}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>40</Text>
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
        <Text style={styles.statNumber}>8</Text>
        <Text style={styles.statLabel}>Authentication</Text>
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
    <Text style={styles.featureText}>
      • Complete component extraction from existing code finished
    </Text>
    <Text style={styles.featureText}>
      • 85+ components with TypeScript interfaces and utility functions
    </Text>
    <Text style={styles.featureText}>
      • Modern chart system (React 19 compatible)
    </Text>
    <Text style={styles.featureText}>
      • Full Academy theming and multi-program support
    </Text>
    <Text style={styles.featureText}>
      • Production-ready with zero TypeScript errors
    </Text>

    <Text style={styles.subsectionTitle}>🎯 Component Categories</Text>
    <View style={styles.categoryGrid}>
      <View style={styles.categoryCard}>
        <Text style={styles.categoryEmoji}>🎨</Text>
        <Text style={styles.categoryTitle}>UI Components</Text>
        <Text style={styles.categoryDescription}>Buttons, modals, alerts, bottom sheets, conditional rendering</Text>
      </View>
      <View style={styles.categoryCard}>
        <Text style={styles.categoryEmoji}>📝</Text>
        <Text style={styles.categoryTitle}>Forms</Text>
        <Text style={styles.categoryDescription}>Available in dedicated FormExamplesScreen</Text>
      </View>
      <View style={styles.categoryCard}>
        <Text style={styles.categoryEmoji}>🏊</Text>
        <Text style={styles.categoryTitle}>Academy</Text>
        <Text style={styles.categoryDescription}>Student cards, classrooms, performance</Text>
      </View>
      <View style={styles.categoryCard}>
        <Text style={styles.categoryEmoji}>🔍</Text>
        <Text style={styles.categoryTitle}>Search</Text>
        <Text style={styles.categoryDescription}>Search bars, filters, navigation</Text>
      </View>
      <View style={styles.categoryCard}>
        <Text style={styles.categoryEmoji}>📅</Text>
        <Text style={styles.categoryTitle}>Calendar</Text>
        <Text style={styles.categoryDescription}>Date pickers, scheduling, events</Text>
      </View>
      <View style={styles.categoryCard}>
        <Text style={styles.categoryEmoji}>📊</Text>
        <Text style={styles.categoryTitle}>Charts</Text>
        <Text style={styles.categoryDescription}>Performance data, analytics, metrics</Text>
      </View>
    </View>

    <Text style={styles.subsectionTitle}>🚀 Getting Started</Text>
    <View style={styles.codeBlock}>
      <Text style={styles.codeText}>
        {`import { 
  CustomButton, CustomInput, StudentCard, 
  PerformanceChart, TabBar, Chip 
} from '@academy/mobile-shared';`}
      </Text>
    </View>

    <Text style={styles.featureText}>
      Navigate through the sections above to explore all components with live examples,
      code snippets, and Academy-specific usage patterns.
    </Text>
  </View>
);