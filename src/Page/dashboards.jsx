import StatCard from "../Dashboard/statcard";
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  TrendingUp, Users, DollarSign, Calendar, PieChart, LineChart, 
  XCircle, Download, RefreshCw, MoreHorizontal, CheckCircle, 
  Mail, Phone, MessageCircle, UserPlus, Activity, BarChart3,
  Target, Clock, Bell, Settings, Shield, Zap
} from 'lucide-react';
import RecentReservations from "../Dashboard/recentReservations";
import OccupationChart from "../Dashboard/occupation";
import PrevisionForecast from "../Dashboard/prevision";
import Annulation from "../Dashboard/Annulation";
import AnalyseMensuelle from "../Dashboard/Annalyse-financiere";
import Abonne from "../Dashboard/Abonne";
import Sous from "../Dashboard/Souscription";
import Anademo from "../Dashboard/Analysedemo";
import Anacontact from "../Dashboard/Anacontact";

// Composant de secours pour les erreurs
const ErrorFallback = ({ componentName }) => (
  <div className="error-container">
    <XCircle size={48} />
    <h3>Erreur de chargement</h3>
    <p>Le composant {componentName} n'a pas pu être chargé.</p>
    <button onClick={() => window.location.reload()}>
      Rafraîchir la page
    </button>
  </div>
);

