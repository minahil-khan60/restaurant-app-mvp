import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

import { useOrders } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext';

export default function OrderHistoryScreen() {
  const { orders } = useOrders();
  const { isDarkMode } = useTheme();

  const colors = {
    background: isDarkMode ? '#121212' : '#F5F5F5',
    card: isDarkMode ? '#242424' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#222222',
    secondary: isDarkMode ? '#BBBBBB' : '#666666',
    border: isDarkMode ? '#383838' : '#EEEEEE',
    status: '#4CAF50',
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Order History</Text>

      <FlatList
        data={[...orders].reverse()}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            You have not placed any orders yet.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>
              Order #{String(item.id).slice(-6)}
            </Text>

            <Text style={styles.details}>
              Date: {item.date}
            </Text>

            {item.items.map((food, index) => (
              <Text
                key={`${food.id}-${index}`}
                style={styles.details}
              >
                {food.name} x {food.quantity || 1}
              </Text>
            ))}

            <Text style={styles.total}>
              Total: Rs. {Number(item.totalPrice).toFixed(2)}
            </Text>

            <Text style={styles.status}>
              Status: {item.status}
            </Text>
          </View>
        )}
      />
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
    heading: {
      fontSize: 23,
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
      borderRadius: 10,
      marginBottom: 12,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: colors.text,
    },
    details: {
      fontSize: 15,
      marginTop: 4,
      color: colors.secondary,
    },
    total: {
      fontWeight: 'bold',
      fontSize: 16,
      marginTop: 8,
      color: colors.text,
    },
    status: {
      color: colors.status,
      fontWeight: 'bold',
      marginTop: 5,
    },
    empty: {
      textAlign: 'center',
      marginTop: 25,
      fontSize: 16,
      color: colors.secondary,
    },
  });
