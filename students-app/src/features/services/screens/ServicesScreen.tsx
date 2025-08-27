import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme, FilterBar, CustomButton } from '@academy/mobile-shared';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  price?: string;
  features: string[];
  popular?: boolean;
}

const ServiceCard: React.FC<{ service: Service; index: number }> = ({
  service,
  index,
}) => {
  const { theme } = useTheme();
  
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={[
        styles.serviceCard,
        {
          backgroundColor: theme.colors.background.primary,
          borderColor: theme.colors.border.primary,
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.md,
          ...theme.elevation.sm,
        }
      ]}
    >
      {service.popular && (
        <View style={[
          styles.popularBadge,
          {
            backgroundColor: theme.colors.interactive.primary,
            borderRadius: theme.borderRadius.full,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            position: 'absolute',
            top: -8,
            right: theme.spacing.md,
          }
        ]}>
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.xs,
            fontWeight: theme.fontConfig.fontWeight.bold,
          }}>
            POPULAR
          </Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
        <View style={{
          width: 48,
          height: 48,
          backgroundColor: `${service.color}15`,
          borderRadius: theme.borderRadius.full,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}>
          <Ionicons name={service.icon} size={24} color={service.color} />
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
          }}>
            {service.title}
          </Text>
          {service.price && (
            <Text style={{
              color: theme.colors.interactive.primary,
              fontSize: theme.fontSizes.base,
              fontWeight: theme.fontConfig.fontWeight.medium,
              marginTop: 2,
            }}>
              {service.price}
            </Text>
          )}
        </View>
      </View>

      <Text style={{
        color: theme.colors.text.secondary,
        fontSize: theme.fontSizes.base,
        lineHeight: 22,
        marginBottom: theme.spacing.md,
      }}>
        {service.description}
      </Text>

      <View style={{ marginBottom: theme.spacing.md }}>
        {service.features.map((feature, idx) => (
          <View key={idx} style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.xs,
          }}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.colors.status.success}
              style={{ marginRight: theme.spacing.sm }}
            />
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.sm,
              flex: 1,
            }}>
              {feature}
            </Text>
          </View>
        ))}
      </View>

      <CustomButton
        title="Learn More"
        variant={service.popular ? 'primary' : 'outlineTheme'}
        size="sm"
        onPress={() => console.log(`Learn more about ${service.title}`)}
      />
    </Animated.View>
  );
};

export const ServicesScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    category: ['all']
  });

  const filterGroups = [
    {
      id: 'category',
      title: 'Service Category',
      options: [
        { id: 'all', label: 'All Services', value: 'all' },
        { id: 'training', label: 'Training', value: 'training' },
        { id: 'coaching', label: 'Coaching', value: 'coaching' },
        { id: 'camps', label: 'Camps', value: 'camps' },
        { id: 'consulting', label: 'Consulting', value: 'consulting' },
      ],
      multiSelect: false,
    }
  ];

  const services: Service[] = [
    {
      id: 'personal-training',
      title: 'Personal Training',
      description: 'One-on-one personalized training sessions with certified instructors tailored to your specific goals and skill level.',
      icon: 'person',
      color: theme.colors.interactive.primary,
      price: '₦32,000/session',
      features: [
        'Customized workout plans',
        'Progress tracking',
        'Flexible scheduling',
        'Nutrition guidance',
      ],
      popular: true,
    },
    {
      id: 'group-classes',
      title: 'Group Classes',
      description: 'Join our energetic group sessions designed for all skill levels. Build community while achieving your fitness goals.',
      icon: 'people',
      color: theme.colors.status.success,
      price: '₦10,000/class',
      features: [
        'Small group sizes',
        'Multiple time slots',
        'All skill levels welcome',
        'Social learning environment',
      ],
    },
    {
      id: 'intensive-camps',
      title: 'Intensive Camps',
      description: 'Multi-day intensive programs designed to rapidly improve your skills with immersive training experiences.',
      icon: 'flame',
      color: theme.colors.status.warning,
      price: '₦80,000/week',
      features: [
        'Full-day programs',
        'Expert instruction',
        'Equipment included',
        'Skill assessments',
      ],
    },
    {
      id: 'online-coaching',
      title: 'Online Coaching',
      description: 'Remote coaching sessions with video analysis, personalized feedback, and structured training programs.',
      icon: 'videocam',
      color: theme.colors.interactive.accent,
      price: '₦20,000/session',
      features: [
        'Video analysis',
        'Custom training plans',
        'Weekly check-ins',
        'Mobile app access',
      ],
    },
    {
      id: 'performance-analysis',
      title: 'Performance Analysis',
      description: 'Comprehensive analysis of your technique and performance with detailed reports and improvement strategies.',
      icon: 'analytics',
      color: theme.colors.interactive.purple,
      price: '₦48,000/session',
      features: [
        'Video technique analysis',
        'Performance metrics',
        'Improvement roadmap',
        'Follow-up sessions',
      ],
    },
  ];

  const handleFilterChange = (groupId: string, optionId: string, selected: boolean) => {
    setSelectedFilters(prev => {
      const group = filterGroups.find(g => g.id === groupId);
      if (!group) return prev;

      if (group.multiSelect) {
        // Multi-select logic
        const currentSelections = prev[groupId] || [];
        if (selected) {
          return { ...prev, [groupId]: [...currentSelections, optionId] };
        } else {
          return { ...prev, [groupId]: currentSelections.filter(id => id !== optionId) };
        }
      } else {
        // Single-select logic
        return { ...prev, [groupId]: [optionId] };
      }
    });
  };

  const selectedCategory = selectedFilters.category?.[0] || 'all';
  
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => {
        // Simple category filtering logic
        if (selectedCategory === 'training') return service.id.includes('training') || service.id.includes('classes');
        if (selectedCategory === 'coaching') return service.id.includes('coaching') || service.id.includes('analysis');
        if (selectedCategory === 'camps') return service.id.includes('camps');
        return true;
      });

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
            marginBottom: theme.spacing.xl,
            paddingHorizontal: theme.spacing.md,
          }}
        >
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Discover our comprehensive range of professional services designed to help you achieve your goals with expert guidance.
          </Text>
        </Animated.View>

        {/* Category Filter */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{ marginBottom: theme.spacing.xl }}
        >
          <FilterBar
            filters={filterGroups}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            variant="horizontal"
            scrollable={true}
            showCounts={false}
            showIcons={false}
            showClearAll={false}
            compactMode={true}
          />
        </Animated.View>

        {/* Services List */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={{ paddingHorizontal: theme.spacing.md }}
        >
          {filteredServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </Animated.View>

        {/* Contact Section */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            marginTop: theme.spacing.xl,
            marginHorizontal: theme.spacing.lg,
            alignItems: 'center',
            ...theme.elevation.sm,
          }}
        >
          <Ionicons
            name="chatbubble-ellipses"
            size={32}
            color={theme.colors.interactive.primary}
            style={{ marginBottom: theme.spacing.md }}
          />
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            textAlign: 'center',
            marginBottom: theme.spacing.sm,
          }}>
            Need Custom Service?
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: theme.spacing.lg,
          }}>
            Contact us for personalized service packages tailored to your specific needs.
          </Text>
          <CustomButton
            title="Contact Us"
            variant="primary"
            size="md"
            onPress={() => console.log('Contact us pressed')}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceCard: {
    borderWidth: 1,
  },
  popularBadge: {
    zIndex: 1,
  },
});