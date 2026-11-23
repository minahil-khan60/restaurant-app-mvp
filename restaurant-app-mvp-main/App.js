import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
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
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ProfileProvider } from './src/context/ProfileContext';

const Stack = createNativeStackNavigator();

const COLORS = {
  orange: '#F47721',
  lightBackground: '#FFF8F0',
  darkBackground: '#121212',
  white: '#FFFFFF',
  darkCard: '#242424',
  darkText: '#25211E',
  grey: '#DDDDDD',
};

function AppNavigator() {
  const { isDarkMode } = useTheme();

  const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: COLORS.orange,
      background: isDarkMode
        ? COLORS.darkBackground
        : COLORS.lightBackground,
      card: isDarkMode ? COLORS.darkCard : COLORS.white,
      text: isDarkMode ? COLORS.white : COLORS.darkText,
      border: isDarkMode ? '#383838' : '#EFE5DA',
      notification: COLORS.orange,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode
              ? COLORS.darkCard
              : COLORS.white,
          },

          headerTintColor: isDarkMode
            ? COLORS.white
            : COLORS.darkText,

          headerTitleStyle: {
            fontWeight: 'bold',
          },

          headerShadowVisible: false,

          contentStyle: {
            backgroundColor: isDarkMode
              ? COLORS.darkBackground
              : COLORS.lightBackground,
          },

          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: 'Quick Bite' }}
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
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <CartProvider>
          <OrderProvider>
            <AppNavigator />
          </OrderProvider>
        </CartProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}