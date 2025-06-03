import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "", // Cambiado de email a username
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.username) {
      setError("El nombre de usuario es requerido");
      return false;
    }
    if (!formData.password) {
      setError("La contraseña es requerida");
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
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username, // Usar username
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email,
          roles: data.roles
        }));
        
        // Redirigir a página principal
        navigate("/");
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error('Error logging in:', err);
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
    <div className={styles.loginPage}>
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formWrapper}>
            <div className={styles.formSection}>
              <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.logoWrapper}>
                  <img
                    src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748982167/logonegro_q7u5cd.png"
                    alt="Logo"
                    className={styles.logo}
                  />
                  <div className={styles.headerText}>
                    <h1 className={styles.title}>Inicia Sesión</h1>
                    <p className={styles.subtitle}>Accede a tu cuenta de SnowShop!</p>
                  </div>
                </div>

                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}

                <div className={styles.inputsContainer}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nombre de usuario</label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Introduce tu nombre de usuario"
                        required
                        minLength={3}
                        maxLength={20}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Contraseña</label>
                    <div className={styles.inputWrapper}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Introduce tu contraseña"
                        required
                        minLength={6}
                        maxLength={20}
                      />
                      <img
                        src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904521/hide-password_aomnhy.png"
                        alt="Toggle password visibility"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={styles.loginButton}
                  disabled={loading}
                >
                  <span className={styles.buttonText}>
                    {loading ? "Entrando..." : "Entrar"}
                  </span>
                </button>

                <div className={styles.socialLogin}>
                  <button type="button" className={styles.socialButton}>
                    <img
                      src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748982304/image_24_lze0ty.png"
                      alt="Google"
                      className={styles.socialIcon}
                    />
                  </button>
                  <button type="button" className={styles.socialButton}>
                    <img
                      src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748982303/image_26_dsipnb.png"
                      alt="Microsoft"
                      className={styles.socialIcon}
                    />
                  </button>
                  <button type="button" className={styles.socialButton}>
                    <img
                      src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748982304/image_25_hdqly9.png"
                      alt="Discord"
                      className={styles.socialIcon}
                    />
                  </button>
                </div>

                <div className={styles.registerPrompt}>
                  <span>No tienes cuenta? </span>
                  <button
                    type="button"
                    onClick={() => scrollToTop("/register")}
                    className={styles.registerLink}
                  >
                    Regístrate.
                  </button>
                </div>
              </form>
            </div>
            <div className={styles.imageSection}>
              <img
                src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904522/ChatGPT_Image_22_abr_2025_14_21_21_nhqemj.png"
                alt="Miku Snowboarding"
                className={styles.sideImage}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;