import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import ProductsPage from "../pages/ProductsPage";
import ProductDetail from "../pages/ProductDetail";
import RegisterPage from "../pages/RegisterPage";

const AppRoutes = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default AppRoutes;
