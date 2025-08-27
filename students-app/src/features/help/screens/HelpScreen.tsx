import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme, SegmentedControl, SearchInput } from '@academy/mobile-shared';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  readTime: string;
  popular?: boolean;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  action: () => void;
  available?: boolean;
}

const HelpCategoryCard: React.FC<{ category: HelpCategory; index: number }> = ({
  category,
  index,
}) => {
  const { theme } = useTheme();
  
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      style={{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        ...theme.elevation.sm,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
      }}
    >
      <Pressable
        onPress={() => console.log('Navigate to category:', category.id)}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <View style={{
          width: 48,
          height: 48,
          backgroundColor: `${category.color}15`,
          borderRadius: theme.borderRadius.full,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}>
          <Ionicons
            name={category.icon}
            size={24}
            color={category.color}
          />
        </View>
        
        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.xs,
          }}>
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
              flex: 1,
            }}>
              {category.title}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.icon.tertiary}
            />
          </View>
          
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            marginBottom: theme.spacing.md,
            lineHeight: 22,
          }}>
            {category.description}
          </Text>
          
          <Text style={{
            color: category.color,
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontConfig.fontWeight.medium,
          }}>
            {category.articles.length} articles
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const HelpArticleCard: React.FC<{ article: HelpArticle; index: number }> = ({
  article,
  index,
}) => {
  const { theme } = useTheme();
  
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        ...theme.elevation.sm,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
      }}
    >
      <Pressable
        onPress={() => console.log('Open article:', article.id)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.xs,
          }}>
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.base,
              fontWeight: theme.fontConfig.fontWeight.medium,
              flex: 1,
            }}>
              {article.title}
            </Text>
            {article.popular && (
              <View style={{
                backgroundColor: theme.colors.status.warningBackground,
                paddingHorizontal: theme.spacing.xs,
                paddingVertical: 2,
                borderRadius: theme.borderRadius.full,
                marginLeft: theme.spacing.sm,
              }}>
                <Text style={{
                  color: theme.colors.status.warning,
                  fontSize: theme.fontSizes.xs,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  POPULAR
                </Text>
              </View>
            )}
          </View>
          
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
            marginBottom: theme.spacing.xs,
          }}>
            {article.description}
          </Text>
          
          <Text style={{
            color: theme.colors.text.tertiary,
            fontSize: theme.fontSizes.xs,
          }}>
            {article.readTime} read
          </Text>
        </View>
        
        <Ionicons
          name="chevron-forward"
          size={16}
          color={theme.colors.icon.tertiary}
          style={{ marginLeft: theme.spacing.sm }}
        />
      </Pressable>
    </Animated.View>
  );
};

const SupportOptionCard: React.FC<{ option: SupportOption; index: number }> = ({
  option,
  index,
}) => {
  const { theme } = useTheme();
  
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      style={{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        opacity: option.available === false ? 0.5 : 1,
        ...theme.elevation.sm,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
      }}
    >
      <Pressable
        onPress={option.action}
        disabled={option.available === false}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{
          width: 40,
          height: 40,
          backgroundColor: `${option.color}15`,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}>
          <Ionicons
            name={option.icon}
            size={20}
            color={option.color}
          />
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.base,
            fontWeight: theme.fontConfig.fontWeight.medium,
            marginBottom: 2,
          }}>
            {option.title}
            {option.available === false && (
              <Text style={{
                color: theme.colors.text.secondary,
                fontWeight: theme.fontConfig.fontWeight.normal,
                fontSize: theme.fontSizes.sm,
              }}>
                {' '}(Offline)
              </Text>
            )}
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
          }}>
            {option.description}
          </Text>
        </View>
        
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.icon.tertiary}
        />
      </Pressable>
    </Animated.View>
  );
};

export const HelpScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState('help');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // TODO: Implement actual search functionality
  };

  const tabs = [
    { id: 'help', title: 'Help Center' },
    { id: 'support', title: 'Get Support' },
    { id: 'feedback', title: 'Feedback' },
  ];

  const helpCategories: HelpCategory[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using Academy and setting up your account',
      icon: 'rocket',
      color: theme.colors.interactive.primary,
      articles: [
        {
          id: 'setup-profile',
          title: 'Setting up your profile',
          description: 'Complete your profile for a personalized experience',
          readTime: '3 min',
          popular: true,
        },
        {
          id: 'book-first-class',
          title: 'Booking your first class',
          description: 'Step-by-step guide to booking classes',
          readTime: '5 min',
        },
      ],
    },
    {
      id: 'account-billing',
      title: 'Account & Billing',
      description: 'Manage your account settings, payments, and subscriptions',
      icon: 'card',
      color: theme.colors.status.success,
      articles: [
        {
          id: 'payment-methods',
          title: 'Managing payment methods',
          description: 'Add, remove, or update your payment information',
          readTime: '2 min',
        },
        {
          id: 'billing-history',
          title: 'Viewing billing history',
          description: 'Access your transaction history and receipts',
          readTime: '2 min',
        },
      ],
    },
    {
      id: 'classes-booking',
      title: 'Classes & Booking',
      description: 'Everything about finding, booking, and managing classes',
      icon: 'calendar',
      color: theme.colors.interactive.accent,
      articles: [
        {
          id: 'cancel-reschedule',
          title: 'Canceling or rescheduling',
          description: 'Learn about our cancellation and rescheduling policies',
          readTime: '4 min',
          popular: true,
        },
        {
          id: 'class-types',
          title: 'Understanding class types',
          description: 'Different types of classes and what to expect',
          readTime: '6 min',
        },
      ],
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Solve common issues and technical problems',
      icon: 'construct',
      color: theme.colors.status.warning,
      articles: [
        {
          id: 'login-issues',
          title: 'Login and password issues',
          description: 'Resolve problems with signing in to your account',
          readTime: '3 min',
          popular: true,
        },
        {
          id: 'app-crashes',
          title: 'App crashes or freezes',
          description: 'Fix performance issues and crashes',
          readTime: '4 min',
        },
      ],
    },
  ];

  const supportOptions: SupportOption[] = [
    {
      id: 'live-chat',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: 'chatbubbles',
      color: theme.colors.interactive.primary,
      action: () => console.log('Open live chat'),
      available: true,
    },
    {
      id: 'email-support',
      title: 'Email Support',
      description: 'Send us an email and get a response within 24 hours',
      icon: 'mail',
      color: theme.colors.status.success,
      action: () => Linking.openURL('mailto:support@academy.com'),
      available: true,
    },
    {
      id: 'phone-support',
      title: 'Phone Support',
      description: 'Call us during business hours for immediate assistance',
      icon: 'call',
      color: theme.colors.interactive.accent,
      action: () => Linking.openURL('tel:(555)123-4567'),
      available: true,
    },
    {
      id: 'video-call',
      title: 'Video Support',
      description: 'Schedule a video call for complex issues',
      icon: 'videocam',
      color: theme.colors.interactive.purple,
      action: () => console.log('Schedule video call'),
      available: false,
    },
  ];

  const popularArticles = helpCategories
    .flatMap(cat => cat.articles)
    .filter(article => article.popular);

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      {/* Tab Navigation */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <SegmentedControl
          options={[
            { value: 'help', label: 'Help Center' },
            { value: 'support', label: 'Get Support' },
            { value: 'feedback', label: 'Feedback' }
          ]}
          selectedValue={selectedTab}
          onChange={setSelectedTab}
          variant="default"
          size="md"
          style={{
            backgroundColor: theme.colors.background.primary,
            marginHorizontal: theme.spacing.lg,
            marginTop: theme.spacing.lg,
          }}
        />
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {selectedTab === 'help' && (
          <>
            {/* Search Bar */}
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={{
                paddingHorizontal: theme.spacing.md,
                marginBottom: theme.spacing.xl,
              }}
            >
              <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onDebouncedSearch={handleSearch}
                placeholder="Search help articles..."
                size="md"
                debounceDelay={300}
                testID="help-search"
              />
            </Animated.View>

            {/* Popular Articles */}
            <View style={{ paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.xl }}>
              <Animated.Text
                entering={FadeInDown.delay(300).springify()}
                style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.lg,
                  fontWeight: theme.fontConfig.fontWeight.semibold,
                  marginBottom: theme.spacing.md,
                }}
              >
                Popular Articles
              </Animated.Text>
              
              {popularArticles.map((article, index) => (
                <HelpArticleCard
                  key={article.id}
                  article={article}
                  index={index}
                />
              ))}
            </View>

            {/* Help Categories */}
            <View style={{ paddingHorizontal: theme.spacing.md }}>
              <Animated.Text
                entering={FadeInDown.delay(400).springify()}
                style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.lg,
                  fontWeight: theme.fontConfig.fontWeight.semibold,
                  marginBottom: theme.spacing.md,
                }}
              >
                Browse by Category
              </Animated.Text>
              
              {helpCategories.map((category, index) => (
                <HelpCategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}
            </View>
          </>
        )}

        {selectedTab === 'support' && (
          <>
            {/* Support Header */}
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={{
                paddingHorizontal: theme.spacing.md,
                marginBottom: theme.spacing.xl,
                alignItems: 'center',
              }}
            >
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontConfig.fontWeight.bold,
                textAlign: 'center',
                marginBottom: theme.spacing.sm,
              }}>
                Get Personal Support
              </Text>
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.base,
                textAlign: 'center',
                lineHeight: 24,
              }}>
                Choose how you'd like to get help from our support team.
              </Text>
            </Animated.View>

            {/* Support Options */}
            <View style={{ paddingHorizontal: theme.spacing.md }}>
              {supportOptions.map((option, index) => (
                <SupportOptionCard
                  key={option.id}
                  option={option}
                  index={index}
                />
              ))}
            </View>

            {/* Support Hours */}
            <Animated.View
              entering={FadeInDown.delay(600).springify()}
              style={{
                margin: theme.spacing.lg,
                backgroundColor: theme.colors.background.primary,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.lg,
                ...theme.elevation.sm,
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
              }}
            >
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontConfig.fontWeight.semibold,
                marginBottom: theme.spacing.md,
              }}>
                Support Hours
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: theme.spacing.sm,
              }}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={theme.colors.icon.secondary}
                  style={{ marginRight: theme.spacing.sm }}
                />
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                }}>
                  Monday - Friday: 9 AM - 6 PM PST
                </Text>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={theme.colors.icon.secondary}
                  style={{ marginRight: theme.spacing.sm }}
                />
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                }}>
                  Saturday - Sunday: 10 AM - 4 PM PST
                </Text>
              </View>
            </Animated.View>
          </>
        )}

        {selectedTab === 'feedback' && (
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={{
              paddingHorizontal: theme.spacing.md,
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="heart"
              size={48}
              color={theme.colors.interactive.primary}
              style={{ marginBottom: theme.spacing.lg }}
            />
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.xl,
              fontWeight: theme.fontConfig.fontWeight.bold,
              textAlign: 'center',
              marginBottom: theme.spacing.md,
            }}>
              We Value Your Feedback
            </Text>
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.base,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: theme.spacing.xl,
            }}>
              Help us improve by sharing your thoughts, suggestions, or reporting any issues you've encountered.
            </Text>
            
            <Pressable style={{
              backgroundColor: theme.colors.interactive.primary,
              borderRadius: theme.borderRadius.lg,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.md,
              marginBottom: theme.spacing.lg,
            }}>
              <Text style={{
                color: 'white',
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.base,
              }}>
                Send Feedback
              </Text>
            </Pressable>

            <View style={{
              backgroundColor: theme.colors.background.primary,
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.lg,
              width: '100%',
              ...theme.elevation.sm,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.medium,
                textAlign: 'center',
                marginBottom: theme.spacing.sm,
              }}>
                💡 Quick Tip
              </Text>
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.base,
                textAlign: 'center',
                lineHeight: 22,
              }}>
                Include screenshots or specific details to help us understand your feedback better.
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Add any custom styles if needed
});