import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Home, DollarSign, 
  Search, Filter, Plus, Edit, Trash2, Eye,
  RefreshCw, X, CheckCircle, AlertCircle, Info,
  Trophy, Users, Target, Zap, 
  Activity, Save,
  AlertTriangle, Building,
  Star, Crown, Award, TrendingUp,
  ChevronDown, ChevronUp, Timer, 
  Navigation,
  Grid, List, BarChart,
  TrendingDown, Minus, UserCheck,
  UserX, ThumbsUp, ThumbsDown, Loader2
} from 'lucide-react';
import './crenaux.css';

// Configuration des sports avec leurs surfaces
const sportConfigs = {
  'football': { label: '⚽ Football', surfaces: ['7X7', '9X9', '11X11'] },
  'tennis': { label: '🎾 Tennis', surfaces: ['Simple', 'Double'] },
  'basketball': { label: '🏀 Basketball', surfaces: ['3X3', '5X5'] },
  'volleyball': { label: '🏐 Volleyball', surfaces: ['4X4', '6X6'] },
  'handball': { label: '🤾 Handball', surfaces: ['7X7'] },
  'rugby': { label: '🏉 Rugby', surfaces: ['7X7', '15X15'] },
  'padel': { label: '🎾 Padel', surfaces: ['Double'] },
  'badminton': { label: '🏸 Badminton', surfaces: ['Simple', 'Double'] },
  'pingpong': { label: '🏓 Ping-Pong', surfaces: ['Simple', 'Double'] },
  'futsal': { label: '⚽ Futsal', surfaces: ['5X5'] },
  'beachvolley': { label: '🏐 Beach Volley', surfaces: ['4X4'] },
  'boxe': { label: '🥊 Boxe', surfaces: ['Ring'] },
  'musculation': { label: '💪 Musculation', surfaces: ['Salle'] },
  'yoga': { label: '🧘 Yoga', surfaces: ['Studio', 'Salle'] },
  'danse': { label: '💃 Danse', surfaces: ['Studio', 'Salle'] },
  'escalade': { label: '🧗 Escalade', surfaces: ['Mur'] },
  'swimming': { label: '🏊 Natation', surfaces: ['25m', '50m'] },
  'gymnastique': { label: '🤸 Gymnastique', surfaces: ['Salle'] },
  'artsmartiaux': { label: '🥋 Arts Martiaux', surfaces: ['Tatami', 'Dojo'] }
};

// Villes et quartiers
const villesMaroc = ['Casablanca', 'Rabat', 'Tanger', 'Marrakech', 'Fès', 'Agadir', 'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Mohammedia'];
const quartiersParVille = {
  'Casablanca': ['Maarif', 'Sidi Moumen', 'Ain Sebaa', 'Anfa', 'Hay Hassani', 'Derb Sultan', 'Mers Sultan', 'Roches Noires'],
  'Rabat': ['Agdal', 'Hay Riad', 'Souissi', 'Yacoub El Mansour', 'Temara', 'Hassan', 'Oudayas'],
  'Tanger': ['Mellah', 'Ain El Kasbah', 'Boukhalef', 'Marshan', 'Charf', 'Gzenaya'],
  'Marrakech': ['Guéliz', 'Hivernage', 'Médina', 'Sidi Youssef', 'Daoudiate', 'Massira'],
  'Fès': ['Ville Nouvelle', 'Médina', 'Sais', 'Ziat', 'Ain Kadous'],
  'Agadir': ['Ville Nouvelle', 'Taddart', 'Founty', 'Ouled Dahhou', 'Souk El Had'],
  'Meknès': ['Ville Nouvelle', 'Médina', 'Sidi Bouzekri', 'El Bassatine', 'Hamria'],
  'Oujda': ['Ville Nouvelle', 'Médina', 'El Farch', 'El Gharbi', 'Sidi Maafa'],
  'Kenitra': ['Ville Nouvelle', 'Médina', 'Briech', 'El Moustakbal', 'Khabazate'],
  'Tétouan': ['Ville Nouvelle', 'Médina', 'Tamda', 'Wilaya', 'Ras El Ma'],
  'Safi': ['Ville Nouvelle', 'Médina', 'Chaâba', 'Hajri', 'Harbi'],
  'Mohammedia': ['Ville Nouvelle', 'Médina', 'Coopérative', 'Roches Noires', 'Moulay Abdallah']
};

