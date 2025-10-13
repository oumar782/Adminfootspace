import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  User,
  Menu,
  X
} from 'lucide-react';
import './sidebarStyles.css';

const SidebarNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const menus = [
    { 
      id: 'reservations', 
      label: 'Gestion des Réservations', 
      icone: <Calendar size={20} />, 
      path: '/interface-gestionnaire/Gestion-reservations' 
    },
    { 
      id: 'creneaux', 
      label: 'Gestion des Créneaux', 
      icone: <Clock size={20} />, 
      path: '/interface-gestionnaire/Gestion-creneau' 
    },
    { 
      id: 'calendrier', 
      label: 'Suivi de Calendrier', 
      icone: <Calendar size={20} />, 
      path: '/interface-gestionnaire/suivi-calendrier' 
    },
    { 
      id: 'clients', 
      label: 'Gestion des Clients', 
      icone: <Users size={20} />, 
      path: '/interface-gestionnaire/Gestion-client' 
    }
  ];
  const estMenuActif = (menuPath) => {
    return location.pathname.startsWith(menuPath);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Bouton mobile */}
      <button 
        className="sidebar-mobile-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay mobile */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={`sidebar-container ${isMobileOpen ? 'mobile-ouvert' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon"></div>
            <h2 className="sidebar-titre">Footspace</h2>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="sidebar-liste">
            {menus.map((menu) => (
              <li key={menu.id} className="sidebar-element">
                <button
                  className={`sidebar-lien ${estMenuActif(menu.path) ? 'sidebar-lien-actif' : ''}`}
                  onClick={() => handleNavigation(menu.path)}
                >
                  <span className="sidebar-icone">{menu.icone}</span>
                  <span className="sidebar-texte">{menu.label}</span>
                  <div className="active-indicator" />
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              <User size={20} />
            </div>
            <div className="sidebar-info">
              <p className="sidebar-nom">Utilisateur</p>
              <p className="sidebar-role">Administrateur</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarNavigation;