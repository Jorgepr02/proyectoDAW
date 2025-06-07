import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import styles from './AdminProductsPage.module.css';

const AdminProductsPage = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [sortOrder, setSortOrder] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para procesar URLs de imágenes
  const processImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // Si es una URL completa (Cloudinary), devolverla tal como está
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Si es una ruta completa del servidor local
    if (imageUrl.startsWith('/src/main/java/edu/jorge/proyectodaw/img/products/')) {
      const filename = imageUrl.split('/').pop();
      return `http://localhost:8080/api/products/imgs/${filename}`;
    }
    
    // Si es otra ruta local, intentar construir URL
    if (imageUrl.startsWith('/')) {
      const filename = imageUrl.split('/').pop();
      return `http://localhost:8080/api/products/imgs/${filename}`;
    }
    
    // Si es solo un nombre de archivo
    if (!imageUrl.includes('/')) {
      return `http://localhost:8080/api/products/imgs/${imageUrl}`;
    }
    
    // Fallback: intentar extraer el nombre del archivo
    const filename = imageUrl.split('/').pop();
    return `http://localhost:8080/api/products/imgs/${filename}`;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/products?outputType=full');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Productos obtenidos:', data);
      
      const mappedProducts = data.map(product => ({
        id: product.id,
        name: product.name || 'Sin nombre',
        description: product.description || 'Sin descripción',
        price: product.price || 0,
        stock: product.stock || 0,
        categoryName: product.categoryName || 'Sin categoría',
        features: product.features || [],
        reviews: product.reviews || [],
        images: (product.images || []).map(processImageUrl).filter(Boolean),
        averageRating: calculateAverageRating(product.reviews || [])
      }));
      
      setProducts(mappedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalStars = reviews.reduce((sum, review) => sum + (review.stars || 0), 0);
    return (totalStars / reviews.length).toFixed(1);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (productId) => {
    navigate(`/admin/productos/editar/${productId}`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setProducts(products.filter(product => product.id !== productId));
          alert('Producto eliminado exitosamente');
        } else {
          throw new Error('Error al eliminar el producto');
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/admin/productos/nuevo');
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(products.map(product => product.categoryName))];
    return categories.filter(cat => cat && cat !== 'Sin categoría');
  };

  const filteredProducts = products.filter(product => {
    if (activeFilter === 'Todos') return true;
    return product.categoryName === activeFilter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return b.price - a.price;
      case 'stock':
        return b.stock - a.stock;
      case 'category':
        return a.categoryName.localeCompare(b.categoryName);
      case 'rating':
        return b.averageRating - a.averageRating;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { class: styles.outOfStock, text: 'Agotado' };
    if (stock <= 5) return { class: styles.lowStock, text: 'Poco stock' };
    return { class: styles.inStock, text: 'En stock' };
  };

  const formatFeatures = (features) => {
    if (!features || features.length === 0) return 'Sin características';
    return features.slice(0, 2).map(f => `${f.name}: ${f.value}`).join(', ');
  };

  // Componente para manejar errores de imagen
  const ProductImage = ({ src, alt, className }) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleImageError = () => {
      setHasError(true);
      console.error('Error loading image:', src);
    };

    if (hasError || !imageSrc) {
      return (
        <div className={`${className} ${styles.noImage}`}>
          Sin imagen
        </div>
      );
    }

    return (
      <img 
        src={imageSrc}
        alt={alt}
        className={className}
        onError={handleImageError}
      />
    );
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <AdminSidebar />
        <div className={styles.content}>
          <div className={styles.loading}>Cargando productos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Productos</h1>
          <button onClick={handleCreateNew} className={styles.createButton}>
            <span className={styles.plusIcon}>+</span>
            Crear Nuevo Producto
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.filtersSection}>
          <div className={styles.categoryFilters}>
            <button
              onClick={() => handleFilterChange('Todos')}
              className={`${styles.filterButton} ${activeFilter === 'Todos' ? styles.active : ''}`}
            >
              Todos
            </button>
            {getUniqueCategories().map(category => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`${styles.filterButton} ${activeFilter === category ? styles.active : ''}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className={styles.sortSection}>
            <label htmlFor="sort" className={styles.sortLabel}>Ordenar por</label>
            <select
              id="sort"
              value={sortOrder}
              onChange={handleSortChange}
              className={styles.sortSelect}
            >
              <option value="name">Nombre</option>
              <option value="price">Precio</option>
              <option value="stock">Stock</option>
              <option value="category">Categoría</option>
              <option value="rating">Valoración</option>
            </select>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Valoración</th>
                <th>Características</th>
                <th>Imágenes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map(product => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr key={product.id} className={styles.tableRow}>
                    <td className={styles.productCell}>
                      <div className={styles.productInfo}>
                        <div className={styles.productImageContainer}>
                          {product.images && product.images.length > 0 ? (
                            <ProductImage
                              src={product.images[0]}
                              alt={product.name}
                              className={styles.productImage}
                            />
                          ) : (
                            <div className={styles.noImage}>Sin imagen</div>
                          )}
                        </div>
                        <div className={styles.productDetails}>
                          <h3 className={styles.productName}>{product.name}</h3>
                          <p className={styles.productDescription}>
                            {product.description.length > 60 
                              ? `${product.description.substring(0, 60)}...` 
                              : product.description
                            }
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.priceCell}>€{product.price.toFixed(2)}</td>
                    <td className={styles.stockCell}>
                      <span className={`${styles.stockBadge} ${stockStatus.class}`}>
                        {product.stock} - {stockStatus.text}
                      </span>
                    </td>
                    <td className={styles.categoryCell}>{product.categoryName}</td>
                    <td className={styles.ratingCell}>
                      <div className={styles.ratingContainer}>
                        <span className={styles.rating}>★ {product.averageRating}</span>
                        <span className={styles.reviewCount}>({product.reviews.length})</span>
                      </div>
                    </td>
                    <td className={styles.featuresCell}>
                      <span className={styles.features}>
                        {formatFeatures(product.features)}
                      </span>
                    </td>
                    <td className={styles.imagesCell}>
                      <div className={styles.imageGallery}>
                        {product.images.slice(0, 3).map((imageUrl, index) => (
                          <ProductImage
                            key={index}
                            src={imageUrl}
                            alt={`${product.name} ${index + 1}`}
                            className={styles.thumbnailImage}
                          />
                        ))}
                        {product.images.length > 3 && (
                          <div className={styles.moreImages}>
                            +{product.images.length - 3}
                          </div>
                        )}
                        {product.images.length === 0 && (
                          <span className={styles.noImagesText}>Sin imágenes</span>
                        )}
                      </div>
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        onClick={() => handleEdit(product.id)}
                        className={styles.editButton}
                        title="Editar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="m18.5 2.5-1.5 1.5-6 6h-3v3l6-6 1.5-1.5"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className={styles.deleteButton}
                        title="Eliminar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              ←
            </button>
            
            <span className={styles.pageInfo}>
              {currentPage}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              →
            </button>
            
            <span className={styles.totalPages}>
              de {totalPages}
            </span>
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className={styles.emptyState}>
            <h3>No se encontraron productos</h3>
            <p>No hay productos que coincidan con los filtros seleccionados.</p>
          </div>
        )}

        {/* Debug info - remover en producción */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
            <h3>Debug Info:</h3>
            <p><strong>Total productos:</strong> {products.length}</p>
            <p><strong>Productos filtrados:</strong> {filteredProducts.length}</p>
            <p><strong>Categorías encontradas:</strong> {getUniqueCategories().join(', ')}</p>
            <details>
              <summary>Ver URLs de imágenes procesadas</summary>
              <pre style={{ fontSize: '11px', backgroundColor: 'white', padding: '10px', borderRadius: '4px', overflow: 'auto', maxHeight: '200px' }}>
                {JSON.stringify(products.map(p => ({ id: p.id, name: p.name, images: p.images })), null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;