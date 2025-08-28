import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme, CustomButton, CustomInput } from '@academy/mobile-shared';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emergencyContact: string;
  emergencyPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  profilePicture?: string;
  coverPhoto?: string;
  program: string;
  skillLevel: string;
  goals: string;
  medicalConditions: string;
}

export const EditProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@student.academy.com',
    phone: '+234 801 234 5678',
    dateOfBirth: '2005-03-15',
    emergencyContact: 'Sarah Johnson',
    emergencyPhone: '+234 802 345 6789',
    address: '123 Academy Street',
    city: 'Lagos',
    state: 'Lagos State',
    zipCode: '100001',
    program: 'Swimming',
    skillLevel: 'Intermediate',
    goals: 'Improve stroke technique and build endurance for competitive swimming',
    medicalConditions: 'None',
    // Optional: Add a sample cover photo URL
    // coverPhoto: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    Alert.alert(
      'Save Changes',
      'Are you sure you want to save these changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: () => {
            console.log('Profile updated:', profile);
            setHasChanges(false);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully!');
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              setIsEditing(false);
              setHasChanges(false);
              // Reset form to original values
            }
          }
        ]
      );
    } else {
      setIsEditing(false);
    }
  };

  const handleChangeProfilePicture = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => console.log('Take profile photo') },
        { text: 'Choose from Gallery', onPress: () => console.log('Choose profile from gallery') },
      ]
    );
  };

  const handleChangeCoverPhoto = () => {
    const options = [
      { text: 'Cancel', style: 'cancel' as const },
      { text: 'Take Photo', onPress: () => console.log('Take cover photo') },
      { text: 'Choose from Gallery', onPress: () => console.log('Choose cover from gallery') },
    ];

    // Only show remove option if cover photo exists
    if (profile.coverPhoto) {
      options.push({
        text: 'Remove Cover Photo',
        onPress: () => {
          handleInputChange('coverPhoto', '');
          console.log('Cover photo removed');
        },
        style: 'destructive' as const,
      });
    }

    Alert.alert('Change Cover Photo', 'Choose an option', options);
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: theme.spacing.lg,
          paddingHorizontal: theme.spacing.md,
          paddingBottom: theme.spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Photo & Profile Picture Section */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            marginBottom: theme.spacing.lg,
            position: 'relative',
          }}
        >
          {/* Cover Photo Container */}
          <View style={{
            height: 195, // Reduced by 25% from 260
            borderRadius: theme.borderRadius.xl,
            backgroundColor: profile.coverPhoto ? 'transparent' : `${theme.colors.interactive.primary}08`,
            overflow: 'hidden',
            position: 'relative',
            ...theme.elevation.lg,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
          }}>
            {/* Cover Photo */}
            {profile.coverPhoto ? (
              <Image 
                source={{ uri: profile.coverPhoto }}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  resizeMode: 'cover',
                }}
              />
            ) : (
              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${theme.colors.interactive.primary}12`,
                position: 'relative',
              }}>
                {/* Subtle pattern overlay */}
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'transparent',
                  opacity: 0.3,
                }} />
                <View style={{
                  width: 70, // Smaller to fit reduced height
                  height: 70,
                  borderRadius: 35,
                  backgroundColor: `${theme.colors.interactive.primary}25`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing.md, // Reduced spacing
                  borderWidth: 2,
                  borderColor: `${theme.colors.interactive.primary}40`,
                  ...theme.elevation.sm,
                }}>
                  <Ionicons 
                    name="image-outline" 
                    size={32} 
                    color={theme.colors.interactive.primary} 
                  />
                </View>
                <Text style={{
                  color: theme.colors.interactive.primary,
                  fontSize: theme.fontSizes.base, // Smaller font size
                  fontWeight: theme.fontConfig.fontWeight.semibold,
                  marginBottom: theme.spacing.xs,
                  textAlign: 'center',
                }}>
                  Add Cover Photo
                </Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.xs, // Smaller subtitle
                  textAlign: 'center',
                  paddingHorizontal: theme.spacing.sm,
                  lineHeight: theme.fontSizes.xs * 1.3, // Tighter line height
                }}>
                  Showcase your journey
                </Text>
              </View>
            )}
            
            {/* Gradient overlay for better contrast */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }} />
            
            
            {/* Cover Photo Edit Button */}
            {isEditing && (
              <Pressable
                style={{
                  position: 'absolute',
                  top: theme.spacing.lg,
                  right: theme.spacing.lg,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...theme.elevation.sm,
                }}
                onPress={handleChangeCoverPhoto}
              >
                <Ionicons name="camera" size={22} color="white" />
              </Pressable>
            )}
            
            
          </View>
          
          
          {/* Stats Section */}
          <View style={{
            backgroundColor: theme.colors.background.primary,
            marginTop: -theme.borderRadius.xl,
            borderBottomLeftRadius: theme.borderRadius.xl,
            borderBottomRightRadius: theme.borderRadius.xl,
            ...theme.elevation.md,
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: theme.colors.border.primary,
          }}>
            {/* Profile Picture with negative margin to overlap cover photo */}
            <View style={{
              paddingHorizontal: theme.spacing.lg,
              marginTop: -70, // More overlap with cover photo
              marginBottom: theme.spacing.lg,
            }}>
              {/* Profile Picture and Name Row */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: theme.spacing.md,
                paddingTop: theme.spacing.xl, // Move name down more from cover photo
              }}>
                {/* Profile Picture */}
                <View style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: theme.colors.interactive.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 6,
                  borderColor: theme.colors.background.secondary,
                  ...theme.elevation.xl,
                  shadowColor: theme.colors.interactive.primary,
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                  marginRight: theme.spacing.md, // More space for longer names
                }}>
                  {profile.profilePicture ? (
                    <Image 
                      source={{ uri: profile.profilePicture }}
                      style={{ width: 108, height: 108, borderRadius: 54 }}
                    />
                  ) : (
                    <Text style={{
                      color: 'white',
                      fontSize: 38,
                      fontWeight: theme.fontConfig.fontWeight.bold,
                      textShadowColor: 'rgba(0, 0, 0, 0.2)',
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 4,
                    }}>
                      {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                    </Text>
                  )}
                
                  {/* Profile Picture Edit Button */}
                  {isEditing && (
                    <Pressable
                      style={{
                        position: 'absolute',
                        bottom: 6,
                        right: 6,
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: theme.colors.interactive.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 4,
                        borderColor: theme.colors.background.secondary,
                        ...theme.elevation.lg,
                      }}
                      onPress={handleChangeProfilePicture}
                    >
                      <Ionicons name="camera" size={18} color="white" />
                    </Pressable>
                  )}
                </View>
              
                {/* User Name next to profile picture */}
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.fontSizes['2xl'],
                    fontWeight: theme.fontConfig.fontWeight.bold,
                    marginTop: theme.spacing.xl,
                  }}>
                    {profile.firstName} {profile.lastName}
                  </Text>
                </View>
              </View>
              
              {/* Program Info below profile picture */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start', // Align to left instead of center
                marginBottom: theme.spacing.sm, // Reduced spacing below program text
                paddingLeft: theme.spacing.xs, // Small left padding for alignment
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.colors.background.secondary,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.borderRadius.lg,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary,
                }}>
                  <Ionicons 
                    name="school" 
                    size={16} 
                    color={theme.colors.interactive.primary}
                    style={{ marginRight: theme.spacing.sm }}
                  />
                  <Text style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.fontSizes.base,
                    fontWeight: theme.fontConfig.fontWeight.semibold,
                  }}>
                    {profile.program} • {profile.skillLevel}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Stats Row */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingHorizontal: theme.spacing.lg,
              paddingBottom: theme.spacing.lg,
            }}>
            <View style={{ 
              alignItems: 'center',
              backgroundColor: theme.colors.background.secondary,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.sm,
              borderRadius: theme.borderRadius.lg,
              flex: 1,
              marginHorizontal: theme.spacing.xs,
              ...theme.elevation.xs,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}>
              <Text style={{
                color: theme.colors.interactive.primary,
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontConfig.fontWeight.bold,
                marginBottom: theme.spacing.xs,
              }}>
                12
              </Text>
              <Text 
                style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.xs,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  textAlign: 'center',
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Sessions
              </Text>
            </View>
            
            <View style={{ 
              alignItems: 'center',
              backgroundColor: theme.colors.background.secondary,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.sm,
              borderRadius: theme.borderRadius.lg,
              flex: 1,
              marginHorizontal: theme.spacing.xs,
              ...theme.elevation.xs,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}>
              <Text style={{
                color: theme.colors.interactive.primary,
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontConfig.fontWeight.bold,
                marginBottom: theme.spacing.xs,
              }}>
                3
              </Text>
              <Text 
                style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.xs,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  textAlign: 'center',
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Achievements
              </Text>
            </View>
            
            <View style={{ 
              alignItems: 'center',
              backgroundColor: theme.colors.background.secondary,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.sm,
              borderRadius: theme.borderRadius.lg,
              flex: 1,
              marginHorizontal: theme.spacing.xs,
              ...theme.elevation.xs,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}>
              <Text style={{
                color: theme.colors.interactive.primary,
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontConfig.fontWeight.bold,
                marginBottom: theme.spacing.xs,
              }}>
                85%
              </Text>
              <Text 
                style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.xs,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  textAlign: 'center',
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Progress
              </Text>
            </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        {!isEditing ? (
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={{
              marginBottom: theme.spacing.xl,
            }}
          >
            <CustomButton
              title="Edit Profile"
              variant="primary"
              size="lg"
              leftIcon="create"
              onPress={() => setIsEditing(true)}
              style={{ width: '100%' }}
            />
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={{
              flexDirection: 'row',
              gap: theme.spacing.md,
              marginBottom: theme.spacing.xl,
            }}
          >
            <CustomButton
              title="Cancel"
              variant="secondary"
              size="md"
              onPress={handleCancel}
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Save Changes"
              variant="primary"
              size="md"
              onPress={handleSave}
              style={{ flex: 1 }}
              disabled={!hasChanges}
            />
          </Animated.View>
        )}

        {/* Personal Information Section */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.xl,
            marginBottom: theme.spacing.lg,
            ...theme.elevation.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
          }}>
            <View style={{
              width: 4,
              height: 24,
              backgroundColor: theme.colors.interactive.primary,
              borderRadius: 2,
              marginRight: theme.spacing.md,
            }} />
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.xl,
              fontWeight: theme.fontConfig.fontWeight.bold,
              flex: 1,
            }}>
              Personal Information
            </Text>
            <Ionicons 
              name="person-outline" 
              size={24} 
              color={theme.colors.interactive.primary} 
            />
          </View>

          <View style={{ gap: theme.spacing.lg }}>
            <View style={{
              flexDirection: 'row',
              gap: theme.spacing.lg,
            }}>
              <View style={{ flex: 1 }}>
                <CustomInput
                  label="First Name"
                  value={profile.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  placeholder="Enter first name"
                  editable={isEditing}
                  containerStyle={!isEditing ? { opacity: 0.7 } : {}}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomInput
                  label="Last Name"
                  value={profile.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  placeholder="Enter last name"
                  editable={isEditing}
                  containerStyle={!isEditing ? { opacity: 0.7 } : {}}
                />
              </View>
            </View>

            <CustomInput
              label="Email Address"
              value={profile.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter email address"
              keyboardType="email-address"
              editable={isEditing}
              containerStyle={!isEditing ? { opacity: 0.7 } : {}}
            />

            <CustomInput
              label="Phone Number"
              value={profile.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              editable={isEditing}
              containerStyle={!isEditing ? { opacity: 0.7 } : {}}
            />

            <CustomInput
              label="Date of Birth"
              value={profile.dateOfBirth}
              onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              placeholder="YYYY-MM-DD"
              editable={isEditing}
              containerStyle={!isEditing ? { opacity: 0.7 } : {}}
            />
          </View>
        </Animated.View>

        {/* Emergency Contact Section */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.xl,
            marginBottom: theme.spacing.lg,
            ...theme.elevation.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
          }}>
            <View style={{
              width: 4,
              height: 24,
              backgroundColor: theme.colors.status.error,
              borderRadius: 2,
              marginRight: theme.spacing.md,
            }} />
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.xl,
              fontWeight: theme.fontConfig.fontWeight.bold,
              flex: 1,
            }}>
              Emergency Contact
            </Text>
            <Ionicons 
              name="medical-outline" 
              size={24} 
              color={theme.colors.status.error} 
            />
          </View>

          <View style={{ gap: theme.spacing.lg }}>
            <CustomInput
              label="Contact Name"
              value={profile.emergencyContact}
              onChangeText={(value) => handleInputChange('emergencyContact', value)}
              placeholder="Enter emergency contact name"
              editable={isEditing}
              containerStyle={!isEditing ? { opacity: 0.7 } : {}}
            />

            <CustomInput
              label="Contact Phone"
              value={profile.emergencyPhone}
              onChangeText={(value) => handleInputChange('emergencyPhone', value)}
              placeholder="Enter emergency contact phone"
              keyboardType="phone-pad"
              editable={isEditing}
              containerStyle={!isEditing ? { opacity: 0.7 } : {}}
            />
          </View>
        </Animated.View>

        {/* Address Section */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.xl,
            marginBottom: theme.spacing.lg,
            ...theme.elevation.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
          }}>
            <View style={{
              width: 4,
              height: 24,
              backgroundColor: theme.colors.status.success,
              borderRadius: 2,
              marginRight: theme.spacing.md,
            }} />
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.xl,
              fontWeight: theme.fontConfig.fontWeight.bold,
              flex: 1,
            }}>
              Address Information
            </Text>
            <Ionicons 
              name="location-outline" 
              size={24} 
              color={theme.colors.status.success} 
            />
          </View>

          <View style={{ gap: theme.spacing.lg }}>
            <CustomInput
              label="Street Address"
              value={profile.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="Enter street address"
              editable={isEditing}
              containerStyle={!isEditing ? { opacity: 0.7 } : {}}
            />

            <View style={{
              flexDirection: 'row',
              gap: theme.spacing.lg,
            }}>
              <View style={{ flex: 1 }}>
                <CustomInput
                  label="City"
                  value={profile.city}
                  onChangeText={(value) => handleInputChange('city', value)}
                  placeholder="Enter city"
                  editable={isEditing}
                  containerStyle={!isEditing ? { opacity: 0.7 } : {}}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomInput
                  label="ZIP Code"
                  value={profile.zipCode}
                  onChangeText={(value) => handleInputChange('zipCode', value)}
                  placeholder="Enter ZIP"
                  editable={isEditing}
                  containerStyle={!isEditing ? { opacity: 0.7 } : {}}
                />
              </View>
            </View>

            <CustomInput
              label="State"
              value={profile.state}
              onChangeText={(value) => handleInputChange('state', value)}
              placeholder="Enter state"
              editable={isEditing}
              containerStyle={!isEditing ? { opacity: 0.7 } : {}}
            />
          </View>
        </Animated.View>

        {/* Academy Information Section */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.xl,
            marginBottom: theme.spacing.lg,
            ...theme.elevation.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
          }}>
            <View style={{
              width: 4,
              height: 24,
              backgroundColor: theme.colors.interactive.primary,
              borderRadius: 2,
              marginRight: theme.spacing.md,
            }} />
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.xl,
              fontWeight: theme.fontConfig.fontWeight.bold,
              flex: 1,
            }}>
              Academy Information
            </Text>
            <Ionicons 
              name="school-outline" 
              size={24} 
              color={theme.colors.interactive.primary} 
            />
          </View>

          <View style={{ gap: theme.spacing.lg }}>
            <CustomInput
              label="Program"
              value={profile.program}
              onChangeText={(value) => handleInputChange('program', value)}
              placeholder="Enter program"
              editable={isEditing}
              containerStyle={!isEditing ? { opacity: 0.7 } : {}}
            />

            <CustomInput
              label="Skill Level"
              value={profile.skillLevel}
              onChangeText={(value) => handleInputChange('skillLevel', value)}
              placeholder="Enter skill level"
              editable={isEditing}
              containerStyle={!isEditing ? { opacity: 0.7 } : {}}
            />

            <CustomInput
              label="Goals"
              value={profile.goals}
              onChangeText={(value) => handleInputChange('goals', value)}
              placeholder="Enter your goals"
              multiline
              numberOfLines={3}
              editable={isEditing}
              containerStyle={!isEditing ? { opacity: 0.7 } : {}}
            />

            <CustomInput
              label="Medical Conditions"
              value={profile.medicalConditions}
              onChangeText={(value) => handleInputChange('medicalConditions', value)}
              placeholder="Enter any medical conditions"
              multiline
              numberOfLines={2}
              editable={isEditing}
              containerStyle={!isEditing ? { opacity: 0.7 } : {}}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};