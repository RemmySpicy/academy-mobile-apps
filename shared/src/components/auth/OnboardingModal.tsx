import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme';
import { CustomButton } from '../forms/CustomButton';
import { SocialAuthGroup } from './index';

export interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
  title?: string;
  subtitle?: string;
  showSocialAuth?: boolean;
  socialAuthConfig?: {
    enableGoogle?: boolean;
    enableApple?: boolean;
    enableFacebook?: boolean;
  };
  backgroundImage?: string;
  logo?: string;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onClose,
  onLogin,
  onSignup,
  title = 'Welcome to Academy',
  subtitle = 'Choose how you\'d like to get started',
  showSocialAuth = true,
  socialAuthConfig = {
    enableGoogle: true,
    enableApple: true,
    enableFacebook: true,
  },
  backgroundImage,
  logo,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Background Image */}
        {backgroundImage && (
          <Image source={{ uri: backgroundImage }} style={styles.backgroundImage} />
        )}
        
        {/* Close Button */}
        <SafeAreaView style={styles.closeButtonContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Handle */}
          <View style={styles.handle} />
          
          {/* Logo */}
          {logo && (
            <View style={styles.logoContainer}>
              <Image source={{ uri: logo }} style={styles.logo} />
            </View>
          )}

          {/* Title & Subtitle */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <CustomButton
              title="Login"
              variant="outline"
              size="md"
              onPress={() => {
                onClose();
                onLogin();
              }}
              style={styles.actionButton}
            />
            
            <CustomButton
              title="Sign up"
              variant="primary"
              size="md"
              onPress={() => {
                onClose();
                onSignup();
              }}
              style={styles.actionButton}
            />
          </View>

          {/* Social Authentication */}
          {showSocialAuth && (
            <>
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <SocialAuthGroup
                providers={[
                  ...(socialAuthConfig.enableGoogle ? ['google' as const] : []),
                  ...(socialAuthConfig.enableApple ? ['apple' as const] : []),
                  ...(socialAuthConfig.enableFacebook ? ['facebook' as const] : []),
                ]}
                appleEnabled={socialAuthConfig.enableApple}
                onAuthSuccess={(provider, result) => console.log(`${provider} auth success:`, result)}
                onAuthError={(provider, error) => console.log(`${provider} auth error:`, error)}
                showGuestOption={false}
                spacing={12}
                variant="outline"
                size="medium"
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  closeButton: {
    backgroundColor: theme.colors.background.primary + 'CC',
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.sm,
  },
  contentContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    minHeight: '60%',
  },
  handle: {
    width: 100,
    height: 5,
    backgroundColor: theme.colors.border.secondary,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: theme.fontConfig.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.fontSizes.base * 1.5,
  },
  buttonsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    width: '100%',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.primary,
  },
  dividerText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.md,
  },
}));

export default OnboardingModal;