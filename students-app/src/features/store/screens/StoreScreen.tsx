import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { 
  useTheme, 
  SearchInput, 
  SelectOptions, 
  Badge, 
  CustomButton 
} from '@academy/mobile-shared';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  badge?: string;
}

const ProductCard: React.FC<{ product: Product; index: number }> = ({
  product,
  index,
}) => {
  const { theme } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      style={[
        styles.productCard,
        {
          backgroundColor: theme.colors.background.primary,
          borderColor: theme.colors.border.primary,
          borderRadius: theme.borderRadius.xl,
          marginBottom: theme.spacing.md,
          ...theme.elevation.sm,
        }
      ]}
    >
      <View style={{ position: 'relative' }}>
        <View style={{
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.lg,
          height: 150,
          marginBottom: theme.spacing.md,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons
            name="image-outline"
            size={48}
            color={theme.colors.icon.tertiary}
          />
        </View>

        {product.badge && (
          <Badge
            text={product.badge}
            variant={product.badge === 'SALE' ? 'error' : 'primary'}
            size="sm"
            style={{
              position: 'absolute',
              top: theme.spacing.sm,
              left: theme.spacing.sm,
              zIndex: 1,
            }}
          />
        )}

        <Pressable
          onPress={() => setIsFavorite(!isFavorite)}
          style={{
            position: 'absolute',
            top: theme.spacing.sm,
            right: theme.spacing.sm,
            width: 32,
            height: 32,
            backgroundColor: theme.colors.background.primary,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            ...theme.elevation.sm,
          }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? theme.colors.status.error : theme.colors.icon.secondary}
          />
        </Pressable>
      </View>

      <View style={{ padding: theme.spacing.md }}>
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.base,
          fontWeight: theme.fontConfig.fontWeight.medium,
          marginBottom: theme.spacing.xs,
        }}>
          {product.name}
        </Text>
        
        <Text style={{
          color: theme.colors.text.secondary,
          fontSize: theme.fontSizes.sm,
          marginBottom: theme.spacing.sm,
          numberOfLines: 2,
        }}>
          {product.description}
        </Text>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.spacing.sm,
        }}>
          <Ionicons name="star" size={14} color={theme.colors.status.warning} />
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.sm,
            marginLeft: theme.spacing.xs,
          }}>
            {product.rating}
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
            marginLeft: theme.spacing.xs,
          }}>
            ({product.reviews})
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
          <Text style={{
            color: theme.colors.interactive.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.bold,
          }}>
            ₦{product.price.toLocaleString('en-NG')}
          </Text>
          {product.originalPrice && (
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.sm,
              textDecorationLine: 'line-through',
              marginLeft: theme.spacing.sm,
            }}>
              ₦{product.originalPrice.toLocaleString('en-NG')}
            </Text>
          )}
        </View>

        <CustomButton
          title={product.inStock ? 'Add to Cart' : 'Out of Stock'}
          variant={product.inStock ? 'primary' : 'gray'}
          size="sm"
          disabled={!product.inStock}
          onPress={() => console.log('Add to cart:', product.id)}
          style={{ width: '100%' }}
        />
      </View>
    </Animated.View>
  );
};

export const StoreScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState(0);

  const categories = [
    { id: 'all', title: 'All Items', icon: 'grid-outline' },
    { id: 'equipment', title: 'Equipment', icon: 'fitness-outline' },
    { id: 'apparel', title: 'Apparel', icon: 'shirt-outline' },
    { id: 'accessories', title: 'Accessories', icon: 'watch-outline' },
    { id: 'nutrition', title: 'Nutrition', icon: 'nutrition-outline' },
  ];

  const products: Product[] = [
    {
      id: 'swim-goggles',
      name: 'Pro Swimming Goggles',
      description: 'Professional grade swimming goggles with anti-fog coating',
      price: 11999,
      originalPrice: 15999,
      category: 'equipment',
      image: '',
      inStock: true,
      rating: 4.8,
      reviews: 124,
      badge: 'SALE',
    },
    {
      id: 'training-fins',
      name: 'Training Fins',
      description: 'High-quality training fins for technique improvement',
      price: 18399,
      category: 'equipment',
      image: '',
      inStock: true,
      rating: 4.6,
      reviews: 89,
    },
    {
      id: 'academy-shirt',
      name: 'Academy T-Shirt',
      description: 'Official Academy branded t-shirt made from premium cotton',
      price: 9999,
      category: 'apparel',
      image: '',
      inStock: true,
      rating: 4.7,
      reviews: 203,
    },
    {
      id: 'water-bottle',
      name: 'Smart Water Bottle',
      description: 'Temperature tracking water bottle with mobile app',
      price: 13999,
      category: 'accessories',
      image: '',
      inStock: false,
      rating: 4.4,
      reviews: 67,
    },
    {
      id: 'protein-powder',
      name: 'Performance Protein',
      description: 'High-quality whey protein for optimal recovery',
      price: 19999,
      category: 'nutrition',
      image: '',
      inStock: true,
      rating: 4.9,
      reviews: 156,
      badge: 'POPULAR',
    },
    {
      id: 'kick-board',
      name: 'Training Kickboard',
      description: 'Durable foam kickboard for technique training',
      price: 7999,
      category: 'equipment',
      image: '',
      inStock: true,
      rating: 4.3,
      reviews: 45,
    },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

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
        {/* Header Description */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Shop premium equipment, apparel, and accessories to enhance your training experience.
          </Text>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.md,
          }}
        >
          <SearchInput
            placeholder="Search products..."
            value=""
            onChangeText={(text) => console.log('Search:', text)}
            onSearchPress={() => console.log('Search pressed')}
          />
        </Animated.View>

        {/* Category Filter */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={{ 
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.lg 
          }}
        >
          <SelectOptions
            title="Categories"
            options={categories.map(cat => cat.title)}
            value={categories.find(cat => cat.id === selectedCategory)?.title || 'All Items'}
            onSelectionChange={(value) => {
              const category = categories.find(cat => cat.title === value);
              if (category) setSelectedCategory(category.id);
            }}
            multiSelect={false}
            variant="minimal"
            size="md"
          />
        </Animated.View>

        {/* Products Grid */}
        <View style={{
          paddingHorizontal: theme.spacing.lg,
        }}>
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {filteredProducts.map((product, index) => (
              <View
                key={product.id}
                style={{
                  width: '48%',
                  marginBottom: theme.spacing.md,
                }}
              >
                <ProductCard
                  product={product}
                  index={index}
                />
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Featured Banner */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={{
            margin: theme.spacing.lg,
            backgroundColor: theme.colors.interactive.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="gift-outline"
            size={32}
            color="white"
            style={{ marginBottom: theme.spacing.md }}
          />
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.bold,
            textAlign: 'center',
            marginBottom: theme.spacing.sm,
          }}>
            Free Shipping
          </Text>
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            opacity: 0.9,
            marginBottom: theme.spacing.lg,
          }}>
            On orders over ₦20,000
          </Text>
          <CustomButton
            title="Shop Now"
            variant="secondary"
            size="md"
            onPress={() => console.log('Shop now pressed')}
            style={{
              backgroundColor: 'white',
            }}
            textStyle={{
              color: theme.colors.interactive.primary,
            }}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    borderWidth: 1,
  },
  badge: {
    zIndex: 1,
  },
});