import React, { useState, useEffect } from 'react';
import './Calendrier.css';

// Composant Toast pour les retours utilisateur
const CalLuxeToast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`cal-luxe-toast cal-luxe-toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

// Composant Modal pour les formulaires
const CalLuxeModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="cal-luxe-modal-overlay" onClick={onClose}>
      <div className="cal-luxe-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cal-luxe-decorative-corner cal-luxe-decorative-corner-top-left"></div>
        <div className="cal-luxe-decorative-corner cal-luxe-decorative-corner-top-right"></div>
        <div className="cal-luxe-modal-header">
          <h2>{title}</h2>
          <button className="cal-luxe-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="cal-luxe-modal-body">
          {children}
        </div>
        <div className="cal-luxe-decorative-corner cal-luxe-decorative-corner-bottom-left"></div>
        <div className="cal-luxe-decorative-corner cal-luxe-decorative-corner-bottom-right"></div>
      </div>
    </div>
  );
};

// Composant principal
const CalendrierLuxe = () => {
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
    <div className="cal-luxe-app">
      <header className="cal-luxe-app-header">
        <h1>Gestionnaire de Calendriers Premium</h1>
        <p>Administrez vos réservations avec élégance</p>
      </header>

      <main className="cal-luxe-app-main">
        <div className="cal-luxe-controls">
          <button 
            className="cal-luxe-btn cal-luxe-btn-primary cal-luxe-glow-effect"
            onClick={() => setShowCreateModal(true)}
          >
            <span>+</span> Créer un nouveau calendrier
          </button>
          
          <div className="cal-luxe-date-range-selector">
            <h3>Visualiser par plage de dates</h3>
            <div className="cal-luxe-date-inputs">
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
              <button className="cal-luxe-btn cal-luxe-btn-secondary" onClick={viewByDateRange}>
                Appliquer
              </button>
              <button className="cal-luxe-btn cal-luxe-btn-outline" onClick={fetchCalendriers}>
                Voir tout
              </button>
            </div>
          </div>
        </div>

        <div className="cal-luxe-calendriers-grid">
          {calendriers.map(calendrier => (
            <div key={calendrier.id} className="cal-luxe-calendrier-card cal-luxe-glow-effect">
              <div className="cal-luxe-card-header">
                <h3>{calendrier.nomterrain || 'Sans nom'}</h3>
                <span className={`cal-luxe-status-badge cal-luxe-status-${calendrier.statut}`}>
                  {calendrier.statut}
                </span>
              </div>
              <div className="cal-luxe-card-body">
                <p className="cal-luxe-date-display">{formatDate(calendrier.date)}</p>
                <p className="cal-luxe-periode">Période: {calendrier.periode}</p>
              </div>
              <div className="cal-luxe-card-actions">
                <button 
                  className="cal-luxe-btn cal-luxe-btn-view"
                  onClick={() => {
                    setSelectedCalendrier(calendrier);
                    setShowViewModal(true);
                  }}
                >
                   Voir
                </button>
                <button 
                  className="cal-luxe-btn cal-luxe-btn-edit"
                  onClick={() => openEditModal(calendrier)}
                >
                  Modifier
                </button>
                <button 
                  className="cal-luxe-btn cal-luxe-btn-delete"
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
      <CalLuxeModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Créer un nouveau calendrier"
      >
        <form onSubmit={handleSubmit} className="cal-luxe-form">
          <div className="cal-luxe-form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="cal-luxe-form-group">
            <label>Nom du terrain</label>
            <input
              type="text"
              name="nomterrain"
              value={formData.nomterrain}
              onChange={handleInputChange}
              placeholder="Entrez le nom du terrain"
            />
          </div>
          <div className="cal-luxe-form-group">
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
          <div className="cal-luxe-form-group">
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
          <div className="cal-luxe-form-actions">
            <button type="submit" className="cal-luxe-btn cal-luxe-btn-primary">Créer</button>
            <button 
              type="button" 
              className="cal-luxe-btn cal-luxe-btn-outline"
              onClick={() => setShowCreateModal(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      </CalLuxeModal>

      {/* Modal de visualisation */}
      <CalLuxeModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        title="Détails du calendrier"
      >
        {selectedCalendrier && (
          <div className="cal-luxe-view-details">
            <div className="cal-luxe-detail-item">
              <span className="cal-luxe-detail-label">Date:</span>
              <span className="cal-luxe-detail-value">{formatDate(selectedCalendrier.date)}</span>
            </div>
            <div className="cal-luxe-detail-item">
              <span className="cal-luxe-detail-label">Terrain:</span>
              <span className="cal-luxe-detail-value">{selectedCalendrier.nomterrain || 'Non spécifié'}</span>
            </div>
            <div className="cal-luxe-detail-item">
              <span className="cal-luxe-detail-label">Statut:</span>
              <span className={`cal-luxe-detail-value cal-luxe-status-${selectedCalendrier.statut}`}>
                {selectedCalendrier.statut}
              </span>
            </div>
            <div className="cal-luxe-detail-item">
              <span className="cal-luxe-detail-label">Période:</span>
              <span className="cal-luxe-detail-value">{selectedCalendrier.periode}</span>
            </div>
          </div>
        )}
      </CalLuxeModal>

      {/* Modal d'édition */}
      <CalLuxeModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Modifier le calendrier"
      >
        <form onSubmit={handleUpdate} className="cal-luxe-form">
          <div className="cal-luxe-form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="cal-luxe-form-group">
            <label>Nom du terrain</label>
            <input
              type="text"
              name="nomterrain"
              value={formData.nomterrain}
              onChange={handleInputChange}
              placeholder="Entrez le nom du terrain"
            />
          </div>
          <div className="cal-luxe-form-group">
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
          <div className="cal-luxe-form-group">
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
          <div className="cal-luxe-form-actions">
            <button type="submit" className="cal-luxe-btn cal-luxe-btn-primary">Mettre à jour</button>
            <button 
              type="button" 
              className="cal-luxe-btn cal-luxe-btn-outline"
              onClick={() => setShowEditModal(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      </CalLuxeModal>

      {/* Container pour les toasts */}
      <div className="cal-luxe-toast-container">
        {toasts.map(toast => (
          <CalLuxeToast
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

export default CalendrierLuxe;