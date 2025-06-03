import React, { useState } from "react";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from "./FeaturedProducts.module.css";


const products = [
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
    image: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/Vanilla_Disluv_l5iayv.png",
    title: "Vanilla Disluv",
    category: "Esquís",
    variant: "4 colores",
    price: "339,99",
    type: "ski"
  }
];

export const FeaturedProducts = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filteredProducts = products.filter(product => {
    if (activeFilter === "Todos") return true;
    if (activeFilter === "Snowboard") return product.type === "snowboard";
    if (activeFilter === "Esquí") return product.type === "ski";
    return true;
  });

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Productos Destacados</h2>

      <div className={styles.filters}>
        {["Todos", "Snowboard", "Esquí"].map((filter) => (
          <button 
            key={filter}
            className={`${styles.filter} ${activeFilter === filter ? styles.filterActive : styles.filterInactive}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filteredProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </section>
  );
};