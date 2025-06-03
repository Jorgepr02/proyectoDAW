import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetail from "../pages/ProductDetail";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import AboutPage from "../pages/AboutPage";
import FaqPage from "../pages/Faq";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sobre-nosotros" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;
