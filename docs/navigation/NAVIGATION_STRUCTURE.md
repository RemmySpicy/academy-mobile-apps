# Navigation Structure

## Students App Navigation

### Main Navigation Structure

The Students App uses a **Tab-based navigation** with the following main sections:

#### 📱 Bottom Tab Navigator (`TabNavigator.tsx`)

| Tab | Icon | Feature | Description |
|-----|------|---------|-------------|
| **Home** | `home` | Home Screen | Dashboard with quick actions, recent activity |
| **Courses** | `school` | Course Management | Browse courses, view enrolled courses, progress |
| **Bookings** | `calendar` | Booking System | Schedule classes, view upcoming sessions |
| **Progress** | `trending-up` | Progress Tracking | View achievements, performance metrics |
| **Menu** | `menu` | App Menu | Settings, profile, support, and additional features |

#### 🔧 Menu Navigator (`MenuNavigator.tsx`)

The Menu tab contains a comprehensive **Stack Navigator** with the following sections:

##### Account Management
- **Edit Profile** - Update personal information and preferences
- **Payment Methods** - Manage billing and payment options
- **Settings** - App preferences and configurations

##### Academy Features
- **Our Courses** - Browse available courses and programs
- **Our Services** - View academy services and offerings
- **Achievements** - Track progress and earned badges
- **Store** - Academy merchandise and materials
- **Transactions** - Payment history and billing information
- **Referrals** - Invite friends and earn rewards
- **My Schedule** - Personal calendar and class timetable
- **Progress Report** - Detailed performance analytics
- **Locate Us** - Academy locations and contact information

##### Support & Help
- **Help & Support** - Comprehensive support center with:
  - **Help Center Tab**: Searchable knowledge base, FAQ, tutorials
  - **Get Support Tab**: Multiple contact options (email, phone, WhatsApp, live chat)
  - **Feedback Tab**: Send suggestions and report issues

##### Settings & Preferences
- **Notification Settings** - Configure push notifications and alerts
- **Privacy Settings** - Data privacy and security controls
- **App Settings** - Language, theme, and general preferences

### Navigation Features

#### 🎯 Key Navigation Patterns

1. **Type-Safe Navigation**
   ```typescript
   export type MenuStackParamList = {
     MenuMain: undefined;
     EditProfile: undefined;
     HelpAndSupport: undefined;
     // ... other routes
   };
   ```

2. **Academy Theme Integration**
   - Consistent Academy purple branding (`theme.colors.interactive.primary`)
   - Dark/Light theme support
   - Proper spacing and typography

3. **User Role Awareness**
   - Parent/Student mode switching
   - Role-based menu items (e.g., "Manage Children" for parents)

4. **Modal Navigation**
   - **Notifications Modal**: Accessible from all main screens via notification bell icons
   - Modal presentation with `slide_from_bottom` animation
   - Full-screen overlay with native dismissal gestures

#### 🔔 Notifications Modal System

The Notifications feature is implemented as a **modal navigation** accessible from all main screens:

**Navigation Structure:**
```typescript
// Main App Stack includes notifications modal
<Stack.Navigator>
  <Stack.Screen name="Main" component={TabNavigator} />
  <Stack.Screen 
    name="Notifications" 
    component={NotificationsNavigator}
    options={{
      presentation: 'modal',
      animation: 'slide_from_bottom',
    }}
  />
</Stack.Navigator>
```

**Access Points:**
- Header notification bells on all main tab screens
- Consistent navigation pattern: `navigation.navigate('Notifications')`
- Badge count updates and notification management

**User Experience:**
- Modal slides up from bottom with native animation
- Full-screen notification management interface
- Back navigation with gesture support
- Contextual notifications (instructor vs student content)

4. **Program Context**
   - Multi-program support with context switching
   - Program-specific features and content

#### 🚨 Recent Changes

##### Contact Us Consolidation (August 2025)
- **Removed**: Separate "Contact Us" page and navigation routes
- **Enhanced**: "Help & Support" page now includes comprehensive contact functionality
- **Benefits**: 
  - Reduced navigation complexity
  - Single source of truth for support
  - Enhanced user experience with multiple contact methods
  - Searchable help content alongside contact options

### Navigation Best Practices

1. **Consistent Theming**: Use `theme.colors.interactive.primary` for active states
2. **Proper TypeScript**: Define strict param lists for type safety
3. **Academy Patterns**: Follow established UI patterns and spacing
4. **Accessibility**: Include proper ARIA labels and navigation hints
5. **Performance**: Use React Navigation 6.x optimizations

### Future Navigation Enhancements

- **Deep Linking**: Support for direct navigation to specific features
- **Navigation History**: Enhanced back navigation patterns
- **Contextual Navigation**: Dynamic menu items based on user progress
- **Quick Actions**: Floating action buttons for common tasks

---

**Last Updated**: August 27, 2025  
**Navigation Version**: React Navigation 6.x with TypeScript  
**Status**: Production Ready ✅