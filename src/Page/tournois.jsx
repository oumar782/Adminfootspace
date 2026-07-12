// src/Page/tournois.jsx
import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  BarChart3,
  Award,
  Home,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  FileText,
  Settings,
  Clock,
  CalendarDays,
  UserPlus,
  UserMinus,
  UserCheck,
  User
} from 'lucide-react';
import './tournoi.css'; // Vérifiez que ce fichier existe

// Si le CSS n'existe pas, créez-le ou commentez cette ligne
// import './tournois.css';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`at-toast at-toast-${type}`}>
      <span className="at-toast-icon">
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </span>
      <span className="at-toast-message">{message}</span>
      <button className="at-toast-close" onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  );
};

const AdminTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [stats, setStats] = useState({
    total_tournaments: 0,
    open_tournaments: 0,
    full_tournaments: 0,
    completed_tournaments: 0,
    cancelled_tournaments: 0,
    total_registrations: 0,
    active_sports: []
  });
  const [filters, setFilters] = useState({
    sport: '',
    status: '',
    search: ''
  });
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [teamFormData, setTeamFormData] = useState({
    team_name: '',
    captain_name: '',
    email: '',
    phone: ''
  });

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    sport: '',
    type: 'tournament',
    description: '',
    date: '',
    end_date: '',
    time: '',
    location: '',
    teams_needed: '',
    fee: '',
    status: 'open'
  });

  // 🔥 CORRECTION : Utiliser la bonne URL de l'API
  const API_URL = 'http://localhost:5000/api/tournoi';
  // Si votre API est sur un autre port, ajustez
  // const API_URL = 'http://localhost:5001/api/tournoi';

  const SPORTS = ['football', 'tennis', 'basketball', 'volleyball', 'handball', 'padel', 'badminton', 'rugby', 'pingpong'];
  const STATUSES = ['open', 'full', 'completed', 'cancelled'];
  const TYPES = ['tournament', 'league', 'cup', 'friendly'];

  // Toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  // Récupérer les tournois
  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.sport) params.append('sport', filters.sport);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      
      const url = `${API_URL}${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('🔍 Fetching:', url); // Debug
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setTournaments(result.data || []);
        try {
          const statsResponse = await fetch(`${API_URL}/statistiques/overview`);
          const statsResult = await statsResponse.json();
          if (statsResult.success) {
            setStats(statsResult.data);
          }
        } catch (statsError) {
          console.warn('Impossible de charger les statistiques:', statsError);
        }
      } else {
        showToast(result.message || 'Erreur de chargement', 'error');
      }
    } catch (error) {
      console.error('Erreur fetchTournaments:', error);
      showToast('Erreur de connexion au serveur', 'error');
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [filters.sport, filters.status]);

  // Gestion des filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ sport: '', status: '', search: '' });
    fetchTournaments();
  };

  // Gestion du formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamFormChange = (e) => {
    const { name, value } = e.target;
    setTeamFormData(prev => ({ ...prev, [name]: value }));
  };

  // Ouvrir/fermer les modals
  const openAddModal = () => {
    setFormData({
      id: '',
      name: '',
      sport: '',
      type: 'tournament',
      description: '',
      date: '',
      end_date: '',
      time: '',
      location: '',
      teams_needed: '',
      fee: '',
      status: 'open'
    });
    setEditingTournament(null);
    setShowFormModal(true);
  };

  const openEditModal = (tournament) => {
    setFormData({
      id: tournament.id || '',
      name: tournament.name || '',
      sport: tournament.sport || '',
      type: tournament.type || 'tournament',
      description: tournament.description || '',
      date: tournament.date || '',
      end_date: tournament.end_date || '',
      time: tournament.time || '',
      location: tournament.location || '',
      teams_needed: tournament.teams_needed || '',
      fee: tournament.fee || '',
      status: tournament.status || 'open'
    });
    setEditingTournament(tournament);
    setShowFormModal(true);
  };

  const openViewModal = (tournament) => {
    setSelectedTournament(tournament);
    setShowViewModal(true);
  };

  const closeModal = () => {
    setShowFormModal(false);
    setShowViewModal(false);
    setSelectedTournament(null);
    setEditingTournament(null);
    setShowTeamModal(false);
    setEditingTeam(null);
    setSelectedTeam(null);
  };

  // CRUD Tournois
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTournament 
        ? `${API_URL}/${editingTournament.id}`
        : `${API_URL}/`;
      const method = editingTournament ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        showToast(editingTournament ? 'Tournoi modifie avec succes' : 'Tournoi cree avec succes');
        closeModal();
        fetchTournaments();
      } else {
        showToast(result.message || 'Erreur lors de l\'operation', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
    }
  };

  const handleDeleteTournament = async (id) => {
    if (!window.confirm('Etes-vous sur de vouloir supprimer ce tournoi ?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        showToast('Tournoi annule avec succes');
        fetchTournaments();
      } else {
        showToast(result.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
    }
  };

  // Gestion des équipes
  const openAddTeamModal = (tournament) => {
    setSelectedTournament(tournament);
    setTeamFormData({
      team_name: '',
      captain_name: '',
      email: '',
      phone: ''
    });
    setEditingTeam(null);
    setShowTeamModal(true);
  };

  const openEditTeamModal = (tournament, team) => {
    setSelectedTournament(tournament);
    setSelectedTeam(team);
    setTeamFormData({
      team_name: team.team_name || '',
      captain_name: team.captain_name || '',
      email: team.email || '',
      phone: team.phone || ''
    });
    setEditingTeam(team);
    setShowTeamModal(true);
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${selectedTournament.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamFormData)
      });
      
      const result = await response.json();
      if (result.success) {
        showToast('Equipe ajoutee avec succes');
        setShowTeamModal(false);
        fetchTournaments();
      } else {
        showToast(result.message || 'Erreur lors de l\'ajout', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
    }
  };

  const handleEditTeam = async (e) => {
    e.preventDefault();
    try {
      const cancelResponse = await fetch(`${API_URL}/registrations/${selectedTeam.id}`, {
        method: 'DELETE'
      });
      
      if (!cancelResponse.ok) {
        showToast('Erreur lors de la modification', 'error');
        return;
      }

      const registerResponse = await fetch(`${API_URL}/${selectedTournament.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamFormData)
      });
      
      const result = await registerResponse.json();
      if (result.success) {
        showToast('Equipe modifiee avec succes');
        setShowTeamModal(false);
        fetchTournaments();
      } else {
        showToast(result.message || 'Erreur lors de la modification', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
    }
  };

  const handleDeleteTeam = async (tournamentId, registrationId) => {
    if (!window.confirm('Etes-vous sur de vouloir retirer cette equipe ?')) return;
    try {
      const response = await fetch(`${API_URL}/registrations/${registrationId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        showToast('Equipe retiree avec succes');
        fetchTournaments();
      } else {
        showToast(result.message || 'Erreur lors du retrait', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion', 'error');
    }
  };

  const getSportColor = (sport) => {
    const colors = {
      football: '#0a750d',
      tennis: '#ffd700',
      basketball: '#e67e22',
      volleyball: '#8e44ad',
      handball: '#2980b9',
      padel: '#27ae60',
      badminton: '#e74c3c',
      rugby: '#2c3e50',
      pingpong: '#e67e22'
    };
    return colors[sport?.toLowerCase()] || '#0a750d';
  };

  const getSportInitial = (sport) => {
    const initials = {
      football: 'F',
      tennis: 'T',
      basketball: 'B',
      volleyball: 'V',
      handball: 'H',
      padel: 'P',
      badminton: 'Bad',
      rugby: 'R',
      pingpong: 'PP'
    };
    return initials[sport?.toLowerCase()] || sport?.charAt(0).toUpperCase() || '?';
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

  const getTypeLabel = (type) => {
    const labels = {
      tournament: 'Tournoi',
      league: 'Ligue',
      cup: 'Coupe',
      friendly: 'Amical'
    };
    return labels[type] || type;
  };

  const filteredTournaments = tournaments.filter(tournament => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      tournament.name?.toLowerCase().includes(searchLower) ||
      tournament.sport?.toLowerCase().includes(searchLower) ||
      tournament.location?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="at-container">
      <header className="at-header">
        <div className="at-header-content">
          <div className="at-header-left">
            <div className="at-header-icon">
              <Trophy size={28} />
            </div>
            <div>
              <h1 className="at-main-title">
                <span className="at-title-glow">Administration</span> des Tournois
              </h1>
              <p className="at-header-subtitle">
                Gerer efficacement les tournois sportifs PlayZone
              </p>
            </div>
          </div>
          <div className="at-header-right">
            <div className="at-header-badge">
              <Activity size={16} />
              <span>{tournaments.length} tournois</span>
            </div>
          </div>
        </div>
      </header>

      <main className="at-main">
        <div className="at-content-wrapper">
          {/* Statistiques */}
          <section className="at-stats-section">
            <div className="at-section-header">
              <h2 className="at-section-title">
                <BarChart3 size={22} />
                Tableau de bord
              </h2>
              <span className="at-section-subtitle">Apercu en temps reel</span>
            </div>
            <div className="at-stats-grid">
              <div className="at-stat-card">
                <div className="at-stat-icon at-stat-icon-total"><Trophy size={24} /></div>
                <div className="at-stat-content">
                  <div className="at-stat-value">{stats.total_tournaments || 0}</div>
                  <div className="at-stat-label">Total tournois</div>
                </div>
                <div className="at-stat-trend up">
                  <TrendingUp size={14} />
                </div>
              </div>
              <div className="at-stat-card">
                <div className="at-stat-icon at-stat-icon-open"><CheckCircle size={24} /></div>
                <div className="at-stat-content">
                  <div className="at-stat-value" style={{ color: '#0a750d' }}>{stats.open_tournaments || 0}</div>
                  <div className="at-stat-label">Ouverts</div>
                </div>
              </div>
              <div className="at-stat-card">
                <div className="at-stat-icon at-stat-icon-full"><Users size={24} /></div>
                <div className="at-stat-content">
                  <div className="at-stat-value" style={{ color: '#f59e0b' }}>{stats.full_tournaments || 0}</div>
                  <div className="at-stat-label">Complets</div>
                </div>
              </div>
              <div className="at-stat-card">
                <div className="at-stat-icon at-stat-icon-players"><Users size={24} /></div>
                <div className="at-stat-content">
                  <div className="at-stat-value" style={{ color: '#3b82f6' }}>{stats.total_registrations || 0}</div>
                  <div className="at-stat-label">Total inscriptions</div>
                </div>
              </div>
              <div className="at-stat-card">
                <div className="at-stat-icon at-stat-icon-sport"><Tag size={24} /></div>
                <div className="at-stat-content">
                  <div className="at-stat-value" style={{ color: '#8b5cf6' }}>{stats.active_sports?.length || 0}</div>
                  <div className="at-stat-label">Sports actifs</div>
                </div>
              </div>
              <div className="at-stat-card">
                <div className="at-stat-icon at-stat-icon-city"><MapPin size={24} /></div>
                <div className="at-stat-content">
                  <div className="at-stat-value" style={{ color: '#ec4899' }}>
                    {new Set(tournaments.map(t => t.location?.split(',')[0]?.trim())).size || 0}
                  </div>
                  <div className="at-stat-label">Villes</div>
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section className="at-actions-section">
            <div className="at-actions-header">
              <div className="at-actions-left">
                <h2 className="at-section-title">
                  <Settings size={22} />
                  Gestion des tournois
                </h2>
              </div>
              <div className="at-actions-right">
                <button className="at-btn at-btn-primary" onClick={openAddModal}>
                  <Plus size={18} />
                  Nouveau tournoi
                </button>
              </div>
            </div>
          </section>

          {/* Filtres */}
          <section className="at-filters-section">
            <div className="at-filters-header" onClick={() => setExpandedFilters(!expandedFilters)}>
              <div className="at-filters-header-left">
                <Filter size={20} />
                <h2 className="at-section-title">Filtres avances</h2>
                {Object.values(filters).some(v => v) && (
                  <span className="at-filters-active">Filtres actifs</span>
                )}
              </div>
              <button className="at-btn-toggle">
                {expandedFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            {expandedFilters && (
              <div className="at-filters">
                <div className="at-filter-group">
                  <label><Tag size={16} /> Sport</label>
                  <select name="sport" value={filters.sport} onChange={handleFilterChange} className="at-filter-select">
                    <option value="">Tous</option>
                    {SPORTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="at-filter-group">
                  <label><Settings size={16} /> Statut</label>
                  <select name="status" value={filters.status} onChange={handleFilterChange} className="at-filter-select">
                    <option value="">Tous</option>
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{getStatusLabel(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="at-filter-group">
                  <label><Search size={16} /> Recherche</label>
                  <input type="text" name="search" value={filters.search} onChange={handleFilterChange} className="at-filter-input" placeholder="Nom, lieu..." />
                </div>
                <div className="at-filter-actions">
                  <button className="at-btn at-btn-primary" onClick={fetchTournaments}>
                    <Search size={16} /> Appliquer
                  </button>
                  <button className="at-btn at-btn-outline" onClick={resetFilters}>
                    <RefreshCw size={16} /> Reinitialiser
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Tableau */}
          <section className="at-table-section">
            <div className="at-table-header">
              <div className="at-table-header-left">
                <FileText size={20} />
                <h2 className="at-section-title">Liste des tournois</h2>
                <span className="at-count-badge">{filteredTournaments.length}</span>
              </div>
              <button className="at-btn at-btn-outline at-btn-sm" onClick={fetchTournaments}>
                <RefreshCw size={16} />
                Actualiser
              </button>
            </div>
            
            {loading ? (
              <div className="at-loading">
                <div className="at-spinner"></div>
                <p>Chargement des tournois...</p>
              </div>
            ) : (
              <div className="at-table-wrapper">
                <table className="at-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Sport</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Lieu</th>
                      <th>Equipes</th>
                      <th>Tarif</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTournaments.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="at-no-data">
                          <div className="at-no-data-content">
                            <FileText size={48} />
                            <p>Aucun tournoi trouve</p>
                            <button className="at-btn at-btn-primary" onClick={openAddModal}>
                              <Plus size={16} /> Creer un tournoi
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTournaments.map((tournament, i) => {
                        const color = getSportColor(tournament.sport);
                        const teamsJoined = tournament.teams_joined || 0;
                        const teamsNeeded = tournament.teams_needed || 0;

                        return (
                          <tr key={tournament.id} className="at-table-row" style={{ animationDelay: `${i * 0.05}s` }}>
                            <td><span className="at-id-badge">#{tournament.id}</span></td>
                            <td>
                              <div className="at-cell-content">
                                <span className="at-name-text">{tournament.name}</span>
                              </div>
                            </td>
                            <td>
                              <span className="at-sport-badge" style={{ background: `${color}20`, color: color }}>
                                {getSportInitial(tournament.sport)} {tournament.sport}
                              </span>
                            </td>
                            <td>
                              <span className="at-type-badge">{getTypeLabel(tournament.type)}</span>
                            </td>
                            <td>
                              <div className="at-cell-content">
                                <Calendar size={14} className="at-cell-icon" />
                                <span className="at-date-text">{tournament.date}</span>
                              </div>
                            </td>
                            <td>
                              <div className="at-cell-content">
                                <MapPin size={14} className="at-cell-icon" />
                                {tournament.location?.split(',')[0] || '-'}
                              </div>
                            </td>
                            <td>
                              <div className="at-cell-content">
                                <Users size={14} className="at-cell-icon" />
                                <span className="at-teams-count">{teamsJoined}/{teamsNeeded}</span>
                              </div>
                            </td>
                            <td>
                              <div className="at-cell-content">
                                <DollarSign size={14} className="at-cell-icon" />
                                <span className="at-fee-value">{tournament.fee || '0'} DH</span>
                              </div>
                            </td>
                            <td>
                              <span className={`at-status-badge at-status-${tournament.status}`}>
                                {tournament.status === 'open' && <CheckCircle size={14} />}
                                {tournament.status === 'full' && <Users size={14} />}
                                {tournament.status === 'completed' && <Award size={14} />}
                                {tournament.status === 'cancelled' && <XCircle size={14} />}
                                <span className="at-status-text">{getStatusLabel(tournament.status)}</span>
                              </span>
                            </td>
                            <td>
                              <div className="at-actions-container">
                                <button className="at-action-btn at-view-btn" onClick={() => openViewModal(tournament)} title="Voir">
                                  <Eye size={16} />
                                </button>
                                <button className="at-action-btn at-edit-btn" onClick={() => openEditModal(tournament)} title="Modifier">
                                  <Edit size={16} />
                                </button>
                                <button className="at-action-btn at-delete-btn" onClick={() => handleDeleteTournament(tournament.id)} title="Supprimer">
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
        </div>
      </main>

      {/* Toast */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {/* Modal Visualisation */}
      {showViewModal && selectedTournament && (
        <div className="at-modal-overlay" onClick={closeModal}>
          <div className="at-modal-content at-view-modal" onClick={e => e.stopPropagation()}>
            <div className="at-modal-header">
              <h2 className="at-modal-title">
                <Eye size={22} />
                Details du tournoi #{selectedTournament.id}
              </h2>
              <button className="at-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="at-modal-body">
              <div className="at-detail-grid">
                <div className="at-detail-item at-detail-full">
                  <div className="at-detail-profile">
                    <div className="at-detail-avatar" style={{ 
                      background: `linear-gradient(135deg, ${getSportColor(selectedTournament.sport)}, ${getSportColor(selectedTournament.sport)}dd)` 
                    }}>
                      <Trophy size={32} />
                    </div>
                    <div>
                      <div className="at-detail-name">{selectedTournament.name}</div>
                      <div className="at-detail-subtitle">{selectedTournament.sport} • {getTypeLabel(selectedTournament.type)}</div>
                    </div>
                  </div>
                </div>
                <div className="at-detail-item">
                  <span className="at-detail-label"><Trophy size={14} /> Nom</span>
                  <span className="at-detail-value">{selectedTournament.name}</span>
                </div>
                <div className="at-detail-item">
                  <span className="at-detail-label"><Tag size={14} /> Sport</span>
                  <span className="at-detail-value">{selectedTournament.sport}</span>
                </div>
                <div className="at-detail-item">
                  <span className="at-detail-label">Type</span>
                  <span className="at-detail-value">{getTypeLabel(selectedTournament.type)}</span>
                </div>
                <div className="at-detail-item">
                  <span className="at-detail-label">Statut</span>
                  <span className={`at-status-badge at-status-${selectedTournament.status}`}>
                    {getStatusLabel(selectedTournament.status)}
                  </span>
                </div>
                <div className="at-detail-item">
                  <span className="at-detail-label"><Calendar size={14} /> Date debut</span>
                  <span className="at-detail-value">{selectedTournament.date}</span>
                </div>
                <div className="at-detail-item">
                  <span className="at-detail-label"><CalendarDays size={14} /> Date fin</span>
                  <span className="at-detail-value">{selectedTournament.end_date || selectedTournament.date}</span>
                </div>
                <div className="at-detail-item">
                  <span className="at-detail-label"><Clock size={14} /> Horaire</span>
                  <span className="at-detail-value">{selectedTournament.time}</span>
                </div>
                <div className="at-detail-item">
                  <span className="at-detail-label"><MapPin size={14} /> Lieu</span>
                  <span className="at-detail-value">{selectedTournament.location}</span>
                </div>
                <div className="at-detail-item">
                  <span className="at-detail-label"><Users size={14} /> Equipes</span>
                  <span className="at-detail-value">{selectedTournament.teams_joined || 0} / {selectedTournament.teams_needed}</span>
                </div>
                <div className="at-detail-item">
                  <span className="at-detail-label"><DollarSign size={14} /> Tarif</span>
                  <span className="at-detail-value">{selectedTournament.fee || '0'} DH</span>
                </div>
                <div className="at-detail-item at-detail-full">
                  <span className="at-detail-label">Description</span>
                  <span className="at-detail-value">{selectedTournament.description || 'Aucune description'}</span>
                </div>
                
                {/* Gestion des équipes */}
                <div className="at-detail-item at-detail-full">
                  <div className="at-teams-section-header">
                    <span className="at-detail-label"><Users size={14} /> Equipes inscrites</span>
                    <button 
                      className="at-btn at-btn-sm at-btn-primary"
                      onClick={() => openAddTeamModal(selectedTournament)}
                    >
                      <UserPlus size={14} />
                      Ajouter une equipe
                    </button>
                  </div>
                  <div className="at-teams-list">
                    {selectedTournament.teamsJoined && selectedTournament.teamsJoined.length > 0 ? (
                      selectedTournament.teamsJoined.map((team, i) => (
                        <div key={i} className="at-team-item">
                          <div className="at-team-info">
                            <span className="at-team-name">{team.team_name}</span>
                            <span className="at-team-captain">Capitaine: {team.captain_name}</span>
                            <span className="at-team-email">{team.email}</span>
                            <span className="at-team-phone">{team.phone}</span>
                          </div>
                          <div className="at-team-actions">
                            <button 
                              className="at-action-btn at-edit-btn" 
                              onClick={() => openEditTeamModal(selectedTournament, team)}
                              title="Modifier"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              className="at-action-btn at-delete-btn" 
                              onClick={() => handleDeleteTeam(selectedTournament.id, team.id)}
                              title="Retirer"
                            >
                              <UserMinus size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="at-no-teams">Aucune equipe inscrite</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="at-modal-footer">
              <button className="at-btn at-btn-secondary" onClick={closeModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulaire Tournoi */}
      {showFormModal && (
        <div className="at-modal-overlay" onClick={closeModal}>
          <div className="at-modal-content at-form-modal" onClick={e => e.stopPropagation()}>
            <div className="at-modal-header">
              <h2 className="at-modal-title">
                {editingTournament ? <Edit size={22} /> : <Plus size={22} />}
                {editingTournament ? 'Modifier' : 'Creer'} un tournoi
              </h2>
              <button className="at-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="at-modal-body">
              <form onSubmit={handleSubmit} className="at-form">
                <div className="at-form-grid">
                  <div className="at-form-group">
                    <label htmlFor="id"><Tag size={16} /> ID</label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      value={formData.id}
                      onChange={handleFormChange}
                      className="at-input"
                      placeholder="Ex: t1"
                      disabled={editingTournament}
                    />
                  </div>

                  <div className="at-form-group">
                    <label htmlFor="name"><Trophy size={16} /> Nom <span className="at-required">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="at-input"
                      placeholder="Nom du tournoi"
                    />
                  </div>

                  <div className="at-form-group">
                    <label htmlFor="sport"><Tag size={16} /> Sport <span className="at-required">*</span></label>
                    <select
                      id="sport"
                      name="sport"
                      value={formData.sport}
                      onChange={handleFormChange}
                      required
                      className="at-select"
                    >
                      <option value="">Selectionnez un sport</option>
                      {SPORTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="at-form-group">
                    <label htmlFor="type"><Award size={16} /> Type</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      className="at-select"
                    >
                      {TYPES.map(t => (
                        <option key={t} value={t}>{getTypeLabel(t)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="at-form-group">
                    <label htmlFor="date"><Calendar size={16} /> Date debut <span className="at-required">*</span></label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      required
                      className="at-input"
                    />
                  </div>

                  <div className="at-form-group">
                    <label htmlFor="end_date"><CalendarDays size={16} /> Date fin</label>
                    <input
                      type="date"
                      id="end_date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleFormChange}
                      className="at-input"
                    />
                  </div>

                  <div className="at-form-group">
                    <label htmlFor="time"><Clock size={16} /> Horaire <span className="at-required">*</span></label>
                    <input
                      type="text"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleFormChange}
                      required
                      className="at-input"
                      placeholder="09:00 - 18:00"
                    />
                  </div>

                  <div className="at-form-group">
                    <label htmlFor="location"><MapPin size={16} /> Lieu <span className="at-required">*</span></label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      required
                      className="at-input"
                      placeholder="Ville, Lieu"
                    />
                  </div>

                  <div className="at-form-group">
                    <label htmlFor="teams_needed"><Users size={16} /> Nombre d'equipes <span className="at-required">*</span></label>
                    <input
                      type="number"
                      id="teams_needed"
                      name="teams_needed"
                      value={formData.teams_needed}
                      onChange={handleFormChange}
                      required
                      className="at-input"
                      placeholder="16"
                      min="2"
                    />
                  </div>

                  <div className="at-form-group">
                    <label htmlFor="fee"><DollarSign size={16} /> Tarif (DH)</label>
                    <input
                      type="text"
                      id="fee"
                      name="fee"
                      value={formData.fee}
                      onChange={handleFormChange}
                      className="at-input"
                      placeholder="250"
                    />
                  </div>

                  <div className="at-form-group">
                    <label htmlFor="status"><Settings size={16} /> Statut</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="at-select"
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{getStatusLabel(s)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="at-form-group at-full-width">
                    <label htmlFor="description"><FileText size={16} /> Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      className="at-textarea"
                      placeholder="Description du tournoi..."
                      rows="3"
                    />
                  </div>
                </div>

                <div className="at-form-actions">
                  <button type="button" className="at-btn at-btn-secondary" onClick={closeModal}>
                    <X size={16} /> Annuler
                  </button>
                  <button type="submit" className="at-btn at-btn-primary">
                    <Save size={16} /> {editingTournament ? 'Modifier' : 'Creer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestion des Equipes */}
      {showTeamModal && selectedTournament && (
        <div className="at-modal-overlay" onClick={closeModal}>
          <div className="at-modal-content at-team-modal" onClick={e => e.stopPropagation()}>
            <div className="at-modal-header">
              <h2 className="at-modal-title">
                {editingTeam ? <Edit size={22} /> : <UserPlus size={22} />}
                {editingTeam ? 'Modifier' : 'Ajouter'} une equipe
              </h2>
              <button className="at-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="at-modal-body">
              <p className="at-modal-subtitle">
                Tournoi: <strong>{selectedTournament.name}</strong>
              </p>
              <form onSubmit={editingTeam ? handleEditTeam : handleAddTeam} className="at-form">
                <div className="at-form-grid">
                  <div className="at-form-group at-full-width">
                    <label htmlFor="team_name">
                      <Users size={16} /> Nom de l'equipe <span className="at-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="team_name"
                      name="team_name"
                      value={teamFormData.team_name}
                      onChange={handleTeamFormChange}
                      required
                      className="at-input"
                      placeholder="Nom de l'equipe"
                    />
                  </div>

                  <div className="at-form-group at-full-width">
                    <label htmlFor="captain_name">
                      <User size={16} /> Nom du capitaine <span className="at-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="captain_name"
                      name="captain_name"
                      value={teamFormData.captain_name}
                      onChange={handleTeamFormChange}
                      required
                      className="at-input"
                      placeholder="Nom complet du capitaine"
                    />
                  </div>

                  <div className="at-form-group">
                    <label htmlFor="email">
                      <Mail size={16} /> Email <span className="at-required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={teamFormData.email}
                      onChange={handleTeamFormChange}
                      required
                      className="at-input"
                      placeholder="email@exemple.com"
                    />
                  </div>

                  <div className="at-form-group">
                    <label htmlFor="phone">
                      <Phone size={16} /> Telephone <span className="at-required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={teamFormData.phone}
                      onChange={handleTeamFormChange}
                      required
                      className="at-input"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div className="at-form-actions">
                  <button type="button" className="at-btn at-btn-secondary" onClick={closeModal}>
                    <X size={16} /> Annuler
                  </button>
                  <button type="submit" className="at-btn at-btn-primary">
                    <Save size={16} /> {editingTeam ? 'Modifier' : 'Ajouter'}
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

export default AdminTournaments;