import React, { useState, useEffect } from 'react';
import './prevision.css';

const PrevisionForecast = () => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const forecastData = [
    { day: "J+1", prevision: 82, date: "12 Nov", trend: "up" },
    { day: "J+2", prevision: 75, date: "13 Nov", trend: "down" },
    { day: "J+3", prevision: 68, date: "14 Nov", trend: "down" },
    { day: "J+4", prevision: 82, date: "15 Nov", trend: "up" },
    { day: "J+5", prevision: 94, date: "16 Nov", trend: "up" },
    { day: "J+6", prevision: 97, date: "17 Nov", trend: "up" },
    { day: "J+7", prevision: 95, date: "18 Nov", trend: "down" },
    { day: "J+8", prevision: 85, date: "19 Nov", trend: "down" },
    { day: "J+9", prevision: 75, date: "20 Nov", trend: "down" },
    { day: "J+10", prevision: 72, date: "21 Nov", trend: "down" },
    { day: "J+11", prevision: 78, date: "22 Nov", trend: "up" },
    { day: "J+12", prevision: 82, date: "23 Nov", trend: "up" },
    { day: "J+13", prevision: 85, date: "24 Nov", trend: "up" },
    { day: "J+14", prevision: 92, date: "25 Nov", trend: "up" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const averagePrevision = Math.round(
    forecastData.reduce((sum, item) => sum + item.prevision, 0) / forecastData.length
  );

  const peakDay = forecastData.reduce(
    (max, item) => (item.prevision > max.prevision ? item : max),
    forecastData[0]
  );

  const renderSkeleton = () => (
    <div className="forecast-skeleton">
      <div className="skeleton-header"></div>
      <div className="skeleton-chart">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="skeleton-bar" style={{ height: `${30 + Math.random() * 60}%` }}></div>
        ))}
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-stat"></div>
        <div className="skeleton-stat"></div>
      </div>
    </div>
  );

  const getTrendIcon = (trend) => {
    if (trend === "up") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      );
    } else {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      );
    }
  };

  return (
    <div className="forecast-card">
      <div className="forecast-header">
        <h2>Prévisions à 14 jours</h2>
        <div className="header-actions">
          <button className="action-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button>
          <button className="action-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div className="forecast-content">
        {isLoading ? (
          renderSkeleton()
        ) : (
          <>
            <div className="forecast-chart">
              {forecastData.map((item, index) => (
                <div
                  key={index}
                  className="chart-column"
                  onMouseEnter={() => setHoveredDay(index)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div className="column-background">
                    <div
                      className="column-fill"
                      style={{ height: `${item.prevision}%` }}
                    ></div>
                  </div>
                  <div className="column-label">{item.day.replace("J+", "")}</div>
                  
                  {hoveredDay === index && (
                    <div className="column-tooltip">
                      <div className="tooltip-date">{item.date}</div>
                      <div className="tooltip-value">
                        {item.prevision}% d'occupation
                      </div>
                      <div className="tooltip-trend">
                        {getTrendIcon(item.trend)}
                        {item.trend === "up" ? "En hausse" : "En baisse"}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="forecast-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Moyenne sur 14 jours</div>
                  <div className="stat-value">{averagePrevision}%</div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon peak">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Jour le plus chargé</div>
                  <div className="stat-value">{peakDay.day.replace("J+", "")} ({peakDay.prevision}%)</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrevisionForecast;