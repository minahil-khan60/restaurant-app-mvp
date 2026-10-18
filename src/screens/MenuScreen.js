import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';

import { menuItems as menuData } from '../data/menu';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';

export default function MenuScreen({ navigation }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const searchRef = useRef(null);
  const listRef = useRef(null);
  const debounceTimer = useRef(null);
  const previousQuery = useRef('');

  const { isDarkMode } = useTheme();
  const { addToCart, cartCount } = useCart();

  const colors = {
    background: isDarkMode ? '#121212' : '#F5F5F5',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#222222',
    subtitle: isDarkMode ? '#BBBBBB' : '#666666',
    input: isDarkMode ? '#252525' : '#FFFFFF',
    border: isDarkMode ? '#555555' : '#CCCCCC',
    category: isDarkMode ? '#333333' : '#E0E0E0',
    chip: isDarkMode ? '#292929' : '#FFFFFF',
    placeholder: isDarkMode ? '#BBBBBB' : '#777777',
  };

  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recent, setRecent] = useState([]);
  const [showTop, setShowTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      if (!active) return;

      try {
        setMenuItems(menuData);
        setIsLoading(false);
      } catch (e) {
        setError('Could not load menu. Please try again.');
        setIsLoading(false);
      }
    }, 1500);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [reloadKey]);

  useEffect(() => {
    if (!refreshing) return;

    const timer = setTimeout(() => {
      setRefreshing(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [refreshing]);

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  const handleSearchChange = (text) => {
    setSearchText(text);
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(text);
    }, 400);
  };

  const clearSearch = () => {
    clearTimeout(debounceTimer.current);
    setSearchText('');
    setDebouncedSearch('');
    searchRef.current?.focus();
  };

  useEffect(() => {
    const query = debouncedSearch.trim();

    if (
      query &&
      query.toLowerCase() !== previousQuery.current.toLowerCase()
    ) {
      previousQuery.current = query;

      setRecent((old) =>
        [
          query,
          ...old.filter(
            (item) => item.toLowerCase() !== query.toLowerCase()
          ),
        ].slice(0, 5)
      );
    }
  }, [debouncedSearch]);

  const query = debouncedSearch.trim().toLowerCase();

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category === selectedCategory;

    const matchesSearch = String(item.name || '')
      .toLowerCase()
      .includes(query);

    return matchesCategory && matchesSearch;
  });

  const renderItem = ({ item }) => {
    const imageSource =
      typeof item.image === 'number'
        ? item.image
        : typeof item.image === 'string' &&
          item.image.trim().startsWith('http')
        ? { uri: item.image.trim() }
        : { uri: FALLBACK_IMAGE };

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card },
          !item.isAvailable && styles.cardUnavailable,
        ]}
      >
        <Image
          source={imageSource}
          style={styles.foodImage}
          resizeMode="cover"
          onError={() => console.log('Image failed:', item.name)}
        />

        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.text }]}>
            {item.name}
          </Text>

          {item.isSpecial && (
            <Text style={styles.badge}>Daily Special</Text>
          )}
        </View>

        <Text style={[styles.description, { color: colors.subtitle }]}>
          {item.description}
        </Text>

        <Text style={[styles.price, { color: colors.text }]}>
          Rs. {item.price}
        </Text>

        <Text
          style={{
            color: item.isAvailable
              ? (isDarkMode ? '#66BB6A' : 'green')
              : '#EF5350',
            marginBottom: 10,
          }}
        >
          {item.isAvailable ? 'Available' : 'Not Available'}
        </Text>

        <TouchableOpacity
          style={[
            styles.addButton,
            !item.isAvailable && styles.disabledButton,
          ]}
          disabled={!item.isAvailable}
          onPress={() => {
            addToCart(item);
            Alert.alert('Success', `${item.name} added to cart!`);
          }}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.menuTitle, { color: colors.text }]}>
        Menu ({filteredItems.length})
      </Text>

      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart')}
      >
        <Text style={styles.buttonText}>View Cart ({cartCount})</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('OrderHistory')}
      >
        <Text style={styles.buttonText}>My Order History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('Reservation')}
      >
        <Text style={styles.buttonText}>Book a Table</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>My Profile</Text>
      </TouchableOpacity>

      <View
        style={[
          styles.searchRow,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => searchRef.current?.focus()}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>

        <TextInput
          ref={searchRef}
          style={[
            styles.search,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Search food..."
          placeholderTextColor={colors.placeholder}
          value={searchText}
          onChangeText={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
        />

        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Text style={[styles.clearIcon, { color: colors.text }]}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isFocused && searchText === '' && recent.length > 0 && (
        <View style={styles.recentContainer}>
          <Text style={[styles.recentTitle, { color: colors.subtitle }]}>
            Recent searches
          </Text>

          <View style={styles.recentRow}>
            {recent.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.recentChip,
                  {
                    backgroundColor: colors.chip,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  clearTimeout(debounceTimer.current);
                  setSearchText(item);
                  setDebouncedSearch(item);
                }}
              >
                <Text style={{ color: colors.text }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.categories}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  selectedCategory === item
                    ? '#16834A'
                    : colors.category,
              },
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    selectedCategory === item
                      ? '#FFFFFF'
                      : colors.text,
                  fontWeight:
                    selectedCategory === item ? 'bold' : 'normal',
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.debug}>
        Screen renders: {renderCount.current}
      </Text>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={isDarkMode ? '#66BB6A' : '#16834A'}
          />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading menu...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setReloadKey((key) => key + 1)}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={filteredItems}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setReloadKey((key) => key + 1);
          }}
          onScroll={(event) => {
            setShowTop(event.nativeEvent.contentOffset.y > 300);
          }}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text
              style={[
                styles.emptyText,
                { color: colors.subtitle },
              ]}
            >
              No dishes match "{debouncedSearch}". Try another search.
            </Text>
          }
        />
      )}

      {showTop && (
        <TouchableOpacity
          style={styles.topButton}
          onPress={() =>
            listRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            })
          }
        >
          <Text style={styles.buttonText}>↑ Top</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartButton: {
    backgroundColor: '#16834A',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  historyButton: {
    backgroundColor: '#2457A7',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  profileButton: {
    backgroundColor: '#7B3FA1',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  clearIcon: {
    fontSize: 20,
    marginLeft: 8,
    paddingHorizontal: 5,
  },
  search: {
    flex: 1,
    borderWidth: 0,
    padding: 12,
    fontSize: 16,
  },
  recentContainer: {
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 14,
  },
  recentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  recentChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 6,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 14,
  },
  debug: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
  },
  errorText: {
    color: '#EF5350',
    marginBottom: 12,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  cardUnavailable: {
    opacity: 0.5,
  },
  foodImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#EEEEEE',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 5,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#F1C40F',
    color: '#222222',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  description: {
    marginBottom: 8,
    fontSize: 15,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#16834A',
    padding: 12,
    borderRadius: 7,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999999',
  },
  retryButton: {
    backgroundColor: '#16834A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  topButton: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    backgroundColor: '#16834A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 25,
    fontSize: 16,
  },
});