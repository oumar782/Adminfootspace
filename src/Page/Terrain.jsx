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
      const response = await fetch('https://backend-foot-omega.vercel.app/api/terrain/'); // ✅ ESPACES SUPPRIMÉS
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
    formData.append('upload_preset', 'terrains_preset'); // Votre preset Cloudinary
    
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dixm3l18e/image/upload', { // ✅ ESPACES SUPPRIMÉS
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
      const response = await fetch('https://backend-foot-omega.vercel.app/api/terrain/', { // ✅ ESPACES SUPPRIMÉS
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
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/terrain/${editingId}`, { // ✅ ESPACES SUPPRIMÉS
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
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/terrain/${id}`, { // ✅ ESPACES SUPPRIMÉS
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
      typeTerrain: terrain.typeTerrain || '', // ✅ CORRECT : correspond au backend
      surface: terrain.surface || '',
      descriptions: terrain.descriptions || '',
      tarif: terrain.tarif || '',
      equipementdispo: terrain.equipementdispo || '',
      photo: terrain.photo || '' // ✅ L'URL de l'image est déjà là
    });
    setEditingId(terrain.numeroterrain); // ✅ CORRECT : clé primaire
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
    <div className="terrain-admin">
      <header className="admin-header">
        <h1>Administration des Terrains</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Ajouter un Terrain
        </button>
      </header>

      {/* Formulaire */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>{editingId ? 'Modifier le Terrain' : 'Ajouter un Terrain'}</h2>
            <form onSubmit={editingId ? handleUpdate : handleCreate}>
              <div className="form-group">
                <label>Nom du terrain *</label>
                <input
                  type="text"
                  name="nomterrain"
                  value={formData.nomterrain}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type de terrain *</label>
                <select
                  name="typeTerrain"
                  value={formData.typeTerrain}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="tennis">Tennis</option>
                  <option value="rugby">Rugby</option>
                </select>
              </div>

              <div className="form-group">
                <label>Surface *</label>
                <select
                  name="surface"
                  value={formData.surface}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Sélectionnez une surface</option>
                  <option value="7x7">7x7</option>
                  <option value="9x9">9x9</option>
                  <option value="11x11">11x11</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tarif (€/heure) *</label>
                <input
                  type="number"
                  name="tarif"
                  value={formData.tarif}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="descriptions"
                  value={formData.descriptions}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Équipements disponibles</label>
                <input
                  type="text"
                  name="equipementdispo"
                  value={formData.equipementdispo}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.photo && (
                  <div className="image-preview">
                    <img src={formData.photo} alt="Aperçu" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '8px' }} />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Modifier' : 'Créer'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des terrains */}
      <div className="terrains-list">
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : terrains.length === 0 ? (
          <div className="empty-state">
            <p>Aucun terrain disponible</p>
          </div>
        ) : (
          <div className="terrains-grid">
            {terrains.map(terrain => (
              <div key={terrain.numeroterrain} className="terrain-card">
                <div className="terrain-image">
                  {terrain.photo ? (
                    <img src={terrain.photo} alt={terrain.nomterrain} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <div style={{ width: '100%', height: '180px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                      <span style={{ color: '#999' }}>Pas d'image</span>
                    </div>
                  )}
                </div>
                <div className="terrain-info">
                  <h3>{terrain.nomterrain}</h3>
                  <p><strong>Type:</strong> {terrain.typeTerrain}</p> {/* ✅ CORRECT : typeTerrain */}
                  <p><strong>Surface:</strong> {terrain.surface}</p>
                  <p><strong>Tarif:</strong> {terrain.tarif} €/heure</p>
                  {terrain.descriptions && (
                    <p><strong>Description:</strong> {terrain.descriptions}</p>
                  )}
                  {terrain.equipementdispo && (
                    <p><strong>Équipements:</strong> {terrain.equipementdispo}</p>
                  )}
                </div>
                <div className="terrain-actions">
                  <button 
                    className="btn btn-edit"
                    onClick={() => handleEdit(terrain)}
                  >
                    Modifier
                  </button>
                  <button 
                    className="btn btn-delete"
                    onClick={() => handleDelete(terrain.numeroterrain)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerrainAdmin;