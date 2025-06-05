import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";

export const ProductCard = ({ id, image, title, category, price }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate(`/productos/${id}`);
  };

  return (
    <div id={id} className={styles.card} onClick={handleClick}>
      <img src={image} alt={title} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.category}>{category}</p>
        <div className={styles.price}>
          <span className={styles.currency}>€</span>
          <span className={styles.amount}>{price}</span>
        </div>
      </div>
    </div>
  );
};
