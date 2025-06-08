import React from "react";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import DashboardCard from "../components/DashboardCard/DashboardCard";
import styles from "./AdminDashboardPage.module.css";

const AdminDashboardPage = () => {
  return (
    <div className={styles.dashboard}>
      <AdminSidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Panel de Administración</h1>
        <div className={styles.grid}>
          <div className={styles.totalSales}>
            <DashboardCard
              title="Ventas totales"
              value="€15,234"
              trend="+12% vs mes anterior"
              trendDirection="positive"
            />
          </div>

          <div className={styles.monthlySales}>
            <DashboardCard
              title="Ventas del mes"
              value="€3,456"
              trend="+8% vs mes anterior"
              trendDirection="positive"
            />
          </div>

          <div className={styles.newCustomers}>
            <DashboardCard
              title="Nuevos clientes"
              value="47"
              trend="+15% vs mes anterior"
              trendDirection="positive"
            />
          </div>

          <div className={styles.monthlyOrders}>
            <DashboardCard
              title="Pedidos del mes"
              value="124"
              trend="+23% vs mes anterior"
              trendDirection="positive"
            />
          </div>

          <div className={styles.pendingOrders}>
            <DashboardCard
              title="Pedidos pendientes"
              value="8"
              trend="-5% vs mes anterior"
              trendDirection="negative"
            />
          </div>

          <div className={styles.trendingProducts}>
            <DashboardCard
              title="Productos en tendencia"
              content={
                <div className={styles.productList}>
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
                      <span className={styles.stockCount}>3 unidades</span>
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
