import React, { useState, useEffect } from 'react';
import './gesticreneau.css';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw,
  X,
  MapPin,
  Tag,
  DollarSign,
  Users,
  FileText,
  AlertCircle,
  Settings,
  Save,
  BarChart3,
  Award,
  Home,
  Navigation
} from 'lucide-react';

// Configuration des sports avec leurs surfaces correspondantes (identique à Reservation)
const sportConfigs = {
  'football': {
    label: 'Football',
    surfaces: [
      { value: '7X7', label: '7X7 - 7 joueurs' },
      { value: '9X9', label: '9X9 - 9 joueurs' },
      { value: '11X11', label: '11X11 - 11 joueurs' }
    ]
  },
  'tennis': {
    label: 'Tennis',
    surfaces: [
      { value: 'simple', label: 'Simple - 2 joueurs' },
      { value: 'double', label: 'Double - 4 joueurs' }
    ]
  },
  'basketball': {
    label: 'Basketball',
    surfaces: [
      { value: '3X3', label: '3X3 - 3 joueurs' },
      { value: '5X5', label: '5X5 - 5 joueurs' }
    ]
  },
  'volleyball': {
    label: 'Volleyball',
    surfaces: [
      { value: '4X4', label: '4X4 - 4 joueurs' },
      { value: '6X6', label: '6X6 - 6 joueurs' }
    ]
  },
  'handball': {
    label: 'Handball',
    surfaces: [
      { value: '7X7', label: '7X7 - 7 joueurs' }
    ]
  },
  'rugby': {
    label: 'Rugby',
    surfaces: [
      { value: '7X7', label: '7X7 - 7 joueurs' },
      { value: '15X15', label: '15X15 - 15 joueurs' }
    ]
  },
  'padel': {
    label: 'Padel',
    surfaces: [
      { value: 'double', label: 'Double - 4 joueurs' }
    ]
  },
  'badminton': {
    label: 'Badminton',
    surfaces: [
      { value: 'simple', label: 'Simple - 2 joueurs' },
      { value: 'double', label: 'Double - 4 joueurs' }
    ]
  },
  'pingpong': {
    label: 'Ping-Pong',
    surfaces: [
      { value: 'simple', label: 'Simple - 2 joueurs' },
      { value: 'double', label: 'Double - 4 joueurs' }
    ]
  },
  'futsal': {
    label: 'Futsal',
    surfaces: [
      { value: '5X5', label: '5X5 - 5 joueurs' }
    ]
  },
  'beachvolley': {
    label: 'Beach Volley',
    surfaces: [
      { value: '4X4', label: '4X4 - 4 joueurs' }
    ]
  },
  'boxe': {
    label: 'Boxe',
    surfaces: [
      { value: 'ring', label: 'Ring' }
    ]
  },
  'musculation': {
    label: 'Musculation',
    surfaces: [
      { value: 'salle', label: 'Salle' }
    ]
  },
  'yoga': {
    label: 'Yoga',
    surfaces: [
      { value: 'studio', label: 'Studio' },
      { value: 'salle', label: 'Salle' }
    ]
  },
  'danse': {
    label: 'Danse',
    surfaces: [
      { value: 'studio', label: 'Studio' },
      { value: 'salle', label: 'Salle' }
    ]
  },
  'escalade': {
    label: 'Escalade',
    surfaces: [
      { value: 'mur', label: 'Mur' }
    ]
  },
  'swimming': {
    label: 'Natation',
    surfaces: [
      { value: '25m', label: '25m' },
      { value: '50m', label: '50m' }
    ]
  },
  'gymnastique': {
    label: 'Gymnastique',
    surfaces: [
      { value: 'salle', label: 'Salle' }
    ]
  },
  'artsmartiaux': {
    label: 'Arts Martiaux',
    surfaces: [
      { value: 'tatami', label: 'Tatami' },
      { value: 'dojo', label: 'Dojo' }
    ]
  }
};

