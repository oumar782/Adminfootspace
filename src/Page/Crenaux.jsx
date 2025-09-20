import React, { useState, useEffect } from 'react';
import './crenaux.css';

//
// Composant Toast pour les notifications
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">
        {type === 'success' ? '✓' : '✗'}
      </span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

// Composant Modal pour visualiser un créneau
const ViewModal = ({ creneau, onClose }) => {
  if (!creneau) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Détails du créneau</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <label>ID:</label>
              <span>{creneau.idcreneaux}</span>
            </div>
            <div className="detail-item">
              <label>Date:</label>
              <span>{new Date(creneau.datecreneaux).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="detail-item">
              <label>Heure début:</label>
              <span>{creneau.heure}</span>
            </div>
            <div className="detail-item">
              <label>Heure fin:</label>
              <span>{creneau.heurefin || 'Non spécifiée'}</span>
            </div>
            <div className="detail-item">
              <label>Statut:</label>
              <span className={`status-badge status-${creneau.statut}`}>
                {creneau.statut}
              </span>
            </div>
            <div className="detail-item">
              <label>Numéro terrain:</label>
              <span>{creneau.numeroterrain}</span>
            </div>
            <div className="detail-item">
              <label>Type terrain:</label>
              <span>{creneau.typeterrain || 'Non spécifié'}</span>
            </div>
            <div className="detail-item">
              <label>Nom terrain:</label>
              <span>{creneau.nomterrain || 'Non spécifié'}</span>
            </div>
            <div className="detail-item">
              <label>Surface terrain:</label>
              <span>{creneau.surfaceterrains || 'Non spécifiée'}</span>
            </div>
            <div className="detail-item">
              <label>Tarif:</label>
              <span>{creneau.tarif} €</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Modal pour ajouter/modifier un créneau
const CreneauModal = ({ creneau, onClose, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    datecreneaux: creneau?.datecreneaux || '',
    heure: creneau?.heure || '',
    heurefin: creneau?.heurefin || '',
    statut: creneau?.statut || 'disponible',
    numeroterrain: creneau?.numeroterrain || '',
    typeterrain: creneau?.typeterrain || '',
    nomterrain: creneau?.nomterrain || '',
    surfaceterrains: creneau?.surfaceterrains || '',
    tarif: creneau?.tarif || ''
  });

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content compact" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Modifier un créneau' : 'Ajouter un créneau'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="creneau-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="datecreneaux">Date *</label>
                <input
                  type="date"
                  id="datecreneaux"
                  name="datecreneaux"
                  value={formData.datecreneaux}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="heure">Heure début *</label>
                <input
                  type="time"
                  id="heure"
                  name="heure"
                  value={formData.heure}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="heurefin">Heure fin</label>
                <input
                  type="time"
                  id="heurefin"
                  name="heurefin"
                  value={formData.heurefin}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="statut">Statut *</label>
                <select
                  id="statut"
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  required
                >
                  <option value="disponible">Disponible</option>
                  <option value="réservé">Réservé</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="numeroterrain">Numéro terrain *</label>
                <input
                  type="number"
                  id="numeroterrain"
                  name="numeroterrain"
                  value={formData.numeroterrain}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="tarif">Tarif (€) *</label>
                <input
                  type="number"
                  id="tarif"
                  name="tarif"
                  value={formData.tarif}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="typeterrain">Type terrain</label>
                <input
                  type="text"
                  id="typeterrain"
                  name="typeterrain"
                  value={formData.typeterrain}
                  onChange={handleInputChange}
                  placeholder="Football, Tennis..."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nomterrain">Nom terrain</label>
                <input
                  type="text"
                  id="nomterrain"
                  name="nomterrain"
                  value={formData.nomterrain}
                  onChange={handleInputChange}
                  placeholder="Terrain central..."
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="surfaceterrains">Surface terrain</label>
                <input
                  type="text"
                  id="surfaceterrains"
                  name="surfaceterrains"
                  value={formData.surfaceterrains}
                  onChange={handleInputChange}
                  placeholder="100m², Gazon synthétique..."
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Modifier' : 'Ajouter'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Composant principal
const crenau = () => {
  const [creneaux, setCreneaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [viewModal, setViewModal] = useState({ show: false, creneau: null });
  const [creneauModal, setCreneauModal] = useState({ show: false, creneau: null, isEditing: false });
  const [filters, setFilters] = useState({
    date: '',
    statut: '',
    terrain: ''
  });
  const [stats, setStats] = useState(null);

  // Afficher un toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Fermer le toast
  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  // Récupérer tous les créneaux
  const fetchCreneaux = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backend-foot-omega.vercel.app/api/gestioncreneaux/');
      const result = await response.json();
      
      if (result.success) {
        setCreneaux(result.data);
      } else {
        showToast('Erreur lors du chargement des créneaux', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les statistiques
  const fetchStats = async () => {
    try {
      const response = await fetch('https://backend-foot-omega.vercel.app/api/gestioncreneaux/statistiques/overview');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  // Appliquer les filtres
  const fetchFilteredCreneaux = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.statut) queryParams.append('statut', filters.statut);
      if (filters.terrain) queryParams.append('terrain', filters.terrain);
      
      const url = `https://backend-foot-omega.vercel.app/api/gestioncreneaux/filtre/recherche?${queryParams}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setCreneaux(result.data);
        showToast(`${result.count} créneau(x) trouvé(s)`);
      } else {
        showToast('Erreur lors du filtrage', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les créneaux et statistiques au montage du composant
  useEffect(() => {
    fetchCreneaux();
    fetchStats();
  }, []);

  // Gérer les changements dans les filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumettre le formulaire (ajout ou modification)
  const handleSubmit = async (formData) => {
    try {
      const url = creneauModal.isEditing 
        ? `https://backend-foot-omega.vercel.app/api/gestioncreneaux/${creneauModal.creneau.idcreneaux}`
        : 'https://backend-foot-omega.vercel.app/api/gestioncreneaux/';
      
      const method = creneauModal.isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast(creneauModal.isEditing ? 'Créneau modifié avec succès' : 'Créneau ajouté avec succès');
        setCreneauModal({ show: false, creneau: null, isEditing: false });
        fetchCreneaux();
        fetchStats();
      } else {
        showToast(result.message || 'Erreur lors de l\'opération', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    }
  };

  // Modifier un créneau
  const handleEdit = (creneau) => {
    setCreneauModal({ show: true, creneau, isEditing: true });
  };

  // Supprimer un créneau
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) return;
    
    try {
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/gestioncreneaux/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('Créneau supprimé avec succès');
        fetchCreneaux();
        fetchStats();
      } else {
        showToast(result.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    }
  };

  // Visualiser un créneau
  const handleView = (creneau) => {
    setViewModal({ show: true, creneau });
  };

  // Ouvrir le modal pour ajouter un créneau
  const openAddModal = () => {
    setCreneauModal({ show: true, creneau: null, isEditing: false });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Administration des Créneaux</h1>
          <p>Gestion des créneaux horaires des terrains de sport</p>
        </div>
      </header>

      <main className="app-main">
        {/* Cartes de statistiques */}
        {stats && (
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.total_creneaux}</div>
                <div className="stat-label">Total créneaux</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.disponibles}</div>
                <div className="stat-label">Disponibles</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.reserves}</div>
                <div className="stat-label">Réservés</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.maintenance}</div>
                <div className="stat-label">Maintenance</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.terrains_actifs}</div>
                <div className="stat-label">Terrains actifs</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{parseFloat(stats.tarif_moyen).toFixed(2)}€</div>
                <div className="stat-label">Tarif moyen</div>
              </div>
            </div>
          </section>
        )}

        {/* Actions principales */}
        <section className="actions-section">
          <div className="section-header">
            <h2>Gestion des créneaux</h2>
            <button className="btn btn-primary" onClick={openAddModal}>
              Nouveau créneau
            </button>
          </div>
        </section>

        {/* Filtres */}
        <section className="filters-section">
          <h2>Filtres</h2>
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="filter-date">Date</label>
              <input
                type="date"
                id="filter-date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="filter-statut">Statut</label>
              <select
                id="filter-statut"
                name="statut"
                value={filters.statut}
                onChange={handleFilterChange}
              >
                <option value="">Tous</option>
                <option value="disponible">Disponible</option>
                <option value="réservé">Réservé</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="filter-terrain">Numéro terrain</label>
              <input
                type="number"
                id="filter-terrain"
                name="terrain"
                value={filters.terrain}
                onChange={handleFilterChange}
                min="1"
              />
            </div>
            
            <div className="filter-actions">
              <button 
                className="btn btn-primary" 
                onClick={fetchFilteredCreneaux}
              >
                Appliquer
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setFilters({ date: '', statut: '', terrain: '' });
                  fetchCreneaux();
                }}
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </section>

        {/* Tableau des créneaux */}
        <section className="table-section">
          <div className="section-header">
            <h2>Liste des créneaux ({creneaux.length})</h2>
            <button className="btn btn-outline" onClick={fetchCreneaux}>
              Actualiser
            </button>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Chargement des créneaux...</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="creneaux-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Heure début</th>
                    <th>Heure fin</th>
                    <th>Statut</th>
                    <th>Terrain</th>
                    <th>Type</th>
                    <th>Nom</th>
                    <th>Surface</th>
                    <th>Tarif</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creneaux.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="no-data">
                        <div className="no-data-content">
                          <p>Aucun créneau trouvé</p>
                          <button className="btn btn-primary" onClick={openAddModal}>
                            Ajouter un créneau
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    creneaux.map((creneau, index) => (
                      <tr key={creneau.idcreneaux} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                        <td>{creneau.idcreneaux}</td>
                        <td>{new Date(creneau.datecreneaux).toLocaleDateString('fr-FR')}</td>
                        <td>{creneau.heure}</td>
                        <td>{creneau.heurefin || '-'}</td>
                        <td>
                          <span className={`status-badge status-${creneau.statut}`}>
                            {creneau.statut}
                          </span>
                        </td>
                        <td>{creneau.numeroterrain}</td>
                        <td>{creneau.typeterrain || '-'}</td>
                        <td>{creneau.nomterrain || '-'}</td>
                        <td>{creneau.surfaceterrains || '-'}</td>
                        <td>{creneau.tarif} €</td>
                        <td className="actions">
                          <button 
                            className="btn-icon view" 
                            onClick={() => handleView(creneau)}
                            title="Voir"
                          >
                            👁️
                          </button>
                          <button 
                            className="btn-icon edit" 
                            onClick={() => handleEdit(creneau)}
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn-icon delete" 
                            onClick={() => handleDelete(creneau.idcreneaux)}
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Toast de notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}

      {/* Modal de visualisation */}
      {viewModal.show && (
        <ViewModal 
          creneau={viewModal.creneau} 
          onClose={() => setViewModal({ show: false, creneau: null })} 
        />
      )}

      {/* Modal d'ajout/modification */}
      {creneauModal.show && (
        <CreneauModal 
          creneau={creneauModal.creneau}
          onClose={() => setCreneauModal({ show: false, creneau: null, isEditing: false })}
          onSubmit={handleSubmit}
          isEditing={creneauModal.isEditing}
        />
      )}
    </div>
  );
};

export default crenau;