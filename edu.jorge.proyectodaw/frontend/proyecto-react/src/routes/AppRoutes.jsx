import React from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetail from "../pages/ProductDetail";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import AboutPage from "../pages/AboutPage";
import FaqPage from "../pages/Faq";
import CartPage from "../pages/CartPage";
import OrdersPage from "../pages/OrdersPage";
import WishlistPage from "../pages/WishlistPage";
import ContactPage from "../pages/ContactPage";

import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminProductsPage from "../pages/AdminProductsPage";
import AdminProductFormPage from "../pages/AdminProductFormPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminOrderFormPage from "../pages/AdminOrderFormPage";
import AdminClientsPage from "../pages/AdminClientsPage";
import AdminClientFormPage from "../pages/AdminClientFormPage";

import ProtectedAdminRoute from "../components/ProtectedAdminRoute/ProtectedAdminRoute";

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="app-layout">
      {!isAdminPage && <Header />}
      <main className="main-content">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/lista-deseos" element={<WishlistPage />} />
          <Route path="/contacto" element={<ContactPage />} />

          {/* Rutas de administrador protegidas */}
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/productos" 
            element={
              <ProtectedAdminRoute>
                <AdminProductsPage />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/productos/nuevo" 
            element={
              <ProtectedAdminRoute>
                <AdminProductFormPage />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/productos/editar/:id" 
            element={
              <ProtectedAdminRoute>
                <AdminProductFormPage />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/usuarios" 
            element={
              <ProtectedAdminRoute>
                <AdminUsersPage />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/pedidos" 
            element={
              <ProtectedAdminRoute>
                <AdminOrdersPage />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/pedidos/nuevo" 
            element={
              <ProtectedAdminRoute>
                <AdminOrderFormPage />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/pedidos/editar/:id" 
            element={
              <ProtectedAdminRoute>
                <AdminOrderFormPage />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/clientes" 
            element={
              <ProtectedAdminRoute>
                <AdminClientsPage />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/clientes/nuevo" 
            element={
              <ProtectedAdminRoute>
                <AdminClientFormPage />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/clientes/editar/:id" 
            element={
              <ProtectedAdminRoute>
                <AdminClientFormPage />
              </ProtectedAdminRoute>
            } 
          />

          <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>404 - Página no encontrada</h2>
            <p>La página que buscas no existe.</p>
            <a href="/" style={{ color: '#2d1282' }}>Volver al inicio</a>
          </div>} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default AppRoutes;
