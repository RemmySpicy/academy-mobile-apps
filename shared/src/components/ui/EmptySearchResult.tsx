/**
 * EmptySearchResult Component
 * 
 * A reusable empty state component for search results and data lists.
 * Supports customizable content and Academy theming.
 */

import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle, TextStyle, ImageStyle, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface EmptySearchResultProps {
  /** Custom title text */
  title?: string;
  /** Custom description text */
  description?: string;
  /** Custom icon name from Ionicons */
  iconName?: keyof typeof Ionicons.glyphMap;
  /** Custom image source */
  imageSource?: ImageSourcePropType;
  /** Image size (width and height) */
  imageSize?: number;
  /** Icon size */
  iconSize?: number;
  /** Custom container styles */
  style?: ViewStyle;
  /** Custom title styles */
  titleStyle?: TextStyle;
  /** Custom description styles */
  descriptionStyle?: TextStyle;
  /** Custom image styles */
  imageStyle?: ImageStyle;
  /** Test ID for testing */
  testID?: string;
  /** Whether to show the default empty icon when no image is provided */
  showDefaultIcon?: boolean;
}

export const EmptySearchResult: React.FC<EmptySearchResultProps> = ({
  title = "No Results Found",
  description = "We do not have any result for the keyword you searched.",
  iconName = "search-outline",
  imageSource,
  imageSize = 150,
  iconSize,
  style,
  titleStyle,
  descriptionStyle,
  imageStyle,
  testID = "empty-search-result",
  showDefaultIcon = true,
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);

  const dynamicIconSize = iconSize || (screenDimensions.isTablet ? theme.iconSize.xxl * 1.5 : theme.iconSize.xxl);
  const dynamicImageSize = screenDimensions.isTablet ? imageSize * 1.2 : imageSize;

  return (
    <View 
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={`${title}. ${description}`}
    >
      {/* Image or Icon */}
      <View style={styles.imageContainer}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={[
              styles.image,
              {
                width: dynamicImageSize,
                height: dynamicImageSize,
              },
              imageStyle,
            ]}
            accessibilityIgnoresInvertColors
            resizeMode="contain"
          />
        ) : showDefaultIcon ? (
          <View style={styles.iconContainer}>
            <Ionicons
              name={iconName}
              size={dynamicIconSize}
              color={theme.colors.icon.tertiary}
            />
          </View>
        ) : null}
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text 
          style={[styles.title, titleStyle]}
          testID={`${testID}-title`}
        >
          {title}
        </Text>
        
        <Text 
          style={[styles.description, descriptionStyle]}
          testID={`${testID}-description`}
        >
          {description}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;
  
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      minHeight: 300,
    },
    
    imageContainer: {
      marginBottom: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    image: {
      opacity: 0.8,
    },
    
    iconContainer: {
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    textContainer: {
      alignItems: 'center',
      maxWidth: isTablet ? 500 : 300,
    },
    
    title: {
      fontSize: isTablet ? theme.fontSizes.h3 : theme.fontSizes.h4,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      lineHeight: isTablet ? 32 : 28,
    },
    
    description: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.regular,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: isTablet ? 24 : 20,
      maxWidth: '100%',
    },
  });
};

export default EmptySearchResult;