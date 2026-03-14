import React, { useState, useEffect } from 'react';
import { User, Clock, Calendar, CheckCircle, Clock as PendingIcon, XCircle } from 'lucide-react';
import './gestiheader.css';

const HeaderDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
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
  const username = "Jean Dupont";

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
        setError('Impossible de charger les statuts du jour');
      } finally {
        setLoading(false);
      }
    };

    fetchTodayStatusCounts();

    // Rafraîchir toutes les 30 secondes pour rester à jour
    const interval = setInterval(fetchTodayStatusCounts, 30000);

    return () => clearInterval(interval);
  }, [previousCounts.confirmed, previousCounts.pending, previousCounts.cancelled]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir la date du jour formatée pour l'affichage
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long'
  });

  return (
    <header className="hd-header">
      <div className="hd-container">
        {/* Compensation pour la sidebar */}
        <div className="hd-sidebar-space"></div>
        
        <div className="hd-content">
          <div className="hd-time-container">
            <div className="hd-time-card">
              <div className="hd-time-icon-container">
                <Clock size={22} className="hd-time-icon" />
              </div>
              <div className="hd-time-info">
                <span className="hd-current-time">{formatTime(currentTime)}</span>
                <div className="hd-date-info">
                  <Calendar size={16} className="hd-date-icon" />
                  <span className="hd-current-date">{formatDate(currentTime)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section des statuts de réservation du jour */}
          <div className="hd-status-container">
            {loading ? (
              <div className="hd-status-loading">
                <div className="hd-status-loading-spinner"></div>
                <span>Chargement du jour...</span>
              </div>
            ) : error ? (
              <div className="hd-status-error">
                <XCircle size={16} />
                <span>{error}</span>
              </div>
            ) : (
              <>
                {/* Statut Confirmé du jour */}
                <div className={`hd-status-card hd-status-confirmed ${updatingStatus === 'confirmed' ? 'has-update' : ''}`}>
                  <div className="hd-status-icon-container">
                    <CheckCircle size={20} className="hd-status-icon" />
                  </div>
                  <div className="hd-status-info">
                    <span className="hd-status-label">Confirmées</span>
                    <div className="hd-status-value">
                      <span className={`hd-status-number ${updatingStatus === 'confirmed' ? 'hd-status-number-update' : ''}`}>
                        {statusCounts.confirmed}
                      </span>
                      <span className="hd-status-unit">ajd</span>
                    </div>
                  </div>
                  {updatingStatus === 'confirmed' && <div className="hd-status-badge">+1</div>}
                </div>

                {/* Statut En Attente du jour */}
                <div className={`hd-status-card hd-status-pending ${updatingStatus === 'pending' ? 'has-update' : ''}`}>
                  <div className="hd-status-icon-container">
                    <PendingIcon size={20} className="hd-status-icon" />
                  </div>
                  <div className="hd-status-info">
                    <span className="hd-status-label">En attente</span>
                    <div className="hd-status-value">
                      <span className={`hd-status-number ${updatingStatus === 'pending' ? 'hd-status-number-update' : ''}`}>
                        {statusCounts.pending}
                      </span>
                      <span className="hd-status-unit">ajd</span>
                    </div>
                  </div>
                  {updatingStatus === 'pending' && <div className="hd-status-badge">+1</div>}
                </div>

                {/* Statut Annulé du jour */}
                <div className={`hd-status-card hd-status-cancelled ${updatingStatus === 'cancelled' ? 'has-update' : ''}`}>
                  <div className="hd-status-icon-container">
                    <XCircle size={20} className="hd-status-icon" />
                  </div>
                  <div className="hd-status-info">
                    <span className="hd-status-label">Annulées</span>
                    <div className="hd-status-value">
                      <span className={`hd-status-number ${updatingStatus === 'cancelled' ? 'hd-status-number-update' : ''}`}>
                        {statusCounts.cancelled}
                      </span>
                      <span className="hd-status-unit">ajd</span>
                    </div>
                  </div>
                  {updatingStatus === 'cancelled' && <div className="hd-status-badge">+1</div>}
                </div>
              </>
            )}
          </div>

          {/* Section utilisateur */}
          <div className="hd-user-container">
            <div className="hd-user-card">
              <div className="hd-user-avatar">
                <User size={22} className="hd-user-icon" />
              </div>
              <div className="hd-user-details">
                <span className="hd-user-greeting">Bonjour,</span>
                <span className="hd-username">{username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;