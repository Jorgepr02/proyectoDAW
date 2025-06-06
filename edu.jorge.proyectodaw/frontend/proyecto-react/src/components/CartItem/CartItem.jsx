import React from 'react';
import styles from './CartItem.module.css';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const { id, name, image, price, size, quantity, stock } = item;

  return (
    <div className={styles.cartItem}>
      <div className={styles.itemMain}>
        <img src={image} alt={name} className={styles.itemImage} />
        <div className={styles.itemInfo}>
          <h3 className={styles.itemName}>{name}</h3>
          {size && (
            <p className={styles.itemSize}>
              <span>Talla: {size}</span>
            </p>
          )}
          <p className={styles.itemStock}>Stock disponible: {stock}</p>
          <div className={styles.priceContainer}>
            <span className={styles.price}>€{price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={styles.itemActions}>
        <button 
          onClick={() => onRemove(id, size)}
          className={styles.removeButton}
        >
          Eliminar
        </button>
        <div className={styles.quantityControls}>
          <button 
            onClick={() => onQuantityChange(id, size, -1)}
            disabled={quantity <= 1}
          >
            −
          </button>
          <span>{quantity}</span>
          <button 
            onClick={() => onQuantityChange(id, size, 1)}
            disabled={quantity >= stock}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;