import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar,
  Users,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Menu,
  ChevronRight,
  Award,
  Target,
  AlertCircle,
  CheckCircle,
  Activity,
  Zap,
  LineChart,
  UserCheck,
  UserX,
  ThumbsUp,
  Star,
  Crown,
  Flame,
  Shield,
  Loader2,
  MapPin,
  Trophy,
  DollarSign,
  AlertTriangle,
  Building,
  List,
  Grid,
  LayoutDashboard,
  ChartBar,
  ChartLine,
  Gauge,
  CircleCheck,
  CircleX,
  CircleAlert,
  Sparkles,
  Rocket,
  Gem,
  Home
} from 'lucide-react';

// Styles CSS intégrés directement dans le composant
const styles = `
  .fa-dashboard {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f3f6f4;
    padding: 20px;
    max-width: 1440px;
    margin: 0 auto;
    min-height: 100vh;
  }

  .fa-dashboard-loader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f3f6f4;
  }

  .fa-loader-spinner {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .fa-loader-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #1a3d06;
    animation: fa-bounce 1.4s infinite ease-in-out both;
  }

  .fa-loader-dot:nth-child(1) { animation-delay: -0.32s; }
  .fa-loader-dot:nth-child(2) { animation-delay: -0.16s; }

  @keyframes fa-bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  .fa-loader-text {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #1a3d06;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .fa-spinning {
    animation: fa-spin 1s linear infinite;
  }

  @keyframes fa-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .fa-header {
    background: #ffffff;
    border-radius: 16px;
    padding: 16px 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(26, 61, 6, 0.06);
    border: 1px solid #e0e8e2;
  }

  .fa-header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .fa-logo-section {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .fa-logo-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #1a3d06, #2ea84e);
    border-radius: 12px;
    color: #fff;
  }

  .fa-logo-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: rgba(46, 168, 78, 0.3);
    animation: fa-pulse 2s infinite;
  }

  @keyframes fa-pulse {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }

  .fa-logo-text h1 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
    color: #1a3d06;
  }

  .fa-subtitle {
    font-size: 0.8rem;
    color: #6d7a86;
  }

  .fa-header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .fa-btn-refresh {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #f0f7f0;
    border: 1px solid #d0e0d0;
    border-radius: 8px;
    color: #1a3d06;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .fa-btn-refresh:hover {
    background: #e0f0e0;
    transform: translateY(-1px);
  }

  .fa-btn-mobile-menu {
    display: none;
    padding: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #1a3d06;
  }

  .fa-header-time {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #6d7a86;
  }

  .fa-nav {
    background: #ffffff;
    border-radius: 16px;
    padding: 6px;
    margin-bottom: 20px;
    border: 1px solid #e0e8e2;
    box-shadow: 0 2px 8px rgba(26, 61, 6, 0.06);
    overflow-x: auto;
  }

  .fa-nav-track {
    display: flex;
    gap: 4px;
    position: relative;
  }

  .fa-nav-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border: none;
    background: transparent;
    border-radius: 10px;
    color: #6d7a86;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }

  .fa-nav-tab:hover {
    color: #1a3d06;
    background: #f0f7f0;
  }

  .fa-nav-tab-active {
    color: #1a3d06;
    background: rgba(26, 61, 6, 0.06);
    border-color: rgba(26, 61, 6, 0.16);
  }

  .fa-nav-tab svg {
    flex-shrink: 0;
  }

  .fa-main {
    background: transparent;
  }

  .fa-content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .fa-tab-content {
    animation: fa-fade-up 0.35s ease both;
  }

  @keyframes fa-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fa-kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
  }

  .fa-kpi-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e0e8e2;
    box-shadow: 0 2px 8px rgba(26, 61, 6, 0.06);
    transition: all 0.2s;
  }

  .fa-kpi-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(26, 61, 6, 0.1);
  }

  .fa-kpi-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    flex-shrink: 0;
  }

  .fa-primary .fa-kpi-icon {
    background: rgba(26, 61, 6, 0.1);
    color: #1a3d06;
  }

  .fa-secondary .fa-kpi-icon {
    background: rgba(24, 201, 60, 0.1);
    color: #18c93c;
  }

  .fa-info .fa-kpi-icon {
    background: rgba(52, 152, 219, 0.1);
    color: #3498db;
  }

  .fa-warning .fa-kpi-icon {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
  }

  .fa-kpi-content {
    flex: 1;
  }

  .fa-kpi-title {
    font-size: 0.75rem;
    color: #6d7a86;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 4px;
  }

  .fa-kpi-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a3d06;
  }

  .fa-kpi-trend {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 100px;
    margin-top: 4px;
  }

  .fa-positive {
    color: #27ae60;
    background: rgba(39, 174, 96, 0.1);
  }

  .fa-negative {
    color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);
  }

  .fa-kpi-subtitle {
    font-size: 0.7rem;
    color: #95a5a6;
    margin-top: 2px;
  }

  .fa-insight-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .fa-insight-card {
    padding: 20px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e0e8e2;
    box-shadow: 0 2px 8px rgba(26, 61, 6, 0.06);
  }

  .fa-status-card {
    background: linear-gradient(135deg, #1a3d06, #2ea84e);
    color: #fff;
    border: none;
  }

  .fa-status-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .fa-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    width: fit-content;
  }

  .fa-status-badge-pulse {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #18c93c;
    animation: fa-pulse-dot 1.5s infinite;
  }

  @keyframes fa-pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .fa-status-details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .fa-status-item {
    display: flex;
    flex-direction: column;
  }

  .fa-status-item .fa-label {
    font-size: 0.65rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .fa-status-item .fa-value {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .fa-top-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .fa-top-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .fa-rank {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #f0f7f0;
    font-size: 0.7rem;
    font-weight: 700;
    color: #1a3d06;
    flex-shrink: 0;
  }

  .fa-top-item-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fa-name {
    font-weight: 500;
    font-size: 0.85rem;
  }

  .fa-metric {
    font-size: 0.8rem;
    color: #6d7a86;
  }

  .fa-progress {
    flex: 1;
    height: 4px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    margin-left: 8px;
  }

  .fa-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #1a3d06, #2ea84e);
    border-radius: 4px;
    transition: width 0.6s ease;
  }

  .fa-comparison-grid {
    margin-top: 20px;
  }

  .fa-comparison-card {
    padding: 20px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e0e8e2;
    box-shadow: 0 2px 8px rgba(26, 61, 6, 0.06);
  }

  .fa-comparison-header h3 {
    margin: 0 0 16px 0;
    font-size: 1rem;
    color: #1a3d06;
  }

  .fa-comparison-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .fa-comparison-metric {
    padding: 12px;
    background: #f8faf8;
    border-radius: 8px;
  }

  .fa-metric-label {
    font-size: 0.7rem;
    color: #6d7a86;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 8px;
  }

  .fa-metric-values {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fa-metric-current small,
  .fa-metric-previous small {
    display: block;
    font-size: 0.6rem;
    color: #95a5a6;
  }

  .fa-metric-current strong,
  .fa-metric-previous strong {
    font-size: 1.1rem;
    color: #1a3d06;
  }

  .fa-metric-arrow {
    color: #95a5a6;
  }

  .fa-metric-evolution {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 100px;
    margin-top: 6px;
  }

  .fa-metric-subtitle {
    font-size: 0.7rem;
    color: #95a5a6;
    margin-top: 4px;
  }

  .fa-chart-card {
    padding: 20px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e0e8e2;
    box-shadow: 0 2px 8px rgba(26, 61, 6, 0.06);
  }

  .fa-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .fa-card-header h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 1rem;
    color: #1a3d06;
  }

  .fa-info-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: #f0f7f0;
    border-radius: 100px;
    font-size: 0.7rem;
    color: #1a3d06;
  }

  .fa-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }

  .fa-metric-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #f8faf8;
    border-radius: 10px;
    border: 1px solid #e8efe8;
  }

  .fa-metric-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #ffffff;
    color: #1a3d06;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  }

  .fa-metric-info {
    flex: 1;
  }

  .fa-metric-title {
    font-size: 0.7rem;
    color: #6d7a86;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .fa-metric-value {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a3d06;
  }

  .fa-metric-subtitle {
    font-size: 0.65rem;
    color: #95a5a6;
  }

  .fa-table-container {
    overflow-x: auto;
    margin-top: 8px;
  }

  .fa-data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }

  .fa-data-table th {
    text-align: left;
    padding: 10px 12px;
    background: #f8faf8;
    color: #6d7a86;
    font-weight: 600;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 2px solid #e8efe8;
  }

  .fa-data-table td {
    padding: 10px 12px;
    border-bottom: 1px solid #f0f0f0;
    color: #1a3d06;
  }

  .fa-data-table tr:hover {
    background: #f8faf8;
  }

  .fa-rank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #f0f7f0;
    font-size: 0.7rem;
    font-weight: 700;
    color: #1a3d06;
  }

  .fa-client-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 0.7rem;
    font-weight: 600;
    background: #f0f7f0;
    color: #1a3d06;
  }

  .fa-success {
    background: #d5f5e3;
    color: #27ae60;
  }

  .fa-warning {
    background: #fdebd0;
    color: #e67e22;
  }

  .fa-critical {
    background: #fadbd8;
    color: #e74c3c;
  }

  .fa-moderate {
    background: #fef9e7;
    color: #f1c40f;
  }

  .fa-positive-text {
    color: #27ae60;
  }

  .fa-negative-text {
    color: #e74c3c;
  }

  .fa-type-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 6px;
    background: #e8efe8;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .fa-retention-summary {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
  }

  .fa-summary-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: #f8faf8;
    border-radius: 8px;
    border-left: 3px solid #1a3d06;
  }

  .fa-summary-icon {
    flex-shrink: 0;
    color: #1a3d06;
  }

  .fa-progress-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .fa-progress-bar {
    width: 60px;
    height: 4px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .fa-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #95a5a6;
  }

  .fa-empty-state h4 {
    margin: 12px 0 4px;
    color: #6d7a86;
  }

  .fa-btn-view {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid #e0e8e2;
    border-radius: 6px;
    background: transparent;
    color: #6d7a86;
    cursor: pointer;
    transition: all 0.2s;
  }

  .fa-btn-view:hover {
    background: #f0f7f0;
    color: #1a3d06;
  }

  .fa-btn-view.fa-active {
    background: #1a3d06;
    color: #fff;
    border-color: #1a3d06;
  }

  @media (max-width: 1024px) {
    .fa-dashboard {
      padding: 16px;
    }
  }

  @media (max-width: 768px) {
    .fa-dashboard {
      padding: 12px;
    }

    .fa-header-content {
      flex-direction: column;
      align-items: stretch;
    }

    .fa-btn-mobile-menu {
      display: flex;
    }

    .fa-nav {
      overflow-x: auto;
    }

    .fa-nav-track {
      width: max-content;
    }

    .fa-nav-tab span {
      display: none;
    }

    .fa-nav-tab {
      padding: 10px 14px;
    }

    .fa-kpi-grid {
      grid-template-columns: 1fr 1fr;
    }

    .fa-insight-section {
      grid-template-columns: 1fr;
    }

    .fa-metrics-grid {
      grid-template-columns: 1fr 1fr;
    }

    .fa-comparison-metrics {
      grid-template-columns: 1fr;
    }

    .fa-status-details {
      grid-template-columns: 1fr 1fr;
    }

    .fa-kpi-card {
      padding: 14px;
    }

    .fa-kpi-value {
      font-size: 1.2rem;
    }
  }

  @media (max-width: 480px) {
    .fa-kpi-grid {
      grid-template-columns: 1fr;
    }

    .fa-metrics-grid {
      grid-template-columns: 1fr;
    }

    .fa-header-actions .fa-btn-refresh span {
      display: none;
    }

    .fa-data-table {
      font-size: 0.75rem;
    }

    .fa-data-table th,
    .fa-data-table td {
      padding: 6px 8px;
    }
  }
`;

