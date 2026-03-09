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
        fetch(`${API_BASE}/evolution-annulations`),
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
          .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #f59e0b; margin: 0; }
          .section { margin-bottom: 30px; }
          .section-title { background: #f8fafc; padding: 10px; border-left: 4px solid #f59e0b; margin-bottom: 15px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
          .kpi-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
          .kpi-value { font-size: 24px; font-weight: bold; color: #1e293b; }
          .kpi-label { font-size: 14px; color: #64748b; }
          .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .table th, .table td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
          .table th { background: #f8fafc; }
          .risk-high { background: #fef2f2; color: #dc2626; }
          .risk-medium { background: #fffbeb; color: #d97706; }
          .risk-low { background: #f0fdf4; color: #059669; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RAPPORT ANNULATIONS - TERRAINS DE FOOT</h1>
          <p>Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          <p>Période d'analyse: ${periode} jours</p>
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
              <div class="kpi-value">${previsions.previsions_globales?.niveau_risque_global || 'Faible'}</div>
              <div class="kpi-label">Niveau de risque</div>
            </div>
          </div>
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
                  <td class="risk-${jour.niveau_risque.toLowerCase()}">${jour.niveau_risque}</td>
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
      <div className="pa-prevann-loading-container">
        <div className="pa-prevann-spinner"></div>
        <p className="pa-prevann-loading-text">Chargement des prévisions d'annulation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pa-prevann-error-container">
        <AlertTriangle size={48} color="#ef4444" />
        <h3 className="pa-prevann-error-title">Erreur de chargement</h3>
        <p className="pa-prevann-error-message">{error}</p>
        <button className="pa-prevann-retry-button" onClick={loadAllData}>
          <RefreshCw size={18} />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={`pa-prevann-container ${isFullScreen ? 'pa-prevann-fullscreen' : ''}`}>
      
      {/* Carte flottante résumé */}
      {showFloatingCard && floatingCardData && (
        <div className="pa-prevann-floating-card">
          <div className="pa-prevann-floating-header">
            <h3 className="pa-prevann-floating-title">Résumé Rapide</h3>
            <button 
              className="pa-prevann-floating-close"
              onClick={() => setShowFloatingCard(false)}
            >
              <X size={16} />
            </button>
          </div>
          <div className="pa-prevann-floating-content">
            <div className="pa-prevann-floating-stat">
              <DollarSign size={16} color="#ef4444" />
              <span>{formatNumber(floatingCardData.revenusPerdusMois)} DH perdus ce mois</span>
            </div>
            <div className="pa-prevann-floating-stat">
              <AlertTriangle size={16} color="#f59e0b" />
              <span>{floatingCardData.annulationsMois} annulations ce mois</span>
            </div>
            <div className="pa-prevann-floating-stat">
              <Target size={16} color="#3b82f6" />
              <span>{floatingCardData.annulationsPrevues} annulations prévues</span>
            </div>
            <div className="pa-prevann-floating-stat">
              <Activity size={16} color="#ef4444" />
              <span>{formatNumber(floatingCardData.revenusRisque)} DH à risque</span>
            </div>
          </div>
        </div>
      )}

      {/* Bouton pour afficher/masquer la carte flottante */}
      {!showFloatingCard && (
        <button 
          className="pa-prevann-show-floating-btn"
          onClick={() => setShowFloatingCard(true)}
        >
          <Eye size={16} />
        </button>
      )}

      {/* En-tête */}
      <div className="pa-prevann-header">
        <div className="pa-prevann-header-left">
          <div className="pa-prevann-title-section">
            <AlertTriangle size={28} color="#f59e0b" />
            <div>
              <h1 className="pa-prevann-title">Tableau de Bord Annulations</h1>
              <p className="pa-prevann-subtitle">Analyse & Prévisions en temps réel</p>
            </div>
          </div>
        </div>
        
        <div className="pa-prevann-header-right">
          <div className="pa-prevann-period-selector">
            {[7, 14, 30].map(days => (
              <button
                key={days}
                className={`pa-prevann-period-btn ${periode === days ? 'pa-prevann-period-btn-active' : ''}`}
                onClick={() => setPeriode(days)}
              >
                {days}j
              </button>
            ))}
          </div>

          <button className="pa-prevann-pdf-button" onClick={generatePDFReport}>
            <FileText size={18} />
            Générer PDF
          </button>
          
          <button className="pa-prevann-icon-btn" onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          
          <button className="pa-prevann-icon-btn" onClick={loadAllData}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* KPIs Principaux */}
      {dashboardData && (
        <div className="pa-prevann-kpi-grid">
          <div className="pa-prevann-kpi-card pa-prevann-kpi-danger">
            <div className="pa-prevann-kpi-icon">
              <DollarSign size={24} />
            </div>
            <div className="pa-prevann-kpi-content">
              <div className="pa-prevann-kpi-value">{formatNumber(dashboardData.revenus_perdus_mois)} DH</div>
              <div className="pa-prevann-kpi-label">Revenus perdus ce mois</div>
              <div className="pa-prevann-kpi-trend">
                {dashboardData.trends?.revenus_perdus?.value > 0 ? (
                  <TrendingUp size={14} color="#ef4444" />
                ) : (
                  <TrendingDown size={14} color="#10b981" />
                )}
                <span>{Math.abs(dashboardData.trends?.revenus_perdus?.value || 0)}% vs mois dernier</span>
              </div>
            </div>
          </div>

          <div className="pa-prevann-kpi-card pa-prevann-kpi-warning">
            <div className="pa-prevann-kpi-icon">
              <Activity size={24} />
            </div>
            <div className="pa-prevann-kpi-content">
              <div className="pa-prevann-kpi-value">{dashboardData.annulations_mois}</div>
              <div className="pa-prevann-kpi-label">Annulations ce mois</div>
              <div className="pa-prevann-kpi-trend">
                <Target size={14} />
                <span>Taux: {formatPercent(dashboardData.taux_annulation)}</span>
              </div>
            </div>
          </div>

          <div className="pa-prevann-kpi-card pa-prevann-kpi-info">
            <div className="pa-prevann-kpi-icon">
              <MapPin size={24} />
            </div>
            <div className="pa-prevann-kpi-content">
              <div className="pa-prevann-kpi-value">{dashboardData.terrains_affectes}</div>
              <div className="pa-prevann-kpi-label">Terrains affectés</div>
              <div className="pa-prevann-kpi-trend">
                <Clock size={14} />
                <span>Aujourd'hui: {dashboardData.annules_aujourdhui}</span>
              </div>
            </div>
          </div>

          <div className="pa-prevann-kpi-card pa-prevann-kpi-success">
            <div className="pa-prevann-kpi-icon">
              <Users size={24} />
            </div>
            <div className="pa-prevann-kpi-content">
              <div className="pa-prevann-kpi-value">{dashboardData.confirmes_aujourdhui}</div>
              <div className="pa-prevann-kpi-label">Confirmées aujourd'hui</div>
              <div className="pa-prevann-kpi-trend">
                <span>Total: {dashboardData.total_aujourdhui}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Évolution Mensuelle */}
      {evolutionData.length > 0 && (
        <div className="pa-prevann-chart-section">
          <div className="pa-prevann-chart-header">
            <h2 className="pa-prevann-chart-title">
              <BarChart3 size={20} />
              Évolution des Annulations (12 mois)
            </h2>
            <div className="pa-prevann-chart-controls">
              <button className="pa-prevann-chart-btn" onClick={() => scrollChart('left')}>
                <ChevronLeft size={16} />
              </button>
              <button className="pa-prevann-chart-btn" onClick={() => scrollChart('right')}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="pa-prevann-chart-container" ref={chartRef}>
            {evolutionData.map((item, index) => {
              const maxValue = Math.max(...evolutionData.map(d => d.annulations));
              const height = (item.annulations / maxValue) * 100;
              
              return (
                <div
                  key={index}
                  className="pa-prevann-bar-wrapper"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div className="pa-prevann-bar-container">
                    <div
                      className="pa-prevann-bar"
                      style={{
                        height: `${Math.max(height, 5)}%`,
                        background: item.taux_annulation_mensuel > 15 
                          ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                          : item.taux_annulation_mensuel > 10
                          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                          : 'linear-gradient(135deg, #10b981, #059669)'
                      }}
                    >
                      <span className="pa-prevann-bar-value">{item.annulations}</span>
                    </div>
                  </div>
                  
                  <div className="pa-prevann-bar-label">
                    <div className="pa-prevann-bar-month">{item.periode_affichage}</div>
                    <div className="pa-prevann-bar-rate">{formatPercent(item.taux_annulation_mensuel)}</div>
                  </div>

                  {hoveredBar === index && (
                    <div className="pa-prevann-tooltip">
                      <div className="pa-prevann-tooltip-header">
                        <Calendar size={14} />
                        <strong>{item.periode_affichage}</strong>
                      </div>
                      <div className="pa-prevann-tooltip-content">
                        <div className="pa-prevann-tooltip-row">
                          <span>Annulations:</span>
                          <strong>{item.annulations}</strong>
                        </div>
                        <div className="pa-prevann-tooltip-row">
                          <span>Confirmations:</span>
                          <strong>{item.confirmations}</strong>
                        </div>
                        <div className="pa-prevann-tooltip-row">
                          <span>Taux:</span>
                          <strong style={{color: '#ef4444'}}>{formatPercent(item.taux_annulation_mensuel)}</strong>
                        </div>
                        <div className="pa-prevann-tooltip-row">
                          <span>Revenus perdus:</span>
                          <strong>{formatNumber(item.revenus_perdus)} DH</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Prévisions Globales */}
      {previsions && (
        <div className="pa-prevann-previsions-section">
          <h2 className="pa-prevann-section-title">
            <Target size={20} />
            Prévisions d'Annulation ({periode} jours)
          </h2>
          
          <div className="pa-prevann-previsions-grid">
            <div className="pa-prevann-prevision-card">
              <div className="pa-prevann-prevision-icon">
                <AlertTriangle size={20} color="#f59e0b" />
              </div>
              <div className="pa-prevann-prevision-content">
                <div className="pa-prevann-prevision-value">
                  {previsions.previsions_globales?.annulations_prevues_total || 0}
                </div>
                <div className="pa-prevann-prevision-label">Annulations prévues</div>
                <div className="pa-prevann-prevision-detail">
                  Basé sur {previsions.previsions_globales?.reservations_prevues_total || 0} réservations
                </div>
              </div>
            </div>

            <div className="pa-prevann-prevision-card">
              <div className="pa-prevann-prevision-icon">
                <DollarSign size={20} color="#ef4444" />
              </div>
              <div className="pa-prevann-prevision-content">
                <div className="pa-prevann-prevision-value">
                  {formatNumber(previsions.previsions_globales?.revenus_risque_total || 0)} DH
                </div>
                <div className="pa-prevann-prevision-label">Revenus à risque</div>
                <div className="pa-prevann-prevision-detail">
                  Taux: {formatPercent(previsions.previsions_globales?.taux_annulation_moyen_prevu || 0)}
                </div>
              </div>
            </div>

            <div className="pa-prevann-prevision-card">
              <div className="pa-prevann-prevision-icon">
                <Activity size={20} color="#3b82f6" />
              </div>
              <div className="pa-prevann-prevision-content">
                <div className="pa-prevann-prevision-value" style={{color: getNiveauRisqueColor(previsions.previsions_globales?.niveau_risque_global)}}>
                  {previsions.previsions_globales?.niveau_risque_global || 'Faible'}
                </div>
                <div className="pa-prevann-prevision-label">Niveau de risque global</div>
                <div className="pa-prevann-prevision-detail">
                  {previsions.previsions_globales?.periode_analyse || 0} jours analysés
                </div>
              </div>
            </div>
          </div>

          {/* Jours à haut risque */}
          {previsions.jours_haut_risque && previsions.jours_haut_risque.length > 0 && (
            <div className="pa-prevann-risk-section">
              <h3 className="pa-prevann-risk-title">
                <AlertTriangle size={16} color="#ef4444" />
                Jours à Haut Risque
              </h3>
              <div className="pa-prevann-risk-grid">
                {previsions.jours_haut_risque.map((jour, index) => (
                  <div key={index} className="pa-prevann-risk-card">
                    <div className="pa-prevann-risk-date">
                      <div className="pa-prevann-risk-day">{jour.jour_semaine}</div>
                      <div className="pa-prevann-risk-date-num">{new Date(jour.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
                    </div>
                    <div className="pa-prevann-risk-stats">
                      <div className="pa-prevann-risk-stat">
                        <span>{jour.annulations_prevues} annulations prévues</span>
                      </div>
                      <div className="pa-prevann-risk-stat">
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
        <div className="pa-prevann-daily-section">
          <h2 className="pa-prevann-section-title">
            <Calendar size={20} />
            Prévisions Journalières Détaillées
          </h2>
          
          <div className="pa-prevann-daily-grid">
            {previsionsJournalieres.previsions_journalieres?.slice(0, 14).map((jour, index) => (
              <div key={index} className="pa-prevann-daily-card" style={{borderLeft: `4px solid ${getNiveauRisqueColor(jour.niveau_risque)}`}}>
                <div className="pa-prevann-daily-header">
                  <div className="pa-prevann-daily-date">
                    <div className="pa-prevann-daily-day">{jour.jour_semaine}</div>
                    <div className="pa-prevann-daily-date-num">{jour.date_affichage}</div>
                  </div>
                  <div className="pa-prevann-risk-badge" style={{background: getNiveauRisqueColor(jour.niveau_risque) + '20', color: getNiveauRisqueColor(jour.niveau_risque)}}>
                    {jour.niveau_risque}
                  </div>
                </div>
                
                <div className="pa-prevann-daily-stats">
                  <div className="pa-prevann-daily-stat">
                    <Users size={14} />
                    <span>{jour.reservations_prevues} réservations</span>
                  </div>
                  <div className="pa-prevann-daily-stat">
                    <MapPin size={14} />
                    <span>{jour.terrains_occupes} terrains</span>
                  </div>
                  <div className="pa-prevann-daily-stat">
                    <AlertTriangle size={14} />
                    <span>{jour.annulations_prevues} annulations prévues</span>
                  </div>
                </div>
                
                <div className="pa-prevann-daily-revenue">
                  <div className="pa-prevann-revenue-section">
                    <div className="pa-prevann-revenue-label">Revenus prévus</div>
                    <div className="pa-prevann-revenue-value">{formatNumber(jour.revenus_prevus)} DH</div>
                  </div>
                  <div className="pa-prevann-revenue-section">
                    <div className="pa-prevann-revenue-label">Risque de perte</div>
                    <div className="pa-prevann-revenue-value pa-prevann-revenue-danger">
                      {formatNumber(jour.revenus_risque_perte)} DH
                    </div>
                  </div>
                  <div className="pa-prevann-revenue-section">
                    <div className="pa-prevann-revenue-label">Revenus nets</div>
                    <div className="pa-prevann-revenue-value pa-prevann-revenue-success">
                      {formatNumber(jour.revenus_prevus_apres_annulation)} DH
                    </div>
                  </div>
                </div>
                
                <div className="pa-prevann-daily-footer">
                  <div className="pa-prevann-confidence">
                    Confiance: {jour.confiance_prevision}%
                  </div>
                  <div className="pa-prevann-taux-annulation">
                    Taux: {formatPercent(jour.taux_annulation_historique)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Terrains Affectés */}
      {terrainsData.length > 0 && (
        <div className="pa-prevann-terrains-section">
          <h2 className="pa-prevann-section-title">
            <MapPin size={20} />
            Top 5 Terrains les Plus Affectés
          </h2>
          
          <div className="pa-prevann-terrains-grid">
            {terrainsData.map((terrain, index) => (
              <div key={index} className="pa-prevann-terrain-card">
                <div className="pa-prevann-terrain-rank">#{index + 1}</div>
                <div className="pa-prevann-terrain-info">
                  <div className="pa-prevann-terrain-name">{terrain.nomterrain}</div>
                  <div className="pa-prevann-terrain-type">{terrain.typeterrain}</div>
                </div>
                <div className="pa-prevann-terrain-stats">
                  <div className="pa-prevann-terrain-stat">
                    <AlertTriangle size={14} color="#ef4444" />
                    <span>{terrain.annulations_total} annulations</span>
                  </div>
                  <div className="pa-prevann-terrain-stat">
                    <DollarSign size={14} color="#f59e0b" />
                    <span>{formatNumber(terrain.revenus_perdus)} DH perdus</span>
                  </div>
                  <div className="pa-prevann-terrain-rate">
                    Taux: <strong>{formatPercent(terrain.taux_annulation_terrain)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pa-prevann-footer">
        <div className="pa-prevann-footer-info">
          <Info size={14} />
          <span>Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
        </div>
        <div className="pa-prevann-footer-actions">
          <button className="pa-prevann-pdf-small" onClick={generatePDFReport}>
            <FileText size={14} />
            Télécharger PDF
          </button>
          <span className="pa-prevann-footer-badge">
            {evolutionData.length} mois • {terrainsData.length} terrains
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrevisionAnnulationDashboard;