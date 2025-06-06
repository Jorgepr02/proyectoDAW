import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard/ProductCard';
import SizeCalculator from '../components/SizeCalculator/SizeCalculator';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showSizeAlert, setShowSizeAlert] = useState(false); 
  const [addedToCart, setAddedToCart] = useState(false);

  // Obtener usuario del localStorage
  const getUser = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  };

  const checkWishlistStatus = async (productId) => {
    const user = getUser();
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/wishlists/exists?userId=${user.id}&productId=${productId}`
      );
      const isInList = await response.json();
      setIsInWishlist(isInList);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlistToggle = async () => {
    const user = getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    
    try {
      const action = isInWishlist ? 'remove' : 'add';
      const response = await fetch(
        `http://localhost:8080/api/wishlists?productAction=${action}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            productId: parseInt(id)
          })
        }
      );

      if (response.ok) {
        setIsInWishlist(!isInWishlist);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      navigate('/login');
    } finally {
      setWishlistLoading(false);
    }
  };

  const fetchProductById = (productId) => {
    setLoading(true);
    setError(null);
    
    fetch(`http://localhost:8080/api/products/${productId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Producto obtenido:', data);
        const mappedProduct = {
          id: data.id,
          name: data.name,
          price: data.price,
          rating: 5,
          reviews: data.reviews ? data.reviews.length : 0,
          image: data.images && data.images.length > 0 ? data.images[0] : "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904509/Divinium_Pure_sh38fd.png",
          category: data.categoryName,
          mainImage: data.images && data.images.length > 0 ? data.images[0] : "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904509/Divinium_Pure_sh38fd.png",
          thumbnails: data.images && data.images.length > 0 ? data.images : [
            "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904509/Divinium_Pure_sh38fd.png"
          ],
          description: data.description || `La tabla ${data.name} es perfecta para riders que buscan calidad y rendimiento. Diseñada con los mejores materiales para ofrecer una experiencia única en la montaña.`,
          sizes: ['152', '152W', '154', '154W', '156', '156W'],
          characteristics: data.features ? data.features.map(feature => ({
            name: feature.name,
            value: parseInt(feature.value)
          })) : [
            { name: "Polivalencia", value: 4 },
            { name: "Agarre", value: 5 },
            { name: "Rigidez", value: 5 },
            { name: "Estabilidad", value: 5 }
          ],
          stock: data.stock,
          productReviews: data.reviews || []
        };
        setProduct(mappedProduct);
        setLoading(false);
        
        checkWishlistStatus(data.id);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id]);

  const handleImageChange = (index) => {
    setCurrentImage(index);
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 5;
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    return (totalStars / reviews.length).toFixed(1);
  };

  const handleAddToCart = () => {
    // Solo verificar talla si NO es un accesorio
    if (!isAccessory && !selectedSize) {
      setShowSizeAlert(true);
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: isAccessory ? 'Única' : selectedSize, // Talla única para accesorios
      quantity: quantity,
      image: product.thumbnails[0],
      stock: product.stock
    };

    // Obtener el carrito actual del localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    // Buscar si el producto ya existe en el carrito con la misma talla
    const existingItemIndex = currentCart.findIndex(
      item => item.id === cartItem.id && item.size === cartItem.size
    );

    if (existingItemIndex >= 0) {
      // Actualizar cantidad si el producto ya existe
      const updatedCart = [...currentCart];
      const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
      
      if (newQuantity <= product.stock) {
        updatedCart[existingItemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Cambiar estado del botón
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000); // Volver al estado normal después de 2 segundos
      } else {
        alert('No hay suficiente stock disponible');
      }
    } else {
      // Añadir nuevo producto al carrito
      const updatedCart = [...currentCart, cartItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Cambiar estado del botón
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000); // Volver al estado normal después de 2 segundos
    }
  };

  const handleBuyNow = () => {
    // Solo verificar talla si NO es un accesorio
    if (!isAccessory && !selectedSize) {
      setShowSizeAlert(true);
      return;
    }
    // Lógica para comprar ahora
    console.log('Comprar ahora:', { 
      id: product.id, 
      size: isAccessory ? 'Única' : selectedSize, 
      quantity 
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h2>Cargando producto...</h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h2>Error al cargar el producto</h2>
          <p>{error || 'Producto no encontrado'}</p>
          <button onClick={() => fetchProductById(id)}>Reintentar</button>
        </div>
      </div>
    );
  }

  // Productos relacionados (hardcodeados)
  const relatedProducts = [
  {
    id: 9,
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904515/Gafas_ch5po3.png",
    title: "Gafas de Snow Antiniebla",
    category: "Accesorios",
    price: "49,99"
  },
  {
    id: 10,
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904515/Guantes_p94a8p.png",
    title: "Guantes Térmicos",
    category: "Accesorios",
    price: "35,50"
  },
  {
    id: 11,
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903375/botas_kl6eqm.png",
    title: "Botas de Snowboard",
    category: "Accesorios",
    price: "109,90"
  }
  ];

  const recommendedProducts = [
    {
      id: 5,
      image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903377/Cosmic_Y_utppmw.png",
      title: "Cosmic Y",
      category: "Esquís",
      price: "399,99"
    },
    {
      id: 3,
      image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/Vanilla_Luv_red_ckwphd.png",
      title: "Vanilla Luv",
      category: "Tabla snowboard",
      price: "339,99"
    },
    {
      id: 7,
      image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/Vanilla_Disluv_l5iayv.png",
      title: "Vanilla Disluv",
      category: "Esquís",
      price: "339,99"
    },
    {
      id: 2,
      image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904508/Divinium_Fallen_gr7oya.png",
      title: "Divinium",
      category: "Tabla snowboard",
      price: "669,99"
    }
  ];

  // Verificar si el producto actual es un accesorio
  const isAccessory = product && (product.category === 'Accesory' || product.category === 'Accesorios');

  return (
    <div className={styles.container}>
      <div className={styles.productGrid}>
        <div className={styles.imageSection}>
          <div className={styles.imageGallery}>
            <div className={styles.mainImageContainer}>
              <img 
                src={product.thumbnails[currentImage]} 
                alt={product.name} 
                className={styles.mainImage} 
              />
              <button 
                className={`${styles.wishlistButton} ${isInWishlist ? styles.wishlistActive : ''}`}
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isInWishlist ? "#2d1282" : "none"}
                  stroke={isInWishlist ? "#2d1282" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlistLoading && <span className={styles.loadingSpinner}></span>}
              </button>
            </div>
            <div className={styles.thumbnails}>
              {product.thumbnails.map((thumb, index) => (
                <img 
                  key={index} 
                  src={thumb} 
                  alt={`${product.name} ${index + 1}`} 
                  className={`${styles.thumbnail} ${currentImage === index ? styles.selected : ''}`}
                  onClick={() => handleImageChange(index)}
                />
              ))}
            </div>
          </div>

          {/* Solo mostrar características si NO es un accesorio */}
          {!isAccessory && (
            <div className={styles.characteristics}>
              <h3 className={styles.characteristicsTitle}>Características</h3>
              {product.characteristics.map((char, index) => (
                <div key={index} className={styles.characteristicBar}>
                  <span>{char.name}</span>
                  <div className={styles.barAndValue}>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.barFill} 
                        style={{ width: `${char.value * 20}%` }}
                      />
                    </div>
                    <span className={styles.characteristicValue}>{char.value}/5</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.productInfo}>
          <div className={styles.productHeader}>
            <h1 className={styles.productTitle}>{product.name}</h1>
          </div>

          <div className={styles.priceSection}>
            <span className={styles.price}>{parseFloat(product.price).toFixed(2).replace('.', ',')}€</span>
          </div>

          <div className={styles.ratings}>
            <div className={styles.stars}>
              {"★".repeat(Math.floor(calculateAverageRating(product.productReviews)))}
              {"☆".repeat(5 - Math.floor(calculateAverageRating(product.productReviews)))}
            </div>
            <span>({product.reviews} valoraciones)</span>
          </div>
          
          <p className={styles.description}>{product.description}</p>

          <div className={styles.stockInfo}>
            <span className={product.stock > 0 ? styles.inStock : styles.outOfStock}>
              {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Sin stock'}
            </span>
          </div>

          {/* Solo mostrar selector de talla si NO es un accesorio */}
          {!isAccessory && (
            <div className={styles.sizeSelector}>
              <label>Talla</label>
              <div className={styles.sizeOptions}>
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    className={`${styles.sizeButton} ${selectedSize === size ? styles.selected : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.quantityAndWishlist}>
            <div className={styles.quantitySelector}>
              <label>Cantidad</label>
              <div className={styles.quantityControls}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={styles.quantityButton}
                >
                  -
                </button>
                <input type="number" value={quantity} readOnly />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className={styles.quantityButton}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button 
              className={`${styles.addToCartButton} ${addedToCart ? styles.addedToCart : ''}`}
              onClick={handleAddToCart}
              disabled={addedToCart}
            >
              {addedToCart ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                  </svg>
                  <span>¡Añadido!</span>
                </>
              ) : (
                <span>Añadir al carrito</span>
              )}
            </button>
            <button 
              className={styles.buyNowButton}
              onClick={handleBuyNow}
            >
              <span>Comprar ahora</span>
            </button>
          </div>

          <div className={styles.reviewsSection}>
            {product.productReviews && product.productReviews.length > 0 && (
              <>
                <h3 className={styles.reviewsTitle}>Reseñas de clientes</h3>
                <div className={styles.reviewsGrid}>
                  {product.productReviews.map((review, index) => (
                    <div key={index} className={styles.review}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewName}>{review.clientName}</span>
                        <div className={styles.reviewStars}>
                          {"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}
                        </div>
                      </div>
                      <p className={styles.reviewComment}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Solo mostrar "Complementa tu pedido" si NO es un accesorio */}
      {!isAccessory && (
        <div className={styles.complementaryProducts}>
          <h2>Complementa tu pedido</h2>
          <div className={styles.complementaryGrid}>
            {relatedProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      )}

      {/* Solo mostrar calculadora de tallas si NO es un accesorio */}
      {!isAccessory && <SizeCalculator />}

      <div className={styles.recommendedProducts}>
        <h2>También te podría interesar</h2>
        <div className={styles.productsGrid}>
          {recommendedProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>

      {/* Solo mostrar alerta de talla si NO es un accesorio */}
      {!isAccessory && showSizeAlert && (
        <>
          <div className={styles.overlay} onClick={() => setShowSizeAlert(false)} />
          <div className={styles.sizeAlert}>
            <h3>Selecciona una talla</h3>
            <p>Por favor, selecciona una talla antes de continuar</p>
            <div className={styles.sizeOptionsPopup}>
              {product.sizes.map(size => (
                <button 
                  key={size}
                  className={`${styles.sizeButton} ${selectedSize === size ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedSize(size);
                    setShowSizeAlert(false);
                  }}
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
    </div>
  );
};

export default ProductDetail;