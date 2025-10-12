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

  // États pour le formulaire - mis à jour selon la nouvelle structure
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
        <h1>Gestionnaire de calendrier de reservation </h1>
        <p>Administrez vos calendriers avec élégance</p>
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
                <h3>{calendrier.nom_terrain || 'Sans nom'}</h3>
                <span className="cal-luxe-date-badge">
                  {formatDate(calendrier.date_debut)}
                </span>
              </div>
              <div className="cal-luxe-card-body">
                <div className="cal-luxe-time-info">
                  <div className="cal-luxe-time-slot">
                    <span className="cal-luxe-time-label">Début:</span>
                    <span className="cal-luxe-time-value">{formatTime(calendrier.heure_debut)}</span>
                  </div>
                  <div className="cal-luxe-time-slot">
                    <span className="cal-luxe-time-label">Fin:</span>
                    <span className="cal-luxe-time-value">{formatTime(calendrier.heure_fin)}</span>
                  </div>
                  <div className="cal-luxe-duree">
                    <span className="cal-luxe-duree-label">Durée:</span>
                    <span className="cal-luxe-duree-value">
                      {getDuree(calendrier.heure_debut, calendrier.heure_fin)}
                    </span>
                  </div>
                </div>
                {calendrier.date_debut !== calendrier.date_fin && (
                  <div className="cal-luxe-multi-day">
                    <span className="cal-luxe-multi-day-badge">Multi-jours</span>
                    <span>Jusqu'au {formatDate(calendrier.date_fin)}</span>
                  </div>
                )}
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
        title="Créer un nouveau créneau"
      >
        <form onSubmit={handleSubmit} className="cal-luxe-form">
          <div className="cal-luxe-form-group">
            <label>Date de début *</label>
            <input
              type="date"
              name="date_debut"
              value={formData.date_debut}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="cal-luxe-form-group">
            <label>Heure de début</label>
            <input
              type="time"
              name="heure_debut"
              value={formData.heure_debut}
              onChange={handleInputChange}
            />
          </div>
          <div className="cal-luxe-form-group">
            <label>Date de fin *</label>
            <input
              type="date"
              name="date_fin"
              value={formData.date_fin}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="cal-luxe-form-group">
            <label>Heure de fin *</label>
            <input
              type="time"
              name="heure_fin"
              value={formData.heure_fin}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="cal-luxe-form-group">
            <label>Nom du terrain *</label>
            <input
              type="text"
              name="nom_terrain"
              value={formData.nom_terrain}
              onChange={handleInputChange}
              placeholder="Entrez le nom du terrain"
              required
            />
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
        title="Détails du créneau"
      >
        {selectedCalendrier && (
          <div className="cal-luxe-view-details">
            <div className="cal-luxe-detail-item">
              <span className="cal-luxe-detail-label">Terrain:</span>
              <span className="cal-luxe-detail-value">{selectedCalendrier.nom_terrain || 'Non spécifié'}</span>
            </div>
            <div className="cal-luxe-detail-item">
              <span className="cal-luxe-detail-label">Date de début:</span>
              <span className="cal-luxe-detail-value">{formatDate(selectedCalendrier.date_debut)}</span>
            </div>
            <div className="cal-luxe-detail-item">
              <span className="cal-luxe-detail-label">Heure de début:</span>
              <span className="cal-luxe-detail-value">{formatTime(selectedCalendrier.heure_debut)}</span>
            </div>
            <div className="cal-luxe-detail-item">
              <span className="cal-luxe-detail-label">Date de fin:</span>
              <span className="cal-luxe-detail-value">{formatDate(selectedCalendrier.date_fin)}</span>
            </div>
            <div className="cal-luxe-detail-item">
              <span className="cal-luxe-detail-label">Heure de fin:</span>
              <span className="cal-luxe-detail-value">{formatTime(selectedCalendrier.heure_fin)}</span>
            </div>
            <div className="cal-luxe-detail-item">
              <span className="cal-luxe-detail-label">Durée:</span>
              <span className="cal-luxe-detail-value">
                {getDuree(selectedCalendrier.heure_debut, selectedCalendrier.heure_fin)}
              </span>
            </div>
            <div className="cal-luxe-detail-item">
              <span className="cal-luxe-detail-label">Créé le:</span>
              <span className="cal-luxe-detail-value">
                {new Date(selectedCalendrier.created_at).toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
        )}
      </CalLuxeModal>

      {/* Modal d'édition */}
      <CalLuxeModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Modifier le créneau"
      >
        <form onSubmit={handleUpdate} className="cal-luxe-form">
          <div className="cal-luxe-form-group">
            <label>Date de début *</label>
            <input
              type="date"
              name="date_debut"
              value={formData.date_debut}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="cal-luxe-form-group">
            <label>Heure de début</label>
            <input
              type="time"
              name="heure_debut"
              value={formData.heure_debut}
              onChange={handleInputChange}
            />
          </div>
          <div className="cal-luxe-form-group">
            <label>Date de fin *</label>
            <input
              type="date"
              name="date_fin"
              value={formData.date_fin}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="cal-luxe-form-group">
            <label>Heure de fin *</label>
            <input
              type="time"
              name="heure_fin"
              value={formData.heure_fin}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="cal-luxe-form-group">
            <label>Nom du terrain *</label>
            <input
              type="text"
              name="nom_terrain"
              value={formData.nom_terrain}
              onChange={handleInputChange}
              placeholder="Entrez le nom du terrain"
              required
            />
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