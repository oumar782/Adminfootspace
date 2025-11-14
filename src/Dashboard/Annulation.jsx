import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Calendar, 
  DollarSign, Users, MapPin, ChevronLeft, ChevronRight,
  RefreshCw, Download, Maximize2, Minimize2,
  Info, Clock, Activity, BarChart3, Target, FileText,
  X, Eye, EyeOff
} from 'lucide-react';

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
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Chargement des prévisions d'annulation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <AlertTriangle size={48} color="#ef4444" />
        <h3 style={styles.errorTitle}>Erreur de chargement</h3>
        <p style={styles.errorMessage}>{error}</p>
        <button style={styles.retryButton} onClick={loadAllData}>
          <RefreshCw size={18} />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div style={{...styles.container, ...(isFullScreen ? styles.fullScreen : {})}}>
      
      {/* Carte flottante résumé */}
      {showFloatingCard && floatingCardData && (
        <div style={styles.floatingCard}>
          <div style={styles.floatingCardHeader}>
            <h3 style={styles.floatingCardTitle}>Résumé Rapide</h3>
            <button 
              style={styles.floatingCardClose}
              onClick={() => setShowFloatingCard(false)}
            >
              <X size={16} />
            </button>
          </div>
          <div style={styles.floatingCardContent}>
            <div style={styles.floatingStat}>
              <DollarSign size={16} color="#ef4444" />
              <span>{formatNumber(floatingCardData.revenusPerdusMois)} DH perdus ce mois</span>
            </div>
            <div style={styles.floatingStat}>
              <AlertTriangle size={16} color="#f59e0b" />
              <span>{floatingCardData.annulationsMois} annulations ce mois</span>
            </div>
            <div style={styles.floatingStat}>
              <Target size={16} color="#3b82f6" />
              <span>{floatingCardData.annulationsPrevues} annulations prévues</span>
            </div>
            <div style={styles.floatingStat}>
              <Activity size={16} color="#ef4444" />
              <span>{formatNumber(floatingCardData.revenusRisque)} DH à risque</span>
            </div>
          </div>
        </div>
      )}

      {/* Bouton pour afficher/masquer la carte flottante */}
      {!showFloatingCard && (
        <button 
          style={styles.showFloatingCardBtn}
          onClick={() => setShowFloatingCard(true)}
        >
          <Eye size={16} />
        </button>
      )}

      {/* En-tête */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.titleSection}>
            <AlertTriangle size={28} color="#f59e0b" />
            <div>
              <h1 style={styles.title}>Tableau de Bord Annulations</h1>
              <p style={styles.subtitle}>Analyse & Prévisions en temps réel</p>
            </div>
          </div>
        </div>
        
        <div style={styles.headerRight}>
          <div style={styles.periodSelector}>
            {[7, 14, 30].map(days => (
              <button
                key={days}
                style={{
                  ...styles.periodBtn,
                  ...(periode === days ? styles.periodBtnActive : {})
                }}
                onClick={() => setPeriode(days)}
              >
                {days}j
              </button>
            ))}
          </div>

          <button style={styles.pdfButton} onClick={generatePDFReport}>
            <FileText size={18} />
            Générer PDF
          </button>
          
          <button style={styles.iconButton} onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          
          <button style={styles.iconButton} onClick={loadAllData}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* KPIs Principaux */}
      {dashboardData && (
        <div style={styles.kpiGrid}>
          <div style={{...styles.kpiCard, ...styles.kpiDanger}}>
            <div style={styles.kpiIcon}>
              <DollarSign size={24} />
            </div>
            <div style={styles.kpiContent}>
              <div style={styles.kpiValue}>{formatNumber(dashboardData.revenus_perdus_mois)} DH</div>
              <div style={styles.kpiLabel}>Revenus perdus ce mois</div>
              <div style={styles.kpiTrend}>
                {dashboardData.trends?.revenus_perdus?.value > 0 ? (
                  <TrendingUp size={14} color="#ef4444" />
                ) : (
                  <TrendingDown size={14} color="#10b981" />
                )}
                <span>{Math.abs(dashboardData.trends?.revenus_perdus?.value || 0)}% vs mois dernier</span>
              </div>
            </div>
          </div>

          <div style={{...styles.kpiCard, ...styles.kpiWarning}}>
            <div style={styles.kpiIcon}>
              <Activity size={24} />
            </div>
            <div style={styles.kpiContent}>
              <div style={styles.kpiValue}>{dashboardData.annulations_mois}</div>
              <div style={styles.kpiLabel}>Annulations ce mois</div>
              <div style={styles.kpiTrend}>
                <Target size={14} />
                <span>Taux: {formatPercent(dashboardData.taux_annulation)}</span>
              </div>
            </div>
          </div>

          <div style={{...styles.kpiCard, ...styles.kpiInfo}}>
            <div style={styles.kpiIcon}>
              <MapPin size={24} />
            </div>
            <div style={styles.kpiContent}>
              <div style={styles.kpiValue}>{dashboardData.terrains_affectes}</div>
              <div style={styles.kpiLabel}>Terrains affectés</div>
              <div style={styles.kpiTrend}>
                <Clock size={14} />
                <span>Aujourd'hui: {dashboardData.annules_aujourdhui}</span>
              </div>
            </div>
          </div>

          <div style={{...styles.kpiCard, ...styles.kpiSuccess}}>
            <div style={styles.kpiIcon}>
              <Users size={24} />
            </div>
            <div style={styles.kpiContent}>
              <div style={styles.kpiValue}>{dashboardData.confirmes_aujourdhui}</div>
              <div style={styles.kpiLabel}>Confirmées aujourd'hui</div>
              <div style={styles.kpiTrend}>
                <span>Total: {dashboardData.total_aujourdhui}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Évolution Mensuelle */}
      {evolutionData.length > 0 && (
        <div style={styles.chartSection}>
          <div style={styles.chartHeader}>
            <h2 style={styles.chartTitle}>
              <BarChart3 size={20} />
              Évolution des Annulations (12 mois)
            </h2>
            <div style={styles.chartControls}>
              <button style={styles.chartBtn} onClick={() => scrollChart('left')}>
                <ChevronLeft size={16} />
              </button>
              <button style={styles.chartBtn} onClick={() => scrollChart('right')}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div style={styles.chartContainer} ref={chartRef}>
            {evolutionData.map((item, index) => {
              const maxValue = Math.max(...evolutionData.map(d => d.annulations));
              const height = (item.annulations / maxValue) * 100;
              
              return (
                <div
                  key={index}
                  style={styles.barWrapper}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div style={styles.barContainer}>
                    <div
                      style={{
                        ...styles.bar,
                        height: `${Math.max(height, 5)}%`,
                        background: item.taux_annulation_mensuel > 15 
                          ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                          : item.taux_annulation_mensuel > 10
                          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                          : 'linear-gradient(135deg, #10b981, #059669)'
                      }}
                    >
                      <span style={styles.barValue}>{item.annulations}</span>
                    </div>
                  </div>
                  
                  <div style={styles.barLabel}>
                    <div style={styles.barMonth}>{item.periode_affichage}</div>
                    <div style={styles.barRate}>{formatPercent(item.taux_annulation_mensuel)}</div>
                  </div>

                  {hoveredBar === index && (
                    <div style={styles.tooltip}>
                      <div style={styles.tooltipHeader}>
                        <Calendar size={14} />
                        <strong>{item.periode_affichage}</strong>
                      </div>
                      <div style={styles.tooltipContent}>
                        <div style={styles.tooltipRow}>
                          <span>Annulations:</span>
                          <strong>{item.annulations}</strong>
                        </div>
                        <div style={styles.tooltipRow}>
                          <span>Confirmations:</span>
                          <strong>{item.confirmations}</strong>
                        </div>
                        <div style={styles.tooltipRow}>
                          <span>Taux:</span>
                          <strong style={{color: '#ef4444'}}>{formatPercent(item.taux_annulation_mensuel)}</strong>
                        </div>
                        <div style={styles.tooltipRow}>
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
        <div style={styles.previsionsSection}>
          <h2 style={styles.sectionTitle}>
            <Target size={20} />
            Prévisions d'Annulation ({periode} jours)
          </h2>
          
          <div style={styles.previsionsGrid}>
            <div style={styles.previsionCard}>
              <div style={styles.previsionIcon}>
                <AlertTriangle size={20} color="#f59e0b" />
              </div>
              <div style={styles.previsionContent}>
                <div style={styles.previsionValue}>
                  {previsions.previsions_globales?.annulations_prevues_total || 0}
                </div>
                <div style={styles.previsionLabel}>Annulations prévues</div>
                <div style={styles.previsionDetail}>
                  Basé sur {previsions.previsions_globales?.reservations_prevues_total || 0} réservations
                </div>
              </div>
            </div>

            <div style={styles.previsionCard}>
              <div style={styles.previsionIcon}>
                <DollarSign size={20} color="#ef4444" />
              </div>
              <div style={styles.previsionContent}>
                <div style={styles.previsionValue}>
                  {formatNumber(previsions.previsions_globales?.revenus_risque_total || 0)} DH
                </div>
                <div style={styles.previsionLabel}>Revenus à risque</div>
                <div style={styles.previsionDetail}>
                  Taux: {formatPercent(previsions.previsions_globales?.taux_annulation_moyen_prevu || 0)}
                </div>
              </div>
            </div>

            <div style={styles.previsionCard}>
              <div style={styles.previsionIcon}>
                <Activity size={20} color="#3b82f6" />
              </div>
              <div style={styles.previsionContent}>
                <div style={{
                  ...styles.previsionValue,
                  color: getNiveauRisqueColor(previsions.previsions_globales?.niveau_risque_global)
                }}>
                  {previsions.previsions_globales?.niveau_risque_global || 'Faible'}
                </div>
                <div style={styles.previsionLabel}>Niveau de risque global</div>
                <div style={styles.previsionDetail}>
                  {previsions.previsions_globales?.periode_analyse || 0} jours analysés
                </div>
              </div>
            </div>
          </div>

          {/* Jours à haut risque */}
          {previsions.jours_haut_risque && previsions.jours_haut_risque.length > 0 && (
            <div style={styles.riskSection}>
              <h3 style={styles.riskTitle}>
                <AlertTriangle size={16} color="#ef4444" />
                Jours à Haut Risque
              </h3>
              <div style={styles.riskGrid}>
                {previsions.jours_haut_risque.map((jour, index) => (
                  <div key={index} style={styles.riskCard}>
                    <div style={styles.riskDate}>
                      <div style={styles.riskDay}>{jour.jour_semaine}</div>
                      <div style={styles.riskDateNum}>{new Date(jour.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
                    </div>
                    <div style={styles.riskStats}>
                      <div style={styles.riskStat}>
                        <span>{jour.annulations_prevues} annulations prévues</span>
                      </div>
                      <div style={styles.riskStat}>
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
        <div style={styles.dailySection}>
          <h2 style={styles.sectionTitle}>
            <Calendar size={20} />
            Prévisions Journalières Détaillées
          </h2>
          
          <div style={styles.dailyGrid}>
            {previsionsJournalieres.previsions_journalieres?.slice(0, 14).map((jour, index) => (
              <div key={index} style={{
                ...styles.dailyCard,
                borderLeft: `4px solid ${getNiveauRisqueColor(jour.niveau_risque)}`
              }}>
                <div style={styles.dailyHeader}>
                  <div style={styles.dailyDate}>
                    <div style={styles.dailyDay}>{jour.jour_semaine}</div>
                    <div style={styles.dailyDateNum}>{jour.date_affichage}</div>
                  </div>
                  <div style={{
                    ...styles.riskBadge,
                    background: getNiveauRisqueColor(jour.niveau_risque) + '20',
                    color: getNiveauRisqueColor(jour.niveau_risque)
                  }}>
                    {jour.niveau_risque}
                  </div>
                </div>
                
                <div style={styles.dailyStats}>
                  <div style={styles.dailyStat}>
                    <Users size={14} />
                    <span>{jour.reservations_prevues} réservations</span>
                  </div>
                  <div style={styles.dailyStat}>
                    <MapPin size={14} />
                    <span>{jour.terrains_occupes} terrains</span>
                  </div>
                  <div style={styles.dailyStat}>
                    <AlertTriangle size={14} />
                    <span>{jour.annulations_prevues} annulations prévues</span>
                  </div>
                </div>
                
                <div style={styles.dailyRevenue}>
                  <div style={styles.revenueSection}>
                    <div style={styles.revenueLabel}>Revenus prévus</div>
                    <div style={styles.revenueValue}>{formatNumber(jour.revenus_prevus)} DH</div>
                  </div>
                  <div style={styles.revenueSection}>
                    <div style={styles.revenueLabel}>Risque de perte</div>
                    <div style={{...styles.revenueValue, color: '#ef4444'}}>
                      {formatNumber(jour.revenus_risque_perte)} DH
                    </div>
                  </div>
                  <div style={styles.revenueSection}>
                    <div style={styles.revenueLabel}>Revenus nets</div>
                    <div style={{...styles.revenueValue, color: '#10b981'}}>
                      {formatNumber(jour.revenus_prevus_apres_annulation)} DH
                    </div>
                  </div>
                </div>
                
                <div style={styles.dailyFooter}>
                  <div style={styles.confidence}>
                    Confiance: {jour.confiance_prevision}%
                  </div>
                  <div style={styles.tauxAnnulation}>
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
        <div style={styles.terrainsSection}>
          <h2 style={styles.sectionTitle}>
            <MapPin size={20} />
            Top 5 Terrains les Plus Affectés
          </h2>
          
          <div style={styles.terrainsGrid}>
            {terrainsData.map((terrain, index) => (
              <div key={index} style={styles.terrainCard}>
                <div style={styles.terrainRank}>#{index + 1}</div>
                <div style={styles.terrainInfo}>
                  <div style={styles.terrainName}>{terrain.nomterrain}</div>
                  <div style={styles.terrainType}>{terrain.typeterrain}</div>
                </div>
                <div style={styles.terrainStats}>
                  <div style={styles.terrainStat}>
                    <AlertTriangle size={14} color="#ef4444" />
                    <span>{terrain.annulations_total} annulations</span>
                  </div>
                  <div style={styles.terrainStat}>
                    <DollarSign size={14} color="#f59e0b" />
                    <span>{formatNumber(terrain.revenus_perdus)} DH perdus</span>
                  </div>
                  <div style={styles.terrainRate}>
                    Taux: <strong>{formatPercent(terrain.taux_annulation_terrain)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerInfo}>
          <Info size={14} />
          <span>Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
        </div>
        <div style={styles.footerActions}>
          <button style={styles.pdfButtonSmall} onClick={generatePDFReport}>
            <FileText size={14} />
            Télécharger PDF
          </button>
          <span style={styles.footerBadge}>
            {evolutionData.length} mois • {terrainsData.length} terrains
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    minHeight: '100vh',
    padding: '24px',
    color: '#1e293b',
  },
  fullScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    padding: '20px',
    overflow: 'auto',
  },
  // Carte flottante
  floatingCard: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: '280px',
    border: '1px solid #e2e8f0',
  },
  floatingCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  floatingCardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  floatingCardClose: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
  },
  floatingCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  floatingStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  showFloatingCardBtn: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px',
    cursor: 'pointer',
    zIndex: 999,
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
  },
  // Styles existants...
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #f59e0b',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '16px',
    color: '#64748b',
    fontWeight: '500',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
    padding: '32px',
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  errorMessage: {
    fontSize: '16px',
    color: '#64748b',
    textAlign: 'center',
    maxWidth: '500px',
  },
  retryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    background: 'white',
    padding: '24px 32px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  headerLeft: {
    flex: 1,
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    margin: 0,
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '4px 0 0 0',
    fontWeight: '500',
  },
  headerRight: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  periodSelector: {
    display: 'flex',
    gap: '6px',
    background: '#f1f5f9',
    padding: '6px',
    borderRadius: '12px',
  },
  periodBtn: {
    padding: '10px 20px',
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  periodBtnActive: {
    background: 'white',
    color: '#f59e0b',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  pdfButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
  pdfButtonSmall: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  iconButton: {
    width: '44px',
    height: '44px',
    border: 'none',
    background: 'white',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  kpiCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  kpiDanger: {
    borderLeft: '4px solid #ef4444',
  },
  kpiWarning: {
    borderLeft: '4px solid #f59e0b',
  },
  kpiInfo: {
    borderLeft: '4px solid #3b82f6',
  },
  kpiSuccess: {
    borderLeft: '4px solid #10b981',
  },
  kpiIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white',
    flexShrink: 0,
  },
  kpiContent: {
    flex: 1,
  },
  kpiValue: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '4px',
    color: '#1e293b',
  },
  kpiLabel: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '8px',
    fontWeight: '500',
  },
  kpiTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '600',
  },
  chartSection: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  chartTitle: {
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#1e293b',
  },
  chartControls: {
    display: 'flex',
    gap: '8px',
  },
  chartBtn: {
    width: '36px',
    height: '36px',
    border: '1px solid #e2e8f0',
    background: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
    transition: 'all 0.2s',
  },
  chartContainer: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    padding: '20px 0',
    scrollBehavior: 'smooth',
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '80px',
    position: 'relative',
  },
  barContainer: {
    width: '60px',
    height: '180px',
    background: '#f1f5f9',
    borderRadius: '12px 12px 0 0',
    display: 'flex',
    alignItems: 'flex-end',
    position: 'relative',
  },
  bar: {
    width: '100%',
    borderRadius: '12px 12px 0 0',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  barValue: {
    color: 'white',
    fontWeight: '700',
    fontSize: '14px',
  },
  barLabel: {
    marginTop: '12px',
    textAlign: 'center',
  },
  barMonth: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
  },
  barRate: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '500',
  },
  tooltip: {
    position: 'absolute',
    top: '-120px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: '200px',
    border: '1px solid #e2e8f0',
  },
  tooltipHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    color: '#1e293b',
    fontWeight: '600',
  },
  tooltipContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  tooltipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#64748b',
  },
  previsionsSection: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 24px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#1e293b',
  },
  previsionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  previsionCard: {
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid #fed7aa',
  },
  previsionIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  previsionContent: {
    flex: 1,
  },
  previsionValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '4px',
  },
  previsionLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '4px',
    fontWeight: '500',
  },
  previsionDetail: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  riskSection: {
    background: '#fef2f2',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #fecaca',
  },
  riskTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  riskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  riskCard: {
    background: 'white',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #fecaca',
  },
  riskDate: {
    marginBottom: '12px',
  },
  riskDay: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
  },
  riskDateNum: {
    fontSize: '12px',
    color: '#64748b',
  },
  riskStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  riskStat: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
  },
  dailySection: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  dailyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  dailyCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  dailyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  dailyDate: {
    flex: 1,
  },
  dailyDay: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px',
  },
  dailyDateNum: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
  },
  riskBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  dailyStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  dailyStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  dailyRevenue: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '12px',
    marginBottom: '16px',
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '8px',
  },
  revenueSection: {
    textAlign: 'center',
  },
  revenueLabel: {
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '4px',
    fontWeight: '500',
  },
  revenueValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
  },
  dailyFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
  },
  confidence: {
    background: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  tauxAnnulation: {
    fontWeight: '600',
  },
  terrainsSection: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  terrainsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  terrainCard: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  terrainRank: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '800',
    flexShrink: 0,
  },
  terrainInfo: {
    flex: 1,
  },
  terrainName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px',
  },
  terrainType: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  terrainStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-end',
  },
  terrainStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  terrainRate: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
    marginTop: '4px',
    padding: '4px 12px',
    background: '#fef3c7',
    borderRadius: '8px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 32px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginTop: '32px',
  },
  footerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  footerActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  footerBadge: {
    padding: '8px 16px',
    background: '#f1f5f9',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
  },
};

// Animation CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .prevision-kpi-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important;
  }
  
  .prevision-chart-btn:hover {
    background: #f1f5f9 !important;
    border-color: #cbd5e1 !important;
  }
  
  .prevision-icon-button:hover {
    background: #f1f5f9 !important;
    color: #f59e0b !important;
    transform: scale(1.05);
  }
  
  .prevision-terrain-card:hover {
    border-color: #f59e0b !important;
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15) !important;
    transform: translateX(4px);
  }
  
  .prevision-daily-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
  }
  
  .prevision-period-btn:hover:not(.prevision-period-btn-active) {
    background: rgba(245, 158, 11, 0.1) !important;
    color: #f59e0b !important;
  }
`;
document.head.appendChild(styleSheet);

export default PrevisionAnnulationDashboard;