// Villes marocaines (identique à Reservation)
const villesMaroc = [
  'Casablanca', 'Rabat', 'Tanger', 'Marrakech', 'Fès', 'Agadir',
  'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Mohammedia'
];

// Quartiers par ville (identique à Reservation)
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

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`gc-toast gc-toast-${type}`}>
      <span className="gc-toast-icon">
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </span>
      <span className="gc-toast-message">{message}</span>
      <button className="gc-toast-close" onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  );
};

// Composant principal
const Crenau = () => {
  const [creneaux, setCreneaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
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
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  // Récupérer les créneaux
  const fetchCreneaux = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/`);
      const result = await response.json();
      if (result.success) {
        setCreneaux(result.data);
        showToast('Créneaux chargés avec succès', 'success');
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
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
        showToast(`${result.count} créneau(x) trouvé(s)`, 'success');
      }
    } catch (error) {
      showToast('Erreur de filtrage', 'error');
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
    
    // Auto-set surface when sport changes
    if (name === 'typeterrain') {
      const surfaces = getAvailableSurfaces(value);
      if (surfaces.length > 0) {
        setFormData(prev => ({ ...prev, surfaceterrains: surfaces[0].value }));
      } else {
        setFormData(prev => ({ ...prev, surfaceterrains: '' }));
      }
    }
    
    // Reset quartier when ville changes
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
        showToast(editingCreneau ? '✅ Créneau modifié avec succès' : '✅ Créneau ajouté avec succès');
        closeModal();
        fetchCreneaux();
        fetchStats();
      } else {
        showToast(result.message || '❌ Erreur lors de l\'opération', 'error');
      }
    } catch (error) {
      showToast('❌ Erreur de connexion', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        showToast('🗑️ Créneau supprimé avec succès');
        fetchCreneaux();
        fetchStats();
      } else {
        showToast(result.message || '❌ Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      showToast('❌ Erreur de connexion', 'error');
    }
  };

  // Utilitaires - identiques à Reservation
  const getAvailableSurfaces = (sport) => {
    if (!sport) return [];
    return sportConfigs[sport]?.surfaces || [];
  };

  const getAvailableQuartiers = () => {
    if (!formData.ville) return [];
    return quartiersParVille[formData.ville] || [];
  };

  const getSportLabel = (sport) => {
    return sportConfigs[sport?.toLowerCase()]?.label || sport || '-';
  };

  const getSurfaceLabel = (sport, surface) => {
    const surfaces = getAvailableSurfaces(sport);
    const found = surfaces.find(s => s.value === surface);
    return found ? found.label : surface || '-';
  };

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

  // Rendu du formulaire
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="gc-form">
      <div className="gc-form-grid">
        <div className="gc-form-group">
          <label htmlFor="datecreneaux">
            <Calendar size={16} /> Date <span className="gc-required">*</span>
          </label>
          <input
            type="date"
            id="datecreneaux"
            name="datecreneaux"
            value={formData.datecreneaux}
            onChange={handleFormChange}
            required
            className="gc-input"
          />
        </div>
        
        <div className="gc-form-group">
          <label htmlFor="heure">
            <Clock size={16} /> Heure début <span className="gc-required">*</span>
          </label>
          <input
            type="time"
            id="heure"
            name="heure"
            value={formData.heure}
            onChange={handleFormChange}
            required
            className="gc-input"
          />
        </div>
        
        <div className="gc-form-group">
          <label htmlFor="heurefin">
            <Clock size={16} /> Heure fin
          </label>
          <input
            type="time"
            id="heurefin"
            name="heurefin"
            value={formData.heurefin}
            onChange={handleFormChange}
            className="gc-input"
          />
        </div>
        
        <div className="gc-form-group">
          <label htmlFor="statut">
            <Settings size={16} /> Statut <span className="gc-required">*</span>
          </label>
          <select
            id="statut"
            name="statut"
            value={formData.statut}
            onChange={handleFormChange}
            required
            className="gc-select"
          >
            <option value="disponible">Disponible</option>
            <option value="réservé">Réservé</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        
        <div className="gc-form-group">
          <label htmlFor="typeterrain">
            <Tag size={16} /> Sport <span className="gc-required">*</span>
          </label>
          <select
            id="typeterrain"
            name="typeterrain"
            value={formData.typeterrain}
            onChange={handleFormChange}
            required
            className="gc-select"
          >
            <option value="">Sélectionnez un sport</option>
            {Object.entries(sportConfigs).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
        
        <div className="gc-form-group">
          <label htmlFor="surfaceterrains">
            <Grid size={16} /> Surface <span className="gc-required">*</span>
          </label>
          <select
            id="surfaceterrains"
            name="surfaceterrains"
            value={formData.surfaceterrains}
            onChange={handleFormChange}
            required
            disabled={!formData.typeterrain}
            className="gc-select"
          >
            <option value="">
              {formData.typeterrain ? 'Sélectionnez une surface' : 'Choisissez d\'abord un sport'}
            </option>
            {getAvailableSurfaces(formData.typeterrain).map((surf) => (
              <option key={surf.value} value={surf.value}>
                {surf.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="gc-form-group">
          <label htmlFor="numeroterrain">
            <MapPin size={16} /> N° Terrain <span className="gc-required">*</span>
          </label>
          <input
            type="number"
            id="numeroterrain"
            name="numeroterrain"
            value={formData.numeroterrain}
            onChange={handleFormChange}
            required
            min="1"
            className="gc-input"
            placeholder="1"
          />
        </div>
        
        <div className="gc-form-group">
          <label htmlFor="tarif">
            <DollarSign size={16} /> Tarif (DH) <span className="gc-required">*</span>
          </label>
          <input
            type="number"
            id="tarif"
            name="tarif"
            value={formData.tarif}
            onChange={handleFormChange}
            required
            min="0"
            step="0.01"
            className="gc-input"
            placeholder="150"
          />
        </div>
        
        <div className="gc-form-group gc-full-width">
          <label htmlFor="nomterrain">
            <FileText size={16} /> Nom du terrain
          </label>
          <input
            type="text"
            id="nomterrain"
            name="nomterrain"
            value={formData.nomterrain}
            onChange={handleFormChange}
            className="gc-input"
            placeholder="Ex: Stade Principal, Complexe Sportif..."
          />
        </div>

        <div className="gc-form-group">
          <label htmlFor="ville">
            <Home size={16} /> Ville <span className="gc-required">*</span>
          </label>
          <select
            id="ville"
            name="ville"
            value={formData.ville}
            onChange={handleFormChange}
            required
            className="gc-select"
          >
            <option value="">Sélectionnez une ville</option>
            {villesMaroc.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        
        <div className="gc-form-group">
          <label htmlFor="quartier">
            <Navigation size={16} /> Quartier <span className="gc-required">*</span>
          </label>
          <select
            id="quartier"
            name="quartier"
            value={formData.quartier}
            onChange={handleFormChange}
            required
            disabled={!formData.ville}
            className="gc-select"
          >
            <option value="">
              {formData.ville ? 'Sélectionnez un quartier' : 'Choisissez d\'abord une ville'}
            </option>
            {getAvailableQuartiers().map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="gc-form-actions">
        <button type="button" className="gc-btn gc-btn-secondary" onClick={closeModal}>
          <X size={16} /> Annuler
        </button>
        <button type="submit" className="gc-btn gc-btn-primary">
          <Save size={16} /> {editingCreneau ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="gc-container">
      <header className="gc-header">
        <div className="gc-header-content">
          <div className="gc-header-title">
            <h1 className="gc-main-title">
              <span className="gc-title-glow">Gestionnaire</span> des Créneaux
            </h1>
            <p className="gc-header-subtitle">
              <Award size={18} />
              Gérez efficacement les créneaux horaires de vos terrains
            </p>
          </div>
          <Home className="gc-home-icon" size={32} />
        </div>
      </header>

      <main className="gc-main">
        {/* Statistiques */}
        {stats && (
          <section className="gc-stats-section">
            <h2 className="gc-section-title">
              <BarChart3 size={22} />
              Tableau de bord
            </h2>
            <div className="gc-stats-grid">
              <div className="gc-stat-card">
                <div className="gc-stat-icon"><Calendar size={28} /></div>
                <div className="gc-stat-content">
                  <div className="gc-stat-value">{stats.total_creneaux || 0}</div>
                  <div className="gc-stat-label">Total créneaux</div>
                </div>
              </div>
              <div className="gc-stat-card">
                <div className="gc-stat-icon"><CheckCircle size={28} /></div>
                <div className="gc-stat-content">
                  <div className="gc-stat-value">{stats.disponibles || 0}</div>
                  <div className="gc-stat-label">Disponibles</div>
                </div>
              </div>
              <div className="gc-stat-card">
                <div className="gc-stat-icon"><Users size={28} /></div>
                <div className="gc-stat-content">
                  <div className="gc-stat-value">{stats.reserves || 0}</div>
                  <div className="gc-stat-label">Réservés</div>
                </div>
              </div>
              <div className="gc-stat-card">
                <div className="gc-stat-icon"><AlertCircle size={28} /></div>
                <div className="gc-stat-content">
                  <div className="gc-stat-value">{stats.maintenance || 0}</div>
                  <div className="gc-stat-label">Maintenance</div>
                </div>
              </div>
              <div className="gc-stat-card">
                <div className="gc-stat-icon"><MapPin size={28} /></div>
                <div className="gc-stat-content">
                  <div className="gc-stat-value">{stats.terrains_actifs || 0}</div>
                  <div className="gc-stat-label">Terrains actifs</div>
                </div>
              </div>
              <div className="gc-stat-card">
                <div className="gc-stat-icon"><DollarSign size={28} /></div>
                <div className="gc-stat-content">
                  <div className="gc-stat-value">{parseFloat(stats.tarif_moyen || 0).toFixed(2)} DH</div>
                  <div className="gc-stat-label">Tarif moyen</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Actions */}
        <section className="gc-actions-section">
          <div className="gc-actions-header">
            <h2 className="gc-section-title">
              <Settings size={22} />
              Gestion des créneaux
            </h2>
            <button className="gc-btn gc-btn-primary" onClick={openAddModal}>
              <Plus size={18} />
              Nouveau créneau
            </button>
          </div>
        </section>

        {/* Filtres */}
        <section className="gc-filters-section">
          <div className="gc-filters-header" onClick={() => setExpandedFilters(!expandedFilters)}>
            <h2 className="gc-section-title">
              <Filter size={22} />
              Filtres avancés
            </h2>
            <button className="gc-btn-toggle">
              {expandedFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          {expandedFilters && (
            <div className="gc-filters">
              <div className="gc-filter-group">
                <label><Calendar size={16} /> Date</label>
                <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="gc-filter-input" />
              </div>
              <div className="gc-filter-group">
                <label><Settings size={16} /> Statut</label>
                <select name="statut" value={filters.statut} onChange={handleFilterChange} className="gc-filter-select">
                  <option value="">Tous</option>
                  <option value="disponible">Disponible</option>
                  <option value="réservé">Réservé</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="gc-filter-group">
                <label><Tag size={16} /> Sport</label>
                <select name="sport" value={filters.sport} onChange={handleFilterChange} className="gc-filter-select">
                  <option value="">Tous</option>
                  {Object.entries(sportConfigs).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div className="gc-filter-group">
                <label><MapPin size={16} /> Terrain</label>
                <input type="number" name="terrain" value={filters.terrain} onChange={handleFilterChange} className="gc-filter-input" placeholder="N°" />
              </div>
              <div className="gc-filter-group">
                <label><Home size={16} /> Ville</label>
                <select name="ville" value={filters.ville} onChange={handleFilterChange} className="gc-filter-select">
                  <option value="">Toutes</option>
                  {villesMaroc.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="gc-filter-group">
                <label><Navigation size={16} /> Quartier</label>
                <input type="text" name="quartier" value={filters.quartier} onChange={handleFilterChange} className="gc-filter-input" placeholder="Ex: Maarif" />
              </div>
              <div className="gc-filter-actions">
                <button className="gc-btn gc-btn-primary" onClick={applyFilters}>
                  <Search size={16} /> Appliquer
                </button>
                <button className="gc-btn gc-btn-outline" onClick={resetFilters}>
                  <RefreshCw size={16} /> Réinitialiser
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Tableau */}
        <section className="gc-table-section">
          <div className="gc-table-header">
            <h2 className="gc-section-title">
              <FileText size={22} />
              Liste des créneaux
              <span className="gc-count-badge">{creneaux.length}</span>
            </h2>
            <button className="gc-btn gc-btn-outline" onClick={fetchCreneaux}>
              <RefreshCw size={16} />
              Actualiser
            </button>
          </div>
          
          {loading ? (
            <div className="gc-loading">
              <div className="gc-spinner"></div>
              <p>Chargement des créneaux...</p>
            </div>
          ) : (
            <div className="gc-table-wrapper">
              <table className="gc-table">
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
                      <td colSpan="13" className="gc-no-data">
                        <div className="gc-no-data-content">
                          <FileText size={48} />
                          <p>Aucun créneau trouvé</p>
                          <button className="gc-btn gc-btn-primary" onClick={openAddModal}>
                            <Plus size={16} /> Ajouter un créneau
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    creneaux.map((c, i) => (
                      <tr key={c.idcreneaux} className="gc-table-row" style={{ animationDelay: `${i * 0.05}s` }}>
                        <td><span className="gc-id-badge">#{c.idcreneaux}</span></td>
                        <td className="gc-date-cell">
                          <div className="gc-cell-content">
                            <Calendar size={14} className="gc-cell-icon" />
                            {new Date(c.datecreneaux).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td>
                          <div className="gc-cell-content">
                            <Clock size={14} className="gc-cell-icon" />
                            <span className="gc-time-badge">{c.heure}</span>
                          </div>
                        </td>
                        <td>
                          <div className="gc-cell-content">
                            <Clock size={14} className="gc-cell-icon" />
                            {c.heurefin ? <span className="gc-time-badge">{c.heurefin}</span> : '-'}
                          </div>
                        </td>
                        <td className="gc-status-cell">
                          <span className={`gc-status-badge gc-status-${c.statut}`}>
                            {c.statut === 'disponible' && <CheckCircle size={14} />}
                            {c.statut === 'réservé' && <Users size={14} />}
                            {c.statut === 'maintenance' && <AlertCircle size={14} />}
                            <span className="gc-status-text">{c.statut}</span>
                          </span>
                        </td>
                        <td>
                          <div className="gc-cell-content">
                            <span className="gc-sport-badge">
                              {getSportIcon(c.typeterrain)} {getSportLabel(c.typeterrain)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="gc-cell-content">
                            <span className="gc-surface-badge">
                              {getSurfaceLabel(c.typeterrain, c.surfaceterrains)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="gc-cell-content">
                            <MapPin size={14} className="gc-cell-icon" />
                            <span className="gc-terrain-number">N°{c.numeroterrain}</span>
                          </div>
                        </td>
                        <td><span className="gc-name-text">{c.nomterrain || '-'}</span></td>
                        <td className="gc-price-cell">
                          <div className="gc-cell-content">
                            <DollarSign size={14} className="gc-price-icon" />
                            <span className="gc-price-value">{c.tarif} DH</span>
                          </div>
                        </td>
                        <td>
                          <div className="gc-cell-content">
                            <Home size={14} className="gc-cell-icon" />
                            {c.ville || '-'}
                          </div>
                        </td>
                        <td>
                          <div className="gc-cell-content">
                            <Navigation size={14} className="gc-cell-icon" />
                            {c.quartier || '-'}
                          </div>
                        </td>
                        <td>
                          <div className="gc-actions-container">
                            <button className="gc-action-btn gc-view-btn" onClick={() => openViewModal(c)} title="Voir">
                              <Eye size={16} />
                            </button>
                            <button className="gc-action-btn gc-edit-btn" onClick={() => openEditModal(c)} title="Modifier">
                              <Edit size={16} />
                            </button>
                            <button className="gc-action-btn gc-delete-btn" onClick={() => handleDelete(c.idcreneaux)} title="Supprimer">
                              <Trash2 size={16} />
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
        </section>
      </main>

      {/* Toast */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {/* Modal Visualisation */}
      {showViewModal && selectedCreneau && (
        <div className="gc-modal-overlay" onClick={closeModal}>
          <div className="gc-modal-content gc-view-modal" onClick={e => e.stopPropagation()}>
            <div className="gc-modal-header">
              <h2 className="gc-modal-title">
                <Eye size={22} />
                Détails du créneau #{selectedCreneau.idcreneaux}
              </h2>
              <button className="gc-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="gc-modal-body">
              <div className="gc-detail-grid">
                <div className="gc-detail-item">
                  <span className="gc-detail-label"><Calendar size={14} /> Date</span>
                  <span className="gc-detail-value">
                    {new Date(selectedCreneau.datecreneaux).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="gc-detail-item">
                  <span className="gc-detail-label"><Clock size={14} /> Heure</span>
                  <span className="gc-detail-value">
                    {selectedCreneau.heure} - {selectedCreneau.heurefin || '...'}
                  </span>
                </div>
                <div className="gc-detail-item">
                  <span className="gc-detail-label">Statut</span>
                  <span className={`gc-status-badge gc-status-${selectedCreneau.statut}`}>
                    {selectedCreneau.statut}
                  </span>
                </div>
                <div className="gc-detail-item">
                  <span className="gc-detail-label"><Tag size={14} /> Sport</span>
                  <span className="gc-detail-value">
                    {getSportIcon(selectedCreneau.typeterrain)} {getSportLabel(selectedCreneau.typeterrain)}
                  </span>
                </div>
                <div className="gc-detail-item">
                  <span className="gc-detail-label">Surface</span>
                  <span className="gc-detail-value">
                    {getSurfaceLabel(selectedCreneau.typeterrain, selectedCreneau.surfaceterrains)}
                  </span>
                </div>
                <div className="gc-detail-item">
                  <span className="gc-detail-label"><MapPin size={14} /> Terrain</span>
                  <span className="gc-detail-value">N°{selectedCreneau.numeroterrain}</span>
                </div>
                <div className="gc-detail-item">
                  <span className="gc-detail-label"><DollarSign size={14} /> Tarif</span>
                  <span className="gc-price-value">{selectedCreneau.tarif} DH</span>
                </div>
                <div className="gc-detail-item">
                  <span className="gc-detail-label"><Home size={14} /> Ville</span>
                  <span className="gc-detail-value">{selectedCreneau.ville || '-'}</span>
                </div>
                <div className="gc-detail-item">
                  <span className="gc-detail-label"><Navigation size={14} /> Quartier</span>
                  <span className="gc-detail-value">{selectedCreneau.quartier || '-'}</span>
                </div>
              </div>
            </div>
            <div className="gc-modal-footer">
              <button className="gc-btn gc-btn-secondary" onClick={closeModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulaire */}
      {showFormModal && (
        <div className="gc-modal-overlay" onClick={closeModal}>
          <div className="gc-modal-content gc-form-modal" onClick={e => e.stopPropagation()}>
            <div className="gc-modal-header">
              <h2 className="gc-modal-title">
                {editingCreneau ? <Edit size={22} /> : <Plus size={22} />}
                {editingCreneau ? 'Modifier' : 'Ajouter'} un créneau
              </h2>
              <button className="gc-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="gc-modal-body">
              {renderForm()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Import des icônes manquantes
import { ChevronDown, ChevronUp, Grid } from 'lucide-react';

export default Crenau;