import React, { useState, useEffect } from 'react';
import './calendrier.css';

// Composant Toast pour les retours utilisateur
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

// Composant Modal pour les formulaires
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Composant principal
const calendrier = () => {
  const [calendriers, setCalendriers] = useState([]);
  const [selectedCalendrier, setSelectedCalendrier] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [viewDateRange, setViewDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // États pour le formulaire
  const [formData, setFormData] = useState({
    date: '',
    nomterrain: '',
    statut: 'disponible',
    periode: 'matin'
  });

  // Afficher un toast
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  // Fermer un toast
  const closeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Récupérer tous les calendriers
  const fetchCalendriers = async () => {
    try {
      const response = await fetch('https://backend-foot-omega.vercel.app/api/calendriers/');
      const data = await response.json();
      if (data.success) {
        setCalendriers(data.data);
      }
    } catch (error) {
      showToast('Erreur lors du chargement des données', 'error');
    }
  };

  useEffect(() => {
    fetchCalendriers();
  }, []);

  // Gérer les changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumettre le formulaire de création
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://backend-foot-omega.vercel.app/api/calendriers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Calendrier créé avec succès');
        setShowCreateModal(false);
        setFormData({
          date: '',
          nomterrain: '',
          statut: 'disponible',
          periode: 'matin'
        });
        fetchCalendriers();
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Erreur lors de la création', 'error');
    }
  };

  // Supprimer un calendrier
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce calendrier ?')) {
      try {
        const response = await fetch(`https://backend-foot-omega.vercel.app/api/calendriers/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (data.success) {
          showToast('Calendrier supprimé avec succès');
          fetchCalendriers();
        } else {
          showToast(data.message, 'error');
        }
      } catch (error) {
        showToast('Erreur lors de la suppression', 'error');
      }
    }
  };

  // Mettre à jour un calendrier
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/calendriers/${selectedCalendrier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Calendrier mis à jour avec succès');
        setShowEditModal(false);
        fetchCalendriers();
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  // Ouvrir le modal d'édition
  const openEditModal = (calendrier) => {
    setSelectedCalendrier(calendrier);
    setFormData({
      date: calendrier.date,
      nomterrain: calendrier.nomterrain,
      statut: calendrier.statut,
      periode: calendrier.periode
    });
    setShowEditModal(true);
  };

  // Afficher les calendriers par plage de dates
  const viewByDateRange = async () => {
    if (!viewDateRange.startDate || !viewDateRange.endDate) {
      showToast('Veuillez sélectionner une plage de dates', 'error');
      return;
    }

    try {
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/calendriers/plage/${viewDateRange.startDate}/${viewDateRange.endDate}`);
      const data = await response.json();
      
      if (data.success) {
        setCalendriers(data.data);
        showToast(`${data.count} entrées trouvées pour cette plage de dates`);
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Erreur lors de la recherche', 'error');
    }
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gestionnaire de Calendriers Premium</h1>
        <p>Administrez vos réservations avec élégance</p>
      </header>

      <main className="app-main">
        <div className="controls">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            Créer un nouveau calendrier
          </button>
          
          <div className="date-range-selector">
            <h3>Visualiser par plage de dates</h3>
            <div className="date-inputs">
              <input
                type="date"
                value={viewDateRange.startDate}
                onChange={(e) => setViewDateRange(prev => ({...prev, startDate: e.target.value}))}
              />
              <span>à</span>
              <input
                type="date"
                value={viewDateRange.endDate}
                onChange={(e) => setViewDateRange(prev => ({...prev, endDate: e.target.value}))}
              />
              <button className="btn btn-secondary" onClick={viewByDateRange}>
                Appliquer
              </button>
              <button className="btn btn-outline" onClick={fetchCalendriers}>
                Voir tout
              </button>
            </div>
          </div>
        </div>

        <div className="calendriers-grid">
          {calendriers.map(calendrier => (
            <div key={calendrier.id} className="calendrier-card">
              <div className="card-header">
                <h3>{calendrier.nomterrain || 'Sans nom'}</h3>
                <span className={`status-badge status-${calendrier.statut}`}>
                  {calendrier.statut}
                </span>
              </div>
              <div className="card-body">
                <p className="date-display">{formatDate(calendrier.date)}</p>
                <p className="periode">Période: {calendrier.periode}</p>
              </div>
              <div className="card-actions">
                <button 
                  className="btn btn-view"
                  onClick={() => {
                    setSelectedCalendrier(calendrier);
                    setShowViewModal(true);
                  }}
                >
                  Voir
                </button>
                <button 
                  className="btn btn-edit"
                  onClick={() => openEditModal(calendrier)}
                >
                  Modifier
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => handleDelete(calendrier.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal de création */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Créer un nouveau calendrier"
      >
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Nom du terrain</label>
            <input
              type="text"
              name="nomterrain"
              value={formData.nomterrain}
              onChange={handleInputChange}
              placeholder="Entrez le nom du terrain"
            />
          </div>
          <div className="form-group">
            <label>Statut</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleInputChange}
            >
              <option value="disponible">Disponible</option>
              <option value="réservé">Réservé</option>
              <option value="occupé">Occupé</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Période</label>
            <select
              name="periode"
              value={formData.periode}
              onChange={handleInputChange}
            >
              <option value="matin">Matin</option>
              <option value="après-midi">Après-midi</option>
              <option value="soir">Soir</option>
              <option value="journée">Journée complète</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Créer</button>
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => setShowCreateModal(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de visualisation */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        title="Détails du calendrier"
      >
        {selectedCalendrier && (
          <div className="view-details">
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{formatDate(selectedCalendrier.date)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Terrain:</span>
              <span className="detail-value">{selectedCalendrier.nomterrain || 'Non spécifié'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Statut:</span>
              <span className={`detail-value status-${selectedCalendrier.statut}`}>
                {selectedCalendrier.statut}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Période:</span>
              <span className="detail-value">{selectedCalendrier.periode}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal d'édition */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Modifier le calendrier"
      >
        <form onSubmit={handleUpdate} className="form">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Nom du terrain</label>
            <input
              type="text"
              name="nomterrain"
              value={formData.nomterrain}
              onChange={handleInputChange}
              placeholder="Entrez le nom du terrain"
            />
          </div>
          <div className="form-group">
            <label>Statut</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleInputChange}
            >
              <option value="disponible">Disponible</option>
              <option value="réservé">Réservé</option>
              <option value="occupé">Occupé</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Période</label>
            <select
              name="periode"
              value={formData.periode}
              onChange={handleInputChange}
            >
              <option value="matin">Matin</option>
              <option value="après-midi">Après-midi</option>
              <option value="soir">Soir</option>
              <option value="journée">Journée complète</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Mettre à jour</button>
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => setShowEditModal(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      {/* Container pour les toasts */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => closeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default calendrier;