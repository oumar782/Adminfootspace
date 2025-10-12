// TerrainAdmin.jsx
import React, { useState, useEffect } from 'react';
import './TerrainAdmin.css';

const TerrainAdmin = () => {
  const [terrains, setTerrains] = useState([]);
  const [formData, setFormData] = useState({
    nomterrain: '',
    typeTerrain: '',
    surface: '',
    descriptions: '',
    tarif: '',
    equipementdispo: '',
    photo: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Afficher un toast
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  // Récupérer tous les terrains
  const fetchTerrains = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backend-foot-omega.vercel.app/api/terrain/');
      const data = await response.json();
      
      if (data.success) {
        setTerrains(data.data);
      } else {
        showToast('Erreur lors du chargement des terrains', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerrains();
  }, []);

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Uploader une image vers Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'terrains_preset');
    
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dixm3l18e/image/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Cloudinary a renvoyé une réponse invalide');
      }
    } catch (error) {
      console.error('Erreur upload image:', error);
      showToast('Erreur lors de l\'upload de l\'image', 'error');
      return null;
    }
  };

  // Gérer l'upload d'image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setFormData(prev => ({ ...prev, photo: imageUrl }));
      showToast('Image téléchargée avec succès');
    }
  };

  // Créer un nouveau terrain
  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!formData.nomterrain || !formData.typeTerrain || !formData.surface || !formData.tarif) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    
    try {
      const response = await fetch('https://backend-foot-omega.vercel.app/api/terrain/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast('Terrain créé avec succès');
        setFormData({
          nomterrain: '',
          typeTerrain: '',
          surface: '',
          descriptions: '',
          tarif: '',
          equipementdispo: '',
          photo: ''
        });
        setShowForm(false);
        fetchTerrains();
      } else {
        showToast(data.message || 'Erreur lors de la création', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
      console.error('Erreur:', error);
    }
  };

  // Mettre à jour un terrain
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.nomterrain || !formData.typeTerrain || !formData.surface || !formData.tarif) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    
    try {
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/terrain/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast('Terrain modifié avec succès');
        setFormData({
          nomterrain: '',
          typeTerrain: '',
          surface: '',
          descriptions: '',
          tarif: '',
          equipementdispo: '',
          photo: ''
        });
        setEditingId(null);
        setShowForm(false);
        fetchTerrains();
      } else {
        showToast(data.message || 'Erreur lors de la modification', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
      console.error('Erreur:', error);
    }
  };

  // Supprimer un terrain
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce terrain ?')) return;
    
    try {
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/terrain/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast('Terrain supprimé avec succès');
        fetchTerrains();
      } else {
        showToast(data.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
      console.error('Erreur:', error);
    }
  };

  // Pré-remplir le formulaire pour l'édition
  const handleEdit = (terrain) => {
    setFormData({
      nomterrain: terrain.nomterrain || '',
      typeTerrain: terrain.typeTerrain || '',
      surface: terrain.surface || '',
      descriptions: terrain.descriptions || '',
      tarif: terrain.tarif || '',
      equipementdispo: terrain.equipementdispo || '',
      photo: terrain.photo || ''
    });
    setEditingId(terrain.numeroterrain);
    setShowForm(true);
  };

  // Annuler l'édition/création
  const handleCancel = () => {
    setFormData({
      nomterrain: '',
      typeTerrain: '',
      surface: '',
      descriptions: '',
      tarif: '',
      equipementdispo: '',
      photo: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="ta-container">
      <header className="ta-header">
        <h1 className="ta-title">Administration des Terrains</h1>
        <button 
          className="ta-btn ta-btn-primary"
          onClick={() => setShowForm(true)}
        >
          <span className="ta-btn-icon">+</span>
          Ajouter un Terrain
        </button>
      </header>

      {/* Formulaire */}
      {showForm && (
        <div className="ta-form-overlay">
          <div className="ta-form-modal">
            <div className="ta-form-header">
              <h2>{editingId ? 'Modifier le Terrain' : 'Ajouter un Terrain'}</h2>
              <button className="ta-close-btn" onClick={handleCancel}>×</button>
            </div>
            <form onSubmit={editingId ? handleUpdate : handleCreate} className="ta-form">
              <div className="ta-form-grid">
                <div className="ta-form-group">
                  <label className="ta-input-label">Nom du terrain *</label>
                  <input
                    type="text"
                    name="nomterrain"
                    value={formData.nomterrain}
                    onChange={handleInputChange}
                    className="ta-input"
                    required
                  />
                </div>

                <div className="ta-form-group">
                  <label className="ta-input-label">Type de terrain *</label>
                  <select
                    name="typeTerrain"
                    value={formData.typeTerrain}
                    onChange={handleInputChange}
                    className="ta-input"
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="football">Normak</option>
                    <option value="basketball">Synthétique</option>
                  
                  </select>
                </div>

                <div className="ta-form-group">
                  <label className="ta-input-label">Surface *</label>
                  <select
                    name="surface"
                    value={formData.surface}
                    onChange={handleInputChange}
                    className="ta-input"
                    required
                  >
                    <option value="">Sélectionnez une surface</option>
                    <option value="7x7">7x7</option>
                    <option value="9x9">9x9</option>
                    <option value="11x11">11x11</option>
                  </select>
                </div>

                <div className="ta-form-group">
                  <label className="ta-input-label">Tarif (DH/heure) *</label>
                  <input
                    type="number"
                    name="tarif"
                    value={formData.tarif}
                    onChange={handleInputChange}
                    min="0"
                    className="ta-input"
                    required
                  />
                </div>
              </div>

              <div className="ta-form-group">
                <label className="ta-input-label">Description</label>
                <textarea
                  name="descriptions"
                  value={formData.descriptions}
                  onChange={handleInputChange}
                  rows="3"
                  className="ta-textarea"
                />
              </div>

              <div className="ta-form-group">
                <label className="ta-input-label">Équipements disponibles</label>
                <input
                  type="text"
                  name="equipementdispo"
                  value={formData.equipementdispo}
                  onChange={handleInputChange}
                  className="ta-input"
                />
              </div>

              <div className="ta-form-group">
                <label className="ta-input-label">Photo</label>
                <div className="ta-file-upload">
                  <label className="ta-file-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="ta-file-input"
                    />
                    <span className="ta-file-cta">Choisir une image</span>
                  </label>
                </div>
                {formData.photo && (
                  <div className="ta-image-preview">
                    <img src={formData.photo} alt="Aperçu" />
                  </div>
                )}
              </div>

              <div className="ta-form-actions">
                <button type="submit" className="ta-btn ta-btn-primary">
                  {editingId ? 'Modifier' : 'Créer'}
                </button>
                <button type="button" className="ta-btn ta-btn-secondary" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des terrains */}
      <div className="ta-content">
        {loading ? (
          <div className="ta-loading">
            <div className="ta-spinner"></div>
            <p>Chargement des terrains...</p>
          </div>
        ) : terrains.length === 0 ? (
          <div className="ta-empty">
            <div className="ta-empty-icon"></div>
            <h3>Aucun terrain disponible</h3>
            <p>Commencez par ajouter votre premier terrain</p>
            <button 
              className="ta-btn ta-btn-primary"
              onClick={() => setShowForm(true)}
            >
              Ajouter un terrain
            </button>
          </div>
        ) : (
          <div className="ta-grid">
            {terrains.map(terrain => (
              <div key={terrain.numeroterrain} className="ta-card">
                <div className="ta-card-media">
                  {terrain.photo ? (
                    <img src={terrain.photo} alt={terrain.nomterrain} />
                  ) : (
                    <div className="ta-card-placeholder">
                      <span>Aucune image</span>
                    </div>
                  )}
                  <div className="ta-card-overlay">
                    <button 
                      className="ta-btn ta-btn-icon"
                      onClick={() => handleEdit(terrain)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="ta-btn ta-btn-icon"
                      onClick={() => handleDelete(terrain.numeroterrain)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="ta-card-content">
                  <h3 className="ta-card-title">{terrain.nomterrain}</h3>
                  <div className="ta-card-details">
                    <div className="ta-detail-item">
                      <span className="ta-detail-label">Type:</span>
                      <span className="ta-detail-value">{terrain.typeTerrain}</span>
                    </div>
                    <div className="ta-detail-item">
                      <span className="ta-detail-label">Surface:</span>
                      <span className="ta-detail-value">{terrain.surface}</span>
                    </div>
                    <div className="ta-detail-item">
                      <span className="ta-detail-label">Tarif:</span>
                      <span className="ta-detail-value ta-price">{terrain.tarif} DH/heure</span>
                    </div>
                    {terrain.descriptions && (
                      <div className="ta-detail-item">
                        <span className="ta-detail-label">Description:</span>
                        <span className="ta-detail-value">{terrain.descriptions}</span>
                      </div>
                    )}
                    {terrain.equipementdispo && (
                      <div className="ta-detail-item">
                        <span className="ta-detail-label">Équipements:</span>
                        <span className="ta-detail-value">{terrain.equipementdispo}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toasts */}
      <div className="ta-toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`ta-toast ta-toast-${toast.type}`}>
            <span className="ta-toast-message">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerrainAdmin;