import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import styles from './AdminClientsPage.module.css';

const AdminClientsPage = () => {
  const navigate = useNavigate();
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/clients');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Clientes obtenidos:', data);
      
      const mappedClients = data.map(client => ({
        id: client.id,
        name: client.username || 'Sin nombre',
        email: client.email || 'Sin email',
        phone: client.phone || '+34433366999',
        address: client.address || 'Calle Nevada 123',
        lastname: client.lastname || '',
        floor: client.floor || '',
        role: client.role || 'CLIENT'
      }));
      
      setClients(mappedClients);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (clientId) => {
    navigate(`/admin/clientes/editar/${clientId}`);
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/clients/${clientId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setClients(clients.filter(client => client.id !== clientId));
          alert('Cliente eliminado exitosamente');
        } else {
          throw new Error('Error al eliminar el cliente');
        }
      } catch (err) {
        console.error('Error deleting client:', err);
        alert('Error al eliminar el cliente');
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/admin/clientes/nuevo');
  };

  const sortedClients = [...clients].sort((a, b) => {
    switch (sortOrder) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'email':
        return a.email.localeCompare(b.email);
      case 'phone':
        return a.phone.localeCompare(b.phone);
      case 'address':
        return a.address.localeCompare(b.address);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedClients.length / clientsPerPage);
  const startIndex = (currentPage - 1) * clientsPerPage;
  const currentClients = sortedClients.slice(startIndex, startIndex + clientsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <AdminSidebar />
        <div className={styles.content}>
          <div className={styles.loading}>Cargando clientes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Clientes</h1>
          <button onClick={handleCreateNew} className={styles.createButton}>
            <span className={styles.plusIcon}>+</span>
            Crear Nuevo Cliente
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.filtersSection}>
          <div className={styles.sortSection}>
            <label htmlFor="sort" className={styles.sortLabel}>Ordenar por</label>
            <select
              id="sort"
              value={sortOrder}
              onChange={handleSortChange}
              className={styles.sortSelect}
            >
              <option value="name">Nombre</option>
              <option value="email">Email</option>
              <option value="phone">Teléfono</option>
              <option value="address">Dirección</option>
            </select>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map(client => (
                <tr key={client.id} className={styles.tableRow}>
                  <td className={styles.nameCell}>{client.name}</td>
                  <td className={styles.emailCell}>{client.email}</td>
                  <td className={styles.phoneCell}>{client.phone}</td>
                  <td className={styles.addressCell}>{client.address}</td>
                  <td className={styles.actionsCell}>
                    <button
                      onClick={() => handleEdit(client.id)}
                      className={styles.editButton}
                      title="Editar"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="m18.5 2.5-1.5 1.5-6 6h-3v3l6-6 1.5-1.5"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
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

        {clients.length === 0 && !loading && (
          <div className={styles.emptyState}>
            <h3>No se encontraron clientes</h3>
            <p>No hay clientes registrados en el sistema.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClientsPage;