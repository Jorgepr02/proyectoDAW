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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const searchRef = useRef(null);

  const checkAdminRole = () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return false;
      
      const user = JSON.parse(userString);
      if (!user.roles || !Array.isArray(user.roles)) return false;
      
      return user.roles.includes('ROLE_ADMIN');
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  };

  const checkUserLoggedIn = () => {
    try {
      const userString = localStorage.getItem('user');
      return !!userString;
    } catch (error) {
      console.error('Error checking user login status:', error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsUserLoggedIn(false);
    setIsAdmin(false);
    
    window.dispatchEvent(new Event('userChanged'));
    
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsAdmin(checkAdminRole());
    setIsUserLoggedIn(checkUserLoggedIn());
    
    const handleStorageChange = () => {
      setIsAdmin(checkAdminRole());
      setIsUserLoggedIn(checkUserLoggedIn());
    };

    window.addEventListener('storage', handleStorageChange);
    
    window.addEventListener('userChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChanged', handleStorageChange);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
      setSearchTerm("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

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
      
      {isSearchOpen && (
        <div className={styles.searchDropdown}>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Buscar productos... (presiona Enter)"
              className={styles.searchInput}
              autoFocus
            />
          </form>
        </div>
      )}
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
          
          <div className={styles.iconWrapper}>
            <Link to="/login" className={styles.iconButton}>
              <img
                src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748940048/image_79_uccho4.png"
                alt="User"
                width={20}
                height={22}
              />
              <span className={styles.tooltip}>Iniciar Sesión</span>
            </Link>
          </div>

          <div className={styles.iconWrapper}>
            <button onClick={() => navigate('/lista-deseos')} className={styles.iconButton}>
              <img
                src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748940650/2724657_dl3qlw.png"
                alt="Wishlist"
                width={20}
                height={20}
              />
              <span className={styles.tooltip}>Lista de Deseos</span>
            </button>
          </div>
          
          <div className={styles.iconWrapper}>
            <button onClick={() => navigate('/carrito')} className={styles.iconButton}>
              <img
                src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748940562/shopping-cart-pe974q2wd8bzu5cueg3qr_cw8dd8.webp"
                alt="Cart"
                width={20}
                height={20}
              />
              <span className={styles.tooltip}>Carrito</span>
            </button>
          </div>

          <div className={styles.iconWrapper}>
            <button onClick={() => navigate('/orders')} className={styles.iconButton}>
              <img
                src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1749309715/icon-order-1_q5gzlz.png"
                alt="Orders"
                width={20}
                height={20}
              />
              <span className={styles.tooltip}>Mis Pedidos</span>
            </button>
          </div>

          {isAdmin && (
            <div className={styles.iconWrapper}>
              <button onClick={() => navigate('/admin')} className={styles.iconButton}>
                <img
                  src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/dashboardicon_sgzxnf.png"
                  alt="Admin Dashboard"
                  width={20}
                  height={20}
                />
                <span className={styles.tooltip}>Panel Admin</span>
              </button>
            </div>
          )}

          {isUserLoggedIn && (
            <div className={styles.iconWrapper}>
              <button onClick={handleLogout} className={styles.iconButton}>
                <img
                  src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1749402873/logout_hnyrby.png"
                  alt="Cerrar Sesión"
                  width={20}
                  height={20}
                />
                <span className={styles.tooltip}>Cerrar Sesión</span>
              </button>
            </div>
          )}
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
            <Link to="/login" className={styles.mobileNavLink} onClick={() => { scrollToTop("/login"); toggleMobileMenu(); }}>
              Iniciar Sesión
            </Link>
            <Link to="/lista-deseos" className={styles.mobileNavLink} onClick={() => { scrollToTop("/lista-deseos"); toggleMobileMenu(); }}>
              Lista de Deseos
            </Link>
            <Link to="/carrito" className={styles.mobileNavLink} onClick={() => { scrollToTop("/carrito"); toggleMobileMenu(); }}>
              Carrito
            </Link>
            <Link to="/orders" className={styles.mobileNavLink} onClick={() => { scrollToTop("/orders"); toggleMobileMenu(); }}>
              Mis Pedidos
            </Link>
            {isAdmin && (
              <Link to="/admin" className={styles.mobileNavLink} onClick={() => { scrollToTop("/admin"); toggleMobileMenu(); }}>
                Panel Admin
              </Link>
            )}
            {isUserLoggedIn && (
              <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className={styles.mobileNavLink}>
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;