import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard/ProductCard';
import SizeCalculator from '../components/SizeCalculator/SizeCalculator';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Obtener usuario del localStorage
  const getUser = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  };

  // Verificar si el producto está en la wishlist
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

  // Manejar toggle de wishlist
  const handleWishlistToggle = async () => {
    const user = getUser();
    if (!user) {
      // Redirigir al login si no está autenticado
      alert('Debes iniciar sesión para agregar productos a tu lista de deseos');
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
        throw new Error('Error al actualizar la lista de deseos');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Error al actualizar la lista de deseos. Inténtalo de nuevo.');
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
        
        // Verificar estado en wishlist después de cargar el producto
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

  // Productos relacionados (hardcodeados por ahora)
  const relatedProducts = [
    {
      id: 1,
      image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904509/Divinium_Pure_sh38fd.png",
      title: "Fijaciones para snowboard",
      category: "Accesorios",
      variant: "Talla única",
      price: "119,99"
    },
    {
      id: 2,
      image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904513/Vanilla_Luv_red_mzurex.png",
      title: "Guantes térmicos",
      category: "Accesorios",
      variant: "Varias tallas",
      price: "35,50"
    },
    {
      id: 3,
      image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904510/Etherreum_h2ehdk.png",
      title: "Botas de snowboard",
      category: "Calzado",
      variant: "Varias tallas",
      price: "109,90"
    }
  ];

  const recommendedProducts = [
    {
      id: 4,
      image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904513/Cosmic_Wanderer1_riyfal.png",
      title: "Burton Custom X",
      category: "Snowboard",
      variant: "Varias tallas",
      price: "649,99"
    },
    {
      id: 5,
      image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904512/Cosmic_Reaver_jkfwgw.png",
      title: "K2 Manifest",
      category: "Snowboard",
      variant: "Varias tallas",
      price: "589,99"
    },
    {
      id: 6,
      image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904517/Purple_Thunder_iol78a.png",
      title: "Nitro Team Pro",
      category: "Snowboard",
      variant: "Varias tallas",
      price: "559,99"
    },
    {
      id: 7,
      image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904509/Kaizen_egtrjx.png",
      title: "Ride Algorythm",
      category: "Snowboard",
      variant: "Varias tallas",
      price: "579,99"
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.productGrid}>
        <div className={styles.imageSection}>
          <div className={styles.imageGallery}>
            <img 
              src={product.thumbnails[currentImage]} 
              alt={product.name} 
              className={styles.mainImage} 
            />
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

          <div className={styles.characteristics}>
            <h3 className={styles.characteristicsTitle}>Características</h3>
            {product.characteristics.map((char, index) => (
              <div key={index} className={styles.characteristicBar}>
                <span>{char.name}</span>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.barFill} 
                    style={{ width: `${char.value * 20}%` }}
                  />
                </div>
                <span className={styles.characteristicValue}>{char.value}/5</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.productInfo}>
          <div className={styles.breadcrumbs}>
            Inicio / Productos / {product.category} / {product.name}
          </div>
          
          <div className={styles.productHeader}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            <button 
              className={`${styles.wishlistButton} ${isInWishlist ? styles.wishlistActive : ''}`}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              title={isInWishlist ? 'Quitar de lista de deseos' : 'Agregar a lista de deseos'}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isInWishlist ? "#ff4757" : "none"}
                stroke={isInWishlist ? "#ff4757" : "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 5v14l9-7 9 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>
              </svg>
              {wishlistLoading && <span className={styles.loadingSpinner}></span>}
            </button>
          </div>

          <div className={styles.priceSection}>
            <span className={styles.price}>{product.price}€</span>
            <span className={styles.originalPrice}>{product.originalPrice}€</span>
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

          <div className={styles.quantitySelector}>
            <label>Cantidad</label>
            <div className={styles.quantityControls}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
            </div>
          </div>

          <button 
            className={styles.addToCartButton}
            disabled={product.stock === 0 || !selectedSize}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.cartIcon}
            >
              <path d="M1 1H3L3.4 3M3.4 3H19L15 11H5M3.4 3L5 11M5 11L2.707 13.293C2.077 13.923 2.523 15 3.414 15H15" />
              <circle cx="6.5" cy="17.5" r="1.5" />
              <circle cx="14.5" cy="17.5" r="1.5" />
            </svg>
            <span>
              {product.stock === 0 ? 'Sin stock' : 
               !selectedSize ? 'Selecciona una talla' : 
               'Añadir al Carrito'}
            </span>
          </button>

          {/* Sección de reseñas */}
          {product.productReviews && product.productReviews.length > 0 && (
            <div className={styles.reviewsSection}>
              <h3>Reseñas de clientes</h3>
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
          )}

          <div className={styles.camberSection}>
            <h3 className={styles.camberTitle}>Camber | Normal</h3>
            <p className={styles.camberDescription}>
              El camber clásico o tradicional presenta una curvatura hacia arriba en el centro de la tabla cuando está apoyada en el suelo, dejando contacto con la nieve únicamente en la zona del nose y el tail. Esta forma proporciona una excelente precisión en el giro, máximo agarre en nieve dura y un gran pop para los saltos.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.complementaryProducts}>
        <h2>Complementa tu pedido</h2>
        <div className={styles.complementaryGrid}>
          {relatedProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>

      <SizeCalculator />

      <div className={styles.recommendedProducts}>
        <h2>También te podría interesar</h2>
        <div className={styles.productsGrid}>
          {recommendedProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;