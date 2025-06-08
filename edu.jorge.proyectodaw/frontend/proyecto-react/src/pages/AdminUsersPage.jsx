import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import styles from './AdminUsersPage.module.css';

const AdminUsersPage = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('id');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/users');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Usuarios obtenidos:', data);
      
      const mappedUsers = data.map(user => ({
        id: user.id,
        name: user.username || 'Sin nombre',
        email: user.email || 'Sin email',
        roles: user.roles || ['ROLE_USER']
      }));
      
      setUsers(mappedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (userId) => {
    navigate(`/admin/usuarios/editar/${userId}`);
  };

  const handleCreateNew = () => {
    navigate('/admin/usuarios/nuevo');
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${userToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userToDelete.id));
        setShowDeleteModal(false);
        setUserToDelete(null);
        setShowSuccessModal(true);
        
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
      } else {
        throw new Error('Error al eliminar el usuario');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error al eliminar el usuario');
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const sortedUsers = [...users].sort((a, b) => {
    switch (sortOrder) {
      case 'id':
        return a.id - b.id;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rol':
        const aRole = a.roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER';
        const bRole = b.roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER';
        return aRole.localeCompare(bRole);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = sortedUsers.slice(startIndex, startIndex + usersPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getRoleBadge = (roles) => {
    if (roles.includes('ROLE_ADMIN')) {
      return { text: 'ADMIN', className: styles.adminBadge };
    }
    return { text: 'USER', className: styles.userBadge };
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <AdminSidebar />
        <div className={styles.content}>
          <div className={styles.loading}>Cargando usuarios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Usuarios</h1>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.filtersSection}>
          <div className={styles.leftSection}>
          </div>

          <div className={styles.rightSection}>
            <button onClick={handleCreateNew} className={styles.createButton}>
              <span className={styles.plusIcon}>+</span>
              Crear Nuevo Usuario
            </button>
            
            <div className={styles.sortSection}>
              <label htmlFor="sort" className={styles.sortLabel}>Ordenar por</label>
              <select
                id="sort"
                value={sortOrder}
                onChange={handleSortChange}
                className={styles.sortSelect}
              >
                <option value="id">ID</option>
                <option value="name">Nombre</option>
                <option value="rol">Rol</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>ID</th>
                <th>Nombre de Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => {
                const roleBadge = getRoleBadge(user.roles);
                return (
                  <tr key={user.id} className={styles.tableRow}>
                    <td className={styles.idCell}>{user.id}</td>
                    <td className={styles.nameCell}>{user.name}</td>
                    <td className={styles.emailCell}>{user.email}</td>
                    <td className={styles.roleCell}>
                      <span className={roleBadge.className}>
                        {roleBadge.text}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleEdit(user.id)}
                          className={styles.editButton}
                          title="Editar"
                        >
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className={styles.deleteButton}
                          title="Eliminar"
                        >
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

        {users.length === 0 && !loading && (
          <div className={styles.emptyState}>
            <h3>No se encontraron usuarios</h3>
            <p>No hay usuarios registrados en el sistema.</p>
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
              <p>¿Estás seguro de que quieres eliminar el usuario <strong>"{userToDelete?.name}"</strong>?</p>
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
              <h3>¡Usuario eliminado!</h3>
            </div>
            <div className={styles.modalContent}>
              <p>El usuario ha sido eliminado correctamente del sistema.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsersPage;