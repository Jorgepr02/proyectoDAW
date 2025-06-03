import React from "react";
import styles from "./WhyChooseUs.module.css";

const features = [
  {
    icon: (
      <svg
        width="30"
        height="22"
        viewBox="0 0 30 22"
        fill="none"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 13L9 21L29 1" />
      </svg>
    ),
    title: "Calidad Garantizada",
    description:
      "Trabajamos solo con las mejores marcas del mercado para garantizar tu seguridad y satisfacción.",
  },
  {
    icon: (
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 11V19L25 25M37 19C37 21.3638 36.5344 23.7044 35.6298 25.8883C34.7252 28.0722 33.3994 30.0565 31.7279 31.7279C30.0565 33.3994 28.0722 34.7252 25.8883 35.6298C23.7044 36.5344 21.3638 37 19 37C16.6362 37 14.2956 36.5344 12.1117 35.6298C9.92784 34.7252 7.94353 33.3994 6.27208 31.7279C4.60062 30.0565 3.27475 28.0722 2.37017 25.8883C1.46558 23.7044 1 21.3638 1 19C1 14.2261 2.89642 9.64773 6.27208 6.27208C9.64773 2.89642 14.2261 1 19 1C23.7739 1 28.3523 2.89642 31.7279 6.27208C35.1036 9.64773 37 14.2261 37 19Z" />
      </svg>
    ),
    title: "Envío Rápido",
    description:
      "Entrega en 24/48 horas para que puedas disfrutar de tu equipo lo antes posible.",
  },
  {
    icon: (
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 1H5L5.8 5M5.8 5H37L29 21H9M5.8 5L9 21M9 21L4.414 25.586C3.154 26.846 4.046 29 5.828 29H29M29 29C27.9391 29 26.9217 29.4214 26.1716 30.1716C25.4214 30.9217 25 31.9391 25 33C25 34.0609 25.4214 35.0783 26.1716 35.8284C26.9217 36.5786 27.9391 37 29 37C30.0609 37 31.0783 36.5786 31.8284 35.8284C32.5786 35.0783 33 34.0609 33 33C33 31.9391 32.5786 30.9217 31.8284 30.1716C31.0783 29.4214 30.0609 29 29 29ZM13 33C13 34.0609 12.5786 35.0783 11.8284 35.8284C11.0783 36.5786 10.0609 37 9 37C7.93913 37 6.92172 36.5786 6.17157 35.8284C5.42143 35.0783 5 34.0609 5 33C5 31.9391 5.42143 30.9217 6.17157 30.1716C6.92172 29.4214 7.93913 29 9 29C10.0609 29 11.0783 29.4214 11.8284 30.1716C12.5786 30.9217 13 31.9391 13 33Z" />
      </svg>
    ),
    title: "Asesoramiento Experto",
    description:
      "Nuestro equipo de expertos te ayudará a encontrar el equipo perfecto para ti.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>¿Por qué elegirnos?</h2>

      <div className={styles.grid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.icon}>{feature.icon}</div>
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p className={styles.description}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
