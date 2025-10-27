import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  MapPin, 
  Ruler,
  DollarSign,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  MessageCircle
} from 'lucide-react';
import './ReservationAdmin.css';

const ReservationDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [toasts, setToasts] = useState([]);
  
  // États des filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });
  const [filterPriceRange, setFilterPriceRange] = useState({ min: '', max: '' });
  const [filterSurface, setFilterSurface] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [formData, setFormData] = useState({
    datereservation: '',
    heurereservation: '',
    statut: 'en attente',
    nomclient: '',
    prenom: '',
    email: '',
    telephone: '',
    typeterrain: '',
    tarif: '',
    surface: '',
    heurefin: ''
  });

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts([...toasts, newToast]);
    
    setTimeout(() => {
      setToasts(current => current.filter(toast => toast.id !== id));
    }, 5000);
  };

  // Récupérer toutes les réservations
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backend-foot-omega.vercel.app/api/reservation');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const reservationsData = data.data || [];
        setAllReservations(reservationsData);
        setReservations(reservationsData);
      } else {
        addToast('Erreur lors du chargement des réservations', 'error');
      }
    } catch (error) {
      addToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Mémoization des données dérivées
  const uniqueSurfaces = useMemo(() => {
    return [...new Set(allReservations.map(r => r.surface).filter(Boolean))];
  }, [allReservations]);

  // Fonction de filtrage optimisée
  const filterReservations = useCallback(() => {
    let filtered = [...allReservations];

    // Filtre de recherche texte (nom, email, téléphone)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(reservation => 
        reservation.nomclient?.toLowerCase().includes(term) ||
        reservation.prenom?.toLowerCase().includes(term) ||
        reservation.email?.toLowerCase().includes(term) ||
        reservation.telephone?.includes(term)
      );
    }

    // Filtre par statut
    if (filterStatus) {
      filtered = filtered.filter(reservation => reservation.statut === filterStatus);
    }

    // Filtre par date spécifique
    if (filterDate) {
      filtered = filtered.filter(reservation => reservation.datereservation === filterDate);
    }

    // Filtre par plage de dates
    if (filterDateRange.start && filterDateRange.end) {
      filtered = filtered.filter(reservation => {
        const resDate = new Date(reservation.datereservation);
        const startDate = new Date(filterDateRange.start);
        const endDate = new Date(filterDateRange.end);
        return resDate >= startDate && resDate <= endDate;
      });
    }

    // Filtre par plage de prix
    if (filterPriceRange.min || filterPriceRange.max) {
      filtered = filtered.filter(reservation => {
        const price = parseFloat(reservation.tarif) || 0;
        const min = filterPriceRange.min ? parseFloat(filterPriceRange.min) : 0;
        const max = filterPriceRange.max ? parseFloat(filterPriceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Filtre par surface
    if (filterSurface) {
      filtered = filtered.filter(reservation => reservation.surface === filterSurface);
    }

    // Tri des résultats
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.datereservation);
          bValue = new Date(b.datereservation);
          break;
        case 'prix':
          aValue = parseFloat(a.tarif) || 0;
          bValue = parseFloat(b.tarif) || 0;
          break;
        case 'nom':
          aValue = `${a.prenom} ${a.nomclient}`.toLowerCase();
          bValue = `${b.prenom} ${b.nomclient}`.toLowerCase();
          break;
        default:
          aValue = new Date(a.datereservation);
          bValue = new Date(b.datereservation);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    allReservations, 
    searchTerm, 
    filterStatus, 
    filterDate, 
    filterDateRange, 
    filterPriceRange, 
    filterSurface, 
    sortBy, 
    sortOrder
  ]);

  // Application des filtres avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = filterReservations();
      setReservations(filtered);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [filterReservations]);

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterDate('');
    setFilterDateRange({ start: '', end: '' });
    setFilterPriceRange({ min: '', max: '' });
    setFilterSurface('');
    setSortBy('date');
    setSortOrder('desc');
  };

  // Fonction pour envoyer un message WhatsApp
  const sendWhatsAppMessage = (reservation) => {
    const phoneNumber = reservation.telephone.replace(/\D/g, '');
    const message = `Bonjour ${reservation.prenom} ${reservation.nomclient},\n\nVotre réservation a été confirmée!\n\n📅 Date: ${formatDate(reservation.datereservation)}\n⏰ Heure: ${reservation.heurereservation} - ${reservation.heurefin}\n🏟️ Type: ${reservation.typeterrain}\n💵 Prix: ${reservation.tarif} Dh\n\nMerci pour votre confiance!`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openCreateModal = () => {
    setFormData({
      datereservation: '',
      heurereservation: '',
      statut: 'en attente',
      nomclient: '',
      prenom: '',
      email: '',
      telephone: '',
      typeterrain: '',
      tarif: '',
      surface: '',
      heurefin: ''
    });
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (reservation) => {
    setFormData({
      datereservation: reservation.datereservation || '',
      heurereservation: reservation.heurereservation || '',
      heurefin: reservation.heurefin || '',
      statut: reservation.statut || 'en attente',
      nomclient: reservation.nomclient || '',
      prenom: reservation.prenom || '',
      email: reservation.email || '',
      telephone: reservation.telephone || '',
      typeterrain: reservation.typeterrain || '',
      tarif: reservation.tarif || '',
      surface: reservation.surface || ''
    });
    setEditingReservation(reservation);
    setModalMode('edit');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReservation(null);
  };

  const updateCreneauStatus = async (nomterrain, datereservation, heurereservation, newStatus) => {
    try {
      const creneauxResponse = await fetch('https://backend-foot-omega.vercel.app/api/gestioncreneaux/');
      const creneauxData = await creneauxResponse.json();
      
      if (creneauxData.success) {
        const creneau = creneauxData.data.find(c => 
          c.nomterrain === nomterrain && 
          c.datecreneaux === datereservation && 
          c.heure === heurereservation
        );
        
        if (creneau) {
          const updateResponse = await fetch(`https://backend-foot-omega.vercel.app/api/gestioncreneaux/${creneau.idcreneaux}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...creneau,
              statut: newStatus
            })
          });
          
          const updateData = await updateResponse.json();
          return updateData.success;
        }
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du créneau:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const baseUrl = 'https://backend-foot-omega.vercel.app/api/reservation';
      const url = modalMode === 'create' 
        ? baseUrl
        : `${baseUrl}/${editingReservation.id}`;
      
      const method = modalMode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        let message = modalMode === 'create' 
          ? 'Réservation créée avec succès' 
          : 'Réservation modifiée avec succès';
        
        if (formData.statut === 'confirmée') {
          const creneauUpdated = await updateCreneauStatus(
            formData.typeterrain,
            formData.datereservation,
            formData.heurereservation,
            'réservé'
          );
          if (creneauUpdated) {
            message += ' - Créneau marqué comme réservé';
          }
        }
        
        addToast(message, 'success');
        closeModal();
        fetchReservations();
      } else {
        addToast(data.message || 'Erreur lors de l\'opération', 'error');
      }
    } catch (error) {
      addToast('Erreur de connexion', 'error');
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }
    
    try {
      const reservation = reservations.find(r => r.id === id);
      
      const url = `https://backend-foot-omega.vercel.app/api/reservation/${id}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (reservation && reservation.statut === 'confirmée') {
          await updateCreneauStatus(
            reservation.typeterrain,
            reservation.datereservation,
            reservation.heurereservation,
            'disponible'
          );
        }
        
        addToast('Réservation supprimée avec succès', 'success');
        fetchReservations();
      } else {
        addToast(data.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      addToast('Erreur de connexion', 'error');
      console.error('Erreur:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const reservation = reservations.find(r => r.id === id);
      
      const url = `https://backend-foot-omega.vercel.app/api/reservation/${id}/statut`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: newStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        let message = 'Statut modifié avec succès';
        
        if (reservation) {
          if (newStatus === 'confirmée') {
            const creneauUpdated = await updateCreneauStatus(
              reservation.typeterrain,
              reservation.datereservation,
              reservation.heurereservation,
              'réservé'
            );
            if (creneauUpdated) {
              message += ' - Créneau marqué comme réservé';
            }
            
            // Envoyer message WhatsApp
            sendWhatsAppMessage(reservation);
            message += ' - Message WhatsApp envoyé';
            
          } else if (newStatus === 'annulée' && reservation.statut === 'confirmée') {
            const creneauUpdated = await updateCreneauStatus(
              reservation.typeterrain,
              reservation.datereservation,
              reservation.heurereservation,
              'disponible'
            );
            if (creneauUpdated) {
              message += ' - Créneau remis disponible';
            }
          }
        }
        
        addToast(message, 'success');
        fetchReservations();
      } else {
        addToast(data.message || 'Erreur lors du changement de statut', 'error');
      }
    } catch (error) {
      addToast('Erreur de connexion', 'error');
      console.error('Erreur:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <div className="rd-container">
        <div className="rd-loading">
          <div className="rd-spinner"></div>
          <p>Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rd-container">
      <header className="rd-header">
        <div className="rd-header-content">
          <h1 className="rd-title">Gestion des Réservations</h1>
          <p className="rd-subtitle">Administrez et suivez toutes vos réservations</p>
        </div>
      </header>

      {/* Panneau de filtres avancés */}
      <div className="rd-filters-panel">
        <div className="rd-filters-main">
          <div className="rd-search-wrapper">
            <Search className="rd-search-icon" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, email, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rd-search-input"
            />
          </div>
          
          <div className="rd-filter-group">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rd-filter-select"
            >
              <option value="">Tous les statuts</option>
              <option value="en attente">En attente</option>
              <option value="confirmée">Confirmée</option>
              <option value="annulée">Annulée</option>
              <option value="terminée">Terminée</option>
            </select>
          </div>

          <div className="rd-filter-group">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="rd-filter-select"
            >
              <option value="date">Trier par date</option>
              <option value="prix">Trier par prix</option>
              <option value="nom">Trier par nom</option>
            </select>
          </div>

          <div className="rd-filter-group">
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="rd-filter-select"
            >
              <option value="desc">Décroissant</option>
              <option value="asc">Croissant</option>
            </select>
          </div>

          <button 
            className="rd-btn rd-btn-secondary rd-btn-filter"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter size={16} />
            {showAdvancedFilters ? 'Masquer' : 'Afficher'} Filtres
          </button>

          {(searchTerm || filterStatus || filterDate || filterDateRange.start || filterPriceRange.min || filterSurface) && (
            <button 
              className="rd-btn rd-btn-danger"
              onClick={resetFilters}
            >
              <X size={16} />
              Réinitialiser
            </button>
          )}
        </div>

        {/* Filtres avancés */}
        {showAdvancedFilters && (
          <div className="rd-advanced-filters">
            <div className="rd-filter-group">
              <label className="rd-filter-label">
                <Calendar size={16} />
                Date spécifique
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="rd-filter-input"
              />
            </div>

            <div className="rd-filter-group">
              <label className="rd-filter-label">
                <Calendar size={16} />
                Plage de dates
              </label>
              <div className="rd-date-range">
                <input
                  type="date"
                  placeholder="Début"
                  value={filterDateRange.start}
                  onChange={(e) => setFilterDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="rd-filter-input"
                />
                <span className="rd-range-separator">à</span>
                <input
                  type="date"
                  placeholder="Fin"
                  value={filterDateRange.end}
                  onChange={(e) => setFilterDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="rd-filter-input"
                />
              </div>
            </div>

            <div className="rd-filter-group">
              <label className="rd-filter-label">
                <DollarSign size={16} />
                Plage de prix (Dh)
              </label>
              <div className="rd-price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={filterPriceRange.min}
                  onChange={(e) => setFilterPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="rd-filter-input"
                />
                <span className="rd-range-separator">à</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filterPriceRange.max}
                  onChange={(e) => setFilterPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="rd-filter-input"
                />
              </div>
            </div>

            <div className="rd-filter-group">
              <label className="rd-filter-label">
                <Ruler size={16} />
                Surface
              </label>
              <select 
                value={filterSurface} 
                onChange={(e) => setFilterSurface(e.target.value)}
                className="rd-filter-select"
              >
                <option value="">Toutes les surfaces</option>
                {uniqueSurfaces.map(surface => (
                  <option key={surface} value={surface}>{surface}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="rd-controls-panel">
        <button className="rd-btn rd-btn-primary" onClick={openCreateModal}>
          <Plus size={20} />
          Nouvelle Réservation
        </button>
        
        <div className="rd-results-count">
          {reservations.length} réservation{reservations.length > 1 ? 's' : ''} trouvée{reservations.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="rd-grid-layout">
        {reservations.length > 0 ? (
          reservations.map(reservation => (
            <div key={reservation.id} className="rd-card">
              <div className="rd-card-header">
                <div className="rd-card-title-section">
                  <h3 className="rd-card-title">
                    <MapPin size={18} className="rd-card-title-icon" />
                    {reservation.typeterrain || 'Terrain Football'}
                  </h3>
                  <div className="rd-card-subtitle">
                    Réservation #{reservation.id}
                  </div>
                </div>
                <span className={`rd-status rd-status-${reservation.statut.replace(' ', '-')}`}>
                  {reservation.statut}
                </span>
              </div>
              
              <div className="rd-card-content">
                <div className="rd-info-grid">
                  <div className="rd-info-item">
                    <div className="rd-info-icon-wrapper">
                      <Calendar size={16} className="rd-info-icon" />
                    </div>
                    <div className="rd-info-content">
                      <span className="rd-info-label">Date</span>
                      <span className="rd-info-value">{formatDate(reservation.datereservation)}</span>
                    </div>
                  </div>
                  
                  <div className="rd-info-item">
                    <div className="rd-info-icon-wrapper">
                      <Clock size={16} className="rd-info-icon" />
                    </div>
                    <div className="rd-info-content">
                      <span className="rd-info-label">Heure</span>
                      <span className="rd-info-value">{reservation.heurereservation} - {reservation.heurefin}</span>
                    </div>
                  </div>
                  
                  <div className="rd-info-item">
                    <div className="rd-info-icon-wrapper">
                      <User size={16} className="rd-info-icon" />
                    </div>
                    <div className="rd-info-content">
                      <span className="rd-info-label">Client</span>
                      <span className="rd-info-value">{reservation.prenom} {reservation.nomclient}</span>
                    </div>
                  </div>
                  
                  <div className="rd-info-item">
                    <div className="rd-info-icon-wrapper">
                      <div className="rd-contact-icons">
                        <Mail size={14} />
                        <Phone size={14} />
                      </div>
                    </div>
                    <div className="rd-info-content">
                      <span className="rd-info-label">Contact</span>
                      <span className="rd-info-value">
                        <div>{reservation.email}</div>
                        <div>{reservation.telephone}</div>
                      </span>
                    </div>
                  </div>
                  
                  <div className="rd-info-item">
                    <div className="rd-info-icon-wrapper">
                      <Ruler size={16} className="rd-info-icon" />
                    </div>
                    <div className="rd-info-content">
                      <span className="rd-info-label">Surface</span>
                      <span className="rd-info-value">{reservation.surface}</span>
                    </div>
                  </div>
                  
                  <div className="rd-info-item rd-info-highlight">
                    <div className="rd-info-icon-wrapper">
                      <DollarSign size={16} className="rd-info-icon" />
                    </div>
                    <div className="rd-info-content">
                      <span className="rd-info-label">Tarif</span>
                      <span className="rd-info-value">{reservation.tarif} Dh</span>
                    </div>
                  </div>
                </div>
                
                <div className="rd-actions-panel">
                  <div className="rd-status-control">
                    <label className="rd-status-label">Statut:</label>
                    <select 
                      value={reservation.statut} 
                      onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                      className="rd-status-select"
                    >
                      <option value="en attente">En attente</option>
                      <option value="confirmée">Confirmée</option>
                      <option value="annulée">Annulée</option>
                      <option value="terminée">Terminée</option>
                    </select>
                  </div>
                  
                  <div className="rd-action-buttons">
                    <button 
                      className="rd-btn rd-btn-secondary rd-btn-sm rd-btn-edit"
                      onClick={() => openEditModal(reservation)}
                    >
                      <Edit size={16} />
                      Modifier
                    </button>
                    
                    <button 
                      className="rd-btn rd-btn-danger rd-btn-sm rd-btn-delete"
                      onClick={() => handleDelete(reservation.id)}
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>

                    {reservation.statut === 'confirmée' && (
                      <button 
                        className="rd-btn rd-btn-whatsapp rd-btn-sm rd-btn-whatsapp"
                        onClick={() => sendWhatsAppMessage(reservation)}
                        title="Envoyer un message WhatsApp"
                      >
                        <MessageCircle size={16} />
                        WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rd-empty-state">
            <div className="rd-empty-icon">
              <Search size={48} />
            </div>
            <h3 className="rd-empty-title">Aucune réservation trouvée</h3>
            <p className="rd-empty-description">
              Aucune réservation ne correspond à vos critères de recherche.
              {allReservations.length > 0 && (
                <button 
                  className="rd-btn rd-btn-secondary rd-btn-sm"
                  onClick={resetFilters}
                  style={{ marginLeft: '10px' }}
                >
                  Réinitialiser les filtres
                </button>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="rd-modal-overlay">
          <div className="rd-modal">
            <div className="rd-modal-header">
              <h2 className="rd-modal-title">
                {modalMode === 'create' ? 'Créer une réservation' : 'Modifier la réservation'}
              </h2>
              <button className="rd-modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="rd-form">
              <div className="rd-form-grid">
                <div className="rd-form-group">
                  <label className="rd-form-label">
                    <Calendar size={18} className="rd-form-label-icon" />
                    Date de réservation
                  </label>
                  <input
                    type="date"
                    name="datereservation"
                    value={formData.datereservation}
                    onChange={handleInputChange}
                    className="rd-form-input"
                    required
                  />
                </div>
                
                <div className="rd-form-group">
                  <label className="rd-form-label">
                    <Clock size={18} className="rd-form-label-icon" />
                    Heure de début
                  </label>
                  <input
                    type="time"
                    name="heurereservation"
                    value={formData.heurereservation}
                    onChange={handleInputChange}
                    className="rd-form-input"
                    required
                  />
                </div>
                
                <div className="rd-form-group">
                  <label className="rd-form-label">
                    <Clock size={18} className="rd-form-label-icon" />
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    name="heurefin"
                    value={formData.heurefin}
                    onChange={handleInputChange}
                    className="rd-form-input"
                    required
                  />
                </div>
                
                <div className="rd-form-group">
                  <label className="rd-form-label">
                    <Info size={18} className="rd-form-label-icon" />
                    Statut
                  </label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleInputChange}
                    className="rd-form-select"
                    required
                  >
                    <option value="en attente">En attente</option>
                    <option value="confirmée">Confirmée</option>
                    <option value="annulée">Annulée</option>
                    <option value="terminée">Terminée</option>
                  </select>
                </div>
                
                <div className="rd-form-group">
                  <label className="rd-form-label">
                    <User size={18} className="rd-form-label-icon" />
                    Nom du client
                  </label>
                  <input
                    type="text"
                    name="nomclient"
                    value={formData.nomclient}
                    onChange={handleInputChange}
                    className="rd-form-input"
                    required
                  />
                </div>
                
                <div className="rd-form-group">
                  <label className="rd-form-label">
                    <User size={18} className="rd-form-label-icon" />
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="rd-form-input"
                    required
                  />
                </div>
                
                <div className="rd-form-group">
                  <label className="rd-form-label">
                    <Mail size={18} className="rd-form-label-icon" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rd-form-input"
                    required
                  />
                </div>
                
                <div className="rd-form-group">
                  <label className="rd-form-label">
                    <Phone size={18} className="rd-form-label-icon" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="rd-form-input"
                    required
                  />
                </div>
                
                <div className="rd-form-group">
                  <label className="rd-form-label">
                    <MapPin size={18} className="rd-form-label-icon" />
                    Type de terrain
                  </label>
                  <input
                    type="text"
                    name="typeterrain"
                    value={formData.typeterrain}
                    onChange={handleInputChange}
                    className="rd-form-input"
                    placeholder="Synthétique, Gazon naturel..."
                  />
                </div>
                
                <div className="rd-form-group">
                  <label className="rd-form-label">
                    <DollarSign size={18} className="rd-form-label-icon" />
                    Tarif (Dh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="tarif"
                    value={formData.tarif}
                    onChange={handleInputChange}
                    className="rd-form-input"
                  />
                </div>
                
                <div className="rd-form-group">
                  <label className="rd-form-label">
                    <Ruler size={18} className="rd-form-label-icon" />
                    Surface
                  </label>
                  <input
                    type="text"
                    name="surface"
                    value={formData.surface}
                    onChange={handleInputChange}
                    className="rd-form-input"
                    placeholder="Ex: 100m²"
                  />
                </div>
              </div>
              
              <div className="rd-form-actions">
                <button type="button" className="rd-btn rd-btn-secondary" onClick={closeModal}>
                  <X size={16} />
                  Annuler
                </button>
                <button type="submit" className="rd-btn rd-btn-primary">
                  <CheckCircle size={16} />
                  {modalMode === 'create' ? 'Créer la réservation' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rd-toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`rd-toast rd-toast-${toast.type}`}>
            <div className="rd-toast-content">
              {toast.type === 'success' && <CheckCircle size={20} className="rd-toast-icon" />}
              {toast.type === 'error' && <AlertCircle size={20} className="rd-toast-icon" />}
              {toast.type === 'info' && <Info size={20} className="rd-toast-icon" />}
              <span className="rd-toast-message">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationDashboard;