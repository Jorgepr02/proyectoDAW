import React, { useState } from 'react';
import styles from './CheckoutModal.module.css';

const CheckoutModal = ({ isOpen, onClose, cartItems, onSubmit }) => {
  const [formData, setFormData] = useState({
    shippingNameAddress: '',
    shippingNumberAddress: '',
    phone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.shippingNameAddress.trim()) {
      newErrors.shippingNameAddress = 'La dirección es obligatoria';
    }
    
    if (!formData.shippingNumberAddress.trim()) {
      newErrors.shippingNumberAddress = 'El número es obligatorio';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\d{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Ingresa un número de teléfono válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Obtener el usuario del localStorage
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      if (!user) {
        alert('No se encontró información del usuario. Por favor, inicia sesión.');
        return;
      }

      // Mapear productos del carrito a detalles del pedido
      const details = cartItems.map(item => ({
        productId: item.id,
        amount: item.quantity
      }));

      const orderData = {
        shippingNameAddress: formData.shippingNameAddress,
        shippingNumberAddress: formData.shippingNumberAddress,
        phone: formData.phone,
        notes: formData.notes,
        idClient: user.clientId || user.id,
        details
      };

      console.log('Datos del pedido a enviar:', orderData);
      await onSubmit(orderData);
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Finalizar Pedido</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="shippingNameAddress">Dirección *</label>
              <input
                type="text"
                id="shippingNameAddress"
                name="shippingNameAddress"
                value={formData.shippingNameAddress}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.shippingNameAddress ? styles.error : ''}`}
                placeholder="Ej: Calle Mayor"
              />
              {errors.shippingNameAddress && (
                <span className={styles.errorText}>{errors.shippingNameAddress}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="shippingNumberAddress">Número *</label>
              <input
                type="text"
                id="shippingNumberAddress"
                name="shippingNumberAddress"
                value={formData.shippingNumberAddress}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.shippingNumberAddress ? styles.error : ''}`}
                placeholder="Ej: 123"
              />
              {errors.shippingNumberAddress && (
                <span className={styles.errorText}>{errors.shippingNumberAddress}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Teléfono *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.phone ? styles.error : ''}`}
              placeholder="Ej: 612345678"
            />
            {errors.phone && (
              <span className={styles.errorText}>{errors.phone}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">Notas del Pedido (Opcional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Instrucciones especiales para la entrega..."
              rows="3"
            />
          </div>

          <div className={styles.orderSummary}>
            <h3>Resumen del Pedido</h3>
            {cartItems.map(item => (
              <div key={`${item.id}-${item.size}`} className={styles.orderItem}>
                <span>{item.name} ({item.size})</span>
                <span>{item.quantity}x €{item.price}</span>
              </div>
            ))}
            <div className={styles.orderTotal}>
              <strong>
                Total: €{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
              </strong>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando pedido y pago...' : 'Finalizar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;