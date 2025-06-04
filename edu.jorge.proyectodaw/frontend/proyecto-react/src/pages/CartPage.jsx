import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CartPage.module.css';
import CartItem from '../components/CartItem/CartItem';

const CartPage = () => {
  const navigate = useNavigate();

  const cartItems = [
    {
      id: 1,
      name: 'Cosmic X',
      category: 'Tabla snowboard',
      image: 'https://res.cloudinary.com/dluvwj5lo/image/upload/v1748935575/CosmicX_xfvdog.png',
      price: 599.99,
      originalPrice: 649.99,
      size: '152',
      quantity: 1
    },
    {
      id: 2,
      name: 'Fijaciones para snowboard',
      category: 'Accesorios',
      image: 'https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903375/fijaciones_y7cuou.png',
      price: 119.99,
      quantity: 2
    },
    {
      id: 3,
      name: 'Guantes térmicos',
      category: 'Accesorios',
      image: 'https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904515/Guantes_p94a8p.png',
      price: 35.50,
      quantity: 1
    }
  ];

  const handleQuantityChange = (id, change) => {
    // Lógica para cambiar cantidad
  };

  const handleRemoveItem = (id) => {
    // Lógica para eliminar item
  };

  return (
    <div className={styles.cartPage}>
      <h1 className={styles.title}>Tu Carrito</h1>
      
      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {cartItems.map(item => (
            <CartItem
              key={item.id}
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
              <span>€875.47</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span className={styles.freeShipping}>Gratis</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>€875.47</span>
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