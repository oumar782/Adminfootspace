import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Eye, 
  X, 
  ChevronDown,
  CalendarRange as CalendarRangeIcon, // Renommé pour éviter la confusion
  Filter,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
  Layers,
  CalendarDays,
  Timer,
  Building2,
  Hash,
  Sparkles
} from 'lucide-react';
import './suivical.css';

// Composant Toast avec Lucide
const CalLuxeToast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />
  };

  return (
    <div className={`cal-luxe-toast cal-luxe-toast-${type}`}>
      <div className="cal-luxe-toast-content">
        <span className="cal-luxe-toast-icon">
          {icons[type]}
        </span>
        <span className="cal-luxe-toast-message">{message}</span>
        <button className="cal-luxe-toast-close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Composant Modal avec Lucide
const CalLuxeModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="cal-luxe-modal-overlay" onClick={onClose}>
      <div className="cal-luxe-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cal-luxe-modal-header">
          <h2>{title}</h2>
          <button className="cal-luxe-modal-close" onClick={onClose}>
            <X size={20} />
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
  const [showViewModal, setShowViewModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [viewDateRange, setViewDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const closeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchCalendriers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backend-foot-omega.vercel.app/api/calendriers/');
      const data = await response.json();
      if (data.success) {
        setCalendriers(data.data);
        showToast(`${data.data.length} créneaux chargés`, 'success');
      } else {
        showToast('Erreur lors du chargement', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendriers();
  }, []);

  const viewByDateRange = async () => {
    if (!viewDateRange.startDate || !viewDateRange.endDate) {
      showToast('Sélectionnez une plage de dates', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/calendriers/plage/${viewDateRange.startDate}/${viewDateRange.endDate}`);
      const data = await response.json();
      
      if (data.success) {
        setCalendriers(data.data);
        showToast(`${data.count} créneaux trouvés`, 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Erreur lors de la recherche', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  const getDuree = (debut, fin) => {
    if (!debut || !fin) return '';
    const [h1, m1] = debut.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? `${minutes}` : ''}`;
  };

  const isMultiDay = (dateDebut, dateFin) => {
    return dateDebut !== dateFin;
  };

  return (
    <div className="cal-luxe-app">
      <header className="cal-luxe-app-header">
        <div className="cal-luxe-header-content">
          <div className="cal-luxe-title-wrapper">
            <Sparkles size={32} className="cal-luxe-title-icon" />
            <h1 className="cal-luxe-main-title">Calendrier des Réservations</h1>
          </div>
          <p className="cal-luxe-subtitle">Consultation des créneaux horaires réservés</p>
        </div>
      </header>

      <main className="cal-luxe-app-main">
        <div className="cal-luxe-controls-section">
          <div className="cal-luxe-controls-card">
            <div className="cal-luxe-date-filter">
              <div className="cal-luxe-filter-header">
                <Filter size={18} className="cal-luxe-filter-icon" />
                <h3 className="cal-luxe-filter-title">Filtrer par période</h3>
              </div>
              <div className="cal-luxe-date-inputs">
                <div className="cal-luxe-input-group">
                  <label>Du</label>
                  <div className="cal-luxe-input-wrapper">
                    <Calendar size={16} className="cal-luxe-input-icon" />
                    <input
                      type="date"
                      value={viewDateRange.startDate}
                      onChange={(e) => setViewDateRange(prev => ({...prev, startDate: e.target.value}))}
                      className="cal-luxe-date-input"
                    />
                  </div>
                </div>
                <div className="cal-luxe-input-group">
                  <label>Au</label>
                  <div className="cal-luxe-input-wrapper">
                    <CalendarDays size={16} className="cal-luxe-input-icon" />
                    <input
                      type="date"
                      value={viewDateRange.endDate}
                      onChange={(e) => setViewDateRange(prev => ({...prev, endDate: e.target.value}))}
                      className="cal-luxe-date-input"
                    />
                  </div>
                </div>
                <button 
                  className="cal-luxe-btn cal-luxe-btn-primary" 
                  onClick={viewByDateRange}
                  disabled={loading}
                >
                  {loading ? <Loader2 size={16} className="spin" /> : <CalendarRangeIcon size={16} />}
                  Appliquer
                </button>
                <button 
                  className="cal-luxe-btn cal-luxe-btn-outline" 
                  onClick={fetchCalendriers}
                  disabled={loading}
                >
                  <Layers size={16} />
                  Tout voir
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="cal-luxe-reservations-section">
          <div className="cal-luxe-section-header">
            <h2 className="cal-luxe-section-title">
              Réservations
              <span className="cal-luxe-section-count">{calendriers.length}</span>
            </h2>
          </div>
          
          {loading ? (
            <div className="cal-luxe-loading">
              <Loader2 size={40} className="spin" />
              <p>Chargement des réservations...</p>
            </div>
          ) : (
            <div className="cal-luxe-table-container">
              <table className="cal-luxe-table">
                <thead className="cal-luxe-table-header">
                  <tr>
                    <th>Terrain</th>
                    <th>Date début</th>
                    <th>Date fin</th>
                    <th>Heure début</th>
                    <th>Heure fin</th>
                    <th>Durée</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="cal-luxe-table-body">
                  {calendriers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="cal-luxe-no-data">
                        <div className="cal-luxe-no-data-content">
                          <Info size={48} className="cal-luxe-no-data-icon" />
                          <p>Aucune réservation trouvée</p>
                          <p className="cal-luxe-no-data-subtitle">
                            {viewDateRange.startDate && viewDateRange.endDate 
                              ? `Aucune réservation pour la période sélectionnée`
                              : 'Aucune réservation enregistrée'
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    calendriers.map((calendrier) => (
                      <tr key={calendrier.id} className="cal-luxe-table-row">
                        <td>
                          <div className="cal-luxe-terrain-cell">
                            <Building2 size={16} className="cal-luxe-terrain-icon" />
                            <span className="cal-luxe-terrain-name">
                              {calendrier.nom_terrain || 'Terrain Principal'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="cal-luxe-date-cell">
                            <Calendar size={14} className="cal-luxe-cell-icon" />
                            {formatDate(calendrier.date_debut)}
                          </div>
                        </td>
                        <td>
                          <div className="cal-luxe-date-cell">
                            <CalendarDays size={14} className="cal-luxe-cell-icon" />
                            {formatDate(calendrier.date_fin)}
                          </div>
                        </td>
                        <td>
                          <div className="cal-luxe-time-cell">
                            <Clock size={14} className="cal-luxe-cell-icon" />
                            {formatTime(calendrier.heure_debut)}
                          </div>
                        </td>
                        <td>
                          <div className="cal-luxe-time-cell">
                            <Clock size={14} className="cal-luxe-cell-icon" />
                            {formatTime(calendrier.heure_fin)}
                          </div>
                        </td>
                        <td>
                          <div className="cal-luxe-duration-cell">
                            <Timer size={14} />
                            {getDuree(calendrier.heure_debut, calendrier.heure_fin)}
                          </div>
                        </td>
                        <td>
                          <span className={`cal-luxe-type-badge ${
                            isMultiDay(calendrier.date_debut, calendrier.date_fin) 
                              ? 'cal-luxe-type-multi' 
                              : 'cal-luxe-type-single'
                          }`}>
                            {isMultiDay(calendrier.date_debut, calendrier.date_fin) 
                              ? 'Multi-jours' 
                              : 'Une journée'
                            }
                          </span>
                        </td>
                        <td>
                          <div className="cal-luxe-actions-cell">
                            <button 
                              className="cal-luxe-action-btn"
                              onClick={() => {
                                setSelectedCalendrier(calendrier);
                                setShowViewModal(true);
                              }}
                              title="Voir les détails"
                            >
                              <Eye size={16} />
                              <span>Détails</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal de visualisation */}
      <CalLuxeModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        title="Détails de la Réservation"
      >
        {selectedCalendrier && (
          <div className="cal-luxe-details-view">
            <div className="cal-luxe-detail-section">
              <h3 className="cal-luxe-detail-section-title">
                <Building2 size={18} />
                Informations Terrain
              </h3>
              <div className="cal-luxe-detail-item">
                <span className="cal-luxe-detail-label">Nom du terrain</span>
                <span className="cal-luxe-detail-value">{selectedCalendrier.nom_terrain || 'Non spécifié'}</span>
              </div>
            </div>

            <div className="cal-luxe-detail-section">
              <h3 className="cal-luxe-detail-section-title">
                <CalendarRangeIcon size={18} />
                Période de Réservation
              </h3>
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
                  <Timer size={16} />
                  {getDuree(selectedCalendrier.heure_debut, selectedCalendrier.heure_fin)}
                </span>
              </div>
            </div>

            <div className="cal-luxe-detail-section">
              <h3 className="cal-luxe-detail-section-title">
                <Hash size={18} />
                Informations Système
              </h3>
              <div className="cal-luxe-detail-item">
                <span className="cal-luxe-detail-label">ID Réservation</span>
                <span className="cal-luxe-detail-value">#{selectedCalendrier.id}</span>
              </div>
              <div className="cal-luxe-detail-item">
                <span className="cal-luxe-detail-label">Créé le</span>
                <span className="cal-luxe-detail-value">
                  {new Date(selectedCalendrier.created_at).toLocaleString('fr-FR')}
                </span>
              </div>
              <div className="cal-luxe-detail-item">
                <span className="cal-luxe-detail-label">Dernière modification</span>
                <span className="cal-luxe-detail-value">
                  {new Date(selectedCalendrier.updated_at).toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        )}
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