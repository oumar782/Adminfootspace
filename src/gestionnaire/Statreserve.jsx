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
  Activity,
  Maximize2,
  Minimize2,
  FileText,
  Download,
  X,
  Eye,
  Sparkles,
  Flame,
  Droplets,
  Sun,
  Moon,
  Stars,
  Sigma,
  ChartNoAxesCombined,
  Gauge,
  CalendarDays,
  Hash,
  Trophy,
  Medal,
  Zap,
  Globe,
  Sparkle,
  Rocket,
  Crown,
  Heart,
  CircleDollarSign,
  CalendarRange,
  SunMedium,
  CloudMoon,
  Sunrise,
  Sunset
} from 'lucide-react';
import './statreserve.css';

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
  const [showFloatingCard, setShowFloatingCard] = useState(true);
  const [floatingCardData, setFloatingCardData] = useState(null);
  const chartScrollRef = useRef(null);
  const cardRef = useRef(null);
  const contentRef = useRef(null);

  // Fonction pour calculer le pourcentage d'occupation RÉEL basé sur les réservations
  const calculerPourcentageOccupationReel = (nbReservations, nbTerrains) => {
    if (!nbTerrains || nbTerrains === 0) return 0;
    const capaciteMaxParTerrain = 8;
    const capaciteTotale = nbTerrains * capaciteMaxParTerrain;
    const pourcentage = (nbReservations / capaciteTotale) * 100;
    return Math.min(Math.round(pourcentage), 100);
  };

  const fetchPrevisions = async () => {
    try {
      setIsLoading(true);
      setErreur(null);
      
      const response = await fetch(`https://backend-foot-omega.vercel.app/api/reservation/previsions/detaillees?jours=${periode}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const formattedData = result.data.map((item, index) => {
          const nbReservations = parseInt(item.nb_reservations) || 0;
          const nbTerrains = parseInt(item.nb_terrains) || 1;
          const revenu = parseInt(item.revenu_attendu) || 0;
          const pourcentageReel = calculerPourcentageOccupationReel(nbReservations, nbTerrains);

          return {
            id: index,
            day: `J+${index + 1}`,
            prevision: pourcentageReel,
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

        if (formattedData.length > 0) {
          const totalRevenue = formattedData.reduce((sum, item) => sum + (item.revenu_attendu || 0), 0);
          const totalReservations = formattedData.reduce((sum, item) => sum + (item.nb_reservations || 0), 0);
          const averagePrevision = Math.round(formattedData.reduce((sum, item) => sum + item.prevision, 0) / formattedData.length);
          
          setFloatingCardData({
            averagePrevision,
            totalRevenue,
            totalReservations,
            periode
          });
        }
      } else {
        throw new Error(result.message || 'Aucune donnée disponible');
      }
    } catch (error) {
      setErreur(`Impossible de charger les prévisions: ${error.message}`);
      
      const demoData = Array.from({ length: periode }, (_, i) => {
        const baseReservations = Math.floor(Math.random() * 10) + 5;
        const variation = Math.sin(i * 0.5) * 3;
        const nbReservations = Math.max(1, Math.round(baseReservations + variation));
        const nbTerrains = Math.floor(Math.random() * 3) + 2;
        const pourcentageReel = calculerPourcentageOccupationReel(nbReservations, nbTerrains);
        const revenu = nbReservations * 120;

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
      
      const totalRevenue = demoData.reduce((sum, item) => sum + (item.revenu_attendu || 0), 0);
      const totalReservations = demoData.reduce((sum, item) => sum + (item.nb_reservations || 0), 0);
      const averagePrevision = Math.round(demoData.reduce((sum, item) => sum + item.prevision, 0) / demoData.length);
      
      setFloatingCardData({
        averagePrevision,
        totalRevenue,
        totalReservations,
        periode
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Génération du rapport PDF amélioré
  const generatePDFReport = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rapport Prévisions Occupation - ${new Date().toLocaleDateString('fr-FR')}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #1a1f36;
          }
          .report-container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 40px;
            padding: 40px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.3);
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px;
            position: relative;
          }
          .header h1 { 
            font-size: 3em;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
          }
          .header p {
            color: #6b7280;
            font-size: 1.1em;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 25px;
            margin-bottom: 40px;
          }
          .kpi-card {
            background: white;
            border-radius: 25px;
            padding: 25px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            transition: transform 0.3s;
          }
          .kpi-card:hover { transform: translateY(-5px); }
          .kpi-value {
            font-size: 2.5em;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
          }
          .kpi-label {
            color: #6b7280;
            font-weight: 600;
            font-size: 1em;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 15px;
            margin-top: 30px;
          }
          .table th {
            padding: 20px;
            text-align: left;
            font-weight: 700;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9em;
          }
          .table td {
            padding: 20px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.05);
          }
          .occupation-bar {
            background: #f3f4f6;
            height: 10px;
            border-radius: 10px;
            overflow: hidden;
            width: 150px;
          }
          .occupation-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 10px;
          }
          .risk-high { color: #ef4444; font-weight: 700; }
          .risk-medium { color: #f59e0b; font-weight: 700; }
          .risk-low { color: #10b981; font-weight: 700; }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 40px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <h1>⚡ RAPPORT PRÉVISIONS OCCUPATION</h1>
            <p>Généré le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            <p>Période d'analyse: ${periode} jours</p>
          </div>

          ${forecastData.length > 0 ? `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-value">${averagePrevision}%</div>
              <div class="kpi-label">Occupation moyenne</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${totalRevenue.toLocaleString()} DH</div>
              <div class="kpi-label">Revenu total prévu</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${totalReservations}</div>
              <div class="kpi-label">Réservations totales</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${joursEleves}</div>
              <div class="kpi-label">Jours à forte occupation</div>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Occupation</th>
                <th>Réservations</th>
                <th>Revenu</th>
                <th>Niveau</th>
              </tr>
            </thead>
            <tbody>
              ${dataWithTrends.map(item => `
                <tr>
                  <td><strong>${item.date}</strong><br><span style="color: #6b7280;">${item.day}</span></td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div class="occupation-bar">
                        <div class="occupation-fill" style="width: ${item.prevision}%"></div>
                      </div>
                      <span style="font-weight: 700;">${item.prevision}%</span>
                    </div>
                  </td>
                  <td>${item.nb_reservations}</td>
                  <td>${item.revenu_attendu} DH</td>
                  <td class="risk-${item.niveau_occupation.toLowerCase().includes('élev') ? 'high' : item.niveau_occupation.toLowerCase().includes('moyen') ? 'medium' : 'low'}">
                    ${item.niveau_occupation}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p style="text-align: center; padding: 50px;">Aucune donnée disponible</p>'}

          <div class="footer">
            <p>Rapport généré automatiquement par le système de prévisions</p>
            <p>© 2024 - Tous droits réservés</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

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

  const getWeatherIcon = (percentage) => {
    if (percentage >= 80) return <Flame size={16} />;
    if (percentage >= 60) return <Sun size={16} />;
    if (percentage >= 40) return <CloudMoon size={16} />;
    return <Moon size={16} />;
  };

  useEffect(() => {
    fetchPrevisions();
  }, [periode]);

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
    <div className="pf-skeleton">
      <div className="pf-skeleton-header">
        <div className="pf-skeleton-title"></div>
        <div className="pf-skeleton-filters"></div>
      </div>
      <div className="pf-skeleton-chart">
        {Array.from({ length: Math.min(periode, 14) }).map((_, i) => (
          <div key={i} className="pf-skeleton-bar" style={{ height: `${30 + Math.random() * 60}%` }}></div>
        ))}
      </div>
      <div className="pf-skeleton-footer">
        <div className="pf-skeleton-stat"></div>
        <div className="pf-skeleton-stat"></div>
        <div className="pf-skeleton-stat"></div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="pf-empty-state">
      <div className="pf-empty-state-icon">
        <Sparkles size={64} />
      </div>
      <h3>Aucune donnée disponible</h3>
      <p>Les prévisions n'ont pas pu être chargées depuis l'API.</p>
      <button className="pf-retry-btn" onClick={handleRetry}>
        <RefreshCw size={16} />
        Réessayer
      </button>
    </div>
  );

  return (
    <div 
      ref={cardRef}
      className={`pf-card ${isFullScreen ? 'pf-card-fullscreen' : ''}`}
    >
      
      {/* Carte flottante résumé */}
      {showFloatingCard && floatingCardData && (
        <div className="pf-floating-card">
          <div className="pf-floating-card-header">
            <div className="pf-floating-card-title">
              <Sparkles size={18} />
              <h3>Résumé Express</h3>
            </div>
            <button 
              className="pf-floating-card-close"
              onClick={() => setShowFloatingCard(false)}
            >
              <X size={16} />
            </button>
          </div>
          <div className="pf-floating-card-content">
            <div className="pf-floating-stat">
              <div className="pf-floating-stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                <Gauge size={14} />
              </div>
              <div className="pf-floating-stat-info">
                <span className="pf-floating-stat-label">Occupation moyenne</span>
                <span className="pf-floating-stat-value">{floatingCardData.averagePrevision}%</span>
              </div>
            </div>
            <div className="pf-floating-stat">
              <div className="pf-floating-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
                <CircleDollarSign size={14} />
              </div>
              <div className="pf-floating-stat-info">
                <span className="pf-floating-stat-label">Revenu prévu</span>
                <span className="pf-floating-stat-value">{floatingCardData.totalRevenue.toLocaleString()} DH</span>
              </div>
            </div>
            <div className="pf-floating-stat">
              <div className="pf-floating-stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}>
                <Users size={14} />
              </div>
              <div className="pf-floating-stat-info">
                <span className="pf-floating-stat-label">Réservations</span>
                <span className="pf-floating-stat-value">{floatingCardData.totalReservations}</span>
              </div>
            </div>
            <div className="pf-floating-stat">
              <div className="pf-floating-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                <CalendarRange size={14} />
              </div>
              <div className="pf-floating-stat-info">
                <span className="pf-floating-stat-label">Période analysée</span>
                <span className="pf-floating-stat-value">{floatingCardData.periode} jours</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton pour afficher/masquer la carte flottante */}
      {!showFloatingCard && (
        <button 
          className="pf-show-floating-card-btn"
          onClick={() => setShowFloatingCard(true)}
        >
          <Eye size={16} />
          <span>Afficher le résumé</span>
        </button>
      )}

      {/* En-tête */}
      <div className="pf-header">
        <div className="pf-header-main">
          <div className="pf-title">
            <div className="pf-title-icon">
              <Rocket size={28} />
            </div>
            <div className="pf-title-text">
              <h2>Prévisions d'Occupation</h2>
              <div className="pf-title-badge">
                <CalendarDays size={14} />
                <span>{periode} jours d'analyse</span>
              </div>
            </div>
          </div>
          <div className="pf-subtitle">
            <Sunrise size={16} />
            <span>Données en temps réel • Mise à jour automatique</span>
          </div>
        </div>
        
        <div className="pf-header-actions">
          <div className="pf-period-selector">
            {[7, 14, 21, 30].map(days => (
              <button
                key={days}
                className={`pf-period-btn ${periode === days ? 'active' : ''}`}
                onClick={() => setPeriode(days)}
              >
                {days}j
              </button>
            ))}
          </div>
          
          <div className="pf-header-buttons">
            <button 
              className="pf-pdf-button"
              onClick={generatePDFReport}
              title="Générer rapport PDF"
            >
              <FileText size={18} />
              <span>Rapport PDF</span>
            </button>
            
            <button 
              className="pf-action-btn"
              onClick={toggleFullScreen}
              title={isFullScreen ? "Réduire" : "Plein écran"}
            >
              {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button 
              className="pf-action-btn"
              onClick={handleRetry}
              disabled={isLoading}
              title="Actualiser les données"
            >
              <RefreshCw size={18} className={isLoading ? 'pf-spinning' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll horizontal */}
      {showScrollHint && (
        <div className="pf-scroll-hint">
          <ChevronLeft size={16} />
          <span>Faites défiler horizontalement pour voir plus de données</span>
          <ChevronRight size={16} />
        </div>
      )}

      {/* Contenu principal avec scroll horizontal et vertical */}
      <div className="pf-content-wrapper">
        <div 
          ref={contentRef}
          className="pf-content-scroll"
        >
          <div className="pf-content">
            {isLoading ? (
              renderSkeleton()
            ) : dataWithTrends.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                {/* Graphique avec pourcentages RÉELS */}
                <div className="pf-chart-section">
                  <div className="pf-chart-header">
                    <div className="pf-chart-title-section">
                      <h3>
                        <ChartNoAxesCombined size={24} />
                        Évolution des prévisions
                        <span className="pf-data-source-badge">
                          <Hash size={12} />
                          {totalReservations} réservations
                        </span>
                      </h3>
                      <div className="pf-chart-legend">
                        <div className="pf-legend-item">
                          <div className="pf-legend-color faible"></div>
                          <span>Faible (&lt;40%)</span>
                        </div>
                        <div className="pf-legend-item">
                          <div className="pf-legend-color moyen"></div>
                          <span>Moyen (40-60%)</span>
                        </div>
                        <div className="pf-legend-item">
                          <div className="pf-legend-color eleve"></div>
                          <span>Élevé (60-80%)</span>
                        </div>
                        <div className="pf-legend-item">
                          <div className="pf-legend-color tres-eleve"></div>
                          <span>Très élevé (&gt;80%)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pf-chart-controls">
                      <div className="pf-chart-stats">
                        <div className="pf-chart-average">
                          <Gauge size={16} />
                          <span>Moyenne: <strong>{averagePrevision}%</strong></span>
                        </div>
                        <div className="pf-chart-period">
                          <Users size={14} />
                          <span>{totalReservations} réservations</span>
                        </div>
                      </div>
                      <div className="pf-scroll-buttons">
                        <button onClick={() => handleScroll('left')} className="pf-scroll-btn" title="Défiler vers la gauche">
                          <ChevronLeft size={16} />
                        </button>
                        <button onClick={scrollToStart} className="pf-scroll-btn" title="Début">
                          Début
                        </button>
                        <button onClick={scrollToEnd} className="pf-scroll-btn" title="Fin">
                          Fin
                        </button>
                        <button onClick={() => handleScroll('right')} className="pf-scroll-btn" title="Défiler vers la droite">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pf-chart-scroll-container">
                    <div className="pf-chart-scroll" ref={chartScrollRef}>
                      {dataWithTrends.map((item, index) => (
                        <div
                          key={item.id}
                          className="pf-chart-column"
                          onMouseEnter={() => setHoveredDay(index)}
                          onMouseLeave={() => setHoveredDay(null)}
                        >
                          <div className="pf-column-header">
                            <span className="pf-column-badge" style={{ 
                              backgroundColor: item.badge.bgColor,
                              color: item.badge.color,
                              border: `1px solid ${item.badge.color}20`
                            }}>
                              {getWeatherIcon(item.prevision)}
                              {item.badge.label}
                            </span>
                            <div className="pf-column-trend" style={{ color: getTrendColor(item.trend) }}>
                              {getTrendIcon(item.trend)}
                            </div>
                          </div>
                          
                          <div className="pf-column-background">
                            <div
                              className="pf-column-fill"
                              style={{ 
                                height: `${Math.max(item.prevision, 8)}%`,
                                background: `linear-gradient(180deg, ${getOccupationColor(item.prevision)} 0%, ${getOccupationColor(item.prevision)}dd 100%)`
                              }}
                            >
                              <div className="pf-column-glow"></div>
                            </div>
                            <div className="pf-column-value-label">
                              {item.prevision}%
                            </div>
                            
                            <div className="pf-column-indicator">
                              <Users size={10} />
                              <span>{item.nb_reservations}</span>
                            </div>
                          </div>
                          
                          <div className="pf-column-labels">
                            <span className="pf-column-day">
                              {item.day.replace('J+', '')}
                            </span>
                            <span className="pf-column-date">
                              {getJourSemaine(item.jour_semaine)}
                            </span>
                            <span className="pf-column-revenue">
                              <DollarSign size={10} />
                              {item.revenu_attendu}DH
                            </span>
                          </div>

                          {/* Tooltip détaillé */}
                          {hoveredDay === index && (
                            <div className="pf-tooltip">
                              <div className="pf-tooltip-header">
                                <div className="pf-tooltip-date">
                                  <Calendar size={16} />
                                  <div>
                                    <strong>{item.date}</strong>
                                    <div className="pf-tooltip-day">{item.day}</div>
                                  </div>
                                </div>
                                <div 
                                  className="pf-tooltip-trend"
                                  style={{ color: getTrendColor(item.trend) }}
                                >
                                  {getTrendIcon(item.trend)}
                                  {getTrendLabel(item.trend)}
                                </div>
                              </div>
                              
                              <div className="pf-tooltip-description">
                                <Info size={14} />
                                {item.description}
                              </div>
                              
                              <div className="pf-tooltip-metrics">
                                <div className="pf-tooltip-metric main">
                                  <Target size={20} />
                                  <div className="pf-metric-info">
                                    <span className="pf-metric-label">Niveau d'occupation</span>
                                    <strong className="pf-metric-value" style={{ color: getOccupationColor(item.prevision) }}>
                                      {item.prevision}%
                                    </strong>
                                    <div className="pf-metric-detail">
                                      {item.nb_reservations} réservations / {item.nb_terrains} terrain(s)
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="pf-tooltip-grid">
                                  <div className="pf-tooltip-metric compact">
                                    <Users size={14} />
                                    <div className="pf-metric-info">
                                      <span>Réservations</span>
                                      <strong>{item.nb_reservations}</strong>
                                    </div>
                                  </div>
                                  
                                  <div className="pf-tooltip-metric compact">
                                    <DollarSign size={14} />
                                    <div className="pf-metric-info">
                                      <span>Revenu</span>
                                      <strong>{item.revenu_attendu} DH</strong>
                                    </div>
                                  </div>
                                  
                                  <div className="pf-tooltip-metric compact">
                                    <MapPin size={14} />
                                    <div className="pf-metric-info">
                                      <span>Terrains</span>
                                      <strong>{item.nb_terrains}</strong>
                                    </div>
                                  </div>

                                  <div className="pf-tooltip-metric compact">
                                    <Clock size={14} />
                                    <div className="pf-metric-info">
                                      <span>Type</span>
                                      <strong>{item.types_terrains}</strong>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="pf-tooltip-footer">
                                <span className="pf-occupation-level">
                                  <Trophy size={12} />
                                  <strong>{item.niveau_occupation}</strong>
                                </span>
                                <span className="pf-data-source">
                                  <Zap size={12} />
                                  Temps réel
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pf-chart-help">
                    <Info size={14} />
                    <span>Les pourcentages sont calculés en temps réel: (réservations / (terrains × 8)) × 100</span>
                  </div>
                </div>

                {/* Statistiques principales */}
                <div className="pf-stats-section">
                  <h3 className="pf-stats-title">
                    <Medal size={24} />
                    Indicateurs Clés de Performance
                    <span className="pf-stats-subtitle">
                      Basés sur {totalReservations} réservations
                    </span>
                  </h3>
                  <div className="pf-stats-grid">
                    <div className="pf-stat-card primary">
                      <div className="pf-stat-icon">
                        <Gauge size={24} />
                      </div>
                      <div className="pf-stat-content">
                        <div className="pf-stat-value">{averagePrevision}%</div>
                        <div className="pf-stat-label">Occupation moyenne</div>
                        <div className="pf-stat-detail">
                          Sur {dataWithTrends.length} jours
                        </div>
                      </div>
                      <div className="pf-stat-glow"></div>
                    </div>

                    <div className="pf-stat-card success">
                      <div className="pf-stat-icon">
                        <CircleDollarSign size={24} />
                      </div>
                      <div className="pf-stat-content">
                        <div className="pf-stat-value">{totalRevenue.toLocaleString()} DH</div>
                        <div className="pf-stat-label">Revenu total prévu</div>
                        <div className="pf-stat-detail">
                          {totalReservations} réservations
                        </div>
                      </div>
                      <div className="pf-stat-glow"></div>
                    </div>

                    <div className="pf-stat-card warning">
                      <div className="pf-stat-icon">
                        <Flame size={24} />
                      </div>
                      <div className="pf-stat-content">
                        <div className="pf-stat-value">
                          {peakDay ? `${peakDay.prevision}%` : '--%'}
                        </div>
                        <div className="pf-stat-label">Pic d'occupation</div>
                        <div className="pf-stat-detail">
                          {peakDay ? `${peakDay.nb_reservations} réservations` : '--'}
                        </div>
                      </div>
                      <div className="pf-stat-glow"></div>
                    </div>

                    <div className="pf-stat-card danger">
                      <div className="pf-stat-icon">
                        <Droplets size={24} />
                      </div>
                      <div className="pf-stat-content">
                        <div className="pf-stat-value">
                          {lowestDay ? `${lowestDay.prevision}%` : '--%'}
                        </div>
                        <div className="pf-stat-label">Occupation minimale</div>
                        <div className="pf-stat-detail">
                          {lowestDay ? `${lowestDay.nb_reservations} réservations` : '--'}
                        </div>
                      </div>
                      <div className="pf-stat-glow"></div>
                    </div>
                  </div>
                </div>

                {/* Répartition de l'occupation */}
                <div className="pf-distribution-section">
                  <h3>
                    <Sigma size={24} />
                    Répartition des niveaux d'occupation
                  </h3>
                  <div className="pf-distribution-grid">
                    <div className="pf-distribution-card faible">
                      <div className="pf-distribution-icon">
                        <Moon size={20} />
                      </div>
                      <div className="pf-distribution-content">
                        <div className="pf-distribution-value">{joursFaibles}</div>
                        <div className="pf-distribution-label">Jours à faible occupation</div>
                        <div className="pf-distribution-percentage">
                          {Math.round((joursFaibles / dataWithTrends.length) * 100)}%
                        </div>
                        <div className="pf-distribution-progress">
                          <div className="pf-progress-bar" style={{ width: `${(joursFaibles / dataWithTrends.length) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pf-distribution-card moyen">
                      <div className="pf-distribution-icon">
                        <SunMedium size={20} />
                      </div>
                      <div className="pf-distribution-content">
                        <div className="pf-distribution-value">{joursMoyens}</div>
                        <div className="pf-distribution-label">Jours à occupation moyenne</div>
                        <div className="pf-distribution-percentage">
                          {Math.round((joursMoyens / dataWithTrends.length) * 100)}%
                        </div>
                        <div className="pf-distribution-progress">
                          <div className="pf-progress-bar" style={{ width: `${(joursMoyens / dataWithTrends.length) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pf-distribution-card eleve">
                      <div className="pf-distribution-icon">
                        <Flame size={20} />
                      </div>
                      <div className="pf-distribution-content">
                        <div className="pf-distribution-value">{joursEleves}</div>
                        <div className="pf-distribution-label">Jours à forte occupation</div>
                        <div className="pf-distribution-percentage">
                          {Math.round((joursEleves / dataWithTrends.length) * 100)}%
                        </div>
                        <div className="pf-distribution-progress">
                          <div className="pf-progress-bar" style={{ width: `${(joursEleves / dataWithTrends.length) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tableau détaillé */}
                <div className="pf-detailed-stats">
                  <div className="pf-detailed-header">
                    <h3>
                      <Calendar size={20} />
                      Détail des prévisions par jour
                    </h3>
                    <button 
                      className="pf-toggle-stats"
                      onClick={() => setShowAllStats(!showAllStats)}
                    >
                      <Stars size={16} />
                      {showAllStats ? 'Voir moins' : `Voir tout (${dataWithTrends.length} jours)`}
                    </button>
                  </div>
                  
                  <div className="pf-stats-table-container">
                    <table className="pf-stats-table">
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
                              <div className="pf-table-date">
                                <strong>{item.date}</strong>
                                <span>{item.day}</span>
                              </div>
                            </td>
                            <td>
                              <div className="pf-table-occupation">
                                <div className="pf-occupation-bar-container">
                                  <div 
                                    className="pf-occupation-bar"
                                    style={{ 
                                      width: `${item.prevision}%`,
                                      backgroundColor: getOccupationColor(item.prevision)
                                    }}
                                  ></div>
                                </div>
                                <span className="pf-occupation-value">{item.prevision}%</span>
                              </div>
                            </td>
                            <td>
                              <div className="pf-table-reservations">
                                <Users size={14} />
                                <span>{item.nb_reservations}</span>
                              </div>
                            </td>
                            <td>
                              <div className="pf-table-revenue">
                                <DollarSign size={14} />
                                {item.revenu_attendu} DH
                              </div>
                            </td>
                            <td>
                              <div className="pf-table-terrains">
                                <MapPin size={14} />
                                {item.nb_terrains}
                              </div>
                            </td>
                            <td>
                              <div className="pf-table-type">
                                {item.types_terrains}
                              </div>
                            </td>
                            <td>
                              <span 
                                className="pf-table-badge"
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
                                className="pf-table-trend"
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
      <div className="pf-footer">
        <div className="pf-footer-info">
          <div className="pf-footer-left">
            <Sparkle size={14} />
            <span>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
          </div>
          <div className="pf-footer-actions">
            {erreur && (
              <span className="pf-warning">
                <AlertCircle size={14} />
                Erreur de chargement
              </span>
            )}
            <button 
              className="pf-pdf-button-small"
              onClick={generatePDFReport}
            >
              <Download size={14} />
              PDF
            </button>
            <span className="pf-data-count">
              <Calendar size={14} />
              {dataWithTrends.length} jours • {totalReservations} réservations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrevisionForecast;