import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import styles from './AdminOrdersPage.module.css';

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [sortOrder, setSortOrder] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/orders?data=details');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Pedidos obtenidos:', data);
      
      const mappedOrders = data.map(order => ({
        id: order.id,
        client: {
          name: order.client?.username || 'Cliente desconocido',
          email: order.client?.email || 'Sin email'
        },
        date: formatDate(order.date),
        total: order.amount || 0,
        items: calculateItemsCount(order.details || []),
        paymentMethod: mapPaymentMethod(order.orderPaymentMethod),
        status: mapOrderStatus(order.orderStatus),
        shippingAddress: `${order.shippingNameAddress || ''} ${order.shippingNumberAddress || ''}`.trim(),
        phone: order.phone || '',
        notes: order.notes || ''
      }));
      
      setOrders(mappedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
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
        return 'Sin fecha';
      }
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Sin fecha';
    }
  };

  const calculateItemsCount = (details) => {
    if (!details || details.length === 0) return 0;
    return details.reduce((total, detail) => total + (detail.amount || 0), 0);
  };

  const mapPaymentMethod = (method) => {
    const methodMap = {
      'STRIPE': 'Tarjeta',
      'CASH': 'Efectivo',
      'TRANSFER': 'Transferencia'
    };
    return methodMap[method] || 'Tarjeta';
  };

  const mapOrderStatus = (backendStatus) => {
    const statusMap = {
      'NEW': 'Pendiente',
      'PENDING': 'Pendiente',
      'PAID': 'Enviado',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return statusMap[backendStatus] || 'Pendiente';
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (orderId) => {
    navigate(`/admin/pedidos/editar/${orderId}`);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setOrders(orders.filter(order => order.id !== orderId));
          alert('Pedido eliminado exitosamente');
        } else {
          throw new Error('Error al eliminar el pedido');
        }
      } catch (err) {
        console.error('Error deleting order:', err);
        alert('Error al eliminar el pedido');
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/admin/pedidos/nuevo');
  };

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'Todos') return true;
    return order.status === activeFilter;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortOrder) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'total':
        return b.total - a.total;
      case 'client':
        return a.client.name.localeCompare(b.client.name);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = sortedOrders.slice(startIndex, startIndex + ordersPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregado':
        return styles.entregado;
      case 'Pendiente':
        return styles.pendiente;
      case 'Enviado':
        return styles.enviado;
      case 'Cancelado':
        return styles.cancelado;
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <AdminSidebar />
        <div className={styles.content}>
          <div className={styles.loading}>Cargando pedidos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Pedidos</h1>
          <button onClick={handleCreateNew} className={styles.createButton}>
            <span className={styles.plusIcon}>+</span>
            Crear Nuevo Pedido
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.filtersSection}>
          <div className={styles.categoryFilters}>
            {['Todos', 'Pendiente', 'Enviado', 'Entregado', 'Cancelado'].map(filter => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className={styles.sortSection}>
            <label htmlFor="sort" className={styles.sortLabel}>Ordenar por</label>
            <select
              id="sort"
              value={sortOrder}
              onChange={handleSortChange}
              className={styles.sortSelect}
            >
              <option value="date">Fecha</option>
              <option value="total">Total</option>
              <option value="client">Cliente</option>
              <option value="status">Estado</option>
            </select>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Items</th>
                <th>Pago</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map(order => (
                <tr key={order.id} className={styles.tableRow}>
                  <td className={styles.idCell}>{order.id}</td>
                  <td className={styles.clientCell}>
                    <div className={styles.clientInfo}>
                      <h3 className={styles.clientName}>{order.client.name}</h3>
                      <span className={styles.clientEmail}>{order.client.email}</span>
                    </div>
                  </td>
                  <td className={styles.dateCell}>{order.date}</td>
                  <td className={styles.totalCell}>€{order.total.toFixed(2)}</td>
                  <td className={styles.itemsCell}>{order.items}</td>
                  <td className={styles.paymentCell}>{order.paymentMethod}</td>
                  <td className={styles.statusCell}>
                    <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      onClick={() => handleEdit(order.id)}
                      className={styles.editButton}
                      title="Editar"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="m18.5 2.5-1.5 1.5-6 6h-3v3l6-6 1.5-1.5"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className={styles.deleteButton}
                      title="Eliminar"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              ←
            </button>
            
            <span className={styles.pageInfo}>
              {currentPage}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              →
            </button>
            
            <span className={styles.totalPages}>
              de {totalPages}
            </span>
          </div>
        )}

        {filteredOrders.length === 0 && !loading && (
          <div className={styles.emptyState}>
            <h3>No se encontraron pedidos</h3>
            <p>No hay pedidos que coincidan con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;