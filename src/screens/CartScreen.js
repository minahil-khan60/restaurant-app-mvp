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
removeText: '#D00000',
};

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
<View style={[styles.itemCard, { backgroundColor: colors.card }]}>
<View style={styles.itemInfo}>
<Text style={[styles.itemName, { color: colors.text }]}>
{item.name}
</Text>

    <Text style={[styles.price, { color: colors.secondary }]}>
      Rs. {Number(item.price).toFixed(2)} each
    </Text>

    <Text style={[styles.subtotal, { color: colors.subtotal }]}>
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

      <Text style={[styles.quantity, { color: colors.text }]}>
        {item.quantity}
      </Text>

      <TouchableOpacity
        style={styles.quantityButton}
        onPress={() => changeQuantity(item.id, 1)}
      >
        <Text style={styles.quantityButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>

  <TouchableOpacity
    style={[
      styles.removeButton,
      { backgroundColor: colors.removeBackground },
    ]}
    onPress={() => removeFromCart(item.id)}
  >
    <Text style={[styles.removeText, { color: colors.removeText }]}>
      Remove
    </Text>
  </TouchableOpacity>
</View>

);

return (
<View style={[styles.container, { backgroundColor: colors.background }]}>
{cartItems.length === 0 ? (
<View style={styles.emptyContainer}>
<Text style={styles.emptyEmoji}>🛒</Text>

      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Your Cart is Empty
      </Text>

      <Text style={[styles.emptyText, { color: colors.secondary }]}>
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

      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Text style={[styles.totalLabel, { color: colors.secondary }]}>
          Total Bill
        </Text>

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
                {
                  text: 'Clear',
                  onPress: clearCart,
                },
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

const styles = StyleSheet.create({
container: {
flex: 1,
},
list: {
padding: 15,
paddingBottom: 10,
},
itemCard: {
padding: 15,
marginBottom: 12,
borderRadius: 12,
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
elevation: 2,
},
itemInfo: {
flex: 1,
},
itemName: {
fontSize: 18,
fontWeight: 'bold',
marginBottom: 6,
},
price: {
fontSize: 14,
},
subtotal: {
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
backgroundColor: '#E85D04',
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
fontSize: 17,
fontWeight: 'bold',
marginHorizontal: 15,
},
removeButton: {
paddingVertical: 8,
paddingHorizontal: 10,
borderRadius: 8,
marginLeft: 8,
},
removeText: {
fontWeight: 'bold',
fontSize: 12,
},
footer: {
padding: 20,
borderTopLeftRadius: 18,
borderTopRightRadius: 18,
elevation: 5,
},
totalLabel: {
fontSize: 16,
},
totalPrice: {
fontSize: 26,
fontWeight: 'bold',
color: '#E85D04',
marginTop: 5,
marginBottom: 15,
},
orderButton: {
backgroundColor: '#E85D04',
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
color: '#D00000',
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
fontSize: 22,
fontWeight: 'bold',
marginBottom: 8,
},
emptyText: {
textAlign: 'center',
marginBottom: 20,
},
menuButton: {
backgroundColor: '#E85D04',
paddingVertical: 13,
paddingHorizontal: 25,
borderRadius: 10,
},
});