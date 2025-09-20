import React from 'react';
import './custom.css';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  loading = false, 
  className = '', 
  onClick 
}) => {
  return (
    <div 
      className={`stat-card ${className} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      {loading ? (
        <div className="stat-card-skeleton">
          <div className="skeleton-header">
            <div className="skeleton-title"></div>
            <div className="skeleton-icon"></div>
          </div>
          <div className="skeleton-value"></div>
          {trend && <div className="skeleton-trend"></div>}
        </div>
      ) : (
        <>
          <div className="stat-card-header">
            <span className="stat-title">{title}</span>
            <div className="stat-icon">
              {icon}
            </div>
          </div>
          
          <div className="stat-content">
            <span className="stat-value">{value}</span>
            {subtitle && <span className="stat-subtitle">{subtitle}</span>}
          </div>
          
          {trend && (
            <div className={`stat-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
              <div className="trend-icon">
                {trend.isPositive ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                )}
              </div>
              <span className="trend-value">
                {trend.value}% {trend.label || 'vs mois dernier'}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Composant d'exemple d'utilisation
const StatsGrid = () => {
  const stats = [
    {
      title: "Réservations totales",
      value: "128",
      subtitle: "Ce mois-ci",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Taux d'occupation",
      value: "78%",
      subtitle: "Moyenne quotidienne",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Revenus",
      value: "8 420€",
      subtitle: "Chiffre d'affaires",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      trend: { value: 18, isPositive: true }
    },
    {
      title: "Clients actifs",
      value: "64",
      subtitle: "Ce mois-ci",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      trend: { value: 3, isPositive: false }
    }
  ];

  return (
    <div className="stats-grids">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export { StatsGrid };
export default StatCard;