// Wrapper pour capturer les erreurs
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erreur capturée:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback componentName={this.props.componentName} />;
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('today');
  const [activeComponent, setActiveComponent] = useState('abonne');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getPeriodLabel = (filter) => {
    switch (filter) {
      case 'today': return "Aujourd'hui";
      case 'week': return "Cette semaine";
      case 'month': return "Ce mois";
      default: return "Période";
    }
  };

  const components = [
    { id: 'abonne', name: 'Abonnés', icon: Users, component: Abonne, available: true },
    { id: 'financier', name: 'Analyse Financière', icon: DollarSign, component: AnalyseMensuelle, available: true },
    { id: 'occupation', name: "Taux d'Occupation", icon: PieChart, component: OccupationChart, available: true },
    { id: 'prevision', name: 'Prévisions', icon: LineChart, component: PrevisionForecast, available: true },
    { id: 'annulation', name: "Taux d'Annulation", icon: XCircle, component: Annulation, available: true },
    { id: 'reservations', name: 'Réservations', icon: Calendar, component: RecentReservations, available: true },
    { id: 'souscription', name: 'Souscriptions', icon: UserPlus, component: Sous, available: true },
    { id: 'demonstration', name: 'Démonstrations', icon: Activity, component: Anademo, available: true },
    { id: 'contact', name: 'Contact', icon: MessageCircle, component: Anacontact, available: true },
  ];

  const renderActiveComponent = () => {
    const active = components.find(c => c.id === activeComponent);
    if (!active) return <div>Composant non trouvé</div>;
    if (!active.available) return (
      <div className="unavailable-component">
        <p>Le composant {active.name} n'est pas disponible pour le moment.</p>
      </div>
    );
    const Component = active.component;
    return (
      <ErrorBoundary key={activeComponent} componentName={active.name}>
        <Suspense fallback={
          <div className="loading-fallback">
            <span className="loader" />
            Chargement...
          </div>
        }>
          <Component />
        </Suspense>
      </ErrorBoundary>
    );
  };

  const activeComp = components.find(c => c.id === activeComponent);
  const ActiveIcon = activeComp?.icon;

  return (
    <div className="dashboard-container">

      {/* ── WELCOME ── */}
      {showWelcome && (
        <div className="welcome-banner">
          <div className="welcome-shine" />
          <div className="welcome-orb welcome-orb--1" />
          <div className="welcome-orb welcome-orb--2" />
          <div className="welcome-content">
            <div className="welcome-text">
              <span className="welcome-tag">FOOTSPACE ADMIN SUITE</span>
              <h1>Bienvenue sur votre tableau de bord</h1>
              <p>Voici un aperçu complet de l'activité de votre plateforme.</p>
            </div>
            <button className="action-btn" onClick={() => setShowWelcome(false)}>
              Masquer
            </button>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-badge">ANALYTICS</div>
          <h2>Tableau de bord</h2>
          <p>Surveillez les performances de votre entreprise en temps réel</p>
        </div>
        <div className="header-filters">
          {['today', 'week', 'month'].map(f => (
            <button
              key={f}
              className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {getPeriodLabel(f)}
            </button>
          ))}
        </div>
      </div>

      {/* ── STAT ── */}
      <div className="stats-grid">
        <StatCard
          title="Revenus"
          value={isLoading ? "—" : "0 €"}
          subtitle={getPeriodLabel(activeFilter)}
          icon={<TrendingUp size={24} />}
          trend={null}
          className="primary"
          loading={isLoading}
        />
      </div>

      {/* ── TABS ── */}
      <div className="tabs-navigation">
        {components.map((comp) => {
          const Icon = comp.icon;
          const isActive = activeComponent === comp.id;
          return (
            <button
              key={comp.id}
              className={`tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => !isLoading && setActiveComponent(comp.id)}
              disabled={isLoading}
              title={comp.name}
            >
              <span className={`tab-icon-bg ${isActive ? 'active' : ''}`}>
                <Icon size={16} />
              </span>
              <span className="tab-name">{comp.name}</span>
              {isActive && <span className="tab-pip" />}
            </button>
          );
        })}
      </div>

      {/* ── PANEL ── */}
      <div className="active-component-container">
        <div className="component-header">
          <div className="component-header-orb" />
          <div className="component-title">
            <div className="component-icon-wrap">
              {ActiveIcon && <ActiveIcon size={20} />}
            </div>
            <div>
              <span className="component-eyebrow">Module actif</span>
              <h3>{activeComp?.name || "Tableau de bord"}</h3>
            </div>
          </div>
          <div className="component-actions">
            <button className="action-icon-btn" title="Exporter"><Download size={16} /></button>
            <button className="action-icon-btn" title="Actualiser"><RefreshCw size={16} /></button>
            <button className="action-icon-btn" title="Plus d'options"><MoreHorizontal size={16} /></button>
          </div>
        </div>

        <div className="component-content">
          {renderActiveComponent()}
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --primary-color: rgb(31, 68, 4);
          --secondary-color: rgb(12, 163, 47);
          --text-color: #2b2d42;
          --text-muted: #6c757d;
          --background: #f8fafc;
          --card-background: #ffffff;
          --border-color: #e9ecef;
          --hover-background: #f8f9fa;
          --success-color: rgb(55, 185, 16);
          --danger-color: rgb(71, 1, 1);
          --warning-color: #f59e0b;
          --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          --shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.12);
          --transition: all 0.3s ease;
          --primary-rgb: 31, 68, 4;
          --secondary-rgb: 12, 163, 47;
          --sidebar-z-index: 100;
        }

        /* ── BASE ── */
        .dashboard-container { 
          font-family: 'Inter', sans-serif; 
        }
        
        .dashboard-container h1,
        .dashboard-container h2,
        .dashboard-container h3,
        .dashboard-container .filter-btn,
        .dashboard-container .tab-name,
        .dashboard-container .header-badge,
        .dashboard-container .welcome-tag,
        .dashboard-container .component-eyebrow { 
          font-family: 'Orbitron', sans-serif; 
        }

        /* ── SHELL ── */
        .dashboard-container {
          padding: 24px;
          max-width: 1440px;
          margin: 0 auto;
          margin-left: 100px;
          margin-top: 50px;
          overflow-x: hidden;
          width: calc(100% - 100px);
          box-sizing: border-box;
          background: var(--background);
          position: relative;
          isolation: isolate;
        }

        /* ── WELCOME ── */
        .welcome-banner {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, var(--primary-color) 0%, rgb(18, 110, 28) 50%, var(--secondary-color) 100%);
          border-radius: 20px;
          margin-bottom: 24px;
          padding: 28px 32px;
          box-shadow: 0 8px 32px rgba(var(--primary-rgb), 0.3), 0 2px 8px rgba(0,0,0,0.1);
          animation: slideInDown 0.5s ease;
        }
        
        .welcome-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, rgba(255,255,255,0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .welcome-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        
        .welcome-orb--1 {
          width: 220px;
          height: 220px;
          top: -80px;
          right: -60px;
          background: radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%);
        }
        
        .welcome-orb--2 {
          width: 140px;
          height: 140px;
          bottom: -60px;
          right: 140px;
          background: radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%);
        }
        
        .welcome-content {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }
        
        .welcome-tag {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.75);
          margin-bottom: 10px;
        }
        
        .welcome-text h1 {
          margin: 0 0 6px;
          font-size: 1.05rem;
          font-weight: 700;
          color: white;
          letter-spacing: 0.03em;
        }
        
        .welcome-text p {
          margin: 0;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.82);
          font-family: 'Inter', sans-serif;
        }
        
        .action-btn {
          flex-shrink: 0;
          padding: 10px 22px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.12);
          color: white;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          backdrop-filter: blur(12px);
          font-family: 'Inter', sans-serif;
        }
        
        .action-btn:hover {
          background: rgba(255,255,255,0.22);
          transform: translateY(-1px);
        }

        /* ── HEADER ── */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .header-content {
          flex: 1;
        }
        
        .header-badge {
          display: inline-block;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: var(--secondary-color);
          background: rgba(var(--secondary-rgb), 0.1);
          border: 1px solid rgba(var(--secondary-rgb), 0.25);
          padding: 4px 10px;
          border-radius: 100px;
          margin-bottom: 8px;
        }
        
        .header-content h2 {
          margin: 0 0 4px;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-color);
          letter-spacing: 0.04em;
        }
        
        .header-content p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.875rem;
          font-family: 'Inter', sans-serif;
        }
        
        .header-filters {
          display: flex;
          gap: 4px;
          background: var(--card-background);
          padding: 5px;
          border-radius: 100px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
        }
        
        .filter-btn {
          padding: 8px 18px;
          border-radius: 100px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .filter-btn:hover {
          color: var(--text-color);
          background: var(--hover-background);
        }
        
        .filter-btn.active {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          font-weight: 700;
          box-shadow: 0 2px 10px rgba(var(--primary-rgb), 0.35);
        }

        /* ── STATS ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        /* ── TABS ── */
        .tabs-navigation {
          display: flex;
          gap: 4px;
          margin-bottom: 24px;
          padding: 6px;
          border-radius: 18px;
          background: var(--card-background);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          overflow-x: auto;
          scrollbar-width: none;
        }
        
        .tabs-navigation::-webkit-scrollbar {
          display: none;
        }

        .tab-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border: 1px solid transparent;
          border-radius: 12px;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
        }
        
        .tab-btn:hover:not(:disabled) {
          color: var(--text-color);
          background: var(--hover-background);
        }
        
        .tab-btn.active {
          background: rgba(var(--primary-rgb), 0.06);
          color: var(--primary-color);
          border-color: rgba(var(--primary-rgb), 0.18);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(var(--primary-rgb), 0.1);
        }
        
        .tab-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .tab-icon-bg {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 7px;
          background: var(--hover-background);
          transition: var(--transition);
          flex-shrink: 0;
        }
        
        .tab-icon-bg.active {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.4);
        }
        
        .tab-pip {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 3px;
          border-radius: 100px;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        }

        /* ── PANEL ── */
        .active-component-container {
          background: var(--card-background);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          overflow: hidden;
          animation: fadeIn 0.4s ease;
        }
        
        .component-header {
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          background: linear-gradient(135deg, var(--primary-color) 0%, rgb(18, 110, 28) 50%, var(--secondary-color) 100%);
          color: white;
        }
        
        .component-header-orb {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%);
          pointer-events: none;
        }
        
        .component-title {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        
        .component-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(8px);
        }
        
        .component-eyebrow {
          display: block;
          font-size: 0.52rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.65;
          margin-bottom: 3px;
        }
        
        .component-title h3 {
          margin: 0;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: white;
        }
        
        .component-actions {
          position: relative;
          display: flex;
          gap: 8px;
        }
        
        .action-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.12);
          color: white;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .action-icon-btn:hover {
          background: rgba(255,255,255,0.24);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
        }
        
        .component-content {
          padding: 28px;
          min-height: 500px;
          animation: slideInUp 0.45s ease;
        }

        /* ── STATES ── */
        .error-container, .error-fallback, .unavailable-component {
          padding: 40px;
          text-align: center;
          background: #fff5f5;
          border-radius: 14px;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }
        
        .error-container h3 {
          margin: 12px 0 6px;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
        }
        
        .error-container p {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
        }
        
        .error-container button {
          padding: 10px 22px;
          margin-top: 16px;
          border: none;
          border-radius: 10px;
          background: var(--primary-color);
          color: white;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          transition: var(--transition);
        }
        
        .error-container button:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        .loading-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 60px;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        
        .loader {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          flex-shrink: 0;
          border: 2px solid var(--border-color);
          border-top-color: var(--secondary-color);
          animation: spin 0.7s linear infinite;
        }

        /* ── ANIMATIONS ── */
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .dashboard-container {
            margin-left: 80px;
            width: calc(100% - 80px);
          }
        }
        
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px;
            margin-left: 0;
            width: 100%;
          }
          
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-filters {
            width: 100%;
            justify-content: center;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .welcome-content {
            flex-direction: column;
            text-align: center;
          }
          
          .tab-btn {
            padding: 8px 12px;
          }
          
          .tab-name {
            display: none;
          }
          
          .component-header {
            flex-wrap: wrap;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;