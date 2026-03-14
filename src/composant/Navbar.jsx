import React, { useState, useEffect } from 'react';
import './Navbar.css';

const NavbarLuxe = ({ collapsed, setCollapsed }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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
    <header className="luxe-navbar">
      <div className="luxe-navbar-left">
        <button
          className="luxe-menu-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle Sidebar"
        >
          <MenuIconLuxe collapsed={collapsed} />
        </button>
        
        <div className="luxe-datetime">
          <div className="luxe-date">{formatDate(currentTime)}</div>
          <div className="luxe-time">{formatTime(currentTime)}</div>
        </div>
      </div>

      {/* Section des statuts de réservation du jour */}
      <div className="luxe-status-container">
        {loading ? (
          <div className="luxe-status-loading">
            <div className="luxe-status-loading-spinner"></div>
            <span>Chargement...</span>
          </div>
        ) : error ? (
          <div className="luxe-status-error">
            <ErrorIcon />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* Statut Confirmé du jour */}
            <div className={`luxe-status-card luxe-status-confirmed ${updatingStatus === 'confirmed' ? 'has-update' : ''}`}>
              <div className="luxe-status-icon-container">
                <CheckIcon />
              </div>
              <div className="luxe-status-info">
                <span className="luxe-status-label">Confirmées</span>
                <div className="luxe-status-value">
                  <span className={`luxe-status-number ${updatingStatus === 'confirmed' ? 'luxe-status-number-update' : ''}`}>
                    {statusCounts.confirmed}
                  </span>
                  <span className="luxe-status-unit">ajd</span>
                </div>
              </div>
              {updatingStatus === 'confirmed' && <div className="luxe-status-badge">+1</div>}
            </div>

            {/* Statut En Attente du jour */}
            <div className={`luxe-status-card luxe-status-pending ${updatingStatus === 'pending' ? 'has-update' : ''}`}>
              <div className="luxe-status-icon-container">
                <PendingIcon />
              </div>
              <div className="luxe-status-info">
                <span className="luxe-status-label">En attente</span>
                <div className="luxe-status-value">
                  <span className={`luxe-status-number ${updatingStatus === 'pending' ? 'luxe-status-number-update' : ''}`}>
                    {statusCounts.pending}
                  </span>
                  <span className="luxe-status-unit">ajd</span>
                </div>
              </div>
              {updatingStatus === 'pending' && <div className="luxe-status-badge">+1</div>}
            </div>

            {/* Statut Annulé du jour */}
            <div className={`luxe-status-card luxe-status-cancelled ${updatingStatus === 'cancelled' ? 'has-update' : ''}`}>
              <div className="luxe-status-icon-container">
                <CancelIcon />
              </div>
              <div className="luxe-status-info">
                <span className="luxe-status-label">Annulées</span>
                <div className="luxe-status-value">
                  <span className={`luxe-status-number ${updatingStatus === 'cancelled' ? 'luxe-status-number-update' : ''}`}>
                    {statusCounts.cancelled}
                  </span>
                  <span className="luxe-status-unit">ajd</span>
                </div>
              </div>
              {updatingStatus === 'cancelled' && <div className="luxe-status-badge">+1</div>}
            </div>
          </>
        )}
      </div>

      <div className="luxe-navbar-right">
        <button className="luxe-nav-icon">
          <BellIconLuxe />
          <span className="luxe-notification-badge">3</span>
        </button>

        <div className="luxe-profile-dropdown">
          <button 
            className="luxe-profile-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="luxe-profile-avatar">
              JD
            </div>
          </button>
          
          {isDropdownOpen && (
            <div className="luxe-dropdown-menu">
              <div className="luxe-dropdown-content">
                <div className="luxe-dropdown-header">
                  <div className="luxe-user-info">
                    <span className="luxe-user-name">Jean Dupont</span>
                    <span className="luxe-user-email">jean.dupont@email.com</span>
                  </div>
                </div>
                
                <button className="luxe-dropdown-item">
                  <UserIconLuxe />
                  Mon Profil
                </button>
                
                <button className="luxe-dropdown-item">
                  <SettingsIconLuxe />
                  Paramètres
                </button>
                
                <div className="luxe-dropdown-divider"></div>
                
                <button className="luxe-dropdown-item">
                  <LogoutIconLuxe />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Icônes pour les statuts
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const PendingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const CancelIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

// Icônes existantes (conservées telles quelles)
const MenuIconLuxe = ({ collapsed }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path
        d={collapsed 
          ? "M1,3 H19 M1,10 H19 M1,17 H19" 
          : "M1,3 H19 M1,10 H13 M1,17 H8"
        }
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const SearchIconLuxe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BellIconLuxe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SettingsIconLuxe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const UserIconLuxe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIconLuxe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default NavbarLuxe;