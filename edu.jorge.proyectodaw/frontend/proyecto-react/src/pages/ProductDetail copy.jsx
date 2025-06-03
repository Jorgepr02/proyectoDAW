import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard/ProductCard';
import SizeCalculator from '../components/SizeCalculator/SizeCalculator';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0); // Nuevo estado

  const product = {
    name: "Cosmic X",
    price: 599.99,
    originalPrice: 649.99,
    rating: 5,
    reviews: 128,
    mainImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/bed2c05a54d5f610cc43190415bea8a864df9838?placeholderIfAbsent=true",
    thumbnails: [
      "https://cdn.builder.io/api/v1/image/assets/TEMP/bed2c05a54d5f610cc43190415bea8a864df9838?placeholderIfAbsent=true",
      "https://cdn.builder.io/api/v1/image/assets/TEMP/8aa356313db58308a99de8b6550046444a9f1de7?placeholderIfAbsent=true",
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e18056b538524b87de7d6c2e19c23ea7632926a0?placeholderIfAbsent=true",
      "https://cdn.builder.io/api/v1/image/assets/TEMP/af15e1505ece7c6627be31a3630ecedcae3bfda1?placeholderIfAbsent=true",
      "https://cdn.builder.io/api/v1/image/assets/TEMP/bed2c05a54d5f610cc43190415bea8a864df9838?placeholderIfAbsent=true"
    ],
    description: "La tabla Cosmic X es una leyenda en el mundo del snowboard. Diseñada para riders avanzados que buscan máximo rendimiento y respuesta precisa. Con tecnología Carbon Highlight y núcleo FSC™ Certified Super Fly II™ para una experiencia inigualable en la montaña.",
    sizes: ['152', '152W', '154', '154W', '156', '156W'],
    characteristics: [
      { name: "Polivalencia", value: 4 },
      { name: "Agarre", value: 5 },
      { name: "Rigidez", value: 5 },
      { name: "Estabilidad", value: 5 }
    ]
  };

  const relatedProducts = [
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/bed2c05a54d5f610cc43190415bea8a864df9838?placeholderIfAbsent=true",
      title: "Fijaciones para snowboard",
      category: "Accesorios",
      variant: "Talla única",
      price: "119,99"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8aa356313db58308a99de8b6550046444a9f1de7?placeholderIfAbsent=true",
      title: "Guantes térmicos",
      category: "Accesorios",
      variant: "Varias tallas",
      price: "35,50"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/e18056b538524b87de7d6c2e19c23ea7632926a0?placeholderIfAbsent=true",
      title: "Botas de snowboard",
      category: "Calzado",
      variant: "Varias tallas",
      price: "109,90"
    }
  ];

  const recommendedProducts = [
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/e18056b538524b87de7d6c2e19c23ea7632926a0?placeholderIfAbsent=true",
      title: "Burton Custom X",
      category: "Snowboard",
      variant: "Varias tallas",
      price: "649,99"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8aa356313db58308a99de8b6550046444a9f1de7?placeholderIfAbsent=true",
      title: "K2 Manifest",
      category: "Snowboard",
      variant: "Varias tallas",
      price: "589,99"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/bed2c05a54d5f610cc43190415bea8a864df9838?placeholderIfAbsent=true",
      title: "Nitro Team Pro",
      category: "Snowboard",
      variant: "Varias tallas",
      price: "559,99"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/af15e1505ece7c6627be31a3630ecedcae3bfda1?placeholderIfAbsent=true",
      title: "Ride Algorythm",
      category: "Snowboard",
      variant: "Varias tallas",
      price: "579,99"
    }
  ];

  // Función para cambiar la imagen
  const handleImageChange = (index) => {
    setCurrentImage(index);
  };

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
            {product.characteristics.map(char => (
              <div key={char.name} className={styles.characteristicBar}>
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
            Inicio / Productos / Snowboard / Cosmic X
          </div>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <div className={styles.priceSection}>
            <span className={styles.price}>{product.price}€</span>
            <span className={styles.originalPrice}>{product.originalPrice}€</span>
          </div>

          <div className={styles.ratings}>
            <div className={styles.stars}>
              {"★★★★★"}
            </div>
            <span>(135 valoraciones)</span>
          </div>
          
          <p className={styles.description}>{product.description}</p>

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
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <button className={styles.addToCartButton}>
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
            <span>Añadir al Carrito</span>
          </button>

          <div className={styles.camberSection}>
            <h3 className={styles.camberTitle}>Camber | Normal</h3>
            <p className={styles.camberDescription}>
              El camber clásico o tradicional presenta una curvatura hacia arriba en el centro de la tabla cuando está apoyada en el suelo, dejando contacto con la nieve únicamente en la zona del nose y el tail. Esta forma proporciona una excelente precisión en el giro, máximo agarre en nieve dura y un gran pop para los saltos, ya que la energía se acumula en la flexión central. Es ideal para riders que buscan estabilidad, control y respuesta en pistas preparadas y en condiciones firmes. Aunque no flota tanto en nieve polvo como otras formas, su comportamiento en carving y alta velocidad es excelente.
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