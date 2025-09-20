import React, { useState, useEffect } from 'react';
import './custom.css';
const OccupationChart = () => {
  const [period, setPeriod] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredData, setHoveredData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const dayData = [
    { time: '8h', occupation: 20, capacity: 100 },
    { time: '10h', occupation: 40, capacity: 100 },
    { time: '12h', occupation: 30, capacity: 100 },
    { time: '14h', occupation: 35, capacity: 100 },
    { time: '16h', occupation: 50, capacity: 100 },
    { time: '18h', occupation: 90, capacity: 100 },
    { time: '20h', occupation: 85, capacity: 100 },
    { time: '22h', occupation: 40, capacity: 100 },
  ];

  const weekData = [
    { time: 'Lun', occupation: 45, capacity: 100 },
    { time: 'Mar', occupation: 52, capacity: 100 },
    { time: 'Mer', occupation: 49, capacity: 100 },
    { time: 'Jeu', occupation: 63, capacity: 100 },
    { time: 'Ven', occupation: 75, capacity: 100 },
    { time: 'Sam', occupation: 95, capacity: 100 },
    { time: 'Dim', occupation: 88, capacity: 100 },
  ];

  const monthData = [
    { time: 'Sem 1', occupation: 58, capacity: 100 },
    { time: 'Sem 2', occupation: 66, capacity: 100 },
    { time: 'Sem 3', occupation: 72, capacity: 100 },
    { time: 'Sem 4', occupation: 80, capacity: 100 },
  ];

  const data = {
    day: dayData,
    week: weekData,
    month: monthData,
  };

  const averageOccupation = {
    day: Math.round(dayData.reduce((sum, item) => sum + item.occupation, 0) / dayData.length),
    week: Math.round(weekData.reduce((sum, item) => sum + item.occupation, 0) / weekData.length),
    month: Math.round(monthData.reduce((sum, item) => sum + item.occupation, 0) / monthData.length),
  };

  const peakOccupation = {
    day: Math.max(...dayData.map(item => item.occupation)),
    week: Math.max(...weekData.map(item => item.occupation)),
    month: Math.max(...monthData.map(item => item.occupation)),
  };

  const renderChartSkeleton = () => (
    <div className="chart-skeleton">
      <div className="skeleton-header"></div>
      <div className="skeleton-chart">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-bar"></div>
        ))}
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-stats"></div>
        <div className="skeleton-stats"></div>
      </div>
    </div>
  );

  return (
    <div className="occupation-chart-card">
      <div className="chart-header">
        <h2>Taux d'occupation</h2>
        <div className="period-selector">
          <button 
            className={`period-btn ${period === 'day' ? 'active' : ''}`}
            onClick={() => setPeriod('day')}
          >
            Jour
          </button>
          <button 
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => setPeriod('week')}
          >
            Semaine
          </button>
          <button 
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            Mois
          </button>
        </div>
      </div>

      <div className="chart-content">
        {isLoading ? (
          renderChartSkeleton()
        ) : (
          <>
            <div className="chart-container">
              <div className="chart-bars">
                {data[period].map((item, index) => (
                  <div key={index} className="bar-container">
                    <div 
                      className="bar-background" 
                      style={{ height: '100%' }}
                    ></div>
                    <div 
                      className="bar-fill" 
                      style={{ 
                        height: `${item.occupation}%`,
                        opacity: hoveredData === item ? 1 : 0.8
                      }}
                      onMouseEnter={() => setHoveredData(item)}
                      onMouseLeave={() => setHoveredData(null)}
                    >
                      {hoveredData === item && (
                        <div className="bar-value">{item.occupation}%</div>
                      )}
                    </div>
                    <div className="bar-label">{item.time}</div>
                  </div>
                ))}
              </div>
              
              {hoveredData && (
                <div 
                  className="chart-tooltip" 
                  style={{ 
                    left: `calc(${(data[period].indexOf(hoveredData) / data[period].length) * 100}% - 60px)`,
                    bottom: 'calc(100% + 10px)'
                  }}
                >
                  <div className="tooltip-content">
                    <span className="tooltip-title">{hoveredData.time}</span>
                    <span className="tooltip-metric">{hoveredData.occupation}% d'occupation</span>
                  </div>
                </div>
              )}
            </div>

            <div className="chart-stats">
              <div className="stat-item">
                <div className="stat-labels">Occupation moyenne</div>
                <div className="stat-values">{averageOccupation[period]}%</div>
                <div className="stat-bar">
                  <div 
                    className="stat-bar-fill" 
                    style={{ width: `${averageOccupation[period]}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-labels">Pic d'occupation</div>
                <div className="stat-values">{peakOccupation[period]}%</div>
                <div className="stat-bar">
                  <div 
                    className="stat-bar-fill peak" 
                    style={{ width: `${peakOccupation[period]}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OccupationChart;