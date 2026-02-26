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
  Home
} from 'lucide-react';

// Composant Toast pour les notifications
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

// Composant Modal pour visualiser un créneau
const ViewModal = ({ creneau, onClose }) => {
  if (!creneau) return null;

  return (
    <div className="gc-modal-overlay" onClick={onClose}>
      <div className="gc-modal-content gc-view-modal" onClick={e => e.stopPropagation()}>
        <div className="gc-modal-header">
          <h2 className="gc-modal-title">
            <FileText size={22} />
            Détails du créneau
          </h2>
          <button className="gc-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="gc-modal-body">
          <div className="gc-detail-grid">
            <div className="gc-detail-item">
              <span className="gc-detail-label">ID</span>
              <span className="gc-detail-value">
                <span className="gc-id-badge">#{creneau.idcreneaux}</span>
              </span>
            </div>
            <div className="gc-detail-item">
              <span className="gc-detail-label">
                <Calendar size={14} /> Date
              </span>
              <span className="gc-detail-value">
                {new Date(creneau.datecreneaux).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="gc-detail-item">
              <span className="gc-detail-label">
                <Clock size={14} /> Heure début
              </span>
              <span className="gc-detail-value">
                <span className="gc-time-badge">{creneau.heure}</span>
              </span>
            </div>
            <div className="gc-detail-item">
              <span className="gc-detail-label">
                <Clock size={14} /> Heure fin
              </span>
              <span className="gc-detail-value">
                {creneau.heurefin ? 
                  <span className="gc-time-badge">{creneau.heurefin}</span> : 
                  'Non spécifiée'
                }
              </span>
            </div>
            <div className="gc-detail-item">
              <span className="gc-detail-label">Statut</span>
              <span className={`gc-status-badge gc-status-${creneau.statut}`}>
                {creneau.statut === 'disponible' && <CheckCircle size={14} />}
                {creneau.statut === 'réservé' && <Users size={14} />}
                {creneau.statut === 'maintenance' && <AlertCircle size={14} />}
                <span className="gc-status-text">{creneau.statut}</span>
              </span>
            </div>
            <div className="gc-detail-item">
              <span className="gc-detail-label">
                <MapPin size={14} /> Terrain N°
              </span>
              <span className="gc-detail-value">
                <span className="gc-terrain-number">{creneau.numeroterrain}</span>
              </span>
            </div>
            <div className="gc-detail-item">
              <span className="gc-detail-label">
                <Tag size={14} /> Type terrain
              </span>
              <span className="gc-detail-value">
                {creneau.typeterrain ? (
                  <span className={`gc-type-badge gc-type-${creneau.typeterrain.toLowerCase()}`}>
                    {creneau.typeterrain}
                  </span>
                ) : 'Non spécifié'}
              </span>
            </div>
            <div className="gc-detail-item">
              <span className="gc-detail-label">Surface</span>
              <span className="gc-detail-value">
                {creneau.surfaceterrains ? (
                  <span className={`gc-surface-badge gc-surface-${creneau.surfaceterrains.toLowerCase().replace('x', '')}`}>
                    {creneau.surfaceterrains}
                  </span>
                ) : 'Non spécifiée'}
              </span>
            </div>
            <div className="gc-detail-item">
              <span className="gc-detail-label">Nom terrain</span>
              <span className="gc-detail-value gc-name-text">{creneau.nomterrain || 'Non spécifié'}</span>
            </div>
            <div className="gc-detail-item">
              <span className="gc-detail-label">
                <DollarSign size={14} /> Tarif
              </span>
              <span className="gc-detail-value gc-price-value">{creneau.tarif} DH</span>
            </div>
          </div>
        </div>
        <div className="gc-modal-footer">
          <button className="gc-btn gc-btn-secondary" onClick={onClose}>
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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.datecreneaux) {
      newErrors.datecreneaux = 'La date est requise';
    }
    
    if (!formData.heure) {
      newErrors.heure = 'L\'heure de début est requise';
    }
    
    if (formData.heurefin && formData.heure && formData.heurefin <= formData.heure) {
      newErrors.heurefin = 'L\'heure de fin doit être postérieure à l\'heure de début';
    }
    
    if (!formData.numeroterrain) {
      newErrors.numeroterrain = 'Le numéro de terrain est requis';
    }
    
    if (!formData.typeterrain) {
      newErrors.typeterrain = 'Le type de terrain est requis';
    }
    
    if (!formData.surfaceterrains) {
      newErrors.surfaceterrains = 'La surface est requise';
    }
    
    if (!formData.tarif || formData.tarif <= 0) {
      newErrors.tarif = 'Le tarif doit être supérieur à 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="gc-modal-overlay" onClick={onClose}>
      <div className="gc-modal-content gc-form-modal" onClick={e => e.stopPropagation()}>
        <div className="gc-modal-header">
          <h2 className="gc-modal-title">
            {isEditing ? <Edit size={22} /> : <Plus size={22} />}
            {isEditing ? 'Modifier le créneau' : 'Nouveau créneau'}
          </h2>
          <button className="gc-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="gc-modal-body">
          <form onSubmit={handleSubmit} className="gc-form">
            <div className="gc-form-grid">
              <div className="gc-form-group">
                <label htmlFor="datecreneaux">
                  <Calendar size={16} />
                  Date <span className="gc-required">*</span>
                </label>
                <input
                  type="date"
                  id="datecreneaux"
                  name="datecreneaux"
                  value={formData.datecreneaux}
                  onChange={handleInputChange}
                  className={`gc-input ${errors.datecreneaux ? 'gc-input-error' : ''}`}
                />
                {errors.datecreneaux && (
                  <span className="gc-error-message">{errors.datecreneaux}</span>
                )}
              </div>
              
              <div className="gc-form-group">
                <label htmlFor="heure">
                  <Clock size={16} />
                  Heure début <span className="gc-required">*</span>
                </label>
                <input
                  type="time"
                  id="heure"
                  name="heure"
                  value={formData.heure}
                  onChange={handleInputChange}
                  className={`gc-input ${errors.heure ? 'gc-input-error' : ''}`}
                />
                {errors.heure && (
                  <span className="gc-error-message">{errors.heure}</span>
                )}
              </div>
              
              <div className="gc-form-group">
                <label htmlFor="heurefin">
                  <Clock size={16} />
                  Heure fin
                </label>
                <input
                  type="time"
                  id="heurefin"
                  name="heurefin"
                  value={formData.heurefin}
                  onChange={handleInputChange}
                  className={`gc-input ${errors.heurefin ? 'gc-input-error' : ''}`}
                />
                {errors.heurefin && (
                  <span className="gc-error-message">{errors.heurefin}</span>
                )}
              </div>
              
              <div className="gc-form-group">
                <label htmlFor="statut">
                  <Settings size={16} />
                  Statut <span className="gc-required">*</span>
                </label>
                <select
                  id="statut"
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  className="gc-select"
                >
                  <option value="disponible">Disponible</option>
                  <option value="réservé">Réservé</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div className="gc-form-group">
                <label htmlFor="numeroterrain">
                  <MapPin size={16} />
                  Numéro terrain <span className="gc-required">*</span>
                </label>
                <input
                  type="number"
                  id="numeroterrain"
                  name="numeroterrain"
                  value={formData.numeroterrain}
                  onChange={handleInputChange}
                  min="1"
                  className={`gc-input ${errors.numeroterrain ? 'gc-input-error' : ''}`}
                />
                {errors.numeroterrain && (
                  <span className="gc-error-message">{errors.numeroterrain}</span>
                )}
              </div>
              
              <div className="gc-form-group">
                <label htmlFor="typeterrain">
                  <Tag size={16} />
                  Type terrain <span className="gc-required">*</span>
                </label>
                <select
                  id="typeterrain"
                  name="typeterrain"
                  value={formData.typeterrain}
                  onChange={handleInputChange}
                  className={`gc-select ${errors.typeterrain ? 'gc-input-error' : ''}`}
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Normal">Normal</option>
                  <option value="Synthétique">Synthétique</option>
                </select>
                {errors.typeterrain && (
                  <span className="gc-error-message">{errors.typeterrain}</span>
                )}
              </div>

              <div className="gc-form-group">
                <label htmlFor="surfaceterrains">
                  Surface <span className="gc-required">*</span>
                </label>
                <select
                  id="surfaceterrains"
                  name="surfaceterrains"
                  value={formData.surfaceterrains}
                  onChange={handleInputChange}
                  className={`gc-select ${errors.surfaceterrains ? 'gc-input-error' : ''}`}
                >
                  <option value="">Sélectionner une surface</option>
                  <option value="7X7">7X7</option>
                  <option value="9X9">9X9</option>
                  <option value="11X11">11X11</option>
                </select>
                {errors.surfaceterrains && (
                  <span className="gc-error-message">{errors.surfaceterrains}</span>
                )}
              </div>
              
              <div className="gc-form-group">
                <label htmlFor="tarif">
                  <DollarSign size={16} />
                  Tarif (DH) <span className="gc-required">*</span>
                </label>
                <input
                  type="number"
                  id="tarif"
                  name="tarif"
                  value={formData.tarif}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`gc-input ${errors.tarif ? 'gc-input-error' : ''}`}
                />
                {errors.tarif && (
                  <span className="gc-error-message">{errors.tarif}</span>
                )}
              </div>
              
              <div className="gc-form-group gc-full-width">
                <label htmlFor="nomterrain">
                  Nom terrain
                </label>
                <input
                  type="text"
                  id="nomterrain"
                  name="nomterrain"
                  value={formData.nomterrain}
                  onChange={handleInputChange}
                  placeholder="Terrain central..."
                  className="gc-input"
                />
              </div>
            </div>
            
            <div className="gc-form-actions">
              <button type="submit" className="gc-btn gc-btn-primary">
                <Save size={16} />
                {isEditing ? 'Modifier' : 'Créer'}
              </button>
              <button type="button" className="gc-btn gc-btn-secondary" onClick={onClose}>
                <X size={16} />
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
const Crenau = () => {
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
  const [stats, setStats] = useState({
    total_creneaux: 0,
    disponibles: 0,
    reserves: 0,
    maintenance: 0,
    terrains_actifs: 0,
    tarif_moyen: 0
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  const fetchCreneaux = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backend-foot-omega.vercel.app/api/gestioncreneaux/');
      const result = await response.json();
      
      if (result.success) {
        setCreneaux(result.data);
        showToast('Créneaux chargés avec succès', 'success');
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

  const fetchStats = async () => {
    try {
      const response = await fetch('https://backend-foot-omega.vercel.app/api/gestioncreneaux/statistiques/overview');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      calculateLocalStats();
    }
  };

  const calculateLocalStats = () => {
    if (creneaux.length > 0) {
      const total = creneaux.length;
      const disponibles = creneaux.filter(c => c.statut === 'disponible').length;
      const reserves = creneaux.filter(c => c.statut === 'réservé').length;
      const maintenance = creneaux.filter(c => c.statut === 'maintenance').length;
      const terrainsUniques = new Set(creneaux.map(c => c.numeroterrain)).size;
      const tarifMoyen = creneaux.reduce((acc, c) => acc + parseFloat(c.tarif || 0), 0) / total;
      
      setStats({
        total_creneaux: total,
        disponibles,
        reserves,
        maintenance,
        terrains_actifs: terrainsUniques,
        tarif_moyen: tarifMoyen || 0
      });
    }
  };

  const fetchFilteredCreneaux = async () => {
    try {
      setLoading(true);
      
      let filtered = [...creneaux];
      
      if (filters.date) {
        filtered = filtered.filter(c => c.datecreneaux === filters.date);
      }
      
      if (filters.statut) {
        filtered = filtered.filter(c => c.statut === filters.statut);
      }
      
      if (filters.terrain) {
        filtered = filtered.filter(c => c.numeroterrain.toString() === filters.terrain);
      }
      
      setCreneaux(filtered);
      showToast(`${filtered.length} créneau(x) trouvé(s)`, 'success');
      
    } catch (error) {
      showToast('Erreur lors du filtrage', 'error');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreneaux();
  }, []);

  useEffect(() => {
    if (creneaux.length > 0) {
      fetchStats();
    }
  }, [creneaux]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({ date: '', statut: '', terrain: '' });
    fetchCreneaux();
  };

  const checkReservationExists = async (creneauData) => {
    try {
      const response = await fetch('https://backend-foot-omega.vercel.app/api/reservation');
      const result = await response.json();
      
      if (result.success) {
        const reservation = result.data.find(r => 
          r.numeroterrain == creneauData.numeroterrain &&
          r.datereservation === creneauData.datecreneaux &&
          r.heurereservation === creneauData.heure &&
          r.statut === 'confirmée'
        );
        return !!reservation;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification des réservations:', error);
      return false;
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (!creneauModal.isEditing) {
        const existingCreneau = creneaux.find(c => 
          c.datecreneaux === formData.datecreneaux && 
          c.heure === formData.heure && 
          c.numeroterrain.toString() === formData.numeroterrain.toString()
        );
        
        if (existingCreneau) {
          showToast('Un créneau existe déjà pour cette date, heure et terrain', 'error');
          return;
        }
      }

      if (formData.statut === 'disponible') {
        const hasReservation = await checkReservationExists(formData);
        if (hasReservation) {
          showToast('Impossible de mettre ce créneau disponible car il a une réservation confirmée', 'error');
          return;
        }
      }

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
        showToast(creneauModal.isEditing ? 'Créneau modifié avec succès' : 'Créneau ajouté avec succès', 'success');
        setCreneauModal({ show: false, creneau: null, isEditing: false });
        await fetchCreneaux();
      } else {
        showToast(result.message || 'Erreur lors de l\'opération', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (creneau) => {
    setCreneauModal({ show: true, creneau, isEditing: true });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) return;
    
    try {
      const creneauToDelete = creneaux.find(c => c.idcreneaux === id);
      if (creneauToDelete && creneauToDelete.statut === 'réservé') {
        const hasReservation = await checkReservationExists(creneauToDelete);
        if (hasReservation) {
          showToast('Impossible de supprimer ce créneau car il a une réservation confirmée', 'error');
          return;
        }
      }
      
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/gestioncreneaux/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('Créneau supprimé avec succès', 'success');
        await fetchCreneaux();
      } else {
        showToast(result.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion au serveur', 'error');
      console.error('Erreur:', error);
    }
  };

  const handleView = (creneau) => {
    setViewModal({ show: true, creneau });
  };

  const openAddModal = () => {
    setCreneauModal({ show: true, creneau: null, isEditing: false });
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

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
        {stats && (
          <section className="gc-stats-section">
            <h2 className="gc-section-title">
              <BarChart3 size={22} />
              Tableau de bord
            </h2>
            <div className="gc-stats-grid">
              <div className="gc-stat-card">
                <div className="gc-stat-icon">
                  <Calendar size={28} />
                </div>
                <div className="gc-stat-content">
                  <div className="gc-stat-value">{stats.total_creneaux || 0}</div>
                  <div className="gc-stat-label">Total créneaux</div>
                </div>
              </div>
              <div className="gc-stat-card">
                <div className="gc-stat-icon">
                  <CheckCircle size={28} />
                </div>
                <div className="gc-stat-content">
                  <div className="gc-stat-value">{stats.disponibles || 0}</div>
                  <div className="gc-stat-label">Disponibles</div>
                </div>
              </div>
              <div className="gc-stat-card">
                <div className="gc-stat-icon">
                  <Users size={28} />
                </div>
                <div className="gc-stat-content">
                  <div className="gc-stat-value">{stats.reserves || 0}</div>
                  <div className="gc-stat-label">Réservés</div>
                </div>
              </div>
              <div className="gc-stat-card">
                <div className="gc-stat-icon">
                  <AlertCircle size={28} />
                </div>
                <div className="gc-stat-content">
                  <div className="gc-stat-value">{stats.maintenance || 0}</div>
                  <div className="gc-stat-label">Maintenance</div>
                </div>
              </div>
              <div className="gc-stat-card">
                <div className="gc-stat-icon">
                  <MapPin size={28} />
                </div>
                <div className="gc-stat-content">
                  <div className="gc-stat-value">{stats.terrains_actifs || 0}</div>
                  <div className="gc-stat-label">Terrains actifs</div>
                </div>
              </div>
              <div className="gc-stat-card">
                <div className="gc-stat-icon">
                  <DollarSign size={28} />
                </div>
                <div className="gc-stat-content">
                  <div className="gc-stat-value">{parseFloat(stats.tarif_moyen || 0).toFixed(2)} DH</div>
                  <div className="gc-stat-label">Tarif moyen</div>
                </div>
              </div>
            </div>
          </section>
        )}

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

        <section className="gc-filters-section">
          <h2 className="gc-section-title">
            <Filter size={22} />
            Filtres avancés
          </h2>
          <div className="gc-filters">
            <div className="gc-filter-group">
              <label htmlFor="filter-date">
                <Calendar size={16} />
                Date
              </label>
              <input
                type="date"
                id="filter-date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="gc-filter-input"
              />
            </div>
            
            <div className="gc-filter-group">
              <label htmlFor="filter-statut">
                <Settings size={16} />
                Statut
              </label>
              <select
                id="filter-statut"
                name="statut"
                value={filters.statut}
                onChange={handleFilterChange}
                className="gc-filter-select"
              >
                <option value="">Tous</option>
                <option value="disponible">Disponible</option>
                <option value="réservé">Réservé</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="gc-filter-group">
              <label htmlFor="filter-terrain">
                <MapPin size={16} />
                N° Terrain
              </label>
              <input
                type="number"
                id="filter-terrain"
                name="terrain"
                value={filters.terrain}
                onChange={handleFilterChange}
                min="1"
                className="gc-filter-input"
                placeholder="N° terrain"
              />
            </div>
            
            <div className="gc-filter-actions">
              <button 
                className="gc-btn gc-btn-primary" 
                onClick={fetchFilteredCreneaux}
              >
                <Search size={16} />
                Appliquer
              </button>
              <button 
                className="gc-btn gc-btn-outline" 
                onClick={resetFilters}
              >
                <RefreshCw size={16} />
                Réinitialiser
              </button>
            </div>
          </div>
        </section>

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
                    <th>Terrain</th>
                    <th>Type</th>
                    <th>Surface</th>
                    <th>Nom</th>
                    <th>Tarif</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creneaux.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="gc-no-data">
                        <div className="gc-no-data-content">
                          <FileText size={48} />
                          <p>Aucun créneau trouvé</p>
                          <button className="gc-btn gc-btn-primary" onClick={openAddModal}>
                            <Plus size={16} />
                            Ajouter un créneau
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    creneaux.map((creneau, index) => (
                      <tr key={creneau.idcreneaux || index} className="gc-table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                        <td>
                          <span className="gc-id-badge">#{creneau.idcreneaux}</span>
                        </td>
                        <td className="gc-date-cell">
                          <div className="gc-cell-content">
                            <Calendar size={14} className="gc-cell-icon" />
                            {formatDate(creneau.datecreneaux)}
                          </div>
                        </td>
                        <td>
                          <div className="gc-cell-content">
                            <Clock size={14} className="gc-cell-icon" />
                            <span className="gc-time-badge">{creneau.heure}</span>
                          </div>
                        </td>
                        <td>
                          <div className="gc-cell-content">
                            <Clock size={14} className="gc-cell-icon" />
                            {creneau.heurefin ? 
                              <span className="gc-time-badge">{creneau.heurefin}</span> : 
                              '-'
                            }
                          </div>
                        </td>
                        <td className="gc-status-cell">
                          <span className={`gc-status-badge gc-status-${creneau.statut || 'disponible'}`}>
                            {creneau.statut === 'disponible' && <CheckCircle size={14} />}
                            {creneau.statut === 'réservé' && <Users size={14} />}
                            {creneau.statut === 'maintenance' && <AlertCircle size={14} />}
                            <span className="gc-status-text">{creneau.statut || 'disponible'}</span>
                          </span>
                        </td>
                        <td>
                          <div className="gc-cell-content">
                            <MapPin size={14} className="gc-cell-icon" />
                            <span className="gc-terrain-number">N°{creneau.numeroterrain}</span>
                          </div>
                        </td>
                        <td>
                          <div className="gc-cell-content">
                            <Tag size={14} className="gc-cell-icon" />
                            {creneau.typeterrain ? (
                              <span className={`gc-type-badge gc-type-${creneau.typeterrain.toLowerCase()}`}>
                                {creneau.typeterrain}
                              </span>
                            ) : '-'}
                          </div>
                        </td>
                        <td>
                          {creneau.surfaceterrains ? (
                            <span className={`gc-surface-badge gc-surface-${creneau.surfaceterrains.toLowerCase().replace('x', '')}`}>
                              {creneau.surfaceterrains}
                            </span>
                          ) : '-'}
                        </td>
                        <td>
                          <span className="gc-name-text">{creneau.nomterrain || '-'}</span>
                        </td>
                        <td className="gc-price-cell">
                          <div className="gc-cell-content">
                            <DollarSign size={14} className="gc-price-icon" />
                            <span className="gc-price-value">{creneau.tarif} DH</span>
                          </div>
                        </td>
                        <td>
                          <div className="gc-actions-container">
                            <button 
                              className="gc-action-btn gc-view-btn" 
                              onClick={() => handleView(creneau)}
                              title="Voir les détails"
                            >
                              <Eye size={16} />
                              <span className="gc-action-tooltip">Voir</span>
                            </button>
                            <button 
                              className="gc-action-btn gc-edit-btn" 
                              onClick={() => handleEdit(creneau)}
                              title="Modifier"
                            >
                              <Edit size={16} />
                              <span className="gc-action-tooltip">Modifier</span>
                            </button>
                            <button 
                              className="gc-action-btn gc-delete-btn" 
                              onClick={() => handleDelete(creneau.idcreneaux)}
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                              <span className="gc-action-tooltip">Supprimer</span>
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

      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}

      {viewModal.show && (
        <ViewModal 
          creneau={viewModal.creneau} 
          onClose={() => setViewModal({ show: false, creneau: null })} 
        />
      )}

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

export default Crenau;