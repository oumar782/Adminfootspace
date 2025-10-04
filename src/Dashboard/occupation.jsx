import React, { useState, useEffect } from 'react';
import './custom.css';

const OccupationChart = () => {
  const [period, setPeriod] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredData, setHoveredData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = 'https://backend-foot-omega.vercel.app/api/reservation';

  // Fonction pour récupérer les réservations depuis l'API
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

  // Fonction pour calculer les données d'occupation basées sur les réservations réelles
  const calculateOccupationData = () => {
    if (!reservations.length) {
      return {
        day: [],
        week: [],
        month: []
      };
    }

    // Obtenir la date actuelle pour les calculs
    const now = new Date();
    
    // Données pour le jour (groupées par heure)
    const dayData = Array.from({ length: 14 }, (_, i) => {
      const hour = i + 8; // De 8h à 22h
      const hourStr = `${hour}h`;
      
      // Compter les réservations pour cette heure aujourd'hui
      const todayReservations = reservations.filter(res => {
        const resDate = new Date(res.datereservation);
        return resDate.toDateString() === now.toDateString() && 
               parseInt(res.heurereservation) === hour &&
               res.statut === 'confirmée';
      });
      
      // Calculer le taux d'occupation (basé sur le nombre de terrains occupés)
      // Supposons 4 terrains disponibles maximum
      const maxTerrains = 4;
      const occupation = Math.min(100, (todayReservations.length / maxTerrains) * 100);
      
      return {
        time: hourStr,
        occupation: Math.round(occupation),
        capacity: 100
      };
    });

    // Données pour la semaine (groupées par jour)
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const weekData = weekDays.map((day, index) => {
      // Calculer la date pour ce jour de la semaine
      const dayDate = new Date(now);
      dayDate.setDate(now.getDate() - now.getDay() + index + 1);
      
      const dayReservations = reservations.filter(res => {
        const resDate = new Date(res.datereservation);
        return resDate.toDateString() === dayDate.toDateString() && 
               res.statut === 'confirmée';
      });
      
      // Taux d'occupation moyen pour la journée
      const maxReservationsPerDay = 28; // 14h * 2 réservations par heure max
      const occupation = Math.min(100, (dayReservations.length / maxReservationsPerDay) * 100);
      
      return {
        time: day,
        occupation: Math.round(occupation),
        capacity: 100
      };
    });

    // Données pour le mois (groupées par semaine)
    const monthData = Array.from({ length: 4 }, (_, i) => {
      const weekLabel = `Sem ${i + 1}`;
      
      // Calculer les dates pour cette semaine
      const startDate = new Date(now.getFullYear(), now.getMonth(), i * 7 + 1);
      const endDate = new Date(now.getFullYear(), now.getMonth(), (i + 1) * 7);
      
      const weekReservations = reservations.filter(res => {
        const resDate = new Date(res.datereservation);
        return resDate >= startDate && resDate <= endDate && res.statut === 'confirmée';
      });
      
      // Taux d'occupation moyen pour la semaine
      const maxReservationsPerWeek = 196; // 7 jours * 28 réservations max
      const occupation = Math.min(100, (weekReservations.length / maxReservationsPerWeek) * 100);
      
      return {
        time: weekLabel,
        occupation: Math.round(occupation),
        capacity: 100
      };
    });

    return { day: dayData, week: weekData, month: monthData };
  };

  const occupationData = calculateOccupationData();
  const data = occupationData[period] && occupationData[period].length > 0 
    ? occupationData[period] 
    : getDefaultData()[period];

  // Données par défaut si aucune donnée réelle
  function getDefaultData() {
    const dayData = [
      { time: '8h', occupation: 20, capacity: 100 },
      { time: '10h', occupation: 40, capacity: 100 },
      { time: '12h', occupation: 30, capacity: 100 },
      { time: '14h', occupation: 35, capacity: 100 },
      { time: '16h', occupation: 50, capacity: 100 },
      { time: '18h', occupation: 90, capacity: 100 },
      { time: '20h', occupation: 85, capacity: 100 },
      { time: '22h', occupation: 40, capacity: 100 },
    ];

    const weekData = [
      { time: 'Lun', occupation: 45, capacity: 100 },
      { time: 'Mar', occupation: 52, capacity: 100 },
      { time: 'Mer', occupation: 49, capacity: 100 },
      { time: 'Jeu', occupation: 63, capacity: 100 },
      { time: 'Ven', occupation: 75, capacity: 100 },
      { time: 'Sam', occupation: 95, capacity: 100 },
      { time: 'Dim', occupation: 88, capacity: 100 },
    ];

    const monthData = [
      { time: 'Sem 1', occupation: 58, capacity: 100 },
      { time: 'Sem 2', occupation: 66, capacity: 100 },
      { time: 'Sem 3', occupation: 72, capacity: 100 },
      { time: 'Sem 4', occupation: 80, capacity: 100 },
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
          <p>Erreur de chargement: {error}</p>
          <button onClick={fetchReservations} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="occupation-chart-card">
      <div className="chart-header">
        <h2>Taux d'occupation</h2>
        <div className="period-selector">
          <button 
            className={`period-btn ${period === 'day' ? 'active' : ''}`}
            onClick={() => setPeriod('day')}
          >
            Jour
          </button>
          <button 
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => setPeriod('week')}
          >
            Semaine
          </button>
          <button 
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            Mois
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
                        opacity: hoveredData === item ? 1 : 0.8
                      }}
                      onMouseEnter={() => setHoveredData(item)}
                      onMouseLeave={() => setHoveredData(null)}
                    >
                      {hoveredData === item && (
                        <div className="bar-value">{item.occupation}%</div>
                      )}
                    </div>
                    <div className="bar-label">{item.time}</div>
                  </div>
                ))}
              </div>
              
              {hoveredData && (
                <div 
                  className="chart-tooltip" 
                  style={{ 
                    left: `calc(${(data.indexOf(hoveredData) / data.length) * 100}% - 60px)`,
                    bottom: 'calc(100% + 10px)'
                  }}
                >
                  <div className="tooltip-content">
                    <span className="tooltip-title">{hoveredData.time}</span>
                    <span className="tooltip-metric">{hoveredData.occupation}% d'occupation</span>
                  </div>
                </div>
              )}
            </div>

            <div className="chart-stats">
              <div className="stat-item">
                <div className="stat-labels">Occupation moyenne</div>
                <div className="stat-values">{averageOccupation}%</div>
                <div className="stat-bar">
                  <div 
                    className="stat-bar-fill" 
                    style={{ width: `${averageOccupation}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="stat-item">
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

            <div className="data-info">
              <small>
                Données basées sur {reservations.filter(r => r.statut === 'confirmée').length} réservations confirmées
              </small>
              <button onClick={fetchReservations} className="refresh-btn">
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