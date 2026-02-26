import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Calendar, 
  DollarSign, Users, MapPin, ChevronLeft, ChevronRight,
  RefreshCw, Download, Maximize2, Minimize2,
  Info, Clock, Activity, BarChart3, Target, FileText,
  X, Eye, EyeOff
} from 'lucide-react';
import './ann.css';

const API_BASE = 'https://backend-foot-omega.vercel.app/api/prevannule';

const PrevisionAnnulationDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [evolutionData, setEvolutionData] = useState([]);
  const [previsions, setPrevisions] = useState(null);
  const [previsionsJournalieres, setPrevisionsJournalieres] = useState(null);
  const [terrainsData, setTerrainsData] = useState([]);
  const [periode, setPeriode] = useState(14);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFloatingCard, setShowFloatingCard] = useState(true);
  const [floatingCardData, setFloatingCardData] = useState(null);
  const chartRef = useRef(null);

  // Chargement des données
  useEffect(() => {
    loadAllData();
  }, [periode]);

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [dashRes, evolRes, prevRes, prevJourRes, terrRes] = await Promise.all([
        fetch(`${API_BASE}/dashboard-annulations`),
        fetch(`${API_BASE}/evolution-annulations?mois_centre=true`),
        fetch(`${API_BASE}/previsions-annulations?periode=${periode}`),
        fetch(`${API_BASE}/previsions-journalieres?jours=${periode}`),
        fetch(`${API_BASE}/terrains-annulations`)
      ]);

      const [dash, evol, prev, prevJour, terr] = await Promise.all([
        dashRes.json(),
        evolRes.json(),
        prevRes.json(),
        prevJourRes.json(),
        terrRes.json()
      ]);

      if (dash.success) setDashboardData(dash.data);
      if (evol.success) setEvolutionData(evol.data);
      if (prev.success) setPrevisions(prev.data);
      if (prevJour.success) setPrevisionsJournalieres(prevJour.data);
      if (terr.success) setTerrainsData(terr.data.slice(0, 5));

      // Données pour la carte flottante
      if (dash.success && prev.success) {
        setFloatingCardData({
          revenusPerdusMois: dash.data.revenus_perdus_mois,
          annulationsMois: dash.data.annulations_mois,
          annulationsPrevues: prev.data.previsions_globales?.annulations_prevues_total || 0,
          revenusRisque: prev.data.previsions_globales?.revenus_risque_total || 0
        });
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Erreur chargement:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDFReport = () => {
    // Création d'un rapport PDF simplifié
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rapport Annulations - ${new Date().toLocaleDateString('fr-FR')}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #10b981; margin: 0; }
          .section { margin-bottom: 30px; }
          .section-title { background: #f8fafc; padding: 10px; border-left: 4px solid #10b981; margin-bottom: 15px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
          .kpi-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
          .kpi-value { font-size: 24px; font-weight: bold; color: #1e293b; }
          .kpi-label { font-size: 14px; color: #64748b; }
          .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .table th, .table td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
          .table th { background: #f8fafc; }
          .risk-high { background: #fef2f2; color: #dc2626; }
          .risk-medium { background: #fffbeb; color: #d97706; }
          .risk-low { background: #f0fdf4; color: #10b981; }
          .current-month { background: #10b98120; font-weight: bold; border-left: 3px solid #10b981; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RAPPORT ANNULATIONS - TERRAINS DE FOOT</h1>
          <p>Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          <p>Période d'analyse: ${periode} jours | Mois courant centré (5 mois avant / 6 mois après)</p>
        </div>

        ${dashboardData ? `
        <div class="section">
          <div class="section-title"><h2>STATISTIQUES DU MOIS</h2></div>
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-value">${formatNumber(dashboardData.revenus_perdus_mois)} DH</div>
              <div class="kpi-label">Revenus perdus ce mois</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${dashboardData.annulations_mois}</div>
              <div class="kpi-label">Annulations ce mois</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${dashboardData.terrains_affectes}</div>
              <div class="kpi-label">Terrains affectés</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${formatPercent(dashboardData.taux_annulation)}</div>
              <div class="kpi-label">Taux d'annulation</div>
            </div>
          </div>
        </div>
        ` : ''}

        ${previsions ? `
        <div class="section">
          <div class="section-title"><h2>PRÉVISIONS SUR ${periode} JOURS</h2></div>
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-value">${previsions.previsions_globales?.annulations_prevues_total || 0}</div>
              <div class="kpi-label">Annulations prévues</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${formatNumber(previsions.previsions_globales?.revenus_risque_total || 0)} DH</div>
              <div class="kpi-label">Revenus à risque</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${formatPercent(previsions.previsions_globales?.taux_annulation_moyen_prevu || 0)}</div>
              <div class="kpi-label">Taux d'annulation prévu</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value" style="color: ${
                previsions.previsions_globales?.niveau_risque_global === 'Élevé' ? '#ef4444' :
                previsions.previsions_globales?.niveau_risque_global === 'Modéré' ? '#f59e0b' : '#10b981'
              }">${previsions.previsions_globales?.niveau_risque_global || 'Faible'}</div>
              <div class="kpi-label">Niveau de risque</div>
            </div>
          </div>
        </div>
        ` : ''}

        ${evolutionData.length > 0 ? `
        <div class="section">
          <div class="section-title"><h2>ÉVOLUTION DES ANNULATIONS (12 mois - Mois courant centré)</h2></div>
          <table class="table">
            <thead>
              <tr>
                <th>Période</th>
                <th>Annulations</th>
                <th>Confirmations</th>
                <th>Total</th>
                <th>Taux</th>
                <th>Revenus perdus</th>
              </tr>
            </thead>
            <tbody>
              ${evolutionData.map(item => `
                <tr ${item.est_mois_courant ? 'class="current-month"' : ''}>
                  <td><strong>${item.periode_affichage}${item.est_mois_courant ? ' (Courant)' : ''}</strong></td>
                  <td>${item.annulations}</td>
                  <td>${item.confirmations}</td>
                  <td>${item.total_reservations}</td>
                  <td>${formatPercent(item.taux_annulation_mensuel)}</td>
                  <td>${formatNumber(item.revenus_perdus)} DH</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${previsionsJournalieres ? `
        <div class="section">
          <div class="section-title"><h2>PRÉVISIONS JOURNALIÈRES DÉTAILLÉES</h2></div>
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Jour</th>
                <th>Réservations</th>
                <th>Annulations prévues</th>
                <th>Revenus à risque</th>
                <th>Niveau risque</th>
              </tr>
            </thead>
            <tbody>
              ${previsionsJournalieres.previsions_journalieres?.slice(0, 10).map(jour => `
                <tr>
                  <td>${jour.date_affichage}</td>
                  <td>${jour.jour_semaine}</td>
                  <td>${jour.reservations_prevues}</td>
                  <td>${jour.annulations_prevues}</td>
                  <td>${formatNumber(jour.revenus_risque_perte)} DH</td>
                  <td style="color: ${
                    jour.niveau_risque === 'Élevé' ? '#ef4444' :
                    jour.niveau_risque === 'Modéré' ? '#f59e0b' : '#10b981'
                  }">${jour.niveau_risque}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${terrainsData.length > 0 ? `
        <div class="section">
          <div class="section-title"><h2>TERRAINS LES PLUS AFFECTÉS</h2></div>
          <table class="table">
            <thead>
              <tr>
                <th>Terrain</th>
                <th>Type</th>
                <th>Annulations</th>
                <th>Revenus perdus</th>
                <th>Taux</th>
              </tr>
            </thead>
            <tbody>
              ${terrainsData.map(terrain => `
                <tr>
                  <td>${terrain.nomterrain}</td>
                  <td>${terrain.typeterrain}</td>
                  <td>${terrain.annulations_total}</td>
                  <td>${formatNumber(terrain.revenus_perdus)} DH</td>
                  <td>${formatPercent(terrain.taux_annulation_terrain)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title"><h2>SYNTHÈSE</h2></div>
          <p><strong>Date de génération:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>Période analysée:</strong> ${periode} jours</p>
          <p><strong>Période d'évolution:</strong> 12 mois (5 mois avant / 6 mois après le mois courant)</p>
          <p><strong>Données historiques:</strong> ${evolutionData.length} mois</p>
          <p><strong>Terrains analysés:</strong> ${terrainsData.length}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const scrollChart = (direction) => {
    if (chartRef.current) {
      const scrollAmount = 200;
      chartRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(num || 0));
  };

  const formatPercent = (num) => {
    return `${Math.round(num || 0)}%`;
  };

  const getNiveauRisqueColor = (niveau) => {
    switch (niveau) {
      case 'Élevé': return '#ef4444';
      case 'Modéré': return '#f59e0b';
      case 'Faible': return '#10b981';
      default: return '#64748b';
    }
  };

  if (isLoading) {
    return (
      <div className="prevision-loading-container">
        <div className="prevision-spinner"></div>
        <p className="prevision-loading-text">Chargement des prévisions d'annulation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prevision-error-container">
        <AlertTriangle size={48} color="#ef4444" />
        <h3 className="prevision-error-title">Erreur de chargement</h3>
        <p className="prevision-error-message">{error}</p>
        <button className="prevision-retry-btn" onClick={loadAllData}>
          <RefreshCw size={18} />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={`prevision-card ${isFullScreen ? 'prevision-card-fullscreen' : ''}`}>
      
      {/* Carte flottante résumé */}
      {showFloatingCard && floatingCardData && (
        <div className="prevision-floating-card">
          <div className="prevision-floating-card-header">
            <h3 className="prevision-floating-card-title">Résumé Rapide</h3>
            <button 
              className="prevision-floating-card-close"
              onClick={() => setShowFloatingCard(false)}
            >
              <X size={16} />
            </button>
          </div>
          <div className="prevision-floating-card-content">
            <div className="prevision-floating-stat">
              <DollarSign size={16} color="#ef4444" />
              <span>{formatNumber(floatingCardData.revenusPerdusMois)} DH perdus ce mois</span>
            </div>
            <div className="prevision-floating-stat">
              <AlertTriangle size={16} color="#f59e0b" />
              <span>{floatingCardData.annulationsMois} annulations ce mois</span>
            </div>
            <div className="prevision-floating-stat">
              <Target size={16} color="#10b981" />
              <span>{floatingCardData.annulationsPrevues} annulations prévues</span>
            </div>
            <div className="prevision-floating-stat">
              <Activity size={16} color="#ef4444" />
              <span>{formatNumber(floatingCardData.revenusRisque)} DH à risque</span>
            </div>
          </div>
        </div>
      )}

      {/* Bouton pour afficher/masquer la carte flottante */}
      {!showFloatingCard && (
        <button 
          className="prevision-show-floating-card-btn"
          onClick={() => setShowFloatingCard(true)}
        >
          <Eye size={16} />
        </button>
      )}

      {/* En-tête */}
      <div className="prevision-header">
        <div className="prevision-header-main">
          <div className="prevision-title">
            <div className="prevision-title-icon">
              <AlertTriangle size={28} />
            </div>
            <div className="prevision-title-content">
              <h2>Tableau de Bord Annulations</h2>
              <p className="prevision-subtitle">
                <Clock size={14} />
                Analyse & Prévisions en temps réel
                <span className="prevision-data-source-badge">Mois courant centré</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="prevision-header-actions">
          <div className="prevision-period-selector">
            <span className="prevision-period-label">Période:</span>
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

          <button className="prevision-action-btn" onClick={generatePDFReport}>
            <FileText size={18} />
          </button>
          
          <button className="prevision-action-btn" onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          
          <button className="prevision-action-btn" onClick={loadAllData}>
            <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      {/* Contenu principal avec défilement */}
      <div className="prevision-content-wrapper">
        <div className="prevision-content-scroll">
          <div className="prevision-content">

            {/* KPIs Principaux */}
            {dashboardData && (
              <div className="prevision-kpi-grid">
                <div className="prevision-kpi-card prevision-kpi-danger">
                  <div className="prevision-kpi-icon">
                    <DollarSign size={24} />
                  </div>
                  <div className="prevision-kpi-content">
                    <div className="prevision-kpi-value">{formatNumber(dashboardData.revenus_perdus_mois)} DH</div>
                    <div className="prevision-kpi-label">Revenus perdus ce mois</div>
                    <div className="prevision-kpi-trend">
                      {dashboardData.trends?.revenus_perdus?.value > 0 ? (
                        <TrendingUp size={14} color="#ef4444" />
                      ) : (
                        <TrendingDown size={14} color="#10b981" />
                      )}
                      <span>{Math.abs(dashboardData.trends?.revenus_perdus?.value || 0)}% vs mois dernier</span>
                    </div>
                  </div>
                </div>

                <div className="prevision-kpi-card prevision-kpi-warning">
                  <div className="prevision-kpi-icon">
                    <Activity size={24} />
                  </div>
                  <div className="prevision-kpi-content">
                    <div className="prevision-kpi-value">{dashboardData.annulations_mois}</div>
                    <div className="prevision-kpi-label">Annulations ce mois</div>
                    <div className="prevision-kpi-trend">
                      <Target size={14} />
                      <span>Taux: {formatPercent(dashboardData.taux_annulation)}</span>
                    </div>
                  </div>
                </div>

                <div className="prevision-kpi-card prevision-kpi-info">
                  <div className="prevision-kpi-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="prevision-kpi-content">
                    <div className="prevision-kpi-value">{dashboardData.terrains_affectes}</div>
                    <div className="prevision-kpi-label">Terrains affectés</div>
                    <div className="prevision-kpi-trend">
                      <Clock size={14} />
                      <span>Aujourd'hui: {dashboardData.annules_aujourdhui}</span>
                    </div>
                  </div>
                </div>

                <div className="prevision-kpi-card prevision-kpi-success">
                  <div className="prevision-kpi-icon">
                    <Users size={24} />
                  </div>
                  <div className="prevision-kpi-content">
                    <div className="prevision-kpi-value">{dashboardData.confirmes_aujourdhui}</div>
                    <div className="prevision-kpi-label">Confirmées aujourd'hui</div>
                    <div className="prevision-kpi-trend">
                      <span>Total: {dashboardData.total_aujourdhui}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Évolution Mensuelle avec mois courant centré */}
            {evolutionData.length > 0 && (
              <div className="prevision-chart-section">
                <div className="prevision-chart-header">
                  <div className="prevision-chart-title-section">
                    <h3>
                      <BarChart3 size={20} />
                      Évolution des Annulations (12 mois - Mois courant centré)
                    </h3>
                    <div className="prevision-chart-legend">
                      <div className="prevision-legend-item">
                        <div className="prevision-legend-color" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}></div>
                        <span>Annulations</span>
                      </div>
                      <div className="prevision-legend-item">
                        <div className="prevision-legend-color" style={{ background: '#f1f5f9' }}></div>
                        <span>Base de comparaison</span>
                      </div>
                      <div className="prevision-legend-item">
                        <div className="prevision-legend-color" style={{ background: '#10b981', border: '2px solid #10b981' }}></div>
                        <span>Mois courant</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="prevision-chart-controls">
                    <div className="prevision-chart-stats">
                      <div className="prevision-chart-average">
                        Moyenne: <strong>{Math.round(evolutionData.reduce((acc, item) => acc + item.annulations, 0) / evolutionData.length)}</strong>
                      </div>
                      <div className="prevision-chart-period">
                        Mois courant: <strong style={{color: '#10b981'}}>
                          {evolutionData.find(item => item.est_mois_courant)?.annulations || 0}
                        </strong>
                      </div>
                    </div>
                    <div className="prevision-scroll-buttons">
                      <button className="prevision-scroll-btn" onClick={() => scrollChart('left')}>
                        <ChevronLeft size={16} />
                      </button>
                      <button className="prevision-scroll-btn" onClick={() => scrollChart('right')}>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="prevision-chart-scroll-container">
                  <div className="prevision-chart-scroll" ref={chartRef}>
                    {evolutionData.map((item, index) => {
                      const maxValue = Math.max(...evolutionData.map(d => d.annulations));
                      const height = (item.annulations / maxValue) * 100;
                      
                      return (
                        <div
                          key={index}
                          className={`prevision-chart-column ${hoveredBar === index ? 'selected' : ''} ${item.est_mois_courant ? 'current-month' : ''}`}
                          onMouseEnter={() => setHoveredBar(index)}
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          <div className="prevision-column-header">
                            <div className="prevision-column-badge" style={{
                              background: item.est_mois_courant ? '#10b981' : 'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white'
                            }}>
                              {item.periode_affichage}
                            </div>
                            {item.est_mois_courant && (
                              <div className="prevision-column-trend" style={{background: '#10b98120'}}>
                                <Clock size={12} color="#10b981" />
                              </div>
                            )}
                          </div>
                          
                          <div className="prevision-column-background">
                            <div
                              className="prevision-column-fill"
                              style={{
                                height: `${Math.max(height, 5)}%`,
                                background: item.est_mois_courant 
                                  ? 'linear-gradient(135deg, #10b981, #059669)'
                                  : 'linear-gradient(135deg, #10b981, #059669)',
                                opacity: item.est_mois_courant ? 1 : 0.7
                              }}
                            >
                              <span className="prevision-column-value-label">{item.annulations}</span>
                            </div>
                            {hoveredBar === index && (
                              <div className="prevision-column-indicator">
                                <Target size={10} />
                                {formatPercent(item.taux_annulation_mensuel)}
                              </div>
                            )}
                          </div>
                          
                          <div className="prevision-column-labels">
                            <div className="prevision-column-day">{item.periode_affichage.split(' ')[0]}</div>
                            <div className="prevision-column-date">{item.periode_affichage.split(' ')[1]}</div>
                            <div className="prevision-column-revenue">
                              <DollarSign size={10} />
                              {formatNumber(item.revenus_perdus / 1000)}k
                            </div>
                          </div>

                          {hoveredBar === index && (
                            <div className="prevision-tooltip">
                              <div className="prevision-tooltip-header">
                                <div className="prevision-tooltip-date">
                                  <Calendar size={14} />
                                  <div>
                                    <strong>{item.periode_affichage}</strong>
                                    {item.est_mois_courant && (
                                      <div className="prevision-tooltip-day">Mois courant</div>
                                    )}
                                  </div>
                                </div>
                                <div className="prevision-tooltip-trend">
                                  <TrendingUp size={12} color="#10b981" />
                                  <span>Taux: {formatPercent(item.taux_annulation_mensuel)}</span>
                                </div>
                              </div>
                              
                              <div className="prevision-tooltip-description">
                                <Info size={16} />
                                <span>
                                  {item.est_mois_courant 
                                    ? "Mois en cours d'analyse. Les données sont partielles et mises à jour en temps réel."
                                    : "Données historiques complètes du mois."}
                                </span>
                              </div>
                              
                              <div className="prevision-tooltip-metrics">
                                <div className="prevision-tooltip-metric main">
                                  <div className="prevision-metric-info">
                                    <span className="prevision-metric-label">Annulations totales</span>
                                    <span className="prevision-metric-value" style={{color: '#ef4444'}}>{item.annulations}</span>
                                    <span className="prevision-metric-detail">sur {item.total_reservations} réservations</span>
                                    <div className="prevision-metric-calculation">
                                      Taux: {item.annulations}/{item.total_reservations} = {item.taux_annulation_mensuel}%
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="prevision-tooltip-grid">
                                  <div className="prevision-tooltip-metric compact">
                                    <div className="prevision-metric-info">
                                      <span className="prevision-metric-label">Confirmations</span>
                                      <span className="prevision-metric-value" style={{color: '#10b981'}}>{item.confirmations}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="prevision-tooltip-metric compact">
                                    <div className="prevision-metric-info">
                                      <span className="prevision-metric-label">Revenus perdus</span>
                                      <span className="prevision-metric-value" style={{color: '#ef4444'}}>{formatNumber(item.revenus_perdus)} DH</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="prevision-tooltip-footer">
                                <div className="prevision-occupation-level">
                                  Niveau: <strong>{item.taux_annulation_mensuel > 20 ? 'Élevé' : item.taux_annulation_mensuel > 10 ? 'Modéré' : 'Faible'}</strong>
                                </div>
                                <div className="prevision-data-source">
                                  Données réelles
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="prevision-chart-help">
                  <Info size={16} />
                  <span>
                    Analyse sur 12 mois avec le mois courant centré (5 mois avant / 6 mois après). 
                    Le mois en cours est mis en évidence en vert.
                  </span>
                </div>
              </div>
            )}

            {/* Prévisions Globales */}
            {previsions && (
              <div className="prevision-stats-section">
                <h3 className="prevision-stats-title">
                  <Target size={20} />
                  Prévisions d'Annulation ({periode} jours)
                  <span className="prevision-stats-subtitle">Basé sur les tendances historiques</span>
                </h3>
                
                <div className="prevision-stats-grid">
                  <div className="prevision-stat-card prevision-stat-card-success">
                    <div className="prevision-stat-icon">
                      <AlertTriangle size={20} />
                    </div>
                    <div className="prevision-stat-content">
                      <div className="prevision-stat-value">
                        {previsions.previsions_globales?.annulations_prevues_total || 0}
                      </div>
                      <div className="prevision-stat-label">Annulations prévues</div>
                      <div className="prevision-stat-detail">
                        Basé sur {previsions.previsions_globales?.reservations_prevues_total || 0} réservations
                      </div>
                    </div>
                  </div>

                  <div className="prevision-stat-card prevision-stat-card-danger">
                    <div className="prevision-stat-icon">
                      <DollarSign size={20} />
                    </div>
                    <div className="prevision-stat-content">
                      <div className="prevision-stat-value">
                        {formatNumber(previsions.previsions_globales?.revenus_risque_total || 0)} DH
                      </div>
                      <div className="prevision-stat-label">Revenus à risque</div>
                      <div className="prevision-stat-detail">
                        Taux: {formatPercent(previsions.previsions_globales?.taux_annulation_moyen_prevu || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="prevision-stat-card prevision-stat-card-warning">
                    <div className="prevision-stat-icon">
                      <Activity size={20} />
                    </div>
                    <div className="prevision-stat-content">
                      <div className="prevision-stat-value" style={{
                        color: getNiveauRisqueColor(previsions.previsions_globales?.niveau_risque_global)
                      }}>
                        {previsions.previsions_globales?.niveau_risque_global || 'Faible'}
                      </div>
                      <div className="prevision-stat-label">Niveau de risque global</div>
                      <div className="prevision-stat-detail">
                        {previsions.previsions_globales?.periode_analyse || 0} jours analysés
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jours à haut risque */}
                {previsions.jours_haut_risque && previsions.jours_haut_risque.length > 0 && (
                  <div className="prevision-risk-section">
                    <h4 className="prevision-risk-title">
                      <AlertTriangle size={16} color="#ef4444" />
                      Jours à Haut Risque
                    </h4>
                    <div className="prevision-risk-grid">
                      {previsions.jours_haut_risque.map((jour, index) => (
                        <div key={index} className="prevision-risk-card">
                          <div className="prevision-risk-date">
                            <div className="prevision-risk-day">{jour.jour_semaine}</div>
                            <div className="prevision-risk-date-num">
                              {new Date(jour.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                          <div className="prevision-risk-stats">
                            <div className="prevision-risk-stat">
                              <span>{jour.annulations_prevues} annulations prévues</span>
                            </div>
                            <div className="prevision-risk-stat">
                              <span>{formatNumber(jour.revenus_risque_perte)} DH à risque</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Prévisions Journalières Détaillées */}
            {previsionsJournalieres && (
              <div className="prevision-distribution-section">
                <h3>
                  <Calendar size={20} />
                  Prévisions Journalières Détaillées
                </h3>
                
                <div className="prevision-distribution-grid">
                  {previsionsJournalieres.previsions_journalieres?.slice(0, 6).map((jour, index) => (
                    <div key={index} className={`prevision-distribution-card ${jour.niveau_risque.toLowerCase()}`}>
                      <div className="prevision-distribution-icon">
                        <div className={`prevision-distribution-dot ${jour.niveau_risque.toLowerCase()}`}></div>
                      </div>
                      <div className="prevision-distribution-content">
                        <div className="prevision-distribution-value">
                          {jour.reservations_prevues} rés.
                        </div>
                        <div className="prevision-distribution-label">
                          {jour.jour_semaine} {jour.date_affichage}
                        </div>
                        <div className="prevision-distribution-percentage">
                          {jour.annulations_prevues} annulations prévues
                        </div>
                        <div className="prevision-distribution-detail">
                          {formatNumber(jour.revenus_risque_perte)} DH à risque
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Terrains Affectés */}
            {terrainsData.length > 0 && (
              <div className="prevision-detailed-stats">
                <div className="prevision-detailed-header">
                  <h3>
                    <MapPin size={20} />
                    Top 5 Terrains les Plus Affectés
                  </h3>
                  <button className="prevision-toggle-stats" onClick={generatePDFReport}>
                    <FileText size={14} />
                    Exporter en PDF
                  </button>
                </div>
                
                <div className="prevision-stats-table-container">
                  <table className="prevision-stats-table">
                    <thead>
                      <tr>
                        <th>Rang</th>
                        <th>Terrain</th>
                        <th>Type</th>
                        <th>Annulations</th>
                        <th>Revenus perdus</th>
                        <th>Taux</th>
                        <th>Période max</th>
                      </tr>
                    </thead>
                    <tbody>
                      {terrainsData.map((terrain, index) => (
                        <tr key={index}>
                          <td><strong>#{index + 1}</strong></td>
                          <td>
                            <div className="prevision-table-date">
                              <strong>{terrain.nomterrain}</strong>
                            </div>
                          </td>
                          <td className="prevision-table-type">{terrain.typeterrain}</td>
                          <td>
                            <div className="prevision-table-reservations">
                              <AlertTriangle size={14} color="#ef4444" />
                              <span style={{color: '#ef4444', fontWeight: '700'}}>{terrain.annulations_total}</span>
                            </div>
                          </td>
                          <td>
                            <div className="prevision-table-revenue">
                              <DollarSign size={14} color="#f59e0b" />
                              <span>{formatNumber(terrain.revenus_perdus)} DH</span>
                            </div>
                          </td>
                          <td>
                            <div className="prevision-table-occupation">
                              <div className="prevision-occupation-bar-container">
                                <div 
                                  className="prevision-occupation-bar" 
                                  style={{ 
                                    width: `${Math.min(100, terrain.taux_annulation_terrain)}%`,
                                    background: terrain.taux_annulation_terrain > 20 
                                      ? '#ef4444' 
                                      : terrain.taux_annulation_terrain > 10 
                                      ? '#f59e0b' 
                                      : '#10b981'
                                  }}
                                ></div>
                              </div>
                              <span className="prevision-occupation-value">{formatPercent(terrain.taux_annulation_terrain)}</span>
                            </div>
                          </td>
                          <td>
                            <span className="prevision-table-badge" style={{
                              background: '#10b98120',
                              color: '#10b981',
                              border: '1px solid #10b981'
                            }}>
                              {terrain.periode_max_annulations || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Indicateur de défilement */}
            {evolutionData.length > 12 && (
              <div className="prevision-scroll-hint">
                <ChevronLeft size={14} />
                Faites défiler pour voir plus de mois
                <ChevronRight size={14} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="prevision-footer">
        <div className="prevision-footer-info">
          <Info size={14} />
          <span>Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
          <span className="prevision-warning">
            <AlertTriangle size={14} />
            Mois courant centré: 5 mois avant / 6 mois après
          </span>
        </div>
        <div className="prevision-footer-actions">
          <button className="prevision-action-btn small" onClick={generatePDFReport}>
            <FileText size={14} />
            PDF
          </button>
          <span className="prevision-data-count">
            {evolutionData.length} mois • {terrainsData.length} terrains
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrevisionAnnulationDashboard;