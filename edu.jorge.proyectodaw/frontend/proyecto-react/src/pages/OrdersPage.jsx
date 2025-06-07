import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./OrdersPage.module.css";
import OrderCard from "../components/OrderCard/OrderCard";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        
        if (!user) {
          navigate('/login');
          return;
        }

        const clientId = user.clientId || user.id;
        console.log('Fetching orders for clientId:', clientId);
        
        const response = await fetch(`http://localhost:8080/api/orders/client/${clientId}?data=details`);
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('user');
            navigate('/login');
            return;
          }
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Pedidos obtenidos del backend:', data);
        
        const mappedOrders = data.map(order => ({
          id: order.id,
          date: formatDate(order.date),
          status: mapOrderStatus(order.orderStatus),
          total: order.amount || 0,
          products: mapOrderDetailsToProducts(order.details || []),
          productCount: calculateProductCount(order.details || []),
          shippingAddress: `${order.shippingNameAddress || ''} ${order.shippingNumberAddress || ''}`.trim(),
          notes: order.notes || ''
        }));
        
        setOrders(mappedOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const mapOrderDetailsToProducts = (details) => {
    if (!details || details.length === 0) return [];
    
    return details.map(detail => {
      const product = detail.products && detail.products.length > 0 ? detail.products[0] : null;
      
      return {
        image: product && product.image 
          ? product.image 
          : getDefaultImageByProductName(product ? product.name : ""),
        name: product ? product.name : "Producto desconocido",
        quantity: detail.amount || 0,
        price: product ? product.price : 0
      };
    });
  };

  const getDefaultImageByProductName = (productName) => {
    const imageMap = {
      "Cosmic X": "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748935575/CosmicX_xfvdog.png",
      "Cosmic Y": "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903377/Cosmic_Y_utppmw.png",
      "Divinium": "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904508/Divinium_Fallen_gr7oya.png",
      "Vanilla Luv": "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904513/Vanilla_Luv_red_mzurex.png",
      "Vanilla Disluv": "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/Vanilla_Disluv_l5iayv.png",
      "Flame": "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903375/Flame_e5jtpe.png",
      "Mikuseína": "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/Mikuseina_adf8hj.png",
      "Gafas de Snow Antiniebla": "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904515/Gafas_ch5po3.png",
      "Guantes Térmicos": "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904515/Guantes_p94a8p.png",
      "Botas de Snowboard": "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903375/botas_kl6eqm.png"
    };
    
    return imageMap[productName] || "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748935575/CosmicX_xfvdog.png";
  };

  const calculateProductCount = (details) => {
    if (!details || details.length === 0) return 0;
    return details.reduce((total, detail) => total + (detail.amount || 0), 0);
  };

  const formatDate = (dateInput) => {
    try {
      let date;
      
      if (Array.isArray(dateInput) && dateInput.length >= 3) {
        const [year, month, day] = dateInput;
        date = new Date(year, month - 1, day);
      } else if (typeof dateInput === 'string') {
        date = new Date(dateInput);
      } else {
        return 'Fecha no disponible';
      }
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha no disponible';
    }
  };

  const mapOrderStatus = (backendStatus) => {
    const statusMap = {
      'NEW': 'pendiente',
      'PENDING': 'pendiente',
      'PAID': 'enviado',
      'SHIPPED': 'enviado',
      'DELIVERED': 'entregado',
      'CANCELLED': 'cancelado'
    };
    return statusMap[backendStatus] || 'pendiente';
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId));
        alert('Pedido cancelado exitosamente');
      } else {
        throw new Error('Error al cancelar el pedido');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error al cancelar el pedido. Inténtalo de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h2>Cargando pedidos...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h2>Error al cargar pedidos</h2>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: '#2d1282',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Mis Pedidos</h1>
        <p className={styles.subtitle}>Gestiona y revisa todos tus pedidos</p>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h3>No tienes pedidos todavía</h3>
            <p>¡Realiza tu primera compra!</p>
            <button 
              onClick={() => navigate('/productos')}
              style={{
                background: '#2d1282',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              Ver Productos
            </button>
          </div>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order.id}
              date={order.date}
              status={order.status}
              products={order.products}
              total={order.total}
              productCount={order.productCount}
              showCancelButton={order.status === 'pendiente'}
              onCancel={() => handleCancelOrder(order.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
