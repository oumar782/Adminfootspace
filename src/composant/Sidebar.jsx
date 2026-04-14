import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  Clock,
  CalendarRange,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  Building2,
  Sparkles
} from 'lucide-react';
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
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
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
            <HelpCircle size={20} />
            {!collapsed && <span>Support</span>}
            {!collapsed && <ChevronRight size={16} />}
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
  const IconComponent = item.icon;
  
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
          <IconComponent 
            size={20}
            style={{ 
              color: isActive ? 'var(--luxe-gold-primary)' : 'currentColor',
              filter: isActive ? 'drop-shadow(0 0 2px rgba(212, 175, 55, 0.4))' : 'none'
            }}
          />
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
        <Sparkles size={22} color="white" />
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

// Configuration des items du sidebar avec les icônes Lucide
const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Abonnements",
    icon: Users,
    path: "/client",
  },
  {
    title: "Réservations",
    icon: Calendar,
    path: "/reservations",
  },
  {
    title: "Terrains",
    icon: MapPin,
    path: "/terrain",
  },
  {
    title: "Créneaux",
    icon: Clock,
    path: "/creneaux",
  },
  {
    title: "Souscriptions",
    icon: CalendarRange,
    path: "/souscriptions",
  },
  {
    title: "Démonstration",
    icon: Sparkles,
    path: "/Demonstration",
  },
  {
    title: "Utilisateurs",
    icon: Users,
    path: "/user",
  },
  {
    title: "Contact",
    icon: Phone,
    path: "/contact",
  }
];

export default Sidebar;