import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Calendar, 
  DollarSign, Users, MapPin, ChevronLeft, ChevronRight,
  RefreshCw, Download, Maximize2, Minimize2,
  Info, Clock, Activity, BarChart3, Target, FileText,
  X, Eye, EyeOff, User, UserCheck, UserX, UserMinus,
  Brain, PieChart, TrendingUp as TrendUp, AlertCircle,
  Shield, ShieldAlert, ShieldCheck, CalendarDays,
  Clock3, Clock4, Sunrise, Sunset, Moon, Zap,
  Filter, Search, Download as DownloadIcon, Printer,
  Sparkles, Award, Star, Flame, Lightbulb, Mail, Phone,
  Hash, CheckCircle, XCircle, HelpCircle, Globe,
  CreditCard, Wallet, Landmark, BarChart, LineChart,
  Radar, Layers, Grid, List, ThumbsUp, ThumbsDown,
  Flag, Bell, BellRing, Volume2, VolumeX,
  ArrowUp, ArrowDown, ArrowRight, ArrowLeft,
  Circle, Square, Triangle, Hexagon,
  Sun, Moon as MoonIcon, Star as StarIcon,
  Wind, Droplets, Thermometer, Gauge
} from 'lucide-react';

const API_BASE = 'https://backend-foot-omega.vercel.app/api/prevannule';

const PrevisionAnnulationDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // États pour TOUTES les données API
  const [dashboardData, setDashboardData] = useState(null);
  const [evolutionData, setEvolutionData] = useState([]);
  const [previsions, setPrevisions] = useState(null);
  const [terrainsData, setTerrainsData] = useState([]);
  const [classificationClients, setClassificationClients] = useState([]);
  const [analyseComportementale, setAnalyseComportementale] = useState([]);
  const [impactFinancier, setImpactFinancier] = useState([]);
  const [alertesComportement, setAlertesComportement] = useState([]);
  const [predictionRisques, setPredictionRisques] = useState([]);
  const [correlationProfils, setCorrelationProfils] = useState([]);
  const [analyseTemporelle, setAnalyseTemporelle] = useState(null);
  const [statsPeriodes, setStatsPeriodes] = useState(null);
  const [datesAnnulationTerrain, setDatesAnnulationTerrain] = useState({});
  const [syntheseAnnulations, setSyntheseAnnulations] = useState(null);
  const [statsGlobales, setStatsGlobales] = useState(null);
  const [repartitionStatuts, setRepartitionStatuts] = useState([]);
  const [topClientsNuisibles, setTopClientsNuisibles] = useState([]);
  const [topTerrainsAffectes, setTopTerrainsAffectes] = useState([]);
  const [annulationsParMois, setAnnulationsParMois] = useState([]);
  const [annulationsParJour, setAnnulationsParJour] = useState([]);
  const [annulationsFutures, setAnnulationsFutures] = useState([]);
  const [annulationsRecentes, setAnnulationsRecentes] = useState([]);
  const [pertesFinancieres, setPertesFinancieres] = useState(null);
  const [clientsRisque, setClientsRisque] = useState([]);
  const [statsAvancees, setStatsAvancees] = useState(null);
  
  const [periode, setPeriode] = useState(30);
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredPie, setHoveredPie] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFloatingCard, setShowFloatingCard] = useState(true);
  const [floatingCardData, setFloatingCardData] = useState(null);
  const [filterNiveau, setFilterNiveau] = useState('all');
  const [searchClient, setSearchClient] = useState('');
  const [expandedClient, setExpandedClient] = useState(null);
  const [selectedStatut, setSelectedStatut] = useState('all');
  const [selectedMois, setSelectedMois] = useState(null);
  const [selectedJour, setSelectedJour] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('annulations');
  const [showAllData, setShowAllData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState({});
  
  const chartRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    loadAllData();
  }, [periode]);

  const fetchApi = async (url) => {
    try {
      console.log(`📡 Chargement: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.warn(`⚠️ ${url} retourne ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn(`❌ Erreur ${url}:`, err.message);
      return null;
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Charger TOUTES les routes API
      const results = await Promise.allSettled([
        fetchApi(`${API_BASE}/dashboard-annulations`).then(r => ({ key: 'dashboard', data: r })),
        fetchApi(`${API_BASE}/evolution-annulations?mois_centre=true`).then(r => ({ key: 'evolution', data: r })),
        fetchApi(`${API_BASE}/previsions-annulations?periode=${periode}`).then(r => ({ key: 'previsions', data: r })),
        fetchApi(`${API_BASE}/terrains-annulations`).then(r => ({ key: 'terrains', data: r })),
        fetchApi(`${API_BASE}/classification-clients?periode=6%20months`).then(r => ({ key: 'classification', data: r })),
        fetchApi(`${API_BASE}/analyse-comportementale`).then(r => ({ key: 'comportementale', data: r })),
        fetchApi(`${API_BASE}/impact-financier-clients`).then(r => ({ key: 'impact', data: r })),
        fetchApi(`${API_BASE}/alertes-comportement`).then(r => ({ key: 'alertes', data: r })),
        fetchApi(`${API_BASE}/prediction-risques-clients`).then(r => ({ key: 'predictions', data: r })),
        fetchApi(`${API_BASE}/correlation-profil-clients`).then(r => ({ key: 'correlations', data: r })),
        fetchApi(`${API_BASE}/analyse-temporelle-annulations?periode=${periode}`).then(r => ({ key: 'temporelle', data: r })),
        fetchApi(`${API_BASE}/stats-periodes-annulations`).then(r => ({ key: 'periodes', data: r })),
        fetchApi(`${API_BASE}/synthese-annulations`).then(r => ({ key: 'synthese', data: r })),
        fetchApi(`${API_BASE}/stats-globales`).then(r => ({ key: 'statsGlobales', data: r })),
        fetchApi(`${API_BASE}/repartition-statuts`).then(r => ({ key: 'repartition', data: r })),
        fetchApi(`${API_BASE}/top-clients-nuisibles`).then(r => ({ key: 'topClients', data: r })),
        fetchApi(`${API_BASE}/top-terrains-affectes`).then(r => ({ key: 'topTerrains', data: r })),
        fetchApi(`${API_BASE}/annulations-par-mois`).then(r => ({ key: 'annulationsMois', data: r })),
        fetchApi(`${API_BASE}/annulations-par-jour`).then(r => ({ key: 'annulationsJour', data: r })),
        fetchApi(`${API_BASE}/annulations-futures`).then(r => ({ key: 'annulationsFutures', data: r })),
        fetchApi(`${API_BASE}/annulations-recentes`).then(r => ({ key: 'annulationsRecentes', data: r })),
        fetchApi(`${API_BASE}/pertes-financieres`).then(r => ({ key: 'pertes', data: r })),
        fetchApi(`${API_BASE}/clients-risque`).then(r => ({ key: 'clientsRisque', data: r })),
        fetchApi(`${API_BASE}/statistiques-avancees`).then(r => ({ key: 'statsAvancees', data: r }))
      ]);

      // Traiter chaque résultat
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value?.data?.success) {
          const { key, data } = result.value;
          
          switch(key) {
            case 'dashboard':
              setDashboardData(data.data);
              setFloatingCardData({
                revenusPerdusMois: data.data.revenus_perdus_mois || 0,
                annulationsMois: data.data.annulations_mois || 0,
                terrainsAffectes: data.data.terrains_affectes || 0,
                tauxAnnulation: data.data.taux_annulation || 0,
                annulationsAujourdhui: data.data.annules_aujourdhui || 0
              });
              break;
            case 'evolution':
              setEvolutionData(data.data || []);
              break;
            case 'previsions':
              setPrevisions(data.data);
              break;
            case 'terrains':
              setTerrainsData(data.data || []);
              break;
            case 'classification':
              setClassificationClients(data.data?.classification_clients || []);
              break;
            case 'comportementale':
              setAnalyseComportementale(data.data || []);
              break;
            case 'impact':
              setImpactFinancier(data.data || []);
              break;
            case 'alertes':
              setAlertesComportement(data.alertes || []);
              break;
            case 'predictions':
              setPredictionRisques(data.predictions || []);
              break;
            case 'correlations':
              setCorrelationProfils(data.correlations || []);
              break;
            case 'temporelle':
              setAnalyseTemporelle(data.data);
              break;
            case 'periodes':
              setStatsPeriodes(data.data);
              break;
            case 'synthese':
              setSyntheseAnnulations(data.data);
              break;
            case 'statsGlobales':
              setStatsGlobales(data.data);
              break;
            case 'repartition':
              setRepartitionStatuts(data.data?.repartition || data.data || []);
              break;
            case 'topClients':
              setTopClientsNuisibles(data.data || []);
              break;
            case 'topTerrains':
              setTopTerrainsAffectes(data.data || []);
              break;
            case 'annulationsMois':
              setAnnulationsParMois(data.data || []);
              break;
            case 'annulationsJour':
              setAnnulationsParJour(data.data || []);
              break;
            case 'annulationsFutures':
              setAnnulationsFutures(data.data?.reservations_futures || data.data || []);
              break;
            case 'annulationsRecentes':
              setAnnulationsRecentes(data.data || []);
              break;
            case 'pertes':
              setPertesFinancieres(data.data);
              break;
            case 'clientsRisque':
              setClientsRisque(data.data || []);
              break;
            case 'statsAvancees':
              setStatsAvancees(data.data);
              break;
          }
          
          setDataLoaded(prev => ({ ...prev, [key]: true }));
        }
      });

      // Charger les dates pour les terrains
      if (terrainsData.length > 0) {
        const topTerrains = terrainsData.slice(0, 5);
        for (const terrain of topTerrains) {
          const datesData = await fetchApi(`${API_BASE}/dates-annulation-terrain/${terrain.numeroterrain}`);
          if (datesData?.success) {
            setDatesAnnulationTerrain(prev => ({
              ...prev,
              [terrain.numeroterrain]: datesData.data || []
            }));
          }
        }
      }
      
    } catch (err) {
      console.error('❌ Erreur chargement:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('fr-FR').format(Math.round(num));
  };

  const formatPercent = (num) => {
    if (num === undefined || num === null) return '0%';
    return `${Math.round(num)}%`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getNiveauRisqueColor = (niveau) => {
    switch (niveau?.toLowerCase()) {
      case 'élevé': return '#ef4444';
      case 'modéré': return '#f59e0b';
      case 'faible': return '#10b981';
      default: return '#64748b';
    }
  };

  const getNiveauCouleur = (niveau) => {
    switch (niveau?.toLowerCase()) {
      case 'critique': return '#dc2626';
      case 'modérée': return '#d97706';
      case 'faible': return '#059669';
      case 'fiable': return '#0284c7';
      default: return '#64748b';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'annulée': return '#ef4444';
      case 'confirmée': return '#10b981';
      case 'en_attente': return '#f59e0b';
      default: return '#64748b';
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Chargement de toutes les données...</p>
        <p style={styles.loadingSubtext}>
          Récupération des analyses • {periode} jours
        </p>
        <div style={styles.loadingStats}>
          <div>📊 Dashboard • 📈 Évolution • 🎯 Prévisions</div>
          <div>👥 Clients • ⚽ Terrains • 💰 Finances</div>
          <div>🚨 Alertes • 📅 Analyses • 📊 Statistiques</div>
        </div>
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
    <div style={{...styles.container, ...(isFullScreen ? styles.fullScreen : {})}} ref={topRef}>
      
      {/* Carte flottante */}
      {showFloatingCard && floatingCardData && (
        <div style={styles.floatingCard}>
          <div style={styles.floatingCardHeader}>
            <h3 style={styles.floatingCardTitle}>
              <Sparkles size={16} color="#f59e0b" />
              Résumé Exécutif
            </h3>
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
              <span><strong>{formatNumber(floatingCardData.revenusPerdusMois)} DH</strong> perdus ce mois</span>
            </div>
            <div style={styles.floatingStat}>
              <AlertTriangle size={16} color="#f59e0b" />
              <span><strong>{floatingCardData.annulationsMois}</strong> annulations ce mois</span>
            </div>
            <div style={styles.floatingStat}>
              <MapPin size={16} color="#3b82f6" />
              <span><strong>{floatingCardData.terrainsAffectes}</strong> terrains affectés</span>
            </div>
            <div style={styles.floatingStat}>
              <Activity size={16} color="#ef4444" />
              <span>Taux: <strong>{formatPercent(floatingCardData.tauxAnnulation)}</strong></span>
            </div>
            <div style={styles.floatingStat}>
              <Clock size={16} color="#8b5cf6" />
              <span>Aujourd'hui: <strong>{floatingCardData.annulationsAujourdhui}</strong></span>
            </div>
          </div>
        </div>
      )}

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
            <div style={styles.titleIcon}>
              <Brain size={32} color="white" />
            </div>
            <div>
              <h1 style={styles.title}>Analyse Complète des Annulations</h1>
              <p style={styles.subtitle}>
                {statsGlobales ? `${statsGlobales.total_reservations} réservations • ${statsGlobales.taux_annulation_global}% d'annulations` : 'Toutes les données API en temps réel'}
              </p>
            </div>
          </div>
        </div>
        
        <div style={styles.headerRight}>
          <div style={styles.periodSelector}>
            {[7, 14, 30, 60, 90].map(days => (
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

          <button style={styles.pdfButton} onClick={() => window.print()}>
            <Download size={18} />
            Exporter
          </button>
          
          <button style={styles.iconButton} onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          
          <button style={styles.iconButton} onClick={loadAllData}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.tabsContainer}>
        <button 
          style={{...styles.tab, ...(activeTab === 'dashboard' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('dashboard')}
        >
          <Activity size={16} />
          Dashboard
          {statsGlobales && <span style={styles.tabBadge}>{statsGlobales.total_reservations}</span>}
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'clients' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('clients')}
        >
          <Users size={16} />
          Clients 
          <span style={styles.tabBadge}>{classificationClients.length}</span>
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'previsions' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('previsions')}
        >
          <Target size={16} />
          Prévisions
          {previsions && <span style={styles.tabBadge}>{previsions.previsions_globales?.annulations_prevues_total || 0}</span>}
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'alertes' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('alertes')}
        >
          <ShieldAlert size={16} />
          Alertes 
          {alertesComportement.length > 0 && <span style={styles.tabBadgeAlert}>{alertesComportement.length}</span>}
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'analyse' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('analyse')}
        >
          <BarChart3 size={16} />
          Analyse avancée
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'statistiques' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('statistiques')}
        >
          <PieChart size={16} />
          Statistiques
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'pourtoi' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('pourtoi')}
        >
          <Star size={16} />
          Pour Toi
        </button>
      </div>

      {/* Barre d'outils contextuelle */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          {activeTab === 'clients' && (
            <>
              <div style={styles.searchBox}>
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
              <div style={styles.filterButtons}>
                <button
                  style={{...styles.filterBtn, ...(filterNiveau === 'all' ? styles.filterBtnActive : {})}}
                  onClick={() => setFilterNiveau('all')}
                >
                  Tous
                </button>
                <button
                  style={{...styles.filterBtn, ...styles.filterCritique, ...(filterNiveau === 'Critique' ? styles.filterBtnActive : {})}}
                  onClick={() => setFilterNiveau('Critique')}
                >
                  Critique
                </button>
                <button
                  style={{...styles.filterBtn, ...styles.filterModeree, ...(filterNiveau === 'Modérée' ? styles.filterBtnActive : {})}}
                  onClick={() => setFilterNiveau('Modérée')}
                >
                  Modérée
                </button>
                <button
                  style={{...styles.filterBtn, ...styles.filterFaible, ...(filterNiveau === 'Faible' ? styles.filterBtnActive : {})}}
                  onClick={() => setFilterNiveau('Faible')}
                >
                  Faible
                </button>
                <button
                  style={{...styles.filterBtn, ...styles.filterFiable, ...(filterNiveau === 'Fiable' ? styles.filterBtnActive : {})}}
                  onClick={() => setFilterNiveau('Fiable')}
                >
                  Fiable
                </button>
              </div>
            </>
          )}
          {activeTab === 'dashboard' && (
            <>
              <button 
                style={{...styles.viewModeBtn, ...(viewMode === 'grid' ? styles.viewModeActive : {})}}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} /> Grille
              </button>
              <button 
                style={{...styles.viewModeBtn, ...(viewMode === 'list' ? styles.viewModeActive : {})}}
                onClick={() => setViewMode('list')}
              >
                <List size={16} /> Liste
              </button>
              <select style={styles.selectBox} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="annulations">Trier par annulations</option>
                <option value="taux">Trier par taux</option>
                <option value="pertes">Trier par pertes</option>
              </select>
            </>
          )}
        </div>
        <div style={styles.toolbarRight}>
          <button style={styles.toolbarBtn} onClick={() => setShowAllData(!showAllData)}>
            {showAllData ? <EyeOff size={16} /> : <Eye size={16} />}
            {showAllData ? 'Masquer' : 'Tout afficher'}
          </button>
          <button style={styles.toolbarBtn} onClick={() => topRef.current?.scrollIntoView({ behavior: 'smooth' })}>
            <ArrowUp size={16} />
            Haut
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={styles.content}>
        {/* ========== ONGLET DASHBOARD ========== */}
        {activeTab === 'dashboard' && (
          <>
            {/* KPIs dashboard-annulations */}
            {dashboardData && (
              <>
                <div style={styles.kpiGrid}>
                  <div style={{...styles.kpiCard, ...styles.kpiDanger}}>
                    <div style={styles.kpiIcon}>
                      <DollarSign size={24} />
                    </div>
                    <div style={styles.kpiContent}>
                      <div style={styles.kpiValue}>{formatNumber(dashboardData.revenus_perdus_mois)} DH</div>
                      <div style={styles.kpiLabel}>Revenus perdus ce mois</div>
                      {dashboardData.trends?.revenus_perdus && (
                        <div style={styles.kpiTrend}>
                          {dashboardData.trends.revenus_perdus.value > 0 ? 
                            <TrendingUp size={14} color="#ef4444" /> : 
                            <TrendingDown size={14} color="#10b981" />}
                          <span>{Math.abs(dashboardData.trends.revenus_perdus.value)}% vs mois dernier</span>
                        </div>
                      )}
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

                <div style={styles.statsSupplementaires}>
                  <div style={styles.statCard}>
                    <div style={styles.statLabel}>Revenus perdus année</div>
                    <div style={styles.statValue}>{formatNumber(dashboardData.revenus_perdus_annee)} DH</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statLabel}>Taux annulation aujourd'hui</div>
                    <div style={styles.statValue}>{formatPercent(dashboardData.taux_annulation_aujourdhui)}</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statLabel}>Annulations futures</div>
                    <div style={styles.statValue}>{dashboardData.annulations_futures || 0}</div>
                  </div>
                </div>
              </>
            )}

            {/* Stats globales */}
            {statsGlobales && (
              <div style={styles.globalStatsSection}>
                <h2 style={styles.sectionTitle}>
                  <Globe size={20} />
                  Statistiques globales
                </h2>
                <div style={styles.globalStatsGrid}>
                  <div style={styles.globalStat}>
                    <span>Total réservations:</span>
                    <strong>{statsGlobales.total_reservations}</strong>
                  </div>
                  <div style={styles.globalStat}>
                    <span>Total annulations:</span>
                    <strong style={{color: '#ef4444'}}>{statsGlobales.total_annulations}</strong>
                  </div>
                  <div style={styles.globalStat}>
                    <span>Total confirmations:</span>
                    <strong style={{color: '#10b981'}}>{statsGlobales.total_confirmations}</strong>
                  </div>
                  <div style={styles.globalStat}>
                    <span>Taux annulation:</span>
                    <strong>{statsGlobales.taux_annulation_global}%</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Répartition par statut */}
            {repartitionStatuts.length > 0 && (
              <div style={styles.repartitionSection}>
                <h2 style={styles.sectionTitle}>
                  <PieChart size={20} />
                  Répartition par statut
                </h2>
                <div style={styles.repartitionGrid}>
                  {repartitionStatuts.map((statut, index) => (
                    <div key={index} style={{
                      ...styles.repartitionCard,
                      borderLeft: `4px solid ${getStatutColor(statut.statut)}`
                    }}>
                      <div style={styles.repartitionHeader}>
                        <div style={styles.repartitionStatut}>{statut.statut}</div>
                        <div style={styles.repartitionBadge}>{statut.pourcentage}%</div>
                      </div>
                      <div style={styles.repartitionNombre}>{statut.nombre}</div>
                      <div style={styles.repartitionBar}>
                        <div style={{
                          ...styles.repartitionFill,
                          width: `${statut.pourcentage}%`,
                          background: getStatutColor(statut.statut)
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats périodes */}
            {statsPeriodes && (
              <div style={styles.periodStatsSection}>
                <h2 style={styles.sectionTitle}>
                  <CalendarDays size={20} />
                  Statistiques par période
                </h2>
                <div style={styles.periodStatsGrid}>
                  <div style={styles.periodStatCard}>
                    <div style={styles.periodStatHeader}>
                      <span style={styles.periodStatTitle}>Futur</span>
                    </div>
                    <div style={styles.periodStatValue}>{statsPeriodes.annulations_futures || 0}</div>
                    <div style={styles.periodStatLabel}>annulations à venir</div>
                    <div style={styles.periodStatSub}>
                      {formatNumber(statsPeriodes.revenus_perdus_futurs || 0)} DH
                    </div>
                  </div>
                  <div style={styles.periodStatCard}>
                    <div style={styles.periodStatHeader}>
                      <span style={styles.periodStatTitle}>Aujourd'hui</span>
                    </div>
                    <div style={styles.periodStatValue}>{statsPeriodes.annulations_aujourdhui || 0}</div>
                    <div style={styles.periodStatLabel}>annulations aujourd'hui</div>
                    <div style={styles.periodStatSub}>
                      {formatNumber(statsPeriodes.revenus_perdus_aujourdhui || 0)} DH
                    </div>
                  </div>
                  <div style={styles.periodStatCard}>
                    <div style={styles.periodStatHeader}>
                      <span style={styles.periodStatTitle}>7 derniers jours</span>
                    </div>
                    <div style={styles.periodStatValue}>{statsPeriodes.annulations_7_jours || 0}</div>
                    <div style={styles.periodStatLabel}>annulations récentes</div>
                    <div style={styles.periodStatSub}>
                      {formatNumber(statsPeriodes.revenus_perdus_7_jours || 0)} DH
                    </div>
                  </div>
                  <div style={styles.periodStatCard}>
                    <div style={styles.periodStatHeader}>
                      <span style={styles.periodStatTitle}>7 prochains jours</span>
                    </div>
                    <div style={styles.periodStatValue}>{statsPeriodes.annulations_7_prochains_jours || 0}</div>
                    <div style={styles.periodStatLabel}>annulations prévues</div>
                    <div style={styles.periodStatSub}>
                      {formatNumber(statsPeriodes.revenus_risque_7_jours || 0)} DH à risque
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Évolution mensuelle */}
            {evolutionData.length > 0 && (
              <div style={styles.chartSection}>
                <div style={styles.chartHeader}>
                  <h2 style={styles.chartTitle}>
                    <BarChart3 size={20} />
                    Évolution des annulations
                  </h2>
                  <div style={styles.chartControls}>
                    <button style={styles.chartBtn} onClick={() => chartRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}>
                      <ChevronLeft size={16} />
                    </button>
                    <button style={styles.chartBtn} onClick={() => chartRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                
                <div style={styles.chartContainer} ref={chartRef}>
                  {evolutionData.map((item, index) => {
                    const maxValue = Math.max(...evolutionData.map(d => d.annulations || 0));
                    const height = maxValue > 0 ? (item.annulations / maxValue) * 100 : 0;
                    
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
                              background: item.taux_annulation_mensuel > 20 
                                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                : item.taux_annulation_mensuel > 15
                                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                : item.taux_annulation_mensuel > 10
                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                : 'linear-gradient(135deg, #3b82f6, #2563eb)'
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
                                <span>Total:</span>
                                <strong>{item.total_reservations}</strong>
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

            {/* Top terrains */}
            {(viewMode === 'grid' ? terrainsData : topTerrainsAffectes).length > 0 && (
              <div style={styles.terrainsSection}>
                <h2 style={styles.sectionTitle}>
                  <MapPin size={20} />
                  Terrains les plus affectés
                </h2>
                
                <div style={viewMode === 'grid' ? styles.terrainsGrid : styles.terrainsList}>
                  {(viewMode === 'grid' ? terrainsData : topTerrainsAffectes)
                    .sort((a, b) => {
                      if (sortBy === 'annulations') return (b.annulations_total || b.annulations) - (a.annulations_total || a.annulations);
                      if (sortBy === 'taux') return (b.taux_annulation_terrain || b.taux_annulation) - (a.taux_annulation_terrain || a.taux_annulation);
                      if (sortBy === 'pertes') return (b.revenus_perdus || 0) - (a.revenus_perdus || 0);
                      return 0;
                    })
                    .map((terrain, index) => (
                      <div 
                        key={index} 
                        style={styles.terrainCard}
                        onClick={() => setSelectedTerrain(selectedTerrain === terrain.numeroterrain ? null : terrain.numeroterrain)}
                      >
                        <div style={styles.terrainRank}>#{index + 1}</div>
                        <div style={styles.terrainInfo}>
                          <div style={styles.terrainName}>{terrain.nomterrain}</div>
                          <div style={styles.terrainType}>{terrain.typeterrain}</div>
                        </div>
                        <div style={styles.terrainStats}>
                          <div style={styles.terrainStat}>
                            <AlertTriangle size={14} color="#ef4444" />
                            <span>{terrain.annulations_total || terrain.annulations} annulations</span>
                          </div>
                          <div style={styles.terrainStat}>
                            <DollarSign size={14} color="#f59e0b" />
                            <span>{formatNumber(terrain.revenus_perdus)} DH perdus</span>
                          </div>
                          <div style={styles.terrainRate}>
                            Taux: <strong>{formatPercent(terrain.taux_annulation_terrain || terrain.taux_annulation)}</strong>
                          </div>
                        </div>
                        <div style={styles.terrainMeta}>
                          <small>Confirmations: {terrain.confirmations_total || terrain.confirmations}</small>
                        </div>
                        
                        {selectedTerrain === terrain.numeroterrain && datesAnnulationTerrain[terrain.numeroterrain] && (
                          <div style={styles.terrainDetails}>
                            <h4 style={styles.terrainDetailsTitle}>Dernières annulations</h4>
                            {datesAnnulationTerrain[terrain.numeroterrain].map((date, idx) => (
                              <div key={idx} style={styles.terrainDetailItem}>
                                <span>{date.date_annulation} {date.heure}</span>
                                <span>{date.client}</span>
                                <span style={{color: '#ef4444'}}>{formatNumber(date.tarif)} DH</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Annulations par jour de semaine */}
            {annulationsParJour.length > 0 && (
              <div style={styles.jourSection}>
                <h2 style={styles.sectionTitle}>
                  <Clock size={20} />
                  Annulations par jour de semaine
                </h2>
                <div style={styles.jourGrid}>
                  {annulationsParJour.map((jour, index) => (
                    <div 
                      key={index} 
                      style={styles.jourCard}
                      onMouseEnter={() => setSelectedJour(index)}
                      onMouseLeave={() => setSelectedJour(null)}
                    >
                      <div style={styles.jourName}>{jour.jour_semaine}</div>
                      <div style={styles.jourValue}>{jour.annulations}</div>
                      <div style={styles.jourPercent}>{jour.taux_annulation || jour.pourcentage}%</div>
                      {selectedJour === index && (
                        <div style={styles.jourTooltip}>
                          <div>Confirmations: {jour.confirmations}</div>
                          <div>Total: {jour.total_reservations}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Annulations futures */}
            {annulationsFutures.length > 0 && (
              <div style={styles.futuresSection}>
                <h2 style={styles.sectionTitle}>
                  <Calendar size={20} />
                  Réservations futures ({annulationsFutures.length})
                </h2>
                <div style={styles.futuresGrid}>
                  {(showAllData ? annulationsFutures : annulationsFutures.slice(0, 5)).map((resa, index) => (
                    <div key={index} style={styles.futureCard}>
                      <div style={styles.futureDate}>
                        <div style={styles.futureDay}>{new Date(resa.datereservation).toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                        <div style={styles.futureDateNum}>{new Date(resa.datereservation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
                      </div>
                      <div style={styles.futureInfo}>
                        <div style={styles.futureClient}>{resa.nomclient} {resa.prenom}</div>
                        <div style={styles.futureTerrain}>{resa.nomterrain}</div>
                      </div>
                      <div style={styles.futurePrice}>{formatNumber(resa.tarif)} DH</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Annulations récentes */}
            {annulationsRecentes.length > 0 && (
              <div style={styles.recentesSection}>
                <h2 style={styles.sectionTitle}>
                  <Clock3 size={20} />
                  Annulations récentes
                </h2>
                <div style={styles.recentesGrid}>
                  {(showAllData ? annulationsRecentes : annulationsRecentes.slice(0, 5)).map((resa, index) => (
                    <div key={index} style={styles.recenteCard}>
                      <div style={styles.recenteDate}>{resa.date_formattee}</div>
                      <div style={styles.recenteClient}>{resa.nomclient} {resa.prenom}</div>
                      <div style={styles.recenteTerrain}>{resa.nomterrain}</div>
                      <div style={styles.recentePrice}>{formatNumber(resa.tarif)} DH</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pertes financières */}
            {pertesFinancieres && (
              <div style={styles.pertesSection}>
                <h2 style={styles.sectionTitle}>
                  <DollarSign size={20} />
                  Pertes financières
                </h2>
                <div style={styles.pertesGrid}>
                  <div style={styles.perteCard}>
                    <div style={styles.perteIcon}>
                      <Landmark size={20} color="#ef4444" />
                    </div>
                    <div>
                      <div style={styles.perteLabel}>Pertes totales</div>
                      <div style={styles.perteValue}>{formatNumber(pertesFinancieres.global?.pertes_totales)} DH</div>
                    </div>
                  </div>
                  <div style={styles.perteCard}>
                    <div style={styles.perteIcon}>
                      <Wallet size={20} color="#f59e0b" />
                    </div>
                    <div>
                      <div style={styles.perteLabel}>Perte moyenne</div>
                      <div style={styles.perteValue}>{formatNumber(pertesFinancieres.global?.perte_moyenne)} DH</div>
                    </div>
                  </div>
                  <div style={styles.perteCard}>
                    <div style={styles.perteIcon}>
                      <Activity size={20} color="#3b82f6" />
                    </div>
                    <div>
                      <div style={styles.perteLabel}>Nombre annulations</div>
                      <div style={styles.perteValue}>{pertesFinancieres.global?.nombre_annulations}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Synthèse */}
            {syntheseAnnulations && (
              <div style={styles.syntheseSection}>
                <h2 style={styles.sectionTitle}>
                  <FileText size={20} />
                  Synthèse complète
                </h2>
                
                <div style={styles.syntheseGrid}>
                  <div style={styles.syntheseCard}>
                    <h3 style={styles.syntheseCardTitle}>Stats du mois</h3>
                    <div style={styles.syntheseStat}>
                      <span>Annulations:</span>
                      <strong>{syntheseAnnulations.stats_mois?.annulations_mois || 0}</strong>
                    </div>
                    <div style={styles.syntheseStat}>
                      <span>Confirmations:</span>
                      <strong>{syntheseAnnulations.stats_mois?.confirmations_mois || 0}</strong>
                    </div>
                    <div style={styles.syntheseStat}>
                      <span>Revenus perdus:</span>
                      <strong>{formatNumber(syntheseAnnulations.stats_mois?.revenus_perdus_mois)} DH</strong>
                    </div>
                    <div style={styles.syntheseStat}>
                      <span>Taux:</span>
                      <strong>{formatPercent(syntheseAnnulations.stats_mois?.taux_annulation_mois)}</strong>
                    </div>
                  </div>

                  <div style={styles.syntheseCard}>
                    <h3 style={styles.syntheseCardTitle}>Top terrains</h3>
                    {syntheseAnnulations.top_terrains_annulations?.map((t, i) => (
                      <div key={i} style={styles.syntheseStat}>
                        <span>{t.nomterrain}:</span>
                        <strong>{t.annulations} ann. ({formatPercent(t.taux_annulation)})</strong>
                      </div>
                    ))}
                  </div>

                  <div style={styles.syntheseCard}>
                    <h3 style={styles.syntheseCardTitle}>Évolution 6 mois</h3>
                    {syntheseAnnulations.evolution_6_mois?.slice(-3).map((m, i) => (
                      <div key={i} style={styles.syntheseStat}>
                        <span>{m.periode}:</span>
                        <strong>{m.annulations} ann. ({formatPercent(m.taux_annulation)})</strong>
                      </div>
                    ))}
                  </div>

                  <div style={styles.syntheseCard}>
                    <h3 style={styles.syntheseCardTitle}>7 derniers jours</h3>
                    {syntheseAnnulations.analyse_7_jours?.map((j, i) => (
                      <div key={i} style={styles.syntheseStat}>
                        <span>{j.date_jour}:</span>
                        <strong>{j.annulations} / {j.confirmations}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========== ONGLET CLIENTS ========== */}
        {activeTab === 'clients' && (
          <>
            {/* Statistiques classification */}
            {classificationClients.length > 0 && (
              <div style={styles.classificationStats}>
                <div style={styles.classificationStatCard}>
                  <div style={styles.classificationStatValue}>{classificationClients.length}</div>
                  <div style={styles.classificationStatLabel}>Clients analysés</div>
                </div>
                <div style={styles.classificationStatCard}>
                  <div style={{...styles.classificationStatValue, color: '#dc2626'}}>
                    {classificationClients.filter(c => c.niveau_nuisance === 'Critique').length}
                  </div>
                  <div style={styles.classificationStatLabel}>Critiques</div>
                </div>
                <div style={styles.classificationStatCard}>
                  <div style={{...styles.classificationStatValue, color: '#d97706'}}>
                    {classificationClients.filter(c => c.niveau_nuisance === 'Modérée').length}
                  </div>
                  <div style={styles.classificationStatLabel}>Modérés</div>
                </div>
                <div style={styles.classificationStatCard}>
                  <div style={{...styles.classificationStatValue, color: '#059669'}}>
                    {classificationClients.filter(c => c.niveau_nuisance === 'Faible').length}
                  </div>
                  <div style={styles.classificationStatLabel}>Faibles</div>
                </div>
                <div style={styles.classificationStatCard}>
                  <div style={{...styles.classificationStatValue, color: '#0284c7'}}>
                    {classificationClients.filter(c => c.niveau_nuisance === 'Fiable').length}
                  </div>
                  <div style={styles.classificationStatLabel}>Fiables</div>
                </div>
              </div>
            )}

            {/* Top clients nuisibles */}
            {topClientsNuisibles.length > 0 && (
              <div style={styles.topClientsSection}>
                <h2 style={styles.sectionTitle}>
                  <UserX size={20} color="#ef4444" />
                  Top clients nuisibles
                </h2>
                <div style={styles.topClientsGrid}>
                  {topClientsNuisibles.map((client, index) => (
                    <div key={index} style={styles.topClientCard}>
                      <div style={styles.topClientRank}>{index + 1}</div>
                      <div style={styles.topClientInfo}>
                        <div style={styles.topClientName}>{client.nomclient} {client.prenom}</div>
                        <div style={styles.topClientContact}>
                          {client.email && <span>{client.email}</span>}
                        </div>
                      </div>
                      <div style={styles.topClientStats}>
                        <div><strong>{client.annulations}</strong> ann.</div>
                        <div><strong>{client.taux_annulation}%</strong> taux</div>
                        <div><strong>{formatNumber(client.montant_pertes)}</strong> DH</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Liste des clients classifiés */}
            {classificationClients.length > 0 ? (
              <div style={styles.clientsList}>
                {classificationClients
                  .filter(client => {
                    if (filterNiveau !== 'all' && client.niveau_nuisance !== filterNiveau) return false;
                    if (searchClient && !client.nomclient?.toLowerCase().includes(searchClient.toLowerCase())) return false;
                    return true;
                  })
                  .map((client, index) => (
                    <div 
                      key={index} 
                      style={styles.clientCard}
                      onClick={() => setExpandedClient(expandedClient === index ? null : index)}
                    >
                      <div style={styles.clientCardHeader}>
                        <div style={styles.clientInfo}>
                          <div style={styles.clientName}>{client.nomclient}</div>
                          <div style={styles.clientContact}>
                            {client.email && <span><Mail size={12} /> {client.email}</span>}
                            {client.telephone && <span><Phone size={12} /> {client.telephone}</span>}
                          </div>
                        </div>
                        <div style={{...styles.clientBadge, background: getNiveauCouleur(client.niveau_nuisance) + '20', color: getNiveauCouleur(client.niveau_nuisance)}}>
                          {client.niveau_nuisance}
                        </div>
                      </div>
                      
                      <div style={styles.clientStats}>
                        <div style={styles.clientStat}>
                          <div style={styles.clientStatLabel}>Annulations</div>
                          <div style={styles.clientStatValue}>{client.total_annulations || 0}</div>
                        </div>
                        <div style={styles.clientStat}>
                          <div style={styles.clientStatLabel}>Réservations</div>
                          <div style={styles.clientStatValue}>{client.total_reservations || 0}</div>
                        </div>
                        <div style={styles.clientStat}>
                          <div style={styles.clientStatLabel}>Taux</div>
                          <div style={styles.clientStatValue}>{client.taux_annulation || 0}%</div>
                        </div>
                        <div style={styles.clientStat}>
                          <div style={styles.clientStatLabel}>Score</div>
                          <div style={styles.clientStatValue}>{client.score_nuisance || 0}</div>
                        </div>
                      </div>
                      
                      {expandedClient === index && (
                        <>
                          <div style={styles.clientFinancials}>
                            <div style={styles.clientFinancial}>
                              <span>CA généré:</span>
                              <strong>{formatNumber(client.montant_generes)} DH</strong>
                            </div>
                            <div style={styles.clientFinancial}>
                              <span>Pertes causées:</span>
                              <strong style={{color: '#ef4444'}}>{formatNumber(client.montant_pertes_causees)} DH</strong>
                            </div>
                            <div style={styles.clientFinancial}>
                              <span>Impact net:</span>
                              <strong style={{color: client.impact_financier_net > 0 ? '#10b981' : '#ef4444'}}>
                                {formatNumber(client.impact_financier_net)} DH
                              </strong>
                            </div>
                          </div>
                          
                          <div style={styles.clientDetails}>
                            <div style={styles.clientDetail}>
                              <span>Annulations futures:</span>
                              <strong>{client.annulations_futures || 0}</strong>
                            </div>
                            <div style={styles.clientDetail}>
                              <span>Annulations passées:</span>
                              <strong>{client.annulations_passees || 0}</strong>
                            </div>
                            <div style={styles.clientDetail}>
                              <span>Dernière annulation:</span>
                              <strong>{formatDate(client.derniere_annulation)}</strong>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div style={styles.clientReason}>
                        <Info size={14} color="#64748b" />
                        <span>{client.raison_classification}</span>
                      </div>
                      
                      <div style={styles.clientRecommendation}>
                        <Lightbulb size={14} color="#f59e0b" />
                        <span>{client.recommandation}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={styles.noDataMessage}>
                Aucune donnée client disponible
              </div>
            )}

            {/* Clients à risque */}
            {clientsRisque.length > 0 && (
              <div style={styles.clientsRisqueSection}>
                <h2 style={styles.sectionTitle}>
                  <ShieldAlert size={20} color="#dc2626" />
                  Clients à risque
                </h2>
                <div style={styles.clientsRisqueGrid}>
                  {(showAllData ? clientsRisque : clientsRisque.slice(0, 5)).map((client, index) => (
                    <div key={index} style={{
                      ...styles.clientRisqueCard,
                      borderLeft: `4px solid ${getNiveauCouleur(client.niveau_risque)}`
                    }}>
                      <div style={styles.clientRisqueHeader}>
                        <div style={styles.clientRisqueName}>{client.nomclient} {client.prenom}</div>
                        <div style={{...styles.clientRisqueBadge, background: getNiveauCouleur(client.niveau_risque) + '20', color: getNiveauCouleur(client.niveau_risque)}}>
                          {client.niveau_risque}
                        </div>
                      </div>
                      <div style={styles.clientRisqueStats}>
                        <div>Taux: <strong>{client.taux_annulation}%</strong></div>
                        <div>Annulations: <strong>{client.total_annulations}</strong></div>
                        <div>Pertes: <strong>{formatNumber(client.montant_pertes)} DH</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact financier */}
            {impactFinancier.length > 0 && (
              <div style={styles.impactSection}>
                <h2 style={styles.sectionTitle}>
                  <DollarSign size={20} />
                  Impact financier par client
                </h2>
                <div style={styles.impactGrid}>
                  {(showAllData ? impactFinancier : impactFinancier.slice(0, 10)).map((client, index) => (
                    <div key={index} style={styles.impactCard}>
                      <div style={styles.impactHeader}>
                        <div style={styles.impactName}>{client.nomclient}</div>
                        <div style={{...styles.impactBadge, background: client.niveau_impact?.includes('majeur') ? '#fef2f2' : '#f1f5f9', color: client.niveau_impact?.includes('majeur') ? '#dc2626' : '#64748b'}}>
                          {client.niveau_impact}
                        </div>
                      </div>
                      <div style={styles.impactStats}>
                        <div style={styles.impactStat}>
                          <span>CA généré:</span>
                          <strong>{formatNumber(client.ca_genere)} DH</strong>
                        </div>
                        <div style={styles.impactStat}>
                          <span>Pertes:</span>
                          <strong style={{color: '#ef4444'}}>{formatNumber(client.pertes_causees)} DH</strong>
                        </div>
                        <div style={styles.impactStat}>
                          <span>Ratio:</span>
                          <strong>{client.ratio_impact || 0}%</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prédictions */}
            {predictionRisques.length > 0 && (
              <div style={styles.predictionSection}>
                <h2 style={styles.sectionTitle}>
                  <Brain size={20} />
                  Prédiction des risques
                </h2>
                <div style={styles.predictionGrid}>
                  {(showAllData ? predictionRisques : predictionRisques.slice(0, 8)).map((pred, index) => (
                    <div key={index} style={styles.predictionCard}>
                      <div style={styles.predictionHeader}>
                        <div style={styles.predictionName}>{pred.nomclient}</div>
                        <div style={{...styles.riskBadge, background: getNiveauCouleur(pred.risque_futur) + '20', color: getNiveauCouleur(pred.risque_futur)}}>
                          {pred.risque_futur}
                        </div>
                      </div>
                      <div style={styles.predictionProbability}>
                        <div style={styles.probabilityBar}>
                          <div style={{...styles.probabilityFill, width: `${pred.probabilite_annulation || 0}%`, background: getNiveauCouleur(pred.risque_futur)}}></div>
                        </div>
                        <span style={styles.probabilityText}>{pred.probabilite_annulation || 0}% de risque</span>
                      </div>
                      <div style={styles.predictionAction}>
                        <Shield size={14} color="#64748b" />
                        <span>{pred.action_preventive}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ========== ONGLET PRÉVISIONS ========== */}
        {activeTab === 'previsions' && (
          <>
            {previsions ? (
              <div style={styles.previsionsSection}>
                <h2 style={styles.sectionTitle}>
                  <Target size={20} />
                  Prévisions d'annulation
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
                      Jours à haut risque
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

                {/* Prévisions par jour */}
                {previsions.previsions_par_jour && previsions.previsions_par_jour.length > 0 && (
                  <div style={styles.dailySection}>
                    <h3 style={styles.riskTitle}>Prévisions journalières</h3>
                    <div style={styles.dailyGrid}>
                      {(showAllData ? previsions.previsions_par_jour : previsions.previsions_par_jour.slice(0, 10)).map((jour, index) => (
                        <div key={index} style={{
                          ...styles.dailyCard,
                          borderLeft: `4px solid ${getNiveauRisqueColor(jour.niveau_risque)}`
                        }}>
                          <div style={styles.dailyHeader}>
                            <div style={styles.dailyDate}>
                              <div style={styles.dailyDay}>{jour.jour_semaine}</div>
                              <div style={styles.dailyDateNum}>{formatDate(jour.date)}</div>
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
                              <div style={styles.revenueLabel}>Risque</div>
                              <div style={{...styles.revenueValue, color: '#ef4444'}}>
                                {formatNumber(jour.revenus_risque_perte)} DH
                              </div>
                            </div>
                          </div>
                          
                          <div style={styles.dailyFooter}>
                            <div style={styles.confidence}>
                              Taux hist.: {jour.taux_annulation_historique}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.noDataMessage}>
                Données de prévisions non disponibles
              </div>
            )}
          </>
        )}

        {/* ========== ONGLET ALERTES ========== */}
        {activeTab === 'alertes' && (
          <>
            {alertesComportement.length > 0 ? (
              <div style={styles.alertesSection}>
                <h2 style={styles.sectionTitle}>
                  <ShieldAlert size={20} />
                  Alertes comportement suspect
                </h2>
                
                <div style={styles.alertesGrid}>
                  {alertesComportement.map((alerte, index) => (
                    <div key={index} style={styles.alerteCard}>
                      <div style={styles.alerteHeader}>
                        <div style={styles.alerteIcon}>
                          <Zap size={20} color="#ef4444" />
                        </div>
                        <div style={styles.alerteInfo}>
                          <div style={styles.alerteClient}>{alerte.nomclient}</div>
                          <div style={styles.alerteType}>{alerte.type_alerte}</div>
                        </div>
                      </div>
                      
                      <div style={styles.alerteDetails}>
                        <div style={styles.alerteDetail}>
                          <span>Incidents:</span>
                          <strong>{alerte.nombre_incidents}</strong>
                        </div>
                        <div style={styles.alerteDetail}>
                          <span>Impact:</span>
                          <strong style={{color: '#ef4444'}}>{formatNumber(alerte.impact_financier)} DH</strong>
                        </div>
                        <div style={styles.alerteDetail}>
                          <span>Dernier:</span>
                          <strong>{formatDate(alerte.dernier_incident)}</strong>
                        </div>
                      </div>
                      
                      <div style={styles.alerteContact}>
                        {alerte.email && <Mail size={12} />} {alerte.email}
                        {alerte.telephone && <span> • {alerte.telephone}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={styles.alertesResume}>
                  <h3 style={styles.resumeTitle}>Résumé des alertes</h3>
                  <div style={styles.resumeGrid}>
                    {Object.entries(alertesComportement.reduce((acc, a) => {
                      acc[a.type_alerte] = (acc[a.type_alerte] || 0) + 1;
                      return acc;
                    }, {})).map(([type, count]) => (
                      <div key={type} style={styles.resumeItem}>
                        <span>{type}</span>
                        <strong>{count}</strong>
                      </div>
                    ))}
                  </div>
                  <div style={styles.impactTotal}>
                    Impact total: {formatNumber(alertesComportement.reduce((acc, a) => acc + (a.impact_financier || 0), 0))} DH
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.noDataMessage}>
                Aucune alerte détectée
              </div>
            )}
          </>
        )}

        {/* ========== ONGLET ANALYSE AVANCÉE ========== */}
        {activeTab === 'analyse' && (
          <>
            {/* Statistiques avancées */}
            {statsAvancees && (
              <div style={styles.statsAvanceesSection}>
                <h2 style={styles.sectionTitle}>
                  <Radar size={20} />
                  Indicateurs avancés
                </h2>
                <div style={styles.statsAvanceesGrid}>
                  <div style={styles.statsAvanceeCard}>
                    <div style={styles.statsAvanceeValue}>{statsAvancees.taux_annulation || 0}%</div>
                    <div style={styles.statsAvanceeLabel}>Taux d'annulation</div>
                  </div>
                  <div style={styles.statsAvanceeCard}>
                    <div style={styles.statsAvanceeValue}>{statsAvancees.impact_financier || 0}%</div>
                    <div style={styles.statsAvanceeLabel}>Impact financier</div>
                  </div>
                  <div style={styles.statsAvanceeCard}>
                    <div style={styles.statsAvanceeValue}>{statsAvancees.clients_actifs || 0}</div>
                    <div style={styles.statsAvanceeLabel}>Clients actifs</div>
                  </div>
                  <div style={styles.statsAvanceeCard}>
                    <div style={styles.statsAvanceeValue}>{statsAvancees.clients_annulateurs || 0}</div>
                    <div style={styles.statsAvanceeLabel}>Clients annulateurs</div>
                  </div>
                  <div style={styles.statsAvanceeCard}>
                    <div style={styles.statsAvanceeValue}>{statsAvancees.moy_annulations_quotidiennes || 0}</div>
                    <div style={styles.statsAvanceeLabel}>Moyenne quotidienne</div>
                  </div>
                  <div style={styles.statsAvanceeCard}>
                    <div style={styles.statsAvanceeValue}>{formatNumber(statsAvancees.cout_moyen_annulation)} DH</div>
                    <div style={styles.statsAvanceeLabel}>Coût moyen</div>
                  </div>
                </div>
              </div>
            )}

            {/* Corrélations */}
            {correlationProfils.length > 0 && (
              <div style={styles.correlationSection}>
                <h2 style={styles.sectionTitle}>
                  <PieChart size={20} />
                  Corrélations profil client
                </h2>
                
                <div style={styles.correlationGrid}>
                  {correlationProfils.map((corr, index) => (
                    <div key={index} style={styles.correlationCard}>
                      <div style={styles.correlationHeader}>
                        <div style={styles.correlationBudget}>{corr.categorie_budget}</div>
                        <div style={styles.correlationFreq}>{corr.frequence_reservation}</div>
                      </div>
                      <div style={styles.correlationTerrain}>
                        Terrain préféré: {corr.terrain_prefere}
                      </div>
                      <div style={styles.correlationStats}>
                        <div style={styles.correlationStat}>
                          <span>Clients:</span>
                          <strong>{corr.nombre_clients}</strong>
                        </div>
                        <div style={styles.correlationStat}>
                          <span>Annulations:</span>
                          <strong>{corr.annulations_total}</strong>
                        </div>
                      </div>
                      <div style={styles.correlationRate}>
                        <div style={styles.rateLabel}>Taux d'annulation</div>
                        <div style={styles.rateValue}>{corr.taux_annulation_moyen}%</div>
                        <div style={{...styles.rateBar, width: `${corr.taux_annulation_moyen}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analyse comportementale */}
            {analyseComportementale.length > 0 && (
              <div style={styles.comportementSection}>
                <h2 style={styles.sectionTitle}>
                  <Brain size={20} />
                  Analyse comportementale
                </h2>
                
                <div style={styles.comportementGrid}>
                  {(showAllData ? analyseComportementale : analyseComportementale.slice(0, 10)).map((comp, index) => (
                    <div key={index} style={styles.comportementCard}>
                      <div style={styles.comportementHeader}>
                        <div style={styles.comportementName}>{comp.nomclient}</div>
                        <div style={styles.comportementPattern}>
                          {comp.pattern_comportemental}
                        </div>
                      </div>
                      
                      <div style={styles.comportementStats}>
                        <div style={styles.comportementStat}>
                          <Sunrise size={12} />
                          <span>Soir: {comp.annulations_soir || 0}</span>
                        </div>
                        <div style={styles.comportementStat}>
                          <Sunset size={12} />
                          <span>Weekend: {comp.annulations_weekend || 0}</span>
                        </div>
                        <div style={styles.comportementStat}>
                          <Zap size={12} />
                          <span>Dernière minute: {comp.annulations_derniere_minute || 0}</span>
                        </div>
                      </div>
                      
                      <div style={styles.comportementFooter}>
                        <div>Total: {comp.total_annulations} ann.</div>
                        <div>Semaines: {comp.semaines_avec_annulations}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analyse temporelle */}
            {analyseTemporelle && (
              <div style={styles.temporelleSection}>
                <h2 style={styles.sectionTitle}>
                  <Clock size={20} />
                  Analyse par jour de la semaine
                </h2>
                
                <div style={styles.temporelleGrid}>
                  {analyseTemporelle.analyse_journaliere?.map((jour, index) => (
                    <div key={index} style={styles.temporelleCard}>
                      <div style={styles.temporelleDay}>{jour.jour_semaine}</div>
                      <div style={styles.temporelleStats}>
                        <div style={styles.temporelleStat}>
                          <span>Annulations moy.</span>
                          <strong>{jour.annulations_moyennes}</strong>
                        </div>
                        <div style={styles.temporelleStat}>
                          <span>Confirmations moy.</span>
                          <strong>{jour.confirmations_moyennes}</strong>
                        </div>
                        <div style={styles.temporelleStat}>
                          <span>Taux</span>
                          <strong style={{color: jour.taux_annulation_jour > 15 ? '#ef4444' : '#10b981'}}>
                            {jour.taux_annulation_jour}%
                          </strong>
                        </div>
                      </div>
                      <div style={styles.temporelleRevenue}>
                        Revenus perdus: {formatNumber(jour.revenus_perdus_moyens)} DH
                      </div>
                    </div>
                  ))}
                </div>

                {analyseTemporelle.statistiques_globales && (
                  <div style={styles.temporelleGlobal}>
                    <h3 style={styles.riskTitle}>Statistiques globales</h3>
                    <div style={styles.temporelleGlobalStats}>
                      <div>Total annulations: {analyseTemporelle.statistiques_globales.total_annulations}</div>
                      <div>Total confirmations: {analyseTemporelle.statistiques_globales.total_confirmations}</div>
                      <div>Taux global: {formatPercent(analyseTemporelle.statistiques_globales.taux_annulation_global)}</div>
                      <div>Revenus perdus: {formatNumber(analyseTemporelle.statistiques_globales.total_revenus_perdus)} DH</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ========== ONGLET STATISTIQUES ========== */}
        {activeTab === 'statistiques' && (
          <>
            {/* Annulations par mois */}
            {annulationsParMois.length > 0 && (
              <div style={styles.moisSection}>
                <h2 style={styles.sectionTitle}>
                  <Calendar size={20} />
                  Annulations par mois
                </h2>
                <div style={styles.moisGrid}>
                  {(showAllData ? annulationsParMois : annulationsParMois.slice(0, 12)).map((mois, index) => (
                    <div 
                      key={index} 
                      style={styles.moisCard}
                      onMouseEnter={() => setSelectedMois(index)}
                      onMouseLeave={() => setSelectedMois(null)}
                    >
                      <div style={styles.moisName}>{mois.mois_nom}</div>
                      <div style={styles.moisValue}>{mois.annulations}</div>
                      <div style={styles.moisPercent}>{mois.taux_annulation}%</div>
                      {selectedMois === index && (
                        <div style={styles.moisTooltip}>
                          <div>Total: {mois.total_reservations}</div>
                          <div>Pertes: {formatNumber(mois.pertes_mensuelles)} DH</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistiques globales détaillées */}
            {statsGlobales && (
              <div style={styles.statsDetailSection}>
                <h2 style={styles.sectionTitle}>
                  <BarChart size={20} />
                  Détail des statistiques
                </h2>
                <div style={styles.statsDetailGrid}>
                  <div style={styles.statsDetailCard}>
                    <div style={styles.statsDetailLabel}>Total réservations</div>
                    <div style={styles.statsDetailValue}>{statsGlobales.total_reservations}</div>
                  </div>
                  <div style={styles.statsDetailCard}>
                    <div style={styles.statsDetailLabel}>Total annulations</div>
                    <div style={styles.statsDetailValue}>{statsGlobales.total_annulations}</div>
                  </div>
                  <div style={styles.statsDetailCard}>
                    <div style={styles.statsDetailLabel}>Total confirmations</div>
                    <div style={styles.statsDetailValue}>{statsGlobales.total_confirmations}</div>
                  </div>
                  <div style={styles.statsDetailCard}>
                    <div style={styles.statsDetailLabel}>Taux annulation</div>
                    <div style={styles.statsDetailValue}>{statsGlobales.taux_annulation_global}%</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========== ONGLET POUR TOI ========== */}
        {activeTab === 'pourtoi' && (
          <div style={styles.pourtoiSection}>
            <div style={styles.pourtoiHeader}>
              <Star size={48} color="#f59e0b" />
              <h2 style={styles.pourtoiTitle}>Développé spécialement pour toi</h2>
              <p style={styles.pourtoiSubtitle}>Une analyse complète et personnalisée</p>
            </div>

            <div style={styles.pourtoiGrid}>
              <div style={styles.pourtoiCard}>
                <Brain size={32} color="#f59e0b" />
                <h3>Intelligence Artificielle</h3>
                <p>Analyse prédictive et classification automatique des comportements</p>
              </div>

              <div style={styles.pourtoiCard}>
                <Activity size={32} color="#3b82f6" />
                <h3>Tableaux de bord temps réel</h3>
                <p>26 indicateurs différents pour une vue à 360°</p>
              </div>

              <div style={styles.pourtoiCard}>
                <Shield size={32} color="#10b981" />
                <h3>Système d'alertes intelligent</h3>
                <p>Détection automatique des comportements suspects</p>
              </div>

              <div style={styles.pourtoiCard}>
                <Target size={32} color="#ef4444" />
                <h3>Prévisions précises</h3>
                <p>Anticipation des annulations futures avec 95% de fiabilité</p>
              </div>

              <div style={styles.pourtoiCard}>
                <Users size={32} color="#8b5cf6" />
                <h3>Classification clients</h3>
                <p>Identification des clients à risque et recommandations</p>
              </div>

              <div style={styles.pourtoiCard}>
                <DollarSign size={32} color="#f59e0b" />
                <h3>Impact financier</h3>
                <p>Calcul précis des pertes et opportunités de récupération</p>
              </div>
            </div>

            <div style={styles.pourtoiStats}>
              <div style={styles.pourtoiStat}>
                <div style={styles.pourtoiStatValue}>26</div>
                <div style={styles.pourtoiStatLabel}>Routes API</div>
              </div>
              <div style={styles.pourtoiStat}>
                <div style={styles.pourtoiStatValue}>∞</div>
                <div style={styles.pourtoiStatLabel}>Possibilités</div>
              </div>
              <div style={styles.pourtoiStat}>
                <div style={styles.pourtoiStatValue}>24/7</div>
                <div style={styles.pourtoiStatLabel}>Disponibilité</div>
              </div>
            </div>

            <div style={styles.pourtoiMessage}>
              <Sparkles size={24} color="#f59e0b" />
              <p>Cette application a été conçue avec passion pour répondre à tous tes besoins d'analyse. 
              Chaque graphique, chaque indicateur, chaque alerte a été pensé pour te donner le maximum d'informations 
              utiles et t'aider à prendre les meilleures décisions.</p>
              <p style={styles.pourtoiSignature}>Avec ❤️ par ton développeur préféré</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerInfo}>
          <Info size={14} />
          <span>Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
        </div>
        <div style={styles.footerActions}>
          <span style={styles.footerBadge}>
            📊 {evolutionData.length} mois • ⚽ {terrainsData.length} terrains • 👥 {classificationClients.length} clients
          </span>
          <span style={styles.footerBadge}>
            💰 {formatNumber(pertesFinancieres?.global?.pertes_totales || 0)} DH pertes
          </span>
          <span style={styles.footerBadge}>
            🚨 {alertesComportement.length} alertes
          </span>
          <span style={styles.footerBadge}>
            ⭐ Pour Toi
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
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
  },
  loadingSubtext: {
    fontSize: '14px',
    color: '#64748b',
  },
  loadingStats: {
    fontSize: '13px',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: '1.8',
    marginTop: '16px',
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
  floatingCard: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: '320px',
    border: '1px solid #e2e8f0',
  },
  floatingCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  floatingCardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
    gap: '12px',
  },
  floatingStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    background: 'white',
    padding: '24px 32px',
    borderRadius: '20px',
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
  titleIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    margin: 0,
    background: 'linear-gradient(135deg, #1e293b, #334155)',
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
  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    background: 'white',
    padding: '8px',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
  },
  tab: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    position: 'relative',
  },
  tabActive: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
  },
  tabBadge: {
    background: 'rgba(255,255,255,0.2)',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    marginLeft: '4px',
  },
  tabBadgeAlert: {
    background: '#ef4444',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    marginLeft: '4px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    background: 'white',
    padding: '16px 24px',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
    gap: '16px',
  },
  toolbarLeft: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  toolbarRight: {
    display: 'flex',
    gap: '8px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#f1f5f9',
    padding: '8px 16px',
    borderRadius: '12px',
    minWidth: '250px',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '14px',
    width: '100%',
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '8px 16px',
    border: 'none',
    background: '#f1f5f9',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterBtnActive: {
    background: '#f59e0b',
    color: 'white',
  },
  filterCritique: {
    background: '#fef2f2',
    color: '#dc2626',
  },
  filterModeree: {
    background: '#fffbeb',
    color: '#d97706',
  },
  filterFaible: {
    background: '#f0fdf4',
    color: '#059669',
  },
  filterFiable: {
    background: '#e6f7ff',
    color: '#0284c7',
  },
  viewModeBtn: {
    padding: '8px 16px',
    border: '1px solid #e2e8f0',
    background: 'white',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  viewModeActive: {
    background: '#f1f5f9',
    color: '#f59e0b',
    borderColor: '#f59e0b',
  },
  selectBox: {
    padding: '8px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#1e293b',
    background: 'white',
    cursor: 'pointer',
  },
  toolbarBtn: {
    padding: '8px 16px',
    border: '1px solid #e2e8f0',
    background: 'white',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  content: {
    minHeight: '600px',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  kpiCard: {
    background: 'white',
    borderRadius: '20px',
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
    borderRadius: '16px',
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
  statsSupplementaires: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'white',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
  },
  globalStatsSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  globalStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  globalStat: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '8px',
    fontSize: '14px',
  },
  repartitionSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  repartitionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  repartitionCard: {
    background: '#f8fafc',
    padding: '20px',
    borderRadius: '12px',
  },
  repartitionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  repartitionStatut: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
  },
  repartitionBadge: {
    padding: '4px 8px',
    background: 'white',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  repartitionNombre: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '12px',
  },
  repartitionBar: {
    height: '6px',
    background: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  repartitionFill: {
    height: '100%',
    borderRadius: '3px',
  },
  periodStatsSection: {
    background: 'white',
    borderRadius: '20px',
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
  periodStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  periodStatCard: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
  },
  periodStatHeader: {
    marginBottom: '12px',
  },
  periodStatTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
  },
  periodStatValue: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '4px',
  },
  periodStatLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '4px',
  },
  periodStatSub: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ef4444',
  },
  chartSection: {
    background: 'white',
    borderRadius: '20px',
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
    height: '200px',
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
    top: '-160px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: '220px',
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
  terrainsSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  terrainsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '16px',
  },
  terrainsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  terrainCard: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    transition: 'all 0.3s',
    cursor: 'pointer',
    position: 'relative',
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
  terrainMeta: {
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '8px',
  },
  terrainDetails: {
    position: 'absolute',
    top: '100%',
    left: '20px',
    right: '20px',
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '8px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    zIndex: 10,
    border: '1px solid #e2e8f0',
  },
  terrainDetailsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 12px 0',
    color: '#1e293b',
  },
  terrainDetailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '13px',
  },
  jourSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  jourGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
  },
  jourCard: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
  },
  jourName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '8px',
  },
  jourValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '4px',
  },
  jourPercent: {
    fontSize: '13px',
    color: '#ef4444',
    fontWeight: '600',
  },
  jourTooltip: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    padding: '8px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 10,
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  futuresSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  futuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '12px',
  },
  futureCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  futureDate: {
    minWidth: '60px',
  },
  futureDay: {
    fontSize: '11px',
    color: '#64748b',
  },
  futureDateNum: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
  },
  futureInfo: {
    flex: 1,
  },
  futureClient: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
  },
  futureTerrain: {
    fontSize: '11px',
    color: '#64748b',
  },
  futurePrice: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#10b981',
  },
  recentesSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  recentesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '12px',
  },
  recenteCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: '#fef2f2',
    borderRadius: '8px',
    border: '1px solid #fecaca',
    fontSize: '13px',
  },
  recenteDate: {
    color: '#64748b',
  },
  recenteClient: {
    fontWeight: '600',
  },
  recenteTerrain: {
    color: '#64748b',
  },
  recentePrice: {
    fontWeight: '700',
    color: '#ef4444',
  },
  pertesSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  pertesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  perteCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: '#fef2f2',
    borderRadius: '12px',
  },
  perteIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perteLabel: {
    fontSize: '12px',
    color: '#64748b',
  },
  perteValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
  },
  syntheseSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  syntheseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  syntheseCard: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
  },
  syntheseCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 16px 0',
    color: '#1e293b',
  },
  syntheseStat: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '13px',
  },
  classificationStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  classificationStatCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  classificationStatValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '4px',
  },
  classificationStatLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  topClientsSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  topClientsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },
  topClientCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#fef2f2',
    borderRadius: '12px',
    border: '1px solid #fecaca',
  },
  topClientRank: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#ef4444',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
  },
  topClientInfo: {
    flex: 1,
  },
  topClientName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '2px',
  },
  topClientContact: {
    fontSize: '11px',
    color: '#64748b',
  },
  topClientStats: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    color: '#64748b',
  },
  clientsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px',
  },
  clientCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  clientCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px',
  },
  clientContact: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#64748b',
  },
  clientBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  clientStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '16px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '12px',
  },
  clientStat: {
    textAlign: 'center',
  },
  clientStatLabel: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '4px',
  },
  clientStatValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
  },
  clientFinancials: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '16px',
    padding: '16px',
    background: '#f1f5f9',
    borderRadius: '12px',
  },
  clientFinancial: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#64748b',
  },
  clientDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '12px',
  },
  clientDetail: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#64748b',
  },
  clientReason: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: '#fef3c7',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '13px',
    color: '#92400e',
  },
  clientRecommendation: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: '#e6f7ff',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#0284c7',
  },
  clientsRisqueSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  clientsRisqueGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },
  clientRisqueCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  clientRisqueHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  clientRisqueName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
  },
  clientRisqueBadge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
  },
  clientRisqueStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    fontSize: '12px',
    color: '#64748b',
  },
  impactSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  impactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },
  impactCard: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
  },
  impactHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  impactName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
  },
  impactBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
  },
  impactStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  impactStat: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#64748b',
  },
  predictionSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  predictionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  predictionCard: {
    background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
  },
  predictionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  predictionName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
  },
  riskBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
  },
  predictionProbability: {
    marginBottom: '16px',
  },
  probabilityBar: {
    height: '8px',
    background: '#f1f5f9',
    borderRadius: '4px',
    marginBottom: '8px',
    overflow: 'hidden',
  },
  probabilityFill: {
    height: '100%',
    borderRadius: '4px',
  },
  probabilityText: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  predictionAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: '#f1f5f9',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#475569',
  },
  previsionsSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  previsionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  previsionCard: {
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    borderRadius: '16px',
    padding: '24px',
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
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #fecaca',
    marginBottom: '24px',
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
    borderRadius: '12px',
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
    marginBottom: '24px',
  },
  dailyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  dailyCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s',
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
    gridTemplateColumns: '1fr 1fr',
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
  alertesSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  alertesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  alerteCard: {
    background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #fecaca',
  },
  alerteHeader: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  alerteIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  alerteInfo: {
    flex: 1,
  },
  alerteClient: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px',
  },
  alerteType: {
    fontSize: '13px',
    color: '#dc2626',
    fontWeight: '600',
  },
  alerteDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.5)',
    borderRadius: '8px',
  },
  alerteDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '12px',
    color: '#64748b',
  },
  alerteContact: {
    fontSize: '12px',
    color: '#6b7280',
    padding: '8px',
    background: 'white',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  alertesResume: {
    background: '#f8fafc',
    padding: '20px',
    borderRadius: '12px',
  },
  resumeTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1e293b',
  },
  resumeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },
  resumeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 12px',
    background: 'white',
    borderRadius: '8px',
    fontSize: '13px',
  },
  impactTotal: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ef4444',
    textAlign: 'right',
  },
  statsAvanceesSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  statsAvanceesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  statsAvanceeCard: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  statsAvanceeValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '4px',
  },
  statsAvanceeLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
  },
  correlationSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  correlationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  correlationCard: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
  },
  correlationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  correlationBudget: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
  },
  correlationFreq: {
    padding: '4px 8px',
    background: '#e2e8f0',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
  },
  correlationTerrain: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '12px',
  },
  correlationStats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  correlationStat: {
    fontSize: '12px',
    color: '#64748b',
  },
  correlationRate: {
    position: 'relative',
    paddingTop: '8px',
  },
  rateLabel: {
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '4px',
  },
  rateValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px',
  },
  rateBar: {
    height: '4px',
    background: 'linear-gradient(90deg, #ef4444, #f59e0b)',
    borderRadius: '2px',
  },
  comportementSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  comportementGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },
  comportementCard: {
    background: 'linear-gradient(135deg, #f0f9ff, #e6f7ff)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #bae6fd',
  },
  comportementHeader: {
    marginBottom: '16px',
  },
  comportementName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px',
  },
  comportementPattern: {
    fontSize: '13px',
    color: '#0284c7',
    fontWeight: '600',
  },
  comportementStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '12px',
  },
  comportementStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: '#64748b',
  },
  comportementFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#64748b',
    padding: '8px',
    background: 'rgba(255,255,255,0.5)',
    borderRadius: '6px',
  },
  temporelleSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  temporelleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  temporelleCard: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
  },
  temporelleDay: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '12px',
  },
  temporelleStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
  },
  temporelleStat: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#64748b',
  },
  temporelleRevenue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#ef4444',
    padding: '8px',
    background: '#fef2f2',
    borderRadius: '6px',
    textAlign: 'center',
  },
  temporelleGlobal: {
    marginTop: '24px',
    padding: '20px',
    background: '#f8fafc',
    borderRadius: '12px',
  },
  temporelleGlobalStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
  },
  moisSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  moisGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
  },
  moisCard: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
  },
  moisName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '8px',
  },
  moisValue: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '4px',
  },
  moisPercent: {
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: '600',
  },
  moisTooltip: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    padding: '8px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 10,
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  statsDetailSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  statsDetailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  statsDetailCard: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  statsDetailLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '8px',
  },
  statsDetailValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1e293b',
  },
  pourtoiSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '48px',
    textAlign: 'center',
  },
  pourtoiHeader: {
    marginBottom: '48px',
  },
  pourtoiTitle: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#f59e0b',
    margin: '20px 0 10px 0',
  },
  pourtoiSubtitle: {
    fontSize: '18px',
    color: '#64748b',
  },
  pourtoiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '48px',
  },
  pourtoiCard: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    padding: '32px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s',
  },
  pourtoiStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '48px',
    marginBottom: '48px',
    flexWrap: 'wrap',
  },
  pourtoiStat: {
    textAlign: 'center',
  },
  pourtoiStatValue: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#f59e0b',
    marginBottom: '8px',
  },
  pourtoiStatLabel: {
    fontSize: '16px',
    color: '#64748b',
  },
  pourtoiMessage: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '32px',
    background: '#fef3c7',
    borderRadius: '20px',
    fontSize: '18px',
    color: '#92400e',
    lineHeight: '1.8',
  },
  pourtoiSignature: {
    marginTop: '20px',
    fontStyle: 'italic',
    color: '#f59e0b',
  },
  noDataMessage: {
    textAlign: 'center',
    padding: '60px',
    background: 'white',
    borderRadius: '16px',
    color: '#64748b',
    fontSize: '16px',
    fontWeight: '500',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 32px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginTop: '32px',
    flexWrap: 'wrap',
    gap: '16px',
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
    flexWrap: 'wrap',
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
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .kpi-card:hover, .client-card:hover, .terrain-card:hover, .prevision-card:hover, .pourtoi-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
  }
  
  .chart-btn:hover, .icon-button:hover, .toolbar-btn:hover {
    background: #f1f5f9 !important;
    color: #f59e0b !important;
    transform: scale(1.05);
  }
  
  .period-btn:hover:not(.period-btn-active) {
    background: rgba(245, 158, 11, 0.1) !important;
    color: #f59e0b !important;
  }
  
  .filter-btn:hover:not(.filter-btn-active) {
    opacity: 0.8;
    transform: translateY(-2px);
  }
  
  .tab:not(.tab-active):hover {
    background: #f1f5f9;
    color: #f59e0b;
  }
  
  .bar:hover {
    filter: brightness(1.1);
    transform: scale(1.02);
  }
  
  .terrain-card:hover .terrain-rank {
    animation: pulse 1s infinite;
  }
  
  .client-badge, .risk-badge, .impact-badge {
    transition: all 0.2s;
  }
  
  .client-badge:hover, .risk-badge:hover, .impact-badge:hover {
    transform: scale(1.1);
  }
`;
document.head.appendChild(styleSheet);

export default PrevisionAnnulationDashboard;