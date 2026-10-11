import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderContext = createContext();

const STORAGE_KEY = 'restaurant_orders';

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedOrders = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedOrders !== null) {
          setOrders(JSON.parse(savedOrders));
        }
      } catch (error) {
        console.log('Error loading orders:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const saveOrders = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(orders)
        );
      } catch (error) {
        console.log('Error saving orders:', error);
      }
    };

    saveOrders();
  }, [orders, isLoaded]);

  const addOrder = (items, totalPrice) => {
    const newOrder = {
      id: Date.now().toString(),
      items: items.map((item) => ({ ...item })),
      totalPrice,
      status: 'Pending',
      date: new Date().toLocaleString(),
    };

    setOrders((previous) => [...previous, newOrder]);

    return newOrder;
  };

  const updateOrderStatus = (id, status) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        isLoaded,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}