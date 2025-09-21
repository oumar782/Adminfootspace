// App.jsx
import React, { useState, useEffect } from 'react';
import './user.css';

const UserManagement = () => {
  // États pour la gestion des utilisateurs
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  
  // États pour les formulaires
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    typeuser: 'utilisateur',
    mdp: ''
  });
  
  // États pour les toasts/notifications
  const [toasts, setToasts] = useState([]);

  // URL de base de l'API
  const API_URL = 'https://backend-foot-omega.vercel.app/api/user';

  // Fonction pour ajouter un toast
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Supprimer le toast après 5 secondes
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  // Charger tous les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        addToast('Erreur lors du chargement des utilisateurs', 'error');
      }
    } catch (error) {
      addToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    }
  };

  // Charger les statistiques
  const [stats, setStats] = useState({});
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats/all`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  // Effet pour charger les données au montage du composant
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // Gérer les changements dans les formulaires
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Créer un nouvel utilisateur
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        addToast('Utilisateur créé avec succès');
        setIsCreating(false);
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          typeuser: 'utilisateur',
          mdp: ''
        });
        fetchUsers();
        fetchStats();
      } else {
        addToast(data.message || 'Erreur lors de la création', 'error');
      }
    } catch (error) {
      addToast('Erreur de connexion', 'error');
      console.error('Erreur:', error);
    }
  };

  // Mettre à jour un utilisateur
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/${selectedUser.iduser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        addToast('Utilisateur modifié avec succès');
        setIsEditing(false);
        setSelectedUser(null);
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          typeuser: 'utilisateur',
          mdp: ''
        });
        fetchUsers();
      } else {
        addToast(data.message || 'Erreur lors de la modification', 'error');
      }
    } catch (error) {
      addToast('Erreur de connexion', 'error');
      console.error('Erreur:', error);
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        addToast('Utilisateur supprimé avec succès');
        fetchUsers();
        fetchStats();
      } else {
        addToast(data.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      addToast('Erreur de connexion', 'error');
      console.error('Erreur:', error);
    }
  };

  // Pré-remplir le formulaire d'édition
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      typeuser: user.typeuser,
      mdp: '' // On ne remplit pas le mot de passe pour des raisons de sécurité
    });
    setIsEditing(true);
  };

  // Afficher les détails d'un utilisateur
  const handleViewClick = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
  };

  // Fermer les modales
  const handleCloseModal = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedUser(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      typeuser: 'utilisateur',
      mdp: ''
    });
  };

  // Gérer l'affichage du calendrier
  const handleCalendarSubmit = (e) => {
    e.preventDefault();
    addToast(`Calendrier configuré du ${startDate} ${startTime} au ${endDate} ${endTime}`);
    setShowCalendar(false);
  };

  return (
    <div className="user-management-luxe">
      {/* Toasts/Notifications */}
      <div className="luxe-toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`luxe-toast luxe-toast-${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
      
      {/* En-tête */}
      <header className="luxe-header">
        <h1 className="luxe-title">Gestion des Utilisateurs</h1>
        <div className="luxe-actions">
          <button 
            className="luxe-btn luxe-btn-primary"
            onClick={() => setIsCreating(true)}
          >
            Créer un Utilisateur
          </button>
          <button 
            className="luxe-btn luxe-btn-secondary"
            onClick={() => setShowCalendar(true)}
          >
            Voir le Calendrier
          </button>
        </div>
      </header>
      
      {/* Statistiques */}
      <div className="luxe-stats">
        <div className="luxe-stat-card">
          <h3>Total Utilisateurs</h3>
          <p className="luxe-stat-number">{stats.total || 0}</p>
        </div>
        <div className="luxe-stat-card">
          <h3>Gestionnaires</h3>
          <p className="luxe-stat-number">{stats.gestionnaires || 0}</p>
        </div>
        <div className="luxe-stat-card">
          <h3>Administrateurs</h3>
          <p className="luxe-stat-number">{stats.administrateurs || 0}</p>
        </div>
        <div className="luxe-stat-card">
          <h3>Autres</h3>
          <p className="luxe-stat-number">{stats.autres || 0}</p>
        </div>
      </div>
      
      {/* Tableau des utilisateurs */}
      <div className="luxe-table-container">
        <table className="luxe-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.iduser}>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>{user.email}</td>
                <td>{user.telephone}</td>
                <td>
                  <span className={`luxe-badge luxe-badge-${user.typeuser}`}>
                    {user.typeuser}
                  </span>
                </td>
                <td>
                  <div className="luxe-action-buttons">
                    <button 
                      className="luxe-btn luxe-btn-view"
                      onClick={() => handleViewClick(user)}
                    >
                      Voir
                    </button>
                    <button 
                      className="luxe-btn luxe-btn-edit"
                      onClick={() => handleEditClick(user)}
                    >
                      Modifier
                    </button>
                    <button 
                      className="luxe-btn luxe-btn-delete"
                      onClick={() => handleDeleteUser(user.iduser)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modale de création */}
      {isCreating && (
        <div className="luxe-modal-overlay">
          <div className="luxe-modal">
            <div className="luxe-modal-header">
              <h2>Créer un Utilisateur</h2>
              <button className="luxe-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleCreateUser} className="luxe-form">
              <div className="luxe-form-group">
                <label>Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="luxe-form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="luxe-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="luxe-form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="luxe-form-group">
                <label>Type d'utilisateur</label>
                <select
                  name="typeuser"
                  value={formData.typeuser}
                  onChange={handleInputChange}
                  required
                >
                  <option value="utilisateur">Utilisateur</option>
                  <option value="gestionnaire">Gestionnaire</option>
                  <option value="administrateur">Administrateur</option>
                </select>
              </div>
              <div className="luxe-form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  name="mdp"
                  value={formData.mdp}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="luxe-form-actions">
                <button type="button" className="luxe-btn luxe-btn-cancel" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" className="luxe-btn luxe-btn-confirm">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modale d'édition */}
      {isEditing && selectedUser && (
        <div className="luxe-modal-overlay">
          <div className="luxe-modal">
            <div className="luxe-modal-header">
              <h2>Modifier l'Utilisateur</h2>
              <button className="luxe-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleUpdateUser} className="luxe-form">
              <div className="luxe-form-group">
                <label>Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="luxe-form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="luxe-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="luxe-form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="luxe-form-group">
                <label>Type d'utilisateur</label>
                <select
                  name="typeuser"
                  value={formData.typeuser}
                  onChange={handleInputChange}
                  required
                >
                  <option value="utilisateur">Utilisateur</option>
                  <option value="gestionnaire">Gestionnaire</option>
                  <option value="administrateur">Administrateur</option>
                </select>
              </div>
              <div className="luxe-form-group">
                <label>Nouveau mot de passe (laisser vide pour ne pas changer)</label>
                <input
                  type="password"
                  name="mdp"
                  value={formData.mdp}
                  onChange={handleInputChange}
                />
              </div>
              <div className="luxe-form-actions">
                <button type="button" className="luxe-btn luxe-btn-cancel" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" className="luxe-btn luxe-btn-confirm">
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modale de visualisation */}
      {selectedUser && !isEditing && !isCreating && (
        <div className="luxe-modal-overlay">
          <div className="luxe-modal">
            <div className="luxe-modal-header">
              <h2>Détails de l'Utilisateur</h2>
              <button className="luxe-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="luxe-user-details">
              <div className="luxe-detail-row">
                <span className="luxe-detail-label">Nom:</span>
                <span className="luxe-detail-value">{selectedUser.nom}</span>
              </div>
              <div className="luxe-detail-row">
                <span className="luxe-detail-label">Prénom:</span>
                <span className="luxe-detail-value">{selectedUser.prenom}</span>
              </div>
              <div className="luxe-detail-row">
                <span className="luxe-detail-label">Email:</span>
                <span className="luxe-detail-value">{selectedUser.email}</span>
              </div>
              <div className="luxe-detail-row">
                <span className="luxe-detail-label">Téléphone:</span>
                <span className="luxe-detail-value">{selectedUser.telephone}</span>
              </div>
              <div className="luxe-detail-row">
                <span className="luxe-detail-label">Type:</span>
                <span className={`luxe-badge luxe-badge-${selectedUser.typeuser}`}>
                  {selectedUser.typeuser}
                </span>
              </div>
            </div>
            <div className="luxe-form-actions">
              <button className="luxe-btn luxe-btn-primary" onClick={handleCloseModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modale du calendrier */}
      {showCalendar && (
        <div className="luxe-modal-overlay">
          <div className="luxe-modal">
            <div className="luxe-modal-header">
              <h2>Configuration du Calendrier</h2>
              <button className="luxe-modal-close" onClick={() => setShowCalendar(false)}>×</button>
            </div>
            <form onSubmit={handleCalendarSubmit} className="luxe-form">
              <div className="luxe-form-group">
                <label>Date de début</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="luxe-form-group">
                <label>Heure de début</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="luxe-form-group">
                <label>Date de fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <div className="luxe-form-group">
                <label>Heure de fin</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
              <div className="luxe-form-actions">
                <button type="button" className="luxe-btn luxe-btn-cancel" onClick={() => setShowCalendar(false)}>
                  Annuler
                </button>
                <button type="submit" className="luxe-btn luxe-btn-confirm">
                  Visualiser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;