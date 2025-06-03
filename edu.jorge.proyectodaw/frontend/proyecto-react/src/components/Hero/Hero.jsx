import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

export const Hero = () => {
  const [hoveredSection, setHoveredSection] = useState(null);

  return (
    <div className={styles.hero}>
      <img
        src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748937676/heroimg_u4ooj5.jpg"
        alt="Hero Image"
        className={styles.heroImage}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.container}>
          <div
            className={styles.section}
            onMouseEnter={() => setHoveredSection("snowboard")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h1 className={styles.title}>
              Equipo de
              <br />
              Snowboard
            </h1>
            <Link
              to="/productos?filter=Snowboard"
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              Ver Productos
            </Link>
          </div>

          <div className={styles.imageWrapper}>
            <img
              src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748938336/paisano_blyblr.png"
              alt="Snowboard"
              className={`${styles.centerImage} ${
                hoveredSection === "snowboard"
                  ? styles.imageLeft
                  : hoveredSection === "ski"
                  ? styles.imageRight
                  : ""
              }`}
            />
          </div>

          <div
            className={styles.section}
            onMouseEnter={() => setHoveredSection("ski")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h1 className={styles.title}>
              Equipo de
              <br />
              Esquí
            </h1>
            <Link
              to="/productos?filter=Esquí"
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
