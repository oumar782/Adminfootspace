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

  const API_URL = 'https://backend-foot-omega.vercel.app/api/reservation';

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setReservations(result.data);
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

  const calculateOccupationData = () => {
    if (!reservations.length) {
      return {
        day: [],
        week: [],
        month: []
      };
    }

    const now = new Date();
    
    // Données pour le jour
    const dayData = Array.from({ length: 14 }, (_, i) => {
      const hour = i + 8;
      const hourStr = `${hour}h`;
      
      const todayReservations = reservations.filter(res => {
        const resDate = new Date(res.datereservation);
        return resDate.toDateString() === now.toDateString() && 
               parseInt(res.heurereservation) === hour &&
               res.statut === 'confirmée';
      });
      
      const maxTerrains = 4;
      const occupation = Math.min(100, (todayReservations.length / maxTerrains) * 100);
      
      return {
        time: hourStr,
        occupation: Math.round(occupation),
        capacity: 100,
        count: todayReservations.length,
        max: maxTerrains
      };
    });

    // Données pour la semaine
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const weekData = weekDays.map((day, index) => {
      const dayDate = new Date(now);
      dayDate.setDate(now.getDate() - now.getDay() + index + 1);
      
      const dayReservations = reservations.filter(res => {
        const resDate = new Date(res.datereservation);
        return resDate.toDateString() === dayDate.toDateString() && 
               res.statut === 'confirmée';
      });
      
      const maxReservationsPerDay = 28;
      const occupation = Math.min(100, (dayReservations.length / maxReservationsPerDay) * 100);
      
      return {
        time: day,
        occupation: Math.round(occupation),
        capacity: 100,
        count: dayReservations.length,
        max: maxReservationsPerDay
      };
    });

    // Données pour le mois
    const monthData = Array.from({ length: 4 }, (_, i) => {
      const weekLabel = `Sem ${i + 1}`;
      
      const startDate = new Date(now.getFullYear(), now.getMonth(), i * 7 + 1);
      const endDate = new Date(now.getFullYear(), now.getMonth(), (i + 1) * 7);
      
      const weekReservations = reservations.filter(res => {
        const resDate = new Date(res.datereservation);
        return resDate >= startDate && resDate <= endDate && res.statut === 'confirmée';
      });
      
      const maxReservationsPerWeek = 196;
      const occupation = Math.min(100, (weekReservations.length / maxReservationsPerWeek) * 100);
      
      return {
        time: weekLabel,
        occupation: Math.round(occupation),
        capacity: 100,
        count: weekReservations.length,
        max: maxReservationsPerWeek
      };
    });

    return { day: dayData, week: weekData, month: monthData };
  };

  const occupationData = calculateOccupationData();
  const data = occupationData[period] && occupationData[period].length > 0 
    ? occupationData[period] 
    : getDefaultData()[period];

  function getDefaultData() {
    const dayData = [
      { time: '8h', occupation: 20, capacity: 100, count: 1, max: 4 },
      { time: '10h', occupation: 40, capacity: 100, count: 2, max: 4 },
      { time: '12h', occupation: 30, capacity: 100, count: 1, max: 4 },
      { time: '14h', occupation: 35, capacity: 100, count: 1, max: 4 },
      { time: '16h', occupation: 50, capacity: 100, count: 2, max: 4 },
      { time: '18h', occupation: 90, capacity: 100, count: 4, max: 4 },
      { time: '20h', occupation: 85, capacity: 100, count: 3, max: 4 },
      { time: '22h', occupation: 40, capacity: 100, count: 2, max: 4 },
    ];

    const weekData = [
      { time: 'Lun', occupation: 45, capacity: 100, count: 12, max: 28 },
      { time: 'Mar', occupation: 52, capacity: 100, count: 15, max: 28 },
      { time: 'Mer', occupation: 49, capacity: 100, count: 14, max: 28 },
      { time: 'Jeu', occupation: 63, capacity: 100, count: 18, max: 28 },
      { time: 'Ven', occupation: 75, capacity: 100, count: 21, max: 28 },
      { time: 'Sam', occupation: 95, capacity: 100, count: 27, max: 28 },
      { time: 'Dim', occupation: 88, capacity: 100, count: 25, max: 28 },
    ];

    const monthData = [
      { time: 'Sem 1', occupation: 58, capacity: 100, count: 114, max: 196 },
      { time: 'Sem 2', occupation: 66, capacity: 100, count: 129, max: 196 },
      { time: 'Sem 3', occupation: 72, capacity: 100, count: 141, max: 196 },
      { time: 'Sem 4', occupation: 80, capacity: 100, count: 157, max: 196 },
    ];

    return { day: dayData, week: weekData, month: monthData };
  }

  const averageOccupation = data.length > 0 
    ? Math.round(data.reduce((sum, item) => sum + item.occupation, 0) / data.length)
    : 0;

  const peakOccupation = data.length > 0 
    ? Math.max(...data.map(item => item.occupation))
    : 0;

  const renderChartSkeleton = () => (
    <div className="chart-skeleton">
      <div className="skeleton-header"></div>
      <div className="skeleton-chart">
        {Array.from({ length: period === 'day' ? 8 : period === 'week' ? 7 : 4 }).map((_, i) => (
          <div 
            key={i} 
            className="skeleton-bar"
            style={{ 
              '--random-height': `${Math.random() * 70 + 30}%` 
            }}
          ></div>
        ))}
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-stats"></div>
        <div className="skeleton-stats"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="occupation-chart-card">
        <div className="error-message">
          <AlertCircle size={48} className="error-icon" />
          <p>Erreur de chargement: {error}</p>
          <button onClick={fetchReservations} className="retry-btn">
            <RefreshCw size={16} />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="occupation-chart-card">
      <div className="chart-header">
        <div className="header-content">
          <div className="title-section">
            <div className="header-icon-container">
              <BarChart3 size={28} className="header-icon" />
            </div>
            <div className="title-text">
              <h2>Tableau de Bord d'Occupation</h2>
              <p className="chart-subtitle">
                Surveillance en temps réel des réservations et de l'occupation des terrains
              </p>
            </div>
          </div>
        </div>
        <div className="period-selector">
          <button 
            className={`period-btn ${period === 'day' ? 'active' : ''}`}
            onClick={() => setPeriod('day')}
          >
            <Calendar size={16} />
            Aujourd'hui
          </button>
          <button 
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => setPeriod('week')}
          >
            <Calendar size={16} />
            Cette Semaine
          </button>
          <button 
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            <BarChart3 size={16} />
            Ce Mois
          </button>
        </div>
      </div>

      <div className="chart-content">
        {isLoading ? (
          renderChartSkeleton()
        ) : (
          <>
            <div className="chart-container">
              <div className="chart-bars">
                {data.map((item, index) => (
                  <div key={index} className="bar-container">
                    <div 
                      className="bar-background" 
                      style={{ height: '100%' }}
                    ></div>
                    <div 
                      className="bar-fill" 
                      style={{ 
                        height: `${item.occupation}%`,
                        opacity: hoveredData === item ? 1 : 0.9
                      }}
                      onMouseEnter={() => setHoveredData(item)}
                      onMouseLeave={() => setHoveredData(null)}
                    >
                      <div className="occupation-label">
                        <span className="occupation-percent">{item.occupation}%</span>
                        <span className="occupation-details">
                          {item.count}/{item.max}
                        </span>
                      </div>
                    </div>
                    <div className="bar-label">{item.time}</div>
                  </div>
                ))}
              </div>
              
              {hoveredData && (
                <div className="chart-tooltip">
                  <div className="tooltip-content">
                    <div className="tooltip-header">
                      <span className="tooltip-title">{hoveredData.time}</span>
                      <div className="tooltip-indicator">
                        <div className="indicator-dot"></div>
                        {hoveredData.occupation}% d'occupation
                      </div>
                    </div>
                    <div className="tooltip-details">
                      <div className="detail-item">
                        <Users size={14} />
                        <span>{hoveredData.count} réservation{hoveredData.count > 1 ? 's' : ''}</span>
                      </div>
                      <div className="detail-item">
                        <MapPin size={14} />
                        <span>{hoveredData.max} terrains max</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chart-stats">
              <div className="stat-item">
                <div className="stat-icon average">
                  <TrendingUp size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-labels">Occupation moyenne</div>
                  <div className="stat-values">{averageOccupation}%</div>
                  <div className="stat-bar">
                    <div 
                      className="stat-bar-fill" 
                      style={{ width: `${averageOccupation}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon peak">
                  <Flame size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-labels">Pic d'occupation</div>
                  <div className="stat-values">{peakOccupation}%</div>
                  <div className="stat-bar">
                    <div 
                      className="stat-bar-fill peak" 
                      style={{ width: `${peakOccupation}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon period">
                  <Zap size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-labels">Période analysée</div>
                  <div className="stat-values">
                    {period === 'day' ? 'Aujourd\'hui' : 
                     period === 'week' ? 'Cette semaine' : 
                     'Ce mois-ci'}
                  </div>
                  <div className="stat-period">
                    {data.length} créneau{data.length > 1 ? 'x' : ''} analysé{data.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            <div className="data-info">
              <div className="data-summary">
                <span className="data-badge">
                  <Target size={14} />
                  {reservations.filter(r => r.statut === 'confirmée').length} réservations confirmées
                </span>
                <span className="data-badge">
                  <Clock size={14} />
                  Mis à jour à {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <button onClick={fetchReservations} className="refresh-btn">
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