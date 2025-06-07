import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import styles from './AdminOrderFormPage.module.css';

const AdminOrderFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    clientId: '',
    clientEmail: '',
    shippingNameAddress: '',
    shippingNumberAddress: '',
    phone: '',
    notes: '',
    paymentMethod: 'STRIPE',
    orderStatus: 'PENDING'
  });

  const [products, setProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    fetchClients();
    fetchProducts();
    if (isEditing) {
      fetchOrder();
    }
  }, [id, isEditing]);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/clients');
      if (response.ok) {
        const clientsData = await response.json();
        setClients(clientsData);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      if (response.ok) {
        const productsData = await response.json();
        setAvailableProducts(productsData);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/orders/${id}?data=details`);
      if (response.ok) {
        const order = await response.json();
        setFormData({
          clientId: order.client?.id || '',
          clientEmail: order.clientEmail || '',
          shippingNameAddress: order.shippingNameAddress || '',
          shippingNumberAddress: order.shippingNumberAddress || '',
          phone: order.phone || '',
          notes: order.notes || '',
          paymentMethod: order.orderPaymentMethod || 'STRIPE',
          orderStatus: order.orderStatus || 'PENDING'
        });
        
        if (order.details) {
          const orderProducts = order.details.map(detail => ({
            id: detail.products[0]?.id || '',
            name: detail.products[0]?.name || '',
            price: detail.products[0]?.price || 0,
            quantity: detail.amount || 1,
            subtotal: (detail.products[0]?.price || 0) * (detail.amount || 1)
          }));
          setProducts(orderProducts);
        }
      } else {
        setError('Error al cargar el pedido');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Error al cargar el pedido');
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

    if (name === 'clientId') {
      const selectedClient = clients.find(client => client.id.toString() === value);
      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          clientEmail: selectedClient.email || ''
        }));
      }
    }
  };

  const addProduct = () => {
    const selectedProduct = availableProducts.find(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    );
    
    if (selectedProduct && !products.find(p => p.id === selectedProduct.id)) {
      const newProduct = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: 1,
        subtotal: selectedProduct.price
      };
      setProducts([...products, newProduct]);
      setProductSearch('');
    }
  };

  const updateProductQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, quantity, subtotal: product.price * quantity }
        : product
    ));
  };

  const removeProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => total + product.subtotal, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const orderData = {
        idClient: parseInt(formData.clientId),
        shippingNameAddress: formData.shippingNameAddress,
        shippingNumberAddress: formData.shippingNumberAddress,
        phone: formData.phone,
        notes: formData.notes,
        details: products.map(product => ({
          productId: product.id,
          amount: product.quantity
        }))
      };

      const url = isEditing 
        ? `http://localhost:8080/api/orders/${id}`
        : 'http://localhost:8080/api/orders';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert(isEditing ? 'Pedido actualizado exitosamente' : 'Pedido creado exitosamente');
        navigate('/admin/pedidos');
      } else {
        const errorData = await response.text();
        setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el pedido: ${errorData}`);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el pedido`);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.clientId) {
      setError('Debe seleccionar un cliente');
      return false;
    }
    if (!formData.shippingNameAddress.trim()) {
      setError('La dirección es obligatoria');
      return false;
    }
    if (!formData.shippingNumberAddress.trim()) {
      setError('El número de dirección es obligatorio');
      return false;
    }
    if (products.length === 0) {
      setError('Debe añadir al menos un producto');
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    navigate('/admin/pedidos');
  };

  if (loading && isEditing) {
    return (
      <div className={styles.container}>
        <AdminSidebar />
        <div className={styles.content}>
          <div className={styles.loading}>Cargando pedido...</div>
        </div>
      </div>
    );
  }

  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isEditing ? 'Editar Pedido' : 'Crear Nuevo Pedido'}
          </h1>
          <p className={styles.subtitle}>
            Complete los campos para {isEditing ? 'editar' : 'crear'} un pedido
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>ID del Pedido</label>
                <input
                  type="text"
                  value={isEditing ? id : "Se generará automáticamente"}
                  className={styles.input}
                  disabled
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Fecha del Pedido</label>
                <input
                  type="text"
                  value={new Date().toLocaleDateString('es-ES')}
                  className={styles.input}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Información del Cliente</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="clientId" className={styles.label}>Cliente *</label>
                <select
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">Buscar cliente...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.username} - {client.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="clientEmail" className={styles.label}>Email del Cliente</label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="cliente@email.com"
                  disabled
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="shippingNameAddress" className={styles.label}>Dirección *</label>
              <input
                type="text"
                id="shippingNameAddress"
                name="shippingNameAddress"
                value={formData.shippingNameAddress}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Escribir dirección..."
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="shippingNumberAddress" className={styles.label}>Número *</label>
                <input
                  type="text"
                  id="shippingNumberAddress"
                  name="shippingNumberAddress"
                  value={formData.shippingNumberAddress}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="123"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="612345678"
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.productsHeader}>
              <h2 className={styles.sectionTitle}>Productos</h2>
              <button
                type="button"
                onClick={addProduct}
                className={styles.addProductButton}
                disabled={!productSearch || !filteredProducts.find(p => 
                  p.name.toLowerCase().includes(productSearch.toLowerCase())
                )}
              >
                + Agregar Producto
              </button>
            </div>

            <div className={styles.productSearch}>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className={styles.input}
                placeholder="Buscar producto..."
              />
              {productSearch && filteredProducts.length > 0 && (
                <div className={styles.productSuggestions}>
                  {filteredProducts.slice(0, 5).map(product => (
                    <div
                      key={product.id}
                      className={styles.productSuggestion}
                      onClick={() => setProductSearch(product.name)}
                    >
                      {product.name} - €{product.price}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {products.length > 0 && (
              <div className={styles.productsTable}>
                <div className={styles.tableHeader}>
                  <span>Producto</span>
                  <span>Talla</span>
                  <span>Cantidad</span>
                  <span>Precio Unitario</span>
                  <span>Subtotal</span>
                  <span>Acciones</span>
                </div>
                
                {products.map(product => (
                  <div key={product.id} className={styles.tableRow}>
                    <span>{product.name}</span>
                    <span>M/AW</span>
                    <input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value))}
                      className={styles.quantityInput}
                    />
                    <span>€{product.price.toFixed(2)}</span>
                    <span>€{product.subtotal.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      className={styles.removeButton}
                    >
                      ×
                    </button>
                  </div>
                ))}

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total del Pedido:</span>
                  <span className={styles.totalAmount}>€{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="paymentMethod" className={styles.label}>Método de Pago</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="STRIPE">Tarjeta</option>
                  <option value="CASH">Efectivo</option>
                  <option value="TRANSFER">Transferencia</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="orderStatus" className={styles.label}>Estado del Pedido</label>
                <select
                  id="orderStatus"
                  name="orderStatus"
                  value={formData.orderStatus}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="PAID">Pagado</option>
                  <option value="SHIPPED">Enviado</option>
                  <option value="DELIVERED">Entregado</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes" className={styles.label}>Notas Adicionales</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Notas del pedido..."
                rows="3"
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
              disabled={loading || products.length === 0}
            >
              {loading 
                ? (isEditing ? 'Actualizando...' : 'Creando...') 
                : (isEditing ? 'Actualizar Pedido' : 'Guardar Pedido')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminOrderFormPage;