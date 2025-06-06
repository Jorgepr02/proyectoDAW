import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./DashboardSidebar.module.css";

const DashboardSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Función para obtener el icono según el estado
  const getIcon = (page, isActive) => {
    const icons = {
      dashboard: {
        white: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/dashboardicon_sgzxnf.png",
        purple: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903750/image_41_auiuc7.png",
      },
      products: {
        white: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/producticon_iou8ep.png",
        purple: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903375/productsiconcolor_k4mhqs.png",
      },
      orders: {
        white: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/pedidoicon_bkxte3.png",
        purple: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903750/image_50_yohm52.png",
      },
      customers: {
        white: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903375/clienticon_jz9sie.png",
        purple: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903750/image_69_tsa0xl.png",
      },
      staff: {
        white: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/stafficon_lqyboi.png",
        purple: "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903750/image_68_pkg6ph.png",
      },
    };

    return isActive ? icons[page].purple : icons[page].white;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={`${styles.mobileMenuButton} ${isOpen ? styles.hidden : ''}`}
        onClick={toggleSidebar}
        aria-label="Abrir menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && <div className={styles.overlay} onClick={closeSidebar} />}

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h1 className={styles.logo}>SnowShop Admin</h1>
          <button
            className={styles.closeButton}
            onClick={closeSidebar}
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>
        <nav className={styles.navigation}>
          <Link
            to="/admin"
            className={`${styles.navItem} ${
              location.pathname === "/admin" ? styles.active : ""
            }`}
            onClick={closeSidebar}
          >
            <img
              src={getIcon("dashboard", location.pathname === "/admin")}
              alt="Dashboard"
              className={styles.icon}
            />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/products"
            className={`${styles.navItem} ${
              location.pathname === "/admin/products" ? styles.active : ""
            }`}
            onClick={closeSidebar}
          >
            <img
              src={getIcon("products", location.pathname === "/admin/products")}
              alt="Productos"
              className={styles.icon}
            />
            <span>Productos</span>
          </Link>
          <Link
            to="/admin/orders"
            className={`${styles.navItem} ${
              location.pathname === "/admin/orders" ? styles.active : ""
            }`}
            onClick={closeSidebar}
          >
            <img
              src={getIcon("orders", location.pathname === "/admin/orders")}
              alt="Pedidos"
              className={styles.icon}
            />
            <span>Pedidos</span>
          </Link>
          <Link
            to="/admin/customers"
            className={`${styles.navItem} ${
              location.pathname === "/admin/customers" ? styles.active : ""
            }`}
            onClick={closeSidebar}
          >
            <img
              src={getIcon("customers", location.pathname === "/admin/customers")}
              alt="Clientes"
              className={styles.icon}
            />
            <span>Clientes</span>
          </Link>
          <Link
            to="/admin/staff"
            className={`${styles.navItem} ${
              location.pathname === "/admin/staff" ? styles.active : ""
            }`}
            onClick={closeSidebar}
          >
            <img
              src={getIcon("staff", location.pathname === "/admin/staff")}
              alt="Staff"
              className={styles.icon}
            />
            <span>Staff</span>
          </Link>
        </nav>
        <Link to="/" className={styles.backLink} onClick={closeSidebar}>
          Volver a SnowShop
        </Link>
      </div>
    </>
  );
};

export default DashboardSidebar;
