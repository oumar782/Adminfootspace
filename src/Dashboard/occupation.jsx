import React, { useState, useEffect } from 'react';
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
  MapPin
} from 'lucide-react';
import './custom.css';

const OccupationChart = () => {
  const [period, setPeriod] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredData, setHoveredData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/reservation';

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setReservations(result.data || []);
      } else {
        throw new Error(result.message || 'Erreur lors de la récupération des réservations');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Fonction pour obtenir les données par période
  const getOccupationData = () => {
    if (!reservations.length) {
      return getDefaultData();
    }

    const now = new Date();
    const stats = {
      day: [],
      week: [],
      month: []
    };

    // --- DONNÉES POUR LE JOUR (8h à 22h) ---
    const todayStr = now.toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => 
      r.datereservation === todayStr && r.statut === 'confirmée'
    );

    for (let hour = 8; hour <= 22; hour++) {
      const hourStr = `${hour}h`;
      const count = todayReservations.filter(r => {
        const resHour = parseInt(r.heurereservation?.split(':')[0] || 0);
        return resHour === hour;
      }).length;
      
      stats.day.push({
        time: hourStr,
        occupation: Math.min(100, Math.round((count / 4) * 100)),
        capacity: 100,
        count: count,
        max: 4
      });
    }

    // --- DONNÉES POUR LA SEMAINE ---
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Dimanche, 1 = Lundi...
    const mondayOffset = currentDay === 0 ? 6 : currentDay - 1;

    weekDays.forEach((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - mondayOffset + index);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = reservations.filter(r => 
        r.datereservation === dateStr && r.statut === 'confirmée'
      ).length;
      
      stats.week.push({
        time: day,
        occupation: Math.min(100, Math.round((count / 28) * 100)),
        capacity: 100,
        count: count,
        max: 28
      });
    });

    // --- DONNÉES POUR LE MOIS (4 semaines) ---
    for (let week = 0; week < 4; week++) {
      const startDate = new Date(today.getFullYear(), today.getMonth(), week * 7 + 1);
      const endDate = new Date(today.getFullYear(), today.getMonth(), (week + 1) * 7);
      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];
      
      const count = reservations.filter(r => {
        return r.datereservation >= startStr && 
               r.datereservation <= endStr && 
               r.statut === 'confirmée';
      }).length;
      
      stats.month.push({
        time: `Sem ${week + 1}`,
        occupation: Math.min(100, Math.round((count / 196) * 100)),
        capacity: 100,
        count: count,
        max: 196
      });
    }

    return stats;
  };

  // Données par défaut (quand pas de réservations)
  const getDefaultData = () => {
    const dayData = Array.from({ length: 15 }, (_, i) => {
      const hour = i + 8;
      return {
        time: `${hour}h`,
        occupation: Math.floor(Math.random() * 40) + 10,
        capacity: 100,
        count: Math.floor(Math.random() * 3) + 1,
        max: 4
      };
    });

    const weekData = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => ({
      time: day,
      occupation: Math.floor(Math.random() * 50) + 30,
      capacity: 100,
      count: Math.floor(Math.random() * 20) + 5,
      max: 28
    }));

    const monthData = Array.from({ length: 4 }, (_, i) => ({
      time: `Sem ${i + 1}`,
      occupation: Math.floor(Math.random() * 40) + 40,
      capacity: 100,
      count: Math.floor(Math.random() * 80) + 40,
      max: 196
    }));

    return { day: dayData, week: weekData, month: monthData };
  };

  // Récupérer les données pour la période sélectionnée
  const allData = getOccupationData();
  const data = allData[period] && allData[period].length > 0 ? allData[period] : getDefaultData()[period];

  // Calcul des statistiques
  const averageOccupation = data.length > 0 
    ? Math.round(data.reduce((sum, item) => sum + item.occupation, 0) / data.length)
    : 0;

  const peakOccupation = data.length > 0 
    ? Math.max(...data.map(item => item.occupation))
    : 0;

  const totalReservations = reservations.filter(r => r.statut === 'confirmée').length;

  // Rendu du skeleton de chargement
  const renderChartSkeleton = () => (
    <div className="chart-skeleton">
      <div className="skeleton-header" style={{ height: '30px', background: '#e0e0e0', borderRadius: '8px', marginBottom: '20px' }}></div>
      <div className="skeleton-chart" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px', gap: '10px' }}>
        {Array.from({ length: period === 'day' ? 15 : period === 'week' ? 7 : 4 }).map((_, i) => (
          <div 
            key={i} 
            className="skeleton-bar"
            style={{ 
              height: `${Math.random() * 70 + 30}%`,
              width: '100%',
              background: '#e0e0e0',
              borderRadius: '4px 4px 0 0',
              minHeight: '20px'
            }}
          ></div>
        ))}
      </div>
      <div className="skeleton-footer" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div className="skeleton-stats" style={{ flex: 1, height: '60px', background: '#e0e0e0', borderRadius: '8px' }}></div>
        <div className="skeleton-stats" style={{ flex: 1, height: '60px', background: '#e0e0e0', borderRadius: '8px' }}></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="occupation-chart-card" style={{ padding: '40px', textAlign: 'center' }}>
        <div className="error-message">
          <AlertCircle size={48} className="error-icon" color="#FF5252" />
          <p style={{ margin: '16px 0' }}>Erreur de chargement: {error}</p>
          <button 
            onClick={fetchReservations} 
            className="retry-btn"
            style={{
              padding: '10px 24px',
              background: '#1a3d06',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={16} />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="occupation-chart-card" style={{
      background: '#ffffff',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e8efe8'
    }}>
      {/* Header */}
      <div className="chart-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="header-content">
          <div className="title-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="header-icon-container" style={{
              background: 'rgba(26,61,6,0.1)',
              padding: '12px',
              borderRadius: '12px',
              color: '#1a3d06'
            }}>
              <BarChart3 size={28} className="header-icon" />
            </div>
            <div className="title-text">
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1a3d06' }}>Tableau de Bord d'Occupation</h2>
              <p className="chart-subtitle" style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6d7a86' }}>
                Surveillance en temps réel des réservations et de l'occupation des terrains
              </p>
            </div>
          </div>
        </div>
        <div className="period-selector" style={{
          display: 'flex',
          gap: '4px',
          background: '#f3f6f4',
          padding: '4px',
          borderRadius: '10px'
        }}>
          <button 
            className={`period-btn ${period === 'day' ? 'active' : ''}`}
            onClick={() => setPeriod('day')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              background: period === 'day' ? '#1a3d06' : 'transparent',
              color: period === 'day' ? '#fff' : '#6d7a86',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <Calendar size={16} />
            Aujourd'hui
          </button>
          <button 
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => setPeriod('week')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              background: period === 'week' ? '#1a3d06' : 'transparent',
              color: period === 'week' ? '#fff' : '#6d7a86',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <Calendar size={16} />
            Cette Semaine
          </button>
          <button 
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              background: period === 'month' ? '#1a3d06' : 'transparent',
              color: period === 'month' ? '#fff' : '#6d7a86',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <BarChart3 size={16} />
            Ce Mois
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="chart-content">
        {isLoading ? (
          renderChartSkeleton()
        ) : (
          <>
            {/* Graphique */}
            <div className="chart-container" style={{ marginBottom: '24px' }}>
              <div className="chart-bars" style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'flex-end',
                height: '220px',
                gap: '8px',
                padding: '0 4px',
                position: 'relative'
              }}>
                {data.map((item, index) => (
                  <div key={index} className="bar-container" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    height: '100%',
                    position: 'relative'
                  }}>
                    <div 
                      className="bar-background" 
                      style={{ 
                        width: '100%',
                        height: '100%',
                        background: '#f0f7f0',
                        borderRadius: '6px 6px 0 0',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        className="bar-fill" 
                        style={{ 
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: `${item.occupation}%`,
                          background: `linear-gradient(180deg, ${item.occupation > 70 ? '#e74c3c' : item.occupation > 40 ? '#f39c12' : '#27ae60'}, ${item.occupation > 70 ? '#c0392b' : item.occupation > 40 ? '#e67e22' : '#1a3d06'})`,
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.6s ease',
                          opacity: hoveredData === item ? 1 : 0.9,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '30px'
                        }}
                        onMouseEnter={() => setHoveredData(item)}
                        onMouseLeave={() => setHoveredData(null)}
                      >
                        <div className="occupation-label" style={{
                          position: 'absolute',
                          top: '4px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          color: item.occupation > 50 ? '#fff' : '#1a3d06',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textShadow: item.occupation > 50 ? '0 1px 4px rgba(0,0,0,0.3)' : 'none'
                        }}>
                          <span className="occupation-percent">{item.occupation}%</span>
                          <span className="occupation-details" style={{ fontSize: '0.6rem', opacity: 0.8 }}>
                            {item.count}/{item.max}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bar-label" style={{
                      marginTop: '8px',
                      fontSize: '0.7rem',
                      color: '#6d7a86',
                      fontWeight: 600
                    }}>{item.time}</div>
                  </div>
                ))}
              </div>
              
              {/* Tooltip */}
              {hoveredData && (
                <div className="chart-tooltip" style={{
                  position: 'absolute',
                  background: '#fff',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  border: '1px solid #e8efe8',
                  zIndex: 10,
                  minWidth: '200px',
                  top: '-80px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}>
                  <div className="tooltip-content">
                    <div className="tooltip-header" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span className="tooltip-title" style={{ fontWeight: 700, color: '#1a3d06' }}>
                        {hoveredData.time}
                      </span>
                      <div className="tooltip-indicator" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        color: '#1a3d06'
                      }}>
                        <div className="indicator-dot" style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#27ae60'
                        }}></div>
                        {hoveredData.occupation}% d'occupation
                      </div>
                    </div>
                    <div className="tooltip-details" style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '0.8rem',
                      color: '#6d7a86'
                    }}>
                      <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={14} />
                        <span>{hoveredData.count} réservation{hoveredData.count > 1 ? 's' : ''}</span>
                      </div>
                      <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} />
                        <span>{hoveredData.max} terrains max</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Statistiques */}
            <div className="chart-stats" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div className="stat-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                background: '#f8faf8',
                borderRadius: '12px',
                border: '1px solid #e8efe8'
              }}>
                <div className="stat-icon average" style={{
                  padding: '10px',
                  background: 'rgba(39,174,96,0.1)',
                  borderRadius: '10px',
                  color: '#27ae60'
                }}>
                  <TrendingUp size={20} />
                </div>
                <div className="stat-content" style={{ flex: 1 }}>
                  <div className="stat-labels" style={{ fontSize: '0.75rem', color: '#6d7a86', fontWeight: 600 }}>
                    Occupation moyenne
                  </div>
                  <div className="stat-values" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a3d06' }}>
                    {averageOccupation}%
                  </div>
                  <div className="stat-bar" style={{
                    width: '100%',
                    height: '4px',
                    background: '#e8efe8',
                    borderRadius: '4px',
                    marginTop: '4px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      className="stat-bar-fill" 
                      style={{ 
                        width: `${averageOccupation}%`,
                        height: '100%',
                        background: '#27ae60',
                        borderRadius: '4px',
                        transition: 'width 0.6s ease'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="stat-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                background: '#f8faf8',
                borderRadius: '12px',
                border: '1px solid #e8efe8'
              }}>
                <div className="stat-icon peak" style={{
                  padding: '10px',
                  background: 'rgba(231,76,60,0.1)',
                  borderRadius: '10px',
                  color: '#e74c3c'
                }}>
                  <Flame size={20} />
                </div>
                <div className="stat-content" style={{ flex: 1 }}>
                  <div className="stat-labels" style={{ fontSize: '0.75rem', color: '#6d7a86', fontWeight: 600 }}>
                    Pic d'occupation
                  </div>
                  <div className="stat-values" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a3d06' }}>
                    {peakOccupation}%
                  </div>
                  <div className="stat-bar" style={{
                    width: '100%',
                    height: '4px',
                    background: '#e8efe8',
                    borderRadius: '4px',
                    marginTop: '4px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      className="stat-bar-fill peak" 
                      style={{ 
                        width: `${peakOccupation}%`,
                        height: '100%',
                        background: '#e74c3c',
                        borderRadius: '4px',
                        transition: 'width 0.6s ease'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="stat-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                background: '#f8faf8',
                borderRadius: '12px',
                border: '1px solid #e8efe8'
              }}>
                <div className="stat-icon period" style={{
                  padding: '10px',
                  background: 'rgba(52,152,219,0.1)',
                  borderRadius: '10px',
                  color: '#3498db'
                }}>
                  <Zap size={20} />
                </div>
                <div className="stat-content" style={{ flex: 1 }}>
                  <div className="stat-labels" style={{ fontSize: '0.75rem', color: '#6d7a86', fontWeight: 600 }}>
                    Période analysée
                  </div>
                  <div className="stat-values" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a3d06' }}>
                    {period === 'day' ? "Aujourd'hui" : 
                     period === 'week' ? 'Cette semaine' : 
                     'Ce mois-ci'}
                  </div>
                  <div className="stat-period" style={{ fontSize: '0.7rem', color: '#95a5a6' }}>
                    {data.length} créneau{data.length > 1 ? 'x' : ''} analysé{data.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="data-info" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #e8efe8'
            }}>
              <div className="data-summary" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span className="data-badge" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  background: '#f0f7f0',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  color: '#1a3d06'
                }}>
                  <Target size={14} />
                  {totalReservations} réservations confirmées
                </span>
                <span className="data-badge" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  background: '#f0f7f0',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  color: '#1a3d06'
                }}>
                  <Clock size={14} />
                  Mis à jour à {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <button 
                onClick={fetchReservations} 
                className="refresh-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid #d0e0d0',
                  borderRadius: '8px',
                  color: '#1a3d06',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f7f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <RefreshCw size={16} />
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