import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import styles from './AdminUserFormPage.module.css';

const AdminUserFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchUser();
    }
  }, [id, isEditing]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/users/${id}`);
      if (response.ok) {
        const user = await response.json();
        const userRoles = user.roles || ['user'];
        const primaryRole = userRoles.includes('ROLE_ADMIN') ? 'admin' : 'user';
        
        setFormData({
          username: user.username || '',
          email: user.email || '',
          password: '',
          role: primaryRole
        });
      } else {
        setError('Error al cargar el usuario');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Error al cargar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await updateUser();
      } else {
        await createUser();
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el usuario`);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    console.log('Iniciando creación de usuario con rol:', formData.role);
    
    try {
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: [formData.role]
      };

      console.log('Enviando datos de usuario:', userData);

      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error al crear el usuario: ${errorData}`);
      }

      const createdUser = await response.json();
      console.log('Usuario creado exitosamente:', createdUser);
      
      setSuccessMessage('Usuario creado exitosamente');
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Error en createUser:', error);
      setError(error.message);
    }
  };

  const updateUser = async () => {
    try {
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        roles: [formData.role]
      };

      if (formData.password.trim()) {
        userData.password = formData.password;
      }

      const response = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error al actualizar el usuario: ${errorData}`);
      }

      console.log('Usuario actualizado exitosamente');
      
      setSuccessMessage('Usuario actualizado exitosamente');
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Error en updateUser:', error);
      setError(error.message);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/admin/usuarios');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('El nombre de usuario es obligatorio');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('El email debe tener un formato válido');
      return false;
    }
    if (!isEditing && !formData.password.trim()) {
      setError('La contraseña es obligatoria');
      return false;
    }
    if (!isEditing && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (!formData.role) {
      setError('Debe seleccionar un rol');
      return false;
    }
    
    return true;
  };

  const handleCancel = () => {
    navigate('/admin/usuarios');
  };

  if (loading && isEditing) {
    return (
      <div className={styles.container}>
        <AdminSidebar />
        <div className={styles.content}>
          <div className={styles.loading}>Cargando usuario...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h1>
          <p className={styles.subtitle}>
            Complete los campos para {isEditing ? 'editar' : 'crear'} un usuario
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Información de Usuario</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  Nombre de Usuario *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Nombre de usuario"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="usuario@email.com"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                {isEditing ? 'Nueva Contraseña (dejar vacío para mantener actual)' : 'Contraseña *'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
                placeholder={isEditing ? "Nueva contraseña..." : "Contraseña"}
                required={!isEditing}
                minLength="6"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Rol *</label>
              <div className={styles.radioContainer}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={handleRoleChange}
                    className={styles.radio}
                  />
                  <span className={styles.radioText}>Administrador</span>
                </label>
                
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={handleRoleChange}
                    className={styles.radio}
                  />
                  <span className={styles.radioText}>Usuario</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading 
                ? (isEditing ? 'Actualizando...' : 'Creando...') 
                : (isEditing ? 'Actualizar Usuario' : 'Crear Usuario')
              }
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <>
          <div className={styles.modalOverlay} />
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.successIcon}>✓</div>
              <h3>{isEditing ? '¡Usuario actualizado!' : '¡Usuario creado!'}</h3>
            </div>
            <div className={styles.modalContent}>
              <p>{successMessage}</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleSuccessModalClose} className={styles.modalButton}>
                Aceptar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUserFormPage;