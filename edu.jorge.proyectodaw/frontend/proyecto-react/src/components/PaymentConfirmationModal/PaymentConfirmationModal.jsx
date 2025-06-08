import React, { useState, useEffect } from 'react';
import styles from './PaymentConfirmationModal.module.css';

const PaymentConfirmationModal = ({ isOpen, onClose, orderData, total, onConfirmPayment }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientPhone, setClientPhone] = useState('');

  useEffect(() => {
    const fetchClientPhone = async () => {
      if (orderData && orderData.idClient) {
        try {
          const response = await fetch(`http://localhost:8080/api/clients/${orderData.idClient}`);
          if (response.ok) {
            const clientData = await response.json();
            setClientPhone(clientData.phone || orderData.phone || 'No disponible');
          }
        } catch (error) {
          console.error('Error fetching client phone:', error);
          setClientPhone(orderData.phone || 'No disponible');
        }
      }
    };

    if (isOpen) {
      fetchClientPhone();
    }
  }, [isOpen, orderData]);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      await onConfirmPayment();
      onClose();
    } catch (error) {
      console.error('Error en el pago:', error);
      alert(`Error en el pago: ${error.message}\n\nPor favor, inténtalo de nuevo.`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Confirmar Pago</h2>
          <button className={styles.closeButton} onClick={onClose} disabled={isProcessing}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.paymentInfo}>
            <h3>Resumen del Pedido</h3>
            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}>
                <span>Total a pagar:</span>
                <span className={styles.totalAmount}>€{total?.toFixed(2) || '0.00'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Método de pago:</span>
                <span>Stripe</span>
              </div>
              {orderData && (
                <>
                  <div className={styles.summaryRow}>
                    <span>Dirección:</span>
                    <span>{orderData.shippingNameAddress}, {orderData.shippingNumberAddress}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Teléfono:</span>
                    <span>{clientPhone}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.confirmationText}>
            <p>¿Estás seguro de que deseas proceder con el pago mediante Stripe?</p>
            <p className={styles.warningText}>
              Esta acción procesará el pago inmediatamente.
            </p>
            <div className={styles.stripeLogoContainer}>
              <img 
                src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1749385545/image_processing20250206-349039-19g3b5c_ydvorh.gif" 
                alt="Stripe" 
                className={styles.stripeLogo}
              />
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmPayment}
            className={styles.confirmButton}
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando pago...' : 'Confirmar Pago'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;