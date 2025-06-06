import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres");
      return false;
    }
    
    if (!formData.email) {
      setError("El email es requerido");
      return false;
    }
    
    if (!formData.password || formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: ["user"]
      };
      
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess("¡Usuario registrado exitosamente!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Error al registrar usuario");
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = (path) => {
    window.scrollTo({
      top: 0,
    });
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <div className={styles.formContainer}>
          <div className={styles.formSection}>
            <div className={styles.logoWrapper}>
              <img
                src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748982167/logonegro_q7u5cd.png"
                alt="Logo"
                className={styles.logo}
              />
              <div className={styles.headerText}>
                <h1 className={styles.title}>Regístrate Gratis</h1>
                <p className={styles.subtitle}>
                  Crea tu cuenta ahora y conquista la montaña
                </p>
              </div>
            </div>
            
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            {success && (
              <div className={styles.successMessage}>
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className={styles.formFields}>
              <div className={styles.inputGroup}>
                <label htmlFor="username" className={styles.inputLabel}>
                  Nombre de usuario
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Mínimo 3 caracteres"
                    required
                    minLength={3}
                    maxLength={20}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.inputLabel}>
                  Dirección de email
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.inputLabel}>
                  Contraseña
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    maxLength={20}
                  />
                  <img
                    src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904521/hide-password_aomnhy.png"
                    alt="Toggle password visibility"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={styles.registerButton}
                disabled={loading}
              >
                <span>{loading ? "Registrando..." : "Registrarse"}</span>
              </button>

              <div className={styles.loginText}>
                <span>Ya tienes cuenta?</span>
                <button
                  onClick={() => scrollToTop("/login")}
                  className={styles.loginLink}
                  type="button"
                >
                  Inicia sesión.
                </button>
              </div>
            </form>
          </div>

          <div className={styles.imageSection}>
            <img
              src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904523/ChatGPT_Image_22_abr_2025_14_00_26_lp0wge.png"
              alt="Cat Snowboarding"
              className={styles.heroImage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;