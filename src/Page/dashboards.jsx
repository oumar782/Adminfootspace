import React, { useState, useEffect } from 'react';
import StatCard from "../Dashboard/statcard";
import RecentReservations from "../Dashboard/recentReservations";
import OccupationChart from "../Dashboard/occupation";
import PrevisionForecast from "../Dashboard/prevision";
import Annulation from "../Dashboard/Annulation";
import AnalyseMensuelle from "../Dashboard/Annalyse-financiere";

// Icônes (gardées car utilisées)
const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const Dashboard = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('today');

  // Simuler un chargement initial (tu remplaceras ça par un fetch plus tard)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard-container">
      {showWelcome && (
        <div className="welcome-banner">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1>Bienvenue dans FootSpace Admin Suite</h1>
              <p>Voici un aperçu complet de l'activité de votre plateforme.</p>
            </div>
            <div className="welcome-actionss">
              <button 
                className="action-btns"
                onClick={() => setShowWelcome(false)}
              >
                Masquer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <div className="header-contentss">
          <h2>Aperçu du tableau de bord</h2>
          <p>Surveillez les performances de votre entreprise en temps réel</p>
        </div>
        <div className="header-filters">
          <button 
            className={`filter-btn ${activeFilter === 'today' ? 'active' : ''}`}
            onClick={() => setActiveFilter('today')}
          >
            Aujourd'hui
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'week' ? 'active' : ''}`}
            onClick={() => setActiveFilter('week')}
          >
            Cette semaine
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'month' ? 'active' : ''}`}
            onClick={() => setActiveFilter('month')}
          >
            Ce mois
          </button>
        </div>
      </div>

      {/* Analyse des créneaux */}
      <div className="content-grid section-title">
        <h3>Analyse des Créneaux</h3>
      </div>
     
      {/* Analyse financière */}
      <div className="content-grid section-title">
        <h3>Analyse Financière</h3>
      </div>
      <div className="content-grid">
        <div className="content-main">
          <AnalyseMensuelle />
        </div>
        <div className="content-sidebar">
          {/* Sidebar content for AnalyseMensuelle can go here */}
        </div>
      </div>

      {/* ✅ SEULE CARTE : Revenus */}
      <div className="stats-grid">
        <StatCard
          title="Revenus"
          value={isLoading ? "—" : "0 €"}
          subtitle={getPeriodLabel(activeFilter)}
          icon={<TrendingUpIcon />}
          trend={null}
          className="primary"
          loading={isLoading}
        />
      </div>

      {/* Occupation Chart */}
      <div className="content-grid section-title">
        <h3>Taux d'Occupation</h3>
      </div>
      <div className="content-grid">
        <div className="content-main">
          <OccupationChart />
        </div>
        <div className="content-sidebar">
          {/* Sidebar content for OccupationChart can go here */}
        </div>
      </div>

      {/* Prévision */}
      <div className="content-grid section-title">
        <h3>Prévisions</h3>
      </div>
      <div className="content-grid">
        <div className="content-main">
          <PrevisionForecast />
        </div>
        <div className="content-sidebar">
          {/* Sidebar content for PrevisionForecast can go here */}
        </div>
      </div>

      {/* Annulation */}
      <div className="content-grid section-title">
        <h3>Taux d'Annulation</h3>
      </div>
      <div className="content-grid">
        <div className="content-main">
          <Annulation />
        </div>
        <div className="content-sidebar">
          {/* Sidebar content for Annulation can go here */}
        </div>
      </div>

      {/* Réservations récentes */}
      <div className="content-grid section-title">
        <h3>Réservations Récentes</h3>
      </div>
      <div className="content-grid">
        <div className="content-main">
          <RecentReservations />
        </div>
        <div className="content-sidebar">
          {/* Sidebar content for RecentReservations can go here */}
        </div>
      </div>

      <style jsx>{`
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
          --transition: all 0.3s ease;
        }

        .dashboard-container {
          padding: 24px;
          max-width: 1440px;
          margin: 0 auto;
          margin-left: 100px;
          margin-top: 50px;
          overflow: hidden;
          width: calc(100% - 100px);
          box-sizing: border-box;
        }

        .welcome-banner {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          border-radius: 16px;
          margin-bottom: 24px;
          padding: 24px;
          box-shadow: var(--shadow);
          animation: slideInDown 0.5s ease;
        }

        .welcome-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .welcome-text h1 {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .welcome-text p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .welcome-actionss {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        .action-btns {
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(9, 95, 25, 0.1);
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          backdrop-filter: blur(10px);
        }

        .action-btns:hover {
          background: rgba(234, 15, 15, 0.2);
        }

        .action-btns.primary {
          background: rgba(241, 12, 12, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .action-btns.primary:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-contentss h2 {
          margin: 0 0 4px 0;
          font-size: 1.5rem;
          font-weight: bold;
          color: green;
          text-shadow: 2px 2px 4px rgba(255, 7, 7, 0.15);
        }

        .header-contentss p {
          margin: 0;
          color: red;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .header-filters {
          display: flex;
          gap: 8px;
          background: var(--hover-background);
          padding: 4px;
          border-radius: 12px;
        }

        .filter-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }

        .filter-btn:hover {
          color: var(--text-color);
        }

        .filter-btn.active {
          background: var(--card-background);
          color: var(--primary-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .section-title {
          grid-template-columns: 1fr;
          margin-bottom: 12px;
        }

        .section-title h3 {
          margin: 0;
          color: var(--primary-color);
          font-size: 1.25rem;
          font-weight: 600;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--border-color);
        }

        .content-main, .content-sidebar {
          min-height: 400px;
          background: var(--card-background);
          border-radius: 12px;
          box-shadow: var(--shadow);
          padding: 20px;
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .content-sidebar {
            display: none;
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
        }
      `}</style>
    </div>
  );
};

// Fonction utilitaire pour le libellé de période
const getPeriodLabel = (filter) => {
  switch (filter) {
    case 'today': return "Aujourd'hui";
    case 'week': return "Cette semaine";
    case 'month': return "Ce mois";
    default: return "Période";
  }
};

export default Dashboard;