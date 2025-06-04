import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/products/search?name=${term}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const scrollToTop = (path) => {
    if (path === location.pathname) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo(0, 0);
      navigate(path);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const searchButton = (
    <div className={`${styles.searchContainer} ${isSearchOpen ? styles.open : ''}`} ref={searchRef}>
      <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
        <img
          src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748940430/search--v4_ckduh1.png"
          alt="Search"
          width={20}
          height={20}
        />
      </button>
      
      <div className={styles.searchDropdown}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar productos..."
          className={styles.searchInput}
          autoFocus
        />
        
        {isLoading ? (
          <div className={styles.searchMessage}>Buscando...</div>
        ) : searchResults.length > 0 ? (
          <div className={styles.searchResults}>
            {searchResults.map((product) => (
              <Link
                key={product.id}
                to={`/producto/${product.id}`}
                className={styles.searchResult}
                onClick={() => setIsSearchOpen(false)}
              >
                <img src={product.image} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <p>{product.price}€</p>
                </div>
              </Link>
            ))}
          </div>
        ) : searchTerm && (
          <div className={styles.searchMessage}>No se encontraron resultados</div>
        )}
      </div>
    </div>
  );

  return (
    <header className={`${styles.header} ${isHomePage ? styles.headerHome : ''}`}>
      <div className={styles.container}>
        <img
          src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748939740/logo_qd5sfu.png"
          alt="Logo"
          className={styles.logo}
          onClick={() => scrollToTop("/")}
          style={{ cursor: "pointer" }}
        />

        <nav className={styles.nav}>
          <button
            onClick={() => scrollToTop("/")}
            className={`${styles.navLink} ${
              location.pathname === "/" ? styles.navLinkActive : ""
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => scrollToTop("/productos")}
            className={`${styles.navLink} ${
              location.pathname === "/productos" ? styles.navLinkActive : ""
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => scrollToTop("/sobre-nosotros")}
            className={`${styles.navLink} ${
              location.pathname === "/sobre-nosotros" ? styles.navLinkActive : ""
            }`}
          >
            Sobre Nosotros
          </button>
          <button
            onClick={() => scrollToTop("/contacto")}
            className={`${styles.navLink} ${
              location.pathname === "/contacto" ? styles.navLinkActive : ""
            }`}
          >
            Contacto
          </button>
        </nav>

        <div className={styles.actions}>
          {searchButton} 
          
          <Link to="/login">
            <img
              src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748940048/image_79_uccho4.png"
              alt="User"
              width={20}
              height={22}
            />
          </Link>

          <div className={styles.cartWrapper}>
            <button onClick={() => navigate('/lista-deseos')}>
              <img
                src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748940650/2724657_dl3qlw.png"
                alt="Wishlist"
                width={20}
                height={20}
              />
            </button>
            
            <button onClick={() => navigate('/carrito')}>
              <img
                src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748940562/shopping-cart-pe974q2wd8bzu5cueg3qr_cw8dd8.webp"
                alt="Cart"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>

        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          <img
            src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748943048/menu_dk55bo.png"
            alt="Menu"
            width={24}
            height={24}
          />
        </button>

        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileNav}>
            <Link to="/" className={styles.mobileNavLink} onClick={() => { scrollToTop("/"); toggleMobileMenu(); }}>
              Inicio
            </Link>
            <Link to="/productos" className={styles.mobileNavLink} onClick={() => { scrollToTop("/productos"); toggleMobileMenu(); }}>
              Productos
            </Link>
            <Link to="/sobre-nosotros" className={styles.mobileNavLink} onClick={() => { scrollToTop("/sobre-nosotros"); toggleMobileMenu(); }}>
              Sobre Nosotros
            </Link>
            <Link to="/contacto" className={styles.mobileNavLink} onClick={() => { scrollToTop("/contacto"); toggleMobileMenu(); }}>
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;