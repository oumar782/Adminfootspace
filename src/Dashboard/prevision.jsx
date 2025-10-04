import React, { useState, useEffect } from 'react';
import './prevision.css';

const PrevisionForecast = () => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [forecastData, setForecastData] = useState([]);
  const [statistiques, setStatistiques] = useState(null);
  const [periode, setPeriode] = useState(14);
  const [erreur, setErreur] = useState(null);

  // Fonction pour récupérer les données depuis l'API
  const fetchPrevisions = async () => {
    try {
      setIsLoading(true);
      setErreur(null);
      
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/reservation/previsions/detaillees?jours=${periode}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Formater les données pour le graphique
        const formattedData = result.data.map((item, index) => ({
          day: `J+${index + 1}`,
          prevision: parseFloat(item.taux_occupation_prevu),
          date: item.date_formattee,
          trend: item.tendance,
          rawData: item
        }));
        
        setForecastData(formattedData);
        setStatistiques(result.statistiques);
      } else {
        throw new Error(result.message || 'Erreur lors de la récupération des données');
      }
    } catch (error) {
      console.error('❌ Erreur chargement prévisions:', error);
      setErreur(error.message);
      // Données de démonstration en cas d'erreur
      setForecastData(generateDemoData());
    } finally {
      setIsLoading(false);
    }
  };

  // Générer des données de démonstration
  const generateDemoData = () => {
    const today = new Date();
    return Array.from({ length: periode }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i + 1);
      
      return {
        day: `J+${i + 1}`,
        prevision: Math.floor(Math.random() * 40) + 50, // 50-90%
        date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        trend: Math.random() > 0.5 ? 'up' : 'down',
        rawData: {
          taux_occupation_prevu: Math.floor(Math.random() * 40) + 50,
          revenu_attendu: Math.floor(Math.random() * 500) + 100
        }
      };
    });
  };

  useEffect(() => {
    fetchPrevisions();
  }, [periode]);

  const handlePeriodeChange = (nouvellePeriode) => {
    setPeriode(nouvellePeriode);
  };

  const handleRetry = () => {
    fetchPrevisions();
  };

  const renderSkeleton = () => (
    <div className="prevision-forecast-skeleton">
      <div className="prevision-skeleton-header">
        <div className="prevision-skeleton-title"></div>
        <div className="prevision-skeleton-filters"></div>
      </div>
      <div className="prevision-skeleton-chart">
        {Array.from({ length: periode }).map((_, i) => (
          <div key={i} className="prevision-skeleton-bar" style={{ height: `${30 + Math.random() * 60}%` }}></div>
        ))}
      </div>
      <div className="prevision-skeleton-footer">
        <div className="prevision-skeleton-stat"></div>
        <div className="prevision-skeleton-stat"></div>
        <div className="prevision-skeleton-stat"></div>
      </div>
    </div>
  );

  const getTrendIcon = (trend) => {
    if (trend === "up") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      );
    } else if (trend === "down") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      );
    } else {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="12" x2="6" y2="12"></line>
        </svg>
      );
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getOccupationColor = (percentage) => {
    if (percentage >= 80) return '#ef4444'; // Rouge pour haute occupation
    if (percentage >= 60) return '#f59e0b'; // Orange pour moyenne-haute
    if (percentage >= 40) return '#10b981'; // Vert pour moyenne
    return '#6b7280'; // Gris pour faible
  };

  if (erreur && forecastData.length === 0) {
    return (
      <div className="prevision-forecast-card error">
        <div className="prevision-error-content">
          <div className="prevision-error-icon">⚠️</div>
          <h3>Erreur de chargement</h3>
          <p>{erreur}</p>
          <button onClick={handleRetry} className="prevision-retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const dataToShow = forecastData.length > 0 ? forecastData : generateDemoData();
  const averagePrevision = Math.round(
    dataToShow.reduce((sum, item) => sum + item.prevision, 0) / dataToShow.length
  );

  const peakDay = dataToShow.reduce(
    (max, item) => (item.prevision > max.prevision ? item : max),
    dataToShow[0]
  );

  const lowestDay = dataToShow.reduce(
    (min, item) => (item.prevision < min.prevision ? item : min),
    dataToShow[0]
  );

  return (
    <div className="prevision-forecast-card">
      <div className="prevision-forecast-header">
        <div className="prevision-header-title">
          <h2>📊 Prévisions d'occupation</h2>
          <span className="prevision-periode-badge">{periode} jours</span>
        </div>
        
        <div className="prevision-header-actions">
          <div className="prevision-periode-selector">
            <button 
              className={`prevision-periode-btn ${periode === 7 ? 'active' : ''}`}
              onClick={() => handlePeriodeChange(7)}
            >
              7j
            </button>
            <button 
              className={`prevision-periode-btn ${periode === 14 ? 'active' : ''}`}
              onClick={() => handlePeriodeChange(14)}
            >
              14j
            </button>
            <button 
              className={`prevision-periode-btn ${periode === 30 ? 'active' : ''}`}
              onClick={() => handlePeriodeChange(30)}
            >
              30j
            </button>
          </div>
          
          <button className="prevision-action-btn refresh" onClick={handleRetry} title="Actualiser">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6"></path>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </button>
          
          <button className="prevision-action-btn" title="Exporter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className="prevision-forecast-content">
        {isLoading ? (
          renderSkeleton()
        ) : (
          <>
            <div className="prevision-forecast-chart">
              {dataToShow.map((item, index) => (
                <div
                  key={index}
                  className="prevision-chart-column"
                  onMouseEnter={() => setHoveredDay(index)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div className="prevision-column-background">
                    <div
                      className="prevision-column-fill"
                      style={{ 
                        height: `${item.prevision}%`,
                        backgroundColor: getOccupationColor(item.prevision)
                      }}
                    ></div>
                  </div>
                  <div className="prevision-column-label">{item.day.replace("J+", "")}</div>
                  
                  {hoveredDay === index && (
                    <div className="prevision-column-tooltip">
                      <div className="prevision-tooltip-header">
                        <div className="prevision-tooltip-date">{item.date}</div>
                        <div className="prevision-tooltip-trend" style={{ color: getTrendColor(item.trend) }}>
                          {getTrendIcon(item.trend)}
                          {item.trend === "up" ? "En hausse" : item.trend === "down" ? "En baisse" : "Stable"}
                        </div>
                      </div>
                      <div className="prevision-tooltip-value">
                        <strong>{item.prevision}%</strong> d'occupation
                      </div>
                      {item.rawData && (
                        <>
                          <div className="prevision-tooltip-detail">
                            Revenu: <strong>{item.rawData.revenu_attendu} DH</strong>
                          </div>
                          <div className="prevision-tooltip-detail">
                            Réservations: <strong>{item.rawData.nb_reservations || 0}</strong>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="prevision-forecast-stats">
              <div className="prevision-stat-item">
                <div className="prevision-stat-icon average">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <div className="prevision-stat-content">
                  <div className="prevision-stat-label">Moyenne sur {periode} jours</div>
                  <div className="prevision-stat-value">{averagePrevision}%</div>
                </div>
              </div>

              <div className="prevision-stat-item">
                <div className="prevision-stat-icon peak">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <div className="prevision-stat-content">
                  <div className="prevision-stat-label">Pic d'occupation</div>
                  <div className="prevision-stat-value">{peakDay.day.replace("J+", "")} ({peakDay.prevision}%)</div>
                </div>
              </div>

              <div className="prevision-stat-item">
                <div className="prevision-stat-icon low">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20"></path>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="prevision-stat-content">
                  <div className="prevision-stat-label">Plus faible</div>
                  <div className="prevision-stat-value">{lowestDay.day.replace("J+", "")} ({lowestDay.prevision}%)</div>
                </div>
              </div>
            </div>

            {statistiques && (
              <div className="prevision-advanced-stats">
                <div className="prevision-stats-grid">
                  <div className="prevision-advanced-stat">
                    <div className="prevision-advanced-stat-value">
                      {statistiques.revenu_total_attendu} DH
                    </div>
                    <div className="prevision-advanced-stat-label">Revenu total attendu</div>
                  </div>
                  <div className="prevision-advanced-stat">
                    <div className="prevision-advanced-stat-value">{statistiques.reservations_total}</div>
                    <div className="prevision-advanced-stat-label">Réservations totales</div>
                  </div>
                  <div className="prevision-advanced-stat">
                    <div className="prevision-advanced-stat-value">{statistiques.jours_eleves}</div>
                    <div className="prevision-advanced-stat-label">Jours chargés (&gt;80%)</div>
                  </div>
                  <div className="prevision-advanced-stat">
                    <div className="prevision-advanced-stat-value">{statistiques.jours_faibles}</div>
                    <div className="prevision-advanced-stat-label">Jours calmes (&lt;50%)</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PrevisionForecast;