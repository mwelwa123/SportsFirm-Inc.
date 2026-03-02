import { createContext, useContext, useState } from 'react';

// Create the CartContext
const CartContext = createContext();

// Provider component
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Add product to cart
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // Remove product from cart (optional)
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to access CartContext
export function useCart() {
  return useContext(CartContext);
}