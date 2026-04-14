import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  CheckCircle, 
  Clock, 
  XCircle,
  Calendar,
  Activity,
  ChevronDown,
  Settings,
  LogOut,
  Shield,
  Crown
} from 'lucide-react';
import './AdminHeader.css';

const AdminHeader = ({ collapsed, setCollapsed }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // États pour les statuts des réservations du jour
  const [statusCounts, setStatusCounts] = useState({
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousCounts, setPreviousCounts] = useState({
    confirmed: 0,
    pending: 0,
    cancelled: 0
  });
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Récupération des statuts des réservations du jour
  useEffect(() => {
    const fetchTodayStatusCounts = async () => {
      try {
        setLoading(true);
        
        // Obtenir la date du jour au format YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        
        // Appel API avec filtre sur la date du jour
        const response = await fetch(`https://backend-foot-omega.vercel.app/api/reservation?date=${today}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des réservations du jour');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          // Compter les réservations du jour par statut
          const counts = data.data.reduce((acc, reservation) => {
            const statut = reservation.statut?.toLowerCase();
            if (statut === 'confirmée' || statut === 'confirmé') {
              acc.confirmed++;
            } else if (statut === 'en attente') {
              acc.pending++;
            } else if (statut === 'annulée' || statut === 'annulé') {
              acc.cancelled++;
            }
            return acc;
          }, { confirmed: 0, pending: 0, cancelled: 0 });

          // Vérifier les changements pour l'animation
          if (previousCounts.confirmed !== 0 || previousCounts.pending !== 0 || previousCounts.cancelled !== 0) {
            if (counts.confirmed > previousCounts.confirmed) {
              setUpdatingStatus('confirmed');
              setTimeout(() => setUpdatingStatus(null), 300);
            } else if (counts.pending > previousCounts.pending) {
              setUpdatingStatus('pending');
              setTimeout(() => setUpdatingStatus(null), 300);
            } else if (counts.cancelled > previousCounts.cancelled) {
              setUpdatingStatus('cancelled');
              setTimeout(() => setUpdatingStatus(null), 300);
            }
          }

          setPreviousCounts(counts);
          setStatusCounts({
            ...counts,
            total: data.data.length
          });
          setError(null);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des statuts du jour:', err);
        setError('Impossible de charger les statuts');
      } finally {
        setLoading(false);
      }
    };

    fetchTodayStatusCounts();

    // Rafraîchir toutes les 30 secondes pour rester à jour
    const interval = setInterval(fetchTodayStatusCounts, 30000);

    return () => clearInterval(interval);
  }, [previousCounts.confirmed, previousCounts.pending, previousCounts.cancelled]);

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          className="admin-menu-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        
        <div className="admin-datetime-display">
          <div className="admin-date-text">{formatDate(currentTime)}</div>
          <div className="admin-time-text">{formatTime(currentTime)}</div>
        </div>
      </div>

      {/* Section des statuts de réservation du jour */}
      <div className="admin-status-container">
        {loading ? (
          <div className="admin-status-loading">
            <Activity className="admin-loading-spinner" size={16} />
            <span>Chargement...</span>
          </div>
        ) : error ? (
          <div className="admin-status-error">
            <XCircle size={16} />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* Statut Confirmé du jour */}
            <div className={`admin-status-card admin-status-confirmed ${updatingStatus === 'confirmed' ? 'updating' : ''}`}>
              <div className="admin-status-icon">
                <CheckCircle size={20} />
              </div>
              <div className="admin-status-info">
                <span className="admin-status-label">Confirmées</span>
                <div className="admin-status-value">
                  <span className={`admin-status-number ${updatingStatus === 'confirmed' ? 'number-updating' : ''}`}>
                    {statusCounts.confirmed}
                  </span>
                  <span className="admin-status-unit">ajd</span>
                </div>
              </div>
              {updatingStatus === 'confirmed' && <div className="admin-update-badge">+1</div>}
            </div>

            {/* Statut En Attente du jour */}
            <div className={`admin-status-card admin-status-pending ${updatingStatus === 'pending' ? 'updating' : ''}`}>
              <div className="admin-status-icon">
                <Clock size={20} />
              </div>
              <div className="admin-status-info">
                <span className="admin-status-label">En attente</span>
                <div className="admin-status-value">
                  <span className={`admin-status-number ${updatingStatus === 'pending' ? 'number-updating' : ''}`}>
                    {statusCounts.pending}
                  </span>
                  <span className="admin-status-unit">ajd</span>
                </div>
              </div>
              {updatingStatus === 'pending' && <div className="admin-update-badge">+1</div>}
            </div>

            {/* Statut Annulé du jour */}
            <div className={`admin-status-card admin-status-cancelled ${updatingStatus === 'cancelled' ? 'updating' : ''}`}>
              <div className="admin-status-icon">
                <XCircle size={20} />
              </div>
              <div className="admin-status-info">
                <span className="admin-status-label">Annulées</span>
                <div className="admin-status-value">
                  <span className={`admin-status-number ${updatingStatus === 'cancelled' ? 'number-updating' : ''}`}>
                    {statusCounts.cancelled}
                  </span>
                  <span className="admin-status-unit">ajd</span>
                </div>
              </div>
              {updatingStatus === 'cancelled' && <div className="admin-update-badge">+1</div>}
            </div>
          </>
        )}
      </div>

      <div className="admin-header-right">
        <button className="admin-notification-button">
          <Bell size={20} />
          <span className="admin-notification-badge">3</span>
        </button>

        <div className="admin-profile-dropdown">
          <button 
            className="admin-profile-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="admin-profile-avatar">
              <Crown size={20} />
            </div>
            <ChevronDown 
              size={16} 
              className={`admin-dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
            />
          </button>
          
          {isDropdownOpen && (
            <div className="admin-dropdown-menu">
              <div className="admin-dropdown-header">
                <div className="admin-profile-info">
                  <div className="admin-profile-avatar-large">
                    <Shield size={24} />
                  </div>
                  <div>
                    <div className="admin-profile-name">Super Admin</div>
                    <div className="admin-profile-role">Administrateur Système</div>
                  </div>
                </div>
              </div>
              
              <div className="admin-dropdown-divider"></div>
              
              <button className="admin-dropdown-item">
                <Settings size={16} />
                <span>Paramètres Admin</span>
              </button>
              
              <button className="admin-dropdown-item">
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
