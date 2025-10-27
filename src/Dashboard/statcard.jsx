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
  const [error, setError] = useState(null);

  // Fonction principale pour charger toutes les données depuis votre API stats
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      setError(null);

      console.log('🔄 Chargement des données depuis /api/stats/dashboard...');

      const response = await fetch('https://backend-foot-omega.vercel.app/api/stats/dashboard');
      const data = await response.json();

      console.log('📊 Données brutes reçues:', data);

      if (data.success && data.data) {
        // Utilisation directe des données de votre API stats
        const dashboardData = {
          // Données principales
          revenus_mois: data.data.revenus_mois || 0,
          reservations_mois: data.data.reservations_mois || 0,
          clients_actifs: data.data.clients_actifs || 0,
          taux_remplissage: data.data.taux_remplissage || 0,
          
          // Données temps réel
          reservations_aujourdhui: data.data.reservations_aujourdhui || 0,
          confirmes_aujourdhui: data.data.confirmes_aujourdhui || 0,
          annules_aujourdhui: data.data.annules_aujourdhui || 0,
          
          // Données annuelles
          revenus_annee: data.data.revenus_annee || 0,
          
          // Tendances calculées par votre API
          trends: data.data.trends || {
            revenus: { value: 0, isPositive: true },
            reservations: { value: 0, isPositive: true },
            clients: { value: 0, isPositive: true },
            remplissage: { value: 0, isPositive: true }
          }
        };

        console.log('✅ Données formatées pour le dashboard:', dashboardData);
        setStats(dashboardData);
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des données');
      }

    } catch (error) {
      console.error('❌ Erreur chargement dashboard:', error);
      setError(error.message);
      
      // Données de démonstration basées sur vos vraies données
      const demoData = {
        revenus_mois: 900,
        reservations_mois: 2,
        clients_actifs: 2, // 2 clients pour 2 réservations
        taux_remplissage: 16.67, // 2 réservations / 12 terrains * 100
        reservations_aujourdhui: 0,
        confirmes_aujourdhui: 0,
        annules_aujourdhui: 0,
        revenus_annee: 900,
        trends: {
          revenus: { value: 0, isPositive: true },
          reservations: { value: 0, isPositive: true },
          clients: { value: 0, isPositive: true },
          remplissage: { value: 0, isPositive: true }
        }
      };
      
      console.log('🔄 Utilisation des données de démonstration:', demoData);
      setStats(demoData);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fonction pour récupérer l'évolution des revenus
  const fetchRevenueEvolution = async () => {
    try {
      const response = await fetch('https://backend-foot-omega.vercel.app/api/stats/evolution-revenus');
      const data = await response.json();
      
      if (data.success) {
        console.log('📈 Évolution des revenus:', data.data);
        return data.data;
      }
      return [];
    } catch (error) {
      console.error('Erreur évolution revenus:', error);
      return [];
    }
  };

  // Fonction pour récupérer les performances des terrains
  const fetchTerrainPerformance = async () => {
    try {
      const response = await fetch('https://backend-foot-omega.vercel.app/api/stats/performance-terrains');
      const data = await response.json();
      
      if (data.success) {
        console.log('🎯 Performance terrains:', data.data);
        return data.data;
      }
      return [];
    } catch (error) {
      console.error('Erreur performance terrains:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    
    // Charger les données supplémentaires
    Promise.all([
      fetchRevenueEvolution(),
      fetchTerrainPerformance()
    ]).then(([revenueData, terrainData]) => {
      console.log('📊 Données supplémentaires chargées:', { revenueData, terrainData });
    });
  }, [selectedPeriod]);

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
            <Icon size={24} />
          </div>
          <div className="foot-header-text">
            <span className="foot-card-title">{title}</span>
            <span className="foot-card-subtitle">{subtitle}</span>
          </div>
        </div>
        
        <div className="foot-card-main">
          <div className="foot-main-value">{value}</div>
          
          {trend && (
            <div className={`foot-trend ${trend.isPositive ? 'foot-positive' : 'foot-negative'}`}>
              <div className="foot-trend-icon">
                {trend.isPositive ? 
                  <TrendingUp size={18} /> : 
                  <TrendingDown size={18} />
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
          <h1 className="foot-dashboard-title">Tableau de Bord - Données Réelles</h1>
          <p className="foot-dashboard-subtitle">
            Statistiques en temps réel basées sur vos données actuelles
          </p>
          <div className="foot-last-update">
            <RefreshCw size={14} />
            Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
          </div>
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
            <RefreshCw size={18} />
            {isRefreshing ? 'Actualisation...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="foot-dashboard-container">
        {loading ? (
          <div className="foot-stats-loading">
            <div className="foot-loading-spinner"></div>
            <p>Chargement des données en temps réel...</p>
            <p className="foot-loading-detail">Connexion à votre API...</p>
          </div>
        ) : error ? (
          <div className="foot-stats-error">
            <AlertCircle size={48} />
            <h3>Erreur de chargement</h3>
            <p>{error}</p>
            <p className="foot-error-detail">
              Données affichées: 2 réservations (900 DH) - Mode démonstration
            </p>
            <button onClick={fetchDashboardStats} className="foot-retry-btn">
              Réessayer
            </button>
          </div>
        ) : !stats ? (
          <div className="foot-stats-error">
            <AlertCircle size={48} />
            <h3>Données non disponibles</h3>
            <p>Aucune donnée trouvée dans votre API</p>
            <button onClick={fetchDashboardStats} className="foot-retry-btn">
              Réessayer
            </button>
          </div>
        ) : (
          <>
            {/* Grid principal des statistiques */}
            <div className="foot-stats-grid">
              {/* Revenus */}
              <StatCard
                title="Revenus Mensuels"
                value={formatCurrency(stats.revenus_mois)}
                subtitle="Total ce mois"
                trend={stats.trends?.revenus}
                footer={
                  <div className="foot-footer-stats">
                    <div className="foot-footer-item">
                      <span className="foot-footer-label">Revenus annuels:</span>
                      <span className="foot-footer-value foot-success">
                        {formatCurrency(stats.revenus_annee)}
                      </span>
                    </div>
                    <div className="foot-footer-item">
                      <span className="foot-footer-label">Moyenne par réservation:</span>
                      <span className="foot-footer-value foot-highlight">
                        {stats.reservations_mois > 0 ? formatCurrency(stats.revenus_mois / stats.reservations_mois) : formatCurrency(0)}
                      </span>
                    </div>
                  </div>
                }
                icon={DollarSign}
                type="revenue"
              />

              {/* Réservations */}
              <StatCard
                title="Réservations Confirmées"
                value={stats.reservations_mois?.toLocaleString() || '0'}
                subtitle="Ce mois"
                trend={stats.trends?.reservations}
                footer={
                  <div className="foot-footer-stats">
                    <div className="foot-footer-item">
                      <span className="foot-footer-label">Aujourd'hui:</span>
                      <span className="foot-footer-value foot-highlight">
                        {stats.reservations_aujourdhui} réservation(s)
                      </span>
                    </div>
                    <div className="foot-footer-item">
                      <span className="foot-footer-label">Confirmées aujourd'hui:</span>
                      <span className="foot-footer-value foot-success">
                        {stats.confirmes_aujourdhui}
                      </span>
                    </div>
                  </div>
                }
                icon={Calendar}
                type="bookings"
              />

              {/* Clients Actifs */}
              <StatCard
                title="Clients Actifs"
                value={stats.clients_actifs?.toLocaleString() || '0'}
                subtitle="Ce mois"
                trend={stats.trends?.clients}
                footer={
                  <div className="foot-footer-stats">
                    <div className="foot-footer-item">
                      <span className="foot-footer-label">Fidélité moyenne:</span>
                      <span className="foot-footer-value foot-success">
                        {stats.clients_actifs > 0 ? (stats.reservations_mois / stats.clients_actifs).toFixed(1) : 0} réservations/client
                      </span>
                    </div>
                    <div className="foot-footer-item">
                      <span className="foot-footer-label">Taux de récurrence:</span>
                      <span className="foot-footer-value">
                        {stats.clients_actifs > 0 ? '100%' : '0%'}
                      </span>
                    </div>
                  </div>
                }
                icon={Users}
                type="clients"
              />

              {/* Performance */}
              <StatCard
                title="Performance"
                value={`${Math.round(stats.taux_remplissage)}%`}
                subtitle="Taux de remplissage"
                trend={stats.trends?.remplissage}
                footer={
                  <div className="foot-footer-stats">
                    <div className="foot-footer-item">
                      <span className="foot-footer-label">Objectif mensuel:</span>
                      <span className="foot-footer-value">
                        <Target size={16} />
                        85%
                      </span>
                    </div>
                    <div className="foot-footer-item">
                      <span className="foot-footer-label">Écart à l'objectif:</span>
                      <span className={`foot-footer-value ${stats.taux_remplissage >= 85 ? 'foot-success' : 'foot-warning'}`}>
                        {stats.taux_remplissage >= 85 ? '+' : ''}{(stats.taux_remplissage - 85).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                }
                icon={BarChart3}
                type="performance"
              />
            </div>

            {/* Section d'information */}
            <div className="foot-data-info">
              <div className="foot-info-card">
                <div className="foot-info-icon">
                  <AlertCircle size={20} />
                </div>
                <div className="foot-info-content">
                  <h4>Données Réelles</h4>
                  <p>
                    Affichage des données exactes de votre base : <strong>{stats.reservations_mois} réservations confirmées</strong> 
                    ce mois pour <strong>{formatCurrency(stats.revenus_mois)}</strong> de revenus.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;