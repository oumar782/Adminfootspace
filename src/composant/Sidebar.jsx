import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

// Import Orbitron via Google Fonts
const OrbitronFont = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Orbitron', sans-serif;
    }
  `}</style>
);

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [activeHover, setActiveHover] = useState(null);
  const location = useLocation();

  return (
    <>
      <OrbitronFont />
      <aside className={`sidebar-luxe ${collapsed ? 'collapsed-luxe' : ''}`}>
        <div className="sidebar-header-luxe">
          <LogoLuxe collapsed={collapsed} />
          <button 
            className="collapse-toggle-luxe"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronIconLuxe collapsed={collapsed} />
          </button>
        </div>

        <nav className="sidebar-nav-luxe">
          <ul className="nav-list-luxe">
            {sidebarItems.map((item, index) => (
              <SidebarItemLuxe 
                key={index}
                item={item}
                collapsed={collapsed}
                isActive={location.pathname === item.path}
                isHovered={activeHover === index}
                onHover={() => setActiveHover(index)}
                onLeave={() => setActiveHover(null)}
              />
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer-luxe">
          <NavLink to="/contact" className="support-button-luxe">
            <HelpIconLuxe />
            {!collapsed && <span>Support</span>}
            {!collapsed && <ChevronRightIconLuxe />}
          </NavLink>
        </div>
      </aside>

      <div 
        className={`sidebar-overlay-luxe ${collapsed ? 'hidden-luxe' : ''}`} 
        onClick={() => setCollapsed(true)}
      />
      
      <style jsx>{`
        :root {
          --luxe-primary-bg: rgb(255, 252, 252);
          --luxe-secondary-bg: rgb(9, 7, 7);
          --luxe-gold-primary: rgb(6, 64, 23);
          --luxe-gold-secondary: rgb(3, 54, 12);
          --luxe-gold-light: rgb(5, 58, 8);
          --luxe-text-primary: #FFFFFF;
          --luxe-text-secondary: rgb(26, 12, 12);
          --luxe-border-color: #2A2A2A;
          --luxe-hover-background: rgba(212, 175, 55, 0.08);
          --luxe-active-background: rgba(89, 212, 55, 0.15);
          --luxe-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
          --luxe-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --luxe-sidebar-width: 280px;
          --luxe-sidebar-collapsed: 80px;
          --luxe-border-radius: 12px;
        }

        .sidebar-luxe {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: var(--luxe-sidebar-width);
          background: var(--luxe-primary-bg);
          border-right: 1px solid var(--luxe-border-color);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          transition: var(--luxe-transition);
          box-shadow: var(--luxe-shadow);
          font-family: 'Orbitron', sans-serif;
        }

        .sidebar-luxe.collapsed-luxe {
          width: var(--luxe-sidebar-collapsed);
        }

        .sidebar-header-luxe {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          border-bottom: 1px solid var(--luxe-border-color);
          background: linear-gradient(to right, rgba(212, 175, 55, 0.05), transparent);
        }

        .collapse-toggle-luxe {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--luxe-border-color);
          color: var(--luxe-gold-primary);
          cursor: pointer;
          transition: var(--luxe-transition);
        }

        .collapse-toggle-luxe:hover {
          background: var(--luxe-hover-background);
          border-color: var(--luxe-gold-primary);
          transform: rotate(180deg);
        }

        .sidebar-nav-luxe {
          flex: 1;
          overflow-y: auto;
          padding: 24px 16px;
        }

        .nav-list-luxe {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-footer-luxe {
          padding: 20px 16px;
          border-top: 1px solid var(--luxe-border-color);
        }

        .support-button-luxe {
          width: 100%;
          padding: 14px;
          border-radius: var(--luxe-border-radius);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(to right, rgba(212, 175, 55, 0.1), transparent);
          border: 1px solid rgba(212, 175, 55, 0.2);
          color: var(--luxe-gold-light);
          cursor: pointer;
          transition: var(--luxe-transition);
          font-weight: 500;
          text-decoration: none;
        }

        .support-button-luxe:hover {
          background: linear-gradient(to right, rgba(212, 175, 55, 0.2), transparent);
          border-color: var(--luxe-gold-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);
        }

        .support-button-luxe span {
          flex: 1;
          text-align: left;
          margin-left: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .sidebar-overlay-luxe {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          z-index: 999;
          transition: var(--luxe-transition);
        }

        .sidebar-overlay-luxe.hidden-luxe {
          opacity: 0;
          visibility: hidden;
        }

        @media (max-width: 768px) {
          .sidebar-luxe {
            transform: translateX(-100%);
            box-shadow: none;
          }
          
          .sidebar-luxe.collapsed-luxe {
            transform: translateX(0);
            width: var(--luxe-sidebar-collapsed);
          }
          
          .sidebar-luxe:not(.collapsed-luxe) {
            transform: translateX(0);
            width: var(--luxe-sidebar-width);
            box-shadow: var(--luxe-shadow);
          }
        }
      `}</style>
    </>
  );
};

const SidebarItemLuxe = ({ item, collapsed, isActive, isHovered, onHover, onLeave }) => {
  return (
    <li 
      className="nav-item-luxe"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <NavLink
        to={item.path}
        className={`nav-link-luxe ${isActive ? 'active-luxe' : ''} ${collapsed ? 'collapsed-luxe' : ''}`}
      >
        <div className="nav-icon-luxe">
          <item.icon />
        </div>
        {!collapsed && <span className="nav-text-luxe">{item.title}</span>}
        {isHovered && collapsed && (
          <div className="tooltip-luxe">
            {item.title}
          </div>
        )}
        {!collapsed && isActive && (
          <div className="active-indicator-luxe"></div>
        )}
      </NavLink>
      
      <style jsx>{`
        .nav-item-luxe {
          position: relative;
        }
        
        .nav-link-luxe {
          display: flex;
          align-items: center;
          padding: 14px 18px;
          border-radius: var(--luxe-border-radius);
          color: var(--luxe-text-secondary);
          text-decoration: none;
          transition: var(--luxe-transition);
          position: relative;
          overflow: hidden;
          font-family: 'Orbitron', sans-serif;
        }
        
        .nav-link-luxe:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
          transition: left 0.7s ease;
        }
        
        .nav-link-luxe:hover:before {
          left: 100%;
        }
        
        .nav-link-luxe:hover {
          background: var(--luxe-hover-background);
          color: var(--luxe-gold-light);
          transform: translateX(4px);
        }
        
        .nav-link-luxe.active-luxe {
          background: var(--luxe-active-background);
          color: var(--luxe-gold-primary);
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.1);
        }
        
        .nav-link-luxe.collapsed-luxe {
          justify-content: center;
          padding: 14px;
        }
        
        .nav-icon-luxe {
          display: flex;
          transition: var(--luxe-transition);
        }
        
        .nav-link-luxe.active-luxe .nav-icon-luxe {
          color: var(--luxe-gold-primary);
          filter: drop-shadow(0 0 4px rgba(212, 175, 55, 0.4));
        }
        
        .nav-text-luxe {
          margin-left: 14px;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          transition: var(--luxe-transition);
          letter-spacing: 0.3px;
        }
        
        .tooltip-luxe {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 12px;
          padding: 8px 14px;
          background: var(--luxe-primary-bg);
          color: var(--luxe-gold-light);
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1001;
          box-shadow: var(--luxe-shadow);
          border: 1px solid var(--luxe-border-color);
          font-weight: 500;
          font-family: 'Orbitron', sans-serif;
        }
        
        .tooltip-luxe:after {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: var(--luxe-primary-bg);
        }
        
        .active-indicator-luxe {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 24px;
          background: linear-gradient(to bottom, var(--luxe-gold-primary), var(--luxe-gold-secondary));
          border-radius: 0 2px 2px 0;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </li>
  );
};

const LogoLuxe = ({ collapsed }) => {
  return (
    <div className="logo-luxe">
      <div className="logo-icon-luxe">
        <span>F</span>
      </div>
      {!collapsed && (
        <div className="logo-text-luxe">
          FootSpace <span className="highlight-luxe">Admin</span>
        </div>
      )}
      
      <style jsx>{`
        .logo-luxe {
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        
        .logo-icon-luxe {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--luxe-gold-primary), var(--luxe-gold-secondary));
          color: var(--luxe-primary-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 20px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
          font-family: 'Orbitron', sans-serif;
        }
        
        .logo-text-luxe {
          margin-left: 14px;
          font-size: 20px;
          font-weight: 700;
          white-space: nowrap;
          color: black;
          letter-spacing: 0.5px;
          font-family: 'Orbitron', sans-serif;
        }
        
        .highlight-luxe {
          background: linear-gradient(135deg, var(--luxe-gold-primary), var(--luxe-gold-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          font-weight: 800;
          font-family: 'Orbitron', sans-serif;
        }
      `}</style>
    </div>
  );
};

// Icônes SVG personnalisées avec style doré
const createGoldenIcon = (IconComponent) => {
  return ({ isActive }) => (
    <IconComponent 
      style={{ 
        color: isActive ? 'var(--luxe-gold-primary)' : 'currentColor',
        filter: isActive ? 'drop-shadow(0 0 2px rgba(212, 175, 55, 0.4))' : 'none'
      }} 
    />
  );
};

const LayoutDashboardIconLuxe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const UsersIconLuxe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CalendarIconLuxe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MapPinIconLuxe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIconLuxe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CalendarRangeIconLuxe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

const SettingsIconLuxe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const HelpIconLuxe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12" y2="17" />
  </svg>
);

const ChevronRightIconLuxe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronIconLuxe = ({ collapsed }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboardIconLuxe,
    path: "/dashboard",
  },
  {
    title: "Clients",
    icon: UsersIconLuxe,
    path: "/client",
  },
  {
    title: "Réservations",
    icon: CalendarIconLuxe,
    path: "/reservations",
  },
  {
    title: "Terrains",
    icon: MapPinIconLuxe,
    path: "/terrain",
  },
  {
    title: "Créneaux",
    icon: ClockIconLuxe,
    path: "/creneaux",
  },
  {
    title: "Calendrier",
    icon: CalendarRangeIconLuxe,
    path: "/calendrier",
  },
  {
    title: "Utilisateurs",
    icon: UsersIconLuxe, // Icône cohérente pour la gestion des utilisateurs
    path: "/user",
  },
  {
    title: "Contact",
    icon: HelpIconLuxe,
    path: "/contact",
  }
];

export default Sidebar;