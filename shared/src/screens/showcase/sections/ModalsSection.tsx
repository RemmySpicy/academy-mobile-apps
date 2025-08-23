import React, { useState } from 'react';
import { View, Text } from 'react-native';

// Components
import { CustomButton } from '../../../components/forms/CustomButton';
import { OnboardingModal } from '../../../components/auth';

// Types
import { ShowcaseSectionProps } from '../types/showcaseTypes';

const ModalsSection: React.FC<ShowcaseSectionProps> = ({ theme, styles }) => {
  // Modal demo states
  const [onboardingModalVisible, setOnboardingModalVisible] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🔐 Authentication & Modal Components</Text>
      <Text style={styles.sectionDescription}>
        Complete authentication system with social login options, onboarding flows, and modal implementations.
        All components support Academy theming and multi-program context.
      </Text>

      {/* OnboardingModal - Authentication Feature */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>OnboardingModal (User Authentication)</Text>
        <View style={{ gap: 12 }}>
          <CustomButton 
            title="Show Onboarding Modal"
            onPress={() => setOnboardingModalVisible(true)}
            variant="primary"
          />
          
          <OnboardingModal
            visible={onboardingModalVisible}
            onClose={() => setOnboardingModalVisible(false)}
            onLogin={() => {
              setOnboardingModalVisible(false);
              console.log('Navigate to login');
            }}
            onSignup={() => {
              setOnboardingModalVisible(false);
              console.log('Navigate to signup');
            }}
            title="Welcome to Academy"
            subtitle="Choose how you'd like to get started with your swimming journey"
            showSocialAuth={true}
            socialAuthConfig={{
              enableGoogle: true,
              enableApple: true,
              enableFacebook: true,
            }}
          />
        </View>
        <Text style={styles.componentDescription}>
          Complete authentication modal with social login options, customizable branding, and Academy theming for user onboarding flows
        </Text>
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>💡 Authentication Components Reference</Text>
        <Text style={styles.componentDescription}>
          Complete authentication system including login forms, social auth buttons, and form validation 
          can be found in the dedicated FormExamplesScreen accessible via the Forms tab.
          {'\n\n'}Authentication components available in FormExamplesScreen:
          {'\n'}• LoginForm - Complete login interface with validation
          {'\n'}• GoogleSignInButton, AppleSignInButton, FacebookSignInButton
          {'\n'}• SocialAuthGroup - Collection of social auth options
          {'\n'}• Form validation with react-hook-form integration
        </Text>
      </View>

      <Text style={styles.subsectionTitle}>Additional Feature Modals</Text>
      <Text style={styles.componentDescription}>
        Other feature-specific modals are demonstrated in their respective sections:
        {'\n'}• StudentProfile modal → Student Components section
        {'\n'}• PerformanceTimes modal → Performance Components section
        {'\n'}• ClassroomGrading modal → Academy Components section
        {'\n\n'}Basic modal components (CustomModal, CustomModalWithDot, BottomSheet) are available in the Design System Showcase.
      </Text>
    </View>
  );
};

export default ModalsSection;