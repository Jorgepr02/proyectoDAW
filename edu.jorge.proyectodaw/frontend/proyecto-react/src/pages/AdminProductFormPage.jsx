import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import styles from './AdminProductFormPage.module.css';

const AdminProductFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    idCategory: '',
    productFeatures: []
  });

  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchFeatures();
    if (isEditing) {
      fetchProduct();
    }
  }, [id, isEditing]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0 && !formData.idCategory) {
          setFormData(prev => ({ ...prev, idCategory: data[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error al cargar las categorías');
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/features');
      if (response.ok) {
        const data = await response.json();
        setFeatures(data);
        
        const initialFeatures = data.slice(0, 4).map(feature => ({
          idFeature: feature.id,
          value: 1
        }));
        
        setFormData(prev => ({
          ...prev,
          productFeatures: initialFeatures
        }));
      }
    } catch (err) {
      console.error('Error fetching features:', err);
      setError('Error al cargar las características');
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/products/${id}?outputType=full`);
      if (response.ok) {
        const product = await response.json();
        
        const productFeatures = product.features && product.features.length > 0 ? 
          product.features.map(feature => ({
            idFeature: feature.id,
            value: parseInt(feature.value) || 1
          })) : 
          features.slice(0, 4).map(feature => ({
            idFeature: feature.id,
            value: 1
          }));

        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          idCategory: product.idCategory || product.category?.id || categories[0]?.id || '',
          productFeatures: productFeatures
        });

        if (product.images && product.images.length > 0) {
          setUploadedImages(product.images);
        }
      } else {
        setError('Error al cargar el producto');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'idCategory' ? parseInt(value) : value
    }));
  };

  const handleFeatureChange = (featureId, value) => {
    const numValue = parseInt(value);
    
    if (numValue < 1 || numValue > 5) {
      setError('Los valores de las características deben estar entre 1 y 5');
      return;
    }

    setFormData(prev => ({
      ...prev,
      productFeatures: prev.productFeatures.map(pf => 
        pf.idFeature === featureId ? { ...pf, value: numValue } : pf
      )
    }));
    
    if (error && error.includes('características')) setError('');
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP)');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError('Las imágenes no pueden superar los 5MB');
      return;
    }

    setSelectedFiles(files);
    
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        previews.push({
          file: file,
          url: event.target.result,
          name: file.name
        });
        if (previews.length === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });

    if (error && error.includes('imagen')) setError('');
  };

  const removePreviewImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeUploadedImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (productId) => {
    if (selectedFiles.length === 0) return true;

    setUploadingImages(true);
    
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`http://localhost:8080/api/products/${productId}/imgs`, {
        method: 'PATCH',
        body: formData
      });

      if (response.ok) {
        const result = await response.text();
        console.log('Imágenes subidas:', result);
        
        setSelectedFiles([]);
        setImagePreviews([]);
        
        return true;
      } else {
        const errorText = await response.text();
        setError(`Error al subir imágenes: ${errorText}`);
        return false;
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Error al subir las imágenes');
      return false;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        idCategory: formData.idCategory,
        productFeatures: formData.productFeatures
      };

      console.log('Datos del producto a enviar:', productData);

      const url = isEditing 
        ? `http://localhost:8080/api/products/${id}`
        : 'http://localhost:8080/api/products';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const result = await response.json();
        const productId = isEditing ? id : result.id;

        let message = `Producto ${isEditing ? 'actualizado' : 'creado'} exitosamente`;

        if (selectedFiles.length > 0) {
          const imageUploadSuccess = await uploadImages(productId);
          if (!imageUploadSuccess) {
            message += ', pero hubo un error al subir las imágenes';
          } else {
            message += ' con imágenes';
          }
        }

        setSuccessMessage(message);
        setShowSuccessModal(true);
        
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/admin/productos');
        }, 2000);
      } else {
        const errorData = await response.text();
        setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el producto: ${errorData}`);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el producto`);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre del producto es obligatorio');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La descripción es obligatoria');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('El precio debe ser mayor a 0');
      return false;
    }
    if (!formData.idCategory) {
      setError('La categoría es obligatoria');
      return false;
    }
    
    if (formData.productFeatures.length < 4) {
      setError('Debe completar las 4 características principales del producto');
      return false;
    }

    for (let feature of formData.productFeatures) {
      if (feature.value < 1 || feature.value > 5) {
        setError('Todas las características deben tener valores entre 1 y 5');
        return false;
      }
    }

    return true;
  };

  const handleCancel = () => {
    navigate('/admin/productos');
  };

  const getFeatureName = (featureId) => {
    const feature = features.find(f => f.id === featureId);
    return feature ? feature.name : `Característica ${featureId}`;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Categoría desconocida';
  };

  if (loading && isEditing) {
    return (
      <div className={styles.container}>
        <AdminSidebar />
        <div className={styles.content}>
          <div className={styles.loading}>Cargando producto...</div>
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
            {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h1>
          <p className={styles.subtitle}>
            Complete los campos para {isEditing ? 'editar' : 'crear'} un producto
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Información Básica</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Nombre del Producto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Ej: Burton Custom X"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Describe las características del producto..."
                rows="4"
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price" className={styles.label}>
                  Precio (€) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="99.99"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="idCategory" className={styles.label}>
                  Categoría *
                </label>
                <select
                  id="idCategory"
                  name="idCategory"
                  value={formData.idCategory}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Características del Producto *</h2>
            <div className={styles.featuresGrid}>
              {formData.productFeatures.slice(0, 4).map((productFeature, index) => (
                <div key={productFeature.idFeature} className={styles.featureGroup}>
                  <div className={styles.featureHeader}>
                    <span className={styles.featureLabel}>
                      {getFeatureName(productFeature.idFeature)} *
                    </span>
                    <span className={styles.featureValue}>
                      {productFeature.value}/5
                    </span>
                  </div>
                  <div className={styles.featureSliderContainer}>
                    <div className={styles.featureBarContainer}>
                      <div
                        className={styles.featureBarFill}
                        style={{
                          width: `${((productFeature.value - 1) / 4) * 100}%`,
                        }}
                      />
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={productFeature.value}
                        onChange={(e) => handleFeatureChange(productFeature.idFeature, e.target.value)}
                        className={styles.featureSlider}
                        required
                      />
                    </div>
                    <div className={styles.featureScale}>
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Imágenes del Producto</h2>
            <div className={styles.imagesDescription}>
              Sube imágenes del producto (PNG- máximo 1MB por imagen)
            </div>

            {isEditing && uploadedImages.length > 0 && (
              <div className={styles.uploadedImagesSection}>
                <h3 className={styles.subsectionTitle}>Imágenes actuales</h3>
                <div className={styles.imageGrid}>
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={index} className={styles.imagePreview}>
                      <img src={imageUrl} alt={`Imagen ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(index)}
                        className={styles.removeImageButton}
                        title="Eliminar imagen"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.fileUploadSection}>
              <label htmlFor="images" className={styles.fileUploadLabel}>
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className={styles.fileInput}
                />
                <div className={styles.fileUploadContent}>
                  <span className={styles.uploadIcon}>📷</span>
                  <span className={styles.uploadText}>
                    {selectedFiles.length > 0 
                      ? `${selectedFiles.length} archivo(s) seleccionado(s)` 
                      : 'Seleccionar imágenes'
                    }
                  </span>
                </div>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className={styles.previewSection}>
                <h3 className={styles.subsectionTitle}>Nuevas imágenes para subir</h3>
                <div className={styles.imageGrid}>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className={styles.imagePreview}>
                      <img src={preview.url} alt={preview.name} />
                      <button
                        type="button"
                        onClick={() => removePreviewImage(index)}
                        className={styles.removeImageButton}
                        title="Eliminar imagen"
                      >
                        ×
                      </button>
                      <div className={styles.imageName}>{preview.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={loading || uploadingImages}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || uploadingImages}
            >
              {loading || uploadingImages
                ? (uploadingImages ? 'Subiendo imágenes...' : (isEditing ? 'Actualizando...' : 'Creando...'))
                : (isEditing ? 'Actualizar Producto' : 'Crear Producto')
              }
            </button>
          </div>
        </form>

        {showSuccessModal && (
          <>
            <div className={styles.modalOverlay} />
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <div className={styles.successIcon}>✓</div>
                <h3>¡Operación exitosa!</h3>
              </div>
              <div className={styles.modalContent}>
                <p>{successMessage}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProductFormPage;