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
    e.stopPropagation();
    
    console.log('=== CHECKOUT MODAL SUBMIT ===');
    console.log('Form data:', formData);
    console.log('Cart items:', cartItems);
    
    if (!validateForm()) {
      console.log('Validación falló:', errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      console.log('Usuario obtenido:', user);
      
      if (!user) {
        alert('No se encontró información del usuario. Por favor, inicia sesión.');
        return;
      }

      if (!cartItems || cartItems.length === 0) {
        alert('No hay productos en el carrito.');
        return;
      }

      const details = cartItems.map(item => ({
        productId: item.id,
        amount: item.quantity
      }));

      console.log('Details mapeados:', details);

      const orderData = {
        shippingNameAddress: formData.shippingNameAddress,
        shippingNumberAddress: formData.shippingNumberAddress,
        phone: formData.phone,
        notes: formData.notes,
        idClient: user.clientId || user.id,
        details
      };

      console.log('Order data completo:', orderData);

      // IMPORTANTE: Llamar a onSubmit y esperar a que termine
      await onSubmit(orderData);
      
      // CORREGIDO: Solo resetear el formulario si todo fue exitoso
      // NO cerramos el modal aquí - lo hace el parent component
      console.log('Pedido procesado exitosamente en CheckoutModal');
      
    } catch (error) {
      console.error('Error en handleSubmit del CheckoutModal:', error);
      alert('Error al procesar el pedido. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // AÑADIDO: Función para manejar el cierre del modal
  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        shippingNameAddress: '',
        shippingNumberAddress: '',
        phone: '',
        notes: '',
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Finalizar Pedido</h2>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            disabled={isSubmitting}
            type="button" // AÑADIDO: Especificar tipo
          >
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.orderSummary}>
            <h3>Resumen del Pedido</h3>
            {cartItems && cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={`${item.id}-${item.size || 'default'}`} className={styles.orderItem}>
                  <span>{item.name} ({item.size || 'Única'})</span>
                  <span>{item.quantity}x €{item.price}</span>
                </div>
              ))
            ) : (
              <div className={styles.orderItem}>
                <span>No hay productos</span>
              </div>
            )}
            <div className={styles.orderTotal}>
              <strong>
                Total: €{cartItems ? cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2) : '0.00'}
              </strong>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !cartItems || cartItems.length === 0}
            >
              {isSubmitting ? 'Procesando pedido...' : 'Finalizar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;