import React, { useState, useEffect, useRef } from 'react';
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
  MapPin,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Info,
  Zap,
  Activity
} from 'lucide-react';
import './prevision.css';

const PrevisionForecast = () => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [forecastData, setForecastData] = useState([]);
  const [statistiques, setStatistiques] = useState(null);
  const [periode, setPeriode] = useState(14);
  const [erreur, setErreur] = useState(null);
  const [showAllStats, setShowAllStats] = useState(false);
  const chartScrollRef = useRef(null);

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
          heure_fin: item.heure_fin || '16:00',
          description: generateDescription(item)
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
        moyenne_occupation: Math.round(demoData.reduce((sum, item) => sum + item.prevision, 0) / demoData.length),
        jour_plus_charge: demoData.reduce((max, item) => item.prevision > max.prevision ? item : max, demoData[0]),
        jour_moins_charge: demoData.reduce((min, item) => item.prevision < min.prevision ? item : min, demoData[0])
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateDescription = (item) => {
    const niveaux = {
      'Élevée': 'Forte affluence prévue',
      'Moyenne': 'Affluence modérée',
      'Faible': 'Affluence limitée'
    };
    
    return `Le ${item.date_formattee || formatDate(item.datereservation)}, ${niveaux[item.niveau_occupation] || 'activité normale'} avec ${item.nb_reservations} réservations sur ${item.nb_terrains} terrain(s). Revenu estimé: ${item.revenu_attendu} DH.`;
  };

  const generateDemoData = () => {
    const today = new Date();
    return Array.from({ length: periode }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i + 1);
      
      const prevision = Math.floor(Math.random() * 50) + 30;
      const nb_reservations = Math.floor(Math.random() * 8) + 1;
      const revenu_attendu = nb_reservations * (Math.floor(Math.random() * 100) + 50);
      const niveau_occupation = prevision >= 70 ? 'Élevée' : prevision >= 40 ? 'Moyenne' : 'Faible';
      
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
        niveau_occupation: niveau_occupation,
        jour_semaine: date.getDay(),
        heure_debut: '14:00',
        heure_fin: '16:00',
        description: generateDescription({
          date_formattee: date.toLocaleDateString('fr-FR', { 
            weekday: 'short',
            day: 'numeric', 
            month: 'short' 
          }),
          niveau_occupation: niveau_occupation,
          nb_reservations: nb_reservations,
          nb_terrains: Math.floor(Math.random() * 3) + 1,
          revenu_attendu: revenu_attendu
        })
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
    if (chartScrollRef.current) {
      const scrollAmount = 120;
      if (direction === 'left') {
        chartScrollRef.current.scrollLeft -= scrollAmount;
      } else {
        chartScrollRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  const scrollToStart = () => {
    if (chartScrollRef.current) {
      chartScrollRef.current.scrollLeft = 0;
    }
  };

  const scrollToEnd = () => {
    if (chartScrollRef.current) {
      chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
    }
  };

  // Calcul des métriques
  const dataWithTrends = forecastData.map((item, index, array) => ({
    ...item,
    trend: index > 0 ? (item.prevision > array[index - 1].prevision ? 'up' : item.prevision < array[index - 1].prevision ? 'down' : 'stable') : 'stable',
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
  const joursMoyens = dataWithTrends.filter(item => item.prevision >= 40 && item.prevision < 70).length;

  const statsToShow = showAllStats ? dataWithTrends : dataWithTrends.slice(0, 8);

  const renderSkeleton = () => (
    <div className="prevision-skeleton">
      <div className="prevision-skeleton-header">
        <div className="prevision-skeleton-title"></div>
        <div className="prevision-skeleton-filters"></div>
      </div>
      <div className="prevision-skeleton-chart">
        {Array.from({ length: Math.min(periode, 14) }).map((_, i) => (
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
            <h2>Tableau de Bord des Prévisions</h2>
            <div className="prevision-period-badge">{periode} jours</div>
          </div>
          <div className="prevision-subtitle">
            Analyse prédictive de l'occupation • Données temps réel • Mise à jour automatique
          </div>
        </div>
        
        <div className="prevision-header-actions">
          <div className="prevision-period-selector">
            {[7, 14, 28].map(days => (
              <button
                key={days}
                className={`prevision-period-btn ${periode === days ? 'active' : ''}`}
                onClick={() => setPeriode(days)}
              >
                {days}j
              </button>
            ))}
          </div>
          
          <div className="prevision-header-buttons">
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
                    <h3>
                      <Activity size={20} />
                      Prévisions d'Occupation
                    </h3>
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
                        <span>Élevé (60-80%)</span>
                      </div>
                      <div className="prevision-legend-item">
                        <div className="prevision-legend-color tres-eleve"></div>
                        <span>Très élevé (&gt;80%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="prevision-chart-controls">
                    <div className="prevision-chart-stats">
                      <span className="prevision-chart-average">
                        Moyenne: <strong>{averagePrevision}%</strong>
                      </span>
                      <span className="prevision-chart-period">
                        Période: {periode} jours
                      </span>
                    </div>
                    <div className="prevision-scroll-buttons">
                      <button onClick={() => handleScroll('left')} className="prevision-scroll-btn" title="Défiler vers la gauche">
                        <ChevronLeft size={16} />
                      </button>
                      <button onClick={scrollToStart} className="prevision-scroll-btn" title="Début">
                        Début
                      </button>
                      <button onClick={scrollToEnd} className="prevision-scroll-btn" title="Fin">
                        Fin
                      </button>
                      <button onClick={() => handleScroll('right')} className="prevision-scroll-btn" title="Défiler vers la droite">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="prevision-chart-scroll-container">
                  <div className="prevision-chart-scroll" ref={chartScrollRef}>
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
                            color: item.badge.color,
                            border: `1px solid ${item.badge.color}20`
                          }}>
                            {item.badge.label}
                          </span>
                          <div className="prevision-column-trend" style={{ color: getTrendColor(item.trend) }}>
                            {getTrendIcon(item.trend)}
                          </div>
                        </div>
                        
                        <div className="prevision-column-background">
                          <div
                            className="prevision-column-fill"
                            style={{ 
                              height: `${Math.max(item.prevision, 8)}%`,
                              backgroundColor: getOccupationColor(item.prevision),
                              background: `linear-gradient(to top, ${getOccupationColor(item.prevision)}, ${getOccupationColor(item.prevision)}dd)`
                            }}
                          />
                          <div className="prevision-column-value-label">
                            {item.prevision}%
                          </div>
                          
                          {/* Indicateur de réservations */}
                          <div className="prevision-column-indicator">
                            <Users size={10} />
                            <span>{item.nb_reservations}</span>
                          </div>
                        </div>
                        
                        <div className="prevision-column-labels">
                          <span className="prevision-column-day">
                            {item.day.replace('J+', '')}
                          </span>
                          <span className="prevision-column-date">
                            {getJourSemaine(item.jour_semaine)}
                          </span>
                          <span className="prevision-column-revenue">
                            <DollarSign size={10} />
                            {item.revenu_attendu}DH
                          </span>
                        </div>

                        {/* Tooltip détaillé avec description */}
                        {hoveredDay === index && (
                          <div className="prevision-tooltip">
                            <div className="prevision-tooltip-header">
                              <div className="prevision-tooltip-date">
                                <Calendar size={16} />
                                <div>
                                  <strong>{item.date}</strong>
                                  <div className="prevision-tooltip-day">{item.day}</div>
                                </div>
                              </div>
                              <div 
                                className="prevision-tooltip-trend"
                                style={{ color: getTrendColor(item.trend) }}
                              >
                                {getTrendIcon(item.trend)}
                                {getTrendLabel(item.trend)}
                              </div>
                            </div>
                            
                            <div className="prevision-tooltip-description">
                              <Info size={14} />
                              {item.description}
                            </div>
                            
                            <div className="prevision-tooltip-metrics">
                              <div className="prevision-tooltip-metric main">
                                <Target size={16} />
                                <div className="prevision-metric-info">
                                  <span className="prevision-metric-label">Niveau d'occupation</span>
                                  <strong className="prevision-metric-value" style={{ color: getOccupationColor(item.prevision) }}>
                                    {item.prevision}%
                                  </strong>
                                </div>
                              </div>
                              
                              <div className="prevision-tooltip-grid">
                                <div className="prevision-tooltip-metric compact">
                                  <Users size={14} />
                                  <div className="prevision-metric-info">
                                    <span>Réservations</span>
                                    <strong>{item.nb_reservations}</strong>
                                  </div>
                                </div>
                                
                                <div className="prevision-tooltip-metric compact">
                                  <DollarSign size={14} />
                                  <div className="prevision-metric-info">
                                    <span>Revenu</span>
                                    <strong>{item.revenu_attendu} DH</strong>
                                  </div>
                                </div>
                                
                                <div className="prevision-tooltip-metric compact">
                                  <MapPin size={14} />
                                  <div className="prevision-metric-info">
                                    <span>Terrains</span>
                                    <strong>{item.nb_terrains}</strong>
                                  </div>
                                </div>

                                <div className="prevision-tooltip-metric compact">
                                  <Clock size={14} />
                                  <div className="prevision-metric-info">
                                    <span>Créneau</span>
                                    <strong>{item.heure_debut}-{item.heure_fin}</strong>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="prevision-tooltip-footer">
                              <span className="prevision-occupation-level">
                                Catégorie: <strong>{item.niveau_occupation}</strong>
                              </span>
                              <span className="prevision-terrain-type">
                                {item.types_terrains}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="prevision-chart-help">
                  <Info size={14} />
                  <span>Survolez les colonnes pour voir les détails • Utilisez les flèches pour défiler horizontalement</span>
                </div>
              </div>

              {/* Statistiques principales */}
              <div className="prevision-stats-section">
                <h3 className="prevision-stats-title">
                  <Zap size={20} />
                  Indicateurs Clés de Performance
                </h3>
                <div className="prevision-stats-grid">
                  <div className="prevision-stat-card primary">
                    <div className="prevision-stat-icon">
                      <Activity size={24} />
                    </div>
                    <div className="prevision-stat-content">
                      <div className="prevision-stat-value">{averagePrevision}%</div>
                      <div className="prevision-stat-label">Occupation moyenne</div>
                      <div className="prevision-stat-detail">
                        Sur {periode} jours
                      </div>
                    </div>
                  </div>

                  <div className="prevision-stat-card success">
                    <div className="prevision-stat-icon">
                      <DollarSign size={24} />
                    </div>
                    <div className="prevision-stat-content">
                      <div className="prevision-stat-value">{totalRevenue.toLocaleString()} DH</div>
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

              {/* Répartition de l'occupation */}
              <div className="prevision-distribution-section">
                <h3>Répartition des Niveaux d'Occupation</h3>
                <div className="prevision-distribution-grid">
                  <div className="prevision-distribution-card faible">
                    <div className="prevision-distribution-icon">
                      <div className="prevision-distribution-dot faible"></div>
                    </div>
                    <div className="prevision-distribution-content">
                      <div className="prevision-distribution-value">{joursFaibles}</div>
                      <div className="prevision-distribution-label">Jours à faible occupation</div>
                      <div className="prevision-distribution-percentage">
                        {Math.round((joursFaibles / dataWithTrends.length) * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="prevision-distribution-card moyen">
                    <div className="prevision-distribution-icon">
                      <div className="prevision-distribution-dot moyen"></div>
                    </div>
                    <div className="prevision-distribution-content">
                      <div className="prevision-distribution-value">{joursMoyens}</div>
                      <div className="prevision-distribution-label">Jours à occupation moyenne</div>
                      <div className="prevision-distribution-percentage">
                        {Math.round((joursMoyens / dataWithTrends.length) * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="prevision-distribution-card eleve">
                    <div className="prevision-distribution-icon">
                      <div className="prevision-distribution-dot eleve"></div>
                    </div>
                    <div className="prevision-distribution-content">
                      <div className="prevision-distribution-value">{joursEleves}</div>
                      <div className="prevision-distribution-label">Jours à forte occupation</div>
                      <div className="prevision-distribution-percentage">
                        {Math.round((joursEleves / dataWithTrends.length) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tableau détaillé avec toggle */}
              <div className="prevision-detailed-stats">
                <div className="prevision-detailed-header">
                  <h3>Détails des Prévisions par Jour</h3>
                  <button 
                    className="prevision-toggle-stats"
                    onClick={() => setShowAllStats(!showAllStats)}
                  >
                    {showAllStats ? 'Réduire' : `Voir tout (${dataWithTrends.length} jours)`}
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
                        <th>Type</th>
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
                              <div className="prevision-occupation-bar-container">
                                <div 
                                  className="prevision-occupation-bar"
                                  style={{ 
                                    width: `${item.prevision}%`,
                                    backgroundColor: getOccupationColor(item.prevision)
                                  }}
                                ></div>
                              </div>
                              <span className="prevision-occupation-value">{item.prevision}%</span>
                            </div>
                          </td>
                          <td>
                            <div className="prevision-table-reservations">
                              <Users size={14} />
                              <span>{item.nb_reservations}</span>
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
                            <div className="prevision-table-type">
                              {item.types_terrains}
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
                              title={getTrendLabel(item.trend)}
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
            </>
          )}
        </div>
      </div>

      {/* Pied de page */}
      <div className="prevision-footer">
        <div className="prevision-footer-info">
          <span>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
          <div className="prevision-footer-actions">
            {erreur && (
              <span className="prevision-warning">
                <AlertCircle size={14} />
                Données de démonstration
              </span>
            )}
            <span className="prevision-data-count">
              {dataWithTrends.length} jours analysés
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrevisionForecast;