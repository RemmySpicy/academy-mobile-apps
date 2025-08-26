import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ListRenderItem,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useScreenDimensions } from '../../hooks';

export interface MenuItem {
  id: string;
  title: string;
  color?: string;
  image?: ImageSourcePropType;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  backgroundColor?: string;
  onPress: () => void;
  disabled?: boolean;
  badge?: string | number;
  description?: string;
}

export interface MenuListProps {
  items: MenuItem[];
  columns?: number;
  columnWidth?: number;
  spacing?: number;
  containerPadding?: number;
  contentContainerStyle?: any;
  itemStyle?: any;
  showDescription?: boolean;
  variant?: 'default' | 'card' | 'minimal';
  scrollEnabled?: boolean;
}

const MenuList: React.FC<MenuListProps> = ({
  items,
  columns,
  columnWidth = 160,
  spacing = 16,
  containerPadding = 0,
  contentContainerStyle,
  itemStyle,
  showDescription = false,
  variant = 'card',
  scrollEnabled = false,
}) => {
  const { theme } = useTheme();
  const { width } = useScreenDimensions();
  const styles = createStyles(theme, spacing);

  const calculatedColumns = useMemo(() => {
    if (columns) return columns;
    return Math.floor((width - containerPadding - spacing * 2) / (columnWidth + spacing));
  }, [columns, width, columnWidth, spacing, containerPadding]);

  const colorVariants = useMemo(() => {
    // Use proper Academy theme colors with transparency
    const baseColors = {
      blue: theme.colors.interactive.primary,
      purple: '#8B5CF6', // Standard purple color
      pink: theme.colors.status.error,
      yellow: theme.colors.status.warning,
      green: theme.colors.status.success,
      orange: '#F97316', // Fallback orange color
    };
    
    if (theme.isDark) {
      return {
        darkBlue: baseColors.blue + '20',
        darkPurple: baseColors.purple + '20',
        darkPink: baseColors.pink + '20',
        darkYellow: baseColors.yellow + '20',
        darkGreen: baseColors.green + '20',
        darkOrange: baseColors.orange + '20',
      };
    }
    return {
      lightBlue: baseColors.blue + '15',
      lightPurple: baseColors.purple + '15',
      lightPink: baseColors.pink + '15',
      lightYellow: baseColors.yellow + '15',
      lightGreen: baseColors.green + '15',
      lightOrange: baseColors.orange + '15',
    };
  }, [theme]);

  const getDefaultColors = (index: number) => {
    const colors = Object.values(colorVariants);
    return colors[index % colors.length];
  };

  // Calculate dynamic item width based on available space
  const itemWidth = useMemo(() => {
    const availableWidth = width - containerPadding;
    const totalSpacing = (calculatedColumns - 1) * spacing;
    return (availableWidth - totalSpacing) / calculatedColumns;
  }, [width, calculatedColumns, spacing, containerPadding]);

  // Determine if item should have right margin (not last in row)
  const getItemMargin = (index: number) => {
    const isLastInRow = (index + 1) % calculatedColumns === 0;
    return isLastInRow ? 0 : spacing;
  };

  const renderMenuItem: ListRenderItem<MenuItem> = ({ item, index }) => {
    const itemBackgroundColor = item.backgroundColor || 
      item.color || 
      getDefaultColors(index);

    const isDisabled = item.disabled;
    const opacity = isDisabled ? 0.5 : 1;

    return (
      <TouchableOpacity
        style={[
          styles.menuItem,
          variant === 'card' && styles.cardItem,
          variant === 'minimal' && styles.minimalItem,
          { 
            backgroundColor: itemBackgroundColor,
            opacity,
            width: itemWidth,
            marginRight: getItemMargin(index),
          },
          itemStyle,
        ]}
        onPress={item.onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}${item.badge ? `, ${item.badge} notifications` : ''}`}
        accessibilityHint={item.description}
        accessibilityState={{ disabled: isDisabled, selected: false }}
      >
        <View style={styles.itemContent}>
          {/* Icon or Image */}
          <View style={styles.iconContainer}>
            {item.image ? (
              <Image source={item.image} style={styles.itemImage} />
            ) : item.icon ? (
              <Ionicons
                name={item.icon}
                size={24}
                color={item.iconColor || theme.colors.interactive.primary}
              />
            ) : (
              <View style={[styles.placeholderIcon, { backgroundColor: theme.colors.background.tertiary }]} />
            )}

            {/* Badge */}
            {item.badge && (
              <View style={[styles.badge, { backgroundColor: theme.colors.status.error }]}>
                <Text style={[styles.badgeText, { color: theme.colors.text.inverse }]}>
                  {item.badge}
                </Text>
              </View>
            )}
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text 
              style={[styles.itemTitle, { color: theme.colors.text.primary }]}
              numberOfLines={2}
            >
              {item.title}
            </Text>

            {showDescription && item.description && (
              <Text 
                style={[styles.itemDescription, { color: theme.colors.text.secondary }]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item: MenuItem) => item.id;

  if (scrollEnabled) {
    return (
      <FlatList
        data={items}
        renderItem={renderMenuItem}
        keyExtractor={keyExtractor}
        numColumns={calculatedColumns}
        contentContainerStyle={[styles.container, contentContainerStyle]}
        columnWrapperStyle={calculatedColumns > 1 ? styles.row : undefined}
        showsVerticalScrollIndicator={false}
        key={`${calculatedColumns}-${variant}`} // Force re-render when columns change
      />
    );
  }

  return (
    <View style={[styles.container, contentContainerStyle]}>
      <FlatList
        data={items}
        renderItem={renderMenuItem}
        keyExtractor={keyExtractor}
        numColumns={calculatedColumns}
        columnWrapperStyle={calculatedColumns > 1 ? styles.row : undefined}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        key={`${calculatedColumns}-${variant}`} // Force re-render when columns change
      />
    </View>
  );
};

const createStyles = (theme: any, spacing: number) => StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    marginBottom: spacing,
  },
  menuItem: {
    borderRadius: theme.borderRadius.xl,
    marginHorizontal: 0,
    marginBottom: 0,
    minHeight: 100,
  },
  cardItem: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    ...theme.elevation.sm,
  },
  minimalItem: {
    padding: theme.spacing.sm,
    backgroundColor: 'transparent',
  },
  itemContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  itemImage: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
  },
  placeholderIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: theme.fontConfig.fontWeight.bold,
    textAlign: 'center',
  },
  textContainer: {
    flex: 0,
  },
  itemTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    lineHeight: theme.typography.lineHeight.body,
    marginTop: theme.spacing.xs,
  },
  itemDescription: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.regular,
    lineHeight: theme.typography.lineHeight.small,
  },
});

export default MenuList;