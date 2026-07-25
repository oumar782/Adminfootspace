import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Flame,
  Zap,
  Target,
  Clock,
  RefreshCw,
  AlertCircle,
  Users,
  MapPin,
  Award,
  Activity,
  Sun,
  Play,
  Pause,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Importer le CSS avec les classes préfixées
import './custom.css';

const OccupationChart = () => {
  const [period, setPeriod] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredData, setHoveredData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const chartRef = useRef(null);

  const API_URL = 'https://backend-foot-omega.vercel.app/api/reservation';

  const fetchReservations = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setReservations(result.data || []);
        setLastRefresh(new Date());
      } else {
        throw new Error(result.message || 'Erreur lors de la récupération');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  useEffect(() => {
    if (!isAutoRefresh) return;
    const interval = setInterval(fetchReservations, 30000);
    return () => clearInterval(interval);
  }, [isAutoRefresh, fetchReservations]);

  const getOccupationData = useCallback(() => {
    if (!reservations.length) {
      return getDefaultData();
    }

    const now = new Date();
    const stats = { day: [], week: [], month: [] };

    // Données du jour
    const todayStr = now.toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => 
      r.datereservation === todayStr && r.statut === 'confirmée'
    );

    for (let hour = 8; hour <= 22; hour++) {
      const count = todayReservations.filter(r => {
        const resHour = parseInt(r.heurereservation?.split(':')[0] || 0);
        return resHour === hour;
      }).length;
      
      stats.day.push({
        time: `${hour}h`,
        occupation: Math.min(100, Math.round((count / 4) * 100)),
        count: count,
        max: 4,
        label: `${hour}:00`
      });
    }

    // Données de la semaine
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const currentDay = now.getDay();
    const mondayOffset = currentDay === 0 ? 6 : currentDay - 1;

    weekDays.forEach((day, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - mondayOffset + index);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = reservations.filter(r => 
        r.datereservation === dateStr && r.statut === 'confirmée'
      ).length;
      
      stats.week.push({
        time: day,
        occupation: Math.min(100, Math.round((count / 28) * 100)),
        count: count,
        max: 28,
        label: `${day} ${date.getDate()}`
      });
    });

    // Données du mois
    for (let week = 0; week < 4; week++) {
      const startDate = new Date(now.getFullYear(), now.getMonth(), week * 7 + 1);
      const endDate = new Date(now.getFullYear(), now.getMonth(), (week + 1) * 7);
      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];
      
      const count = reservations.filter(r => {
        return r.datereservation >= startStr && 
               r.datereservation <= endStr && 
               r.statut === 'confirmée';
      }).length;
      
      stats.month.push({
        time: `S${week + 1}`,
        occupation: Math.min(100, Math.round((count / 196) * 100)),
        count: count,
        max: 196,
        label: `Semaine ${week + 1}`
      });
    }

    return stats;
  }, [reservations]);

  const getDefaultData = () => {
    const dayData = Array.from({ length: 15 }, (_, i) => ({
      time: `${i + 8}h`,
      occupation: Math.floor(Math.random() * 40) + 10,
      count: Math.floor(Math.random() * 3) + 1,
      max: 4,
      label: `${i + 8}:00`
    }));

    const weekData = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => ({
      time: day,
      occupation: Math.floor(Math.random() * 50) + 30,
      count: Math.floor(Math.random() * 20) + 5,
      max: 28,
      label: day
    }));

    const monthData = Array.from({ length: 4 }, (_, i) => ({
      time: `S${i + 1}`,
      occupation: Math.floor(Math.random() * 40) + 40,
      count: Math.floor(Math.random() * 80) + 40,
      max: 196,
      label: `Semaine ${i + 1}`
    }));

    return { day: dayData, week: weekData, month: monthData };
  };

  const allData = getOccupationData();
  const data = allData[period] && allData[period].length > 0 ? allData[period] : getDefaultData()[period];

  const stats = useMemo(() => {
    const avg = data.length > 0 
      ? Math.round(data.reduce((sum, item) => sum + item.occupation, 0) / data.length)
      : 0;
    const peak = data.length > 0 
      ? Math.max(...data.map(item => item.occupation))
      : 0;
    const total = reservations.filter(r => r.statut === 'confirmée').length;
    const peakItem = data.find(item => item.occupation === peak);
    
    return { avg, peak, total, peakItem };
  }, [data, reservations]);

  const getBarGradient = (occupation) => {
    if (occupation > 70) return 'linear-gradient(180deg, #ef4444, #dc2626, #b91c1c)';
    if (occupation > 40) return 'linear-gradient(180deg, #f59e0b, #d97706, #b45309)';
    return 'linear-gradient(180deg, #22c55e, #16a34a, #15803d)';
  };

  const getBarColor = (occupation) => {
    if (occupation > 70) return '#ef4444';
    if (occupation > 40) return '#f59e0b';
    return '#22c55e';
  };

  const getPeriodLabel = () => {
    switch(period) {
      case 'day': return "Aujourd'hui";
      case 'week': return 'Cette semaine';
      case 'month': return 'Ce mois-ci';
      default: return '';
    }
  };

  const getPeriodEmoji = () => {
    switch(period) {
      case 'day': return '☀️';
      case 'week': return '📅';
      case 'month': return '📊';
      default: return '';
    }
  };

  if (error) {
    return (
      <div className="oc-chart-card" style={{ padding: '40px' }}>
        <div className="oc-error-message">
          <AlertCircle size={48} className="oc-error-icon" />
          <h3 style={{ margin: '12px 0 8px', color: '#1a3d06' }}>Erreur de chargement</h3>
          <p style={{ color: '#6d7a86', maxWidth: '400px' }}>{error}</p>
          <button onClick={fetchReservations} className="oc-retry-btn">
            <RefreshCw size={16} />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="oc-chart-card" ref={chartRef}>
      {/* Header */}
      <div className="oc-chart-header">
        <div className="oc-header-content">
          <div className="oc-title-section">
            <div className="oc-header-icon-wrap">
              <BarChart3 size={28} className="oc-header-icon" />
            </div>
            <div className="oc-title-text">
              <h2>Tableau de Bord d'Occupation</h2>
              <p className="oc-chart-subtitle">
                <span className="oc-live-indicator">
                  <span className="oc-live-dot" />
                  Live
                </span>
                <span className="oc-status-badge">
                  <Activity size={14} />
                  {reservations.length} réservations
                </span>
                <span className="oc-status-badge">
                  <Clock size={14} />
                  {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </p>
            </div>
          </div>
          <div className="oc-period-selector">
            <button 
              className={`oc-period-btn ${period === 'day' ? 'oc-active' : ''}`}
              onClick={() => setPeriod('day')}
            >
              <Calendar size={16} />
              <span>Jour</span>
            </button>
            <button 
              className={`oc-period-btn ${period === 'week' ? 'oc-active' : ''}`}
              onClick={() => setPeriod('week')}
            >
              <Calendar size={16} />
              <span>Semaine</span>
            </button>
            <button 
              className={`oc-period-btn ${period === 'month' ? 'oc-active' : ''}`}
              onClick={() => setPeriod('month')}
            >
              <BarChart3 size={16} />
              <span>Mois</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="oc-chart-content">
        {isLoading ? (
          <div className="oc-chart-skeleton">
            <div className="oc-skeleton-header" />
            <div className="oc-skeleton-chart">
              {Array.from({ length: period === 'day' ? 15 : period === 'week' ? 7 : 4 }).map((_, i) => (
                <div key={i} className="oc-skeleton-bar" style={{ height: `${Math.random() * 60 + 20}%` }} />
              ))}
            </div>
            <div className="oc-skeleton-footer">
              <div className="oc-skeleton-stats" />
              <div className="oc-skeleton-stats" />
              <div className="oc-skeleton-stats" />
            </div>
          </div>
        ) : (
          <>
            {/* Graphique */}
            <div className="oc-chart-container">
              <div className="oc-chart-actions">
                <button 
                  className={`oc-chart-action-btn ${isAutoRefresh ? 'oc-active' : ''}`}
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  title={isAutoRefresh ? 'Auto-refresh activé' : 'Auto-refresh désactivé'}
                >
                  {isAutoRefresh ? <Play size={14} /> : <Pause size={14} />}
                </button>
                <button 
                  className="oc-chart-action-btn" 
                  onClick={fetchReservations}
                  title="Actualiser"
                >
                  <RefreshCw size={14} className={isRefreshing ? 'oc-btn-spinner' : ''} />
                </button>
                <button 
                  className="oc-chart-action-btn" 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                >
                  {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
              </div>

              <div className="oc-bars-wrapper">
                <div className="oc-bars">
                  {data.map((item, index) => {
                    const barGradient = getBarGradient(item.occupation);
                    const barColor = getBarColor(item.occupation);
                    const isHovered = hoveredData === item;
                    
                    return (
                      <div 
                        key={index} 
                        className="oc-bar-container"
                        onMouseEnter={() => setHoveredData(item)}
                        onMouseLeave={() => setHoveredData(null)}
                      >
                        <div className="oc-bar-wrapper">
                          <div 
                            className="oc-bar-fill"
                            style={{
                              height: `${Math.max(item.occupation, 5)}%`,
                              background: barGradient,
                              boxShadow: isHovered ? `0 4px 24px ${barColor}40` : 'none',
                              transform: isHovered ? 'scaleY(1.02)' : 'scaleY(1)',
                              transformOrigin: 'bottom'
                            }}
                          >
                            <div className="oc-bar-shine" />
                            <div className="oc-occupation-label">
                              <span className="oc-occupation-percent">{item.occupation}%</span>
                              <span className="oc-occupation-details">
                                {item.count}/{item.max} créneaux
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="oc-bar-label">{item.time}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Tooltip */}
                {hoveredData && (
                  <div className="oc-chart-tooltip" style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: '100%',
                    marginBottom: '12px'
                  }}>
                    <div className="oc-tooltip-content">
                      <div className="oc-tooltip-header">
                        <span className="oc-tooltip-title">{hoveredData.label || hoveredData.time}</span>
                        <div className="oc-tooltip-indicator">
                          <span className="oc-indicator-dot" />
                          {hoveredData.occupation}% d'occupation
                        </div>
                      </div>
                      <div className="oc-tooltip-details">
                        <div className="oc-detail-item">
                          <Users size={14} />
                          {hoveredData.count} réservation{hoveredData.count > 1 ? 's' : ''}
                        </div>
                        <div className="oc-detail-item">
                          <MapPin size={14} />
                          {hoveredData.max} terrains max
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques */}
            <div className="oc-chart-stats">
              <div className="oc-stat-item">
                <div className="oc-stat-glow" />
                <div className="oc-stat-icon oc-average">
                  <TrendingUp size={22} />
                </div>
                <div className="oc-stat-content">
                  <div className="oc-stat-labels">Occupation moyenne</div>
                  <div className="oc-stat-values">{stats.avg}%</div>
                  <div className="oc-stat-bar">
                    <div className="oc-stat-bar-fill" style={{ width: `${stats.avg}%` }} />
                  </div>
                </div>
              </div>

              <div className="oc-stat-item">
                <div className="oc-stat-glow" />
                <div className="oc-stat-icon oc-peak">
                  <Flame size={22} />
                </div>
                <div className="oc-stat-content">
                  <div className="oc-stat-labels">Pic d'occupation</div>
                  <div className="oc-stat-values">{stats.peak}%</div>
                  <div className="oc-stat-bar">
                    <div className="oc-stat-bar-fill oc-peak" style={{ width: `${stats.peak}%` }} />
                  </div>
                  {stats.peakItem && (
                    <div className="oc-stat-period">
                      {stats.peakItem.time} • {stats.peakItem.count} réservations
                    </div>
                  )}
                </div>
              </div>

              <div className="oc-stat-item">
                <div className="oc-stat-glow" />
                <div className="oc-stat-icon oc-total">
                  <Target size={22} />
                </div>
                <div className="oc-stat-content">
                  <div className="oc-stat-labels">Total réservations</div>
                  <div className="oc-stat-values">{stats.total}</div>
                  <div className="oc-stat-period">
                    {getPeriodEmoji()} {getPeriodLabel()}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="oc-data-info">
              <div className="oc-data-summary">
                <span className="oc-data-badge">
                  <span className="oc-badge-dot oc-green" />
                  {period === 'day' ? 'Temps réel' : period === 'week' ? 'Hebdomadaire' : 'Mensuel'}
                </span>
                <span className="oc-data-badge">
                  <span className="oc-badge-dot oc-blue" />
                  {data.length} créneaux
                </span>
                <span className="oc-data-badge">
                  <span className="oc-badge-dot oc-purple" />
                  {reservations.filter(r => r.statut === 'confirmée').length} confirmées
                </span>
              </div>
              <button className="oc-refresh-btn" onClick={fetchReservations}>
                <RefreshCw size={16} className={isRefreshing ? 'oc-btn-spinner' : ''} />
                Actualiser
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OccupationChart;