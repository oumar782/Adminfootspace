import React, { useState, useEffect } from 'react';
import { User, Clock, Calendar } from 'lucide-react';
import './gestiheader.css';

const HeaderDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const username = "Jean Dupont";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="hd-header">
      <div className="hd-container">
        {/* Compensation pour la sidebar */}
        <div className="hd-sidebar-space"></div>
        
        <div className="hd-content">
          <div className="hd-time-container">
            <div className="hd-time-card">
              <div className="hd-time-icon-container">
                <Clock size={22} className="hd-time-icon" />
              </div>
              <div className="hd-time-info">
                <span className="hd-current-time">{formatTime(currentTime)}</span>
                <div className="hd-date-info">
                  <Calendar size={16} className="hd-date-icon" />
                  <span className="hd-current-date">{formatDate(currentTime)}</span>
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;