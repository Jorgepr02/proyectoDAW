import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [showSizeAlert, setShowSizeAlert] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  const isAccessory = category === 'Accesory' || category === 'Accesorios';
    const availableSizes = ['152', '152W', '154', '154W', '156', '156W'];

  const handleProductClick = () => {
    navigate(`/productos/${productId}`);
  };

  const addToCart = (size) => {
    const cartItem = {
      id: productId,
      name: title,
      price: price,
      size: isAccessory ? 'Única' : size,
      quantity: 1,
      image: image,
      stock: 10
    };

    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItemIndex = currentCart.findIndex(
      item => item.id === cartItem.id && item.size === cartItem.size
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += 1;
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...currentCart, cartItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleAddToCartClick = () => {
    if (isAccessory) {
      addToCart('Única');
      return;
    }

    if (!selectedSize) {
      setShowSizeAlert(true);
      return;
    }

    addToCart(selectedSize);
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
    setShowSizeAlert(false);
    addToCart(size);
  };

  return (
    <>
      <div className={styles.wishlistItem}>
        <div className={styles.productInfo}>
          <img 
            src={image} 
            alt={title} 
            className={`${styles.productImage} ${styles.clickable}`}
            onClick={handleProductClick}
          />
          <div className={styles.productDetails}>
            <h3 
              className={`${styles.productTitle} ${styles.clickable}`}
              onClick={handleProductClick}
            >
              {title}
            </h3>
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
            className={`${styles.addToCartButton} ${!inStock ? styles.disabled : ''} ${addedToCart ? styles.addedToCart : ''}`}
            onClick={handleAddToCartClick}
            disabled={!inStock || addedToCart}
          >
            {addedToCart ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
                <span>¡Añadido!</span>
              </>
            ) : (
              <span>Añadir al Carrito</span>
            )}
          </button>
        </div>
      </div>

      {!isAccessory && showSizeAlert && (
        <>
          <div className={styles.overlay} onClick={() => setShowSizeAlert(false)} />
          <div className={styles.sizeAlert}>
            <h3>Selecciona una talla</h3>
            <p>Por favor, selecciona una talla antes de continuar</p>
            <div className={styles.sizeOptionsPopup}>
              {availableSizes.map(size => (
                <button 
                  key={size}
                  className={`${styles.sizeButton} ${selectedSize === size ? styles.selected : ''}`}
                  onClick={() => handleSizeSelection(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <button 
              className={styles.cancelButton} 
              onClick={() => setShowSizeAlert(false)}
            >
              Cancelar
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default WishlistItem;