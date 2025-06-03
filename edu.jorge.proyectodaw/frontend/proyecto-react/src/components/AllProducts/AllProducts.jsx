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
  }
];

export const AllProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("Todos");

  // Leer el filtro de la URL al cargar el componente
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam && ["Snowboard", "Esquí", "Accesorios"].includes(filterParam)) {
      setActiveFilter(filterParam);
    }
  }, [searchParams]);

  // Actualizar la URL cuando cambie el filtro
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === "Todos") {
      setSearchParams({});
    } else {
      setSearchParams({ filter });
    }
  };

  const filteredProducts = allProducts.filter(product => {
    if (activeFilter === "Todos") return true;
    if (activeFilter === "Snowboard") return product.type === "snowboard";
    if (activeFilter === "Esquí") return product.type === "ski";
    if (activeFilter === "Accesorios") return product.type === "accesorios";
    return true;
  });

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
            <select className={styles.sortSelect}>
              <option value="default">Seleccionar</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="name">Nombre</option>
              <option value="newest">Más Nuevos</option>
            </select>
          </div>
        </div>

        <div className={styles.grid}>
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>

        <div className={styles.pagination}>
          <button className={styles.paginationBtn}>
            <img 
              src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748965283/arrow_gtemug.svg" 
              alt="Anterior" 
              width="16" 
              height="16"
            />
          </button>
          <button className={`${styles.paginationNumber} ${styles.paginationActive}`}>1</button>
          <button className={styles.paginationNumber}>2</button>
          <button className={styles.paginationBtn}>
            <img 
              src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748965283/arrow_gtemug.svg" 
              alt="Siguiente" 
              width="16" 
              height="16"
              style={{ transform: "rotate(180deg)" }}
            />
          </button>
        </div>
      </section>
    </div>
  );
};