import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./ContactForm.module.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío (mockeado)
    setTimeout(() => {
      console.log('Mensaje enviado (mockeado):', formData);
      
      // Mostrar popup de éxito
      setShowSuccessPopup(true);
      
      // Vaciar formulario
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      setIsSubmitting(false);

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <p className={styles.faqText}>
        <span>Revisa antes nuestras </span>
        <button 
          onClick={() => {
            window.scrollTo(0, 0);
            navigate('/faq');
          }}
          className={styles.faqLink}
        >
          preguntas frecuentes
        </button>
        <span>.</span>
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre completo</label>
          <div className={styles.inputWrapper}>
            <input 
              type="text" 
              name="name"
              placeholder="Tu nombre" 
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Correo electrónico</label>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Asunto</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              name="subject"
              placeholder="¿Sobre qué nos quieres consultar?"
              className={styles.input}
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Mensaje</label>
          <div className={styles.textareaWrapper}>
            <textarea 
              name="message"
              className={styles.textarea}
              placeholder="Escribe tu mensaje aquí..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <>
          <div className={styles.overlay} onClick={() => setShowSuccessPopup(false)} />
          <div className={styles.successPopup}>
            <div className={styles.successIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
            </div>
            <h3>¡Mensaje enviado!</h3>
            <p>Gracias por contactarnos. Te responderemos pronto.</p>
            <button 
              className={styles.closeButton}
              onClick={() => setShowSuccessPopup(false)}
            >
              Cerrar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactForm;