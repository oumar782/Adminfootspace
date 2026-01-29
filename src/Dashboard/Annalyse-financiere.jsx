import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
  DollarSign, Calendar, ShoppingCart, Users, TrendingUp, Trophy,
  RefreshCw, Clock, Target, Award, AlertCircle, CheckCircle,
  BarChart3, PieChart as PieChartIcon, Activity, Zap,
  UserCheck, UserPlus, UserX, Star, ThumbsUp, ArrowUpRight,
  ArrowDownRight, Minus, ChevronRight, Download, Filter,
  Search, Settings, Bell, Menu, X as CloseIcon
} from 'lucide-react';
import './analyse.css';

const API_BASE = 'https://backend-foot-omega.vercel.app/api/annalyse';

const FootballAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({
    executif: null,
    mensuelle: null,
    terrains: null,
    cohortes: null,
    hebdomadaire: null,
    creneaux: null,
    tendances: null,
    portefeuille: null
  });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(() => {
      loadAllData();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        executif, mensuelle, terrains, cohortes, 
        hebdomadaire, creneaux, tendances, portefeuille
      ] = await Promise.all([
        fetch(`${API_BASE}/tableau-bord-executif`).then(r => r.json()),
        fetch(`${API_BASE}/analyse-mensuelle`).then(r => r.json()),
        fetch(`${API_BASE}/analyse-par-terrain`).then(r => r.json()),
        fetch(`${API_BASE}/analyse-cohortes`).then(r => r.json()),
        fetch(`${API_BASE}/analyse-hebdomadaire`).then(r => r.json()),
        fetch(`${API_BASE}/analyse-creneaux`).then(r => r.json()),
        fetch(`${API_BASE}/analyse-tendances`).then(r => r.json()),
        fetch(`${API_BASE}/analyse-qualite-portefeuille`).then(r => r.json())
      ]);

      setData({
        executif: executif.success ? executif : null,
        mensuelle: mensuelle.success ? mensuelle : null,
        terrains: terrains.success ? terrains : null,
        cohortes: cohortes.success ? cohortes : null,
        hebdomadaire: hebdomadaire.success ? hebdomadaire : null,
        creneaux: creneaux.success ? creneaux : null,
        tendances: tendances.success ? tendances : null,
        portefeuille: portefeuille.success ? portefeuille : null
      });
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('fr-MA').format(value || 0);
  };

  const CHART_COLORS = ['#00C853', '#69F0AE', '#00E676', '#76FF03', '#C6FF00', '#AEEA00', '#64DD17'];

  if (loading) {
    return (
      <div className="fa-dashboard-loader">
        <div className="fa-dashboard-loader-spinner">
          <div className="fa-dashboard-loader-dot"></div>
          <div className="fa-dashboard-loader-dot"></div>
          <div className="fa-dashboard-loader-dot"></div>
        </div>
        <p className="fa-dashboard-loader-text">Chargement des données analytiques...</p>
      </div>
    );
  }

  return (
    <div className="fa-dashboard-container" ref={containerRef}>
      <header className="fa-dashboard-header">
        <div className="fa-dashboard-header-content">
          <div className="fa-dashboard-logo-section">
            <div className="fa-dashboard-logo-icon">
              <Activity size={32} strokeWidth={2.5} />
              <div className="fa-dashboard-logo-pulse"></div>
            </div>
            <div className="fa-dashboard-logo-text">
              <h1>Football Analytics Pro</h1>
              <p className="fa-dashboard-subtitle">Tableau de Bord Investisseur Premium</p>
            </div>
          </div>
          <div className="fa-dashboard-header-actions">
            <button 
              className="fa-dashboard-btn-refresh" 
              onClick={loadAllData}
              title="Actualiser les données"
            >
              <RefreshCw size={18} />
              <span className="fa-dashboard-refresh-text">Actualiser</span>
              {lastUpdate && (
                <span className="fa-dashboard-last-update">
                  Dernière mise à jour : {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </button>
            <div className="fa-dashboard-header-time">
              <Calendar size={18} />
              <span className="fa-dashboard-time-text">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <button 
              className="fa-dashboard-btn-mobile-menu" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu mobile"
            >
              {mobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <nav className={`fa-dashboard-nav ${mobileMenuOpen ? 'fa-dashboard-mobile-open' : ''}`}>
        <div className="fa-dashboard-nav-track">
          <div 
            className="fa-dashboard-nav-indicator" 
            style={{
              left: `${['overview', 'performance', 'clients', 'terrains'].indexOf(activeTab) * 25}%`
            }}
          />
          <button 
            className={`fa-dashboard-nav-tab ${activeTab === 'overview' ? 'fa-dashboard-nav-tab-active' : ''}`}
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
          >
            <BarChart3 size={20} />
            <span>Vue d'ensemble</span>
          </button>
          <button 
            className={`fa-dashboard-nav-tab ${activeTab === 'performance' ? 'fa-dashboard-nav-tab-active' : ''}`}
            onClick={() => { setActiveTab('performance'); setMobileMenuOpen(false); }}
          >
            <TrendingUp size={20} />
            <span>Performance</span>
          </button>
          <button 
            className={`fa-dashboard-nav-tab ${activeTab === 'clients' ? 'fa-dashboard-nav-tab-active' : ''}`}
            onClick={() => { setActiveTab('clients'); setMobileMenuOpen(false); }}
          >
            <Users size={20} />
            <span>Clients</span>
          </button>
          <button 
            className={`fa-dashboard-nav-tab ${activeTab === 'terrains' ? 'fa-dashboard-nav-tab-active' : ''}`}
            onClick={() => { setActiveTab('terrains'); setMobileMenuOpen(false); }}
          >
            <Target size={20} />
            <span>Terrains</span>
          </button>
        </div>
      </nav>

      <main className="fa-dashboard-main">
        <div className="fa-dashboard-tab-content">
          {activeTab === 'overview' && (
            <OverviewTab 
              data={data} 
              formatCurrency={formatCurrency} 
              formatNumber={formatNumber}
              colors={CHART_COLORS}
            />
          )}
          {activeTab === 'performance' && (
            <PerformanceTab 
              data={data} 
              formatCurrency={formatCurrency} 
              formatNumber={formatNumber}
              colors={CHART_COLORS}
            />
          )}
          {activeTab === 'clients' && (
            <ClientsTab 
              data={data} 
              formatCurrency={formatCurrency} 
              formatNumber={formatNumber}
              colors={CHART_COLORS}
            />
          )}
          {activeTab === 'terrains' && (
            <TerrainsTab 
              data={data} 
              formatCurrency={formatCurrency} 
              formatNumber={formatNumber}
              colors={CHART_COLORS}
            />
          )}
        </div>
      </main>
    </div>
  );
};

const OverviewTab = ({ data, formatCurrency, formatNumber, colors }) => {
  const kpi = data.executif?.kpi_principaux || {};
  const croissance = data.executif?.croissance || {};
  const tendances = data.tendances?.tendances || {};

  return (
    <>
      <div className="fa-dashboard-kpi-grid">
        <KPICard
          title="Chiffre d'Affaires"
          value={formatCurrency(kpi.ca_30j)}
          subtitle="30 derniers jours"
          trend={croissance.evolution_percentage}
          icon={<DollarSign size={32} />}
          color="primary"
          delay={0}
        />
        <KPICard
          title="Réservations"
          value={formatNumber(kpi.reservations_30j)}
          subtitle="30 derniers jours"
          icon={<Calendar size={32} />}
          color="secondary"
          delay={100}
        />
        <KPICard
          title="Panier Moyen"
          value={formatCurrency(kpi.panier_moyen)}
          subtitle="Par réservation"
          icon={<ShoppingCart size={32} />}
          color="info"
          delay={200}
        />
        <KPICard
          title="Clients Uniques"
          value={formatNumber(kpi.clients_uniques)}
          subtitle="Clients actifs"
          icon={<Users size={32} />}
          color="success"
          delay={300}
        />
      </div>

      <div className="fa-dashboard-insight-section">
        <div className="fa-dashboard-insight-card fa-dashboard-status-card">
          <div className="fa-dashboard-card-header">
            <h3><Activity size={20} /> Statut de Croissance</h3>
          </div>
          <div className="fa-dashboard-status-content">
            <div className={`fa-dashboard-status-badge fa-dashboard-${croissance.tendance?.toLowerCase().replace(' ', '-')}`}>
              <div className="fa-dashboard-status-badge-pulse"></div>
              {croissance.tendance || 'STABLE'}
            </div>
            <div className="fa-dashboard-status-details">
              <div className="fa-dashboard-status-item">
                <span className="fa-dashboard-label">Mois en cours</span>
                <span className="fa-dashboard-value">{formatCurrency(croissance.mois_courant)}</span>
              </div>
              <div className="fa-dashboard-status-item">
                <span className="fa-dashboard-label">Mois précédent</span>
                <span className="fa-dashboard-value">{formatCurrency(croissance.mois_precedent)}</span>
              </div>
              <div className="fa-dashboard-status-item">
                <span className="fa-dashboard-label">Évolution</span>
                <span className={`fa-dashboard-value ${croissance.evolution_percentage >= 0 ? 'fa-dashboard-positive' : 'fa-dashboard-negative'}`}>
                  {croissance.evolution_percentage >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(croissance.evolution_percentage || 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="fa-dashboard-insight-card">
          <div className="fa-dashboard-card-header">
            <h3><Trophy size={20} /> Top 5 Terrains</h3>
          </div>
          <div className="fa-dashboard-top-list">
            {data.executif?.top_terrains?.slice(0, 5).map((terrain, idx) => (
              <div key={idx} className="fa-dashboard-top-item">
                <span className="fa-dashboard-rank">{idx + 1}</span>
                <div className="fa-dashboard-top-item-content">
                  <span className="fa-dashboard-name">{terrain.terrain}</span>
                  <span className="fa-dashboard-metric">{formatCurrency(terrain.ca)}</span>
                </div>
                <div className="fa-dashboard-progress">
                  <div 
                    className="fa-dashboard-progress-fill" 
                    style={{ 
                      width: `${(terrain.ca / (data.executif?.top_terrains?.[0]?.ca || 1)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {tendances.journaliere && (
        <div className="fa-dashboard-chart-card">
          <div className="fa-dashboard-card-header">
            <h3><Activity size={20} /> Tendances Journalières</h3>
            <span className={`fa-dashboard-trend-badge fa-dashboard-${tendances.journaliere.interpretation?.toLowerCase()}`}>
              {tendances.journaliere.evolution >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {tendances.journaliere.interpretation}
            </span>
          </div>
          <div className="fa-dashboard-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={tendances.journaliere.donnees}>
                <defs>
                  <linearGradient id="fa-dashboard-colorCA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C853" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00C853" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 200, 83, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR')}
                  contentStyle={{ 
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 200, 83, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 200, 83, 0.15)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="ca" 
                  stroke="#00C853" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#fa-dashboard-colorCA)" 
                  name="Chiffre d'Affaires"
                  dot={{ stroke: '#00C853', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {data.mensuelle && (
        <div className="fa-dashboard-chart-card">
          <div className="fa-dashboard-card-header">
            <h3><BarChart3 size={20} /> Évolution Mensuelle</h3>
            <span className="fa-dashboard-trend-badge">{data.mensuelle.resume?.tendance}</span>
          </div>
          <div className="fa-dashboard-chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.mensuelle.donnees}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 200, 83, 0.1)" />
                <XAxis dataKey="periode" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 200, 83, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 200, 83, 0.15)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="ca" 
                  fill="#00C853" 
                  name="Chiffre d'Affaires" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="reservations" 
                  fill="#69F0AE" 
                  name="Réservations" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

const PerformanceTab = ({ data, formatCurrency, formatNumber, colors }) => {
  const hebdo = data.hebdomadaire?.comparaison || {};
  const creneaux = data.creneaux?.creneaux || [];
  const tendances = data.tendances?.tendances || {};

  return (
    <>
      <div className="fa-dashboard-comparison-grid">
        <div className="fa-dashboard-comparison-card">
          <div className="fa-dashboard-comparison-header">
            <h3><Calendar size={20} /> Semaine Courante vs Précédente</h3>
          </div>
          <div className="fa-dashboard-comparison-metrics">
            <ComparisonMetric
              label="Réservations"
              current={hebdo.reservations?.courant}
              previous={hebdo.reservations?.precedent}
              evolution={hebdo.reservations?.evolution}
              formatter={formatNumber}
            />
            <ComparisonMetric
              label="Chiffre d'Affaires"
              current={hebdo.chiffre_affaires?.courant}
              previous={hebdo.chiffre_affaires?.precedent}
              evolution={hebdo.chiffre_affaires?.evolution}
              formatter={formatCurrency}
            />
            <ComparisonMetric
              label="Panier Moyen"
              current={hebdo.panier_moyen?.courant}
              previous={hebdo.panier_moyen?.precedent}
              evolution={hebdo.panier_moyen?.evolution}
              formatter={formatCurrency}
            />
          </div>
        </div>
      </div>

      {creneaux.length > 0 && (
        <div className="fa-dashboard-chart-card">
          <div className="fa-dashboard-card-header">
            <h3><Clock size={20} /> Performance par Créneau Horaire</h3>
            <span className="fa-dashboard-info-badge"><Calendar size={14} /> 30 derniers jours</span>
          </div>
          <div className="fa-dashboard-chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={creneaux}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 200, 83, 0.1)" />
                <XAxis dataKey="heure" stroke="#666" tickFormatter={(h) => `${h}h`} />
                <YAxis yAxisId="left" stroke="#00C853" />
                <YAxis yAxisId="right" orientation="right" stroke="#69F0AE" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'CA') return formatCurrency(value);
                    return formatNumber(value);
                  }}
                  labelFormatter={(h) => `${h}h00`}
                  contentStyle={{ 
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 200, 83, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 200, 83, 0.15)'
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="ca" 
                  fill="#00C853" 
                  name="Chiffre d'Affaires" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="reservations" 
                  fill="#69F0AE" 
                  name="Réservations" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tendances.hebdomadaire && (
        <div className="fa-dashboard-chart-card">
          <div className="fa-dashboard-card-header">
            <h3><TrendingUp size={20} /> Tendances Hebdomadaires</h3>
            <span className={`fa-dashboard-trend-badge fa-dashboard-${tendances.hebdomadaire.interpretation?.toLowerCase()}`}>
              {tendances.hebdomadaire.interpretation}
            </span>
          </div>
          <div className="fa-dashboard-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tendances.hebdomadaire.donnees}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 200, 83, 0.1)" />
                <XAxis 
                  dataKey="semaine" 
                  stroke="#666"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR')}
                  contentStyle={{ 
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 200, 83, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 200, 83, 0.15)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ca" 
                  stroke="#00C853" 
                  strokeWidth={3}
                  dot={{ fill: '#00C853', r: 5, strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#00C853', stroke: '#fff', strokeWidth: 2 }}
                  name="Chiffre d'Affaires"
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="reservations" 
                  stroke="#69F0AE" 
                  strokeWidth={2}
                  dot={{ fill: '#69F0AE', r: 4 }}
                  name="Réservations"
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="fa-dashboard-metrics-grid">
        {data.creneaux?.analyse && (
          <>
            <MetricCard
              icon={<Star size={28} />}
              title="Meilleur Créneau (CA)"
              value={`${data.creneaux.analyse.meilleur_creneau_ca?.heure}h`}
              subtitle={formatCurrency(data.creneaux.analyse.meilleur_creneau_ca?.ca)}
              color="primary"
            />
            <MetricCard
              icon={<Activity size={28} />}
              title="Meilleur Créneau (Volume)"
              value={`${data.creneaux.analyse.meilleur_creneau_reservations?.heure}h`}
              subtitle={`${data.creneaux.analyse.meilleur_creneau_reservations?.reservations} réservations`}
              color="secondary"
            />
          </>
        )}
      </div>
    </>
  );
};

const ClientsTab = ({ data, formatCurrency, formatNumber, colors }) => {
  const portefeuille = data.portefeuille?.data || {};
  const cohortes = data.cohortes?.data || {};

  const distributionData = portefeuille.distribution_categories ? 
    Object.entries(portefeuille.distribution_categories).map(([key, value]) => ({
      name: key,
      clients: value.count,
      ca: value.ca_total,
      part_ca: parseFloat(value.part_ca)
    })) : [];

  return (
    <>
      <div className="fa-dashboard-kpi-grid">
        <KPICard
          title="Clients Totaux"
          value={formatNumber(portefeuille.indicateurs?.nombre_clients_total)}
          icon={<Users size={32} />}
          color="primary"
        />
        <KPICard
          title="CA Total Portefeuille"
          value={formatCurrency(portefeuille.indicateurs?.ca_total_portefeuille)}
          icon={<DollarSign size={32} />}
          color="success"
        />
        <KPICard
          title="Concentration Top 10"
          value={`${portefeuille.indicateurs?.concentration_top10 || 0}%`}
          icon={<Target size={32} />}
          color="warning"
        />
        <KPICard
          title="Taux Clients Actifs"
          value={`${(portefeuille.indicateurs?.taux_clients_actifs || 0).toFixed(1)}%`}
          icon={<UserCheck size={32} />}
          color="info"
        />
      </div>

      {distributionData.length > 0 && (
        <div className="fa-dashboard-chart-row">
          <div className="fa-dashboard-chart-card fa-dashboard-chart-card-half">
            <div className="fa-dashboard-card-header">
              <h3><PieChartIcon size={20} /> Distribution Clients par Catégorie</h3>
            </div>
            <div className="fa-dashboard-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    dataKey="clients"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    label={(entry) => `${entry.name}: ${entry.clients}`}
                    animationDuration={1500}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colors[index % colors.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatNumber(value)}
                    contentStyle={{ 
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 200, 83, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 200, 83, 0.15)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="fa-dashboard-chart-card fa-dashboard-chart-card-half">
            <div className="fa-dashboard-card-header">
              <h3><DollarSign size={20} /> Part du CA par Catégorie</h3>
            </div>
            <div className="fa-dashboard-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distributionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 200, 83, 0.1)" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="name" type="category" stroke="#666" width={100} />
                  <Tooltip 
                    formatter={(value) => `${value.toFixed(2)}%`}
                    contentStyle={{ 
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 200, 83, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 200, 83, 0.15)'
                    }}
                  />
                  <Bar 
                    dataKey="part_ca" 
                    fill="#00C853" 
                    radius={[0, 8, 8, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {cohortes.cohortes && cohortes.cohortes.length > 0 && (
        <div className="fa-dashboard-chart-card">
          <div className="fa-dashboard-card-header">
            <h3><Activity size={20} /> Analyse de Rétention par Cohorte</h3>
          </div>
          <div className="fa-dashboard-retention-table">
            <table>
              <thead>
                <tr>
                  <th>Cohorte</th>
                  <th>Taille</th>
                  <th>Mois 1</th>
                  <th>Mois 2</th>
                  <th>Mois 3</th>
                </tr>
              </thead>
              <tbody>
                {cohortes.cohortes.slice(0, 6).map((cohorte, idx) => (
                  <tr key={idx}>
                    <td>{new Date(cohorte.cohorte_mois).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</td>
                    <td><strong>{cohorte.taille}</strong></td>
                    <td>
                      <div className="fa-dashboard-retention-cell">
                        <span className="fa-dashboard-retention-value">{cohorte.retention.mois_1}%</span>
                        <div className="fa-dashboard-retention-bar" style={{ width: `${cohorte.retention.mois_1}%` }}></div>
                      </div>
                    </td>
                    <td>
                      <div className="fa-dashboard-retention-cell">
                        <span className="fa-dashboard-retention-value">{cohorte.retention.mois_2}%</span>
                        <div className="fa-dashboard-retention-bar" style={{ width: `${cohorte.retention.mois_2}%` }}></div>
                      </div>
                    </td>
                    <td>
                      <div className="fa-dashboard-retention-cell">
                        <span className="fa-dashboard-retention-value">{cohorte.retention.mois_3}%</span>
                        <div className="fa-dashboard-retention-bar" style={{ width: `${cohorte.retention.mois_3}%` }}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cohortes.indicateurs && (
            <div className="fa-dashboard-retention-summary">
              <div className="fa-dashboard-summary-item">
                <CheckCircle size={18} className="fa-dashboard-summary-icon" />
                <span className="fa-dashboard-label">Rétention Moyenne Mois 1:</span>
                <span className="fa-dashboard-value">{cohortes.indicateurs.retention_moyenne_mois1}%</span>
              </div>
              <div className="fa-dashboard-summary-item">
                <CheckCircle size={18} className="fa-dashboard-summary-icon" />
                <span className="fa-dashboard-label">Rétention Moyenne Mois 3:</span>
                <span className="fa-dashboard-value">{cohortes.indicateurs.retention_moyenne_mois3}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {portefeuille.clients_detailles && portefeuille.clients_detailles.length > 0 && (
        <div className="fa-dashboard-chart-card">
          <div className="fa-dashboard-card-header">
            <h3><Star size={20} /> Top 10 Clients</h3>
          </div>
          <div className="fa-dashboard-top-clients-list">
            {portefeuille.clients_detailles.slice(0, 10).map((client, idx) => (
              <div key={idx} className="fa-dashboard-client-item">
                <div className="fa-dashboard-client-rank">{idx + 1}</div>
                <div className="fa-dashboard-client-info">
                  <div className="fa-dashboard-client-email">{client.email}</div>
                  <div className="fa-dashboard-client-meta">
                    <span className={`fa-dashboard-client-badge fa-dashboard-${client.categorie.toLowerCase()}`}>
                      {client.categorie}
                    </span>
                    <span>{client.nb_reservations} réservations</span>
                  </div>
                </div>
                <div className="fa-dashboard-client-ca">{formatCurrency(client.ca_total)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const TerrainsTab = ({ data, formatCurrency, formatNumber, colors }) => {
  const terrains = data.terrains?.data || [];
  const resume = data.terrains?.resume || {};

  return (
    <>
      <div className="fa-dashboard-kpi-grid">
        <KPICard
          title="Terrains Actifs"
          value={formatNumber(resume.total_terrains)}
          icon={<Target size={32} />}
          color="primary"
        />
        <KPICard
          title="CA Total"
          value={formatCurrency(resume.total_ca)}
          subtitle="30 derniers jours"
          icon={<DollarSign size={32} />}
          color="success"
        />
        <KPICard
          title="Heures Vendues"
          value={formatNumber(resume.total_heures)}
          subtitle="Heures totales"
          icon={<Clock size={32} />}
          color="info"
        />
        <KPICard
          title="Occupation Moyenne"
          value={`${(resume.moyenne_occupation || 0).toFixed(1)}%`}
          icon={<Activity size={32} />}
          color="warning"
        />
      </div>

      {terrains.length > 0 && (
        <>
          <div className="fa-dashboard-chart-card">
            <div className="fa-dashboard-card-header">
              <h3><DollarSign size={20} /> Chiffre d'Affaires par Terrain</h3>
            </div>
            <div className="fa-dashboard-chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={terrains.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 200, 83, 0.1)" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="nomterrain" type="category" stroke="#666" width={150} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ 
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 200, 83, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 200, 83, 0.15)'
                    }}
                  />
                  <Bar 
                    dataKey="chiffre_affaires" 
                    radius={[0, 8, 8, 0]}
                    animationDuration={1500}
                  >
                    {terrains.slice(0, 10).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colors[index % colors.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="fa-dashboard-chart-card">
            <div className="fa-dashboard-card-header">
              <h3><Activity size={20} /> Taux d'Occupation par Terrain</h3>
            </div>
            <div className="fa-dashboard-chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={terrains.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 200, 83, 0.1)" />
                  <XAxis dataKey="nomterrain" stroke="#666" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value) => `${value.toFixed(2)}%`}
                    contentStyle={{ 
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 200, 83, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 200, 83, 0.15)'
                    }}
                  />
                  <Bar 
                    dataKey="taux_occupation" 
                    fill="#69F0AE" 
                    radius={[8, 8, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="fa-dashboard-chart-card">
            <div className="fa-dashboard-card-header">
              <h3><BarChart3 size={20} /> Détails des Terrains</h3>
            </div>
            <div className="fa-dashboard-table-container">
              <table className="fa-dashboard-data-table">
                <thead>
                  <tr>
                    <th>Terrain</th>
                    <th>Type</th>
                    <th>Réservations</th>
                    <th>CA</th>
                    <th>Tarif Moyen</th>
                    <th>Heures</th>
                    <th>Revenu/Heure</th>
                    <th>Occupation</th>
                  </tr>
                </thead>
                <tbody>
                  {terrains.slice(0, 15).map((terrain, idx) => (
                    <tr key={idx}>
                      <td><strong>{terrain.nomterrain}</strong></td>
                      <td>
                        <span className="fa-dashboard-type-badge">{terrain.typeterrain}</span>
                      </td>
                      <td>{formatNumber(terrain.nombre_reservations)}</td>
                      <td>{formatCurrency(terrain.chiffre_affaires)}</td>
                      <td>{formatCurrency(terrain.tarif_moyen)}</td>
                      <td>{terrain.heures_utilisees.toFixed(1)}h</td>
                      <td>{formatCurrency(terrain.revenu_par_heure)}</td>
                      <td>
                        <div className="fa-dashboard-progress-cell">
                          <span>{terrain.taux_occupation.toFixed(1)}%</span>
                          <div className="fa-dashboard-progress-bar">
                            <div 
                              className="fa-dashboard-progress-fill" 
                              style={{ 
                                width: `${Math.min(terrain.taux_occupation, 100)}%`,
                                backgroundColor: terrain.taux_occupation > 70 ? '#00C853' : 
                                               terrain.taux_occupation > 40 ? '#FFD740' : '#FF5252'
                              }}
                            ></div>
                          </div>
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
    </>
  );
};

const KPICard = ({ title, value, subtitle, trend, icon, color, delay = 0 }) => (
  <div 
    className={`fa-dashboard-kpi-card fa-dashboard-${color}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="fa-dashboard-kpi-icon">{icon}</div>
    <div className="fa-dashboard-kpi-content">
      <div className="fa-dashboard-kpi-title">{title}</div>
      <div className="fa-dashboard-kpi-value">{value}</div>
      {subtitle && <div className="fa-dashboard-kpi-subtitle">{subtitle}</div>}
      {trend !== undefined && (
        <div className={`fa-dashboard-kpi-trend ${trend >= 0 ? 'fa-dashboard-positive' : 'fa-dashboard-negative'}`}>
          {trend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {Math.abs(trend).toFixed(2)}%
        </div>
      )}
    </div>
  </div>
);

const ComparisonMetric = ({ label, current, previous, evolution, formatter }) => (
  <div className="fa-dashboard-comparison-metric">
    <div className="fa-dashboard-metric-label">{label}</div>
    <div className="fa-dashboard-metric-values">
      <div className="fa-dashboard-metric-current">
        <span className="fa-dashboard-label">Actuel</span>
        <span className="fa-dashboard-value">{formatter(current)}</span>
      </div>
      <div className="fa-dashboard-metric-arrow">
        {evolution >= 0 ? '→' : '↓'}
      </div>
      <div className="fa-dashboard-metric-previous">
        <span className="fa-dashboard-label">Précédent</span>
        <span className="fa-dashboard-value">{formatter(previous)}</span>
      </div>
    </div>
    {evolution !== undefined && (
      <div className={`fa-dashboard-metric-evolution ${evolution >= 0 ? 'fa-dashboard-positive' : 'fa-dashboard-negative'}`}>
        {evolution >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(evolution).toFixed(2)}%
      </div>
    )}
  </div>
);

const MetricCard = ({ icon, title, value, subtitle, color }) => (
  <div className={`fa-dashboard-metric-card fa-dashboard-${color}`}>
    <div className="fa-dashboard-metric-icon">{icon}</div>
    <div className="fa-dashboard-metric-info">
      <div className="fa-dashboard-metric-title">{title}</div>
      <div className="fa-dashboard-metric-value">{value}</div>
      {subtitle && <div className="fa-dashboard-metric-subtitle">{subtitle}</div>}
    </div>
  </div>
);

export default FootballAnalyticsDashboard;