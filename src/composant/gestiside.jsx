import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  User,
  Menu,
  X,
  LogOut,
  ChevronRight
} from 'lucide-react';
import './sidebarStyles.css';

const SidebarNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [activeSubMenu, setActiveSubMenu] = React.useState(null);

  const [userInfo, setUserInfo] = React.useState({
    email: '',
    role: ''
  });

  React.useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setUserInfo({
          email: parsedData.email || 'Utilisateur',
          role: parsedData.typeuser || 'Administrateur'
        });
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
      }
    }
  }, []);

  const menus = [
    { 
      id: 'reservations', 
      label: 'Réservations', 
      icone: <Calendar size={18} />, 
      path: '/interface-gestionnaire/Gestion-reservations',
      description: 'Gestion des réservations',
      color: '#00ff88'
    },
    { 
      id: 'creneaux', 
      label: 'Créneaux', 
      icone: <Clock size={18} />, 
      path: '/interface-gestionnaire/Gestion-creneau',
      description: 'Gestion des créneaux',
      color: '#ffaa00'
    },
    { 
      id: 'calendrier', 
      label: 'Calendrier', 
      icone: <Calendar size={18} />, 
      path: '/interface-gestionnaire/suivi-calendrier',
      description: 'Suivi calendrier',
      color: '#ff4d4d'
    },
    { 
      id: 'statistiques', // ID unique changé de 'calendrier' à 'statistiques'
      label: 'Statistique Réservation', 
      icone: <Calendar size={18} />, 
      path: '/interface-gestionnaire/suivi-reservation',
      description: 'Suivi reservation',
      color: '#ff4d4d'
    },{ 
      id: 'statistiques', // ID unique changé de 'calendrier' à 'statistiques'
      label: 'Suivi Occupation', 
      icone: <Calendar size={18} />, 
      path: '/interface-gestionnaire/suivi-Occupation',
      description: 'Suivi Occupation',
      color: '#ff4d4d'
    },
    { 
      id: 'statistiques', // ID unique changé de 'calendrier' à 'statistiques'
      label: 'Suivi Annulation', 
      icone: <Calendar size={18} />, 
      path: '/interface-gestionnaire/suivi-Annulation',
      description: 'Suivi Annulation',
      color: '#ff4d4d'
    },
    { 
      id: 'clients', 
      label: 'Abonnement', 
      icone: <Users size={18} />, 
      path: '/interface-gestionnaire/Gestion-client',
      description: 'Gestion des abonnements',
      color: '#aa88ff'
    }
  ];

  const estMenuActif = (menuPath) => {
    return location.pathname.startsWith(menuPath);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    navigate('/login');
    setIsMobileOpen(false);
  };

  const toggleSubMenu = (id) => {
    setActiveSubMenu(activeSubMenu === id ? null : id);
  };

  return (
    <>
      <button 
        className={`sidebar-mobile-toggle ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div 
        className={`sidebar-container ${isMobileOpen ? 'mobile-ouvert' : ''} ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="sidebar-gradient-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="logo-3d-container">
                <div className="logo-3d">
                  <span className="logo-letter">F</span>
                  <span className="logo-letter">S</span>
                </div>
              </div>
              <div className="logo-text-container">
                <h2 className="sidebar-titre">FootSpace</h2>
                <span className="sidebar-subtitle">Gestionnaire</span>
              </div>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <div className="nav-section">
              <span className="nav-section-title">Menu Principal</span>
              <ul className="sidebar-liste">
                {menus.map((menu, index) => (
                  <li 
                    key={menu.id} 
                    className={`sidebar-element ${estMenuActif(menu.path) ? 'actif' : ''}`}
                    style={{ '--index': index }}
                  >
                    <button
                      className={`sidebar-lien ${estMenuActif(menu.path) ? 'sidebar-lien-actif' : ''}`}
                      onClick={() => handleNavigation(menu.path)}
                    >
                      <span className="sidebar-icone-wrapper" style={{ '--menu-color': menu.color }}>
                        <span className="sidebar-icone">{menu.icone}</span>
                      </span>
                      
                      <div className="sidebar-texte-container">
                        <span className="sidebar-texte">{menu.label}</span>
                        <span className="sidebar-description">{menu.description}</span>
                      </div>
                      
                      <div className="active-indicator">
                        <ChevronRight size={14} />
                      </div>

                      <div className="lien-hover-effect">
                        <div className="effect-glow"></div>
                        <div className="effect-line"></div>
                      </div>
                    </button>

                    {activeSubMenu === menu.id && (
                      <div className="sidebar-submenu">
                        <div className="submenu-item">Voir tout</div>
                        <div className="submenu-item">Statistiques</div>
                        <div className="submenu-item">Paramètres</div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          
          <div className="sidebar-footer">
            <div className="sidebar-user-card">
              <div className="sidebar-avatar">
                <div className="avatar-glow"></div>
                <User size={18} />
              </div>
              <div className="sidebar-info">
                <p className="sidebar-nom">{userInfo.email ? userInfo.email.split('@')[0] : 'Utilisateur'}</p>
                <p className="sidebar-role">{userInfo.role}</p>
              </div>
              <div className="user-status"></div>
            </div>
            
            <div className="footer-actions">
              <button 
                className="sidebar-logout-btn"
                onClick={handleLogout}
                title="Déconnexion"
              >
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </div>

            <div className="sidebar-footer-bottom">
              <span className="version">v2.0.1</span>
              <span className="copyright">© 2024 FootSpace</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarNavigation;