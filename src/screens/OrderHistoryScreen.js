import React from 'react';
import {
View,
Text,
FlatList,
StyleSheet,
} from 'react-native';

import { useOrders } from '../context/OrderContext';

export default function OrderHistoryScreen() {
const { orders } = useOrders();

return (
<View style={styles.container}>
<Text style={styles.heading}>My Order History</Text>

  <FlatList
    data={[...orders].reverse()}
    keyExtractor={(item) => item.id}
    ListEmptyComponent={
      <Text style={styles.empty}>
        You have not placed any orders yet.
      </Text>
    }
    renderItem={({ item }) => (
      <View style={styles.card}>
        <Text style={styles.title}>
          Order #{item.id.slice(-6)}
        </Text>

        <Text>Date: {item.date}</Text>

        {item.items.map((food, index) => (
          <Text key={`${food.id}-${index}`}>
            {food.name} x {food.quantity || 1}
          </Text>
        ))}

        <Text style={styles.total}>
          Total: Rs. {item.totalPrice}
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

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#F5F5F5',
padding: 15,
},
heading: {
fontSize: 23,
fontWeight: 'bold',
marginBottom: 15,
},
card: {
backgroundColor: '#FFFFFF',
padding: 15,
borderRadius: 10,
marginBottom: 12,
elevation: 2,
},
title: {
fontSize: 18,
fontWeight: 'bold',
marginBottom: 8,
},
total: {
fontWeight: 'bold',
marginTop: 8,
},
status: {
color: '#16834A',
fontWeight: 'bold',
marginTop: 5,
},
empty: {
textAlign: 'center',
marginTop: 25,
fontSize: 16,
},
});