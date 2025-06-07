import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WishlistPage.module.css';
import WishlistItem from '../components/WishlistItem/WishlistItem';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        
        // Verificar autenticación inmediatamente
        if (!user) {
          navigate('/login');
          return;
        }
        
        const response = await fetch(`http://localhost:8080/api/wishlists/user/${user.clientId || user.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setWishlistItems([]);
            setError(null);
          } else if (response.status === 401 || response.status === 403 || response.status === 500) {
            // Token expirado, no válido, o error del servidor relacionado con auth
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
            return;
          } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return;
        }
        
        const data = await response.json();
        console.log('Wishlist obtenida:', data);
        
        const mappedItems = data.map(item => ({
          id: item.id,
          productId: item.id,
          image: item.images && item.images.length > 0 
            ? item.images[0] 
            : "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748935575/CosmicX_xfvdog.png",
          title: item.name,
          category: item.categoryName,
          price: item.price,
          inStock: true
        }));
        
        setWishlistItems(mappedItems);
        setError(null);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        // Si hay cualquier error y no hay usuario, redirigir a login
        const userString = localStorage.getItem('user');
        if (!userString) {
          navigate('/login');
          return;
        }
        setError(err.message);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  const handleRemoveItem = async (productId) => {
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      if (!user) {
        navigate('/login');
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/wishlists?productAction=remove`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.clientId || user.id,
            productId: productId
          })
        }
      );
      
      if (!response.ok) {
        throw new Error('Error al eliminar el producto de la lista de deseos');
      }
      
      setWishlistItems(items => items.filter(item => item.productId !== productId));
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      alert('Error al eliminar el producto de la lista de deseos');
    }
  };

  const handleAddToCart = async (wishlistItemId) => {
    try {
      const item = wishlistItems.find(item => item.id === wishlistItemId);
      if (!item) return;
      const cartData = {
        productId: item.productId,
        quantity: 1
      };

      console.log('Añadir al carrito:', cartData);
      alert('Producto añadido al carrito');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error al añadir el producto al carrito');
    }
  };

  const handleContactSupport = () => {
    navigate('/contacto');
  };

  if (loading) {
    return (
      <div className={styles.wishlistPage}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h2>Cargando lista de deseos...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wishlistPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Mi Lista de Deseos</h1>
        
        {error && (
          <div style={{ 
            backgroundColor: '#fee', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            textAlign: 'center',
            color: '#dc2626'
          }}>
            <p>Error al cargar la lista de deseos: {error}</p>
          </div>
        )}
        
        <div className={styles.wishlistItems}>
          {wishlistItems.length > 0 ? (
            wishlistItems.map(item => (
              <WishlistItem
                key={item.id}
                {...item}
                onRemove={handleRemoveItem}
                onAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <div className={styles.emptyWishlist}>
              <p>Tu lista de deseos está vacía</p>
            </div>
          )}
        </div>

        <div className={styles.helpSection}>
          <div className={styles.helpContent}>
            <h2 className={styles.helpTitle}>¿Necesitas ayuda?</h2>
            <p className={styles.helpText}>
              Nuestro equipo está aquí para ayudarte con cualquier pregunta
            </p>
          </div>
          <button className={styles.contactButton} onClick={handleContactSupport}>
            Contactar Soporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;