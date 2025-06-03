import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";

export const ProductCard = ({ image, title, category, variant, price }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate('/productos/cosmic-x');
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <img src={image} alt={title} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.category}>{category}</p>
        <p className={styles.variant}>{variant}</p>
        <div className={styles.price}>
          <span className={styles.currency}>€</span>
          <span className={styles.amount}>{price}</span>
        </div>
      </div>
    </div>
  );
};
