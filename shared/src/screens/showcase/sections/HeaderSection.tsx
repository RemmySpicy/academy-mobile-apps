import React, { useState } from 'react';
import { View, Text, Alert as RNAlert } from 'react-native';
import { ShowcaseSectionProps } from '../types/showcaseTypes';

// Header Components
import Header from '../../../components/ui/Header';
import { SimpleHeader, NavigationHeader, CustomHeader } from '../../../components/ui/HeaderComponent';
import { ProgramHeader } from '../../../components/program/ProgramHeader';
import { ProgramSelector } from '../../../components/program/ProgramSelector';

// UI Components for custom headers
import { CustomButton } from '../../../components/forms/CustomButton';
import { Ionicons } from '@expo/vector-icons';

interface HeaderSectionProps extends ShowcaseSectionProps {
  // Additional props if needed
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ theme, styles, screenDimensions }) => {
  const [notificationCount, setNotificationCount] = useState(3);

  // Mock avatar image
  const avatarSource = { uri: 'https://via.placeholder.com/100x100/4F2EC9/FFFFFF?text=JD' };

  const handleNotificationPress = () => {
    setNotificationCount(0);
    RNAlert.alert('Notifications', 'Viewed notifications');
  };

  const handleProfilePress = () => {
    RNAlert.alert('Profile', 'Profile pressed');
  };

  const handleBackPress = () => {
    RNAlert.alert('Navigation', 'Back button pressed');
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎯 Header Components</Text>
      
      {/* Main Header Component with Variants */}
      <Text style={styles.subsectionTitle}>Header (Main Component)</Text>
      
      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Default Header</Text>
        <Header
          title="Academy Dashboard"
          testID="default-header"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Header with Program Switcher & Notifications</Text>
        <Header
          title="Student Dashboard"
          showProgramSwitcher={true}
          showNotifications={true}
          showProfile={false}
          onNotificationPress={handleNotificationPress}
          notificationCount={notificationCount}
          testID="program-switcher-header"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Header with Back Button</Text>
        <Header
          title="Student Profile"
          variant="withBack"
          onBack={handleBackPress}
          testID="back-header"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Header with Notifications</Text>
        <Header
          title="My Classes"
          variant="withNotification"
          onNotificationPress={handleNotificationPress}
          notificationCount={notificationCount}
          testID="notification-header"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Header with Program Info</Text>
        <Header
          title="Swimming Academy"
          variant="withProgram"
          showProgramInfo={true}
          testID="program-header"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Instructor Header (Full Features)</Text>
        <Header
          title="Instructor Dashboard"
          variant="instructor"
          onNotificationPress={handleNotificationPress}
          notificationCount={notificationCount}
          onSearchPress={() => RNAlert.alert('Search', 'Search pressed')}
          onFilterPress={() => RNAlert.alert('Filter', 'Filter pressed')}
          onMorePress={() => RNAlert.alert('More', 'More options pressed')}
          onProfilePress={handleProfilePress}
          testID="instructor-header"
        />
      </View>

      {/* HeaderComponent Variants */}
      <Text style={styles.subsectionTitle}>HeaderComponent Variants</Text>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Simple Header</Text>
        <SimpleHeader
          title="Simple Academy Header"
          testID="simple-header"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Simple Header with Avatar</Text>
        <SimpleHeader
          title="John's Academy"
          avatarSource={avatarSource}
          onAvatarPress={handleProfilePress}
          testID="simple-avatar-header"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Navigation Header</Text>
        <NavigationHeader
          title="Course Details"
          onBackPress={handleBackPress}
          testID="nav-header"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Navigation Header with Notification</Text>
        <NavigationHeader
          title="My Schedule"
          onBackPress={handleBackPress}
          showNotification={true}
          onNotificationPress={handleNotificationPress}
          showNotificationBadge={notificationCount > 0}
          testID="nav-notification-header"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Navigation Header with Custom Actions</Text>
        <NavigationHeader
          title="Edit Profile"
          onBackPress={handleBackPress}
          rightActions={
            <CustomButton
              title="Save"
              variant="primary"
              size="sm"
              onPress={() => RNAlert.alert('Save', 'Changes saved')}
            />
          }
          testID="nav-actions-header"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Custom Header - Left Aligned</Text>
        <CustomHeader
          title="Custom Layout"
          leftContent={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons 
                name="star" 
                size={20} 
                color={theme.colors.interactive.primary} 
                style={{ marginRight: theme.spacing.xs }}
              />
              <Text style={{ color: theme.colors.text.secondary, fontSize: theme.fontSizes.caption }}>
                4.8
              </Text>
            </View>
          }
          rightContent={
            <View style={{ flexDirection: 'row', gap: theme.spacing.xs }}>
              <Ionicons 
                name="search-outline" 
                size={24} 
                color={theme.colors.icon.primary} 
              />
              <Ionicons 
                name="filter-outline" 
                size={24} 
                color={theme.colors.icon.primary} 
              />
            </View>
          }
          testID="custom-left-header"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Custom Header - Centered</Text>
        <CustomHeader
          title="Centered Title"
          centerTitle={true}
          leftContent={
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={theme.colors.icon.primary} 
            />
          }
          rightContent={
            <Ionicons 
              name="bookmark-outline" 
              size={24} 
              color={theme.colors.icon.primary} 
            />
          }
          testID="custom-center-header"
        />
      </View>

      {/* Program Header */}
      <Text style={styles.subsectionTitle}>Program Header</Text>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Program Header - Left Aligned</Text>
        <ProgramHeader
          showDescription={true}
          textAlign="left"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Program Header - Centered</Text>
        <ProgramHeader
          showDescription={true}
          textAlign="center"
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Program Header - Name Only</Text>
        <ProgramHeader
          showDescription={false}
          textAlign="left"
        />
      </View>

      {/* Program Selector */}
      <Text style={styles.subsectionTitle}>Program Selector</Text>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Button Variant</Text>
        <ProgramSelector
          variant="button"
          onProgramChange={(program) => {
            RNAlert.alert('Program Selected', `Switched to: ${program.name}`);
          }}
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Dropdown Variant</Text>
        <ProgramSelector
          variant="dropdown"
          onProgramChange={(program) => {
            RNAlert.alert('Program Selected', `Switched to: ${program.name}`);
          }}
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Card Variant (Recommended for Dashboards)</Text>
        <ProgramSelector
          variant="card"
          onProgramChange={(program) => {
            RNAlert.alert('Program Selected', `Switched to: ${program.name}`);
          }}
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Card with Custom Styling</Text>
        <ProgramSelector
          variant="card"
          showRefresh={true}
          style={{
            backgroundColor: theme.colors.background.elevated,
            borderColor: theme.colors.interactive.primary,
            borderWidth: 1,
          }}
          onProgramChange={(program) => {
            RNAlert.alert('Program Selected', `Switched to: ${program.name}`);
          }}
        />
      </View>

      {/* Usage Examples */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>📖 Header Usage Guide</Text>
        <Text style={[styles.demoText, { fontSize: theme.fontSizes.caption }]}>
          {`• **Header**: Full-featured component with variants (default, withBack, withNotification, withProgram, instructor)
• **SimpleHeader**: Basic header with optional avatar
• **NavigationHeader**: Header with back button and notification support
• **CustomHeader**: Flexible header with custom left/right content
• **ProgramHeader**: Program-specific headers with context
• **ProgramSelector**: Interactive program switching component

**New Header Features:**
- **showProgramSwitcher**: Adds compact program code button on left side
- Program button displays code like "SWIM" for Swimming Program
- Tap to open modal with all available programs
- Shows full program names in selection modal

**Program Selector Variants:**
- **button**: Simple button style for headers/toolbars
- **dropdown**: Dropdown style with arrow indicator
- **card**: Card style for dashboards (recommended)
- **integrated**: Built into Header component (new!)

**Best Practices:**
- Use Header with showProgramSwitcher for main app screens
- SimpleHeader for basic screens
- NavigationHeader for modal/detail screens
- CustomHeader for unique layouts
- ProgramHeader to show current program context
- Standalone ProgramSelector for settings/configuration screens`}
        </Text>
      </View>
    </View>
  );
};

export default HeaderSection;