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
    return Math.floor((width - spacing * 2) / (columnWidth + spacing));
  }, [columns, width, columnWidth, spacing]);

  const colorVariants = useMemo(() => ({
    lightBlue: theme.colors.background.accent || '#dcf9f1',
    lightPurple: theme.colors.background.secondary || '#DCD5F4',
    lightPink: '#F9DCF0',
    lightYellow: '#F9EFDC',
    lightGreen: '#E8F5E8',
    lightOrange: '#FFE4B5',
  }), [theme]);

  const getDefaultColors = (index: number) => {
    const colors = Object.values(colorVariants);
    return colors[index % colors.length];
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
            width: columnWidth,
          },
          itemStyle,
        ]}
        onPress={item.onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={item.title}
        accessibilityHint={item.description}
        accessibilityState={{ disabled: isDisabled }}
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
        ItemSeparatorComponent={() => <View style={{ height: spacing }} />}
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
        ItemSeparatorComponent={() => <View style={{ height: spacing }} />}
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing / 2,
  },
  menuItem: {
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: spacing / 2,
    marginBottom: spacing,
    minHeight: 100,
  },
  cardItem: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    shadowColor: theme.colors.shadow?.primary || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  minimalItem: {
    padding: theme.spacing.sm,
    backgroundColor: 'transparent',
  },
  itemContent: {
    flex: 1,
    justifyContent: 'space-between',
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
    flex: 1,
  },
  itemTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    lineHeight: theme.typography.lineHeight?.body || 20,
    marginBottom: theme.spacing.xs,
  },
  itemDescription: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.regular,
    lineHeight: theme.typography.lineHeight?.small || 16,
  },
});

export default MenuList;