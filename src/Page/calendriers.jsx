import React, { useState, useEffect } from 'react';
import './calendrier.css';

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
      <div className="cal-luxe-toast-content">
        <span className="cal-luxe-toast-message">{message}</span>
        <button className="cal-luxe-toast-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
};

// Composant Modal pour les formulaires
const CalLuxeModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="cal-luxe-modal-overlay" onClick={onClose}>
      <div className="cal-luxe-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cal-luxe-modal-header">
          <h2>{title}</h2>
          <button className="cal-luxe-modal-close" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>
        <div className="cal-luxe-modal-body">
          {children}
        </div>
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
    date_debut: '',
    heure_debut: '09:00',
    date_fin: '',
    heure_fin: '',
    nom_terrain: ''
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
    
    // Validation des champs requis
    if (!formData.date_debut || !formData.date_fin || !formData.heure_fin || !formData.nom_terrain) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

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
        showToast('Créneau créé avec succès');
        setShowCreateModal(false);
        setFormData({
          date_debut: '',
          heure_debut: '09:00',
          date_fin: '',
          heure_fin: '',
          nom_terrain: ''
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      try {
        const response = await fetch(`https://backend-foot-omega.vercel.app/api/calendriers/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (data.success) {
          showToast('Créneau supprimé avec succès');
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
    
    // Validation des champs requis
    if (!formData.date_debut || !formData.date_fin || !formData.heure_fin || !formData.nom_terrain) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

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
        showToast('Créneau mis à jour avec succès');
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
      date_debut: calendrier.date_debut,
      heure_debut: calendrier.heure_debut,
      date_fin: calendrier.date_fin,
      heure_fin: calendrier.heure_fin,
      nom_terrain: calendrier.nom_terrain
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
        showToast(`${data.count} créneaux trouvés pour cette plage de dates`);
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

  // Formater l'heure pour l'affichage
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Format HH:MM
  };

  // Obtenir la durée entre début et fin
  const getDuree = (debut, fin) => {
    if (!debut || !fin) return '';
    const [h1, m1] = debut.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? `${minutes}min` : ''}`;
  };

  return (
    <div className="cal-luxe-app">
      <header className="cal-luxe-app-header">
        <div className="cal-luxe-header-content">
          <h1 className="cal-luxe-main-title">Gestionnaire de Réservations</h1>
          <p className="cal-luxe-subtitle">Planifiez et gérez vos créneaux horaires avec précision</p>
        </div>
      </header>

      <main className="cal-luxe-app-main">
        <div className="cal-luxe-controls-section">
          <div className="cal-luxe-controls-card">
            <button 
              className="cal-luxe-btn cal-luxe-btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="cal-luxe-btn-icon">+</span>
              Nouvelle Réservation
            </button>
            
            <div className="cal-luxe-date-filter">
              <h3 className="cal-luxe-filter-title">Filtrer par période</h3>
              <div className="cal-luxe-date-inputs">
                <div className="cal-luxe-input-group">
                  <label>Du</label>
                  <input
                    type="date"
                    value={viewDateRange.startDate}
                    onChange={(e) => setViewDateRange(prev => ({...prev, startDate: e.target.value}))}
                    className="cal-luxe-date-input"
                  />
                </div>
                <div className="cal-luxe-input-group">
                  <label>Au</label>
                  <input
                    type="date"
                    value={viewDateRange.endDate}
                    onChange={(e) => setViewDateRange(prev => ({...prev, endDate: e.target.value}))}
                    className="cal-luxe-date-input"
                  />
                </div>
                <button className="cal-luxe-btn cal-luxe-btn-secondary" onClick={viewByDateRange}>
                  Appliquer
                </button>
                <button className="cal-luxe-btn cal-luxe-btn-outline" onClick={fetchCalendriers}>
                  Tout voir
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="cal-luxe-reservations-section">
          <h2 className="cal-luxe-section-title">Réservations en cours</h2>
          <div className="cal-luxe-calendriers-grid">
            {calendriers.map(calendrier => (
              <div key={calendrier.id} className="cal-luxe-reservation-card">
                <div className="cal-luxe-card-header">
                  <div className="cal-luxe-terrain-info">
                    <h3 className="cal-luxe-terrain-name">{calendrier.nom_terrain || 'Terrain Principal'}</h3>
                    <span className="cal-luxe-date-badge">
                      {formatDate(calendrier.date_debut)}
                    </span>
                  </div>
                  <div className="cal-luxe-status-indicator"></div>
                </div>
                
                <div className="cal-luxe-card-body">
                  <div className="cal-luxe-time-slots">
                    <div className="cal-luxe-time-slot">
                      <span className="cal-luxe-time-label">Début</span>
                      <span className="cal-luxe-time-value">{formatTime(calendrier.heure_debut)}</span>
                    </div>
                    <div className="cal-luxe-time-separator">→</div>
                    <div className="cal-luxe-time-slot">
                      <span className="cal-luxe-time-label">Fin</span>
                      <span className="cal-luxe-time-value">{formatTime(calendrier.heure_fin)}</span>
                    </div>
                  </div>
                  
                  <div className="cal-luxe-duration-info">
                    <span className="cal-luxe-duration-label">Durée totale</span>
                    <span className="cal-luxe-duration-value">
                      {getDuree(calendrier.heure_debut, calendrier.heure_fin)}
                    </span>
                  </div>

                  {calendrier.date_debut !== calendrier.date_fin && (
                    <div className="cal-luxe-multi-day-notice">
                      <span className="cal-luxe-multi-day-icon">📅</span>
                      <span>Réservation multi-jours jusqu'au {formatDate(calendrier.date_fin)}</span>
                    </div>
                  )}
                </div>

                <div className="cal-luxe-card-actions">
                  <button 
                    className="cal-luxe-action-btn cal-luxe-action-view"
                    onClick={() => {
                      setSelectedCalendrier(calendrier);
                      setShowViewModal(true);
                    }}
                  >
                    <span className="cal-luxe-action-icon">👁️</span>
                    Détails
                  </button>
                  <button 
                    className="cal-luxe-action-btn cal-luxe-action-edit"
                    onClick={() => openEditModal(calendrier)}
                  >
                    <span className="cal-luxe-action-icon">✏️</span>
                    Modifier
                  </button>
                  <button 
                    className="cal-luxe-action-btn cal-luxe-action-delete"
                    onClick={() => handleDelete(calendrier.id)}
                  >
                    <span className="cal-luxe-action-icon">🗑️</span>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal de création */}
      <CalLuxeModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Nouvelle Réservation"
      >
        <form onSubmit={handleSubmit} className="cal-luxe-form">
          <div className="cal-luxe-form-row">
            <div className="cal-luxe-form-group">
              <label className="cal-luxe-form-label">Nom du terrain *</label>
              <input
                type="text"
                name="nom_terrain"
                value={formData.nom_terrain}
                onChange={handleInputChange}
                placeholder="Ex: Terrain A, Stade Principal..."
                className="cal-luxe-form-input"
                required
              />
            </div>
          </div>

          <div className="cal-luxe-form-row">
            <div className="cal-luxe-form-group">
              <label className="cal-luxe-form-label">Date de début *</label>
              <input
                type="date"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleInputChange}
                className="cal-luxe-form-input"
                required
              />
            </div>
            <div className="cal-luxe-form-group">
              <label className="cal-luxe-form-label">Heure de début</label>
              <input
                type="time"
                name="heure_debut"
                value={formData.heure_debut}
                onChange={handleInputChange}
                className="cal-luxe-form-input"
              />
            </div>
          </div>

          <div className="cal-luxe-form-row">
            <div className="cal-luxe-form-group">
              <label className="cal-luxe-form-label">Date de fin *</label>
              <input
                type="date"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleInputChange}
                className="cal-luxe-form-input"
                required
              />
            </div>
            <div className="cal-luxe-form-group">
              <label className="cal-luxe-form-label">Heure de fin *</label>
              <input
                type="time"
                name="heure_fin"
                value={formData.heure_fin}
                onChange={handleInputChange}
                className="cal-luxe-form-input"
                required
              />
            </div>
          </div>

          <div className="cal-luxe-form-actions">
            <button type="submit" className="cal-luxe-btn cal-luxe-btn-primary cal-luxe-btn-large">
              Créer la réservation
            </button>
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
        title="Détails de la Réservation"
      >
        {selectedCalendrier && (
          <div className="cal-luxe-details-view">
            <div className="cal-luxe-detail-section">
              <h3 className="cal-luxe-detail-section-title">Informations Terrain</h3>
              <div className="cal-luxe-detail-item">
                <span className="cal-luxe-detail-label">Nom du terrain</span>
                <span className="cal-luxe-detail-value">{selectedCalendrier.nom_terrain || 'Non spécifié'}</span>
              </div>
            </div>

            <div className="cal-luxe-detail-section">
              <h3 className="cal-luxe-detail-section-title">Période de Réservation</h3>
              <div className="cal-luxe-detail-item">
                <span className="cal-luxe-detail-label">Date de début</span>
                <span className="cal-luxe-detail-value">{formatDate(selectedCalendrier.date_debut)}</span>
              </div>
              <div className="cal-luxe-detail-item">
                <span className="cal-luxe-detail-label">Heure de début</span>
                <span className="cal-luxe-detail-value">{formatTime(selectedCalendrier.heure_debut)}</span>
              </div>
              <div className="cal-luxe-detail-item">
                <span className="cal-luxe-detail-label">Date de fin</span>
                <span className="cal-luxe-detail-value">{formatDate(selectedCalendrier.date_fin)}</span>
              </div>
              <div className="cal-luxe-detail-item">
                <span className="cal-luxe-detail-label">Heure de fin</span>
                <span className="cal-luxe-detail-value">{formatTime(selectedCalendrier.heure_fin)}</span>
              </div>
              <div className="cal-luxe-detail-item cal-luxe-duration-item">
                <span className="cal-luxe-detail-label">Durée totale</span>
                <span className="cal-luxe-detail-value cal-luxe-duration-value">
                  {getDuree(selectedCalendrier.heure_debut, selectedCalendrier.heure_fin)}
                </span>
              </div>
            </div>

            <div className="cal-luxe-detail-section">
              <h3 className="cal-luxe-detail-section-title">Informations Système</h3>
              <div className="cal-luxe-detail-item">
                <span className="cal-luxe-detail-label">Créé le</span>
                <span className="cal-luxe-detail-value">
                  {new Date(selectedCalendrier.created_at).toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        )}
      </CalLuxeModal>

      {/* Modal d'édition */}
      <CalLuxeModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Modifier la Réservation"
      >
        <form onSubmit={handleUpdate} className="cal-luxe-form">
          <div className="cal-luxe-form-row">
            <div className="cal-luxe-form-group">
              <label className="cal-luxe-form-label">Nom du terrain *</label>
              <input
                type="text"
                name="nom_terrain"
                value={formData.nom_terrain}
                onChange={handleInputChange}
                placeholder="Ex: Terrain A, Stade Principal..."
                className="cal-luxe-form-input"
                required
              />
            </div>
          </div>

          <div className="cal-luxe-form-row">
            <div className="cal-luxe-form-group">
              <label className="cal-luxe-form-label">Date de début *</label>
              <input
                type="date"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleInputChange}
                className="cal-luxe-form-input"
                required
              />
            </div>
            <div className="cal-luxe-form-group">
              <label className="cal-luxe-form-label">Heure de début</label>
              <input
                type="time"
                name="heure_debut"
                value={formData.heure_debut}
                onChange={handleInputChange}
                className="cal-luxe-form-input"
              />
            </div>
          </div>

          <div className="cal-luxe-form-row">
            <div className="cal-luxe-form-group">
              <label className="cal-luxe-form-label">Date de fin *</label>
              <input
                type="date"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleInputChange}
                className="cal-luxe-form-input"
                required
              />
            </div>
            <div className="cal-luxe-form-group">
              <label className="cal-luxe-form-label">Heure de fin *</label>
              <input
                type="time"
                name="heure_fin"
                value={formData.heure_fin}
                onChange={handleInputChange}
                className="cal-luxe-form-input"
                required
              />
            </div>
          </div>

          <div className="cal-luxe-form-actions">
            <button type="submit" className="cal-luxe-btn cal-luxe-btn-primary cal-luxe-btn-large">
              Mettre à jour
            </button>
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