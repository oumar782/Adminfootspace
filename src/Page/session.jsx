// pages/AdminSessions.jsx
import React, { useState, useEffect } from 'react';
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
  Users,
  FileText,
  AlertCircle,
  Settings,
  Save,
  BarChart3,
  Award,
  Home,
  Navigation,
  User,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Trophy,
  UserPlus,
  TrendingUp,
  Activity
} from 'lucide-react';
import './session.css';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`as-toast as-toast-${type}`}>
      <span className="as-toast-icon">
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </span>
      <span className="as-toast-message">{message}</span>
      <button className="as-toast-close" onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  );
};

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [stats, setStats] = useState({
    total_sessions: 0,
    ouvertes: 0,
    pleines: 0,
    completed: 0,
    cancelled: 0,
    total_inscrits: 0,
    sports_disponibles: 0,
    villes_disponibles: 0
  });
  const [filters, setFilters] = useState({
    sport: '',
    ville: '',
    status: '',
    search: ''
  });
  const [expandedFilters, setExpandedFilters] = useState(false);

  const [formData, setFormData] = useState({
    sport: '',
    date: '',
    heure: '',
    heurefin: '',
    terrain: '',
    ville: '',
    quartier: '',
    creator_name: '',
    creator_email: '',
    creator_phone: '',
    players_needed: 10
  });

  const API_URL = 'http://localhost:5000/api/sessions';
  const SPORTS = ['football', 'tennis', 'basketball', 'volleyball', 'handball', 'padel', 'badminton'];
  const STATUSES = ['open', 'full', 'completed', 'cancelled'];

  // Toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  // Récupérer les sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.sport) params.append('sport', filters.sport);
      if (filters.ville) params.append('ville', filters.ville);
      if (filters.status) params.append('status', filters.status);
      
      const url = `${API_URL}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setSessions(result.data);
        const data = result.data;
        setStats({
          total_sessions: data.length,
          ouvertes: data.filter(s => s.status === 'open').length,
          pleines: data.filter(s => s.status === 'full').length,
          completed: data.filter(s => s.status === 'completed').length,
          cancelled: data.filter(s => s.status === 'cancelled').length,
          total_inscrits: data.reduce((acc, s) => acc + (s.current_players || 0), 0),
          sports_disponibles: new Set(data.map(s => s.sport)).size,
          villes_disponibles: new Set(data.map(s => s.ville).filter(Boolean)).size
        });
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [filters.sport, filters.ville, filters.status]);

  // Gestion des filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ sport: '', ville: '', status: '', search: '' });
    fetchSessions();
  };

  // Gestion du formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Ouvrir/fermer les modals
  const openAddModal = () => {
    setFormData({
      sport: '',
      date: '',
      heure: '',
      heurefin: '',
      terrain: '',
      ville: '',
      quartier: '',
      creator_name: '',
      creator_email: '',
      creator_phone: '',
      players_needed: 10
    });
    setEditingSession(null);
    setShowFormModal(true);
  };

  const openEditModal = (session) => {
    setFormData({
      sport: session.sport || '',
      date: session.date || '',
      heure: session.heure || '',
      heurefin: session.heurefin || '',
      terrain: session.terrain || '',
      ville: session.ville || '',
      quartier: session.quartier || '',
      creator_name: session.creator_name || '',
      creator_email: session.creator_email || '',
      creator_phone: session.creator_phone || '',
      players_needed: session.players_needed || 10
    });
    setEditingSession(session);
    setShowFormModal(true);
  };

  const openViewModal = (session) => {
    setSelectedSession(session);
    setShowViewModal(true);
  };

  const closeModal = () => {
    setShowFormModal(false);
    setShowViewModal(false);
    setSelectedSession(null);
    setEditingSession(null);
  };

  // CRUD Operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSession 
        ? `${API_URL}/${editingSession.id}`
        : `${API_URL}/`;
      const method = editingSession ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        showToast(editingSession ? 'Session modifiee avec succes' : 'Session creee avec succes');
        closeModal();
        fetchSessions();
      } else {
        showToast(result.message || 'Erreur lors de l\'operation', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Etes-vous sur de vouloir supprimer cette session ?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        showToast('Session supprimee avec succes');
        fetchSessions();
      } else {
        showToast(result.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: 'Ouvert',
      full: 'Complet',
      completed: 'Termine',
      cancelled: 'Annule'
    };
    return labels[status] || status;
  };

  const getSportColor = (sport) => {
    const colors = {
      football: '#0a750d',
      tennis: '#ffd700',
      basketball: '#e67e22',
      volleyball: '#8e44ad',
      handball: '#2980b9',
      padel: '#27ae60',
      badminton: '#e74c3c'
    };
    return colors[sport?.toLowerCase()] || '#0a750d';
  };

  // Remplacer les emojis par des lettres
  const getSportInitial = (sport) => {
    const initials = {
      'football': 'F',
      'tennis': 'T',
      'basketball': 'B',
      'volleyball': 'V',
      'handball': 'H',
      'padel': 'P',
      'badminton': 'Bad'
    };
    return initials[sport?.toLowerCase()] || sport?.charAt(0).toUpperCase() || '?';
  };

  const filteredSessions = sessions.filter(session => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      session.terrain?.toLowerCase().includes(searchLower) ||
      session.creator_name?.toLowerCase().includes(searchLower) ||
      session.sport?.toLowerCase().includes(searchLower) ||
      session.ville?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="as-container">
      <header className="as-header">
        <div className="as-header-content">
          <div className="as-header-left">
            <div className="as-header-icon">
              <Trophy size={28} />
            </div>
            <div>
              <h1 className="as-main-title">
                <span className="as-title-glow">Administration</span> des Sessions
              </h1>
              <p className="as-header-subtitle">
                Ge rer efficacement les sessions sportives PlayZone
              </p>
            </div>
          </div>
          <div className="as-header-right">
            <div className="as-header-badge">
              <Activity size={16} />
              <span>{sessions.length} actives</span>
            </div>
          </div>
        </div>
      </header>

      <main className="as-main">
        {/* Statistiques */}
        <section className="as-stats-section">
          <div className="as-section-header">
            <h2 className="as-section-title">
              <BarChart3 size={22} />
              Tableau de bord
            </h2>
            <span className="as-section-subtitle">Apercu en temps reel</span>
          </div>
          <div className="as-stats-grid">
            <div className="as-stat-card">
              <div className="as-stat-icon as-stat-icon-total"><Users size={24} /></div>
              <div className="as-stat-content">
                <div className="as-stat-value">{stats.total_sessions || 0}</div>
                <div className="as-stat-label">Total sessions</div>
              </div>
              <div className="as-stat-trend up">
                <TrendingUp size={14} />
              </div>
            </div>
            <div className="as-stat-card">
              <div className="as-stat-icon as-stat-icon-open"><CheckCircle size={24} /></div>
              <div className="as-stat-content">
                <div className="as-stat-value" style={{ color: '#0a750d' }}>{stats.ouvertes || 0}</div>
                <div className="as-stat-label">Ouvertes</div>
              </div>
            </div>
            <div className="as-stat-card">
              <div className="as-stat-icon as-stat-icon-full"><Users size={24} /></div>
              <div className="as-stat-content">
                <div className="as-stat-value" style={{ color: '#f59e0b' }}>{stats.pleines || 0}</div>
                <div className="as-stat-label">Completes</div>
              </div>
            </div>
            <div className="as-stat-card">
              <div className="as-stat-icon as-stat-icon-players"><User size={24} /></div>
              <div className="as-stat-content">
                <div className="as-stat-value" style={{ color: '#3b82f6' }}>{stats.total_inscrits || 0}</div>
                <div className="as-stat-label">Total inscrits</div>
              </div>
            </div>
            <div className="as-stat-card">
              <div className="as-stat-icon as-stat-icon-sport"><Tag size={24} /></div>
              <div className="as-stat-content">
                <div className="as-stat-value" style={{ color: '#8b5cf6' }}>{stats.sports_disponibles || 0}</div>
                <div className="as-stat-label">Sports</div>
              </div>
            </div>
            <div className="as-stat-card">
              <div className="as-stat-icon as-stat-icon-city"><MapPin size={24} /></div>
              <div className="as-stat-content">
                <div className="as-stat-value" style={{ color: '#ec4899' }}>{stats.villes_disponibles || 0}</div>
                <div className="as-stat-label">Villes</div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="as-actions-section">
          <div className="as-actions-header">
            <div className="as-actions-left">
              <h2 className="as-section-title">
                <Settings size={22} />
                Gestion des sessions
              </h2>
            </div>
            <div className="as-actions-right">
              <button className="as-btn as-btn-primary" onClick={openAddModal}>
                <Plus size={18} />
                Nouvelle session
              </button>
            </div>
          </div>
        </section>

        {/* Filtres */}
        <section className="as-filters-section">
          <div className="as-filters-header" onClick={() => setExpandedFilters(!expandedFilters)}>
            <div className="as-filters-header-left">
              <Filter size={20} />
              <h2 className="as-section-title">Filtres avances</h2>
              {Object.values(filters).some(v => v) && (
                <span className="as-filters-active">Filtres actifs</span>
              )}
            </div>
            <button className="as-btn-toggle">
              {expandedFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          {expandedFilters && (
            <div className="as-filters">
              <div className="as-filter-group">
                <label><Tag size={16} /> Sport</label>
                <select name="sport" value={filters.sport} onChange={handleFilterChange} className="as-filter-select">
                  <option value="">Tous</option>
                  {SPORTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="as-filter-group">
                <label><MapPin size={16} /> Ville</label>
                <input type="text" name="ville" value={filters.ville} onChange={handleFilterChange} className="as-filter-input" placeholder="Ex: Casablanca" />
              </div>
              <div className="as-filter-group">
                <label><Settings size={16} /> Statut</label>
                <select name="status" value={filters.status} onChange={handleFilterChange} className="as-filter-select">
                  <option value="">Tous</option>
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{getStatusLabel(s)}</option>
                  ))}
                </select>
              </div>
              <div className="as-filter-group">
                <label><Search size={16} /> Recherche</label>
                <input type="text" name="search" value={filters.search} onChange={handleFilterChange} className="as-filter-input" placeholder="Terrain, createur..." />
              </div>
              <div className="as-filter-actions">
                <button className="as-btn as-btn-primary" onClick={fetchSessions}>
                  <Search size={16} /> Appliquer
                </button>
                <button className="as-btn as-btn-outline" onClick={resetFilters}>
                  <RefreshCw size={16} /> Reinitialiser
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Tableau */}
        <section className="as-table-section">
          <div className="as-table-header">
            <div className="as-table-header-left">
              <FileText size={20} />
              <h2 className="as-section-title">Liste des sessions</h2>
              <span className="as-count-badge">{filteredSessions.length}</span>
            </div>
            <button className="as-btn as-btn-outline as-btn-sm" onClick={fetchSessions}>
              <RefreshCw size={16} />
              Actualiser
            </button>
          </div>
          
          {loading ? (
            <div className="as-loading">
              <div className="as-spinner"></div>
              <p>Chargement des sessions...</p>
            </div>
          ) : (
            <div className="as-table-wrapper">
              <table className="as-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sport</th>
                    <th>Terrain</th>
                    <th>Date</th>
                    <th>Horaire</th>
                    <th>Ville</th>
                    <th>Createur</th>
                    <th>Joueurs</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="as-no-data">
                        <div className="as-no-data-content">
                          <FileText size={48} />
                          <p>Aucune session trouvee</p>
                          <button className="as-btn as-btn-primary" onClick={openAddModal}>
                            <Plus size={16} /> Creer une session
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map((s, i) => {
                      const color = getSportColor(s.sport);
                      const currentPlayers = s.current_players || 0;
                      const totalPlayers = s.players_needed || 0;

                      return (
                        <tr key={s.id} className="as-table-row" style={{ animationDelay: `${i * 0.05}s` }}>
                          <td><span className="as-id-badge">#{s.id}</span></td>
                          <td>
                            <span className="as-sport-badge" style={{ background: `${color}20`, color: color }}>
                              {getSportInitial(s.sport)} {s.sport}
                            </span>
                          </td>
                          <td>
                            <div className="as-cell-content">
                              <MapPin size={14} className="as-cell-icon" />
                              <span className="as-terrain-name">{s.terrain}</span>
                            </div>
                          </td>
                          <td>
                            <div className="as-cell-content">
                              <Calendar size={14} className="as-cell-icon" />
                              {s.date}
                            </div>
                          </td>
                          <td>
                            <div className="as-cell-content">
                              <Clock size={14} className="as-cell-icon" />
                              <span className="as-time-badge">{s.heure} - {s.heurefin}</span>
                            </div>
                          </td>
                          <td>
                            <div className="as-cell-content">
                              <Home size={14} className="as-cell-icon" />
                              {s.ville || '-'}
                            </div>
                          </td>
                          <td>
                            <div className="as-cell-content">
                              <User size={14} className="as-cell-icon" />
                              {s.creator_name}
                            </div>
                          </td>
                          <td>
                            <div className="as-cell-content">
                              <Users size={14} className="as-cell-icon" />
                              <span className="as-players-count">{currentPlayers}/{totalPlayers}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`as-status-badge as-status-${s.status}`}>
                              {s.status === 'open' && <CheckCircle size={14} />}
                              {s.status === 'full' && <Users size={14} />}
                              {s.status === 'completed' && <Award size={14} />}
                              {s.status === 'cancelled' && <XCircle size={14} />}
                              <span className="as-status-text">{getStatusLabel(s.status)}</span>
                            </span>
                          </td>
                          <td>
                            <div className="as-actions-container">
                              <button className="as-action-btn as-view-btn" onClick={() => openViewModal(s)} title="Voir">
                                <Eye size={16} />
                              </button>
                              <button className="as-action-btn as-edit-btn" onClick={() => openEditModal(s)} title="Modifier">
                                <Edit size={16} />
                              </button>
                              <button className="as-action-btn as-delete-btn" onClick={() => handleDelete(s.id)} title="Supprimer">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
      {showViewModal && selectedSession && (
        <div className="as-modal-overlay" onClick={closeModal}>
          <div className="as-modal-content as-view-modal" onClick={e => e.stopPropagation()}>
            <div className="as-modal-header">
              <h2 className="as-modal-title">
                <Eye size={22} />
                Details de la session #{selectedSession.id}
              </h2>
              <button className="as-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="as-modal-body">
              <div className="as-detail-grid">
                <div className="as-detail-item">
                  <span className="as-detail-label"><Tag size={14} /> Sport</span>
                  <span className="as-detail-value">{selectedSession.sport}</span>
                </div>
                <div className="as-detail-item">
                  <span className="as-detail-label">Statut</span>
                  <span className={`as-status-badge as-status-${selectedSession.status}`}>
                    {getStatusLabel(selectedSession.status)}
                  </span>
                </div>
                <div className="as-detail-item">
                  <span className="as-detail-label"><MapPin size={14} /> Terrain</span>
                  <span className="as-detail-value">{selectedSession.terrain}</span>
                </div>
                <div className="as-detail-item">
                  <span className="as-detail-label"><Calendar size={14} /> Date</span>
                  <span className="as-detail-value">{selectedSession.date}</span>
                </div>
                <div className="as-detail-item">
                  <span className="as-detail-label"><Clock size={14} /> Horaire</span>
                  <span className="as-detail-value">{selectedSession.heure} - {selectedSession.heurefin}</span>
                </div>
                <div className="as-detail-item">
                  <span className="as-detail-label"><Home size={14} /> Ville</span>
                  <span className="as-detail-value">{selectedSession.ville || 'N/A'}</span>
                </div>
                <div className="as-detail-item">
                  <span className="as-detail-label"><Navigation size={14} /> Quartier</span>
                  <span className="as-detail-value">{selectedSession.quartier || 'N/A'}</span>
                </div>
                <div className="as-detail-item">
                  <span className="as-detail-label"><User size={14} /> Createur</span>
                  <span className="as-detail-value">{selectedSession.creator_name}</span>
                </div>
                <div className="as-detail-item">
                  <span className="as-detail-label"><Mail size={14} /> Email</span>
                  <span className="as-detail-value">{selectedSession.creator_email || 'N/A'}</span>
                </div>
                <div className="as-detail-item">
                  <span className="as-detail-label"><Phone size={14} /> Telephone</span>
                  <span className="as-detail-value">{selectedSession.creator_phone}</span>
                </div>
                <div className="as-detail-item">
                  <span className="as-detail-label"><Users size={14} /> Joueurs</span>
                  <span className="as-detail-value">{selectedSession.current_players || 0} / {selectedSession.players_needed}</span>
                </div>
                <div className="as-detail-item as-detail-full">
                  <span className="as-detail-label">Joueurs inscrits</span>
                  <div className="as-players-list">
                    {selectedSession.players && selectedSession.players.length > 0 ? (
                      selectedSession.players.map((p, i) => (
                        <div key={i} className="as-player-item">
                          <span>{p.name}</span>
                          {p.is_creator && <span className="as-creator-badge">Createur</span>}
                        </div>
                      ))
                    ) : (
                      <span>Aucun joueur</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="as-modal-footer">
              <button className="as-btn as-btn-secondary" onClick={closeModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulaire */}
      {showFormModal && (
        <div className="as-modal-overlay" onClick={closeModal}>
          <div className="as-modal-content as-form-modal" onClick={e => e.stopPropagation()}>
            <div className="as-modal-header">
              <h2 className="as-modal-title">
                {editingSession ? <Edit size={22} /> : <Plus size={22} />}
                {editingSession ? 'Modifier' : 'Creer'} une session
              </h2>
              <button className="as-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="as-modal-body">
              <form onSubmit={handleSubmit} className="as-form">
                <div className="as-form-grid">
                  <div className="as-form-group">
                    <label htmlFor="sport">
                      <Tag size={16} /> Sport <span className="as-required">*</span>
                    </label>
                    <select
                      id="sport"
                      name="sport"
                      value={formData.sport}
                      onChange={handleFormChange}
                      required
                      className="as-select"
                    >
                      <option value="">Selectionnez un sport</option>
                      {SPORTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="as-form-group">
                    <label htmlFor="date">
                      <Calendar size={16} /> Date <span className="as-required">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      required
                      className="as-input"
                    />
                  </div>

                  <div className="as-form-group">
                    <label htmlFor="heure">
                      <Clock size={16} /> Heure debut <span className="as-required">*</span>
                    </label>
                    <input
                      type="time"
                      id="heure"
                      name="heure"
                      value={formData.heure}
                      onChange={handleFormChange}
                      required
                      className="as-input"
                    />
                  </div>

                  <div className="as-form-group">
                    <label htmlFor="heurefin">
                      <Clock size={16} /> Heure fin
                    </label>
                    <input
                      type="time"
                      id="heurefin"
                      name="heurefin"
                      value={formData.heurefin}
                      onChange={handleFormChange}
                      className="as-input"
                    />
                  </div>

                  <div className="as-form-group">
                    <label htmlFor="terrain">
                      <MapPin size={16} /> Terrain <span className="as-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="terrain"
                      name="terrain"
                      value={formData.terrain}
                      onChange={handleFormChange}
                      required
                      className="as-input"
                      placeholder="Nom du terrain"
                    />
                  </div>

                  <div className="as-form-group">
                    <label htmlFor="ville">
                      <Home size={16} /> Ville
                    </label>
                    <input
                      type="text"
                      id="ville"
                      name="ville"
                      value={formData.ville}
                      onChange={handleFormChange}
                      className="as-input"
                      placeholder="Ville"
                    />
                  </div>

                  <div className="as-form-group">
                    <label htmlFor="quartier">
                      <Navigation size={16} /> Quartier
                    </label>
                    <input
                      type="text"
                      id="quartier"
                      name="quartier"
                      value={formData.quartier}
                      onChange={handleFormChange}
                      className="as-input"
                      placeholder="Quartier"
                    />
                  </div>

                  <div className="as-form-group">
                    <label htmlFor="players_needed">
                      <Users size={16} /> Nombre de joueurs
                    </label>
                    <input
                      type="number"
                      id="players_needed"
                      name="players_needed"
                      value={formData.players_needed}
                      onChange={handleFormChange}
                      min="2"
                      max="30"
                      className="as-input"
                    />
                  </div>

                  <div className="as-form-group">
                    <label htmlFor="creator_name">
                      <User size={16} /> Nom du createur <span className="as-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="creator_name"
                      name="creator_name"
                      value={formData.creator_name}
                      onChange={handleFormChange}
                      required
                      className="as-input"
                      placeholder="Nom complet"
                    />
                  </div>

                  <div className="as-form-group">
                    <label htmlFor="creator_phone">
                      <Phone size={16} /> Telephone <span className="as-required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="creator_phone"
                      name="creator_phone"
                      value={formData.creator_phone}
                      onChange={handleFormChange}
                      required
                      className="as-input"
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div className="as-form-group as-full-width">
                    <label htmlFor="creator_email">
                      <Mail size={16} /> Email
                    </label>
                    <input
                      type="email"
                      id="creator_email"
                      name="creator_email"
                      value={formData.creator_email}
                      onChange={handleFormChange}
                      className="as-input"
                      placeholder="email@exemple.com"
                    />
                  </div>
                </div>

                <div className="as-form-actions">
                  <button type="button" className="as-btn as-btn-secondary" onClick={closeModal}>
                    <X size={16} /> Annuler
                  </button>
                  <button type="submit" className="as-btn as-btn-primary">
                    <Save size={16} /> {editingSession ? 'Modifier' : 'Creer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSessions;