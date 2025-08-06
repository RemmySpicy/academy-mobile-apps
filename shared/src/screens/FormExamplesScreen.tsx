import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { Iconify } from 'react-native-iconify';

// Theme
import { useTheme, createThemedStyles } from '../theme/ThemeProvider';

// Components
import CustomInput from '../components/forms/CustomInput';
import CustomButton from '../components/forms/CustomButton';
import CustomCheckBox from '../components/forms/CustomCheckBox';

// Form Types
interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  notifications: boolean;
  marketing: boolean;
}

interface FeedbackForm {
  rating: string;
  feedback: string;
  anonymous: boolean;
  followUp: boolean;
}

const FormExamplesScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  // Login Form
  const loginForm = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Profile Form
  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      notifications: true,
      marketing: false,
    },
  });

  // Feedback Form
  const feedbackForm = useForm<FeedbackForm>({
    defaultValues: {
      rating: '',
      feedback: '',
      anonymous: false,
      followUp: true,
    },
  });

  const onLoginSubmit = (data: LoginForm): void => {
    Alert.alert('Login Form', JSON.stringify(data, null, 2));
  };

  const onProfileSubmit = (data: ProfileForm): void => {
    Alert.alert('Profile Form', JSON.stringify(data, null, 2));
  };

  const onFeedbackSubmit = (data: FeedbackForm): void => {
    Alert.alert('Feedback Form', JSON.stringify(data, null, 2));
  };

  const renderLoginForm = (): React.JSX.Element => (
    <View style={styles.formSection}>
      <Text style={styles.formTitle}>Login Form</Text>
      <Text style={styles.formDescription}>
        Academy-style login with validation and theming
      </Text>

      <View style={styles.form}>
        <Controller
          control={loginForm.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Email Address"
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              startIcon={<Iconify icon="ri:mail-line" size={20} color={theme.colors.text.tertiary} />}
              error={loginForm.formState.errors.email?.message}
            />
          )}
        />

        <Controller
          control={loginForm.control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              startIcon={<Iconify icon="ri:lock-line" size={20} color={theme.colors.text.tertiary} />}
              error={loginForm.formState.errors.password?.message}
            />
          )}
        />

        <Controller
          control={loginForm.control}
          name="rememberMe"
          render={({ field: { onChange, value } }) => (
            <CustomCheckBox
              label="Remember me"
              description="Keep me signed in on this device"
              value={value}
              onValueChange={onChange}
              variant="primary"
            />
          )}
        />

        <View style={styles.formActions}>
          <CustomButton
            title="Sign In"
            onPress={loginForm.handleSubmit(onLoginSubmit)}
            isLoading={loginForm.formState.isSubmitting}
            startIcon={<Iconify icon="ri:login-circle-line" size={16} color="white" />}
          />
          
          <CustomButton
            title="Forgot Password?"
            variant="outlineTheme"
            onPress={() => Alert.alert('Forgot Password', 'Reset password flow')}
          />
        </View>
      </View>
    </View>
  );

  const renderProfileForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.formTitle}>Profile Form</Text>
      <Text style={styles.formDescription}>
        Comprehensive user profile with various input types
      </Text>

      <View style={styles.form}>
        <View style={styles.formRow}>
          <View style={styles.formColumn}>
            <Controller
              control={profileForm.control}
              name="firstName"
              rules={{ required: 'First name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="First Name"
                  placeholder="John"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={profileForm.formState.errors.firstName?.message}
                />
              )}
            />
          </View>
          
          <View style={styles.formColumn}>
            <Controller
              control={profileForm.control}
              name="lastName"
              rules={{ required: 'Last name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Last Name"
                  placeholder="Doe"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={profileForm.formState.errors.lastName?.message}
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={profileForm.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Email Address"
              placeholder="john.doe@academy.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              startIcon={<Iconify icon="ri:mail-line" size={20} color={theme.colors.text.tertiary} />}
              error={profileForm.formState.errors.email?.message}
            />
          )}
        />

        <Controller
          control={profileForm.control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Phone Number"
              placeholder="+1 (555) 123-4567"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="phone-pad"
              startIcon={<Iconify icon="ri:phone-line" size={20} color={theme.colors.text.tertiary} />}
            />
          )}
        />

        <Controller
          control={profileForm.control}
          name="bio"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Bio"
              placeholder="Tell us about yourself..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
            />
          )}
        />

        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <Controller
          control={profileForm.control}
          name="notifications"
          render={({ field: { onChange, value } }) => (
            <CustomCheckBox
              label="Push Notifications"
              description="Receive important updates and reminders"
              value={value}
              onValueChange={onChange}
              variant="primary"
            />
          )}
        />

        <Controller
          control={profileForm.control}
          name="marketing"
          render={({ field: { onChange, value } }) => (
            <CustomCheckBox
              label="Marketing Communications"
              description="Receive newsletters and promotional content"
              value={value}
              onValueChange={onChange}
              variant="info"
            />
          )}
        />

        <View style={styles.formActions}>
          <CustomButton
            title="Update Profile"
            onPress={profileForm.handleSubmit(onProfileSubmit)}
            isLoading={profileForm.formState.isSubmitting}
            startIcon={<Iconify icon="ri:save-line" size={16} color="white" />}
          />
          
          <CustomButton
            title="Cancel"
            variant="outline"
            onPress={() => profileForm.reset()}
          />
        </View>
      </View>
    </View>
  );

  const renderFeedbackForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.formTitle}>Feedback Form</Text>
      <Text style={styles.formDescription}>
        Academy feedback collection with rating and preferences
      </Text>

      <View style={styles.form}>
        <Controller
          control={feedbackForm.control}
          name="rating"
          rules={{ required: 'Please select a rating' }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text style={styles.fieldLabel}>Overall Rating</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <CustomButton
                    key={rating}
                    title={rating.toString()}
                    variant={value === rating.toString() ? 'primary' : 'outline'}
                    size="sm"
                    onPress={() => onChange(rating.toString())}
                    style={styles.ratingButton}
                  />
                ))}
              </View>
              {feedbackForm.formState.errors.rating && (
                <Text style={styles.errorText}>
                  {feedbackForm.formState.errors.rating.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={feedbackForm.control}
          name="feedback"
          rules={{ required: 'Feedback is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Your Feedback"
              placeholder="Share your thoughts about the Academy experience..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={5}
              error={feedbackForm.formState.errors.feedback?.message}
            />
          )}
        />

        <Controller
          control={feedbackForm.control}
          name="anonymous"
          render={({ field: { onChange, value } }) => (
            <CustomCheckBox
              label="Submit Anonymously"
              description="Your identity will not be shared with this feedback"
              value={value}
              onValueChange={onChange}
              variant="secondary"
            />
          )}
        />

        <Controller
          control={feedbackForm.control}
          name="followUp"
          render={({ field: { onChange, value } }) => (
            <CustomCheckBox
              label="Allow Follow-up"
              description="We may contact you for additional questions"
              value={value}
              onValueChange={onChange}
              variant="info"
            />
          )}
        />

        <View style={styles.formActions}>
          <CustomButton
            title="Submit Feedback"
            variant="orange" // Academy orange for emphasis
            onPress={feedbackForm.handleSubmit(onFeedbackSubmit)}
            isLoading={feedbackForm.formState.isSubmitting}
            startIcon={<Iconify icon="ri:send-plane-line" size={16} color={theme.colors.interactive.themeBlack} />}
          />
          
          <CustomButton
            title="Reset Form"
            variant="gray"
            onPress={() => feedbackForm.reset()}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Form Examples</Text>
        <Text style={styles.subtitle}>Academy components in real forms</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderLoginForm()}
        {renderProfileForm()}
        {renderFeedbackForm()}
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

    content: {
      flex: 1,
    },

    contentContainer: {
      padding: theme.spacing[4],
    },

    formSection: {
      marginBottom: theme.spacing[8],
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
    },

    formTitle: {
      ...theme.typography.heading.h3,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },

    formDescription: {
      ...theme.typography.body.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[4],
    },

    form: {
      gap: theme.spacing[4],
    },

    formRow: {
      flexDirection: 'row',
      gap: theme.spacing[3],
    },

    formColumn: {
      flex: 1,
    },

    formActions: {
      gap: theme.spacing[3],
      marginTop: theme.spacing[2],
    },

    sectionTitle: {
      ...theme.typography.heading.h5,
      color: theme.colors.text.primary,
      marginTop: theme.spacing[2],
      marginBottom: theme.spacing[2],
    },

    fieldLabel: {
      ...theme.typography.body.base,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginBottom: theme.spacing[2],
    },

    ratingContainer: {
      flexDirection: 'row',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[2],
    },

    ratingButton: {
      flex: 0,
      minWidth: 44,
    },

    errorText: {
      ...theme.typography.caption.base,
      color: theme.colors.status.error,
      marginTop: theme.spacing[1],
    },
  })
);

export default FormExamplesScreen;