import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useOrders } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext';

export default function OrdersScreen() {
  const { orders, updateOrderStatus } = useOrders();
  const { isDarkMode } = useTheme();

  const colors = {
    background: isDarkMode ? '#121212' : '#F7F7F7',
    card: isDarkMode ? '#242424' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#222222',
    secondary: isDarkMode ? '#BBBBBB' : '#777777',
    heading: isDarkMode ? '#EEEEEE' : '#333333',
    button: isDarkMode ? '#383838' : '#EEEEEE',
    buttonText: isDarkMode ? '#FFFFFF' : '#333333',
    border: isDarkMode ? '#383838' : '#EEEEEE',
    orange: '#E85D04',
  };

  const styles = getStyles(colors);

  const statuses = [
    'Pending',
    'Preparing',
    'Ready',
    'Delivered',
    'Cancelled',
  ];

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.orderTitle}>
        Order #{String(item.id).slice(-6)}
      </Text>

      <Text style={styles.date}>{item.date}</Text>

      <Text style={styles.heading}>Items:</Text>

      {item.items.map((food, index) => (
        <Text
          key={`${food.id}-${index}`}
          style={styles.food}
        >
          {food.name} x {food.quantity}
        </Text>
      ))}

      <Text style={styles.total}>
        Total: Rs. {Number(item.totalPrice).toFixed(2)}
      </Text>

      <Text style={styles.status}>
        Current Status: {item.status}
      </Text>

      <Text style={styles.heading}>Update Status:</Text>

      <View style={styles.statusRow}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              item.status === status && styles.selectedButton,
            ]}
            onPress={() => {
              updateOrderStatus(item.id, status);
              Alert.alert('Updated', `Order status: ${status}`);
            }}
          >
            <Text
              style={[
                styles.statusButtonText,
                item.status === status && styles.selectedText,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Orders</Text>

      {orders.length === 0 ? (
        <Text style={styles.empty}>
          No orders yet. Customer orders will appear here.
        </Text>
      ) : (
        <FlatList
          data={[...orders].reverse()}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 15,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 15,
      color: colors.text,
    },
    list: {
      paddingBottom: 20,
    },
    card: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    orderTitle: {
      fontSize: 19,
      fontWeight: 'bold',
      color: colors.orange,
    },
    date: {
      color: colors.secondary,
      marginTop: 5,
      marginBottom: 12,
    },
    heading: {
      fontSize: 15,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
      color: colors.heading,
    },
    food: {
      fontSize: 15,
      marginVertical: 2,
      color: colors.text,
    },
    total: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 12,
      color: colors.text,
    },
    status: {
      fontSize: 15,
      marginTop: 10,
      color: '#4CAF50',
      fontWeight: 'bold',
    },
    statusRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
      marginTop: 5,
    },
    statusButton: {
      backgroundColor: colors.button,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 7,
    },
    selectedButton: {
      backgroundColor: colors.orange,
    },
    statusButtonText: {
      color: colors.buttonText,
      fontSize: 12,
      fontWeight: '600',
    },
    selectedText: {
      color: '#FFFFFF',
    },
    empty: {
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
      color: colors.secondary,
    },
  });