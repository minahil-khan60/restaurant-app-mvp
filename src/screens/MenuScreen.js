import React, { useState } from 'react';
import {
View,
Text,
TextInput,
TouchableOpacity,
FlatList,
StyleSheet,
Alert,
} from 'react-native';

import { menuItems } from '../data/menu';
import { useCart } from '../context/CartContext';

const categories = [
'All',
'Starters',
'Mains',
'Desserts',
'Drinks',
];

export default function MenuScreen({ navigation }) {
const [searchText, setSearchText] = useState('');
const [selectedCategory, setSelectedCategory] = useState('All');

const { addToCart, cartCount } = useCart();

const filteredItems = menuItems.filter((item) => {
const matchesCategory =
selectedCategory === 'All' ||
item.category === selectedCategory;

const matchesSearch = item.name
  .toLowerCase()
  .includes(searchText.trim().toLowerCase());

return matchesCategory && matchesSearch;

});

const renderItem = ({ item }) => (
<View style={styles.card}>
<Text style={styles.name}>{item.name}</Text>

  <Text style={styles.description}>
    {item.description}
  </Text>

  <Text style={styles.price}>Rs. {item.price}</Text>

  {item.isSpecial && (
    <Text style={styles.special}>Chef's Special</Text>
  )}

  <Text
    style={{
      color: item.isAvailable ? 'green' : 'red',
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

return (
<View style={styles.container}>
<TouchableOpacity
style={styles.cartButton}
onPress={() => navigation.navigate('Cart')}
>
<Text style={styles.buttonText}>
View Cart ({cartCount})
</Text>
</TouchableOpacity>

  <TouchableOpacity
    style={styles.historyButton}
    onPress={() => navigation.navigate('OrderHistory')}
  >
    <Text style={styles.buttonText}>
      My Order History
    </Text>
  </TouchableOpacity>

  <TextInput
    style={styles.search}
    placeholder="Search food..."
    value={searchText}
    onChangeText={setSearchText}
  />

  <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={categories}
    keyExtractor={(item) => item}
    style={styles.categories}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          selectedCategory === item &&
            styles.selectedCategory,
        ]}
        onPress={() => setSelectedCategory(item)}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategory === item &&
              styles.selectedCategoryText,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    )}
  />

  <FlatList
    data={filteredItems}
    keyExtractor={(item) => String(item.id)}
    renderItem={renderItem}
    ListEmptyComponent={
      <Text style={styles.emptyText}>
        No food items found.
      </Text>
    }
  />
</View>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#F5F5F5',
padding: 15,
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
marginBottom: 12,
},
search: {
backgroundColor: '#FFFFFF',
borderWidth: 1,
borderColor: '#CCCCCC',
borderRadius: 8,
padding: 12,
marginBottom: 12,
},
categories: {
maxHeight: 45,
marginBottom: 10,
},
categoryButton: {
paddingHorizontal: 14,
paddingVertical: 10,
backgroundColor: '#E0E0E0',
borderRadius: 20,
marginRight: 8,
},
selectedCategory: {
backgroundColor: '#16834A',
},
categoryText: {
color: '#222222',
},
selectedCategoryText: {
color: '#FFFFFF',
fontWeight: 'bold',
},
card: {
backgroundColor: '#FFFFFF',
padding: 15,
borderRadius: 10,
marginBottom: 12,
elevation: 2,
},
name: {
fontSize: 19,
fontWeight: 'bold',
marginBottom: 5,
},
description: {
color: '#666666',
marginBottom: 8,
},
price: {
fontSize: 16,
fontWeight: 'bold',
marginBottom: 8,
},
special: {
color: '#B8860B',
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