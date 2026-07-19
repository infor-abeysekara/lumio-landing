"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItemType = 'software' | 'hardware' | 'addon';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  type: CartItemType;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('lumio_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('lumio_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems(current => {
      const existing = current.find(item => item.id === newItem.id);
      if (existing) {
        if (existing.type === 'software' || existing.type === 'addon') return current; // Can only have 1 software license
        return current.map(item => 
          item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...current, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string | number) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    setItems(current => current.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setItems([]);

  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalAmount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