// Toast
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">
        {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      </span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

// Composant principal
const Crenau = () => {
  // États
  const [creneaux, setCreneaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCreneau, setEditingCreneau] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    date: '',
    statut: '',
    terrain: '',
    ville: '',
    quartier: '',
    sport: ''
  });
  const [expandedFilters, setExpandedFilters] = useState(false);

  // Formulaire
  const [formData, setFormData] = useState({
    datecreneaux: '',
    heure: '',
    heurefin: '',
    statut: 'disponible',
    numeroterrain: '',
    typeterrain: '',
    nomterrain: '',
    surfaceterrains: '',
    tarif: '',
    ville: '',
    quartier: ''
  });

  const API_URL = 'http://localhost:5000/api/gestioncreneaux';

  // Toast
  const toast = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
  };

  const closeToast = () => {
    setShowToast({ show: false, message: '', type: '' });
  };

  // Récupérer les créneaux
  const fetchCreneaux = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/`);
      const result = await response.json();
      if (result.success) {
        setCreneaux(result.data);
      }
    } catch (error) {
      toast('Erreur de connexion', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les statistiques
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/statistiques/overview`);
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchCreneaux();
    fetchStats();
  }, []);

  // Gestion des filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const response = await fetch(`${API_URL}/filtre/recherche?${params}`);
      const result = await response.json();
      if (result.success) {
        setCreneaux(result.data);
        toast(`${result.count} créneau(x) trouvé(s)`);
      }
    } catch (error) {
      toast('Erreur de filtrage', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({ date: '', statut: '', terrain: '', ville: '', quartier: '', sport: '' });
    fetchCreneaux();
  };

  // Gestion du formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'typeterrain') {
      const surfaces = sportConfigs[value]?.surfaces || [];
      if (surfaces.length > 0) {
        setFormData(prev => ({ ...prev, surfaceterrains: surfaces[0] }));
      }
    }
    
    if (name === 'ville') {
      setFormData(prev => ({ ...prev, quartier: '' }));
    }
  };

  // Ouvrir/fermer les modals
  const openAddModal = () => {
    setFormData({
      datecreneaux: '',
      heure: '',
      heurefin: '',
      statut: 'disponible',
      numeroterrain: '',
      typeterrain: '',
      nomterrain: '',
      surfaceterrains: '',
      tarif: '',
      ville: '',
      quartier: ''
    });
    setEditingCreneau(null);
    setShowFormModal(true);
  };

  const openEditModal = (creneau) => {
    setFormData({
      datecreneaux: creneau.datecreneaux || '',
      heure: creneau.heure || '',
      heurefin: creneau.heurefin || '',
      statut: creneau.statut || 'disponible',
      numeroterrain: creneau.numeroterrain || '',
      typeterrain: creneau.typeterrain || '',
      nomterrain: creneau.nomterrain || '',
      surfaceterrains: creneau.surfaceterrains || '',
      tarif: creneau.tarif || '',
      ville: creneau.ville || '',
      quartier: creneau.quartier || ''
    });
    setEditingCreneau(creneau);
    setShowFormModal(true);
  };

  const openViewModal = (creneau) => {
    setSelectedCreneau(creneau);
    setShowViewModal(true);
  };

  const closeModal = () => {
    setShowFormModal(false);
    setShowViewModal(false);
    setSelectedCreneau(null);
    setEditingCreneau(null);
  };

  // CRUD Operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCreneau 
        ? `${API_URL}/${editingCreneau.idcreneaux}`
        : `${API_URL}/`;
      const method = editingCreneau ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        toast(editingCreneau ? '✅ Créneau modifié avec succès' : '✅ Créneau ajouté avec succès');
        closeModal();
        fetchCreneaux();
        fetchStats();
      } else {
        toast(result.message || '❌ Erreur lors de l\'opération', 'error');
      }
    } catch (error) {
      toast('❌ Erreur de connexion', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        toast('🗑️ Créneau supprimé avec succès');
        fetchCreneaux();
        fetchStats();
      } else {
        toast(result.message || '❌ Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      toast('❌ Erreur de connexion', 'error');
    }
  };

  // Utilitaires
  const getSportIcon = (sport) => {
    const icons = {
      'football': '⚽', 'tennis': '🎾', 'basketball': '🏀',
      'volleyball': '🏐', 'handball': '🤾', 'rugby': '🏉',
      'padel': '🎾', 'badminton': '🏸', 'pingpong': '🏓',
      'futsal': '⚽', 'beachvolley': '🏐', 'boxe': '🥊',
      'musculation': '💪', 'yoga': '🧘', 'danse': '💃',
      'escalade': '🧗', 'swimming': '🏊', 'gymnastique': '🤸',
      'artsmartiaux': '🥋'
    };
    return icons[sport?.toLowerCase()] || '🏟️';
  };

  const getSportLabel = (sport) => {
    return sportConfigs[sport?.toLowerCase()]?.label || sport || '-';
  };

  const getAvailableQuartiers = () => {
    return quartiersParVille[formData.ville] || [];
  };

  const getAvailableSurfaces = () => {
    return sportConfigs[formData.typeterrain]?.surfaces || [];
  };

  // Rendu du formulaire
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="creneau-form">
      <div className="form-row">
        <div className="form-group">
          <label>
            <Calendar size={16} /> Date *
          </label>
          <input
            type="date"
            name="datecreneaux"
            value={formData.datecreneaux}
            onChange={handleFormChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>
            <Clock size={16} /> Heure début *
          </label>
          <input
            type="time"
            name="heure"
            value={formData.heure}
            onChange={handleFormChange}
            required
            className="form-input"
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>
            <Timer size={16} /> Heure fin
          </label>
          <input
            type="time"
            name="heurefin"
            value={formData.heurefin}
            onChange={handleFormChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>
            <Info size={16} /> Statut *
          </label>
          <select
            name="statut"
            value={formData.statut}
            onChange={handleFormChange}
            required
            className="form-select"
          >
            <option value="disponible">Disponible</option>
            <option value="réservé">Réservé</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>
            <Trophy size={16} /> Sport *
          </label>
          <select
            name="typeterrain"
            value={formData.typeterrain}
            onChange={handleFormChange}
            required
            className="form-select"
          >
            <option value="">Sélectionnez un sport</option>
            {Object.entries(sportConfigs).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>
            <Grid size={16} /> Surface *
          </label>
          <select
            name="surfaceterrains"
            value={formData.surfaceterrains}
            onChange={handleFormChange}
            required
            disabled={!formData.typeterrain}
            className="form-select"
          >
            <option value="">Sélectionnez une surface</option>
            {getAvailableSurfaces().map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>
            <MapPin size={16} /> N° Terrain *
          </label>
          <input
            type="number"
            name="numeroterrain"
            value={formData.numeroterrain}
            onChange={handleFormChange}
            required
            min="1"
            className="form-input"
            placeholder="1"
          />
        </div>
        <div className="form-group">
          <label>
            <DollarSign size={16} /> Tarif (DH) *
          </label>
          <input
            type="number"
            name="tarif"
            value={formData.tarif}
            onChange={handleFormChange}
            required
            min="0"
            step="0.01"
            className="form-input"
            placeholder="150"
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group full-width">
          <label>
            <Building size={16} /> Nom du terrain
          </label>
          <input
            type="text"
            name="nomterrain"
            value={formData.nomterrain}
            onChange={handleFormChange}
            className="form-input"
            placeholder="Ex: Stade Principal, Complexe Sportif..."
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            <Home size={16} /> Ville *
          </label>
          <select
            name="ville"
            value={formData.ville}
            onChange={handleFormChange}
            required
            className="form-select"
          >
            <option value="">Sélectionnez une ville</option>
            {villesMaroc.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>
            <Navigation size={16} /> Quartier *
          </label>
          <select
            name="quartier"
            value={formData.quartier}
            onChange={handleFormChange}
            required
            disabled={!formData.ville}
            className="form-select"
          >
            <option value="">Sélectionnez un quartier</option>
            {getAvailableQuartiers().map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={closeModal}>
          <X size={16} /> Annuler
        </button>
        <button type="submit" className="btn btn-primary">
          <Save size={16} /> {editingCreneau ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1><Calendar size={28} /> Administration des Créneaux</h1>
          <p>Gestion complète des créneaux horaires - Tous sports confondus</p>
        </div>
      </header>

      <main className="app-main">
        {/* Statistiques */}
        {stats && (
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><Calendar size={24} /></div>
                <div className="stat-value">{stats.total_creneaux}</div>
                <div className="stat-label">Total créneaux</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><CheckCircle size={24} /></div>
                <div className="stat-value">{stats.disponibles}</div>
                <div className="stat-label">Disponibles</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><Clock size={24} /></div>
                <div className="stat-value">{stats.reserves}</div>
                <div className="stat-label">Réservés</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><MapPin size={24} /></div>
                <div className="stat-value">{stats.terrains_actifs}</div>
                <div className="stat-label">Terrains actifs</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><DollarSign size={24} /></div>
                <div className="stat-value">{parseFloat(stats.tarif_moyen).toFixed(2)} DH</div>
                <div className="stat-label">Tarif moyen</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><Home size={24} /></div>
                <div className="stat-value">{stats.villes_disponibles || 0}</div>
                <div className="stat-label">Villes disponibles</div>
              </div>
            </div>
          </section>
        )}

        {/* Actions */}
        <section className="actions-section">
          <div className="section-header">
            <h2>Gestion des créneaux</h2>
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={20} /> Nouveau créneau
            </button>
          </div>
        </section>

        {/* Filtres */}
        <section className="filters-section">
          <div className="filters-header" onClick={() => setExpandedFilters(!expandedFilters)}>
            <h2><Filter size={20} /> Filtres</h2>
            <button className="btn-toggle">
              {expandedFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          {expandedFilters && (
            <div className="filters">
              <div className="filter-group">
                <label><Calendar size={16} /> Date</label>
                <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="filter-input" />
              </div>
              <div className="filter-group">
                <label><Info size={16} /> Statut</label>
                <select name="statut" value={filters.statut} onChange={handleFilterChange} className="filter-select">
                  <option value="">Tous</option>
                  <option value="disponible">Disponible</option>
                  <option value="réservé">Réservé</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="filter-group">
                <label><Trophy size={16} /> Sport</label>
                <select name="sport" value={filters.sport} onChange={handleFilterChange} className="filter-select">
                  <option value="">Tous</option>
                  {Object.entries(sportConfigs).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label><MapPin size={16} /> Terrain</label>
                <input type="number" name="terrain" value={filters.terrain} onChange={handleFilterChange} className="filter-input" placeholder="N°" />
              </div>
              <div className="filter-group">
                <label><Home size={16} /> Ville</label>
                <select name="ville" value={filters.ville} onChange={handleFilterChange} className="filter-select">
                  <option value="">Toutes</option>
                  {villesMaroc.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label><Navigation size={16} /> Quartier</label>
                <input type="text" name="quartier" value={filters.quartier} onChange={handleFilterChange} className="filter-input" placeholder="Ex: Maarif" />
              </div>
              <div className="filter-actions">
                <button className="btn btn-primary" onClick={applyFilters}>
                  <Search size={16} /> Appliquer
                </button>
                <button className="btn btn-secondary" onClick={resetFilters}>
                  <X size={16} /> Réinitialiser
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Tableau */}
        <section className="table-section">
          <div className="section-header">
            <h2><List size={20} /> Liste des créneaux ({creneaux.length})</h2>
            <button className="btn btn-outline" onClick={fetchCreneaux}>
              <RefreshCw size={16} /> Actualiser
            </button>
          </div>
          
          {loading ? (
            <div className="loading">
              <Loader2 size={32} className="spinning" />
              <p>Chargement...</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="creneaux-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Début</th>
                    <th>Fin</th>
                    <th>Statut</th>
                    <th>Sport</th>
                    <th>Surface</th>
                    <th>Terrain</th>
                    <th>Nom</th>
                    <th>Tarif</th>
                    <th>Ville</th>
                    <th>Quartier</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creneaux.length === 0 ? (
                    <tr>
                      <td colSpan="13" className="no-data">
                        <div className="no-data-content">
                          <AlertCircle size={48} />
                          <p>Aucun créneau trouvé</p>
                          <button className="btn btn-primary" onClick={openAddModal}>
                            <Plus size={16} /> Ajouter un créneau
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    creneaux.map((c, i) => (
                      <tr key={c.idcreneaux} className="fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                        <td><span className="id-badge">#{c.idcreneaux}</span></td>
                        <td>{new Date(c.datecreneaux).toLocaleDateString('fr-FR')}</td>
                        <td>{c.heure}</td>
                        <td>{c.heurefin || '-'}</td>
                        <td>
                          <span className={`status-badge status-${c.statut}`}>{c.statut}</span>
                        </td>
                        <td>
                          <span className="sport-badge">
                            {getSportIcon(c.typeterrain)} {getSportLabel(c.typeterrain)}
                          </span>
                        </td>
                        <td>{c.surfaceterrains || '-'}</td>
                        <td><span className="terrain-badge">N°{c.numeroterrain}</span></td>
                        <td>{c.nomterrain || '-'}</td>
                        <td><span className="price-badge">{c.tarif} DH</span></td>
                        <td>
                          <span className="ville-badge">{c.ville || '-'}</span>
                        </td>
                        <td>
                          <span className="quartier-badge">{c.quartier || '-'}</span>
                        </td>
                        <td className="actions">
                          <button className="btn-icon view" onClick={() => openViewModal(c)} title="Voir">
                            <Eye size={16} />
                          </button>
                          <button className="btn-icon edit" onClick={() => openEditModal(c)} title="Modifier">
                            <Edit size={16} />
                          </button>
                          <button className="btn-icon delete" onClick={() => handleDelete(c.idcreneaux)} title="Supprimer">
                            <Trash2 size={16} />
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

      {/* Toast */}
      {showToast.show && (
        <Toast message={showToast.message} type={showToast.type} onClose={closeToast} />
      )}

      {/* Modal Visualisation */}
      {showViewModal && selectedCreneau && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Eye size={20} /> Détails du créneau #{selectedCreneau.idcreneaux}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label><Calendar size={16} /> Date</label>
                  <span>{new Date(selectedCreneau.datecreneaux).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="detail-item">
                  <label><Clock size={16} /> Heure</label>
                  <span>{selectedCreneau.heure} - {selectedCreneau.heurefin || '...'}</span>
                </div>
                <div className="detail-item">
                  <label><Info size={16} /> Statut</label>
                  <span className={`status-badge status-${selectedCreneau.statut}`}>
                    {selectedCreneau.statut}
                  </span>
                </div>
                <div className="detail-item">
                  <label><Trophy size={16} /> Sport</label>
                  <span>{getSportIcon(selectedCreneau.typeterrain)} {getSportLabel(selectedCreneau.typeterrain)}</span>
                </div>
                <div className="detail-item">
                  <label><Grid size={16} /> Surface</label>
                  <span>{selectedCreneau.surfaceterrains || '-'}</span>
                </div>
                <div className="detail-item">
                  <label><MapPin size={16} /> Terrain</label>
                  <span>N°{selectedCreneau.numeroterrain} - {selectedCreneau.nomterrain || '-'}</span>
                </div>
                <div className="detail-item">
                  <label><DollarSign size={16} /> Tarif</label>
                  <span className="price-badge">{selectedCreneau.tarif} DH</span>
                </div>
                <div className="detail-item">
                  <label><Home size={16} /> Ville</label>
                  <span className="ville-badge">{selectedCreneau.ville || '-'}</span>
                </div>
                <div className="detail-item">
                  <label><Navigation size={16} /> Quartier</label>
                  <span className="quartier-badge">{selectedCreneau.quartier || '-'}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulaire */}
      {showFormModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content compact" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCreneau ? <Edit size={20} /> : <Plus size={20} />} {editingCreneau ? 'Modifier' : 'Ajouter'} un créneau</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {renderForm()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crenau;