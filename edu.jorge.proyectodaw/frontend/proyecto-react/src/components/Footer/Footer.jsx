import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const scrollToTop = (path) => {
    if (path === location.pathname) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      window.scrollTo(0, 0);
      navigate(path);
    }
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:info@snowshop.es";
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+34333333333";
  };

  const handleAddressClick = () => {
    window.open("https://maps.google.com/?q=Calle+Nevada+123,+A+Coruña,+España", "_blank");
  };

  const handleSocialClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <footer className={`${styles.footer} ${isHomePage ? styles.footerHome : ''}`}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logoSection}>
            <img
              src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748939740/logo_qd5sfu.png"
              alt="SNOWSHOP"
              className={styles.logo}
              onClick={() => scrollToTop("/")}
              style={{ cursor: "pointer" }}
            />
            <div className={styles.description}>
              Tu tienda de confianza para equipamiento de deportes de invierno.
            </div>
          </div>

          <div className={styles.linksSection}>
            <h3 className={styles.sectionTitle}>Enlaces Rápidos</h3>
            <div className={styles.linksList}>
              <button onClick={() => scrollToTop("/")} className={styles.link}>Inicio</button>
              <button onClick={() => scrollToTop("/productos")} className={styles.link}>Productos</button>
              <button onClick={() => scrollToTop("/sobre-nosotros")} className={styles.link}>Sobre Nosotros</button>
              <button onClick={() => scrollToTop("/contacto")} className={styles.link}>Contacto</button>
              <button onClick={() => scrollToTop("/faq")} className={styles.link}>Preguntas Frecuentes</button>
            </div>
          </div>

          <div className={styles.contactSection}>
            <h3 className={styles.sectionTitle}>Contacto</h3>
            <div className={styles.contactList}>
              <button 
                className={styles.contactItem} 
                onClick={handleEmailClick}
                title="Enviar email"
              >
                info@snowshop.es
              </button>
              <button 
                className={styles.contactItem} 
                onClick={handlePhoneClick}
                title="Llamar por teléfono"
              >
                +34 333 333 333
              </button>
              <button 
                className={styles.contactItem} 
                onClick={handleAddressClick}
                title="Ver en Google Maps"
              >
                Calle Nevada 123, A Coruña
              </button>
            </div>
          </div>

          <div className={styles.socialSection}>
            <h3 className={styles.sectionTitle}>Síguenos</h3>
            <div className={styles.socialIcons}>
              <button 
                onClick={() => handleSocialClick("https://twitter.com/")}
                title="Síguenos en X (Twitter)"
                className={styles.socialButton}
              >
                <img
                  src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904519/twitterx_wwttb0.png"
                  alt="X"
                  className={styles.socialIconX}
                />
              </button>
              <button 
                onClick={() => handleSocialClick("https://instagram.com/")}
                title="Síguenos en Instagram"
                className={styles.socialButton}
              >
                <img
                  src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748944484/image_35_lvjq2e.png"
                  alt="Instagram"
                  className={styles.socialIcon}
                />
              </button>
              <button 
                onClick={() => handleSocialClick("https://facebook.com/")}
                title="Síguenos en Facebook"
                className={styles.socialButton}
              >
                <img
                  src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748944484/image_36_dy1jrk.png"
                  alt="Facebook"
                  className={styles.socialIcon}
                />
              </button>
              <button 
                onClick={() => handleSocialClick("https://tiktok.com/")}
                title="Síguenos en TikTok"
                className={styles.socialButton}
              >
                <img
                  src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748944484/image_37_ml1tsq.png"
                  alt="TikTok"
                  className={styles.socialIcon}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
