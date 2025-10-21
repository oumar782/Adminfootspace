import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  Target,
  AlertCircle,
  Loader,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MapPin,
  Clock,
  Star
} from 'lucide-react';
import './prevision.css';

const PrevisionForecast = () => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [forecastData, setForecastData] = useState([]);
  const [statistiques, setStatistiques] = useState(null);
  const [periode, setPeriode] = useState(14);
  const [erreur, setErreur] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showAllStats, setShowAllStats] = useState(false);

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
        console.log('📊 Données API prévisions:', result);
        
        const formattedData = result.data.map((item, index) => ({
          id: index,
          day: `J+${index + 1}`,
          prevision: parseFloat(item.taux_occupation_prevu) || 0,
          date: item.date_formattee || formatDate(item.datereservation),
          dateComplete: item.datereservation,
          nb_reservations: item.nb_reservations || 0,
          revenu_attendu: item.revenu_attendu || 0,
          nb_terrains: item.nb_terrains || 0,
          types_terrains: item.types_terrains || 'Aucun',
          niveau_occupation: item.niveau_occupation || 'Faible',
          jour_semaine: item.jour_semaine || 0,
          heure_debut: item.heure_debut || '14:00',
          heure_fin: item.heure_fin || '16:00'
        }));
        
        setForecastData(formattedData);
        setStatistiques(result.statistiques);
      } else {
        throw new Error(result.message || 'Erreur API');
      }
    } catch (error) {
      console.error('❌ Erreur prévisions:', error);
      setErreur(`Impossible de charger les prévisions: ${error.message}`);
      
      // Données de démonstration en cas d'erreur
      const demoData = generateDemoData();
      setForecastData(demoData);
      setStatistiques({
        revenu_total_attendu: demoData.reduce((sum, item) => sum + item.revenu_attendu, 0),
        reservations_total: demoData.reduce((sum, item) => sum + item.nb_reservations, 0),
        jours_avec_reservations: demoData.filter(item => item.nb_reservations > 0).length,
        moyenne_occupation: Math.round(demoData.reduce((sum, item) => sum + item.prevision, 0) / demoData.length)
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoData = () => {
    const today = new Date();
    return Array.from({ length: periode }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const prevision = Math.floor(Math.random() * 50) + 30;
      const nb_reservations = Math.floor(Math.random() * 8) + 1;
      const revenu_attendu = nb_reservations * (Math.floor(Math.random() * 100) + 50);
      
      return {
        id: i,
        day: `J+${i + 1}`,
        prevision: prevision,
        date: date.toLocaleDateString('fr-FR', { 
          weekday: 'short',
          day: 'numeric', 
          month: 'short' 
        }),
        dateComplete: date.toISOString().split('T')[0],
        nb_reservations: nb_reservations,
        revenu_attendu: revenu_attendu,
        nb_terrains: Math.floor(Math.random() * 3) + 1,
        types_terrains: ['Synthétique', 'Naturel', 'Hybride'][Math.floor(Math.random() * 3)],
        niveau_occupation: prevision >= 70 ? 'Élevée' : prevision >= 40 ? 'Moyenne' : 'Faible',
        jour_semaine: date.getDay(),
        heure_debut: '14:00',
        heure_fin: '16:00'
      };
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short' 
    });
  };

  const getJourSemaine = (numero) => {
    const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return jours[numero] || '---';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} />;
      case 'down': return <TrendingDown size={16} />;
      default: return <Minus size={16} />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTrendLabel = (trend) => {
    switch (trend) {
      case 'up': return 'En hausse';
      case 'down': return 'En baisse';
      default: return 'Stable';
    }
  };

  const getOccupationColor = (percentage) => {
    if (percentage >= 80) return '#ef4444';
    if (percentage >= 60) return '#f59e0b';
    if (percentage >= 40) return '#10b981';
    return '#6b7280';
  };

  const getOccupationLabel = (percentage) => {
    if (percentage >= 80) return 'Très élevée';
    if (percentage >= 60) return 'Élevée';
    if (percentage >= 40) return 'Moyenne';
    return 'Faible';
  };

  const getOccupationBadge = (percentage) => {
    if (percentage >= 80) return { label: 'Élevé', color: '#ef4444', bgColor: '#fef2f2' };
    if (percentage >= 60) return { label: 'Moyen+', color: '#f59e0b', bgColor: '#fffbeb' };
    if (percentage >= 40) return { label: 'Moyen', color: '#10b981', bgColor: '#f0fdf4' };
    return { label: 'Faible', color: '#6b7280', bgColor: '#f9fafb' };
  };

  useEffect(() => {
    fetchPrevisions();
  }, [periode]);

  const handleRetry = () => {
    fetchPrevisions();
  };

  const handleScroll = (direction) => {
    const container = document.querySelector('.prevision-chart-scroll');
    const scrollAmount = 100;
    
    if (container) {
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
      setScrollPosition(container.scrollLeft);
    }
  };

  // Calcul des métriques
  const dataWithTrends = forecastData.map((item, index, array) => ({
    ...item,
    trend: index > 0 ? (item.prevision > array[index - 1].prevision ? 'up' : 'down') : 'stable',
    badge: getOccupationBadge(item.prevision)
  }));

  const averagePrevision = dataWithTrends.length > 0 
    ? Math.round(dataWithTrends.reduce((sum, item) => sum + item.prevision, 0) / dataWithTrends.length)
    : 0;

  const peakDay = dataWithTrends.length > 0 
    ? dataWithTrends.reduce((max, item) => item.prevision > max.prevision ? item : max, dataWithTrends[0])
    : null;

  const lowestDay = dataWithTrends.length > 0 
    ? dataWithTrends.reduce((min, item) => item.prevision < min.prevision ? item : min, dataWithTrends[0])
    : null;

  const totalRevenue = dataWithTrends.reduce((sum, item) => sum + (item.revenu_attendu || 0), 0);
  const totalReservations = dataWithTrends.reduce((sum, item) => sum + (item.nb_reservations || 0), 0);
  const joursEleves = dataWithTrends.filter(item => item.prevision >= 70).length;
  const joursFaibles = dataWithTrends.filter(item => item.prevision < 40).length;

  const statsToShow = showAllStats ? dataWithTrends : dataWithTrends.slice(0, 10);

  const renderSkeleton = () => (
    <div className="prevision-skeleton">
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

  return (
    <div className="prevision-card">
      {/* En-tête */}
      <div className="prevision-header">
        <div className="prevision-header-main">
          <div className="prevision-title">
            <BarChart3 size={24} />
            <h2>Prévisions d'Occupation</h2>
            <span className="prevision-period-badge">{periode} jours</span>
          </div>
          <div className="prevision-subtitle">
            Analyse prédictive des réservations futures • Données en temps réel
          </div>
        </div>
        
        <div className="prevision-header-actions">
          <div className="prevision-period-selector">
            {[7, 14, 30].map(days => (
              <button
                key={days}
                className={`prevision-period-btn ${periode === days ? 'active' : ''}`}
                onClick={() => setPeriode(days)}
              >
                {days}j
              </button>
            ))}
          </div>
          
          <button 
            className="prevision-action-btn"
            onClick={handleRetry}
            disabled={isLoading}
            title="Actualiser les données"
          >
            <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      {/* Contenu principal avec défilement vertical */}
      <div className="prevision-content-scroll">
        <div className="prevision-content">
          {isLoading ? (
            renderSkeleton()
          ) : (
            <>
              {/* Graphique avec défilement horizontal */}
              <div className="prevision-chart-section">
                <div className="prevision-chart-header">
                  <div className="prevision-chart-title-section">
                    <h3>Taux d'occupation prévisionnel</h3>
                    <div className="prevision-chart-legend">
                      <div className="prevision-legend-item">
                        <div className="prevision-legend-color faible"></div>
                        <span>Faible (&lt;40%)</span>
                      </div>
                      <div className="prevision-legend-item">
                        <div className="prevision-legend-color moyen"></div>
                        <span>Moyen (40-60%)</span>
                      </div>
                      <div className="prevision-legend-item">
                        <div className="prevision-legend-color eleve"></div>
                        <span>Élevé (&gt;60%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="prevision-chart-controls">
                    <span className="prevision-chart-average">
                      Moyenne: <strong>{averagePrevision}%</strong>
                    </span>
                    <div className="prevision-scroll-buttons">
                      <button onClick={() => handleScroll('left')} className="prevision-scroll-btn">
                        <ChevronLeft size={16} />
                      </button>
                      <button onClick={() => handleScroll('right')} className="prevision-scroll-btn">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="prevision-chart-scroll-container">
                  <div className="prevision-chart-scroll">
                    {dataWithTrends.map((item, index) => (
                      <div
                        key={item.id}
                        className="prevision-chart-column"
                        onMouseEnter={() => setHoveredDay(index)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        <div className="prevision-column-header">
                          <span className="prevision-column-badge" style={{ 
                            backgroundColor: item.badge.bgColor,
                            color: item.badge.color
                          }}>
                            {item.badge.label}
                          </span>
                        </div>
                        
                        <div className="prevision-column-background">
                          <div
                            className="prevision-column-fill"
                            style={{ 
                              height: `${Math.max(item.prevision, 4)}%`,
                              backgroundColor: getOccupationColor(item.prevision)
                            }}
                          />
                          <div className="prevision-column-value-label">
                            {item.prevision}%
                          </div>
                        </div>
                        
                        <div className="prevision-column-labels">
                          <span className="prevision-column-day">
                            {item.day.replace('J+', '')}
                          </span>
                          <span className="prevision-column-date">
                            {getJourSemaine(item.jour_semaine)}
                          </span>
                          <span className="prevision-column-reservations">
                            {item.nb_reservations} rés.
                          </span>
                        </div>

                        {/* Tooltip détaillé */}
                        {hoveredDay === index && (
                          <div className="prevision-tooltip">
                            <div className="prevision-tooltip-header">
                              <div className="prevision-tooltip-date">
                                <Calendar size={14} />
                                <strong>{item.date}</strong>
                              </div>
                              <div 
                                className="prevision-tooltip-trend"
                                style={{ color: getTrendColor(item.trend) }}
                              >
                                {getTrendIcon(item.trend)}
                                {getTrendLabel(item.trend)}
                              </div>
                            </div>
                            
                            <div className="prevision-tooltip-metrics">
                              <div className="prevision-tooltip-metric main">
                                <Target size={16} />
                                <span>Niveau d'occupation</span>
                                <strong style={{ color: getOccupationColor(item.prevision) }}>
                                  {item.prevision}%
                                </strong>
                              </div>
                              
                              <div className="prevision-tooltip-divider"></div>
                              
                              <div className="prevision-tooltip-metric">
                                <Users size={16} />
                                <span>Nombre de réservations</span>
                                <strong>{item.nb_reservations}</strong>
                              </div>
                              
                              <div className="prevision-tooltip-metric">
                                <DollarSign size={16} />
                                <span>Revenu estimé</span>
                                <strong>{item.revenu_attendu} DH</strong>
                              </div>
                              
                              <div className="prevision-tooltip-metric">
                                <MapPin size={16} />
                                <span>Terrains réservés</span>
                                <strong>{item.nb_terrains}</strong>
                              </div>

                              <div className="prevision-tooltip-metric">
                                <Clock size={16} />
                                <span>Créneau type</span>
                                <strong>{item.heure_debut} - {item.heure_fin}</strong>
                              </div>

                              <div className="prevision-tooltip-metric">
                                <Star size={16} />
                                <span>Type de terrain</span>
                                <strong>{item.types_terrains}</strong>
                              </div>
                            </div>
                            
                            <div className="prevision-tooltip-footer">
                              <span className="prevision-occupation-level">
                                Catégorie: <strong>{item.niveau_occupation}</strong>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistiques principales */}
              <div className="prevision-stats-section">
                <h3 className="prevision-stats-title">Indicateurs Clés</h3>
                <div className="prevision-stats-grid">
                  <div className="prevision-stat-card primary">
                    <div className="prevision-stat-icon">
                      <BarChart3 size={24} />
                    </div>
                    <div className="prevision-stat-content">
                      <div className="prevision-stat-value">{averagePrevision}%</div>
                      <div className="prevision-stat-label">Occupation moyenne</div>
                      <div className="prevision-stat-trend">
                        {getTrendIcon('up')}
                        <span style={{ color: '#10b981' }}>Stable cette période</span>
                      </div>
                    </div>
                  </div>

                  <div className="prevision-stat-card success">
                    <div className="prevision-stat-icon">
                      <DollarSign size={24} />
                    </div>
                    <div className="prevision-stat-content">
                      <div className="prevision-stat-value">{totalRevenue} DH</div>
                      <div className="prevision-stat-label">Revenu total prévu</div>
                      <div className="prevision-stat-detail">
                        {totalReservations} réservations
                      </div>
                    </div>
                  </div>

                  <div className="prevision-stat-card warning">
                    <div className="prevision-stat-icon">
                      <TrendingUp size={24} />
                    </div>
                    <div className="prevision-stat-content">
                      <div className="prevision-stat-value">
                        {peakDay ? `${peakDay.prevision}%` : '--%'}
                      </div>
                      <div className="prevision-stat-label">Pic d'occupation</div>
                      <div className="prevision-stat-detail">
                        {peakDay ? peakDay.date : '--'}
                      </div>
                    </div>
                  </div>

                  <div className="prevision-stat-card danger">
                    <div className="prevision-stat-icon">
                      <TrendingDown size={24} />
                    </div>
                    <div className="prevision-stat-content">
                      <div className="prevision-stat-value">
                        {lowestDay ? `${lowestDay.prevision}%` : '--%'}
                      </div>
                      <div className="prevision-stat-label">Occupation minimale</div>
                      <div className="prevision-stat-detail">
                        {lowestDay ? lowestDay.date : '--'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques détaillées avec toggle */}
              <div className="prevision-detailed-stats">
                <div className="prevision-detailed-header">
                  <h3>Détails des Prévisions</h3>
                  <button 
                    className="prevision-toggle-stats"
                    onClick={() => setShowAllStats(!showAllStats)}
                  >
                    {showAllStats ? (
                      <>
                        <ChevronUp size={16} />
                        Voir moins
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Voir tout ({dataWithTrends.length} jours)
                      </>
                    )}
                  </button>
                </div>
                
                <div className="prevision-stats-table-container">
                  <table className="prevision-stats-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Occupation</th>
                        <th>Réservations</th>
                        <th>Revenu</th>
                        <th>Terrains</th>
                        <th>Niveau</th>
                        <th>Tendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statsToShow.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="prevision-table-date">
                              <strong>{item.date}</strong>
                              <span>{item.day}</span>
                            </div>
                          </td>
                          <td>
                            <div className="prevision-table-occupation">
                              <div 
                                className="prevision-occupation-bar"
                                style={{ 
                                  width: `${item.prevision}%`,
                                  backgroundColor: getOccupationColor(item.prevision)
                                }}
                              ></div>
                              <span>{item.prevision}%</span>
                            </div>
                          </td>
                          <td>
                            <div className="prevision-table-reservations">
                              <Users size={14} />
                              {item.nb_reservations}
                            </div>
                          </td>
                          <td>
                            <div className="prevision-table-revenue">
                              <DollarSign size={14} />
                              {item.revenu_attendu} DH
                            </div>
                          </td>
                          <td>
                            <div className="prevision-table-terrains">
                              <MapPin size={14} />
                              {item.nb_terrains}
                            </div>
                          </td>
                          <td>
                            <span 
                              className="prevision-table-badge"
                              style={{ 
                                backgroundColor: item.badge.bgColor,
                                color: item.badge.color
                              }}
                            >
                              {item.badge.label}
                            </span>
                          </td>
                          <td>
                            <div 
                              className="prevision-table-trend"
                              style={{ color: getTrendColor(item.trend) }}
                            >
                              {getTrendIcon(item.trend)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Résumé des performances */}
              {statistiques && (
                <div className="prevision-performance-summary">
                  <h3>Synthèse des Performances</h3>
                  <div className="prevision-performance-grid">
                    <div className="prevision-performance-card">
                      <div className="prevision-performance-value">{joursEleves}</div>
                      <div className="prevision-performance-label">Jours à forte occupation (&gt;70%)</div>
                    </div>
                    <div className="prevision-performance-card">
                      <div className="prevision-performance-value">{joursFaibles}</div>
                      <div className="prevision-performance-label">Jours à faible occupation (&lt;40%)</div>
                    </div>
                    <div className="prevision-performance-card">
                      <div className="prevision-performance-value">
                        {statistiques.jours_avec_reservations || dataWithTrends.filter(d => d.nb_reservations > 0).length}
                      </div>
                      <div className="prevision-performance-label">Jours avec réservations</div>
                    </div>
                    <div className="prevision-performance-card">
                      <div className="prevision-performance-value">
                        {Math.round((dataWithTrends.filter(d => d.nb_reservations > 0).length / dataWithTrends.length) * 100)}%
                      </div>
                      <div className="prevision-performance-label">Taux d'activité</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Pied de page */}
      <div className="prevision-footer">
        <div className="prevision-footer-info">
          <span>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
          {erreur && (
            <span className="prevision-warning">Données de démonstration</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrevisionForecast;