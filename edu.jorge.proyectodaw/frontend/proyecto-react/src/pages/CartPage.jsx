import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CartPage.module.css';
import CartItem from '../components/CartItem/CartItem';
import CheckoutModal from '../components/CheckoutModal/CheckoutModal';
import PaymentConfirmationModal from '../components/PaymentConfirmationModal/PaymentConfirmationModal';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isPaymentConfirmationOpen, setIsPaymentConfirmationOpen] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [paymentOrderId, setPaymentOrderId] = useState(null);

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

  const handleCheckout = async (orderData) => {
    try {
      console.log('=== INICIANDO CHECKOUT ===');
      console.log('Datos del pedido a enviar:', orderData);
      
      setLoading(true);
      
      const orderResponse = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      console.log('Response status:', orderResponse.status);

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('Error en response:', errorText);
        throw new Error(`Error al crear pedido: ${orderResponse.status} - ${errorText}`);
      }

      const orderResult = await orderResponse.json();
      console.log('Pedido creado exitosamente:', orderResult);
      
      setCreatedOrder(orderResult);
      setPendingOrderData(orderData);
      
      setTimeout(() => {
        setIsCheckoutModalOpen(false);
        setTimeout(() => {
          setIsPaymentConfirmationOpen(true);
        }, 100);
      }, 100);
      
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert(`Error: ${error.message}\n\nPor favor, inténtalo de nuevo.`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      if (!createdOrder) {
        throw new Error('No se encontró información del pedido');
      }

      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      if (!user) {
        alert('No se encontró información del usuario. Por favor, inicia sesión.');
        navigate('/login');
        return;
      }

      const orderId = createdOrder.id;
      const amountCents = Math.round(createdOrder.amount * 100);
      const clientId = user.clientId || user.id;

      console.log('Procesando pago:', { orderId, amountCents, clientId, userInfo: user });

      const createPaymentResponse = await fetch(
        `http://localhost:8080/api/payments/create?orderId=${orderId}&amount=${amountCents}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!createPaymentResponse.ok) {
        const errorText = await createPaymentResponse.text();
        throw new Error(`Error al crear payment intent: ${createPaymentResponse.status} - ${errorText}`);
      }

      const paymentData = await createPaymentResponse.json();
      console.log('Payment intent creado:', paymentData);

      const processPaymentResponse = await fetch(
        `http://localhost:8080/api/payments/${orderId}/pay?clientId=${clientId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!processPaymentResponse.ok) {
        const errorText = await processPaymentResponse.text();
        throw new Error(`Error al procesar pago: ${processPaymentResponse.status} - ${errorText}`);
      }

      const paymentResult = await processPaymentResponse.json();
      console.log('Pago procesado exitosamente:', paymentResult);
      
      setIsPaymentConfirmationOpen(false);
      setPendingOrderData(null);
      setCreatedOrder(null);
      
      setPaymentOrderId(orderId);
      setShowPaymentSuccessModal(true);
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert(`Error en el pago: ${error.message}\n\nPor favor, inténtalo de nuevo.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePaymentSuccess = () => {
    setShowPaymentSuccessModal(false);
    setPaymentOrderId(null);
    
    localStorage.removeItem('cart');
    setCartItems([]);
    
    navigate('/orders');
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 0; 
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
          <button 
            className={styles.checkoutButton}
            onClick={() => setIsCheckoutModalOpen(true)}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Proceder al Pago'}
          </button>
          <button 
            className={styles.continueShoppingButton}
            onClick={() => navigate('/productos')}
          >
            Continuar Comprando
          </button>
          <div className={styles.paymentMethods}>
            <h3>Método de Pago</h3>
            <div className={styles.paymentTypes}>
              <span>Stripe</span>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cartItems}
        onSubmit={handleCheckout}
      />

      <PaymentConfirmationModal
        isOpen={isPaymentConfirmationOpen}
        onClose={() => {
          setIsPaymentConfirmationOpen(false);
          setPendingOrderData(null);
          setCreatedOrder(null);
        }}
        orderData={pendingOrderData}
        total={total}
        onConfirmPayment={handleConfirmPayment}
      />

      {showPaymentSuccessModal && (
        <>
          <div className={styles.successOverlay} onClick={handleClosePaymentSuccess} />
          <div className={styles.successModal}>
            <div className={styles.successHeader}>
              <div className={styles.successIcon}>✓</div>
              <h3>¡Pago Procesado Exitosamente!</h3>
            </div>
            <div className={styles.successContent}>
              <p>Tu pago ha sido procesado correctamente.</p>
              <p><strong>ID del pedido:</strong> {paymentOrderId}</p>
            </div>
            <div className={styles.successActions}>
              <button 
                onClick={handleClosePaymentSuccess} 
                className={styles.successButton}
              >
                Ver Mis Pedidos
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;