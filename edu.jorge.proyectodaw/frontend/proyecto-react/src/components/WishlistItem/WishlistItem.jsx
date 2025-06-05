import React from 'react';
import styles from './WishlistItem.module.css';

const WishlistItem = ({ 
  id,
  productId,
  image, 
  title, 
  category, 
  price,
  inStock, 
  onRemove, 
  onAddToCart 
}) => {
  return (
    <div className={styles.wishlistItem}>
      <div className={styles.productInfo}>
        <img src={image} alt={title} className={styles.productImage} />
        <div className={styles.productDetails}>
          <h3 className={styles.productTitle}>{title}</h3>
          <p className={styles.productCategory}>{category}</p>
          <div className={styles.priceSection}>
            <span className={styles.price}>€ {price}</span>
          </div>
        </div>
      </div>
      
      <button 
        className={styles.removeButton}
        onClick={() => onRemove(id)}
      >
        Eliminar
      </button>
      
      <div className={styles.bottomActions}>
        <div className={styles.stockStatus}>
          {inStock ? (
            <span className={styles.inStock}>En Stock</span>
          ) : (
            <span className={styles.outOfStock}>Sin Stock</span>
          )}
        </div>
        
        <button 
          className={`${styles.addToCartButton} ${!inStock ? styles.disabled : ''}`}
          onClick={() => onAddToCart(id)}
          disabled={!inStock}
        >
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
};

export default WishlistItem;