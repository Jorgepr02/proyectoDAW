import React, { useState } from 'react';
import SizeCalculator from '../components/SizeCalculator/SizeCalculator';
import styles from './Faq.module.css';

const FaqPage = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [openQuestion, setOpenQuestion] = useState(null);

  const tabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'productos', label: 'Productos' },
    { id: 'envios', label: 'Envíos' },
    { id: 'devoluciones', label: 'Devoluciones' }
  ];

  const questions = [
    {
      id: 1,
      category: 'productos',
      question: 'Como elegir el tamaño de tu Snowboard?',
      answer: (
        <>
          <p>El tamaño adecuado de tu snowboard depende de varios factores como tu altura, peso, nivel de experiencia y estilo de riding. Generalmente, una tabla debe llegarte entre el mentón y la nariz cuando está en posición vertical.</p>
          <p>Utiliza nuestra calculadora para encontrar tu talla ideal:</p>
          <SizeCalculator />
        </>
      )
    },
    {
      id: 2,
      category: 'productos',
      question: 'Las tablas vienen listas para usar?',
      answer: 'Sí, todas nuestras tablas vienen completamente preparadas y enceradas, listas para usar desde el primer día. Sin embargo, recomendamos una revisión y ajuste de las fijaciones según tus preferencias personales.'
    },
    {
      id: 3,
      category: 'productos',
      question: '¿Qué diferencia hay entre las tablas para principiantes y avanzados?',
      answer: 'Las tablas para principiantes suelen ser más flexibles y perdonan más los errores, mientras que las tablas para riders avanzados son más rígidas y ofrecen mayor precisión y control a altas velocidades.'
    },
    {
      id: 4,
      category: 'envios',
      question: '¿Cuánto tiempo tarda en llegar mi pedido?',
      answer: 'Los envíos dentro de la península ibérica tardan entre 24-48 horas. Para Baleares y Canarias el tiempo de entrega es de 3-5 días laborables. Los envíos internacionales pueden tardar entre 5-10 días laborables.'
    },
    {
      id: 5,
      category: 'envios',
      question: '¿Los envíos tienen coste adicional?',
      answer: 'Ofrecemos envío gratuito para pedidos superiores a 100€. Para pedidos inferiores, el coste de envío es de 4,95€ en península y 9,95€ para Baleares y Canarias.'
    },
    {
      id: 6,
      category: 'devoluciones',
      question: '¿Puedo devolver un producto si no me queda bien?',
      answer: 'Sí, aceptamos devoluciones hasta 30 días después de la compra. El producto debe estar en perfecto estado y con su embalaje original. El cliente debe cubrir los gastos de devolución.'
    },
    {
      id: 7,
      category: 'devoluciones',
      question: '¿Cómo proceso una devolución?',
      answer: 'Para procesar una devolución, contacta con nuestro servicio de atención al cliente enviando un email a devoluciones@snowshop.com con tu número de pedido. Te enviaremos las instrucciones detalladas.'
    }
  ];

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  const filteredQuestions = questions.filter(
    q => activeTab === 'todos' || q.category === activeTab
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Preguntas Frecuentes</h1>
      
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.questions}>
        {filteredQuestions.map(q => (
          <div key={q.id}>
            <button
              className={`${styles.question} ${openQuestion === q.id ? styles.active : ''}`}
              onClick={() => toggleQuestion(q.id)}
            >
              {q.question}
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                className={`${styles.arrow} ${openQuestion === q.id ? styles.rotated : ''}`}
              >
                <path 
                  d="M7.5 5L12.5 10L7.5 15" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className={`${styles.answer} ${openQuestion === q.id ? styles.active : ''}`}>
              <div className={styles.answerContent}>
                {q.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;