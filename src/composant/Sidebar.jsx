import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [activeHover, setActiveHover] = useState(null);
  const location = useLocation();

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Logo collapsed={collapsed} />
          <button 
            className="collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronIcon collapsed={collapsed} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {sidebarItems.map((item, index) => (
              <SidebarItem 
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
        
        <div className="sidebar-footer">
          <button className="support-button">
            <HelpIcon />
            {!collapsed && <span>Support</span>}
            {!collapsed && <ChevronRightIcon />}
          </button>
        </div>
      </aside>

      <div 
        className={`sidebar-overlay ${collapsed ? 'hidden' : ''}`} 
        onClick={() => setCollapsed(true)}
      />
      
      <style jsx>{`
        :root {
          --primary-color: #4361ee;
          --primary-light: #eef2ff;
          --secondary-color: #3a0ca3;
          --text-color: #2b2d42;
          --text-muted: #6c757d;
          --background: #ffffff;
          --border-color: #e9ecef;
          --hover-background: #f8f9fa;
          --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          --transition: all 0.3s ease;
          --sidebar-width: 260px;
          --sidebar-collapsed: 80px;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: var(--sidebar-width);
          background: var(--background);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          transition: var(--transition);
          box-shadow: var(--shadow);
        }

        .sidebar.collapsed {
          width: var(--sidebar-collapsed);
        }

        .sidebar-header {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .collapse-toggle {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition);
        }

        .collapse-toggle:hover {
          background: var(--hover-background);
          color: var(--text-color);
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 16px 12px;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid var(--border-color);
        }

        .support-button {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition);
        }

        .support-button:hover {
          background: var(--hover-background);
          color: var(--text-color);
        }

        .support-button span {
          flex: 1;
          text-align: left;
          margin-left: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          transition: var(--transition);
        }

        .sidebar-overlay.hidden {
          opacity: 0;
          visibility: hidden;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            box-shadow: none;
          }
          
          .sidebar.collapsed {
            transform: translateX(0);
            width: var(--sidebar-collapsed);
          }
          
          .sidebar:not(.collapsed) {
            transform: translateX(0);
            width: var(--sidebar-width);
            box-shadow: var(--shadow);
          }
        }
      `}</style>
    </>
  );
};

const SidebarItem = ({ item, collapsed, isActive, isHovered, onHover, onLeave }) => {
  return (
    <li 
      className="nav-item"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <NavLink
        to={item.path}
        className={`nav-link ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
      >
        <div className="nav-icon">
          <item.icon />
        </div>
        {!collapsed && <span className="nav-text">{item.title}</span>}
        {isHovered && collapsed && (
          <div className="tooltip">
            {item.title}
          </div>
        )}
        {!collapsed && isActive && (
          <div className="active-indicator"></div>
        )}
      </NavLink>
      
      <style jsx>{`
        .nav-item {
          position: relative;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 8px;
          color: var(--text-muted);
          text-decoration: none;
          transition: var(--transition);
          position: relative;
        }
        
        .nav-link:hover {
          background: var(--hover-background);
          color: var(--text-color);
        }
        
        .nav-link.active {
          background: var(--primary-light);
          color: var(--primary-color);
          font-weight: 500;
        }
        
        .nav-link.collapsed {
          justify-content: center;
          padding: 12px;
        }
        
        .nav-icon {
          display: flex;
          transition: var(--transition);
        }
        
        .nav-link.active .nav-icon {
          color: var(--primary-color);
        }
        
        .nav-text {
          margin-left: 12px;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          transition: var(--transition);
        }
        
        .tooltip {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 8px;
          padding: 6px 12px;
          background: var(--text-color);
          color: white;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1001;
          box-shadow: var(--shadow);
        }
        
        .tooltip:after {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 4px solid transparent;
          border-right-color: var(--text-color);
        }
        
        .active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--primary-color);
          border-radius: 0 2px 2px 0;
        }
      `}</style>
    </li>
  );
};

const Logo = ({ collapsed }) => {
  return (
    <div className="logo">
      <div className="logo-icon">
        <span>F</span>
      </div>
      {!collapsed && (
        <div className="logo-text">
          FootSpace <span className="highlight">Admin</span>
        </div>
      )}
      
      <style jsx>{`
        .logo {
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        
        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          flex-shrink: 0;
        }
        
        .logo-text {
          margin-left: 12px;
          font-size: 18px;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .highlight {
          color: var(--primary-color);
        }
      `}</style>
    </div>
  );
};

// Icônes SVG personnalisées
const LayoutDashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CalendarRangeIcon = () => (
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

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12" y2="17" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronIcon = ({ collapsed }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0)' }}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboardIcon,
    path: "/dashboard",
  },
  {
    title: "Clients",
    icon: UsersIcon,
    path: "/client",
  },
  {
    title: "Réservations",
    icon: CalendarIcon,
    path: "/Reservations",
  },
  {
    title: "Terrains",
    icon: MapPinIcon,
    path: "/terrain",
  },
  {
    title: "Créneaux",
    icon: ClockIcon,
    path: "/creneaux",
  },
  {
    title: "Calendrier",
    icon: CalendarRangeIcon,
    path: "/calendrier",
  },
  {
    title: "Paramètres",
    icon: SettingsIcon,
    path: "/parametres",
  }
];

export default Sidebar;