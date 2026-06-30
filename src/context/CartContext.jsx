import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getCurrentUserLocal } from '../api/auth.service';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const getCartKey = () => {
    const user = getCurrentUserLocal();
    return user ? `kasa_saffron_cart_${user.id}` : 'kasa_saffron_cart';
  };

  // Load initial cart from localStorage if available, otherwise empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(getCartKey());
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  });

  const [toast, setToast] = useState({ visible: false, message: '' });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Sync cart when user logs in/out
  useEffect(() => {
    const handleUserStateChange = () => {
      try {
        const user = getCurrentUserLocal();
        const currentKey = user ? `kasa_saffron_cart_${user.id}` : 'kasa_saffron_cart';
        
        // If we just logged in, check if there's an old guest cart to migrate
        if (user) {
          const guestCartRaw = localStorage.getItem('kasa_saffron_cart');
          const guestCart = guestCartRaw ? JSON.parse(guestCartRaw) : [];
          
          if (guestCart.length > 0) {
            // Merge guest cart with existing user cart (or just use guest cart)
            const userCartRaw = localStorage.getItem(currentKey);
            const userCart = userCartRaw ? JSON.parse(userCartRaw) : [];
            
            // Simple merge: just add all guest items to user cart.
            // (A more complex merge would combine quantities for identical items)
            const mergedCart = [...userCart];
            guestCart.forEach(gItem => {
              const existing = mergedCart.find(uItem => uItem.id === gItem.id && uItem.size === gItem.size);
              if (existing) {
                existing.quantity += gItem.quantity;
              } else {
                mergedCart.push(gItem);
              }
            });
            
            setCartItems(mergedCart);
            localStorage.setItem(currentKey, JSON.stringify(mergedCart));
            localStorage.removeItem('kasa_saffron_cart'); // Clear guest cart after migration
            return;
          }
        }

        const savedCart = localStorage.getItem(currentKey);
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      } catch (e) {
        setCartItems([]);
      }
    };
    window.addEventListener('userStateChange', handleUserStateChange);
    return () => window.removeEventListener('userStateChange', handleUserStateChange);
  }, []);

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if item already exists (matching id and size)
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === item.id && i.size === item.size
      );

      if (existingItemIndex >= 0) {
        // Increase quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + (item.quantity || 1)
        };
        return newItems;
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }
    });
    
    showToast(`Added ${item.quantity || 1}x to cart`);
  };

  const removeFromCart = (id, size) => {
    setCartItems((prevItems) => 
      prevItems.filter((i) => !(i.id === id && i.size === size))
    );
  };

  const updateQuantity = useCallback((id, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id && item.size === size) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotalItems = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);
  
  const cartSubtotal = useMemo(() => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0), [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotalItems,
    cartSubtotal
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotalItems, cartSubtotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Toast Notification */}
      <div 
        className={`fixed top-[90px] right-6 z-[9999] transition-all duration-500 ease-out flex items-center gap-3 bg-gradient-to-r from-[#2c0107] to-[#140003] text-white px-5 py-3 rounded-xl border border-[#E6C587]/30 shadow-[0_10px_30px_rgba(81,12,27,0.4)] ${
          toast.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-[#E6C587]/20 flex items-center justify-center border border-[#E6C587]/50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#E6C587" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#E6C587]/80">Success</span>
          <span className="text-[13px] font-medium tracking-wide">{toast.message}</span>
        </div>
      </div>
    </CartContext.Provider>
  );
};
