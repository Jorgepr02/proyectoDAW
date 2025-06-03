import React from "react";
import styles from "./AboutPage.module.css";

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Sobre Nosotros</h1>

        <section className={styles.section}>
          <div className={styles.textContent}>
            <h2 className={styles.sectionTitle}>Quiénes Somos</h2>
            <p className={styles.text}>
              En SnowShop somos apasionados de los deportes de invierno y entendemos la importancia de contar
              con el equipo adecuado. Desde nuestros inicios, nos hemos dedicado a ofrecer productos de la más alta calidad
              para snowboard y esquí.
            </p>
            <p className={styles.text}>
              Nuestro equipo está formado por expertos que viven y
              respiran los deportes de invierno. Nuestro conocimiento y experiencia están a tu disposición
              para ayudarte a encontrar el equipo perfecto para tus aventuras en la nieve.
            </p>
          </div>
          <div className={styles.imageContainer}>
            <img
              src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904505/snowboard-flip-i96988_iaulbb.webp"
              alt="Snowboarders"
              className={styles.sideImage}
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.imageContainer}>
            <video
              src="https://res.cloudinary.com/dluvwj5lo/video/upload/v1748904526/Gen-4_Turbo_a_man_snowboarding_sliding_through_the_snow_zig_zag_movement_3926452914-vmake_hxzqth.mp4"
              className={styles.video}
              controls
              muted
              loop
              autoPlay
            >
              Tu navegador no soporta videos HTML5.
            </video>
          </div>
          <div className={styles.textContent}>
            <h2 className={styles.sectionTitle}>Experiencia y Calidad</h2>
            <p className={styles.text}>
              En SnowShop, la calidad es nuestra prioridad. Trabajamos exclusivamente con las marcas más
              prestigiosas del sector, garantizando que cada producto que ofrecemos cumpla con los más altos estándares de
              calidad y rendimiento.
            </p>
            <p className={styles.text}>
              Nuestro compromiso con la excelencia se refleja en cada aspecto de nuestro servicio, desde el
              asesoramiento personalizado hasta el servicio post-venta.
            </p>
          </div>
        </section>

        <section className={styles.valuesSection}>
          <h2 className={styles.valuesSectionTitle}>Nuestros Valores</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>✓</div>
              <h3 className={styles.valueTitle}>Calidad Premium</h3>
              <p className={styles.valueText}>
                Solo trabajamos con las mejores marcas y productos del mercado para garantizar tu seguridad y satisfacción.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>+</div>
              <h3 className={styles.valueTitle}>Experiencia Experta</h3>
              <p className={styles.valueText}>
                Nuestro equipo cuenta con años de experiencia y conocimiento profundo en deportes de invierno.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>💬</div>
              <h3 className={styles.valueTitle}>Servicio Personalizado</h3>
              <p className={styles.valueText}>
                Ofrecemos asesoramiento personalizado para encontrar el equipo perfecto para cada cliente.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.charactersSection}>
          <div className={styles.charactersContainer}>
            <img
              src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904523/ChatGPT_Image_23_abr_2025_11_03_22_wvjrs8.png"
              alt="Mascotas de SnowShop"
              className={styles.charactersImage}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;