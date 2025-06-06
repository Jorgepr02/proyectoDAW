import React from "react";
import DashboardSidebar from "../components/DashboardSidebar/DashboardSidebar";
import DashboardCard from "../components/DashboardCard/DashboardCard";
import styles from "./AdminDashboardPage.module.css";

const AdminDashboardPage = () => {
  return (
    <div className={styles.dashboard}>
      <DashboardSidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.grid}>
          <DashboardCard
            title="Ventas totales"
            value="95.890,50 €"
            className={styles.totalSales}
          />
          <DashboardCard
            title="Ventas del mes"
            value="55.980,50 €"
            trend="25% más que el mes anterior"
            trendPositive={true}
            className={styles.monthlySales}
          />
          <DashboardCard
            title="Clientes nuevos este mes"
            value="89"
            trend="25% más que el mes anterior"
            trendPositive={true}
            className={styles.newCustomers}
          />
          <DashboardCard
            title="Pedidos del mes"
            value="110"
            trend="25% más que el mes anterior"
            trendPositive={true}
            className={styles.monthlyOrders}
          />
          <DashboardCard
            title="Pedidos pendientes de entrega"
            value="21"
            className={styles.pendingOrders}
          />

          <div className={styles.trendingProducts}>
            <DashboardCard
              title="Productos en tendencia (mes)"
              content={
                <div className={styles.productList}>
                  <div className={styles.productItem}>
                    <img
                      src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748935575/CosmicX_xfvdog.png"
                      alt="Cosmic X"
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h3>Cosmic X</h3>
                      <span className={styles.salesCount}>30 ventas</span>
                    </div>
                  </div>
                  <div className={styles.productItem}>
                    <img
                      src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904508/Divinium_Fallen_gr7oya.png"
                      alt="Divinium"
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h3>Divinium</h3>
                      <span className={styles.salesCount}>21 ventas</span>
                    </div>
                  </div>
                  <div className={styles.productItem}>
                    <img
                      src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904513/Vanilla_Luv_red_mzurex.png"
                      alt="Vanilla Luv"
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h3>Vanilla Luv</h3>
                      <span className={styles.salesCount}>19 ventas</span>
                    </div>
                  </div>
                </div>
              }
            />
          </div>

          <div className={styles.lowStock}>
            <DashboardCard
              title="Productos con bajo stock"
              content={
                <div className={styles.productList}>
                  <div className={styles.productItem}>
                    <img
                      src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904508/Divinium_Fallen_gr7oya.png"
                      alt="Divinium"
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h3>Divinium</h3>
                      <span className={styles.stockCount}>1 en stock</span>
                    </div>
                  </div>
                  <div className={styles.productItem}>
                    <img
                      src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904513/Vanilla_Luv_red_mzurex.png"
                      alt="Vanilla Luv"
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h3>Vanilla Luv</h3>
                      <span className={styles.stockCount}>3 en stock</span>
                    </div>
                  </div>
                  <div className={styles.productItem}>
                    <img
                      src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904509/Kaizen_egtrjx.png"
                      alt="Kaizen"
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h3>Kaizen</h3>
                      <span className={styles.stockCount}>3 en stock</span>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
