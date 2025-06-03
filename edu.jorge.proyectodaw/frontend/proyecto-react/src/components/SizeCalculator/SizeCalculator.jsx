import React, { useState, useEffect, useCallback } from 'react';
import styles from './SizeCalculator.module.css';

const AVAILABLE_SIZES = ['152', '152W', '154', '154W', '156', '156W'];

const SizeCalculator = () => {
  const [calculatorData, setCalculatorData] = useState({
    height: '',
    weight: '',
    level: '',
    style: ''
  });
  const [recommendedSize, setRecommendedSize] = useState(null);

  const handleCalculatorChange = (e) => {
    const { name, value } = e.target;
    setCalculatorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRecommendedSize = useCallback(() => {
    const { height, weight, level, style } = calculatorData;
    
    if (!height || !weight || !level || !style) return null;

    const heightNum = parseInt(height);
    const weightNum = parseInt(weight);

    if (heightNum < 165) {
      if (level === 'principiante') return AVAILABLE_SIZES[0];
      return AVAILABLE_SIZES[1];
    } else if (heightNum < 175) {
      if (weightNum > 80) return AVAILABLE_SIZES[2];
      if (level === 'avanzado' || level === 'experto') return AVAILABLE_SIZES[3];
      return AVAILABLE_SIZES[1];
    } else {
      if (weightNum > 85) return AVAILABLE_SIZES[5];
      if (style === 'freestyle') return AVAILABLE_SIZES[2];
      return AVAILABLE_SIZES[4];
    }
  }, [calculatorData]); 

  useEffect(() => {
    const size = calculateRecommendedSize();
    setRecommendedSize(size);
  }, [calculateRecommendedSize]);

  return (
    <div className={styles.calculator}>
      <h2 className={styles.title}>Calcula el tamaño de tu snowboard</h2>
      <div className={styles.form}>
        <div className={styles.measurementInputs}>
          <label>Tu talla y peso</label>
          <div className={styles.inputGroup}>
            <input
              type="number"
              name="height"
              placeholder="cm"
              value={calculatorData.height}
              onChange={handleCalculatorChange}
              className={styles.input}
            />
            <input
              type="number"
              name="weight"
              placeholder="kg"
              value={calculatorData.weight}
              onChange={handleCalculatorChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.selectGroup}>
          <label>Tu nivel</label>
          <select
            name="level"
            value={calculatorData.level}
            onChange={handleCalculatorChange}
            className={styles.select}
          >
            <option value="">Seleccionar nivel</option>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
            <option value="experto">Experto</option>
          </select>
        </div>

        <div className={styles.selectGroup}>
          <label>Tu estilo</label>
          <select
            name="style"
            value={calculatorData.style}
            onChange={handleCalculatorChange}
            className={styles.select}
          >
            <option value="">Seleccionar estilo</option>
            <option value="freestyle">Freestyle</option>
            <option value="freeride">Freeride</option>
            <option value="allmountain">All Mountain</option>
            <option value="powder">Powder</option>
          </select>
        </div>

        {recommendedSize && (
          <div className={styles.result}>
            <h3>Talla recomendada:</h3>
            <p>{recommendedSize}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeCalculator;