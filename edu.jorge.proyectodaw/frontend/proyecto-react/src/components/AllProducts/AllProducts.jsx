import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from "./AllProducts.module.css";

const allProductsStatic = [
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748935575/CosmicX_xfvdog.png",
    title: "Cosmic X",
    category: "Tabla snowboard",
    variant: "1 diseño",
    price: "599,99",
    type: "snowboard"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904509/Divinium_Pure_sh38fd.png",
    title: "Divinium",
    category: "Tabla snowboard",
    variant: "2 diseños",
    price: "669,99",
    type: "snowboard"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904513/Vanilla_Luv_red_mzurex.png",
    title: "Vanilla Luv",
    category: "Tabla snowboard",
    variant: "4 colores",
    price: "339,99",
    type: "snowboard"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904510/Etherreum_h2ehdk.png",
    title: "Ethereum",
    category: "Tabla snowboard",
    variant: "1 diseño",
    price: "549,99",
    type: "snowboard"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904513/Cosmic_Wanderer1_riyfal.png",
    title: "Cosmic Wanderer",
    category: "Tabla snowboard",
    variant: "2 diseños",
    price: "399,99",
    type: "snowboard"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904512/Cosmic_Reaver_jkfwgw.png",
    title: "Cosmic Reaver",
    category: "Tabla snowboard",
    variant: "1 diseño",
    price: "399,99",
    type: "snowboard"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904517/Purple_Thunder_iol78a.png",
    title: "Purple Thunder",
    category: "Tabla snowboard",
    variant: "1 diseño",
    price: "399,99",
    type: "snowboard"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904509/Kaizen_egtrjx.png",
    title: "Kaizen",
    category: "Tabla snowboard",
    variant: "1 diseño",
    price: "399,99",
    type: "snowboard"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904511/Tomoe_3_firsef.png",
    title: "Tomoe 3",
    category: "Tabla snowboard",
    variant: "1 diseño",
    price: "299,99",
    type: "snowboard"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903377/Cosmic_Y_utppmw.png",
    title: "Cosmic Y",
    category: "Esquís",
    variant: "1 diseño",
    price: "399,99",
    type: "ski"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904516/Celine_Pirris_pqisbu.png",
    title: "Celine Pirris",
    category: "Tabla snowboard",
    variant: "1 diseño",
    price: "299,99",
    type: "snowboard"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/Vanilla_Disluv_l5iayv.png",
    title: "Vanilla Disluv",
    category: "Esquís",
    variant: "4 colores",
    price: "339,99",
    type: "ski"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903377/White_Fury_rw4ugu.png",
    title: "White Fury",
    category: "Esquís",
    variant: "1 diseño",
    price: "399,99",
    type: "ski"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/Addicted_777_kj9tf8.png",
    title: "Adicted 777",
    category: "Esquís",
    variant: "2 diseños",
    price: "777,77",
    type: "ski"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904514/Flame_red_uepay6.png",
    title: "Flame",
    category: "Esquís",
    variant: "6 colores",
    price: "299,99",
    type: "ski"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904506/Devils_Game_Death_kqr3fj.png",
    title: "Devil's Game",
    category: "Esquís",
    variant: "1 diseño",
    price: "666,66",
    type: "ski"
  },
  {
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904506/Devils_Game_Death_kqr3fj.png",
    title: "Devil's Game",
    category: "Esquís",
    variant: "1 diseño",
    price: "666,66",
    type: "ski"
  }
];

export const AllProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [allProducts, setAllProducts] = useState([]); // Nuevo estado para productos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 1000 },
    characteristics: {
      polivalencia: 0,
      agarre: 0,
      rigidez: 0,
      estabilidad: 0
    }
  });
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const productsPerPage = 16; // 4 filas x 4 productos por fila

  // Fetch productos del backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/products?outputType=list');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Productos obtenidos:', data);
        
        const mappedProducts = data.map(product => ({
          id: product.id,
          image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904509/Divinium_Pure_sh38fd.png",
          title: product.name,
          category: product.categoryName,
          price: product.price,
          type: product.categoryName === "Snowboard" ? "snowboard" : 
                product.categoryName === "Esquí" ? "ski" : "accesorios"
        }));
        
        setAllProducts(mappedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        // Usar productos estáticos como fallback
        setAllProducts(allProductsStatic);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Leer el filtro, página y ordenamiento de la URL al cargar el componente
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    const pageParam = searchParams.get('page');
    const sortParam = searchParams.get('sort');
    
    if (filterParam && ["Snowboard", "Esquí", "Accesorios"].includes(filterParam)) {
      setActiveFilter(filterParam);
    }
    
    if (pageParam) {
      const page = parseInt(pageParam);
      if (page > 0) {
        setCurrentPage(page);
      }
    }

    if (sortParam && ["price-low", "price-high", "name", "newest"].includes(sortParam)) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  // Actualizar la URL cuando cambie el filtro
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Resetear a la primera página al cambiar filtro
    
    const newParams = {};
    if (filter !== "Todos") {
      newParams.filter = filter;
    }
    if (sortBy !== "default") {
      newParams.sort = sortBy;
    }
    newParams.page = "1";
    
    setSearchParams(newParams);
  };

  // Función para manejar filtros
  const handleFilterAdd = (filter) => {
    setActiveFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(filter) 
        ? prev.categories.filter(f => f !== filter)
        : [...prev.categories, filter]
    }));
  };

  const handleFilterRemove = (filter) => {
    setActiveFilters(prev => ({
      ...prev,
      categories: prev.categories.filter(f => f !== filter)
    }));
  };

  const handlePriceRangeChange = (min, max) => {
    setActiveFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const handleCharacteristicChange = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [key]: value
      }
    }));
  };

  // Manejar cambio de ordenamiento
  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    setCurrentPage(1); // Resetear a la primera página al cambiar ordenamiento
    
    const newParams = {};
    if (activeFilter !== "Todos") {
      newParams.filter = activeFilter;
    }
    if (newSortBy !== "default") {
      newParams.sort = newSortBy;
    }
    newParams.page = "1";
    
    setSearchParams(newParams);
  };

  // Función auxiliar para convertir precio a número
  const parsePrice = (price) => {
    if (typeof price === 'number') {
      return price;
    }
    if (typeof price === 'string') {
      return parseFloat(price.replace(',', '.'));
    }
    return 0;
  };

  // Función para ordenar productos
  const sortProducts = (products) => {
    const sortedProducts = [...products];
    
    switch (sortBy) {
      case "price-low":
        return sortedProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      
      case "price-high":
        return sortedProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      
      case "name":
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      
      case "newest":
        return sortedProducts.reverse();
      
      default:
        return sortedProducts;
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className={styles.container}>
        <section className={styles.section}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h2>Cargando productos...</h2>
          </div>
        </section>
      </div>
    );
  }

  // Filtrar productos
  const filteredProducts = allProductsStatic.filter(product => {
    // Category filter
    if (activeFilters.categories.length > 0) {
      const productCategory = product.category.split(" ")[1]; // "Tabla snowboard" -> "snowboard"
      if (!activeFilters.categories.includes(productCategory)) {
        return false;
      }
    }

    // Price filter
    const productPrice = parseFloat(product.price.replace(',', '.'));
    if (productPrice < activeFilters.priceRange.min || 
        productPrice > activeFilters.priceRange.max) {
      return false;
    }

    // For demo purposes, let's assign random characteristics to products
    const productCharacteristics = {
      polivalencia: Math.floor(Math.random() * 5) + 1,
      agarre: Math.floor(Math.random() * 5) + 1,
      rigidez: Math.floor(Math.random() * 5) + 1,
      estabilidad: Math.floor(Math.random() * 5) + 1
    };

    // Characteristics filter
    for (const [key, minValue] of Object.entries(activeFilters.characteristics)) {
      if (minValue > 0 && productCharacteristics[key] < minValue) {
        return false;
      }
    }

    return true;
  });

  // Ordenar productos filtrados
  const sortedProducts = sortProducts(filteredProducts);

  // Calcular paginación
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Manejar cambio de página
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      
      const newParams = {};
      if (activeFilter !== "Todos") {
        newParams.filter = activeFilter;
      }
      if (sortBy !== "default") {
        newParams.sort = sortBy;
      }
      newParams.page = page.toString();
      
      setSearchParams(newParams);
      
      // Scroll to top cuando cambie de página
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Manejar botón anterior
  const handlePrevious = () => {
    handlePageChange(currentPage - 1);
  };

  // Manejar botón siguiente
  const handleNext = () => {
    handlePageChange(currentPage + 1);
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h1 className={styles.title}>Productos</h1>

        {error && (
          <div style={{ 
            backgroundColor: '#fee', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p>Error al cargar productos del servidor. Mostrando productos estáticos.</p>
          </div>
        )}

        <div className={styles.filtersContainer}>
          <div className={styles.activeFilters}>
            {activeFilters.categories.map((filter) => (
              <button
                key={filter}
                className={styles.activeFilter}
                onClick={() => handleFilterRemove(filter)}
              >
                {filter} <span className={styles.removeFilter}>×</span>
              </button>
            ))}
            {activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 1000 ? (
              <button
                className={styles.activeFilter}
                onClick={() => handlePriceRangeChange(0, 1000)}
              >
                {`${activeFilters.priceRange.min}€ - ${activeFilters.priceRange.max}€`}
                <span className={styles.removeFilter}>×</span>
              </button>
            ) : null}
            {Object.entries(activeFilters.characteristics).map(([key, value]) => 
              value > 0 ? (
                <button
                  key={key}
                  className={styles.activeFilter}
                  onClick={() => handleCharacteristicChange(key, 0)}
                >
                  {`${key}: ${value}/5`} <span className={styles.removeFilter}>×</span>
                </button>
              ) : null
            )}
            <button 
              className={styles.filterButton}
              onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
            >
              <img 
                src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903373/filtroicon_s1hfdw.svg"
                alt="Filtros"
              />
              <span>Filtros</span>
            </button>
          </div>

          <div className={`${styles.filterSidebar} ${isFilterSidebarOpen ? styles.open : ''}`}>
            <div className={styles.filterSidebarHeader}>
              <h3>Filtros</h3>
              <button onClick={() => setIsFilterSidebarOpen(false)}>×</button>
            </div>
            
            <div className={styles.filterSection}>
              <h4>Categoría</h4>
              <div className={styles.filterOptions}>
                {["Snowboard", "Esquí", "Accesorios"].map((filter) => (
                  <button
                    key={filter}
                    className={`${styles.filterOption} ${
                      activeFilters.categories.includes(filter) ? styles.selected : ''
                    }`}
                    onClick={() => handleFilterAdd(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterSection}>
              <h4>Rango de Precio</h4>
              <div className={styles.priceRange}>
                <div className={styles.priceInputs}>
                  <span>€</span>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={activeFilters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange(Number(e.target.value), activeFilters.priceRange.max)}
                  />
                  <span>-</span>
                  <span>€</span>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={activeFilters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange(activeFilters.priceRange.min, Number(e.target.value))}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={activeFilters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange(activeFilters.priceRange.min, Number(e.target.value))}
                  className={styles.priceSlider}
                />
              </div>
            </div>

            <div className={styles.filterSection}>
              <h4>Características</h4>
              <div className={styles.characteristicsContainer}>
                {Object.entries({
                  polivalencia: "Polivalencia",
                  agarre: "Agarre",
                  rigidez: "Rigidez", 
                  estabilidad: "Estabilidad"
                }).map(([key, label]) => (
                  <div key={key} className={styles.characteristicItem}>
                    <div className={styles.characteristicHeader}>
                      <span>{label}</span>
                      <span>{activeFilters.characteristics[key]}/5</span>
                    </div>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.barFill}
                        style={{ width: `${(activeFilters.characteristics[key] / 5) * 100}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={activeFilters.characteristics[key]}
                      onChange={(e) => handleCharacteristicChange(key, Number(e.target.value))}
                      className={styles.characteristicSlider}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sortContainer}>
            <span className={styles.sortLabel}>Ordenar por</span>
            <select 
              className={styles.sortSelect}
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="default">Seleccionar</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="name">Nombre</option>
              <option value="newest">Más Nuevos</option>
            </select>
          </div>
        </div>

        <div className={styles.grid}>
          {currentProducts.map((product, index) => (
            <ProductCard key={`${currentPage}-${index}-${sortBy}`} {...product} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={`${styles.paginationBtn} ${styles.prevBtn}`}
              onClick={handlePrevious}
              disabled={currentPage === 1}
              aria-label="Anterior"
            >
            </button>
            
            {getPageNumbers().map((pageNumber, index) => (
              pageNumber === '...' ? (
                <span key={`ellipsis-${index}`} className={styles.ellipsis}>...</span>
              ) : (
                <button 
                  key={pageNumber}
                  className={`${styles.paginationNumber} ${currentPage === pageNumber ? styles.paginationActive : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              )
            ))}
            
            <button 
              className={`${styles.paginationBtn} ${styles.nextBtn}`}
              onClick={handleNext}
              disabled={currentPage === totalPages}
              aria-label="Siguiente"
            >
            </button>
          </div>
        )}
      </section>
    </div>
  );
};