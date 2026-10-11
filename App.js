import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';

import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CartScreen from './src/screens/CartScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
return (
<CartProvider>
<OrderProvider>
<NavigationContainer>
<StatusBar style="dark" />

      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: 'Restaurant Menu' }}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Manager Dashboard' }}
        />

        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: 'Shopping Cart' }}
        />

        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{ title: 'Manage Orders' }}
        />

        <Stack.Screen
          name="OrderHistory"
          component={OrderHistoryScreen}
          options={{ title: 'My Order History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </OrderProvider>
</CartProvider>

);
}