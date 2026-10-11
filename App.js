import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import CartScreen from './src/screens/CartScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import ReservationScreen from './src/screens/ReservationScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { ProfileProvider } from './src/context/ProfileContext';

const Stack = createNativeStackNavigator();

export default function App() {
return (
<ThemeProvider>
<ProfileProvider>
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
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'My Profile' }}
            />

            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ title: 'My Cart' }}
            />

            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ title: 'Manager Dashboard' }}
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

            <Stack.Screen
              name="Reservation"
              component={ReservationScreen}
              options={{ title: 'Table Reservation' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </OrderProvider>
    </CartProvider>
  </ProfileProvider>
</ThemeProvider>

);
}