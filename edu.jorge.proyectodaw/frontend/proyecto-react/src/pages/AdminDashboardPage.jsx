import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import DashboardCard from "../components/DashboardCard/DashboardCard";
import styles from "./AdminDashboardPage.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
    bestSellingProduct: null,
    pendingOrders: 0,
    currentMonthSales: 0,
    lastMonthSales: 0,
    salesGrowthPercentage: 0,
    monthlySalesData: [],
    monthlyOrdersData: [],
    loading: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const productsResponse = await fetch('http://localhost:8080/api/products/featured');
      const products = productsResponse.ok ? await productsResponse.json() : [];

      const usersResponse = await fetch('http://localhost:8080/api/users');
      const users = usersResponse.ok ? await usersResponse.json() : [];

      const ordersResponse = await fetch('http://localhost:8080/api/orders?data=details');
      const orders = ordersResponse.ok ? await ordersResponse.json() : [];

      const totalSales = orders.reduce((total, order) => total + (order.amount || 0), 0);

      const pendingOrders = orders.filter(order => 
        order.orderStatus === 'NEW' || 
        order.orderStatus === 'PENDING'
      ).length;

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const currentMonthSales = orders
        .filter(order => {
          const orderDate = new Date(order.date);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        })
        .reduce((total, order) => total + (order.amount || 0), 0);

      const lastMonthSales = orders
        .filter(order => {
          const orderDate = new Date(order.date);
          return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
        })
        .reduce((total, order) => total + (order.amount || 0), 0);

      const salesGrowthPercentage = lastMonthSales > 0 
        ? ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100
        : currentMonthSales > 0 ? 100 : 0;

      const monthlySalesData = [];
      const monthlyOrdersData = [];

      for (let i = 5; i >= 0; i--) {
        const targetDate = new Date(currentYear, currentMonth - i, 1);
        const targetMonth = targetDate.getMonth();
        const targetYear = targetDate.getFullYear();
        
        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.date);
          return orderDate.getMonth() === targetMonth && orderDate.getFullYear() === targetYear;
        });

        const monthSales = monthOrders.reduce((total, order) => total + (order.amount || 0), 0);
        const orderCount = monthOrders.length;

        monthlySalesData.push({
          month: getMonthName(targetMonth),
          sales: monthSales
        });

        monthlyOrdersData.push({
          month: getMonthName(targetMonth),
          orders: orderCount
        });
      }

      const productSales = {};
      orders.forEach(order => {
        if (order.details && order.details.length > 0) {
          order.details.forEach(detail => {
            if (detail.products && detail.products.length > 0) {
              const productName = detail.products[0].name;
              const quantity = detail.amount || 0;
              
              if (!productSales[productName]) {
                productSales[productName] = {
                  name: productName,
                  totalSold: 0,
                  price: detail.products[0].price || 0
                };
              }
              productSales[productName].totalSold += quantity;
            }
          });
        }
      });

      const bestSellingProduct = Object.values(productSales).reduce((best, current) => {
        return (!best || current.totalSold > best.totalSold) ? current : best;
      }, null);

      setDashboardData({
        totalProducts: products.length,
        totalUsers: users.length,
        totalOrders: orders.length,
        totalSales: totalSales,
        bestSellingProduct: bestSellingProduct,
        pendingOrders: pendingOrders,
        currentMonthSales: currentMonthSales,
        lastMonthSales: lastMonthSales,
        salesGrowthPercentage: salesGrowthPercentage,
        monthlySalesData: monthlySalesData,
        monthlyOrdersData: monthlyOrdersData,
        loading: false
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const getMonthName = (monthIndex) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthIndex];
  };

  const getCurrentMonthName = () => {
    return getMonthName(new Date().getMonth());
  };

  const getLastMonthName = () => {
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    return getMonthName(lastMonth);
  };

  const salesChartData = {
    labels: dashboardData.monthlySalesData.map(data => data.month),
    datasets: [
      {
        label: 'Ventas (€)',
        data: dashboardData.monthlySalesData.map(data => data.sales),
        backgroundColor: 'rgba(45, 18, 130, 0.8)',
        borderColor: 'rgba(45, 18, 130, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventas de los Últimos 6 Meses',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '€' + value.toFixed(0);
          }
        }
      },
    },
  };

  const ordersChartData = {
    labels: dashboardData.monthlyOrdersData.map(data => data.month),
    datasets: [
      {
        label: 'Número de Pedidos',
        data: dashboardData.monthlyOrdersData.map(data => data.orders),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const ordersChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pedidos de los Últimos 6 Meses',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return Math.floor(value);
          }
        }
      },
    },
  };

  if (dashboardData.loading) {
    return (
      <div className={styles.dashboard}>
        <AdminSidebar />
        <div className={styles.content}>
          <h1 className={styles.title}>Panel de Administración</h1>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h2>Cargando estadísticas...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <AdminSidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Panel de Administración</h1>
        <div className={styles.grid}>
          <div className={styles.bestSelling}>
            <DashboardCard
              title="Producto Más Vendido"
              content={
                dashboardData.bestSellingProduct ? (
                  <div className={styles.productItem}>
                    <img
                      src="https://res.cloudinary.com/dluvwj5lo/image/upload/v1748935575/CosmicX_xfvdog.png"
                      alt={dashboardData.bestSellingProduct.name}
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h3>{dashboardData.bestSellingProduct.name}</h3>
                      <span className={styles.salesCount}>
                        {dashboardData.bestSellingProduct.totalSold} vendidos
                      </span>
                      <span className={styles.productPrice}>
                        €{dashboardData.bestSellingProduct.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p>No hay datos de ventas</p>
                )
              }
            />
          </div>

          <div className={styles.totalUsers}>
            <DashboardCard
              title="Usuarios Registrados"
              value={dashboardData.totalUsers}
              trend="Total en sistema"
              trendPositive={true}
            />
          </div>

          <div className={styles.totalOrders}>
            <DashboardCard
              title="Pedidos Totales"
              value={dashboardData.totalOrders}
              trend="Histórico completo"
              trendPositive={true}
            />
          </div>

          <div className={styles.pendingOrders}>
            <DashboardCard
              title="Pedidos Pendientes"
              value={dashboardData.pendingOrders}
              trend="Requieren procesamiento"
              trendPositive={dashboardData.pendingOrders === 0}
            />
          </div>

          <div className={styles.totalSales}>
            <DashboardCard
              title="Ventas Totales"
              value={`€${dashboardData.totalSales.toFixed(2)}`}
              trend="Ingresos generados"
              trendPositive={true}
            />
          </div>

          <div className={styles.currentMonthSales}>
            <DashboardCard
              title={`Ventas ${getCurrentMonthName()}`}
              value={`€${dashboardData.currentMonthSales.toFixed(2)}`}
              trend="Mes actual"
              trendPositive={true}
            />
          </div>

          <div className={styles.lastMonthSales}>
            <DashboardCard
              title={`Ventas ${getLastMonthName()}`}
              value={`€${dashboardData.lastMonthSales.toFixed(2)}`}
              trend="Mes pasado"
              trendPositive={true}
            />
          </div>

          <div className={styles.salesGrowth}>
            <DashboardCard
              title="Crecimiento Mensual"
              value={`${dashboardData.salesGrowthPercentage >= 0 ? '+' : ''}${dashboardData.salesGrowthPercentage.toFixed(1)}%`}
              trend={dashboardData.salesGrowthPercentage >= 0 ? "Crecimiento positivo" : "Decrecimiento"}
              trendPositive={dashboardData.salesGrowthPercentage >= 0}
            />
          </div>

          <div className={styles.salesChart}>
            <div className={styles.chartWrapper}>
              <Bar data={salesChartData} options={salesChartOptions} />
            </div>
          </div>

          <div className={styles.ordersChart}>
            <div className={styles.chartWrapper}>
              <Bar data={ordersChartData} options={ordersChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
