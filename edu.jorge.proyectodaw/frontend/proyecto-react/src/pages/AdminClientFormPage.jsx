import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import styles from './AdminClientFormPage.module.css';

const AdminClientFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    username: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    floor: '',
    role: 'CLIENT'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchClient();
    }
  }, [id, isEditing]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/clients/${id}`);
      if (response.ok) {
        const client = await response.json();
        setFormData({
          username: client.username || '',
          lastname: client.lastname || '',
          email: client.email || '',
          phone: client.phone || '',
          address: client.address || '',
          floor: client.floor || '',
          role: client.role || 'CLIENT'
        });
      } else {
        setError('Error al cargar el cliente');
      }
    } catch (err) {
      console.error('Error fetching client:', err);
      setError('Error al cargar el cliente');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const clientData = {
        username: formData.username.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        floor: formData.floor.trim(),
        role: formData.role
      };

      const url = isEditing 
        ? `http://localhost:8080/api/clients/${id}`
        : 'http://localhost:8080/api/clients';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      });

      if (response.ok) {
        alert(isEditing ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
        navigate('/admin/clientes');
      } else {
        const errorData = await response.text();
        setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el cliente: ${errorData}`);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el cliente`);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!formData.lastname.trim()) {
      setError('Los apellidos son obligatorios');
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
    if (!formData.address.trim()) {
      setError('La dirección es obligatoria');
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    navigate('/admin/clientes');
  };

  if (loading && isEditing) {
    return (
      <div className={styles.container}>
        <AdminSidebar />
        <div className={styles.content}>
          <div className={styles.loading}>Cargando cliente...</div>
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
            {isEditing ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
          </h1>
          <p className={styles.subtitle}>
            Complete los campos para {isEditing ? 'editar' : 'crear'} un cliente
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Información Personal</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  Nombre *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Nombre del cliente"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastname" className={styles.label}>
                  Apellidos *
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Apellidos del cliente"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
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
                  placeholder="cliente@email.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="+34 XXX XXX XXX"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.label}>
                Rol *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="CLIENT">Cliente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Dirección</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                Dirección *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Calle..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="floor" className={styles.label}>
                Portal / Piso
              </label>
              <input
                type="text"
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Ciudad"
              />
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
                : (isEditing ? 'Actualizar Cliente' : 'Crear Cliente')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminClientFormPage;