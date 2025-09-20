import React, { useState } from 'react';
import './custom.css';

const RecentReservations = () => {
  const [expandedReservation, setExpandedReservation] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const reservations = [
    {
      id: "RES-001",
      client: {
        name: "Thomas Dubois",
        initials: "TD",
        email: "thomas.dubois@email.com"
      },
      field: "Terrain 1 - Gazon synthétique",
      date: "25 Avr, 2025",
      time: "18:00 - 19:30",
      duration: "1h30",
      status: "confirmé",
      players: 10,
      amount: 85
    },
    {
      id: "RES-002",
      client: {
        name: "Marie Laurent",
        initials: "ML",
        email: "marie.laurent@email.com"
      },
      field: "Terrain 3 - Futsal",
      date: "25 Avr, 2025",
      time: "19:30 - 21:00",
      duration: "1h30",
      status: "confirmé",
      players: 8,
      amount: 65
    },
    {
      id: "RES-003",
      client: {
        name: "Laurent Petit",
        initials: "LP",
        email: "laurent.petit@email.com"
      },
      field: "Terrain 2 - Pelouse naturelle",
      date: "26 Avr, 2025",
      time: "10:00 - 11:30",
      duration: "1h30",
      status: "en attente",
      players: 12,
      amount: 120
    },
    {
      id: "RES-004",
      client: {
        name: "Sophie Martin",
        initials: "SM",
        email: "sophie.martin@email.com"
      },
      field: "Terrain 1 - Gazon synthétique",
      date: "26 Avr, 2025",
      time: "14:00 - 16:00",
      duration: "2h00",
      status: "annulé",
      players: 14,
      amount: 140
    },
    {
      id: "RES-005",
      client: {
        name: "Alexandre Bernard",
        initials: "AB",
        email: "alex.bernard@email.com"
      },
      field: "Terrain 4 - Extérieur",
      date: "27 Avr, 2025",
      time: "16:30 - 18:00",
      duration: "1h30",
      status: "confirmé",
      players: 16,
      amount: 110
    }
  ];

  const filteredReservations = filterStatus === "all" 
    ? reservations 
    : reservations.filter(res => res.status === filterStatus);

  const toggleExpand = (id) => {
    setExpandedReservation(expandedReservation === id ? null : id);
  };

  const statusCounts = {
    all: reservations.length,
    confirmé: reservations.filter(r => r.status === "confirmé").length,
    "en attente": reservations.filter(r => r.status === "en attente").length,
    annulé: reservations.filter(r => r.status === "annulé").length,
  };

  return (
    <div className="reservations-card">
      <div className="card-header">
        <div className="header-contentsss">
          <h2>Réservations récentes</h2>
          <p>Gérez les réservations de vos terrains</p>
        </div>
        <button className="view-all-btn">
          Voir tout
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="filters">
        <button 
          className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          Tous <span className="count-badge">{statusCounts.all}</span>
        </button>
        <button 
          className={`filter-btn ${filterStatus === "confirmé" ? "active" : ""}`}
          onClick={() => setFilterStatus("confirmé")}
        >
          Confirmés <span className="count-badge">{statusCounts.confirmé}</span>
        </button>
        <button 
          className={`filter-btn ${filterStatus === "en attente" ? "active" : ""}`}
          onClick={() => setFilterStatus("en attente")}
        >
          En attente <span className="count-badge">{statusCounts["en attente"]}</span>
        </button>
        <button 
          className={`filter-btn ${filterStatus === "annulé" ? "active" : ""}`}
          onClick={() => setFilterStatus("annulé")}
        >
          Annulés <span className="count-badge">{statusCounts.annulé}</span>
        </button>
      </div>

      <div className="reservations-list">
        {filteredReservations.map((reservation) => (
          <div 
            key={reservation.id} 
            className={`reservation-item ${expandedReservation === reservation.id ? "expanded" : ""}`}
            onClick={() => toggleExpand(reservation.id)}
          >
            <div className="reservation-main">
              <div className="client-info">
                <div className="avatar">
                  {reservation.client.avatar ? (
                    <img src={reservation.client.avatar} alt={reservation.client.name} />
                  ) : (
                    <span>{reservation.client.initials}</span>
                  )}
                </div>
                <div className="client-details">
                  <h3>{reservation.client.name}</h3>
                  <p>{reservation.field}</p>
                </div>
              </div>

              <div className="reservation-details">
                <div className="time-info">
                  <span className="date">{reservation.date}</span>
                  <span className="time">{reservation.time}</span>
                </div>
                <StatusBadge status={reservation.status} />
              </div>

              <div className="expand-icon">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ transform: expandedReservation === reservation.id ? "rotate(180deg)" : "rotate(0)" }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            {expandedReservation === reservation.id && (
              <div className="reservation-expanded">
                <div className="expanded-details">
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{reservation.client.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Durée</span>
                    <span className="detail-value">{reservation.duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Joueurs</span>
                    <span className="detail-value">{reservation.players} personnes</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Montant</span>
                    <span className="detail-value">{reservation.amount}€</span>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <button className="action-btn primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Envoyer un email
                  </button>
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Contacter
                  </button>
                  {reservation.status === "en attente" && (
                    <button className="action-btn success">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      Confirmer
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "confirmé":
        return {
          color: "#10b981",
          bgColor: "#ecfdf5",
          text: "Confirmé"
        };
      case "en attente":
        return {
          color: "#f59e0b",
          bgColor: "#ffedd5",
          text: "En attente"
        };
      case "annulé":
        return {
          color: "#ef4444",
          bgColor: "#fef2f2",
          text: "Annulé"
        };
      default:
        return {
          color: "#6b7280",
          bgColor: "#f3f4f6",
          text: "Inconnu"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span 
      className="status-badge"
      style={{ 
        backgroundColor: config.bgColor,
        color: config.color
      }}
    >
      {config.text}
    </span>
  );
};

export default RecentReservations;