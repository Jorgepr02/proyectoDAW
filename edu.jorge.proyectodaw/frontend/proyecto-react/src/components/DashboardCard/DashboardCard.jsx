import React from "react";
import styles from "./DashboardCard.module.css";

const DashboardCard = ({
  title,
  value,
  trend,
  trendPositive,
  content,
  className,
}) => {
  return (
    <div className={`${styles.card} ${className || ""}`}>
      <h2 className={styles.title}>{title}</h2>
      {value && (
        <div className={styles.valueContainer}>
          <div className={styles.value}>{value}</div>
          {trend && (
            <div
              className={`${styles.trend} ${trendPositive ? styles.positive : styles.negative}`}
            >
              {trend}
            </div>
          )}
        </div>
      )}
      {content && <div className={styles.content}>{content}</div>}
    </div>
  );
};

export default DashboardCard;
