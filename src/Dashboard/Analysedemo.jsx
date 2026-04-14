import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Activity, Clock, CheckCircle, XCircle,
  Building2, Target, Zap, AlertTriangle, BarChart3, LineChart,
  PieChart, Users, Award, Bell, ChevronRight, Download, RefreshCw,
  CalendarDays, Flame, Gauge, Briefcase, Timer, Star, Crown,
  Loader2, Filter, ChevronLeft, HelpCircle, Info, ThumbsUp, Minus,
  ArrowUp, ArrowDown, Eye, Calendar, User, Mail, Phone, MapPin
} from 'lucide-react';
import './demo.css';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [entreprises, setEntreprises] = useState([]);
  const [terrains, setTerrains] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [evolution, setEvolution] = useState(null);
  const [leadScoring, setLeadScoring] = useState(null);
  const [delais, setDelais] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const API_URL = 'https://backend-foot-omega.vercel.app/api/ana-demo';

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        entreprisesRes,
        terrainsRes,
        funnelRes,
        evolutionRes,
        scoringRes,
        delaisRes,
        dashboardRes
      ] = await Promise.all([
        fetch(`${API_URL}/analytics/stats`),
        fetch(`${API_URL}/analytics/demandes-par-entreprise`),
        fetch(`${API_URL}/analytics/demandes-par-terrains`),
        fetch(`${API_URL}/analytics/funnel`),
        fetch(`${API_URL}/analytics/evolution`),
        fetch(`${API_URL}/analytics/lead-scoring`),
        fetch(`${API_URL}/analytics/delais-traitement`),
        fetch(`${API_URL}/analytics/dashboard`)
      ]);

      const statsData = await statsRes.json();
      const entreprisesData = await entreprisesRes.json();
      const terrainsData = await terrainsRes.json();
      const funnelData = await funnelRes.json();
      const evolutionData = await evolutionRes.json();
      const scoringData = await scoringRes.json();
      const delaisData = await delaisRes.json();
      const dashboardData = await dashboardRes.json();

      if (statsData.success) setStats(statsData.data);
      if (entreprisesData.success) setEntreprises(entreprisesData.data);
      if (terrainsData.success) setTerrains(terrainsData.data);
      if (funnelData.success) setFunnel(funnelData.data);
      if (evolutionData.success) setEvolution(evolutionData.data);
      if (scoringData.success) setLeadScoring(scoringData.data);
      if (delaisData.success) setDelais(delaisData.data);
      if (dashboardData.success) setDashboard(dashboardData.data);
    } catch (error) {
      console.error('Error:', error);
      showToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getEvolutionIcon = (value) => {
    if (value > 0) return <ArrowUp size={14} className="evolution-up" />;
    if (value < 0) return <ArrowDown size={14} className="evolution-down" />;
    return <Minus size={14} className="evolution-stable" />;
  };

  // Histogramme pour les entreprises
  const EntreprisesChart = () => {
    const maxDemandes = Math.max(...entreprises.map(e => e.nb_demandes), 1);
    return (
      <div className="chart-container">
        <h3 className="chart-title">
          <Building2 size={18} />
          Top entreprises par nombre de demandes
        </h3>
        <div className="bar-chart">
          {entreprises.slice(0, 8).map((item, idx) => (
            <div key={idx} className="bar-item">
              <div className="bar-label">{item.entreprise}</div>
              <div className="bar-wrapper">
                <div 
                  className="bar-fill"
                  style={{ width: `${(item.nb_demandes / maxDemandes) * 100}%` }}
                >
                  <span className="bar-value">{item.nb_demandes}</span>
                </div>
              </div>
              <div className="bar-percent">{item.taux_conversion}%</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Histogramme pour les terrains
  const TerrainsChart = () => {
    if (!terrains?.par_categorie) return null;
    const maxValue = Math.max(...terrains.par_categorie.map(c => c.nb_demandes), 1);
    return (
      <div className="chart-container">
        <h3 className="chart-title">
          <Target size={18} />
          Répartition par taille de projet
        </h3>
        <div className="bar-chart-horizontal">
          {terrains.par_categorie.map((item, idx) => (
            <div key={idx} className="horizontal-bar-item">
              <div className="horizontal-bar-label">{item.categorie}</div>
              <div className="horizontal-bar-wrapper">
                <div 
                  className="horizontal-bar-fill"
                  style={{ width: `${(item.nb_demandes / maxValue) * 100}%` }}
                >
                  <span className="horizontal-bar-value">{item.nb_demandes} demandes</span>
                </div>
              </div>
              <div className="horizontal-bar-rate">{item.taux_conversion}%</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Graphique d'entonnoir
  const FunnelChart = () => {
    if (!funnel?.funnel) return null;
    const steps = funnel.funnel;
    const maxWidth = 100;
    const widths = [100, steps[1]?.pourcentage || 0, steps[2]?.pourcentage || 0];
    
    return (
      <div className="chart-container">
        <h3 className="chart-title">
          <PieChart size={18} />
          Entonnoir de conversion
        </h3>
        <div className="funnel-chart">
          {steps.map((step, idx) => (
            <div key={idx} className="funnel-step">
              <div className="funnel-step-label">
                <span className="step-name">{step.etape}</span>
                <span className="step-count">{step.valeur}</span>
              </div>
              <div className="funnel-step-bar-container">
                <div 
                  className={`funnel-step-bar step-${idx}`}
                  style={{ width: `${widths[idx]}%` }}
                >
                  <span className="step-percent">{step.pourcentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Carte de statistique
  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <div className="stat-card-icon">
          <Icon size={24} />
        </div>
        {trend && (
          <div className="stat-card-trend">
            {getEvolutionIcon(trend.value)}
            <span className={trend.value > 0 ? 'positive' : trend.value < 0 ? 'negative' : 'neutral'}>
              {Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-title">{title}</div>
      {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
    </div>
  );

  // Lead Card
  const LeadCard = ({ lead, index }) => {
    const getPriorityClass = () => {
      switch(lead.priorite) {
        case 'HIGH': return 'lead-high';
        case 'MEDIUM': return 'lead-medium';
        default: return 'lead-low';
      }
    };
    const getPriorityIcon = () => {
      switch(lead.priorite) {
        case 'HIGH': return <Flame size={14} />;
        case 'MEDIUM': return <Clock size={14} />;
        default: return <Minus size={14} />;
      }
    };
    return (
      <div className={`lead-card ${getPriorityClass()}`}>
        <div className="lead-rank">#{index + 1}</div>
        <div className="lead-info">
          <div className="lead-name">
            <User size={12} />
            <span>{lead.nom}</span>
          </div>
          <div className="lead-company">
            <Briefcase size={10} />
            <span>{lead.entreprise}</span>
          </div>
          <div className="lead-details">
            <span><Target size={10} /> {lead.nombreterrains} terrains</span>
            <span><Gauge size={10} /> Score: {Math.round(lead.score_potentiel)}</span>
          </div>
        </div>
        <div className="lead-priority">
          {getPriorityIcon()}
          <span>{lead.priorite === 'HIGH' ? 'Haute' : lead.priorite === 'MEDIUM' ? 'Moyenne' : 'Basse'}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="analytics-main-container">
        <div className="analytics-bg-shapes">
          <div className="analytics-floating-shape analytics-shape-one"></div>
          <div className="analytics-floating-shape analytics-shape-two"></div>
          <div className="analytics-floating-shape analytics-shape-three"></div>
          <div className="analytics-floating-shape analytics-shape-four"></div>
        </div>
        <div className="analytics-card-wrapper">
          <div className="analytics-loading">
            <Loader2 size={48} className="analytics-loading-spinner" />
            <p>Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-main-container">
      <div className="analytics-bg-shapes">
        <div className="analytics-floating-shape analytics-shape-one"></div>
        <div className="analytics-floating-shape analytics-shape-two"></div>
        <div className="analytics-floating-shape analytics-shape-three"></div>
        <div className="analytics-floating-shape analytics-shape-four"></div>
      </div>

      {toast.show && (
        <div className={`analytics-toast-container analytics-toast-${toast.type}`}>
          <div className="analytics-toast-content">
            <div className="analytics-toast-icon">
              {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div className="analytics-toast-message">{toast.message}</div>
          </div>
        </div>
      )}

      <div className="analytics-card-wrapper">
        <div className="analytics-header-section">
          <div className="analytics-logo-container">
            <div className="analytics-logo-circle">
              <Crown size={40} className="analytics-logo-icon" />
            </div>
          </div>
          <h1 className="analytics-main-title">ANALYTICS DASHBOARD</h1>
          <p className="analytics-subtitle-text">Analyse décisionnelle des démonstrations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="analytics-tabs">
          <button className={`analytics-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <Activity size={16} />
            <span>Vue d'ensemble</span>
          </button>
          <button className={`analytics-tab ${activeTab === 'entreprises' ? 'active' : ''}`} onClick={() => setActiveTab('entreprises')}>
            <Building2 size={16} />
            <span>Entreprises</span>
          </button>
          <button className={`analytics-tab ${activeTab === 'terrains' ? 'active' : ''}`} onClick={() => setActiveTab('terrains')}>
            <Target size={16} />
            <span>Par terrains</span>
          </button>
          <button className={`analytics-tab ${activeTab === 'funnel' ? 'active' : ''}`} onClick={() => setActiveTab('funnel')}>
            <PieChart size={16} />
            <span>Entonnoir</span>
          </button>
          <button className={`analytics-tab ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>
            <Users size={16} />
            <span>Leads prioritaires</span>
          </button>
        </div>

        {/* Vue d'ensemble */}
        {activeTab === 'overview' && stats && evolution && dashboard && (
          <div className="analytics-tab-content">
            {/* Stats Cards */}
            <div className="analytics-stats-grid">
              <StatCard 
                title="Total demandes" 
                value={stats.total_demandes} 
                icon={BarChart3}
                color="primary"
                trend={evolution?.demandes && { value: parseFloat(evolution.demandes.pourcentage) }}
              />
              <StatCard 
                title="Taux de conversion" 
                value={`${stats.taux_conversion}%`} 
                subtitle="Objectif: 35%"
                icon={Target}
                color="success"
              />
              <StatCard 
                title="En attente" 
                value={stats.en_attente} 
                icon={Clock}
                color="warning"
              />
              <StatCard 
                title="Réalisées" 
                value={stats.realises} 
                icon={CheckCircle}
                color="success"
              />
            </div>

            {/* Alertes */}
            {dashboard.synthese?.demandes_urgentes > 0 && (
              <div className="analytics-alert-card critical">
                <AlertTriangle size={24} />
                <div className="alert-content">
                  <h4>Attention requise</h4>
                  <p>{dashboard.synthese.demandes_urgentes} demande(s) en attente depuis plus de 72h</p>
                </div>
                <button className="alert-action">Voir détails <ChevronRight size={16} /></button>
              </div>
            )}

            {/* Évolution */}
            {evolution && (
              <div className="analytics-evolution">
                <h3><TrendingUp size={18} /> Évolution mensuelle</h3>
                <div className="evolution-cards">
                  <div className="evolution-card">
                    <div className="evolution-label">Demandes</div>
                    <div className="evolution-value">{evolution.demandes.valeur}</div>
                    <div className={`evolution-change ${evolution.demandes.evolution >= 0 ? 'positive' : 'negative'}`}>
                      {getEvolutionIcon(evolution.demandes.evolution)}
                      {evolution.demandes.evolution >= 0 ? '+' : ''}{evolution.demandes.evolution} ({evolution.demandes.pourcentage}%)
                    </div>
                  </div>
                  <div className="evolution-card">
                    <div className="evolution-label">Conversions</div>
                    <div className="evolution-value">{evolution.conversions.valeur}</div>
                    <div className={`evolution-change ${evolution.conversions.evolution >= 0 ? 'positive' : 'negative'}`}>
                      {getEvolutionIcon(evolution.conversions.evolution)}
                      {evolution.conversions.evolution >= 0 ? '+' : ''}{evolution.conversions.evolution} ({evolution.conversions.pourcentage}%)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Délais */}
            {delais && (
              <div className="analytics-delais">
                <h3><Timer size={18} /> Délais de traitement</h3>
                <div className="delais-cards">
                  <div className="delais-card">
                    <span className="delais-label">Délai moyen</span>
                    <span className="delais-value">{delais.delai_moyen_jours || 0} jours</span>
                  </div>
                  <div className="delais-card">
                    <span className="delais-label">Traitement rapide</span>
                    <span className="delais-value">{delais.traitees_rapidement || 0}</span>
                  </div>
                  <div className="delais-card">
                    <span className="delais-label">En retard</span>
                    <span className="delais-value warning">{delais.demandes_en_retard || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Répartition projets */}
            {dashboard.repartition_projets && (
              <div className="analytics-repartition">
                <h3><PieChart size={18} /> Répartition par taille de projet</h3>
                <div className="repartition-grid">
                  {dashboard.repartition_projets.map((item, idx) => (
                    <div key={idx} className="repartition-card">
                      <div className="repartition-size">{item.taille}</div>
                      <div className="repartition-count">{item.nb_demandes} demandes</div>
                      <div className="repartition-rate">{item.tx_conversion}% conversion</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Onglet Entreprises */}
        {activeTab === 'entreprises' && entreprises.length > 0 && (
          <div className="analytics-tab-content">
            <EntreprisesChart />
            
            <div className="analytics-table-container">
              <h3><Building2 size={18} /> Classement complet des entreprises</h3>
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Entreprise</th>
                    <th>Demandes</th>
                    <th>Conversions</th>
                    <th>Taux conversion</th>
                    <th>Statuts</th>
                  </tr>
                </thead>
                <tbody>
                  {entreprises.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td className="company-name">{item.entreprise}</td>
                      <td>{item.nb_demandes}</td>
                      <td>{item.nb_conversions || 0}</td>
                      <td>
                        <span className={`rate-badge ${item.taux_conversion >= 50 ? 'high' : item.taux_conversion >= 25 ? 'medium' : 'low'}`}>
                          {item.taux_conversion || 0}%
                        </span>
                      </td>
                      <td className="statuts-cell">{item.statuts?.substring(0, 30)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Onglet Terrains */}
        {activeTab === 'terrains' && terrains && (
          <div className="analytics-tab-content">
            <TerrainsChart />
            
            <div className="analytics-detail-table">
              <h3><Target size={18} /> Détail par nombre de terrains</h3>
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Nombre de terrains</th>
                    <th>Demandes</th>
                    <th>Conversions</th>
                    <th>Taux conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {terrains.par_terrain?.map((item, idx) => (
                    <tr key={idx}>
                      <td><strong>{item.nombreterrains}</strong> terrains</td>
                      <td>{item.nb_demandes}</td>
                      <td>{item.nb_conversions || 0}</td>
                      <td>
                        <span className={`rate-badge ${item.taux_conversion >= 50 ? 'high' : item.taux_conversion >= 25 ? 'medium' : 'low'}`}>
                          {item.taux_conversion || 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Onglet Entonnoir */}
        {activeTab === 'funnel' && funnel && (
          <div className="analytics-tab-content">
            <FunnelChart />
            
            <div className="analytics-funnel-stats">
              <div className="funnel-stat-card">
                <div className="funnel-stat-label">Taux de conversion global</div>
                <div className="funnel-stat-value">{funnel.synthese?.tx_global_realise}%</div>
              </div>
              <div className="funnel-stat-card">
                <div className="funnel-stat-label">Taux d'abandon</div>
                <div className="funnel-stat-value warning">{funnel.synthese?.tx_abandon}%</div>
              </div>
              <div className="funnel-stat-card">
                <div className="funnel-stat-label">Perte entre confirmation et réalisation</div>
                <div className="funnel-stat-value">
                  {100 - (funnel.synthese?.tx_confirme_to_realise || 0)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Leads */}
        {activeTab === 'leads' && leadScoring && (
          <div className="analytics-tab-content">
            <div className="leads-header">
              <h3><Users size={18} /> Leads à traiter</h3>
              <div className="leads-summary">
                <span className="lead-count high">Haute: {leadScoring.resume?.high || 0}</span>
                <span className="lead-count medium">Moyenne: {leadScoring.resume?.medium || 0}</span>
                <span className="lead-count low">Basse: {leadScoring.resume?.low || 0}</span>
              </div>
            </div>

            <div className="leads-grid">
              {leadScoring.leads?.slice(0, 12).map((lead, idx) => (
                <LeadCard key={lead.id_demonstration} lead={lead} index={idx} />
              ))}
            </div>

            <div className="recommandations-box">
              <h4><HelpCircle size={16} /> Recommandations</h4>
              <div className="recommandations-list">
                {Object.entries(leadScoring.recommandations || {}).map(([priority, message]) => (
                  <div key={priority} className={`reco-item reco-${priority.toLowerCase()}`}>
                    <strong>{priority === 'HIGH' ? '🔴 Haute priorité' : priority === 'MEDIUM' ? '🟡 Priorité moyenne' : '🟢 Priorité basse'}</strong>
                    <span>{message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;