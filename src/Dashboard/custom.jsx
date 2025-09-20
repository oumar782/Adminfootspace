import React, { useState } from 'react';
import './custom.css';
const CustomizeDashboard = () => {
  const [widgets, setWidgets] = useState([
    { 
      id: "stats", 
      name: "Statistiques principales", 
      description: "Vue d'ensemble de vos indicateurs clés",
      enabled: true,
      category: "general"
    },
    { 
      id: "reservations", 
      name: "Réservations récentes", 
      description: "Dernières réservations effectuées",
      enabled: true,
      category: "reservations"
    },
    { 
      id: "occupancy", 
      name: "Taux d'occupation", 
      description: "Occupation de vos terrains en temps réel",
      enabled: true,
      category: "analytics"
    },
    { 
      id: "quickactions", 
      name: "Actions rapides", 
      description: "Accès direct aux fonctionnalités fréquentes",
      enabled: true,
      category: "general"
    },
    { 
      id: "revenue", 
      name: "Revenus", 
      description: "Analyse de vos revenus et tendances",
      enabled: false,
      category: "analytics"
    },
    { 
      id: "upcoming", 
      name: "Réservations à venir", 
      description: "Planning des prochaines réservations",
      enabled: false,
      category: "reservations"
    },
    { 
      id: "weather", 
      name: "Météo", 
      description: "Conditions météo pour vos terrains",
      enabled: false,
      category: "external"
    },
    { 
      id: "performance", 
      name: "Performance", 
      description: "Comparaison avec la période précédente",
      enabled: false,
      category: "analytics"
    },
  ]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [isDragging, setIsDragging] = useState(false);
  const [dragItemId, setDragItemId] = useState(null);

  const handleToggleWidget = (id) => {
    setWidgets(
      widgets.map((widget) =>
        widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
      )
    );
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    setIsDragging(true);
    setDragItemId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setDragItemId(null);
    // Logique de réorganisation des widgets ici
  };

  const categories = [
    { id: "all", name: "Tous les widgets" },
    { id: "general", name: "Général" },
    { id: "reservations", name: "Réservations" },
    { id: "analytics", name: "Analytique" },
    { id: "external", name: "Externes" },
  ];

  const filteredWidgets = activeCategory === "all" 
    ? widgets 
    : widgets.filter(widget => widget.category === activeCategory);

  return (
    <div className="customize-dashboard">
      <div className="dashboard-header">
        <h2>Personnaliser le tableau de bord</h2>
        <p>Sélectionnez et organisez les widgets à afficher</p>
      </div>

      <div className="dashboard-content">
        <div className="categories">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="widgets-grid">
          {filteredWidgets.map((widget) => (
            <div
              key={widget.id}
              className={`widget-item ${widget.enabled ? 'enabled' : 'disabled'} ${dragItemId === widget.id ? 'dragging' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, widget.id)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="widget-header">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={widget.enabled}
                    onChange={() => handleToggleWidget(widget.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <div className="drag-handle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 9h4v2h-4zM10 13h4v2h-4zM10 5h4v2h-4z" />
                  </svg>
                </div>
              </div>
              
              <div className="widget-content">
                <h3>{widget.name}</h3>
                <p>{widget.description}</p>
              </div>
              
              <div className="widget-footer">
                <span className={`widget-badge ${widget.category}`}>
                  {categories.find(c => c.id === widget.category)?.name}
                </span>
                <div className={`widget-status ${widget.enabled ? 'active' : 'inactive'}`}>
                  {widget.enabled ? 'Activé' : 'Désactivé'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="add-widget-btn">
          <div className="btn-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span>Ajouter un widget personnalisé</span>
        </button>
      </div>
    </div>
  );
};

export default CustomizeDashboard;