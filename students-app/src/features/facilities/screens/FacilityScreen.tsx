import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '@academy/mobile-shared';

const { width } = Dimensions.get('window');

interface Facility {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: {
    [key: string]: string;
  };
  amenities: string[];
  coords: {
    latitude: number;
    longitude: number;
  };
  distance?: string;
  isMain?: boolean;
}

const FacilityCard: React.FC<{ facility: Facility; index: number }> = ({
  facility,
  index,
}) => {
  const { theme } = useTheme();
  
  const handleCall = () => {
    Linking.openURL(`tel:${facility.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${facility.email}`);
  };

  const handleDirections = () => {
    const url = `https://maps.google.com/?daddr=${facility.coords.latitude},${facility.coords.longitude}`;
    Linking.openURL(url);
  };

  const handleOpenMaps = () => {
    const address = encodeURIComponent(`${facility.address}, ${facility.city}`);
    const url = `https://maps.google.com/?q=${address}`;
    Linking.openURL(url);
  };
  
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={[
        styles.locationCard,
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
      {facility.isMain && (
        <View style={[
          styles.mainBadge,
          {
            backgroundColor: theme.colors.interactive.primary,
            borderRadius: theme.borderRadius.sm,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            position: 'absolute',
            top: theme.spacing.md,
            right: theme.spacing.md,
            zIndex: 1,
          }
        ]}>
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.xs,
            fontWeight: theme.fontConfig.fontWeight.bold,
          }}>
            MAIN FACILITY
          </Text>
        </View>
      )}

      <View style={{ marginBottom: theme.spacing.md }}>
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.lg,
          fontWeight: theme.fontConfig.fontWeight.bold,
          marginBottom: theme.spacing.sm,
        }}>
          {facility.name}
        </Text>
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: theme.spacing.sm,
        }}>
          <Ionicons
            name="location-outline"
            size={16}
            color={theme.colors.icon.secondary}
            style={{ marginRight: theme.spacing.sm, marginTop: 2 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.base,
              lineHeight: 20,
            }}>
              {facility.address}
            </Text>
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.base,
            }}>
              {facility.city}
            </Text>
          </View>
          {facility.distance && (
            <Text style={{
              color: theme.colors.interactive.primary,
              fontSize: theme.fontSizes.sm,
              fontWeight: theme.fontConfig.fontWeight.medium,
            }}>
              {facility.distance}
            </Text>
          )}
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.spacing.sm,
        }}>
          <Ionicons
            name="call-outline"
            size={16}
            color={theme.colors.icon.secondary}
            style={{ marginRight: theme.spacing.sm }}
          />
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.base,
          }}>
            {facility.phone}
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.spacing.md,
        }}>
          <Ionicons
            name="mail-outline"
            size={16}
            color={theme.colors.icon.secondary}
            style={{ marginRight: theme.spacing.sm }}
          />
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.base,
          }}>
            {facility.email}
          </Text>
        </View>

        {/* Mock Map Placeholder */}
        <Pressable
          onPress={handleOpenMaps}
          style={{
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.lg,
            height: 120,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
          }}
        >
          <Ionicons
            name="map-outline"
            size={32}
            color={theme.colors.icon.secondary}
            style={{ marginBottom: theme.spacing.sm }}
          />
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
          }}>
            Tap to view in Maps
          </Text>
        </Pressable>
      </View>

      {/* Amenities */}
      <View style={{ marginBottom: theme.spacing.md }}>
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.base,
          fontWeight: theme.fontConfig.fontWeight.semibold,
          marginBottom: theme.spacing.sm,
        }}>
          Amenities
        </Text>
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
          {facility.amenities.map((amenity, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: theme.colors.background.secondary,
                borderRadius: theme.borderRadius.full,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.xs,
                marginRight: theme.spacing.sm,
                marginBottom: theme.spacing.sm,
              }}
            >
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
              }}>
                {amenity}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Hours */}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.base,
          fontWeight: theme.fontConfig.fontWeight.semibold,
          marginBottom: theme.spacing.sm,
        }}>
          Hours
        </Text>
        <View>
          {Object.entries(facility.hours).map(([day, hours]) => (
            <View
              key={day}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: theme.spacing.xs,
              }}
            >
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.medium,
              }}>
                {day}
              </Text>
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
              }}>
                {hours}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <Pressable
          onPress={handleCall}
          style={{
            backgroundColor: theme.colors.status.success,
            borderRadius: theme.borderRadius.lg,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            flex: 1,
            marginRight: theme.spacing.xs,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name="call"
            size={16}
            color="white"
            style={{ marginRight: theme.spacing.xs }}
          />
          <Text style={{
            color: 'white',
            fontWeight: theme.fontConfig.fontWeight.medium,
            fontSize: theme.fontSizes.sm,
          }}>
            Call
          </Text>
        </Pressable>
        
        <Pressable
          onPress={handleEmail}
          style={{
            backgroundColor: theme.colors.interactive.accent,
            borderRadius: theme.borderRadius.lg,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            flex: 1,
            marginHorizontal: theme.spacing.xs,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name="mail"
            size={16}
            color="white"
            style={{ marginRight: theme.spacing.xs }}
          />
          <Text style={{
            color: 'white',
            fontWeight: theme.fontConfig.fontWeight.medium,
            fontSize: theme.fontSizes.sm,
          }}>
            Email
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDirections}
          style={{
            backgroundColor: theme.colors.interactive.primary,
            borderRadius: theme.borderRadius.lg,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            flex: 1,
            marginLeft: theme.spacing.xs,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name="navigate"
            size={16}
            color="white"
            style={{ marginRight: theme.spacing.xs }}
          />
          <Text style={{
            color: 'white',
            fontWeight: theme.fontConfig.fontWeight.medium,
            fontSize: theme.fontSizes.sm,
          }}>
            Directions
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export const FacilityScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', title: 'All Facilities' },
    { id: 'pools', title: 'Pools' },
    { id: 'gyms', title: 'Gyms' },
    { id: 'studios', title: 'Studios' },
  ];

  const facilities: Facility[] = [
    {
      id: 'loc-001',
      name: 'Elitesgen Academy Main Campus',
      address: '123 Elitesgen Academy Drive',
      city: 'Downtown, CA 90210',
      phone: '(555) 123-4567',
      email: 'main@academy.com',
      coords: {
        latitude: 34.0522,
        longitude: -118.2437,
      },
      distance: '0.8 mi',
      isMain: true,
      amenities: ['Olympic Pool', 'Fitness Center', 'Yoga Studio', 'Locker Rooms', 'Café'],
      hours: {
        'Monday': '6:00 AM - 10:00 PM',
        'Tuesday': '6:00 AM - 10:00 PM',
        'Wednesday': '6:00 AM - 10:00 PM',
        'Thursday': '6:00 AM - 10:00 PM',
        'Friday': '6:00 AM - 10:00 PM',
        'Saturday': '7:00 AM - 9:00 PM',
        'Sunday': '8:00 AM - 8:00 PM',
      },
    },
    {
      id: 'loc-002',
      name: 'Elitesgen Academy North Branch',
      address: '456 North Street',
      city: 'Northside, CA 90211',
      phone: '(555) 234-5678',
      email: 'north@academy.com',
      coords: {
        latitude: 34.0622,
        longitude: -118.2537,
      },
      distance: '2.3 mi',
      amenities: ['Training Pool', 'Kids Pool', 'Fitness Center', 'Sauna'],
      hours: {
        'Monday': '6:00 AM - 9:00 PM',
        'Tuesday': '6:00 AM - 9:00 PM',
        'Wednesday': '6:00 AM - 9:00 PM',
        'Thursday': '6:00 AM - 9:00 PM',
        'Friday': '6:00 AM - 9:00 PM',
        'Saturday': '7:00 AM - 8:00 PM',
        'Sunday': '8:00 AM - 7:00 PM',
      },
    },
    {
      id: 'loc-003',
      name: 'Elitesgen Academy Westside',
      address: '789 West Boulevard',
      city: 'Westside, CA 90212',
      phone: '(555) 345-6789',
      email: 'west@academy.com',
      coords: {
        latitude: 34.0422,
        longitude: -118.2637,
      },
      distance: '4.1 mi',
      amenities: ['Competition Pool', 'Gym', 'Dance Studio', 'Physical Therapy'],
      hours: {
        'Monday': '5:30 AM - 9:30 PM',
        'Tuesday': '5:30 AM - 9:30 PM',
        'Wednesday': '5:30 AM - 9:30 PM',
        'Thursday': '5:30 AM - 9:30 PM',
        'Friday': '5:30 AM - 9:30 PM',
        'Saturday': '7:00 AM - 8:00 PM',
        'Sunday': '8:00 AM - 7:00 PM',
      },
    },
  ];

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
            paddingHorizontal: theme.spacing.md,
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
            Find Us
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: theme.spacing.lg,
          }}>
            Visit any of our convenient facilities for world-class training and amenities.
          </Text>

          {/* Quick Stats */}
          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            width: '100%',
            ...theme.elevation.sm,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: theme.colors.interactive.primary,
                  fontSize: theme.fontSizes.xl,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  3
                </Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                  textAlign: 'center',
                }}>
                  Facilities
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: theme.colors.interactive.primary,
                  fontSize: theme.fontSizes.xl,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  50K
                </Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                  textAlign: 'center',
                }}>
                  Sq Ft Total
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: theme.colors.interactive.primary,
                  fontSize: theme.fontSizes.xl,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  12+
                </Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                  textAlign: 'center',
                }}>
                  Amenities
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            {filters.map((filter, index) => (
              <Pressable
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                style={{
                  backgroundColor: selectedFilter === filter.id
                    ? theme.colors.interactive.primary
                    : theme.colors.background.primary,
                  borderColor: selectedFilter === filter.id
                    ? theme.colors.interactive.primary
                    : theme.colors.border.primary,
                  borderWidth: 1,
                  borderRadius: theme.borderRadius.full,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  marginRight: theme.spacing.md,
                }}
              >
                <Text style={{
                  color: selectedFilter === filter.id
                    ? 'white'
                    : theme.colors.text.primary,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  fontSize: theme.fontSizes.sm,
                }}>
                  {filter.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Facilities List */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          {facilities.map((facility, index) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              index={index}
            />
          ))}
        </View>

        {/* Contact Information */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={{
            margin: theme.spacing.lg,
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            alignItems: 'center',
            ...theme.elevation.sm,
          }}
        >
          <Ionicons
            name="chatbubbles"
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
            Questions About Our Facilities?
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: theme.spacing.lg,
          }}>
            Contact us for facility tours, accessibility information, or general inquiries.
          </Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <Pressable
              onPress={() => Linking.openURL('tel:(555)123-4567')}
              style={{
                backgroundColor: theme.colors.status.success,
                borderRadius: theme.borderRadius.lg,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.md,
                marginRight: theme.spacing.sm,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="call"
                size={16}
                color="white"
                style={{ marginRight: theme.spacing.sm }}
              />
              <Text style={{
                color: 'white',
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.sm,
              }}>
                Call Us
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => Linking.openURL('mailto:info@academy.com')}
              style={{
                backgroundColor: theme.colors.interactive.primary,
                borderRadius: theme.borderRadius.lg,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.md,
                marginLeft: theme.spacing.sm,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="mail"
                size={16}
                color="white"
                style={{ marginRight: theme.spacing.sm }}
              />
              <Text style={{
                color: 'white',
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.sm,
              }}>
                Email Us
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  locationCard: {
    borderWidth: 1,
  },
  mainBadge: {
    zIndex: 1,
  },
});