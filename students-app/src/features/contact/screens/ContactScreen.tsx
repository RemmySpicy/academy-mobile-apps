import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme, SelectOptions } from '@academy/mobile-shared';

interface ContactMethod {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  action: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const ContactMethodCard: React.FC<{ method: ContactMethod; index: number }> = ({
  method,
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
        ...theme.elevation.sm,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
      }}
    >
      <Pressable
        onPress={method.action}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{
          width: 48,
          height: 48,
          backgroundColor: `${method.color}15`,
          borderRadius: theme.borderRadius.full,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}>
          <Ionicons
            name={method.icon}
            size={24}
            color={method.color}
          />
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.base,
            fontWeight: theme.fontConfig.fontWeight.medium,
            marginBottom: 2,
          }}>
            {method.title}
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
          }}>
            {method.subtitle}
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

const FAQItemComponent: React.FC<{ faq: FAQItem; index: number }> = ({
  faq,
  index,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        ...theme.elevation.sm,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
      }}
    >
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.base,
          fontWeight: theme.fontConfig.fontWeight.medium,
          flex: 1,
          marginRight: theme.spacing.md,
        }}>
          {faq.question}
        </Text>
        
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.icon.secondary}
        />
      </Pressable>
      
      {isExpanded && (
        <Animated.View
          entering={FadeInDown.springify()}
          style={{
            marginTop: theme.spacing.sm,
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
          }}
        >
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            lineHeight: 22,
          }}>
            {faq.answer}
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export const ContactScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedFAQCategory, setSelectedFAQCategory] = useState('all');

  const subjectOptions = [
    'General Inquiry',
    'Billing Question',
    'Technical Support',
    'Schedule Change',
    'Membership',
    'Feedback',
    'Other',
  ];

  const faqCategories = [
    { id: 'all', title: 'All' },
    { id: 'membership', title: 'Membership' },
    { id: 'billing', title: 'Billing' },
    { id: 'classes', title: 'Classes' },
    { id: 'technical', title: 'Technical' },
  ];

  const contactMethods: ContactMethod[] = [
    {
      id: 'phone',
      title: 'Call Us',
      subtitle: '(555) 123-4567 • Available 9 AM - 6 PM',
      icon: 'call',
      color: theme.colors.status.success,
      action: () => Linking.openURL('tel:(555)123-4567'),
    },
    {
      id: 'email',
      title: 'Email Support',
      subtitle: 'support@academy.com • We respond within 24 hours',
      icon: 'mail',
      color: theme.colors.interactive.primary,
      action: () => Linking.openURL('mailto:support@academy.com'),
    },
    {
      id: 'chat',
      title: 'Live Chat',
      subtitle: 'Chat with our support team in real-time',
      icon: 'chatbubbles',
      color: theme.colors.interactive.accent,
      action: () => console.log('Open live chat'),
    },
    {
      id: 'location',
      title: 'Visit Us',
      subtitle: 'Find our locations and hours',
      icon: 'location',
      color: theme.colors.status.warning,
      action: () => console.log('Navigate to locations'),
    },
  ];

  const faqs: FAQItem[] = [
    {
      id: 'faq-001',
      question: 'How do I cancel or reschedule a class?',
      answer: 'You can cancel or reschedule classes up to 24 hours in advance through the app or by calling us. Go to My Schedule, select the class, and choose the appropriate option.',
      category: 'classes',
    },
    {
      id: 'faq-002',
      question: 'What is your refund policy?',
      answer: 'We offer full refunds for cancellations made within 48 hours of booking. For cancellations beyond this window, we provide account credits that can be used for future bookings.',
      category: 'billing',
    },
    {
      id: 'faq-003',
      question: 'How do I upgrade my membership?',
      answer: 'You can upgrade your membership at any time through the app under Settings > Membership, or by contacting our support team. Upgrades take effect immediately.',
      category: 'membership',
    },
    {
      id: 'faq-004',
      question: 'I forgot my password, how do I reset it?',
      answer: 'On the login screen, tap "Forgot Password" and enter your email. You\'ll receive a password reset link within a few minutes. Check your spam folder if you don\'t see it.',
      category: 'technical',
    },
    {
      id: 'faq-005',
      question: 'What should I bring to my first class?',
      answer: 'Bring comfortable workout clothes, a water bottle, and a towel. For swimming classes, bring swimwear and goggles. All other equipment is provided by the academy.',
      category: 'classes',
    },
    {
      id: 'faq-006',
      question: 'How do I update my payment method?',
      answer: 'Go to Settings > Payment Methods in the app. You can add, remove, or set a default payment method. Changes apply to all future bookings.',
      category: 'billing',
    },
  ];

  const filteredFAQs = selectedFAQCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedFAQCategory);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !selectedSubject || !message.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Simulate form submission
    Alert.alert(
      'Message Sent!',
      'Thank you for contacting us. We\'ll get back to you within 24 hours.',
      [{ text: 'OK', onPress: () => {
        setName('');
        setEmail('');
        setSelectedSubject('');
        setMessage('');
      }}]
    );
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
          paddingBottom: theme.spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes['2xl'],
            fontWeight: theme.fontConfig.fontWeight.bold,
            textAlign: 'center',
            marginBottom: theme.spacing.md,
          }}>
            We're Here to Help
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Choose your preferred way to get in touch with our support team.
          </Text>
        </Animated.View>

        {/* Contact Methods */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Get in Touch
          </Text>
          
          {contactMethods.map((method, index) => (
            <ContactMethodCard
              key={method.id}
              method={method}
              index={index}
            />
          ))}
        </Animated.View>

        {/* Contact Form */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Send us a Message
          </Text>
          
          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            ...theme.elevation.sm,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
          }}>
            <View style={{ marginBottom: theme.spacing.md }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.medium,
                marginBottom: theme.spacing.sm,
              }}>
                Name *
              </Text>
              <TextInput
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  borderRadius: theme.borderRadius.lg,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.md,
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary,
                }}
                placeholder="Enter your full name"
                placeholderTextColor={theme.colors.text.secondary}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={{ marginBottom: theme.spacing.md }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.medium,
                marginBottom: theme.spacing.sm,
              }}>
                Email *
              </Text>
              <TextInput
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  borderRadius: theme.borderRadius.lg,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.md,
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary,
                }}
                placeholder="Enter your email address"
                placeholderTextColor={theme.colors.text.secondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={{ marginBottom: theme.spacing.md }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.medium,
                marginBottom: theme.spacing.sm,
              }}>
                Subject *
              </Text>
              
              <SelectOptions
                title=""
                options={subjectOptions}
                value={selectedSubject}
                onSelectionChange={(selected) => {
                  // SelectOptions can return string or string[], but we only expect string since multiSelect=false
                  const value = Array.isArray(selected) ? selected[0] || '' : selected;
                  setSelectedSubject(value);
                }}
                multiSelect={false}
                size="sm"
                variant="outlined"
                columns={2}
              />
            </View>

            <View style={{ marginBottom: theme.spacing.lg }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.medium,
                marginBottom: theme.spacing.sm,
              }}>
                Message *
              </Text>
              <TextInput
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  borderRadius: theme.borderRadius.lg,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.md,
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary,
                  minHeight: 100,
                  textAlignVertical: 'top',
                }}
                placeholder="Describe your question or concern in detail..."
                placeholderTextColor={theme.colors.text.secondary}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
              />
            </View>

            <Pressable
              onPress={handleSubmit}
              style={{
                backgroundColor: theme.colors.interactive.primary,
                borderRadius: theme.borderRadius.lg,
                paddingVertical: theme.spacing.md,
                alignItems: 'center',
              }}
            >
              <Text style={{
                color: 'white',
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.base,
              }}>
                Send Message
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* FAQ Section */}
        <View style={{ paddingHorizontal: theme.spacing.lg }}>
          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
              marginBottom: theme.spacing.md,
            }}
          >
            Frequently Asked Questions
          </Animated.Text>

          {/* FAQ Categories */}
          <Animated.View
            entering={FadeInDown.delay(450).springify()}
            style={{ marginBottom: theme.spacing.lg }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 0 }}
            >
              {faqCategories.map((category, index) => (
                <Pressable
                  key={category.id}
                  onPress={() => setSelectedFAQCategory(category.id)}
                  style={{
                    backgroundColor: selectedFAQCategory === category.id
                      ? theme.colors.interactive.primary
                      : theme.colors.background.primary,
                    borderColor: selectedFAQCategory === category.id
                      ? theme.colors.interactive.primary
                      : theme.colors.border.primary,
                    borderWidth: 1,
                    borderRadius: theme.borderRadius.full,
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.sm,
                    marginRight: theme.spacing.md,
                  }}
                >
                  <Text style={{
                    color: selectedFAQCategory === category.id
                      ? 'white'
                      : theme.colors.text.primary,
                    fontWeight: theme.fontConfig.fontWeight.medium,
                    fontSize: theme.fontSizes.sm,
                  }}>
                    {category.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
          
          {filteredFAQs.map((faq, index) => (
            <FAQItemComponent
              key={faq.id}
              faq={faq}
              index={index}
            />
          ))}
        </View>

        {/* Emergency Contact */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={{
            margin: theme.spacing.lg,
            backgroundColor: theme.colors.status.errorBackground,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.status.error,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
          }}>
            <Ionicons
              name="warning"
              size={24}
              color={theme.colors.status.error}
              style={{ marginRight: theme.spacing.sm }}
            />
            <Text style={{
              color: theme.colors.status.error,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
            }}>
              Emergency Contact
            </Text>
          </View>
          <Text style={{
            color: theme.colors.status.error,
            fontSize: theme.fontSizes.base,
            marginBottom: theme.spacing.md,
            lineHeight: 22,
          }}>
            For urgent matters or emergencies during class hours, please call our emergency hotline immediately.
          </Text>
          <Pressable
            onPress={() => Linking.openURL('tel:(555)911-HELP')}
            style={{
              backgroundColor: theme.colors.status.error,
              borderRadius: theme.borderRadius.lg,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{
              color: 'white',
              fontWeight: theme.fontConfig.fontWeight.medium,
              fontSize: theme.fontSizes.base,
            }}>
              Call Emergency Line
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Add any custom styles if needed
});