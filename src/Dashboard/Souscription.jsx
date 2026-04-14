import React, { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --teal: #0F6E56;
    --teal-l: #E1F5EE;
    --teal-m: #1D9E75;
    --teal-d: #085041;
    --blu: #185FA5;
    --blu-l: #E6F1FB;
    --blu-d: #0C447C;
    --amb: #854F0B;
    --amb-l: #FAEEDA;
    --amb-d: #633806;
    --amb-m: #BA7517;
    --pur: #534AB7;
    --pur-l: #EEEDFE;
    --pur-d: #3C3489;
    --red: #A32D2D;
    --red-l: #FCEBEB;
    --grn: #3B6D11;
    --grn-l: #EAF3DE;
    --gray: #888780;
    --ink: #1a1a1a;
    --ink2: #6b7280;
    --bg: #ffffff;
    --bg2: #f9fafb;
    --bd: rgba(0,0,0,0.08);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-head: 'Syne', sans-serif;
    --r: 12px;
    --r2: 20px;
  }

  .dash {
    font-family: var(--font);
    background: #f3f5f0;
    min-height: 100vh;
    padding: 40px 28px 60px;
  }

  /* eyebrow */
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--teal-l);
    color: var(--teal-d);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 18px;
    border-radius: 999px;
    margin-bottom: 18px;
  }
  .dot-pulse {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--teal);
    animation: dp 1.8s ease-in-out infinite;
  }
  @keyframes dp {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .4; transform: scale(.7); }
  }

  /* header row */
  .head-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 28px;
    gap: 16px;
    flex-wrap: wrap;
  }
  .head-left h1 {
    font-family: var(--font-head);
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    line-height: 1.15;
    letter-spacing: -.02em;
  }
  .head-left h1 span { color: var(--teal); }
  .head-left p {
    font-size: 13px;
    color: var(--ink2);
    margin-top: 6px;
    max-width: 420px;
    line-height: 1.6;
  }
  .head-actions { display: flex; gap: 10px; flex-shrink: 0; }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid var(--bd);
    background: var(--bg);
    color: var(--ink2);
    font-family: var(--font);
    transition: all .2s;
  }
  .btn:hover { box-shadow: 0 2px 8px rgba(0,0,0,.1); transform: translateY(-1px); }
  .btn-primary {
    background: var(--teal);
    color: #fff;
    border-color: var(--teal);
  }
  .btn-primary:hover { background: var(--teal-d); }

  /* alerts */
  .alert {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 18px;
    border-radius: var(--r);
    margin-bottom: 12px;
    font-size: 13px;
    background: var(--amb-l);
    border-left: 3px solid var(--amb-m);
    color: var(--amb-d);
  }
  .alert strong { font-weight: 600; }
  .alert-action { font-size: 11px; margin-left: 8px; opacity: .7; }
  .alert.info {
    background: var(--blu-l);
    border-left-color: var(--blu);
    color: var(--blu-d);
  }
  .alerts-wrap { margin-bottom: 28px; }

  /* kpi grid */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 24px;
  }
  @media (max-width: 1100px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .kpi-grid { grid-template-columns: 1fr; } }

  .kpi {
    background: var(--bg);
    border: 1px solid var(--bd);
    border-radius: var(--r2);
    padding: 20px 20px 18px;
    position: relative;
    overflow: hidden;
    transition: transform .2s, box-shadow .2s;
  }
  .kpi:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.08); }
  .kpi-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: var(--r2) var(--r2) 0 0;
  }
  .kpi-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  .kpi-ico {
    width: 42px; height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  .kpi-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 999px;
  }
  .kpi-val {
    font-family: var(--font-head);
    font-size: 32px;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -.02em;
    line-height: 1;
  }
  .kpi-lbl { font-size: 12px; color: var(--ink2); margin-top: 6px; font-weight: 500; }
  .ico-teal { background: var(--teal-l); color: var(--teal-d); }
  .ico-blu { background: var(--blu-l); color: var(--blu-d); }
  .ico-amb { background: var(--amb-l); color: var(--amb-d); }
  .ico-pur { background: var(--pur-l); color: var(--pur-d); }
  .badge-up { background: var(--grn-l); color: var(--grn); }
  .badge-warn { background: var(--amb-l); color: var(--amb-d); }
  .badge-pur { background: var(--pur-l); color: var(--pur-d); }

  /* 2-col charts */
  .charts2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 24px;
  }
  @media (max-width: 860px) { .charts2 { grid-template-columns: 1fr; } }

  /* card */
  .card {
    background: var(--bg);
    border: 1px solid var(--bd);
    border-radius: var(--r2);
    overflow: hidden;
    transition: box-shadow .2s;
  }
  .card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.07); }
  .card-head {
    padding: 16px 20px 14px;
    border-bottom: 1px solid var(--bd);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg2);
  }
  .card-title {
    font-family: var(--font-head);
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .card-pill {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 11px;
    border-radius: 999px;
    background: var(--teal-l);
    color: var(--teal-d);
  }
  .card-body { padding: 20px; }

  /* bar chart */
  .barchart { display: flex; flex-direction: column; gap: 14px; }
  .bar-row { display: flex; align-items: center; gap: 12px; }
  .bar-lbl { width: 80px; font-size: 12px; font-weight: 600; color: var(--ink2); }
  .bar-track {
    flex: 1; height: 32px;
    background: var(--bg2);
    border-radius: 999px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 12px;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    transition: width 1.2s cubic-bezier(.34,1.2,.64,1);
  }
  .fill-teal { background: var(--teal); }
  .fill-blu { background: var(--blu); }
  .fill-amb { background: var(--amb-m); }
  .bar-num { width: 36px; text-align: right; font-size: 12px; font-weight: 700; color: var(--ink); }
  .bar-legend {
    display: flex;
    gap: 16px;
    margin-top: 18px;
    flex-wrap: wrap;
  }
  .leg-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--ink2); }
  .leg-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }

  /* donut */
  .donut-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
  }
  .donut-ring {
    position: relative;
    width: 150px; height: 150px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .donut-inner {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 98px; height: 98px;
    background: var(--bg);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--bd);
  }
  .donut-ctr-val { font-family: var(--font-head); font-size: 22px; font-weight: 800; color: var(--ink); }
  .donut-ctr-lbl { font-size: 10px; color: var(--ink2); }
  .legend { display: flex; flex-direction: column; gap: 10px; }

  /* evolution chart */
  .evo-chart { display: flex; align-items: flex-end; gap: 10px; height: 180px; }
  .evo-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .evo-bar {
    width: 100%;
    background: var(--teal);
    border-radius: 6px 6px 0 0;
    transition: height 1s cubic-bezier(.34,1.2,.64,1);
    min-height: 4px;
  }
  .evo-val { font-size: 11px; font-weight: 700; color: var(--ink); }
  .evo-labels {
    display: flex;
    gap: 10px;
    margin-top: 6px;
  }
  .evo-lbl { flex: 1; text-align: center; font-size: 10px; color: var(--ink2); font-weight: 500; }

  /* stats strip */
  .stats3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 24px;
  }
  @media (max-width: 860px) { .stats3 { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 500px) { .stats3 { grid-template-columns: 1fr; } }

  .stat-c {
    background: var(--bg);
    border: 1px solid var(--bd);
    border-radius: var(--r2);
    padding: 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
    transition: transform .2s, box-shadow .2s;
  }
  .stat-c:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,.07); }
  .stat-accent-bar {
    position: absolute;
    bottom: 0; left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 60%; height: 2px;
    background: var(--teal);
    border-radius: 999px;
    transition: transform .3s;
  }
  .stat-c:hover .stat-accent-bar { transform: translateX(-50%) scaleX(1); }
  .stat-val {
    font-family: var(--font-head);
    font-size: 28px;
    font-weight: 800;
    color: var(--teal-d);
    margin-bottom: 6px;
  }
  .stat-lbl { font-size: 12px; color: var(--ink2); font-weight: 500; }

  /* tables */
  .tbl-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th {
    text-align: left;
    padding: 13px 18px;
    background: var(--bg2);
    font-weight: 700;
    color: var(--ink2);
    border-bottom: 1px solid var(--bd);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .8px;
  }
  td {
    padding: 12px 18px;
    border-bottom: 1px solid var(--bd);
    color: var(--ink);
    vertical-align: middle;
  }
  tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: var(--teal-l); }
  .td-sub { font-size: 11px; color: var(--ink2); }
  .pill {
    display: inline-block;
    padding: 3px 11px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
  }
  .pill-st { background: var(--pur-l); color: var(--pur-d); }
  .pill-pro { background: var(--teal-l); color: var(--teal-d); }
  .pill-ent { background: var(--amb-l); color: var(--amb-d); }
  .ca-val { font-weight: 700; color: var(--teal-d); }
  .rank {
    width: 24px; height: 24px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
  }
  .r1 { background: var(--amb-l); color: var(--amb-d); }
  .r2 { background: var(--teal-l); color: var(--teal-d); }
  .r3 { background: var(--pur-l); color: var(--pur-d); }
  .rx { background: var(--bg2); color: var(--ink2); }

  .section-gap { margin-bottom: 24px; }
  .spin {
    width: 40px; height: 40px;
    border: 3px solid var(--teal-l);
    border-top-color: var(--teal);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    color: var(--ink2);
    font-size: 14px;
  }
`;

const API_BASE_URL = "https://backend-foot-omega.vercel.app/api/ana-souscription";

// Icons as inline SVGs (no external dependency needed for these shapes)
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconDollar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
);
const IconAlert = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
  </svg>
);
const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconList = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const IconActivity = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconPie = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
  </svg>
);

const getPlanClass = (plan) => {
  if (!plan) return "pill-st";
  if (plan === "starter") return "pill-st";
  if (plan === "pro") return "pill-pro";
  if (plan === "enterprise") return "pill-ent";
  return "pill-st";
};

const formatPlanLabel = (plan) => {
  if (!plan) return "—";
  if (plan === "starter") return "Starter";
  if (plan === "pro") return "Pro";
  if (plan === "enterprise") return "Enterprise";
  return plan;
};

const rankClass = (idx) => {
  if (idx === 0) return "rank r1";
  if (idx === 1) return "rank r2";
  if (idx === 2) return "rank r3";
  return "rank rx";
};

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [planPerformance, setPlanPerformance] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    fetchAllData();
    setTimeout(() => setAnimateBars(true), 400);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, performanceRes, behaviorRes, alertsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard`),
        fetch(`${API_BASE_URL}/plan-performance`),
        fetch(`${API_BASE_URL}/customer-behavior`),
        fetch(`${API_BASE_URL}/alerts-recommendations`),
      ]);
      const dashboard = await dashboardRes.json();
      const performance = await performanceRes.json();
      const behavior = await behaviorRes.json();
      const alertsData = await alertsRes.json();

      if (dashboard.success) setDashboardData(dashboard.data);
      if (performance.success) setPlanPerformance(performance.data.performance_plans);
      if (behavior.success) setTopClients(behavior.data.top_clients);
      if (alertsData.success) setAlerts(alertsData.data.recommandations);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.open(`${API_BASE_URL}/export/csv`, "_blank");
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="dash">
          <div className="loading-wrap">
            <div className="spin" />
            <p>Chargement des données...</p>
          </div>
        </div>
      </>
    );
  }

  const synth = dashboardData?.synthese || {};
  const total = synth.total_souscriptions || 1;
  const actives = synth.actives || 0;
  const enAttente = synth.en_attente || 0;
  const annulees = synth.annulees || 0;
  const expirees = synth.expirees || 0;

  const activePercent = (actives / total) * 100;
  const pendingPercent = (enAttente / total) * 100;
  const cancelledPercent = (annulees / total) * 100;

  const planRepartition = dashboardData?.repartition?.par_plan || [];
  const evolutionData = (dashboardData?.evolution || []).slice(0, 6);
  const maxEvolution = Math.max(...evolutionData.map((e) => e.nouvelles_souscriptions || 0), 1);

  const donutGradient = `conic-gradient(
    #0F6E56 0% ${activePercent}%,
    #BA7517 ${activePercent}% ${activePercent + pendingPercent}%,
    #A32D2D ${activePercent + pendingPercent}% ${activePercent + pendingPercent + cancelledPercent}%,
    #888780 ${activePercent + pendingPercent + cancelledPercent}% 100%
  )`;

  return (
    <>
      <style>{styles}</style>
      <div className="dash">

        {/* Eyebrow */}
        <div className="eyebrow">
          <span className="dot-pulse" />
          Analytics Dashboard
        </div>

        {/* Header row */}
        <div className="head-row">
          <div className="head-left">
            <h1>Tableau de bord <span>analytique</span></h1>
            <p>Performances de vos souscriptions en temps réel avec métriques avancées</p>
          </div>
          <div className="head-actions">
            <button className="btn" onClick={handleExportCSV}>
              <IconDownload /> Exporter CSV
            </button>
            <button className="btn btn-primary" onClick={fetchAllData}>
              <IconRefresh /> Actualiser
            </button>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="alerts-wrap">
            {alerts.map((alert, idx) => (
              <div key={idx} className="alert">
                <IconAlert color="#854F0B" />
                <span>
                  <strong>{alert.title}</strong> — {alert.message}
                  <span className="alert-action">Action recommandée : {alert.action}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi">
            <div className="kpi-accent" style={{ background: "#0F6E56" }} />
            <div className="kpi-top">
              <div className="kpi-ico ico-teal"><IconUsers /></div>
              <span className="kpi-badge badge-up">↑ +12%</span>
            </div>
            <div className="kpi-val">{total.toLocaleString("fr-FR")}</div>
            <div className="kpi-lbl">Total des souscriptions</div>
          </div>

          <div className="kpi">
            <div className="kpi-accent" style={{ background: "#185FA5" }} />
            <div className="kpi-top">
              <div className="kpi-ico ico-blu"><IconCheck /></div>
              <span className="kpi-badge badge-up">↑ {synth.taux_activation || 0}%</span>
            </div>
            <div className="kpi-val">{actives.toLocaleString("fr-FR")}</div>
            <div className="kpi-lbl">Souscriptions actives</div>
          </div>

          <div className="kpi">
            <div className="kpi-accent" style={{ background: "#BA7517" }} />
            <div className="kpi-top">
              <div className="kpi-ico ico-amb"><IconClock /></div>
              <span className="kpi-badge badge-warn">En attente</span>
            </div>
            <div className="kpi-val">{enAttente.toLocaleString("fr-FR")}</div>
            <div className="kpi-lbl">En attente de validation</div>
          </div>

          <div className="kpi">
            <div className="kpi-accent" style={{ background: "#534AB7" }} />
            <div className="kpi-top">
              <div className="kpi-ico ico-pur"><IconDollar /></div>
              <span className="kpi-badge badge-pur">CA mensuel</span>
            </div>
            <div className="kpi-val">
              {dashboardData?.revenus?.total_actifs
                ? Number(dashboardData.revenus.total_actifs).toLocaleString("fr-FR") + "€"
                : "0€"}
            </div>
            <div className="kpi-lbl">Chiffre d'affaires mensuel</div>
          </div>
        </div>

        {/* 2-col Charts */}
        <div className="charts2">
          {/* Plan distribution bar chart */}
          <div className="card">
            <div className="card-head">
              <div className="card-title"><IconPie /> Distribution par plan</div>
              <span className="card-pill">Répartition</span>
            </div>
            <div className="card-body">
              <div className="barchart">
                {planRepartition.map((plan, idx) => {
                  const pct = Math.round((plan.total / total) * 100);
                  const fillClass =
                    plan.plan === "pro" ? "fill-teal"
                    : plan.plan === "enterprise" ? "fill-amb"
                    : "fill-blu";
                  return (
                    <div key={idx} className="bar-row">
                      <div className="bar-lbl">{formatPlanLabel(plan.plan)}</div>
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${fillClass}`}
                          style={{ width: animateBars ? `${pct}%` : "0%" }}
                        >
                          {pct}%
                        </div>
                      </div>
                      <div className="bar-num">{plan.total}</div>
                    </div>
                  );
                })}
              </div>
              <div className="bar-legend">
                <div className="leg-item"><div className="leg-dot" style={{ background: "#185FA5" }} />Starter</div>
                <div className="leg-item"><div className="leg-dot" style={{ background: "#0F6E56" }} />Pro</div>
                <div className="leg-item"><div className="leg-dot" style={{ background: "#BA7517" }} />Enterprise</div>
              </div>
            </div>
          </div>

          {/* Status donut */}
          <div className="card">
            <div className="card-head">
              <div className="card-title"><IconActivity /> Répartition par statut</div>
              <span className="card-pill">Statuts</span>
            </div>
            <div className="card-body">
              <div className="donut-wrap">
                <div className="donut-ring" style={{ background: donutGradient }}>
                  <div className="donut-inner">
                    <div className="donut-ctr-val">{total}</div>
                    <div className="donut-ctr-lbl">Total</div>
                  </div>
                </div>
                <div className="legend">
                  <div className="leg-item"><div className="leg-dot" style={{ background: "#0F6E56" }} />Actives ({actives})</div>
                  <div className="leg-item"><div className="leg-dot" style={{ background: "#BA7517" }} />En attente ({enAttente})</div>
                  <div className="leg-item"><div className="leg-dot" style={{ background: "#A32D2D" }} />Annulées ({annulees})</div>
                  <div className="leg-item"><div className="leg-dot" style={{ background: "#888780" }} />Expirées ({expirees})</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly evolution */}
        <div className="card section-gap">
          <div className="card-head">
            <div className="card-title"><IconActivity /> Évolution mensuelle des souscriptions</div>
            <span className="card-pill">6 derniers mois</span>
          </div>
          <div className="card-body">
            <div className="evo-chart">
              {evolutionData.map((item, idx) => {
                const h = animateBars
                  ? Math.round((item.nouvelles_souscriptions / maxEvolution) * 150)
                  : 0;
                return (
                  <div key={idx} className="evo-col">
                    <div className="evo-bar" style={{ height: `${h}px` }} />
                    <div className="evo-val">{item.nouvelles_souscriptions}</div>
                  </div>
                );
              })}
            </div>
            <div className="evo-labels">
              {evolutionData.map((item, idx) => (
                <div key={idx} className="evo-lbl">
                  {new Date(item.mois).toLocaleDateString("fr-FR", { month: "short" })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="stats3">
          <div className="stat-c">
            <div className="stat-accent-bar" />
            <div className="stat-val">
              {dashboardData?.conversion?.[0]?.taux_conversion || 0}%
            </div>
            <div className="stat-lbl">Taux de conversion global</div>
          </div>
          <div className="stat-c">
            <div className="stat-accent-bar" />
            <div className="stat-val">
              {dashboardData?.revenus?.potentiels
                ? Number(dashboardData.revenus.potentiels).toLocaleString("fr-FR") + "€"
                : "0€"}
            </div>
            <div className="stat-lbl">Revenus potentiels</div>
          </div>
          <div className="stat-c">
            <div className="stat-accent-bar" />
            <div className="stat-val">
              {dashboardData?.repartition?.par_mode_paiement?.length || 0}
            </div>
            <div className="stat-lbl">Modes de paiement actifs</div>
          </div>
        </div>

        {/* Top clients table */}
        <div className="card section-gap">
          <div className="card-head">
            <div className="card-title"><IconStar /> Top clients par valeur</div>
            <span className="card-pill">Classement</span>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Plan</th>
                  <th>Facturation</th>
                  <th>Valeur annuelle</th>
                </tr>
              </thead>
              <tbody>
                {topClients.slice(0, 5).map((client, idx) => (
                  <tr key={idx}>
                    <td><span className={rankClass(idx)}>{idx + 1}</span></td>
                    <td>
                      <strong>{client.prenom} {client.nom}</strong>
                      <div className="td-sub">{client.email}</div>
                    </td>
                    <td><span className={`pill ${getPlanClass(client.plan)}`}>{formatPlanLabel(client.plan)}</span></td>
                    <td>{client.type_facturation === "mensuel" ? "Mensuel" : "Annuel"}</td>
                    <td className="ca-val">
                      {Number(client.valeur_annuelle).toLocaleString("fr-FR")}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan performance table */}
        <div className="card">
          <div className="card-head">
            <div className="card-title"><IconList /> Performance par plan</div>
            <span className="card-pill">Analyse</span>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Total ventes</th>
                  <th>Actives</th>
                  <th>En attente</th>
                  <th>Annulées</th>
                  <th>Panier moyen</th>
                  <th>CA potentiel</th>
                </tr>
              </thead>
              <tbody>
                {planPerformance.map((plan, idx) => (
                  <tr key={idx}>
                    <td><span className={`pill ${getPlanClass(plan.plan)}`}>{formatPlanLabel(plan.plan)}</span></td>
                    <td><strong>{plan.total_ventes}</strong></td>
                    <td style={{ color: "#085041", fontWeight: 600 }}>{plan.ventes_actives}</td>
                    <td style={{ color: "#633806", fontWeight: 600 }}>{plan.ventes_attente}</td>
                    <td style={{ color: "#A32D2D", fontWeight: 600 }}>{plan.ventes_annulees}</td>
                    <td>{parseFloat(plan.panier_moyen).toFixed(2)}€</td>
                    <td className="ca-val">
                      {Number(plan.ca_potentiel_annuel).toLocaleString("fr-FR")}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}