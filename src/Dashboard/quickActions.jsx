import React, { useState } from 'react';
import './custom.css';
const QuickActions = () => {
  const [clickedAction, setClickedAction] = useState(null);

  const actions = [
    {
      id: "new-reservation",
      title: "Nouvelle réservation",
      description: "Créer une réservation pour un client",
      icon: CalendarIcon,
      color: "#4361ee",
      bgColor: "#eef2ff",
      action: () => {
        setClickedAction("new-reservation");
        setTimeout(() => setClickedAction(null), 1000);
        console.log("Nouvelle réservation");
      }
    },
    {
      id: "new-client",
      title: "Nouveau client",
      description: "Ajouter un nouveau client au système",
      icon: PlusCircleIcon,
      color: "#3b82f6",
      bgColor: "#dbeafe",
      action: () => {
        setClickedAction("new-client");
        setTimeout(() => setClickedAction(null), 1000);
        console.log("Nouveau client");
      }
    },
    {
      id: "check-payments",
      title: "Vérifier paiements",
      description: "Voir les paiements en attente",
      icon: ClipboardCheckIcon,
      color: "#f59e0b",
      bgColor: "#ffedd5",
      action: () => {
        setClickedAction("check-payments");
        setTimeout(() => setClickedAction(null), 1000);
        console.log("Vérifier paiements");
      }
    },
    {
      id: "support-client",
      title: "Support client",
      description: "Répondre aux messages",
      icon: MessageSquareIcon,
      color: "#8b5cf6",
      bgColor: "#f3e8ff",
      action: () => {
        setClickedAction("support-client");
        setTimeout(() => setClickedAction(null), 1000);
        console.log("Support client");
      }
    },
    {
      id: "reports",
      title: "Générer rapport",
      description: "Créer un rapport d'activité",
      icon: BarChartIcon,
      color: "#10b981",
      bgColor: "#d1fae5",
      action: () => {
        setClickedAction("reports");
        setTimeout(() => setClickedAction(null), 1000);
        console.log("Générer rapport");
      }
    },
    {
      id: "settings",
      title: "Paramètres",
      description: "Configurer les préférences",
      icon: SettingsIcon,
      color: "#6b7280",
      bgColor: "#f3f4f6",
      action: () => {
        setClickedAction("settings");
        setTimeout(() => setClickedAction(null), 1000);
        console.log("Paramètres");
      }
    }
  ];

  return (
    <div className="quick-actions-card">
      <div className="card-header">
        <h2>Actions rapides</h2>
        <p>Accédez rapidement aux fonctionnalités essentielles</p>
      </div>

      <div className="actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`action-button ${clickedAction === action.id ? 'clicked' : ''}`}
            onClick={action.action}
            aria-label={action.title}
          >
            <div className="action-icon" style={{ backgroundColor: action.bgColor }}>
              <action.icon color={action.color} />
            </div>
            
            <div className="action-content">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>

            <div className="action-hover-effect"></div>
            
            {clickedAction === action.id && (
              <div className="action-confirmation">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Icônes SVG personnalisées
const CalendarIcon = ({ color = "#4361ee" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const PlusCircleIcon = ({ color = "#3b82f6" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const ClipboardCheckIcon = ({ color = "#f59e0b" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
    <rect x="9" y="3" width="6" height="4" rx="2"></rect>
    <path d="M9 14l2 2 4-4"></path>
  </svg>
);

const MessageSquareIcon = ({ color = "#8b5cf6" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const BarChartIcon = ({ color = "#10b981" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const SettingsIcon = ({ color = "#6b7280" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h-.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export default QuickActions;