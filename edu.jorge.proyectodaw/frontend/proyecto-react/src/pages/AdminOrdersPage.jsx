import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import styles from './AdminOrdersPage.module.css';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [sortOrder, setSortOrder] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
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
          name: order.clientName || 'Cliente desconocido',
          email: order.clientEmail || 'Sin email'
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

  const calculateItemsCount = (details) => {
    if (!details || details.length === 0) return 0;
    return details.reduce((total, detail) => {
      return total + (detail.amount || 0);
    }, 0);
  };

  const formatDate = (dateInput) => {
    try {
      if (!dateInput) return 'Sin fecha';
      
      const date = new Date(dateInput);
      
      if (isNaN(date.getTime())) {
        return 'Sin fecha';
      }
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Sin fecha';
    }
  };

  const mapPaymentMethod = (method) => {
    const methodMap = {
      'STRIPE': 'Stripe',
      'CASH': 'Efectivo',
      'TRANSFER': 'Transferencia'
    };
    return methodMap[method] || 'Stripe';
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

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderToDelete.id));
        setShowDeleteModal(false);
        setOrderToDelete(null);
        setShowSuccessModal(true);
        
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
      } else {
        throw new Error('Error al eliminar el pedido');
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Error al eliminar el pedido');
      setShowDeleteModal(false);
      setOrderToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
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
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.filtersSection}>
          <div className={styles.leftSection}>
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
          </div>

          <div className={styles.rightSection}>
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
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => handleDeleteClick(order)}
                        className={styles.deleteButton}
                        title="Eliminar"
                      >
                      </button>
                    </div>
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
              Anterior
            </button>
            
            <div className={styles.pageNumbers}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`${styles.pageNumber} ${currentPage === pageNum ? styles.activePage : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Siguiente
            </button>
          </div>
        )}

        {filteredOrders.length === 0 && !loading && (
          <div className={styles.emptyState}>
            <h3>No se encontraron pedidos</h3>
            <p>No hay pedidos que coincidan con los filtros seleccionados.</p>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <>
          <div className={styles.modalOverlay} onClick={handleDeleteCancel} />
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Confirmar eliminación</h3>
            </div>
            <div className={styles.modalContent}>
              <p>¿Estás seguro de que quieres eliminar el pedido <strong>#{orderToDelete?.id}</strong> de <strong>"{orderToDelete?.client.name}"</strong>?</p>
              <p className={styles.modalWarning}>Esta acción no se puede deshacer.</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleDeleteCancel} className={styles.modalCancelButton}>
                Cancelar
              </button>
              <button onClick={handleDeleteConfirm} className={styles.modalDeleteButton}>
                Eliminar
              </button>
            </div>
          </div>
        </>
      )}

      {showSuccessModal && (
        <>
          <div className={styles.modalOverlay} />
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.successIcon}>✓</div>
              <h3>¡Pedido eliminado!</h3>
            </div>
            <div className={styles.modalContent}>
              <p>El pedido ha sido eliminado correctamente del sistema.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrdersPage;