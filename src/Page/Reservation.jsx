import React, { useState, useEffect } from 'react';
import './ReservationAdmin.css';

const ReservationAdmin = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [toasts, setToasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    datereservation: '',
    heurereservation: '',
    statut: 'en attente',
    idclient: '',
    numeroterrain: '',
    nomclient: '',
    prenom: '',
    email: '',
    telephone: '',
    typeterrain: '',
    tarif: '',
    surface: '',
    heurefin: '',
    nomterrain: ''
  });

  // Ajouter un toast
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts([...toasts, newToast]);
    
    setTimeout(() => {
      setToasts(current => current.filter(toast => toast.id !== id));
    }, 5000);
  };

  // Récupérer les réservations
  const fetchReservations = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('nom', searchTerm);
        params.append('email', searchTerm);
      }
      if (filterStatus) params.append('statut', filterStatus);
      
      const queryString = params.toString();
      const baseUrl = 'https://backend-foot-omega.vercel.app/api/reservation';
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReservations(data.data || []);
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
  }, [searchTerm, filterStatus]);

  // Gérer les changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Ouvrir modal pour création
  const openCreateModal = () => {
    setFormData({
      datereservation: '',
      heurereservation: '',
      statut: 'en attente',
      idclient: '',
      numeroterrain: '',
      nomclient: '',
      prenom: '',
      email: '',
      telephone: '',
      typeterrain: '',
      tarif: '',
      surface: '',
      heurefin: '',
      nomterrain: ''
    });
    setModalMode('create');
    setShowModal(true);
  };

  // Ouvrir modal pour édition
  const openEditModal = (reservation) => {
    setFormData({
      datereservation: reservation.datereservation || '',
      heurereservation: reservation.heurereservation || '',
      heurefin: reservation.heurefin || '',
      statut: reservation.statut || 'en attente',
      idclient: reservation.idclient || '',
      numeroterrain: reservation.numeroterrain || '',
      nomclient: reservation.nomclient || '',
      prenom: reservation.prenom || '',
      email: reservation.email || '',
      telephone: reservation.telephone || '',
      typeterrain: reservation.typeterrain || '',
      tarif: reservation.tarif || '',
      surface: reservation.surface || '',
      nomterrain: reservation.nomterrain || ''
    });
    setEditingReservation(reservation);
    setModalMode('edit');
    setShowModal(true);
  };

  // Fermer modal
  const closeModal = () => {
    setShowModal(false);
    setEditingReservation(null);
  };

  // Soumettre le formulaire (création ou modification)
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
        
        if (data.emailSent) {
          message += ' - Email de confirmation envoyé';
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

  // Supprimer une réservation
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }
    
    try {
      const url = `https://backend-foot-omega.vercel.app/api/reservation/${id}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
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

  // Changer le statut (avec notification d'envoi d'email)
  const handleStatusChange = async (id, newStatus) => {
    try {
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
        if (newStatus === 'confirmée' && data.emailSent) {
          message += ' - Email de confirmation envoyé au client';
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

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <div className="reservation-admin-container">
        <div className="reservation-admin-loading">
          <div className="reservation-admin-loading-spinner"></div>
          <p>Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-admin-container">
      <header className="reservation-admin-header">
        <h1>Administration des Réservations</h1>
        <p>Gérez toutes les réservations de terrains de football</p>
      </header>

      <div className="reservation-admin-controls">
        <div className="reservation-admin-search-filters">
          <div className="reservation-admin-search-box">
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="en attente">En attente</option>
            <option value="confirmée">Confirmée</option>
            <option value="annulée">Annulée</option>
            <option value="terminée">Terminée</option>
          </select>
        </div>
        
        <button className="reservation-admin-btn reservation-admin-btn-primary" onClick={openCreateModal}>
          + Nouvelle Réservation
        </button>
      </div>

      <div className="reservation-admin-grid">
        {reservations.length > 0 ? (
          reservations.map(reservation => (
            <div key={reservation.id} className="reservation-admin-card">
              <div className="reservation-admin-card-header">
                <h3>{reservation.nomterrain} - Terrain {reservation.numeroterrain}</h3>
                <span className={`reservation-admin-status-badge ${reservation.statut}`}>
                  {reservation.statut}
                </span>
              </div>
              
              <div className="reservation-admin-card-body">
                <div className="reservation-admin-details">
                  <p><strong>Date:</strong> <span>{formatDate(reservation.datereservation)}</span></p>
                  <p><strong>Heure:</strong> <span>{reservation.heurereservation} - {reservation.heurefin}</span></p>
                  <p><strong>Client:</strong> <span>{reservation.prenom} {reservation.nomclient}</span></p>
                  <p><strong>Email:</strong> <span>{reservation.email}</span></p>
                  <p><strong>Téléphone:</strong> <span>{reservation.telephone}</span></p>
                  <p><strong>Type:</strong> <span>{reservation.typeterrain || 'Non spécifié'}</span></p>
                  <p><strong>Surface:</strong> <span>{reservation.surface}</span></p>
                  <p><strong>Tarif:</strong> <span>{reservation.tarif} Dh</span></p>
                </div>
                
                <div className="reservation-admin-card-actions">
                  <select 
                    value={reservation.statut} 
                    onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                    className="reservation-admin-status-select"
                  >
                    <option value="en attente">En attente</option>
                    <option value="confirmée">Confirmée</option>
                    <option value="annulée">Annulée</option>
                    <option value="terminée">Terminée</option>
                  </select>
                  
                  <div className="reservation-admin-action-buttons">
                    <button 
                      className="reservation-admin-btn reservation-admin-btn-secondary"
                      onClick={() => openEditModal(reservation)}
                    >
                      Modifier
                    </button>
                    
                    <button 
                      className="reservation-admin-btn reservation-admin-btn-danger"
                      onClick={() => handleDelete(reservation.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="reservation-admin-no-results">
            <p>Aucune réservation trouvée</p>
          </div>
        )}
      </div>

      {/* Modal de création/édition */}
      {showModal && (
        <div className="reservation-admin-modal-overlay">
          <div className="reservation-admin-modal">
            <div className="reservation-admin-modal-header">
              <h2>{modalMode === 'create' ? 'Créer une réservation' : 'Modifier la réservation'}</h2>
              <button className="reservation-admin-close-btn" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="reservation-admin-form">
              <div className="reservation-admin-form-grid">
                <div className="reservation-admin-form-group">
                  <label>Date de réservation</label>
                  <input
                    type="date"
                    name="datereservation"
                    value={formData.datereservation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>Heure de début</label>
                  <input
                    type="time"
                    name="heurereservation"
                    value={formData.heurereservation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>Heure de fin</label>
                  <input
                    type="time"
                    name="heurefin"
                    value={formData.heurefin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>Statut</label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="en attente">En attente</option>
                    <option value="confirmée">Confirmée</option>
                    <option value="annulée">Annulée</option>
                    <option value="terminée">Terminée</option>
                  </select>
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>ID Client</label>
                  <input
                    type="number"
                    name="idclient"
                    value={formData.idclient}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>Numéro de terrain</label>
                  <input
                    type="number"
                    name="numeroterrain"
                    value={formData.numeroterrain}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>Nom du client</label>
                  <input
                    type="text"
                    name="nomclient"
                    value={formData.nomclient}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>Type de terrain</label>
                  <input
                    type="text"
                    name="typeterrain"
                    value={formData.typeterrain}
                    onChange={handleInputChange}
                    placeholder="Ex: Synthétique, Gazon naturel"
                  />
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>Tarif (Dh)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="tarif"
                    value={formData.tarif}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>Surface</label>
                  <input
                    type="text"
                    name="surface"
                    value={formData.surface}
                    onChange={handleInputChange}
                    placeholder="Ex: 100m²"
                  />
                </div>
                
                <div className="reservation-admin-form-group">
                  <label>Nom du terrain</label>
                  <input
                    type="text"
                    name="nomterrain"
                    value={formData.nomterrain}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="reservation-admin-form-actions">
                <button type="button" className="reservation-admin-btn reservation-admin-btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="reservation-admin-btn reservation-admin-btn-primary">
                  {modalMode === 'create' ? 'Créer' : 'Modifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <div className="reservation-admin-toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`reservation-admin-toast ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationAdmin;