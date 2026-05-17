import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar,
  Users,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  RefreshCw,
  Menu,
  ChevronRight,
  Award,
  Target,
  AlertCircle,
  CheckCircle,
  Activity,
  Zap,
  PieChart,
  LineChart,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  UserCheck,
  UserX,
  ThumbsUp,
  ThumbsDown,
  Star,
  Crown,
  Flame,
  Shield,
  Navigation,
  Sun,
  Moon,
  Cloud,
  Loader2
} from 'lucide-react';
import './analysereserve.css';

const API_BASE_URL = 'https://backend-foot-omega.vercel.app/api/analyse-reservation';

const ReservationDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  
  // Données d'état
  const [dashboardData, setDashboardData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [typeTerrainData, setTypeTerrainData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [clientsData, setClientsData] = useState(null);
  const [weeklyComparison, setWeeklyComparison] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [cancellationData, setCancellationData] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        dashboardRes,
        hourlyRes,
        typeTerrainRes,
        monthlyRes,
        clientsRes,
        weeklyRes,
        forecastRes,
        cancellationRes
      ] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/dashboard-reservations`),
        fetch(`${API_BASE_URL}/analyse-horaire`),
        fetch(`${API_BASE_URL}/analyse-par-type-terrain`),
        fetch(`${API_BASE_URL}/evolution-mensuelle`),
        fetch(`${API_BASE_URL}/analyse-clients-reservations`),
        fetch(`${API_BASE_URL}/comparaison-hebdomadaire`),
        fetch(`${API_BASE_URL}/previsions-reservations`),
        fetch(`${API_BASE_URL}/analyse-annulations`)
      ]);

      if (dashboardRes.status === 'fulfilled' && dashboardRes.value.ok) {
        const data = await dashboardRes.value.json();
        if (data.success) setDashboardData(data);
      }
      if (hourlyRes.status === 'fulfilled' && hourlyRes.value.ok) {
        const data = await hourlyRes.value.json();
        if (data.success) setHourlyData(data);
      }
      if (typeTerrainRes.status === 'fulfilled' && typeTerrainRes.value.ok) {
        const data = await typeTerrainRes.value.json();
        if (data.success) setTypeTerrainData(data);
      }
      if (monthlyRes.status === 'fulfilled' && monthlyRes.value.ok) {
        const data = await monthlyRes.value.json();
        if (data.success) setMonthlyData(data);
      }
      if (clientsRes.status === 'fulfilled' && clientsRes.value.ok) {
        const data = await clientsRes.value.json();
        if (data.success) setClientsData(data);
      }
      if (weeklyRes.status === 'fulfilled' && weeklyRes.value.ok) {
        const data = await weeklyRes.value.json();
        if (data.success) setWeeklyComparison(data);
      }
      if (forecastRes.status === 'fulfilled' && forecastRes.value.ok) {
        const data = await forecastRes.value.json();
        if (data.success) setForecastData(data);
      }
      if (cancellationRes.status === 'fulfilled' && cancellationRes.value.ok) {
        const data = await cancellationRes.value.json();
        if (data.success) setCancellationData(data);
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const tabs = useMemo(() => [
    { id: 'dashboard', label: 'Tableau de bord', icon: <BarChart3 size={18} /> },
    { id: 'analyse-horaire', label: 'Analyse horaire', icon: <Clock size={18} /> },
    { id: 'type-terrain', label: 'Types de terrain', icon: <Target size={18} /> },
    { id: 'evolution', label: 'Évolution', icon: <LineChart size={18} /> },
    { id: 'clients', label: 'Clients', icon: <Users size={18} /> },
    { id: 'previsions', label: 'Prévisions', icon: <Activity size={18} /> }
  ], []);

  const getTrendIcon = (value) => {
    if (value > 0) return <TrendingUp size={14} />;
    if (value < 0) return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  const getTrendClass = (value) => {
    if (value > 0) return 'fa-positive';
    if (value < 0) return 'fa-negative';
    return '';
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString('fr-FR');
  };

  if (loading && !dashboardData) {
    return (
      <div className="fa-dashboard-loader">
        <div className="fa-loader-spinner">
          <div className="fa-loader-dot"></div>
          <div className="fa-loader-dot"></div>
          <div className="fa-loader-dot"></div>
        </div>
        <div className="fa-loader-text">
          <Loader2 size={24} className="fa-spinning" />
          <span>Chargement des données...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fa-dashboard">
      {/* Header */}
      <header className="fa-header">
        <div className="fa-header-content">
          <div className="fa-logo-section">
            <div className="fa-logo-icon">
              <div className="fa-logo-pulse"></div>
              <Calendar size={28} />
            </div>
            <div className="fa-logo-text">
              <h1>Dashboard Réservations</h1>
              <div className="fa-subtitle">Analyse complète des réservations</div>
            </div>
          </div>
          <div className="fa-header-actions">
            <button className="fa-btn-refresh" onClick={fetchData}>
              <RefreshCw size={16} />
              <span>Actualiser</span>
            </button>
            <button 
              className="fa-btn-mobile-menu" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
            <div className="fa-header-time">
              <Clock size={14} />
              <span className="fa-time-text">
                {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '--:--'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`fa-nav ${mobileMenuOpen ? 'fa-mobile-open' : ''}`}>
        <div className="fa-nav-track">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`fa-nav-tab ${activeTab === tab.id ? 'fa-nav-tab-active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
          <div 
            className="fa-nav-indicator" 
            style={{ left: `${tabs.findIndex(t => t.id === activeTab) * 25}%` }}
          ></div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="fa-main">
        <div className="fa-content-wrapper">
          
          {/* Tab: Tableau de bord */}
          {activeTab === 'dashboard' && dashboardData && (
            <div className="fa-tab-content">
              {/* KPI Cards */}
              <div className="fa-kpi-grid">
                <div className="fa-kpi-card fa-primary">
                  <div className="fa-kpi-icon"><Calendar size={32} /></div>
                  <div className="fa-kpi-content">
                    <div className="fa-kpi-title">Total Réservations</div>
                    <div className="fa-kpi-value">{formatNumber(dashboardData.indicateurs?.total_reservations)}</div>
                    <div className={`fa-kpi-trend ${getTrendClass(dashboardData.indicateurs?.evolution_reservations)}`}>
                      {getTrendIcon(dashboardData.indicateurs?.evolution_reservations)}
                      {Math.abs(dashboardData.indicateurs?.evolution_reservations || 0).toFixed(1)}%
                    </div>
                    <div className="fa-kpi-subtitle">vs période précédente</div>
                  </div>
                </div>

                <div className="fa-kpi-card fa-secondary">
                  <div className="fa-kpi-icon"><Users size={32} /></div>
                  <div className="fa-kpi-content">
                    <div className="fa-kpi-title">Clients Uniques</div>
                    <div className="fa-kpi-value">{formatNumber(dashboardData.indicateurs?.clients_uniques)}</div>
                    <div className="fa-kpi-subtitle">30 derniers jours</div>
                  </div>
                </div>

                <div className="fa-kpi-card fa-info">
                  <div className="fa-kpi-icon"><Clock size={32} /></div>
                  <div className="fa-kpi-content">
                    <div className="fa-kpi-title">Durée moyenne</div>
                    <div className="fa-kpi-value">{dashboardData.indicateurs?.duree_moyenne_heures?.toFixed(1)}h</div>
                    <div className="fa-kpi-subtitle">par réservation</div>
                  </div>
                </div>

                <div className="fa-kpi-card fa-warning">
                  <div className="fa-kpi-icon"><XCircle size={32} /></div>
                  <div className="fa-kpi-content">
                    <div className="fa-kpi-title">Taux annulation</div>
                    <div className="fa-kpi-value">{dashboardData.indicateurs?.taux_annulation || 0}%</div>
                    <div className="fa-kpi-subtitle">des réservations</div>
                  </div>
                </div>
              </div>

              {/* Status & Evolution */}
              <div className="fa-insight-section">
                <div className="fa-insight-card fa-status-card">
                  <div className="fa-status-content">
                    <div className={`fa-status-badge ${dashboardData.indicateurs?.tendance?.toLowerCase().replace(/ /g, '-')}`}>
                      <div className="fa-status-badge-pulse"></div>
                      {dashboardData.indicateurs?.tendance || 'STABLE'}
                    </div>
                    <div className="fa-status-details">
                      <div className="fa-status-item">
                        <span className="fa-label">Évolution</span>
                        <span className={`fa-value ${getTrendClass(dashboardData.indicateurs?.evolution_reservations)}`}>
                          {dashboardData.indicateurs?.evolution_reservations?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="fa-status-item">
                        <span className="fa-label">Période</span>
                        <span className="fa-value">30 jours</span>
                      </div>
                      <div className="fa-status-item">
                        <span className="fa-label">Moy/jour</span>
                        <span className="fa-value">
                          {Math.round(dashboardData.indicateurs?.total_reservations / 30)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="fa-insight-card">
                  <h3 style={{ marginBottom: 16 }}>Top 5 terrains</h3>
                  <div className="fa-top-list">
                    {dashboardData.top_terrains?.slice(0, 5).map((terrain, idx) => (
                      <div key={idx} className="fa-top-item">
                        <div className="fa-rank">{idx + 1}</div>
                        <div className="fa-top-item-content">
                          <span className="fa-name">{terrain.terrain}</span>
                          <span className="fa-metric">{terrain.reservations} résas</span>
                        </div>
                        <div className="fa-progress">
                          <div 
                            className="fa-progress-fill" 
                            style={{ width: `${(terrain.reservations / dashboardData.top_terrains[0]?.reservations) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly Comparison */}
              {weeklyComparison && (
                <div className="fa-comparison-grid">
                  <div className="fa-comparison-card">
                    <div className="fa-comparison-header">
                      <h3>Comparaison hebdomadaire</h3>
                    </div>
                    <div className="fa-comparison-metrics">
                      <div className="fa-comparison-metric">
                        <div className="fa-metric-label">Réservations</div>
                        <div className="fa-metric-values">
                          <div className="fa-metric-current">
                            <small>Cette semaine</small>
                            <strong>{formatNumber(weeklyComparison.synthese?.total_semaine_courante)}</strong>
                          </div>
                          <div className="fa-metric-arrow"><ChevronRight size={20} /></div>
                          <div className="fa-metric-previous">
                            <small>Semaine dernière</small>
                            <strong>{formatNumber(weeklyComparison.synthese?.total_semaine_precedente)}</strong>
                          </div>
                        </div>
                        <div className={`fa-metric-evolution ${getTrendClass(weeklyComparison.synthese?.evolution_globale)}`}>
                          {getTrendIcon(weeklyComparison.synthese?.evolution_globale)}
                          {Math.abs(weeklyComparison.synthese?.evolution_globale || 0).toFixed(1)}%
                        </div>
                      </div>
                      <div className="fa-comparison-metric">
                        <div className="fa-metric-label">Meilleur jour</div>
                        <div className="fa-metric-value">{weeklyComparison.synthese?.meilleur_jour}</div>
                        <div className="fa-metric-subtitle">
                          {weeklyComparison.comparaison_journaliere?.find(j => j.jour === weeklyComparison.synthese?.meilleur_jour)?.reservations?.courant || 0} réservations
                        </div>
                      </div>
                      <div className="fa-comparison-metric">
                        <div className="fa-metric-label">Jours en hausse</div>
                        <div className="fa-metric-value">{weeklyComparison.synthese?.jours_en_hausse || 0}/7</div>
                        <div className={`fa-metric-subtitle ${(weeklyComparison.synthese?.jours_en_hausse || 0) >= 4 ? 'fa-positive' : 'fa-negative'}`}>
                          {(weeklyComparison.synthese?.jours_en_hausse || 0) >= 4 ? 'Tendance positive' : 'Tendance mitigée'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Analyse horaire */}
          {activeTab === 'analyse-horaire' && hourlyData && (
            <div className="fa-tab-content">
              <div className="fa-chart-card">
                <div className="fa-card-header">
                  <h3><Clock size={20} /> Distribution horaire des réservations</h3>
                  <div className="fa-info-badge">
                    <Activity size={12} />
                    {hourlyData.periode}
                  </div>
                </div>
                <div className="fa-chart-container">
                  <div className="fa-metrics-grid" style={{ marginBottom: 24 }}>
                    <div className="fa-metric-card">
                      <div className="fa-metric-icon"><Zap size={24} /></div>
                      <div className="fa-metric-info">
                        <div className="fa-metric-title">Heure de pointe</div>
                        <div className="fa-metric-value">{hourlyData.analyses?.meilleur_creneau?.heure}h</div>
                        <div className="fa-metric-subtitle">{hourlyData.analyses?.meilleur_creneau?.reservations} réservations</div>
                      </div>
                    </div>
                    <div className="fa-metric-card">
                      <div className="fa-metric-icon"><Moon size={24} /></div>
                      <div className="fa-metric-info">
                        <div className="fa-metric-title">Heures creuses</div>
                        <div className="fa-metric-value">{hourlyData.analyses?.heures_creuses?.length || 0}</div>
                        <div className="fa-metric-subtitle">{hourlyData.analyses?.heures_creuses?.join(', ') || 'Aucune'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="fa-table-container">
                    <table className="fa-data-table">
                      <thead>
                        <tr><th>Heure</th><th>Réservations</th><th>Clients uniques</th><th>Taux annulation</th><th>Durée moyenne</th></tr>
                      </thead>
                      <tbody>
                        {hourlyData.distribution_horaire?.map((h) => (
                          <tr key={h.heure}>
                            <td><strong>{h.heure}:00 - {h.heure + 1}:00</strong></td>
                            <td>{formatNumber(h.reservations)}</td>
                            <td>{formatNumber(h.clients_uniques)}</td>
                            <td>
                              <div className="fa-progress-cell">
                                <span className={parseFloat(h.taux_annulation) > 10 ? 'fa-negative' : 'fa-positive'}>
                                  {h.taux_annulation}%
                                </span>
                                <div className="fa-progress-bar">
                                  <div className="fa-progress-fill" style={{ width: `${Math.min(100, parseFloat(h.taux_annulation) * 2)}%`, background: '#FF5252' }}></div>
                                </div>
                              </div>
                            </td>
                            <td>{h.duree_moyenne?.toFixed(1)}h</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="fa-retention-summary" style={{ marginTop: 20 }}>
                    {hourlyData.analyses?.recommandations?.map((rec, i) => (
                      <div key={i} className="fa-summary-item">
                        <div className="fa-summary-icon"><ThumbsUp size={20} /></div>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Types de terrain */}
          {activeTab === 'type-terrain' && typeTerrainData && (
            <div className="fa-tab-content">
              <div className="fa-chart-card">
                <div className="fa-card-header">
                  <h3><Target size={20} /> Performance par type de terrain</h3>
                  <div className="fa-info-badge">
                    <Calendar size={12} />
                    {typeTerrainData.periode}
                  </div>
                </div>
                <div className="fa-table-container">
                  <table className="fa-data-table">
                    <thead>
                      <tr>
                        <th>Type de terrain</th>
                        <th>Réservations</th>
                        <th>Clients uniques</th>
                        <th>Résas/terrain</th>
                        <th>Taux rotation</th>
                        <th>Taux annulation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {typeTerrainData.types_terrain?.map((type, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="fa-type-badge">{type.type_terrain}</div>
                          </td>
                          <td><strong>{formatNumber(type.reservations)}</strong></td>
                          <td>{formatNumber(type.clients_uniques)}</td>
                          <td>{type.reservations_par_terrain}</td>
                          <td>
                            <div className="fa-progress-cell">
                              <span>{type.taux_rotation}/jour</span>
                              <div className="fa-progress-bar">
                                <div className="fa-progress-fill" style={{ width: `${Math.min(100, parseFloat(type.taux_rotation) * 20)}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className={parseFloat(type.taux_annulation) > 10 ? 'fa-negative' : 'fa-positive'}>
                            {type.taux_annulation}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="fa-retention-summary" style={{ marginTop: 20 }}>
                  <div className="fa-summary-item">
                    <Crown size={20} className="fa-summary-icon" />
                    <span>Type le plus populaire: <strong>{typeTerrainData.resume?.type_plus_populaire}</strong></span>
                  </div>
                  <div className="fa-summary-item">
                    <Zap size={20} className="fa-summary-icon" />
                    <span>Meilleur taux de rotation: <strong>{typeTerrainData.resume?.type_meilleur_taux_rotation}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Évolution mensuelle */}
          {activeTab === 'evolution' && monthlyData && (
            <div className="fa-tab-content">
              <div className="fa-chart-card">
                <div className="fa-card-header">
                  <h3><LineChart size={20} /> Évolution mensuelle des réservations</h3>
                  <div className={`fa-trend-badge ${monthlyData.indicateurs?.tendance_globale?.toLowerCase().replace(/ /g, '-')}`}>
                    {monthlyData.indicateurs?.tendance_globale}
                  </div>
                </div>

                <div className="fa-metrics-grid" style={{ marginBottom: 24 }}>
                  <div className="fa-metric-card">
                    <div className="fa-metric-icon"><Award size={24} /></div>
                    <div className="fa-metric-info">
                      <div className="fa-metric-title">TCAC annuel</div>
                      <div className="fa-metric-value">{monthlyData.indicateurs?.tcac_annuel}%</div>
                      <div className="fa-metric-subtitle">Taux de croissance</div>
                    </div>
                  </div>
                  <div className="fa-metric-card">
                    <div className="fa-metric-icon"><Flame size={24} /></div>
                    <div className="fa-metric-info">
                      <div className="fa-metric-title">Mois record</div>
                      <div className="fa-metric-value">{formatNumber(monthlyData.indicateurs?.mois_record?.reservations)}</div>
                      <div className="fa-metric-subtitle">{monthlyData.indicateurs?.mois_record?.mois}</div>
                    </div>
                  </div>
                  <div className="fa-metric-card">
                    <div className="fa-metric-icon"><Cloud size={24} /></div>
                    <div className="fa-metric-info">
                      <div className="fa-metric-title">Moyenne mensuelle</div>
                      <div className="fa-metric-value">{formatNumber(Math.round(monthlyData.indicateurs?.moyenne_mensuelle))}</div>
                      <div className="fa-metric-subtitle">réservations/mois</div>
                    </div>
                  </div>
                </div>

                <div className="fa-table-container">
                  <table className="fa-data-table">
                    <thead>
                      <tr>
                        <th>Mois</th>
                        <th>Réservations</th>
                        <th>Nouveaux clients</th>
                        <th>Clients fidèles</th>
                        <th>Évolution</th>
                        <th>Saison</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.donnees?.map((mois, idx) => (
                        <tr key={idx}>
                          <td><strong>{new Date(mois.mois).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</strong></td>
                          <td>{formatNumber(mois.reservations)}</td>
                          <td>{formatNumber(mois.nouveaux_clients)}</td>
                          <td>{formatNumber(mois.clients_fideles)}</td>
                          <td className={getTrendClass(mois.evolution)}>
                            {getTrendIcon(mois.evolution)} {Math.abs(mois.evolution).toFixed(1)}%
                          </td>
                          <td>
                            <div className="fa-type-badge">{mois.saison}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Clients */}
          {activeTab === 'clients' && clientsData && (
            <div className="fa-tab-content">
              <div className="fa-chart-card">
                <div className="fa-card-header">
                  <h3><Users size={20} /> Analyse des clients</h3>
                  <div className="fa-info-badge">
                    <Users size={12} />
                    {clientsData.periode}
                  </div>
                </div>

                <div className="fa-metrics-grid" style={{ marginBottom: 24 }}>
                  <div className="fa-metric-card">
                    <div className="fa-metric-icon"><UserCheck size={24} /></div>
                    <div className="fa-metric-info">
                      <div className="fa-metric-title">Clients actifs</div>
                      <div className="fa-metric-value">{formatNumber(clientsData.alertes?.clients_actifs)}</div>
                    </div>
                  </div>
                  <div className="fa-metric-card">
                    <div className="fa-metric-icon"><UserX size={24} /></div>
                    <div className="fa-metric-info">
                      <div className="fa-metric-title">Clients à risque</div>
                      <div className="fa-metric-value">{formatNumber(clientsData.alertes?.clients_a_risque)}</div>
                    </div>
                  </div>
                </div>

                <div className="fa-table-container">
                  <table className="fa-data-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Réservations</th>
                        <th>Fréquence/mois</th>
                        <th>Ancienneté</th>
                        <th>Inactif depuis</th>
                        <th>Profil</th>
                        <th>Taux annul.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientsData.clients_analyses?.slice(0, 15).map((client, idx) => (
                        <tr key={idx}>
                          <td>{client.email}</td>
                          <td><strong>{client.nb_reservations}</strong></td>
                          <td>{client.frequence_mensuelle}/mois</td>
                          <td>{client.anciennete_jours}j</td>
                          <td className={client.jours_depuis_derniere_resa > 30 ? 'fa-negative' : ''}>
                            {client.jours_depuis_derniere_resa}j
                          </td>
                          <td>
                            <div className={`fa-client-badge ${client.profil?.toLowerCase().replace(/ /g, '-')}`}>
                              {client.profil}
                            </div>
                          </td>
                          <td className={parseFloat(client.taux_annulation) > 15 ? 'fa-negative' : ''}>
                            {client.taux_annulation}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {clientsData.alertes?.recommandations?.length > 0 && (
                  <div className="fa-retention-summary" style={{ marginTop: 20 }}>
                    {clientsData.alertes.recommandations.map((rec, i) => (
                      <div key={i} className="fa-summary-item">
                        <AlertCircle size={20} className="fa-summary-icon" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Prévisions */}
          {activeTab === 'previsions' && forecastData && (
            <div className="fa-tab-content">
              <div className="fa-chart-card">
                <div className="fa-card-header">
                  <h3><Activity size={20} /> Prévisions des réservations</h3>
                  <div className="fa-info-badge">
                    Basé sur tendance linéaire
                  </div>
                </div>

                <div className="fa-metrics-grid" style={{ marginBottom: 24 }}>
                  <div className="fa-metric-card">
                    <div className="fa-metric-icon"><TrendingUp size={24} /></div>
                    <div className="fa-metric-info">
                      <div className="fa-metric-title">Tendance mensuelle</div>
                      <div className="fa-metric-value">{forecastData.analyse_tendance?.pente_mensuelle}/mois</div>
                    </div>
                  </div>
                  <div className="fa-metric-card">
                    <div className="fa-metric-icon"><Shield size={24} /></div>
                    <div className="fa-metric-info">
                      <div className="fa-metric-title">Confiance</div>
                      <div className="fa-metric-value">{forecastData.previsions?.[0]?.confiance || 'FAIBLE'}</div>
                    </div>
                  </div>
                </div>

                <div className="fa-table-container">
                  <table className="fa-data-table">
                    <thead>
                      <tr>
                        <th>Mois</th>
                        <th>Réservations prévues</th>
                        <th>Croissance estimée</th>
                        <th>Niveau confiance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecastData.previsions?.map((prev, idx) => (
                        <tr key={idx}>
                          <td><strong>{new Date(prev.mois + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</strong></td>
                          <td>{formatNumber(prev.reservations_prevues)}</td>
                          <td className={getTrendClass(parseFloat(prev.croissance_estimee))}>
                            {getTrendIcon(parseFloat(prev.croissance_estimee))} {Math.abs(parseFloat(prev.croissance_estimee)).toFixed(1)}%
                          </td>
                          <td>
                            <div className={`fa-client-badge ${prev.confiance?.toLowerCase()}`}>
                              {prev.confiance}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="fa-retention-summary" style={{ marginTop: 20 }}>
                  <div className="fa-summary-item">
                    <CheckCircle size={20} className="fa-summary-icon" />
                    <span>Recommandation: <strong>{forecastData.analyse_tendance?.recommandations}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="fa-chart-card" style={{ background: 'rgba(255,82,82,0.1)', borderColor: '#FF5252' }}>
              <div className="fa-card-header">
                <AlertCircle size={20} color="#FF5252" />
                <h3>Erreur</h3>
              </div>
              <p>{error}</p>
              <button className="fa-btn-refresh" onClick={fetchData}>Réessayer</button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ReservationDashboard;