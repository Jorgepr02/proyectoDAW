import React from "react";
import styles from "./ContactInfo.module.css";

const ContactInfo = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Información de Contacto</h2>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Dirección</h3>
          <p className={styles.text}>Calle Nevada 123</p>
          <p className={styles.text}>15006 A Coruña, España</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Teléfono</h3>
          <p className={styles.text}>+34 333 333 333</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Email</h3>
          <p className={styles.text}>info@snowshop.es</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Horario</h3>
          <p className={styles.text}>Lunes a Viernes: 10:00 - 20:00</p>
          <p className={styles.text}>Sábados: 10:00 - 14:00</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;