const API_BASE_URL = 'http://backend-foot-omega.vercel.app/api/analyse-reservation';

const ReservationDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  
  const [dashboardData, setDashboardData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [typeTerrainData, setTypeTerrainData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [clientsData, setClientsData] = useState(null);
  const [weeklyComparison, setWeeklyComparison] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [cancellationData, setCancellationData] = useState(null);
  const [villeQuartierData, setVilleQuartierData] = useState(null);
  const [sportRentabiliteData, setSportRentabiliteData] = useState(null);
  const [terrainsDetailData, setTerrainsDetailData] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        dashboardRes,
        hourlyRes,
        typeTerrainRes,
        monthlyRes,
        clientsRes,
        weeklyRes,
        forecastRes,
        cancellationRes,
        villeQuartierRes,
        sportRentabiliteRes,
        terrainsDetailRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard-reservations`),
        fetch(`${API_BASE_URL}/analyse-horaire`),
        fetch(`${API_BASE_URL}/analyse-par-type-terrain`),
        fetch(`${API_BASE_URL}/evolution-mensuelle`),
        fetch(`${API_BASE_URL}/analyse-clients-reservations`),
        fetch(`${API_BASE_URL}/comparaison-hebdomadaire`),
        fetch(`${API_BASE_URL}/previsions-reservations`),
        fetch(`${API_BASE_URL}/analyse-annulations`),
        fetch(`${API_BASE_URL}/analyse-par-ville-quartier`),
        fetch(`${API_BASE_URL}/analyse-par-sport-rentabilite`),
        fetch(`${API_BASE_URL}/analyse-terrains-ville-quartier`)
      ]);

      if (dashboardRes.ok) {
        const data = await dashboardRes.json();
        if (data.success) setDashboardData(data);
      }
      if (hourlyRes.ok) {
        const data = await hourlyRes.json();
        if (data.success) setHourlyData(data);
      }
      if (typeTerrainRes.ok) {
        const data = await typeTerrainRes.json();
        if (data.success) setTypeTerrainData(data);
      }
      if (monthlyRes.ok) {
        const data = await monthlyRes.json();
        if (data.success) setMonthlyData(data);
      }
      if (clientsRes.ok) {
        const data = await clientsRes.json();
        if (data.success) setClientsData(data);
      }
      if (weeklyRes.ok) {
        const data = await weeklyRes.json();
        if (data.success) setWeeklyComparison(data);
      }
      if (forecastRes.ok) {
        const data = await forecastRes.json();
        if (data.success) setForecastData(data);
      }
      if (cancellationRes.ok) {
        const data = await cancellationRes.json();
        if (data.success) setCancellationData(data);
      }
      if (villeQuartierRes.ok) {
        const data = await villeQuartierRes.json();
        if (data.success) setVilleQuartierData(data);
      }
      if (sportRentabiliteRes.ok) {
        const data = await sportRentabiliteRes.json();
        if (data.success) setSportRentabiliteData(data);
      }
      if (terrainsDetailRes.ok) {
        const data = await terrainsDetailRes.json();
        if (data.success) setTerrainsDetailData(data);
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const tabs = useMemo(() => [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={18} /> },
    { id: 'analyse-horaire', label: 'Analyse horaire', icon: <Clock size={18} /> },
    { id: 'type-terrain', label: 'Types de terrain', icon: <Target size={18} /> },
    { id: 'evolution', label: 'Évolution', icon: <ChartLine size={18} /> },
    { id: 'clients', label: 'Clients', icon: <Users size={18} /> },
    { id: 'previsions', label: 'Prévisions', icon: <Gauge size={18} /> },
    { id: 'ville-quartier', label: 'Villes & Quartiers', icon: <MapPin size={18} /> },
    { id: 'sport-rentabilite', label: 'Sports & Rentabilité', icon: <Trophy size={18} /> },
    { id: 'terrains-detail', label: 'Terrains Détaillés', icon: <Building size={18} /> }
  ], []);

  const getTrendIcon = (value) => {
    const numValue = parseFloat(value);
    if (numValue > 0) return <TrendingUp size={14} />;
    if (numValue < 0) return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  const getTrendClass = (value) => {
    const numValue = parseFloat(value);
    if (numValue > 0) return 'fa-positive';
    if (numValue < 0) return 'fa-negative';
    return '';
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined || num === '') return '0';
    const parsed = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    if (isNaN(parsed)) return '0';
    return parsed.toLocaleString('fr-FR');
  };

  const safeToFixed = (value, decimals = 1) => {
    if (value === null || value === undefined || value === '') return '0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    return num.toFixed(decimals);
  };

  const getPerformanceLabel = (performance) => {
    switch(performance?.toUpperCase()) {
      case 'EXCELLENT': return <span style={{ color: '#4CAF50' }}><Sparkles size={14} /> Excellent</span>;
      case 'BON': return <span style={{ color: '#8BC34A' }}><ThumbsUp size={14} /> Bon</span>;
      case 'MOYEN': return <span style={{ color: '#FFC107' }}><Minus size={14} /> Moyen</span>;
      case 'FAIBLE': return <span style={{ color: '#FF9800' }}><AlertTriangle size={14} /> Faible</span>;
      default: return 'N/A';
    }
  };

  const getChurnStatus = (tauxChurn) => {
    const value = parseFloat(tauxChurn);
    if (isNaN(value)) return { label: 'N/A', className: 'fa-moderate', icon: <Minus size={14} /> };
    if (value > 60) return { label: 'Critique', className: 'fa-critical', icon: <CircleX size={14} color="#FF5252" /> };
    if (value > 40) return { label: 'Élevé', className: 'fa-warning', icon: <CircleAlert size={14} color="#FF9800" /> };
    if (value > 25) return { label: 'Modéré', className: 'fa-moderate', icon: <Minus size={14} color="#FFC107" /> };
    return { label: 'Bon', className: 'fa-success', icon: <CircleCheck size={14} color="#4CAF50" /> };
  };

  // Rendu du tableau de bord principal
  const renderDashboard = () => {
    if (!dashboardData) return null;

    const indicateurs = dashboardData.indicateurs || {};
    const topTerrains = dashboardData.top_terrains || [];

    return (
      <div className="fa-tab-content">
        <div className="fa-kpi-grid">
          <div className="fa-kpi-card fa-primary">
            <div className="fa-kpi-icon"><Calendar size={32} /></div>
            <div className="fa-kpi-content">
              <div className="fa-kpi-title">Total Réservations</div>
              <div className="fa-kpi-value">{formatNumber(indicateurs.total_reservations)}</div>
              <div className="fa-kpi-subtitle">Sur la période</div>
            </div>
          </div>

          <div className="fa-kpi-card fa-secondary">
            <div className="fa-kpi-icon"><Users size={32} /></div>
            <div className="fa-kpi-content">
              <div className="fa-kpi-title">Clients Uniques</div>
              <div className="fa-kpi-value">{formatNumber(indicateurs.clients_uniques)}</div>
              <div className="fa-kpi-subtitle">30 derniers jours</div>
            </div>
          </div>

          <div className="fa-kpi-card fa-info">
            <div className="fa-kpi-icon"><Clock size={32} /></div>
            <div className="fa-kpi-content">
              <div className="fa-kpi-title">Durée moyenne</div>
              <div className="fa-kpi-value">{safeToFixed(indicateurs.duree_moyenne_heures)}h</div>
              <div className="fa-kpi-subtitle">par réservation</div>
            </div>
          </div>

          <div className="fa-kpi-card fa-warning">
            <div className="fa-kpi-icon"><XCircle size={32} /></div>
            <div className="fa-kpi-content">
              <div className="fa-kpi-title">Taux annulation</div>
              <div className="fa-kpi-value">{safeToFixed(indicateurs.taux_annulation)}%</div>
              <div className="fa-kpi-subtitle">des réservations</div>
            </div>
          </div>
        </div>

        <div className="fa-insight-section">
          <div className="fa-insight-card fa-status-card">
            <div className="fa-status-content">
              <div className="fa-status-badge">
                <div className="fa-status-badge-pulse"></div>
                {indicateurs.tendance || 'STABLE'}
              </div>
              <div className="fa-status-details">
                <div className="fa-status-item">
                  <span className="fa-label">Évolution</span>
                  <span className={`fa-value ${getTrendClass(indicateurs.evolution_reservations)}`}>
                    {safeToFixed(indicateurs.evolution_reservations)}%
                  </span>
                </div>
                <div className="fa-status-item">
                  <span className="fa-label">Période</span>
                  <span className="fa-value">30 jours</span>
                </div>
                <div className="fa-status-item">
                  <span className="fa-label">Moy/jour</span>
                  <span className="fa-value">
                    {Math.round((parseFloat(indicateurs.total_reservations) || 0) / 30)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="fa-insight-card">
            <h3 style={{ marginBottom: 16 }}>Top 5 terrains</h3>
            <div className="fa-top-list">
              {topTerrains.slice(0, 5).map((terrain, idx) => {
                const maxReservations = topTerrains[0]?.reservations || 1;
                return (
                  <div key={idx} className="fa-top-item">
                    <div className="fa-rank">{idx + 1}</div>
                    <div className="fa-top-item-content">
                      <span className="fa-name">{terrain.terrain}</span>
                      <span className="fa-metric">{terrain.reservations} résas</span>
                    </div>
                    <div className="fa-progress">
                      <div 
                        className="fa-progress-fill" 
                        style={{ width: `${(terrain.reservations / maxReservations) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {weeklyComparison && (
          <div className="fa-comparison-grid">
            <div className="fa-comparison-card">
              <div className="fa-comparison-header">
                <h3>Comparaison hebdomadaire</h3>
              </div>
              <div className="fa-comparison-metrics">
                <div className="fa-comparison-metric">
                  <div className="fa-metric-label">Réservations</div>
                  <div className="fa-metric-values">
                    <div className="fa-metric-current">
                      <small>Cette semaine</small>
                      <strong>{formatNumber(weeklyComparison.synthese?.total_semaine_courante)}</strong>
                    </div>
                    <div className="fa-metric-arrow"><ChevronRight size={20} /></div>
                    <div className="fa-metric-previous">
                      <small>Semaine dernière</small>
                      <strong>{formatNumber(weeklyComparison.synthese?.total_semaine_precedente)}</strong>
                    </div>
                  </div>
                  <div className={`fa-metric-evolution ${getTrendClass(weeklyComparison.synthese?.evolution_globale)}`}>
                    {getTrendIcon(weeklyComparison.synthese?.evolution_globale)}
                    {safeToFixed(weeklyComparison.synthese?.evolution_globale)}%
                  </div>
                </div>
                <div className="fa-comparison-metric">
                  <div className="fa-metric-label">Meilleur jour</div>
                  <div className="fa-metric-value">{weeklyComparison.synthese?.meilleur_jour || 'N/A'}</div>
                  <div className="fa-metric-subtitle">
                    {weeklyComparison.comparaison_journaliere?.find(j => j.jour === weeklyComparison.synthese?.meilleur_jour)?.reservations?.courant || 0} réservations
                  </div>
                </div>
                <div className="fa-comparison-metric">
                  <div className="fa-metric-label">Jours en hausse</div>
                  <div className="fa-metric-value">{weeklyComparison.synthese?.jours_en_hausse || 0}/7</div>
                  <div className={`fa-metric-subtitle ${(weeklyComparison.synthese?.jours_en_hausse || 0) >= 4 ? 'fa-positive' : 'fa-negative'}`}>
                    {(weeklyComparison.synthese?.jours_en_hausse || 0) >= 4 ? 'Tendance positive' : 'Tendance mitigée'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Rendu Analyse Horaire
  const renderAnalyseHoraire = () => {
    if (!hourlyData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Clock size={20} /> Distribution horaire des réservations</h3>
          </div>
          <div className="fa-empty-state">
            <Loader2 size={48} className="fa-spinning" />
            <h4>Chargement des données...</h4>
          </div>
        </div>
      );
    }

    const distribution = hourlyData.distribution_horaire || [];
    const analyses = hourlyData.analyses || {};

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Clock size={20} /> Distribution horaire des réservations</h3>
            <div className="fa-info-badge">
              <Activity size={12} />
              {hourlyData.periode || '30 jours'}
            </div>
          </div>
          <div className="fa-chart-container">
            <div className="fa-metrics-grid" style={{ marginBottom: 24 }}>
              <div className="fa-metric-card">
                <div className="fa-metric-icon"><Zap size={24} /></div>
                <div className="fa-metric-info">
                  <div className="fa-metric-title">Heure de pointe</div>
                  <div className="fa-metric-value">{analyses.meilleur_creneau?.heure || 'N/A'}h</div>
                  <div className="fa-metric-subtitle">{analyses.meilleur_creneau?.reservations || 0} réservations</div>
                </div>
              </div>
              <div className="fa-metric-card">
                <div className="fa-metric-icon"><Clock size={24} /></div>
                <div className="fa-metric-info">
                  <div className="fa-metric-title">Heures creuses</div>
                  <div className="fa-metric-value">{analyses.heures_creuses?.length || 0}</div>
                  <div className="fa-metric-subtitle">{analyses.heures_creuses?.join(', ') || 'Aucune'}</div>
                </div>
              </div>
            </div>

            <div className="fa-table-container">
              <table className="fa-data-table">
                <thead>
                  <tr><th>Heure</th><th>Réservations</th><th>Clients uniques</th><th>Taux annulation</th><th>Durée moyenne</th></tr>
                </thead>
                <tbody>
                  {distribution.map((h) => (
                    <tr key={h.heure}>
                      <td><strong>{h.heure}:00 - {h.heure + 1}:00</strong></td>
                      <td>{formatNumber(h.reservations)}</td>
                      <td>{formatNumber(h.clients_uniques)}</td>
                      <td>
                        <div className="fa-progress-cell">
                          <span className={parseFloat(h.taux_annulation) > 10 ? 'fa-negative' : 'fa-positive'}>
                            {safeToFixed(h.taux_annulation)}%
                          </span>
                          <div className="fa-progress-bar">
                            <div className="fa-progress-fill" style={{ width: `${Math.min(100, parseFloat(h.taux_annulation) * 2)}%`, background: '#FF5252' }}></div>
                          </div>
                        </div>
                      </td>
                      <td>{safeToFixed(h.duree_moyenne)}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {analyses.recommandations && analyses.recommandations.length > 0 && (
              <div className="fa-retention-summary" style={{ marginTop: 20 }}>
                {analyses.recommandations.map((rec, i) => (
                  <div key={i} className="fa-summary-item">
                    <div className="fa-summary-icon"><ThumbsUp size={20} /></div>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Rendu Types de Terrain
  const renderTypeTerrain = () => {
    if (!typeTerrainData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Target size={20} /> Performance par type de terrain</h3>
          </div>
          <div className="fa-empty-state">
            <Loader2 size={48} className="fa-spinning" />
            <h4>Chargement des données...</h4>
          </div>
        </div>
      );
    }

    const types = typeTerrainData.types_terrain || [];
    const resume = typeTerrainData.resume || {};

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Target size={20} /> Performance par type de terrain</h3>
            <div className="fa-info-badge">
              <Calendar size={12} />
              {typeTerrainData.periode || '90 jours'}
            </div>
          </div>
          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr>
                  <th>Type de terrain</th>
                  <th>Réservations</th>
                  <th>Clients uniques</th>
                  <th>Résas/terrain</th>
                  <th>Taux rotation</th>
                  <th>Taux annulation</th>
                </tr>
              </thead>
              <tbody>
                {types.map((type, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="fa-type-badge">{type.type_terrain}</div>
                    </td>
                    <td><strong>{formatNumber(type.reservations)}</strong></td>
                    <td>{formatNumber(type.clients_uniques)}</td>
                    <td>{type.reservations_par_terrain || '0'}</td>
                    <td>
                      <div className="fa-progress-cell">
                        <span>{type.taux_rotation || '0'}/jour</span>
                        <div className="fa-progress-bar">
                          <div className="fa-progress-fill" style={{ width: `${Math.min(100, parseFloat(type.taux_rotation) * 20)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className={parseFloat(type.taux_annulation) > 10 ? 'fa-negative' : 'fa-positive'}>
                      {safeToFixed(type.taux_annulation)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fa-retention-summary" style={{ marginTop: 20 }}>
            <div className="fa-summary-item">
              <Crown size={20} className="fa-summary-icon" />
              <span>Type le plus populaire: <strong>{resume.type_plus_populaire || 'N/A'}</strong></span>
            </div>
            <div className="fa-summary-item">
              <Zap size={20} className="fa-summary-icon" />
              <span>Meilleur taux de rotation: <strong>{resume.type_meilleur_taux_rotation || 'N/A'}</strong></span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rendu Évolution Mensuelle
  const renderEvolution = () => {
    if (!monthlyData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><ChartLine size={20} /> Évolution mensuelle des réservations</h3>
          </div>
          <div className="fa-empty-state">
            <Loader2 size={48} className="fa-spinning" />
            <h4>Chargement des données...</h4>
          </div>
        </div>
      );
    }

    const donnees = monthlyData.donnees || [];

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><ChartLine size={20} /> Évolution mensuelle des réservations</h3>
          </div>
          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr>
                  <th>Mois</th>
                  <th>Réservations</th>
                  <th>Nouveaux clients</th>
                  <th>Évolution</th>
                </tr>
              </thead>
              <tbody>
                {donnees.map((mois, idx) => (
                  <tr key={idx}>
                    <td><strong>{new Date(mois.mois).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</strong></td>
                    <td>{formatNumber(mois.reservations)}</td>
                    <td>{formatNumber(mois.nouveaux_clients)}</td>
                    <td className={getTrendClass(mois.evolution)}>
                      {getTrendIcon(mois.evolution)} {safeToFixed(mois.evolution)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Rendu Clients
  const renderClients = () => {
    if (!clientsData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Users size={20} /> Analyse des clients</h3>
          </div>
          <div className="fa-empty-state">
            <Loader2 size={48} className="fa-spinning" />
            <h4>Chargement des données...</h4>
          </div>
        </div>
      );
    }

    const clients = clientsData.clients_analyses || [];
    const alertes = clientsData.alertes || {};

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Users size={20} /> Analyse des clients</h3>
            <div className="fa-info-badge">
              <Users size={12} />
              {clientsData.periode || '180 jours'}
            </div>
          </div>

          <div className="fa-metrics-grid" style={{ marginBottom: 24 }}>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><UserCheck size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Clients actifs</div>
                <div className="fa-metric-value">{formatNumber(alertes.clients_actifs)}</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><UserX size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Clients à risque</div>
                <div className="fa-metric-value">{formatNumber(alertes.clients_a_risque)}</div>
              </div>
            </div>
          </div>

          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Réservations</th>
                  <th>Ancienneté</th>
                  <th>Inactif depuis</th>
                  <th>Profil</th>
                  <th>Taux annul.</th>
                </tr>
              </thead>
              <tbody>
                {clients.slice(0, 15).map((client, idx) => (
                  <tr key={idx}>
                    <td>{client.email}</td>
                    <td><strong>{client.nb_reservations}</strong></td>
                    <td>{client.anciennete_jours}j</td>
                    <td className={client.jours_depuis_derniere_resa > 30 ? 'fa-negative' : ''}>
                      {client.jours_depuis_derniere_resa}j
                    </td>
                    <td>
                      <div className={`fa-client-badge ${client.profil?.toLowerCase().replace(/ /g, '-') || ''}`}>
                        {client.profil || 'N/A'}
                      </div>
                    </td>
                    <td className={parseFloat(client.taux_annulation) > 15 ? 'fa-negative' : ''}>
                      {safeToFixed(client.taux_annulation)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {alertes.recommandations && alertes.recommandations.length > 0 && (
            <div className="fa-retention-summary" style={{ marginTop: 20 }}>
              {alertes.recommandations.map((rec, i) => (
                <div key={i} className="fa-summary-item">
                  <AlertCircle size={20} className="fa-summary-icon" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Rendu Prévisions
  const renderPrevisions = () => {
    if (!forecastData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Gauge size={20} /> Prévisions des réservations</h3>
          </div>
          <div className="fa-empty-state">
            <Loader2 size={48} className="fa-spinning" />
            <h4>Chargement des données...</h4>
          </div>
        </div>
      );
    }

    const previsions = forecastData.previsions || [];

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Gauge size={20} /> Prévisions des réservations</h3>
            <div className="fa-info-badge">Basé sur tendance linéaire</div>
          </div>
          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr>
                  <th>Mois</th>
                  <th>Réservations prévues</th>
                  <th>Niveau confiance</th>
                </tr>
              </thead>
              <tbody>
                {previsions.map((prev, idx) => (
                  <tr key={idx}>
                    <td><strong>{new Date(prev.mois + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</strong></td>
                    <td>{formatNumber(prev.reservations_prevues)}</td>
                    <td>
                      <div className={`fa-client-badge ${(prev.confiance || 'FAIBLE').toLowerCase()}`}>
                        {prev.confiance || 'FAIBLE'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fa-retention-summary" style={{ marginTop: 20 }}>
            <div className="fa-summary-item">
              <CheckCircle size={20} className="fa-summary-icon" />
              <span>Recommandation: <strong>{forecastData.analyse_tendance?.recommandations || 'Aucune recommandation'}</strong></span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rendu Villes & Quartiers (simplifié)
  const renderVilleQuartier = () => {
    if (!villeQuartierData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><MapPin size={20} /> Analyse par Ville et Quartier</h3>
          </div>
          <div className="fa-empty-state">
            <Loader2 size={48} className="fa-spinning" />
            <h4>Chargement des données...</h4>
          </div>
        </div>
      );
    }

    const synthese = villeQuartierData.synthese || {};
    const analyseParVille = villeQuartierData.analyse_par_ville || [];

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><MapPin size={20} /> Performance par Ville et Quartier</h3>
            <div className="fa-info-badge">
              <Calendar size={12} />
              {villeQuartierData.periode || '90 derniers jours'}
            </div>
          </div>

          <div className="fa-metrics-grid" style={{ marginBottom: 24 }}>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Award size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Ville la plus active</div>
                <div className="fa-metric-value" style={{ fontSize: 20 }}>
                  {synthese.ville_la_plus_active || 'N/A'}
                </div>
                <div className="fa-metric-subtitle">Meilleure performance</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><DollarSign size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Ville plus rentable</div>
                <div className="fa-metric-value" style={{ fontSize: 20 }}>
                  {synthese.ville_plus_rentable || 'N/A'}
                </div>
                <div className="fa-metric-subtitle">Plus grand revenu</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Shield size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Meilleure fidélisation</div>
                <div className="fa-metric-value" style={{ fontSize: 20 }}>
                  {synthese.ville_meilleur_fidelisation || 'N/A'}
                </div>
                <div className="fa-metric-subtitle">Churn: {synthese.meilleur_taux_churn || '0%'}</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><MapPin size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Villes actives</div>
                <div className="fa-metric-value">{formatNumber(synthese.nombre_villes_actives)}</div>
                <div className="fa-metric-subtitle">Total réservations: {formatNumber(synthese.total_reservations)}</div>
              </div>
            </div>
          </div>

          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr>
                  <th>Ville</th>
                  <th>Réservations</th>
                  <th>Clients</th>
                  <th>Revenu (DH)</th>
                  <th>Taux Churn</th>
                </tr>
              </thead>
              <tbody>
                {analyseParVille.map((ville, idx) => (
                  <tr key={idx}>
                    <td><strong>{ville.ville}</strong></td>
                    <td>{formatNumber(ville.total_reservations)}</td>
                    <td>{formatNumber(ville.clients_uniques)}</td>
                    <td className="fa-positive">{formatNumber(parseFloat(ville.revenu_total || 0))}</td>
                    <td className={parseFloat(ville.taux_churn) > 30 ? 'fa-negative' : 'fa-positive'}>
                      {safeToFixed(ville.taux_churn)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {synthese.recommandations && synthese.recommandations.length > 0 && (
            <div className="fa-retention-summary" style={{ marginTop: 20 }}>
              {synthese.recommandations.map((rec, i) => (
                <div key={i} className="fa-summary-item">
                  <ThumbsUp size={20} className="fa-summary-icon" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Rendu Sports & Rentabilité (simplifié)
  const renderSportRentabilite = () => {
    if (!sportRentabiliteData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Trophy size={20} /> Analyse des Sports et Rentabilité</h3>
          </div>
          <div className="fa-empty-state">
            <Loader2 size={48} className="fa-spinning" />
            <h4>Chargement des données...</h4>
          </div>
        </div>
      );
    }

    const synthese = sportRentabiliteData.synthese || {};
    const topSports = sportRentabiliteData.top_sports_rentables || [];

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Trophy size={20} /> Analyse des Sports et Rentabilité</h3>
            <div className="fa-info-badge">
              <Calendar size={12} />
              {sportRentabiliteData.periode || '90 derniers jours'}
            </div>
          </div>

          <div className="fa-metrics-grid" style={{ marginBottom: 24 }}>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Crown size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Sport le plus rentable</div>
                <div className="fa-metric-value" style={{ fontSize: 20 }}>
                  {synthese.sport_le_plus_rentable || 'N/A'}
                </div>
                <div className="fa-metric-subtitle">Meilleur ROI</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Flame size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Sport le plus populaire</div>
                <div className="fa-metric-value" style={{ fontSize: 20 }}>
                  {synthese.sport_plus_populaire || 'N/A'}
                </div>
                <div className="fa-metric-subtitle">Plus de réservations</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><DollarSign size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Revenu total</div>
                <div className="fa-metric-value" style={{ fontSize: 20 }}>
                  {formatNumber(parseFloat(synthese.total_revenu || 0))} DH
                </div>
                <div className="fa-metric-subtitle">{formatNumber(synthese.total_reservations)} réservations</div>
              </div>
            </div>
          </div>

          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Sport</th>
                  <th>Revenu (DH)</th>
                  <th>Réservations</th>
                  <th>Rentabilité (DH/terrain)</th>
                </tr>
              </thead>
              <tbody>
                {topSports.map((sport, idx) => (
                  <tr key={idx}>
                    <td><span className="fa-rank-badge">{idx + 1}</span></td>
                    <td><strong>{sport.sport}</strong></td>
                    <td className="fa-positive">{formatNumber(parseFloat(sport.revenu_total || 0))}</td>
                    <td>{formatNumber(sport.total_reservations)}</td>
                    <td className="fa-positive">{formatNumber(parseFloat(sport.rentabilite || 0))} DH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Rendu Terrains Détaillés (simplifié)
  const renderTerrainsDetail = () => {
    if (!terrainsDetailData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Building size={20} /> Analyse Détaillée des Terrains</h3>
          </div>
          <div className="fa-empty-state">
            <Loader2 size={48} className="fa-spinning" />
            <h4>Chargement des données...</h4>
          </div>
        </div>
      );
    }

    const synthese = terrainsDetailData.synthese_globale || {};
    const topTerrains = terrainsDetailData.top_terrains_global || [];

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Building size={20} /> Analyse Détaillée des Terrains</h3>
            <div className="fa-info-badge">
              <Calendar size={12} />
              {terrainsDetailData.periode || '90 derniers jours'}
            </div>
          </div>

          <div className="fa-metrics-grid">
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Building size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Total Terrains</div>
                <div className="fa-metric-value">{formatNumber(synthese.total_terrains)}</div>
                <div className="fa-metric-subtitle">Dans {formatNumber(synthese.total_villes)} villes</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Calendar size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Total Réservations</div>
                <div className="fa-metric-value">{formatNumber(synthese.total_reservations)}</div>
                <div className="fa-metric-subtitle">Sur la période</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon" style={{ color: '#FF5252' }}><TrendingDown size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Terrains en Déclin</div>
                <div className="fa-metric-value" style={{ color: '#FF5252' }}>
                  {formatNumber(synthese.total_terrains_en_declin)}
                </div>
                <div className="fa-metric-subtitle"><AlertTriangle size={12} /> À surveiller</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon" style={{ color: '#4CAF50' }}><TrendingUp size={24} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Terrains en Croissance</div>
                <div className="fa-metric-value" style={{ color: '#4CAF50' }}>
                  {formatNumber(synthese.total_terrains_en_croissance)}
                </div>
                <div className="fa-metric-subtitle"><Rocket size={12} /> Opportunités</div>
              </div>
            </div>
          </div>

          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Terrain</th>
                  <th>Ville</th>
                  <th>Réservations</th>
                  <th>Revenu (DH)</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {topTerrains.slice(0, 10).map((t, idx) => (
                  <tr key={idx}>
                    <td><span className="fa-rank-badge">{idx + 1}</span></td>
                    <td><strong>{t.nom || t.numeroterrain}</strong></td>
                    <td>{t.ville}</td>
                    <td>{formatNumber(t.reservations)}</td>
                    <td className="fa-positive">{formatNumber(parseFloat(t.revenu))}</td>
                    <td>{getPerformanceLabel(t.performance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {terrainsDetailData.recommandations_strategiques && terrainsDetailData.recommandations_strategiques.length > 0 && (
            <div className="fa-retention-summary" style={{ marginTop: 20 }}>
              {terrainsDetailData.recommandations_strategiques.map((rec, i) => (
                <div key={i} className="fa-summary-item">
                  <CheckCircle size={20} className="fa-summary-icon" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Rendu du contenu en fonction de l'onglet actif
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'analyse-horaire':
        return renderAnalyseHoraire();
      case 'type-terrain':
        return renderTypeTerrain();
      case 'evolution':
        return renderEvolution();
      case 'clients':
        return renderClients();
      case 'previsions':
        return renderPrevisions();
      case 'ville-quartier':
        return renderVilleQuartier();
      case 'sport-rentabilite':
        return renderSportRentabilite();
      case 'terrains-detail':
        return renderTerrainsDetail();
      default:
        return renderDashboard();
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="fa-dashboard-loader">
        <div className="fa-loader-spinner">
          <div className="fa-loader-dot"></div>
          <div className="fa-loader-dot"></div>
          <div className="fa-loader-dot"></div>
        </div>
        <div className="fa-loader-text">
          <Loader2 size={24} className="fa-spinning" />
          <span>Chargement des données...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="fa-dashboard">
        <header className="fa-header">
          <div className="fa-header-content">
            <div className="fa-logo-section">
              <div className="fa-logo-icon">
                <div className="fa-logo-pulse"></div>
                <Calendar size={28} />
              </div>
              <div className="fa-logo-text">
                <h1>Dashboard Réservations</h1>
                <div className="fa-subtitle">Analyse complète des réservations</div>
              </div>
            </div>
            <div className="fa-header-actions">
              <button className="fa-btn-refresh" onClick={fetchData}>
                <RefreshCw size={16} />
                <span>Actualiser</span>
              </button>
              <button 
                className="fa-btn-mobile-menu" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={20} />
              </button>
              <div className="fa-header-time">
                <Clock size={14} />
                <span className="fa-time-text">
                  {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '--:--'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <nav className={`fa-nav ${mobileMenuOpen ? 'fa-mobile-open' : ''}`}>
          <div className="fa-nav-track">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`fa-nav-tab ${activeTab === tab.id ? 'fa-nav-tab-active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className="fa-main">
          <div className="fa-content-wrapper">
            {renderContent()}

            {error && (
              <div className="fa-chart-card" style={{ background: 'rgba(255,82,82,0.1)', borderColor: '#FF5252' }}>
                <div className="fa-card-header">
                  <AlertCircle size={20} color="#FF5252" />
                  <h3>Erreur</h3>
                </div>
                <p>{error}</p>
                <button className="fa-btn-refresh" onClick={fetchData}>Réessayer</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ReservationDashboard;