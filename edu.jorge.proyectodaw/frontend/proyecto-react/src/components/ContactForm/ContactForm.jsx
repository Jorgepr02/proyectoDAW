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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviando mensaje:', formData);
    // Aquí implementaré la lógica de envío
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

        <button type="submit" className={styles.submitButton}>
          Enviar mensaje
        </button>
      </form>
    </div>
  );
};

export default ContactForm;