import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  AlertCircle,
  DollarSign,
  Calendar,
  Users,
  BarChart3,
  Target
} from 'lucide-react';
import './dashboardStats.css';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('mois');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, [selectedPeriod]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      const url = 'https://backend-foot-omega.vercel.app/api/prevision/dashboard';
      const params = new URLSearchParams({ periode: selectedPeriod });
      
      const response = await fetch(`${url}?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'jour': return "Aujourd'hui";
      case 'semaine': return "Cette semaine";
      case 'mois': return "Ce mois";
      case 'annee': return "Cette année";
      default: return "Cette période";
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    trend, 
    footer, 
    icon: Icon,
    type = 'default'
  }) => (
    <div className={`foot-stat-card foot-stat-${type}`}>
      <div className="foot-card-glow"></div>
      <div className="foot-card-content">
        <div className="foot-card-header">
          <div className="foot-card-icon">
            <Icon size={20} />
          </div>
          <span className="foot-card-title">{title}</span>
        </div>
        
        <div className="foot-card-main">
          <div className="foot-main-value">{value}</div>
          <div className="foot-period-label">{subtitle}</div>
          
          {trend && (
            <div className={`foot-trend ${trend.isPositive ? 'foot-positive' : 'foot-negative'}`}>
              <div className="foot-trend-icon">
                {trend.isPositive ? 
                  <TrendingUp size={16} /> : 
                  <TrendingDown size={16} />
                }
              </div>
              <span className="foot-trend-value">{trend.value}%</span>
              <span className="foot-trend-label">vs période précédente</span>
            </div>
          )}
        </div>

        {footer && (
          <div className="foot-card-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="foot-dashboard-stats">
      {/* Header */}
      <div className="foot-dashboard-header">
        <div className="foot-header-content">
          <h1 className="foot-dashboard-title">Tableau de Bord</h1>
          <p className="foot-dashboard-subtitle">
            Vue d'ensemble de votre activité {getPeriodLabel().toLowerCase()}
          </p>
        </div>
        
        <div className="foot-header-controls">
          <div className="foot-period-selector">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="foot-period-select"
            >
              <option value="jour">Aujourd'hui</option>
              <option value="semaine">Cette semaine</option>
              <option value="mois">Ce mois</option>
              <option value="annee">Cette année</option>
            </select>
          </div>
          
          <button 
            onClick={fetchDashboardStats} 
            className={`foot-refresh-btn ${isRefreshing ? 'foot-refreshing' : ''}`}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} />
            {isRefreshing ? 'Actualisation...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="foot-dashboard-container">
        {loading ? (
          <div className="foot-stats-loading">
            <div className="foot-loading-spinner"></div>
            <p>Chargement des données...</p>
          </div>
        ) : !stats ? (
          <div className="foot-stats-error">
            <AlertCircle size={48} />
            <h3>Données non disponibles</h3>
            <p>Impossible de charger les données du tableau de bord</p>
            <button onClick={fetchDashboardStats} className="foot-retry-btn">
              Réessayer
            </button>
          </div>
        ) : (
          <div className="foot-stats-grid">
            {/* Revenus */}
            <StatCard
              title="Revenus (MAD)"
              value={formatCurrency(stats.revenus_mois)}
              subtitle={getPeriodLabel()}
              trend={stats.trends?.revenus}
              footer={
                <div className="foot-footer-item">
                  <span className="foot-footer-label">Annuel:</span>
                  <span className="foot-footer-value">{formatCurrency(stats.revenus_annee)}</span>
                </div>
              }
              icon={DollarSign}
              type="revenue"
            />

            {/* Réservations */}
            <StatCard
              title="Réservations"
              value={stats.reservations_mois}
              subtitle={`Confirmées ${getPeriodLabel().toLowerCase()}`}
              trend={stats.trends?.reservations}
              footer={
                <div className="foot-footer-item">
                  <span className="foot-footer-label">Aujourd'hui:</span>
                  <span className="foot-footer-value foot-highlight">
                    {stats.confirmes_aujourdhui}/{stats.reservations_aujourdhui}
                  </span>
                </div>
              }
              icon={Calendar}
              type="bookings"
            />

            {/* Clients */}
            <StatCard
              title="Clients"
              value={stats.clients_actifs}
              subtitle="Clients actifs"
              trend={stats.trends?.clients}
              footer={
                <div className="foot-footer-item">
                  <span className="foot-footer-label">Fidélité:</span>
                  <span className="foot-footer-value foot-success">Élevée</span>
                </div>
              }
              icon={Users}
              type="clients"
            />

            {/* Performance */}
            <StatCard
              title="Performance"
              value={`${stats.taux_remplissage}%`}
              subtitle="Taux de remplissage"
              trend={stats.trends?.remplissage}
              footer={
                <div className="foot-footer-item">
                  <span className="foot-footer-label">Objectif:</span>
                  <span className="foot-footer-value">
                    <Target size={14} />
                    85%
                  </span>
                </div>
              }
              icon={BarChart3}
              type="performance"
            />
          </div>
        )}
      </div>

     
    </div>
  );
};

export default DashboardStats;