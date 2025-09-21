// ContactsApp.jsx
import React, { useState, useEffect } from 'react';
import './contact.css';

const ContactsApp = () => {
  // États pour la gestion des données
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState([]);

  // États pour le formulaire
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    message: '',
    motif: '',
    sujet: ''
  });

  // Afficher un toast
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts([...toasts, newToast]);
    
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, 3000);
  };

  // Récupérer tous les contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch('https://backend-foot-omega.vercel.app/api/contact/');
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data);
        setFilteredContacts(data.data);
      } else {
        showToast('Erreur lors du chargement des contacts', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    }
  };

  // Filtrer les contacts
  const filterContacts = () => {
    if (!searchTerm) {
      setFilteredContacts(contacts);
      return;
    }
    
    const filtered = contacts.filter(contact => 
      contact.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.motif && contact.motif.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.sujet && contact.sujet.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredContacts(filtered);
  };

  // Créer un contact
  const createContact = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://backend-foot-omega.vercel.app/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast('Contact créé avec succès');
        setIsCreating(false);
        setFormData({ nom: '', email: '', message: '', motif: '', sujet: '' });
        fetchContacts();
      } else {
        showToast(data.message || 'Erreur lors de la création', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    }
  };

  // Mettre à jour un contact
  const updateContact = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/contact/${selectedContact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast('Contact mis à jour avec succès');
        setIsEditing(false);
        setSelectedContact(null);
        setFormData({ nom: '', email: '', message: '', motif: '', sujet: '' });
        fetchContacts();
      } else {
        showToast(data.message || 'Erreur lors de la mise à jour', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    }
  };

  // Supprimer un contact
  const deleteContact = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return;
    
    try {
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/contact/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast('Contact supprimé avec succès');
        fetchContacts();
      } else {
        showToast(data.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    }
  };

  // Initialiser le formulaire d'édition
  const initEditForm = (contact) => {
    setSelectedContact(contact);
    setFormData({
      nom: contact.nom,
      email: contact.email,
      message: contact.message,
      motif: contact.motif || '',
      sujet: contact.sujet || ''
    });
    setIsEditing(true);
  };

  // Initialiser le formulaire de création
  const initCreateForm = () => {
    setFormData({ nom: '', email: '', message: '', motif: '', sujet: '' });
    setIsCreating(true);
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Effets
  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchTerm, contacts]);

  return (
    <div className="luxury-contacts-app">
      {/* Toasts */}
      <div className="luxury-toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`luxury-toast luxury-toast-${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="luxury-header">
        <h1 className="luxury-title">Gestion des Contacts</h1>
        <p className="luxury-subtitle">Interface d'administration premium</p>
      </header>

      {/* Contrôles principaux */}
      <div className="luxury-controls">
        <button 
          className="luxury-btn luxury-btn-primary"
          onClick={initCreateForm}
        >
          <span className="luxury-btn-icon">+</span>
          Nouveau Contact
        </button>
        
        <button 
          className="luxury-btn luxury-btn-secondary"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <span className="luxury-btn-icon">📅</span>
          {showCalendar ? 'Masquer' : 'Afficher'} Calendrier
        </button>
        
        <div className="luxury-search">
          <input
            type="text"
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="luxury-search-input"
          />
          <span className="luxury-search-icon">🔍</span>
        </div>
      </div>

      {/* Calendrier */}
      {showCalendar && (
        <div className="luxury-calendar">
          <h2 className="luxury-calendar-title">Sélection de période</h2>
          <div className="luxury-calendar-controls">
            <div className="luxury-calendar-input-group">
              <label>Date de début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="luxury-calendar-input"
              />
            </div>
            
            <div className="luxury-calendar-input-group">
              <label>Heure de début</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="luxury-calendar-input"
              />
            </div>
            
            <div className="luxury-calendar-input-group">
              <label>Date de fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="luxury-calendar-input"
              />
            </div>
            
            <div className="luxury-calendar-input-group">
              <label>Heure de fin</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="luxury-calendar-input"
              />
            </div>
          </div>
          
          <div className="luxury-calendar-summary">
            <p>Période sélectionnée: {startDate || 'N/A'} {startTime} - {endDate || 'N/A'} {endTime}</p>
          </div>
        </div>
      )}

      {/* Formulaire de création/édition */}
      {(isCreating || isEditing) && (
        <div className="luxury-modal-overlay">
          <div className="luxury-modal">
            <h2 className="luxury-modal-title">
              {isEditing ? 'Modifier le contact' : 'Créer un nouveau contact'}
            </h2>
            
            <form onSubmit={isEditing ? updateContact : createContact} className="luxury-form">
              <div className="luxury-form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="luxury-form-input"
                />
              </div>
              
              <div className="luxury-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="luxury-form-input"
                />
              </div>
              
              <div className="luxury-form-group">
                <label>Motif</label>
                <input
                  type="text"
                  name="motif"
                  value={formData.motif}
                  onChange={handleInputChange}
                  className="luxury-form-input"
                />
              </div>
              
              <div className="luxury-form-group">
                <label>Sujet</label>
                <input
                  type="text"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleInputChange}
                  className="luxury-form-input"
                />
              </div>
              
              <div className="luxury-form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="luxury-form-textarea"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="luxury-form-actions">
                <button type="submit" className="luxury-btn luxury-btn-primary">
                  {isEditing ? 'Mettre à jour' : 'Créer'}
                </button>
                <button 
                  type="button" 
                  className="luxury-btn luxury-btn-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setIsCreating(false);
                    setFormData({ nom: '', email: '', message: '', motif: '', sujet: '' });
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des contacts */}
      <div className="luxury-contacts-container">
        <h2 className="luxury-contacts-title">
          Liste des Contacts ({filteredContacts.length})
        </h2>
        
        {filteredContacts.length === 0 ? (
          <div className="luxury-empty-state">
            <p>Aucun contact trouvé</p>
          </div>
        ) : (
          <div className="luxury-contacts-grid">
            {filteredContacts.map(contact => (
              <div key={contact.id} className="luxury-contact-card">
                <div className="luxury-contact-header">
                  <h3 className="luxury-contact-name">{contact.nom}</h3>
                  <span className="luxury-contact-email">{contact.email}</span>
                </div>
                
                <div className="luxury-contact-details">
                  {contact.motif && (
                    <p className="luxury-contact-detail">
                      <strong>Motif:</strong> {contact.motif}
                    </p>
                  )}
                  
                  {contact.sujet && (
                    <p className="luxury-contact-detail">
                      <strong>Sujet:</strong> {contact.sujet}
                    </p>
                  )}
                  
                  <p className="luxury-contact-message">{contact.message}</p>
                </div>
                
                <div className="luxury-contact-actions">
                  <button 
                    onClick={() => initEditForm(contact)}
                    className="luxury-btn luxury-btn-edit"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => deleteContact(contact.id)}
                    className="luxury-btn luxury-btn-delete"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsApp;