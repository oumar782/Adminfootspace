import StatCard from "../Dashboard/statcard";
import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp, Users, DollarSign, Calendar, PieChart, LineChart,
  XCircle, Download, RefreshCw, MoreHorizontal,
  MessageCircle, UserPlus, Activity, BarChart3
} from 'lucide-react';

import RecentReservations from "../Dashboard/recentReservations";
import OccupationChart from "../Dashboard/occupation";
import PrevisionForecast from "../Dashboard/prevision";
import Annulation from "../Dashboard/Annulation";
import AnalyseMensuelle from "../Dashboard/Annalyse-financiere";
import Abonne from "../Dashboard/Abonne";
import Sous from "../Dashboard/Souscription";
import Anademo from "../Dashboard/Analysedemo";
import Anacontact from "../Dashboard/Anacontact";
import Analysereserve from "../Dashboard/Analyse-reservation";

/* ─── Error Boundary ─── */
class FsDashErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('[FsDash] Erreur capturée:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fsdash-error-box">
          <XCircle size={40} />
          <h3>Erreur de chargement</h3>
          <p>Le composant « {this.props.componentName} » n'a pas pu être chargé.</p>
          <button onClick={() => window.location.reload()}>Rafraîchir</button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── Composants enregistrés ─── */
const COMPONENTS = [
  { id: 'analyse-reservation', name: 'Analyse Réservation',  icon: BarChart3,      component: Analysereserve },
  { id: 'abonne',              name: 'Abonnés',               icon: Users,          component: Abonne },
  { id: 'financier',           name: 'Analyse Financière',    icon: DollarSign,     component: AnalyseMensuelle },
  { id: 'occupation',          name: "Taux d'Occupation",     icon: PieChart,       component: OccupationChart },
  { id: 'prevision',           name: 'Prévisions',            icon: LineChart,      component: PrevisionForecast },
  { id: 'annulation',          name: "Taux d'Annulation",     icon: XCircle,        component: Annulation },
  { id: 'reservations',        name: 'Réservations recente',          icon: Calendar,       component: RecentReservations },
  { id: 'contact',             name: 'Analyse Contact',       icon: MessageCircle,  component: Anacontact },
];

/* ─── Helper période ─── */
const periodLabel = (f) =>
  ({ today: "Aujourd'hui", week: 'Cette semaine', month: 'Ce mois' }[f] ?? 'Période');

/* ════════════════════════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const [showWelcome,     setShowWelcome]     = useState(true);
  const [isLoading,       setIsLoading]       = useState(true);
  const [activeFilter,    setActiveFilter]    = useState('today');
  const [activeId,        setActiveId]        = useState('analyse-reservation');
  const [panelKey,        setPanelKey]        = useState(0);   // force remount propre
  const [animating,       setAnimating]       = useState(false);
  const tabsRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  /* Changement fluide avec micro-fade */
  const handleTabChange = (id) => {
    if (id === activeId || isLoading || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveId(id);
      setPanelKey(k => k + 1);
      setAnimating(false);
    }, 180);
  };

  /* Scroll tab active en vue */
  useEffect(() => {
    if (!tabsRef.current) return;
    const activeEl = tabsRef.current.querySelector('.fsdash-tab--active');
    if (activeEl) activeEl.scrollIntoView({ inline: 'nearest', behavior: 'smooth', block: 'nearest' });
  }, [activeId]);

  const active    = COMPONENTS.find(c => c.id === activeId) ?? COMPONENTS[0];
  const ActiveIcon = active.icon;
  const ActiveComp = active.component;

  return (
    <div className="fsdash">

      {/* ── WELCOME ── */}
      {showWelcome && (
        <div className="fsdash-welcome">
          <div className="fsdash-welcome__shine" />
          <div className="fsdash-welcome__orb fsdash-welcome__orb--a" />
          <div className="fsdash-welcome__orb fsdash-welcome__orb--b" />
          <div className="fsdash-welcome__body">
            <div>
              <span className="fsdash-eyebrow">FOOTSPACE ADMIN SUITE</span>
              <h1 className="fsdash-welcome__title fsdash-orbitron">Bienvenue sur votre tableau de bord</h1>
              <p className="fsdash-welcome__sub">Voici un aperçu complet de l'activité de votre plateforme.</p>
            </div>
            <button className="fsdash-btn-ghost" onClick={() => setShowWelcome(false)}>Masquer</button>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="fsdash-header">
        <div className="fsdash-header__left">
          <span className="fsdash-badge">ANALYTICS</span>
          <h2 className="fsdash-header__title fsdash-orbitron">Tableau de bord</h2>
          <p className="fsdash-header__sub">Performances en temps réel</p>
        </div>
        <div className="fsdash-filters">
          {['today','week','month'].map(f => (
            <button
              key={f}
              className={`fsdash-filter${activeFilter === f ? ' fsdash-filter--active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {periodLabel(f)}
            </button>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="fsdash-stats">
        <StatCard
          title="Revenus"
          value={isLoading ? '—' : '0 €'}
          subtitle={periodLabel(activeFilter)}
          icon={<TrendingUp size={22} />}
          trend={null}
          className="primary"
          loading={isLoading}
        />
      </div>

      {/* ── TABS ── */}
      <div className="fsdash-tabs" ref={tabsRef}>
        {COMPONENTS.map(({ id, name, icon: Icon }) => {
          const isAct = id === activeId;
          return (
            <button
              key={id}
              className={`fsdash-tab${isAct ? ' fsdash-tab--active' : ''}`}
              onClick={() => handleTabChange(id)}
              disabled={isLoading || animating}
              title={name}
            >
              <span className={`fsdash-tab__icon${isAct ? ' fsdash-tab__icon--active' : ''}`}>
                <Icon size={15} />
              </span>
              <span className="fsdash-tab__label">{name}</span>
              {isAct && <span className="fsdash-tab__pip" />}
            </button>
          );
        })}
      </div>

      {/* ── PANEL ── */}
      <div className={`fsdash-panel${animating ? ' fsdash-panel--out' : ''}`}>
        {/* header du panel */}
        <div className="fsdash-panel__head">
          <div className="fsdash-panel__orb" />
          <div className="fsdash-panel__meta">
            <div className="fsdash-panel__icon-wrap">
              <ActiveIcon size={19} />
            </div>
            <div>
              <span className="fsdash-panel__eyebrow">Module actif</span>
              <h3 className="fsdash-panel__name fsdash-orbitron">{active.name}</h3>
            </div>
          </div>
          <div className="fsdash-panel__actions">
            <button className="fsdash-act-btn" title="Exporter">    <Download     size={15} /></button>
            <button className="fsdash-act-btn" title="Actualiser">  <RefreshCw    size={15} /></button>
            <button className="fsdash-act-btn" title="Options">     <MoreHorizontal size={15} /></button>
          </div>
        </div>

        {/* contenu */}
        <div className="fsdash-panel__body">
          <FsDashErrorBoundary key={panelKey} componentName={active.name}>
            <ActiveComp />
          </FsDashErrorBoundary>
        </div>
      </div>

      {/* ═══════════════ STYLES ═══════════════ */}
      <style>{`
        /* ─── Fonts ─── */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ─── Orbitron utilitaire – grands titres ─── */
        .fsdash-orbitron {
          font-family: 'Orbitron', sans-serif !important;
          letter-spacing: .04em;
        }

        /* ─── Tokens ─── */
        .fsdash {
          --fs-primary:   #1a3d06;
          --fs-mid:       #166b1a;
          --fs-accent:    #18c93c;
          --fs-accent2:   #5dff85;
          --fs-text:      #1c2229;
          --fs-muted:     #6d7a86;
          --fs-bg:        #f3f6f4;
          --fs-card:      #ffffff;
          --fs-border:    #e0e8e2;
          --fs-hover:     #edf4ef;
          --fs-danger:    #c0392b;
          --fs-shadow:    0 4px 16px rgba(26,61,6,.07);
          --fs-shadow-lg: 0 8px 32px rgba(26,61,6,.13);
          --fs-r:         16px;
          --fs-t:         all .22s cubic-bezier(.4,0,.2,1);
          font-family: 'DM Sans', sans-serif;
          background: var(--fs-bg);
          padding: 28px;
          max-width: 1440px;
          margin: 50px auto 0 100px;
          width: calc(100% - 100px);
          box-sizing: border-box;
        }

        /* ─── WELCOME ─── */
        .fsdash-welcome {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, var(--fs-primary) 0%, var(--fs-mid) 55%, #2ea84e 100%);
          border-radius: 22px;
          padding: 30px 36px;
          margin-bottom: 26px;
          box-shadow: 0 10px 40px rgba(26,61,6,.25);
          animation: fsDashSlideDown .45s ease both;
        }
        .fsdash-welcome__shine {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, rgba(255,255,255,.09) 0%, transparent 55%);
          pointer-events: none;
        }
        .fsdash-welcome__orb {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .fsdash-welcome__orb--a {
          width: 240px; height: 240px; top: -90px; right: -70px;
          background: radial-gradient(circle, rgba(255,255,255,.07), transparent 70%);
        }
        .fsdash-welcome__orb--b {
          width: 120px; height: 120px; bottom: -50px; right: 160px;
          background: radial-gradient(circle, rgba(255,255,255,.05), transparent 70%);
        }
        .fsdash-welcome__body {
          position: relative;
          display: flex; justify-content: space-between; align-items: center; gap: 24px;
        }
        .fsdash-eyebrow {
          display: block;
          font-family: 'Orbitron', sans-serif;
          font-size: .6rem; font-weight: 700; letter-spacing: .2em;
          color: rgba(255,255,255,.6); margin-bottom: 8px;
        }
        .fsdash-welcome__title {
          font-family: 'Orbitron', sans-serif;
          margin: 0 0 6px; font-size: 1.35rem; font-weight: 800;
          color: #fff; letter-spacing: .03em; line-height: 1.3;
        }
        .fsdash-welcome__sub {
          margin: 0; font-size: .875rem; color: rgba(255,255,255,.78);
        }
        .fsdash-btn-ghost {
          flex-shrink: 0; padding: 10px 22px; border-radius: 100px;
          border: 1px solid rgba(255,255,255,.3);
          background: rgba(255,255,255,.1); color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: .8rem; font-weight: 600;
          cursor: pointer; transition: var(--fs-t); backdrop-filter: blur(10px);
        }
        .fsdash-btn-ghost:hover { background: rgba(255,255,255,.2); transform: translateY(-1px); }

        /* ─── HEADER ─── */
        .fsdash-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          flex-wrap: wrap; gap: 16px; margin-bottom: 24px;
        }
        .fsdash-badge {
          display: inline-block;
          font-family: 'Orbitron', sans-serif;
          font-size: .55rem; font-weight: 700; letter-spacing: .22em;
          color: var(--fs-accent); background: rgba(24,201,60,.08);
          border: 1px solid rgba(24,201,60,.22); padding: 4px 12px;
          border-radius: 100px; margin-bottom: 8px;
        }
        .fsdash-header__title {
          font-family: 'Orbitron', sans-serif;
          margin: 0 0 4px; font-size: 1.55rem; font-weight: 800;
          color: var(--fs-primary); letter-spacing: .04em; line-height: 1.2;
        }
        .fsdash-header__sub { margin: 0; font-size: .85rem; color: var(--fs-muted); }

        .fsdash-filters {
          display: flex; gap: 4px; padding: 5px;
          background: var(--fs-card); border-radius: 100px;
          border: 1px solid var(--fs-border); box-shadow: var(--fs-shadow);
        }
        .fsdash-filter {
          padding: 8px 20px; border-radius: 100px; border: none;
          background: transparent; color: var(--fs-muted);
          font-family: 'Orbitron', sans-serif; font-size: .62rem;
          font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
          cursor: pointer; transition: var(--fs-t);
        }
        .fsdash-filter:hover { color: var(--fs-text); background: var(--fs-hover); }
        .fsdash-filter--active {
          background: linear-gradient(135deg, var(--fs-primary), var(--fs-accent));
          color: #fff;
          box-shadow: 0 2px 12px rgba(26,61,6,.3);
        }

        /* ─── STATS ─── */
        .fsdash-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 18px; margin-bottom: 24px;
        }

        /* ─── TABS ─── */
        .fsdash-tabs {
          display: flex; gap: 3px; padding: 6px;
          background: var(--fs-card); border: 1px solid var(--fs-border);
          border-radius: 20px; box-shadow: var(--fs-shadow);
          overflow-x: auto; scroll-behavior: smooth;
          scrollbar-width: none; margin-bottom: 22px;
        }
        .fsdash-tabs::-webkit-scrollbar { display: none; }

        .fsdash-tab {
          position: relative;
          display: flex; align-items: center; gap: 8px;
          padding: 9px 16px; border-radius: 13px;
          border: 1px solid transparent; background: transparent;
          color: var(--fs-muted);
          font-family: 'Orbitron', sans-serif; font-size: .58rem;
          font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
          cursor: pointer; white-space: nowrap;
          transition: var(--fs-t);
        }
        .fsdash-tab:hover:not(:disabled) {
          color: var(--fs-text); background: var(--fs-hover);
          transform: translateY(-2px);
        }
        .fsdash-tab--active {
          background: rgba(26,61,6,.06);
          color: var(--fs-primary);
          border-color: rgba(26,61,6,.16);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 2px 8px rgba(26,61,6,.08);
        }
        .fsdash-tab:disabled { opacity: .4; cursor: not-allowed; }

        .fsdash-tab__icon {
          display: flex; align-items: center; justify-content: center;
          width: 26px; height: 26px; border-radius: 8px;
          background: var(--fs-hover); flex-shrink: 0;
          transition: var(--fs-t);
        }
        .fsdash-tab__icon--active {
          background: linear-gradient(135deg, var(--fs-primary), var(--fs-accent));
          color: #fff;
          box-shadow: 0 2px 8px rgba(26,61,6,.35);
        }
        .fsdash-tab__label { line-height: 1; }
        .fsdash-tab__pip {
          position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);
          width: 18px; height: 3px; border-radius: 100px;
          background: linear-gradient(90deg, var(--fs-primary), var(--fs-accent));
        }

        /* ─── PANEL ─── */
        .fsdash-panel {
          background: var(--fs-card);
          border-radius: 22px; border: 1px solid var(--fs-border);
          box-shadow: var(--fs-shadow-lg); overflow: hidden;
          animation: fsDashFadeUp .35s ease both;
          transition: opacity .18s ease, transform .18s ease;
        }
        .fsdash-panel--out {
          opacity: 0; transform: translateY(6px); pointer-events: none;
        }

        .fsdash-panel__head {
          position: relative; overflow: hidden;
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 26px;
          background: linear-gradient(135deg, var(--fs-primary) 0%, var(--fs-mid) 60%, #2ea84e 100%);
          color: #fff;
        }
        .fsdash-panel__orb {
          position: absolute; top: -50px; right: -50px;
          width: 180px; height: 180px; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(255,255,255,.07), transparent 70%);
        }
        .fsdash-panel__meta {
          position: relative; display: flex; align-items: center; gap: 14px;
        }
        .fsdash-panel__icon-wrap {
          width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.22);
          backdrop-filter: blur(8px);
        }
        .fsdash-panel__eyebrow {
          display: block;
          font-family: 'Orbitron', sans-serif;
          font-size: .52rem; font-weight: 700; letter-spacing: .2em;
          text-transform: uppercase; opacity: .6; margin-bottom: 3px;
        }
        .fsdash-panel__name {
          font-family: 'Orbitron', sans-serif;
          margin: 0; font-size: 1rem; font-weight: 800;
          letter-spacing: .06em; text-transform: uppercase; color: #fff;
        }
        .fsdash-panel__actions { position: relative; display: flex; gap: 8px; }
        .fsdash-act-btn {
          width: 34px; height: 34px; border-radius: 9px;
          border: 1px solid rgba(255,255,255,.22); background: rgba(255,255,255,.1);
          color: #fff; cursor: pointer; transition: var(--fs-t);
          display: flex; align-items: center; justify-content: center;
        }
        .fsdash-act-btn:hover {
          background: rgba(255,255,255,.22); transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,.18);
        }

        .fsdash-panel__body {
          padding: 30px; min-height: 480px;
          animation: fsDashFadeUp .4s ease both;
        }

        /* ─── ERROR BOX ─── */
        .fsdash-error-box {
          padding: 48px 32px; text-align: center;
          background: #fff5f5; border-radius: 14px;
          border: 1px solid #fecaca; color: #b91c1c;
        }
        .fsdash-error-box h3 {
          font-family: 'Orbitron', sans-serif;
          margin: 12px 0 6px; font-size: .9rem; letter-spacing: .04em;
        }
        .fsdash-error-box p { font-size: .875rem; margin-bottom: 16px; }
        .fsdash-error-box button {
          padding: 10px 22px; border: none; border-radius: 10px;
          background: var(--fs-primary); color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: .85rem; font-weight: 600;
          cursor: pointer; transition: var(--fs-t);
        }
        .fsdash-error-box button:hover { opacity: .85; transform: translateY(-1px); }

        /* ─── ANIMATIONS ─── */
        @keyframes fsDashSlideDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fsDashFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .fsdash { margin-left: 80px; width: calc(100% - 80px); }
        }
        @media (max-width: 768px) {
          .fsdash { padding: 16px; margin-left: 0; width: 100%; }
          .fsdash-header { flex-direction: column; align-items: flex-start; }
          .fsdash-filters { width: 100%; justify-content: center; }
          .fsdash-stats { grid-template-columns: 1fr; }
          .fsdash-welcome__body { flex-direction: column; text-align: center; }
          .fsdash-tab__label { display: none; }
          .fsdash-tab { padding: 8px 12px; }
          .fsdash-panel__head { flex-wrap: wrap; gap: 12px; }
          .fsdash-panel__body { padding: 18px; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;