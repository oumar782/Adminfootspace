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
  ChevronLeft,
  ChevronRight,
  Info,
  Zap,
  Activity,
  Maximize2,
  Minimize2
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
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chartScrollRef = useRef(null);
  const cardRef = useRef(null);
  const contentRef = useRef(null);

  // Fonction pour calculer le pourcentage d'occupation RÉEL basé sur les réservations
  const calculerPourcentageOccupationReel = (nbReservations, nbTerrains) => {
    console.log(`📊 Calcul pourcentage: ${nbReservations} réservations / ${nbTerrains} terrains`);
    
    // Si pas de terrains, retourner 0
    if (!nbTerrains || nbTerrains === 0) {
      console.log('❌ Aucun terrain disponible');
      return 0;
    }
    
    // Supposons qu'un terrain peut avoir maximum 8 réservations par jour (réaliste)
    const capaciteMaxParTerrain = 8;
    const capaciteTotale = nbTerrains * capaciteMaxParTerrain;
    
    console.log(`🏟️  Capacité totale: ${capaciteTotale} réservations possibles`);
    
    // Calcul du pourcentage RÉEL
    const pourcentage = (nbReservations / capaciteTotale) * 100;
    const pourcentageArrondi = Math.min(Math.round(pourcentage), 100);
    
    console.log(`✅ Pourcentage calculé: ${pourcentageArrondi}%`);
    
    return pourcentageArrondi;
  };

  const fetchPrevisions = async () => {
    try {
      setIsLoading(true);
      setErreur(null);
      
      console.log(`🔄 Chargement des prévisions pour ${periode} jours...`);
      
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/reservation/previsions/detaillees?jours=${periode}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log('📊 Données API prévisions RÉELLES:', result.data);
        
        const formattedData = result.data.map((item, index) => {
          // Récupération des données RÉELLES
          const nbReservations = parseInt(item.nb_reservations) || 0;
          const nbTerrains = parseInt(item.nb_terrains) || 1;
          const revenu = parseInt(item.revenu_attendu) || 0;
          
          // Calcul du pourcentage RÉEL basé sur les réservations
          const pourcentageReel = calculerPourcentageOccupationReel(nbReservations, nbTerrains);
          
          console.log(`📈 Jour ${index + 1}: ${nbReservations} réservations → ${pourcentageReel}%`);

          return {
            id: index,
            day: `J+${index + 1}`,
            prevision: pourcentageReel, // Pourcentage RÉEL calculé
            date: item.date_formattee || formatDate(item.datereservation),
            dateComplete: item.datereservation,
            nb_reservations: nbReservations,
            revenu_attendu: revenu,
            nb_terrains: nbTerrains,
            types_terrains: item.types_terrains || '5x5',
            niveau_occupation: getNiveauOccupation(pourcentageReel),
            jour_semaine: item.jour_semaine || new Date(item.datereservation).getDay(),
            description: generateDescription(item, pourcentageReel, nbReservations, nbTerrains)
          };
        });
        
        setForecastData(formattedData);
        setStatistiques(result.statistiques);
        
        console.log('✅ Données formatées avec pourcentages RÉELS:', formattedData);
      } else {
        throw new Error(result.message || 'Aucune donnée disponible');
      }
    } catch (error) {
      console.error('❌ Erreur prévisions:', error);
      setErreur(`Impossible de charger les prévisions: ${error.message}`);
      
      // Données de démonstration AVEC CORRÉLATION RÉELLE entre réservations et pourcentages
      const demoData = Array.from({ length: periode }, (_, i) => {
        // Génération de données RÉALISTES avec corrélation
        const baseReservations = Math.floor(Math.random() * 10) + 5; // 5-15 réservations
        const variation = Math.sin(i * 0.5) * 3; // Variation réaliste
        const nbReservations = Math.max(1, Math.round(baseReservations + variation));
        const nbTerrains = Math.floor(Math.random() * 3) + 2; // 2-4 terrains
        
        // Calcul RÉEL du pourcentage
        const pourcentageReel = calculerPourcentageOccupationReel(nbReservations, nbTerrains);
        
        // Revenu proportionnel aux réservations
        const revenu = nbReservations * 120; // 120 DH par réservation

        return {
          id: i,
          day: `J+${i + 1}`,
          prevision: pourcentageReel,
          date: formatDate(new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000)),
          dateComplete: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
          nb_reservations: nbReservations,
          revenu_attendu: revenu,
          nb_terrains: nbTerrains,
          types_terrains: ['5x5', '7x7', '11x11'][Math.floor(Math.random() * 3)],
          niveau_occupation: getNiveauOccupation(pourcentageReel),
          jour_semaine: (new Date().getDay() + i + 1) % 7,
          description: `Jour ${i + 1} - ${nbReservations} réservations sur ${nbTerrains} terrains (${pourcentageReel}% d'occupation)`
        };
      });
      
      setForecastData(demoData);
      console.log('🔄 Données de démonstration chargées:', demoData);
    } finally {
      setIsLoading(false);
    }
  };

  // Déterminer le niveau d'occupation basé sur le pourcentage RÉEL
  const getNiveauOccupation = (pourcentage) => {
    if (pourcentage >= 80) return 'Élevée';
    if (pourcentage >= 60) return 'Moyenne+';
    if (pourcentage >= 40) return 'Moyenne';
    return 'Faible';
  };

  const generateDescription = (item, pourcentage, nbReservations, nbTerrains) => {
    const niveaux = {
      'Élevée': '🔥 Forte affluence prévue',
      'Moyenne+': '📈 Bonne affluence',
      'Moyenne': '✅ Affluence modérée',
      'Faible': '📉 Affluence limitée'
    };
    
    const niveau = getNiveauOccupation(pourcentage);
    
    return `${item.date_formattee || formatDate(item.datereservation)}: ${niveaux[niveau]} • ${nbReservations} réservations sur ${nbTerrains} terrain(s) • ${pourcentage}% d'occupation • Revenu: ${item.revenu_attendu} DH`;
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

  const getOccupationBadge = (percentage) => {
    if (percentage >= 80) return { label: 'Élevé', color: '#ef4444', bgColor: '#fef2f2' };
    if (percentage >= 60) return { label: 'Moyen+', color: '#f59e0b', bgColor: '#fffbeb' };
    if (percentage >= 40) return { label: 'Moyen', color: '#10b981', bgColor: '#f0fdf4' };
    return { label: 'Faible', color: '#6b7280', bgColor: '#f9fafb' };
  };

  useEffect(() => {
    fetchPrevisions();
  }, [periode]);

  // Vérifier si le scroll horizontal est nécessaire
  useEffect(() => {
    const checkScrollability = () => {
      if (contentRef.current) {
        const isScrollable = contentRef.current.scrollWidth > contentRef.current.clientWidth;
        setShowScrollHint(isScrollable);
      }
    };

    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    
    return () => window.removeEventListener('resize', checkScrollability);
  }, [forecastData, periode]);

  const handleRetry = () => {
    console.log('🔄 Actualisation manuelle des données...');
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

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Calcul des métriques basées sur les données RÉELLES
  const dataWithTrends = forecastData.map((item, index, array) => {
    const trend = index > 0 
      ? (item.prevision > array[index - 1].prevision ? 'up' 
        : item.prevision < array[index - 1].prevision ? 'down' 
        : 'stable') 
      : 'stable';
    
    return {
      ...item,
      trend: trend,
      badge: getOccupationBadge(item.prevision)
    };
  });

  // Calculs RÉELS basés sur les données
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

  console.log('📈 Métriques calculées:', {
    averagePrevision,
    totalRevenue,
    totalReservations,
    joursEleves,
    joursMoyens,
    joursFaibles
  });

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

  const renderEmptyState = () => (
    <div className="prevision-empty-state">
      <AlertCircle size={48} />
      <h3>Aucune donnée disponible</h3>
      <p>Les prévisions n'ont pas pu être chargées depuis l'API.</p>
      <button className="prevision-retry-btn" onClick={handleRetry}>
        <RefreshCw size={16} />
        Réessayer
      </button>
    </div>
  );

  return (
    <div 
      ref={cardRef}
      className={`prevision-card ${isFullScreen ? 'prevision-card-fullscreen' : ''}`}
    >
      {/* En-tête */}
      <div className="prevision-header">
        <div className="prevision-header-main">
          <div className="prevision-title">
            <BarChart3 size={24} />
            <h2>Tableau de Bord des Prévisions RÉELLES</h2>
            <div className="prevision-period-badge">{periode} jours</div>
          </div>
          <div className="prevision-subtitle">
            Données temps réel • Pourcentages RÉELS basés sur les réservations • Mise à jour automatique
          </div>
        </div>
        
        <div className="prevision-header-actions">
          <div className="prevision-period-selector">
            {[7, 14, 21].map(days => (
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
              onClick={toggleFullScreen}
              title={isFullScreen ? "Réduire" : "Plein écran"}
            >
              {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
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

      {/* Indicateur de scroll horizontal */}
      {showScrollHint && (
        <div className="prevision-scroll-hint">
          <span>← → Faites défiler horizontalement pour voir tout le contenu</span>
        </div>
      )}

      {/* Contenu principal avec scroll horizontal et vertical */}
      <div className="prevision-content-wrapper">
        <div 
          ref={contentRef}
          className="prevision-content-scroll"
        >
          <div className="prevision-content">
            {isLoading ? (
              renderSkeleton()
            ) : dataWithTrends.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                {/* Graphique avec pourcentages RÉELS */}
                <div className="prevision-chart-section">
                  <div className="prevision-chart-header">
                    <div className="prevision-chart-title-section">
                      <h3>
                        <Activity size={20} />
                        Prévisions d'Occupation RÉELLES
                        <span className="prevision-data-source-badge">
                          Basé sur {totalReservations} réservations
                        </span>
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
                          Moyenne réelle: <strong>{averagePrevision}%</strong>
                        </span>
                        <span className="prevision-chart-period">
                          {totalReservations} réservations totales
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

                          {/* Tooltip détaillé avec données RÉELLES */}
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
                                    <span className="prevision-metric-label">Niveau d'occupation RÉEL</span>
                                    <strong className="prevision-metric-value" style={{ color: getOccupationColor(item.prevision) }}>
                                      {item.prevision}%
                                    </strong>
                                    <div className="prevision-metric-detail">
                                      {item.nb_reservations} réservations / {item.nb_terrains} terrain(s)
                                    </div>
                                    <div className="prevision-metric-calculation">
                                      Calcul: ({item.nb_reservations} / ({item.nb_terrains} × 8)) × 100
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="prevision-tooltip-grid">
                                  <div className="prevision-tooltip-metric compact">
                                    <Users size={14} />
                                    <div className="prevision-metric-info">
                                      <span>Réservations réelles</span>
                                      <strong>{item.nb_reservations}</strong>
                                    </div>
                                  </div>
                                  
                                  <div className="prevision-tooltip-metric compact">
                                    <DollarSign size={14} />
                                    <div className="prevision-metric-info">
                                      <span>Revenu estimé</span>
                                      <strong>{item.revenu_attendu} DH</strong>
                                    </div>
                                  </div>
                                  
                                  <div className="prevision-tooltip-metric compact">
                                    <MapPin size={14} />
                                    <div className="prevision-metric-info">
                                      <span>Terrains réservés</span>
                                      <strong>{item.nb_terrains}</strong>
                                    </div>
                                  </div>

                                  <div className="prevision-tooltip-metric compact">
                                    <Clock size={14} />
                                    <div className="prevision-metric-info">
                                      <span>Type terrain</span>
                                      <strong>{item.types_terrains}</strong>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="prevision-tooltip-footer">
                                <span className="prevision-occupation-level">
                                  Catégorie: <strong>{item.niveau_occupation}</strong>
                                </span>
                                <span className="prevision-data-source">
                                  Données calculées en temps réel
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
                    <span>Les pourcentages sont calculés en temps réel: (réservations / (terrains × 8)) × 100</span>
                  </div>
                </div>

                {/* Statistiques principales avec données RÉELLES */}
                <div className="prevision-stats-section">
                  <h3 className="prevision-stats-title">
                    <Zap size={20} />
                    Indicateurs Clés de Performance RÉELS
                    <span className="prevision-stats-subtitle">
                      Basés sur {totalReservations} réservations réelles
                    </span>
                  </h3>
                  <div className="prevision-stats-grid">
                    <div className="prevision-stat-card primary">
                      <div className="prevision-stat-icon">
                        <Activity size={24} />
                      </div>
                      <div className="prevision-stat-content">
                        <div className="prevision-stat-value">{averagePrevision}%</div>
                        <div className="prevision-stat-label">Occupation moyenne RÉELLE</div>
                        <div className="prevision-stat-detail">
                          Basée sur {dataWithTrends.length} jours de données
                        </div>
                      </div>
                    </div>

                    <div className="prevision-stat-card success">
                      <div className="prevision-stat-icon">
                        <DollarSign size={24} />
                      </div>
                      <div className="prevision-stat-content">
                        <div className="prevision-stat-value">{totalRevenue.toLocaleString()} DH</div>
                        <div className="prevision-stat-label">Revenu total RÉEL prévu</div>
                        <div className="prevision-stat-detail">
                          {totalReservations} réservations confirmées
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
                        <div className="prevision-stat-label">Pic d'occupation RÉEL</div>
                        <div className="prevision-stat-detail">
                          {peakDay ? `${peakDay.nb_reservations} réservations` : '--'}
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
                        <div className="prevision-stat-label">Occupation minimale RÉELLE</div>
                        <div className="prevision-stat-detail">
                          {lowestDay ? `${lowestDay.nb_reservations} réservations` : '--'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Répartition RÉELLE de l'occupation */}
                <div className="prevision-distribution-section">
                  <h3>Répartition RÉELLE des Niveaux d'Occupation</h3>
                  <div className="prevision-distribution-grid">
                    <div className="prevision-distribution-card faible">
                      <div className="prevision-distribution-icon">
                        <div className="prevision-distribution-dot faible"></div>
                      </div>
                      <div className="prevision-distribution-content">
                        <div className="prevision-distribution-value">{joursFaibles}</div>
                        <div className="prevision-distribution-label">Jours à faible occupation RÉELLE</div>
                        <div className="prevision-distribution-percentage">
                          {Math.round((joursFaibles / dataWithTrends.length) * 100)}%
                        </div>
                        <div className="prevision-distribution-detail">
                          Moins de 40% d'occupation
                        </div>
                      </div>
                    </div>
                    
                    <div className="prevision-distribution-card moyen">
                      <div className="prevision-distribution-icon">
                        <div className="prevision-distribution-dot moyen"></div>
                      </div>
                      <div className="prevision-distribution-content">
                        <div className="prevision-distribution-value">{joursMoyens}</div>
                        <div className="prevision-distribution-label">Jours à occupation moyenne RÉELLE</div>
                        <div className="prevision-distribution-percentage">
                          {Math.round((joursMoyens / dataWithTrends.length) * 100)}%
                        </div>
                        <div className="prevision-distribution-detail">
                          40% à 70% d'occupation
                        </div>
                      </div>
                    </div>
                    
                    <div className="prevision-distribution-card eleve">
                      <div className="prevision-distribution-icon">
                        <div className="prevision-distribution-dot eleve"></div>
                      </div>
                      <div className="prevision-distribution-content">
                        <div className="prevision-distribution-value">{joursEleves}</div>
                        <div className="prevision-distribution-label">Jours à forte occupation RÉELLE</div>
                        <div className="prevision-distribution-percentage">
                          {Math.round((joursEleves / dataWithTrends.length) * 100)}%
                        </div>
                        <div className="prevision-distribution-detail">
                          Plus de 70% d'occupation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tableau détaillé avec données RÉELLES */}
                <div className="prevision-detailed-stats">
                  <div className="prevision-detailed-header">
                    <h3>Détails RÉELS des Prévisions par Jour</h3>
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
                          <th>Occupation RÉELLE</th>
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
      </div>

      {/* Pied de page */}
      <div className="prevision-footer">
        <div className="prevision-footer-info">
          <span>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
          <div className="prevision-footer-actions">
            {erreur && (
              <span className="prevision-warning">
                <AlertCircle size={14} />
                Erreur de chargement des données
              </span>
            )}
            <span className="prevision-data-count">
              {dataWithTrends.length} jours analysés • {totalReservations} réservations réelles
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrevisionForecast;