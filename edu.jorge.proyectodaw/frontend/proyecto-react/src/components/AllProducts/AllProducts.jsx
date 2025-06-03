import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from "./AllProducts.module.css";

const allProducts = [
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
  const productsPerPage = 16; // 4 filas x 4 productos por fila

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

  // Función para ordenar productos
  const sortProducts = (products) => {
    const sortedProducts = [...products];
    
    switch (sortBy) {
      case "price-low":
        return sortedProducts.sort((a, b) => parseFloat(a.price.replace(',', '.')) - parseFloat(b.price.replace(',', '.')));
      
      case "price-high":
        return sortedProducts.sort((a, b) => parseFloat(b.price.replace(',', '.')) - parseFloat(a.price.replace(',', '.')));
      
      case "name":
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      
      case "newest":
        // Asumiendo que los productos más nuevos están al principio del array
        return sortedProducts.reverse();
      
      default:
        return sortedProducts;
    }
  };

  // Filtrar productos
  const filteredProducts = allProducts.filter(product => {
    if (activeFilter === "Todos") return true;
    if (activeFilter === "Snowboard") return product.type === "snowboard";
    if (activeFilter === "Esquí") return product.type === "ski";
    if (activeFilter === "Accesorios") return product.type === "accesorios";
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

        <div className={styles.filtersContainer}>
          <div className={styles.filters}>
            {["Todos", "Snowboard", "Esquí", "Accesorios"].map((filter) => (
              <button
                key={filter}
                className={`${styles.filter} ${activeFilter === filter ? styles.filterActive : styles.filterInactive}`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
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