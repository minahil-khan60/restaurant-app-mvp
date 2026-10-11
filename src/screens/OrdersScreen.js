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

export default function OrdersScreen() {
  const { orders, updateOrderStatus } = useOrders();
  console.log('TOTAL ORDERS:', orders.length, orders);

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
        Order #{item.id.slice(-6)}
      </Text>

      <Text style={styles.date}>{item.date}</Text>

      <Text style={styles.heading}>Items:</Text>

      {item.items.map((food, index) => (
        <Text key={`${food.id}-${index}`} style={styles.food}>
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
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#222',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  orderTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#E85D04',
  },
  date: {
    color: '#777',
    marginTop: 5,
    marginBottom: 12,
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  food: {
    fontSize: 15,
    marginVertical: 2,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  status: {
    fontSize: 15,
    marginTop: 10,
    color: '#287A36',
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 5,
  },
  statusButton: {
    backgroundColor: '#EEEEEE',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 7,
  },
  selectedButton: {
    backgroundColor: '#E85D04',
  },
  statusButtonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFF',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});