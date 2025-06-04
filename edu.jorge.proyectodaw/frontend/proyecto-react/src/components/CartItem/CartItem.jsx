import React from 'react';
import styles from './CartItem.module.css';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const { name, category, image, price, originalPrice, size, quantity } = item;

  return (
    <div className={styles.cartItem}>
      <div className={styles.itemMain}>
        <img src={image} alt={name} className={styles.itemImage} />
        <div className={styles.itemInfo}>
          <h3 className={styles.itemName}>{name}</h3>
          <p className={styles.itemCategory}>{category}</p>
          {size && (
            <p className={styles.itemSize}>
              <span>Talla:</span> <span>{size}</span>
            </p>
          )}
          <div className={styles.priceContainer}>
            <div className={styles.priceWrapper}>
              <span className={styles.price}>€{price.toFixed(2)}</span>
              {originalPrice && (
                <span className={styles.originalPrice}>€{originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.itemActions}>
        <button 
          onClick={() => onRemove(item.id)}
          className={styles.removeButton}
        >
          Eliminar
        </button>
        <div className={styles.quantityControls}>
          <button onClick={() => onQuantityChange(item.id, -1)}>−</button>
          <span>{quantity}</span>
          <button onClick={() => onQuantityChange(item.id, 1)}>+</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;