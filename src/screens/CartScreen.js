```jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext';

export default function CartScreen({ navigation }) {
  const {
    cartItems,
    removeFromCart,
    changeQuantity,
    clearCart,
    totalPrice,
  } = useCart();

  const { addOrder } = useOrders();
  const { isDarkMode } = useTheme();

  const colors = {
    background: isDarkMode ? '#121212' : '#F7F7F7',
    card: isDarkMode ? '#242424' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#222222',
    secondary: isDarkMode ? '#BBBBBB' : '#666666',
    subtotal: isDarkMode ? '#DDDDDD' : '#333333',
    removeBackground: isDarkMode ? '#4A2424' : '#FFE5E5',
    removeText: isDarkMode ? '#FF7777' : '#D00000',
    border: isDarkMode ? '#383838' : '#EEEEEE',
    quantityBackground: isDarkMode ? '#333333' : '#EEEEEE',
    orange: '#E85D04',
  };

  const styles = getStyles(colors);

  const placeOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add food items first.');
      return;
    }

    addOrder(cartItems, totalPrice);

    Alert.alert(
      'Order Placed!',
      'Your order has been placed successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.navigate('Menu');
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>

        <Text style={styles.price}>
          Rs. {Number(item.price).toFixed(2)} each
        </Text>

        <Text style={styles.subtotal}>
          Subtotal: Rs.{' '}
          {(Number(item.price) * item.quantity).toFixed(2)}
        </Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => changeQuantity(item.id, -1)}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => changeQuantity(item.id, 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>

          <Text style={styles.emptyTitle}>
            Your Cart is Empty
          </Text>

          <Text style={styles.emptyText}>
            Add your favourite food from the menu.
          </Text>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Menu')}
          >
            <Text style={styles.buttonText}>Go to Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />

          <View style={styles.footer}>
            <Text style={styles.totalLabel}>Total Bill</Text>

            <Text style={styles.totalPrice}>
              Rs. {Number(totalPrice).toFixed(2)}
            </Text>

            <TouchableOpacity
              style={styles.orderButton}
              onPress={placeOrder}
            >
              <Text style={styles.buttonText}>Place Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={() =>
                Alert.alert(
                  'Clear Cart',
                  'Are you sure you want to remove all items?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Clear', onPress: clearCart },
                  ]
                )
              }
            >
              <Text style={styles.clearText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {
      padding: 15,
      paddingBottom: 10,
    },
    itemCard: {
      backgroundColor: colors.card,
      padding: 15,
      marginBottom: 12,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    price: {
      color: colors.secondary,
      fontSize: 14,
    },
    subtotal: {
      color: colors.subtotal,
      fontSize: 15,
      fontWeight: '600',
      marginTop: 5,
    },
    quantityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    quantityButton: {
      backgroundColor: colors.orange,
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityButtonText: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: 'bold',
    },
    quantity: {
      color: colors.text,
      fontSize: 17,
      fontWeight: 'bold',
      marginHorizontal: 15,
    },
    removeButton: {
      backgroundColor: colors.removeBackground,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 8,
      marginLeft: 8,
    },
    removeText: {
      color: colors.removeText,
      fontWeight: 'bold',
      fontSize: 12,
    },
    footer: {
      backgroundColor: colors.card,
      padding: 20,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      elevation: 5,
    },
    totalLabel: {
      color: colors.secondary,
      fontSize: 16,
    },
    totalPrice: {
      color: colors.orange,
      fontSize: 26,
      fontWeight: 'bold',
      marginTop: 5,
      marginBottom: 15,
    },
    orderButton: {
      backgroundColor: colors.orange,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    clearButton: {
      alignItems: 'center',
      padding: 12,
      marginTop: 5,
    },
    clearText: {
      color: colors.removeText,
      fontWeight: 'bold',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 25,
    },
    emptyEmoji: {
      fontSize: 55,
      marginBottom: 15,
    },
    emptyTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    emptyText: {
      color: colors.secondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    menuButton: {
      backgroundColor: colors.orange,
      paddingVertical: 13,
      paddingHorizontal: 25,
      borderRadius: 10,
    },
  });
```