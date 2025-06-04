import React from "react";
import styles from "./OrderCard.module.css";

const OrderCard = ({
  date,
  status,
  products,
  total,
  productCount,
  showCancelButton,
}) => {
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "entregado":
        return styles.statusDelivered;
      case "enviado":
        return styles.statusShipped;
      case "pendiente":
        return styles.statusPending;
      case "cancelado":
        return styles.statusCancelled;
      default:
        return "";
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.orderDate}>Pedido realizado el {date}</div>
        <div className={`${styles.status} ${getStatusStyle(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
        {showCancelButton && (
          <button className={styles.cancelButton}>Cancelar</button>
        )}
      </div>

      <div className={styles.products}>
        {products.map((product, index) => (
          <div key={index} className={styles.productItem}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.productImage}
            />
            <div className={styles.productInfo}>
              <div className={styles.productHeader}>
                <span className={styles.productName}>{product.name}</span>
                {product.model && (
                  <span className={styles.productModel}>{product.model}</span>
                )}
              </div>
              <div className={styles.productDetails}>
                Cantidad: {product.quantity} | €{product.price.toFixed(2)}
              </div>
            </div>
            {status === "entregado" && (
              <button className={styles.rateButton}>Valorar</button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.orderTotal}>
        <span className={styles.totalAmount}>€{total.toFixed(2)}</span>
        <span className={styles.productCount}>
          {productCount} producto{productCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
