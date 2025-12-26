"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order } from '../types/product';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  addOrder: (order: Order) => void;
  setCurrentOrder: (order: Order | null) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load orders from localStorage
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save orders to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setCurrentOrder(order);
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        addOrder,
        setCurrentOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}