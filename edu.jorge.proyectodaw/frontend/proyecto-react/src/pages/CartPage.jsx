import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CartPage.module.css';
import CartItem from '../components/CartItem/CartItem';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Cargar los productos del localStorage al montar el componente
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const handleQuantityChange = (id, size, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id && item.size === size) {
        const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + change));
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (id, size) => {
    const updatedCart = cartItems.filter(item => !(item.id === id && item.size === size));
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calcular totales
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 0; // Envío gratis
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className={styles.cartPage}>
        <h1 className={styles.title}>Tu Carrito</h1>
        <div className={styles.emptyCart}>
          <h2>Tu carrito está vacío</h2>
          <p>¡Añade algunos productos increíbles!</p>
          <button 
            className={styles.continueShoppingButton}
            onClick={() => navigate('/productos')}
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <h1 className={styles.title}>Tu Carrito</h1>
      
      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {cartItems.map(item => (
            <CartItem
              key={`${item.id}-${item.size}`}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        <div className={styles.orderSummary}>
          <h2>Resumen del Pedido</h2>
          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span className={styles.freeShipping}>Gratis</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
          <button className={styles.checkoutButton}>
            Proceder al Pago
          </button>
          <button 
            className={styles.continueShoppingButton}
            onClick={() => navigate('/productos')}
          >
            Continuar Comprando
          </button>
          <div className={styles.paymentMethods}>
            <h3>Métodos de Pago Aceptados</h3>
            <div className={styles.paymentTypes}>
              <span>Visa</span>
              <span>Mastercard</span>
              <span>PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;