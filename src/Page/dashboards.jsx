import React, { useState, useEffect } from 'react';
import StatCard from "../Dashboard/statcard";
import RecentReservations from "../Dashboard/recentReservations";
import OccupationChart from "../Dashboard/occupation";
import QuickActions from "../Dashboard/quickActions";
import PrevisionForecast from "../Dashboard/prevision";

const Dashboard = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('today');

  // Simuler un chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const statsData = {
    today: [
      {
        title: "Revenus aujourd'hui",
        value: "1,250 €",
        subtitle: "12 réservations",
        icon: TrendingUpIcon,
        trend: { value: 15, isPositive: true },
        color: "primary"
      },
      {
        title: "Clients actifs",
        value: "48",
        subtitle: "Ce jour",
        icon: UsersIcon,
        trend: { value: 8, isPositive: true },
        color: "success"
      },
      {
        title: "Taux de remplissage",
        value: "82%",
        subtitle: "Moyenne",
        icon: CalendarCheckIcon,
        trend: { value: 5, isPositive: true },
        color: "warning"
      },
      {
        title: "Terrains occupés",
        value: "8/12",
        subtitle: "En ce moment",
        icon: MapPinIcon,
        color: "danger"
      }
    ],
    week: [
      {
        title: "Revenus hebdomadaires",
        value: "8,420 €",
        subtitle: "84 réservations",
        icon: TrendingUpIcon,
        trend: { value: 12, isPositive: true },
        color: "primary"
      },
      {
        title: "Nouveaux clients",
        value: "32",
        subtitle: "Cette semaine",
        icon: UsersIcon,
        trend: { value: 10, isPositive: true },
        color: "success"
      },
      {
        title: "Taux de remplissage",
        value: "78%",
        subtitle: "Moyenne hebdo",
        icon: CalendarCheckIcon,
        trend: { value: 3, isPositive: true },
        color: "warning"
      },
      {
        title: "Annulations",
        value: "6",
        subtitle: "Cette semaine",
        icon: MapPinIcon,
        trend: { value: 2, isPositive: false },
        color: "danger"
      }
    ],
    month: [
      {
        title: "Revenus mensuels",
        value: "32,150 €",
        subtitle: "312 réservations",
        icon: TrendingUpIcon,
        trend: { value: 18, isPositive: true },
        color: "primary"
      },
      {
        title: "Clients actifs",
        value: "1,248",
        subtitle: "Ce mois",
        icon: UsersIcon,
        trend: { value: 8, isPositive: true },
        color: "success"
      },
      {
        title: "Taux de remplissage",
        value: "75%",
        subtitle: "Moyenne mensuelle",
        icon: CalendarCheckIcon,
        trend: { value: 5, isPositive: true },
        color: "warning"
      },
      {
        title: "Terrains actifs",
        value: "12",
        subtitle: "Total",
        icon: MapPinIcon,
        color: "danger"
      }
    ]
  };

  const currentStats = statsData[activeFilter];

  return (
    <div className="dashboard-container">
      {showWelcome && (
        <div className="welcome-banner">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1>Bienvenue dans FootSpace Admin Suite </h1>
              <p>Voici un aperçu complet de l'activité de votre plateforme.</p>
            </div>
            <div className="welcome-actionss">
              <button className="action-btns primary">Voir le rapport complet</button>
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

      <div className="stats-grid">
        {currentStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={<stat.icon />}
            trend={stat.trend}
            className={stat.color}
            loading={isLoading}
          />
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-main">
          <OccupationChart />
        </div>
        <div className="chart-sidebar">
          <PrevisionForecast />
        </div>
      </div>

      <div className="content-grid">
        <div className="content-main">
          <RecentReservations />
        </div>
        <div className="content-sidebar">
          <QuickActions />
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary-color:rgb(31, 68, 4);
          --primary-light: #eef2ff;
          --secondary-color:rgb(12, 163, 47);
          --text-color: #2b2d42;
          --text-muted: #6c757d;
          --background: #f8fafc;
          --card-background: #ffffff;
          --border-color: #e9ecef;
          --hover-background: #f8f9fa;
          --success-color:rgb(55, 185, 16);
          --danger-color:rgb(71, 1, 1);
          --warning-color: #f59e0b;
          --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          --transition: all 0.3s ease;
        }

        .dashboard-container {
          padding: 24px;
          max-width: 1440px;
          margin: 0 auto;
          margin-left: 100px;
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

        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .chart-main, .chart-sidebar {
          min-height: 400px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .content-main, .content-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

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

        @media (max-width: 1024px) {
          .charts-grid,
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .welcome-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .welcome-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px;
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
          
          .welcome-banner {
            padding: 20px;
          }
          
          .welcome-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .header-filters {
            flex-wrap: wrap;
          }
          
          .filter-btn {
            flex: 1;
            text-align: center;
            min-width: 80px;
          }
        }
      `}</style>
    </div>
  );
};

// Icônes SVG personnalisées
const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const CalendarCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M9 16l2 2 4-4"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export default Dashboard;