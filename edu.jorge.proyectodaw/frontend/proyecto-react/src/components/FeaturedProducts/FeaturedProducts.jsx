import React, { useState, useEffect } from "react";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from "./FeaturedProducts.module.css";

export const FeaturedProducts = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/products/featured");
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        const mappedProducts = data.map((product) => ({
          id: product.id,
          image: product.images && product.images.length > 0 
            ? product.images[0] 
            : "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748935575/CosmicX_xfvdog.png",
          title: product.name,
          category: product.categoryName === "Snowboard" ? "Tabla snowboard" 
                   : product.categoryName === "Ski" ? "Esquís" 
                   : product.categoryName,
          price: product.price.toString().replace(".", ","),
          type: product.categoryName === "Snowboard" ? "snowboard" 
              : product.categoryName === "Ski" ? "ski" 
              : "accesorios"
        }));
        
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getFeaturedProducts = () => {
    if (activeFilter === "Todos") {
      const featuredNames = ["Cosmic X", "Cosmic Y", "Vanilla Luv", "Vanilla Disluv"];
      return featuredNames.map(name => 
        products.find(product => product.title === name)
      ).filter(Boolean); 
    }
    
    if (activeFilter === "Snowboard") {
      const snowboardNames = ["Cosmic X", "Divinium", "Vanilla Luv", "Kaizen"];
      return snowboardNames.map(name => 
        products.find(product => product.title === name)
      ).filter(Boolean);
    }
    
    if (activeFilter === "Esquí") {
      const skiNames = ["Cosmic Y", "Flame", "Vanilla Disluv", "Mikuseína"];
      return skiNames.map(name => 
        products.find(product => product.title === name)
      ).filter(Boolean);
    }
    
    return [];
  };

  const filteredProducts = () => {
    return getFeaturedProducts();
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Productos Destacados</h2>
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p>Cargando productos destacados...</p>
        </div>
      </section>
    );
  }

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
        {filteredProducts().map((product, index) => (
          <ProductCard key={product.id || index} {...product} />
        ))}
      </div>
    </section>
  );
};