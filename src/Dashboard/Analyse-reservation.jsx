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
  LayoutDashboard,
  ChartLine,
  Gauge,
  CircleCheck,
  CircleX,
  CircleAlert,
  Sparkles,
  Rocket,
  Gem,
  Home,
  Filter,
  Search,
  Download,
  Eye,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Database,
  Server,
  Wifi,
  WifiOff
} from 'lucide-react';

// Styles CSS avec mise en forme corrigée
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .fa-dashboard {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f0f4f8;
    padding: 24px;
    max-width: 1440px;
    margin: 0 auto;
    min-height: 100vh;
  }

  /* Header */
  .fa-header {
    background: #ffffff;
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid #e8edf2;
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #1a3d06, #2ea84e);
    border-radius: 12px;
    color: #fff;
    flex-shrink: 0;
  }

  .fa-logo-text h1 {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
    color: #1a3d06;
  }

  .fa-logo-text .fa-subtitle {
    font-size: 0.75rem;
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
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
  }

  .fa-btn-refresh:hover {
    background: #e0efe0;
  }

  .fa-btn-mobile-menu {
    display: none;
    padding: 8px;
    background: transparent;
    border: 1px solid #e0e8e2;
    border-radius: 8px;
    cursor: pointer;
  }

  .fa-header-time {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: #f8faf8;
    border-radius: 8px;
    font-size: 0.8rem;
    color: #6d7a86;
  }

  .fa-dot-online {
    width: 8px;
    height: 8px;
    background: #2ea84e;
    border-radius: 50%;
    display: inline-block;
  }

  /* Navigation */
  .fa-nav {
    background: #ffffff;
    border-radius: 12px;
    padding: 6px;
    margin-bottom: 20px;
    border: 1px solid #e8edf2;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    overflow-x: auto;
  }

  .fa-nav-track {
    display: flex;
    gap: 4px;
    min-width: max-content;
  }

  .fa-nav-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: none;
    background: transparent;
    border-radius: 8px;
    color: #6d7a86;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .fa-nav-tab:hover {
    color: #1a3d06;
    background: #f0f7f0;
  }

  .fa-nav-tab-active {
    color: #1a3d06;
    background: #f0f7f0;
  }

  /* KPI Grid - CORRIGÉ */
  .fa-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
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
    border: 1px solid #e8edf2;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    transition: all 0.2s;
  }

  .fa-kpi-card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    transform: translateY(-2px);
  }

  .fa-kpi-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
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
    min-width: 0;
  }

  .fa-kpi-title {
    font-size: 0.7rem;
    color: #6d7a86;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 2px;
  }

  .fa-kpi-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a3d06;
    line-height: 1.2;
  }

  .fa-kpi-trend {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 100px;
    margin-top: 2px;
  }

  .fa-positive {
    color: #27ae60;
    background: rgba(39, 174, 96, 0.1);
  }

  .fa-negative {
    color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);
  }

  .fa-neutral {
    color: #6d7a86;
    background: rgba(109, 122, 134, 0.1);
  }

  .fa-kpi-subtitle {
    font-size: 0.65rem;
    color: #95a5a6;
  }

  /* Insight Section - CORRIGÉ */
  .fa-insight-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  .fa-insight-card {
    padding: 20px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e8edf2;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .fa-status-card {
    background: linear-gradient(135deg, #1a3d06, #2ea84e);
    color: #fff;
    border: none;
  }

  .fa-status-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
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
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.15);
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
    gap: 2px;
  }

  .fa-status-item .fa-label {
    font-size: 0.6rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .fa-status-item .fa-value {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .fa-insight-card h3 {
    margin: 0 0 16px 0;
    font-size: 0.95rem;
    color: #1a3d06;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Top List - CORRIGÉ */
  .fa-top-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
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
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #f0f7f0;
    font-size: 0.75rem;
    font-weight: 700;
    color: #1a3d06;
    flex-shrink: 0;
  }

  .fa-rank-1 {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: white;
  }

  .fa-rank-2 {
    background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
    color: white;
  }

  .fa-rank-3 {
    background: linear-gradient(135deg, #CD7F32, #B8860B);
    color: white;
  }

  .fa-top-item-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .fa-name {
    font-weight: 600;
    font-size: 0.85rem;
    color: #1a3d06;
  }

  .fa-metric {
    font-size: 0.75rem;
    color: #6d7a86;
    font-weight: 500;
  }

  .fa-progress {
    flex: 1;
    height: 4px;
    background: #f0f0f0;
    border-radius: 100px;
    overflow: hidden;
    min-width: 40px;
  }

  .fa-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #1a3d06, #2ea84e);
    border-radius: 100px;
    transition: width 0.6s ease;
  }

  /* Comparison - CORRIGÉ */
  .fa-comparison-card {
    padding: 20px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e8edf2;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .fa-comparison-header h3 {
    margin: 0 0 16px 0;
    font-size: 0.95rem;
    color: #1a3d06;
    font-weight: 600;
  }

  .fa-comparison-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .fa-comparison-metric {
    padding: 14px;
    background: #f8faf8;
    border-radius: 8px;
    border: 1px solid #e8edf2;
  }

  .fa-metric-label {
    font-size: 0.65rem;
    color: #6d7a86;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .fa-metric-values {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fa-metric-current small,
  .fa-metric-previous small {
    display: block;
    font-size: 0.55rem;
    color: #95a5a6;
  }

  .fa-metric-current strong,
  .fa-metric-previous strong {
    font-size: 1.1rem;
    color: #1a3d06;
    font-weight: 700;
  }

  .fa-metric-arrow {
    color: #95a5a6;
    opacity: 0.3;
  }

  .fa-metric-evolution {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 100px;
    margin-top: 6px;
  }

  .fa-metric-subtitle {
    font-size: 0.65rem;
    color: #95a5a6;
    margin-top: 4px;
  }

  /* Chart Cards */
  .fa-chart-card {
    padding: 20px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e8edf2;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    margin-bottom: 20px;
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
    font-size: 0.95rem;
    color: #1a3d06;
    font-weight: 600;
  }

  .fa-info-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: #f0f7f0;
    border-radius: 100px;
    font-size: 0.65rem;
    color: #1a3d06;
    font-weight: 600;
  }

  /* Metrics Grid */
  .fa-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .fa-metric-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: #f8faf8;
    border-radius: 8px;
    border: 1px solid #e8edf2;
  }

  .fa-metric-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
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
    font-size: 0.65rem;
    color: #6d7a86;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .fa-metric-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1a3d06;
  }

  .fa-metric-subtitle {
    font-size: 0.6rem;
    color: #95a5a6;
  }

  /* Table */
  .fa-table-container {
    overflow-x: auto;
    margin-top: 4px;
    border-radius: 8px;
    border: 1px solid #e8edf2;
  }

  .fa-data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
  }

  .fa-data-table th {
    text-align: left;
    padding: 10px 14px;
    background: #f8faf8;
    color: #6d7a86;
    font-weight: 600;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 2px solid #e8edf2;
  }

  .fa-data-table td {
    padding: 10px 14px;
    border-bottom: 1px solid #f0f0f0;
    color: #1a3d06;
    font-weight: 500;
  }

  .fa-data-table tr:hover {
    background: #f8faf8;
  }

  .fa-data-table tr:last-child td {
    border-bottom: none;
  }

  .fa-rank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #f0f7f0;
    font-size: 0.65rem;
    font-weight: 700;
    color: #1a3d06;
  }

  .fa-rank-badge.fa-gold {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: white;
  }

  .fa-rank-badge.fa-silver {
    background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
    color: white;
  }

  .fa-rank-badge.fa-bronze {
    background: linear-gradient(135deg, #CD7F32, #B8860B);
    color: white;
  }

  .fa-client-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 0.65rem;
    font-weight: 600;
    background: #f0f7f0;
    color: #1a3d06;
  }

  .fa-success {
    background: rgba(39, 174, 96, 0.1);
    color: #27ae60;
  }

  .fa-warning {
    background: rgba(230, 126, 34, 0.1);
    color: #e67e22;
  }

  .fa-critical {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
  }

  .fa-moderate {
    background: rgba(241, 196, 15, 0.1);
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
    background: #f0f7f0;
    font-size: 0.75rem;
    font-weight: 600;
    color: #1a3d06;
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
    gap: 12px;
    padding: 12px 16px;
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
    border-radius: 100px;
    overflow: hidden;
  }

  .fa-empty-top-list {
    padding: 20px;
    text-align: center;
    color: #95a5a6;
    font-size: 0.85rem;
  }

  .fa-no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
    color: #95a5a6;
  }

  .fa-no-data h4 {
    margin: 8px 0 4px 0;
    color: #6d7a86;
    font-weight: 600;
    font-size: 1rem;
  }

  .fa-no-data p {
    margin: 0;
    font-size: 0.85rem;
    color: #95a5a6;
  }

  .fa-loader-spinner {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
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
    0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
  }

  .fa-dashboard-loader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f0f4f8;
  }

  .fa-loader-text {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #1a3d06;
    font-size: 1rem;
    font-weight: 500;
  }

  .fa-spinning {
    animation: fa-spin 1s linear infinite;
  }

  @keyframes fa-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .fa-kpi-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .fa-insight-section {
      grid-template-columns: 1fr;
    }

    .fa-comparison-metrics {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .fa-dashboard {
      padding: 16px;
    }

    .fa-header {
      padding: 16px 20px;
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
      padding: 8px 14px;
    }

    .fa-kpi-grid {
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .fa-kpi-card {
      padding: 16px;
    }

    .fa-kpi-value {
      font-size: 1.2rem;
    }

    .fa-status-details {
      grid-template-columns: 1fr 1fr;
    }

    .fa-comparison-metrics {
      grid-template-columns: 1fr;
    }

    .fa-metrics-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 480px) {
    .fa-dashboard {
      padding: 12px;
    }

    .fa-kpi-grid {
      grid-template-columns: 1fr;
    }

    .fa-metrics-grid {
      grid-template-columns: 1fr;
    }

    .fa-header-actions .fa-btn-refresh span {
      display: none;
    }

    .fa-status-details {
      grid-template-columns: 1fr;
    }

    .fa-kpi-card {
      padding: 14px;
    }

    .fa-kpi-value {
      font-size: 1.1rem;
    }

    .fa-kpi-icon {
      width: 40px;
      height: 40px;
    }

    .fa-data-table {
      font-size: 0.7rem;
    }

    .fa-data-table th,
    .fa-data-table td {
      padding: 6px 8px;
    }
  }
`;

const API_BASE_URL = 'https://backend-foot-omega.vercel.app/api/analyse-reservation';

const ReservationDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  
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

  const requestJson = async (url) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(url, {
        headers: { 
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || `Erreur ${response.status}`);
        } catch {
          throw new Error(`Erreur ${response.status}: ${text || 'Erreur inconnue'}`);
        }
      }

      const contentType = response.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('La requête a expiré. Veuillez réessayer.');
      }
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoints = [
        `${API_BASE_URL}/dashboard-reservations`,
        `${API_BASE_URL}/analyse-horaire`,
        `${API_BASE_URL}/analyse-par-type-terrain`,
        `${API_BASE_URL}/evolution-mensuelle`,
        `${API_BASE_URL}/analyse-clients-reservations`,
        `${API_BASE_URL}/comparaison-hebdomadaire`,
        `${API_BASE_URL}/previsions-reservations`,
        `${API_BASE_URL}/analyse-annulations`,
        `${API_BASE_URL}/analyse-par-ville-quartier`,
        `${API_BASE_URL}/analyse-par-sport-rentabilite`,
        `${API_BASE_URL}/analyse-terrains-ville-quartier`
      ];

      const responses = await Promise.allSettled(endpoints.map(url => requestJson(url)));

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
      ] = responses.map(r => r.status === 'fulfilled' ? r.value : null);

      if (dashboardRes?.success) setDashboardData(dashboardRes);
      if (hourlyRes?.success) setHourlyData(hourlyRes);
      if (typeTerrainRes?.success) setTypeTerrainData(typeTerrainRes);
      if (monthlyRes?.success) setMonthlyData(monthlyRes);
      if (clientsRes?.success) setClientsData(clientsRes);
      if (weeklyRes?.success) setWeeklyComparison(weeklyRes);
      if (forecastRes?.success) setForecastData(forecastRes);
      if (cancellationRes?.success) setCancellationData(cancellationRes);
      if (villeQuartierRes?.success) setVilleQuartierData(villeQuartierRes);
      if (sportRentabiliteRes?.success) setSportRentabiliteData(sportRentabiliteRes);
      if (terrainsDetailRes?.success) setTerrainsDetailData(terrainsDetailRes);

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(err.message || 'Erreur de connexion au serveur');
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
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={17} /> },
    { id: 'analyse-horaire', label: 'Analyse horaire', icon: <Clock size={17} /> },
    { id: 'type-terrain', label: 'Types de terrain', icon: <Target size={17} /> },
    { id: 'evolution', label: 'Évolution', icon: <ChartLine size={17} /> },
    { id: 'clients', label: 'Clients', icon: <Users size={17} /> },
    { id: 'previsions', label: 'Prévisions', icon: <Gauge size={17} /> },
    { id: 'ville-quartier', label: 'Villes & Quartiers', icon: <MapPin size={17} /> },
    { id: 'sport-rentabilite', label: 'Sports & Rentabilité', icon: <Trophy size={17} /> },
    { id: 'terrains-detail', label: 'Terrains Détaillés', icon: <Building size={17} /> }
  ], []);

  const getTrendIcon = (value) => {
    const numValue = parseFloat(value);
    if (numValue > 0) return <TrendingUp size={13} />;
    if (numValue < 0) return <TrendingDown size={13} />;
    return <Minus size={13} />;
  };

  const getTrendClass = (value) => {
    const numValue = parseFloat(value);
    if (numValue > 0) return 'fa-positive';
    if (numValue < 0) return 'fa-negative';
    return 'fa-neutral';
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
      case 'EXCELLENT': return <span style={{ color: '#4CAF50', fontWeight: 600 }}><Sparkles size={13} /> Excellent</span>;
      case 'BON': return <span style={{ color: '#8BC34A', fontWeight: 600 }}><ThumbsUp size={13} /> Bon</span>;
      case 'MOYEN': return <span style={{ color: '#FFC107', fontWeight: 600 }}><Minus size={13} /> Moyen</span>;
      case 'FAIBLE': return <span style={{ color: '#FF9800', fontWeight: 600 }}><AlertTriangle size={13} /> Faible</span>;
      default: return <span style={{ color: '#95a5a6' }}>N/A</span>;
    }
  };

  const getRankClass = (index) => {
    if (index === 0) return 'fa-gold';
    if (index === 1) return 'fa-silver';
    if (index === 2) return 'fa-bronze';
    return '';
  };

  // RENDER DASHBOARD - CORRIGÉ
  const renderDashboard = () => {
    if (!dashboardData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><LayoutDashboard size={18} /> Tableau de bord</h3>
          </div>
          <div className="fa-no-data">
            <Database size={40} />
            <h4>Aucune donnée disponible</h4>
            <p>Les données du tableau de bord n'ont pas encore été chargées.</p>
            <button className="fa-btn-refresh" onClick={fetchData} style={{ marginTop: 12 }}>
              <RefreshCw size={14} />
              Charger
            </button>
          </div>
        </div>
      );
    }

    const indicateurs = dashboardData.indicateurs || {};
    const topTerrains = dashboardData.top_terrains || [];
    const hasData = indicateurs.total_reservations > 0;

    return (
      <div className="fa-tab-content">
        {/* KPI Grid */}
        <div className="fa-kpi-grid">
          <div className="fa-kpi-card fa-primary">
            <div className="fa-kpi-icon"><Calendar size={26} /></div>
            <div className="fa-kpi-content">
              <div className="fa-kpi-title">Total Réservations</div>
              <div className="fa-kpi-value">{formatNumber(indicateurs.total_reservations)}</div>
              {indicateurs.evolution_reservations !== undefined && hasData && (
                <div className={`fa-kpi-trend ${getTrendClass(indicateurs.evolution_reservations)}`}>
                  {getTrendIcon(indicateurs.evolution_reservations)}
                  {safeToFixed(indicateurs.evolution_reservations)}%
                </div>
              )}
            </div>
          </div>

          <div className="fa-kpi-card fa-secondary">
            <div className="fa-kpi-icon"><Users size={26} /></div>
            <div className="fa-kpi-content">
              <div className="fa-kpi-title">Clients Uniques</div>
              <div className="fa-kpi-value">{formatNumber(indicateurs.clients_uniques)}</div>
              <div className="fa-kpi-subtitle">30 derniers jours</div>
            </div>
          </div>

          <div className="fa-kpi-card fa-info">
            <div className="fa-kpi-icon"><Clock size={26} /></div>
            <div className="fa-kpi-content">
              <div className="fa-kpi-title">Durée moyenne</div>
              <div className="fa-kpi-value">{safeToFixed(indicateurs.duree_moyenne_heures)}h</div>
              <div className="fa-kpi-subtitle">par réservation</div>
            </div>
          </div>

          <div className="fa-kpi-card fa-warning">
            <div className="fa-kpi-icon"><XCircle size={26} /></div>
            <div className="fa-kpi-content">
              <div className="fa-kpi-title">Taux annulation</div>
              <div className="fa-kpi-value">{safeToFixed(indicateurs.taux_annulation)}%</div>
              <div className="fa-kpi-subtitle">des réservations</div>
            </div>
          </div>
        </div>

        {/* Insight Section */}
        <div className="fa-insight-section">
          <div className="fa-insight-card fa-status-card">
            <div className="fa-status-content">
              <div className="fa-status-badge">
                <div className="fa-status-badge-pulse"></div>
                {hasData ? (indicateurs.tendance || 'STABLE') : 'AUCUNE DONNÉE'}
              </div>
              <div className="fa-status-details">
                <div className="fa-status-item">
                  <span className="fa-label">Évolution</span>
                  <span className="fa-value">{hasData ? `${safeToFixed(indicateurs.evolution_reservations)}%` : '—'}</span>
                </div>
                <div className="fa-status-item">
                  <span className="fa-label">Période</span>
                  <span className="fa-value">30 jours</span>
                </div>
                <div className="fa-status-item">
                  <span className="fa-label">Moy/jour</span>
                  <span className="fa-value">
                    {hasData ? Math.round((parseFloat(indicateurs.total_reservations) || 0) / 30) : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="fa-insight-card">
            <h3><Crown size={18} style={{ color: '#FFD700' }} /> Top 5 terrains</h3>
            {topTerrains.length > 0 ? (
              <div className="fa-top-list">
                {topTerrains.slice(0, 5).map((terrain, idx) => {
                  const maxReservations = topTerrains[0]?.reservations || 1;
                  return (
                    <div key={idx} className="fa-top-item">
                      <div className={`fa-rank ${idx === 0 ? 'fa-rank-1' : ''} ${idx === 1 ? 'fa-rank-2' : ''} ${idx === 2 ? 'fa-rank-3' : ''}`}>
                        {idx + 1}
                      </div>
                      <div className="fa-top-item-content">
                        <span className="fa-name">{terrain.terrain}</span>
                        <span className="fa-metric">{terrain.reservations} résas</span>
                      </div>
                      <div className="fa-progress">
                        <div 
                          className="fa-progress-fill" 
                          style={{ width: `${(terrain.reservations / maxReservations) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="fa-empty-top-list">
                <AlertCircle size={20} style={{ color: '#95a5a6', marginBottom: 6 }} />
                <p>Aucun terrain réservé</p>
              </div>
            )}
          </div>
        </div>

        {/* Comparison */}
        {weeklyComparison && weeklyComparison.synthese && (
          <div className="fa-comparison-card">
            <div className="fa-comparison-header">
              <h3>📊 Comparaison hebdomadaire</h3>
            </div>
            <div className="fa-comparison-metrics">
              <div className="fa-comparison-metric">
                <div className="fa-metric-label">Réservations</div>
                <div className="fa-metric-values">
                  <div className="fa-metric-current">
                    <small>Cette semaine</small>
                    <strong>{formatNumber(weeklyComparison.synthese?.total_semaine_courante)}</strong>
                  </div>
                  <div className="fa-metric-arrow"><ChevronRight size={18} /></div>
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
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {weeklyComparison.synthese?.meilleur_jour || 'N/A'}
                </div>
                <div className="fa-metric-subtitle">
                  {weeklyComparison.comparaison_journaliere?.find(j => j.jour === weeklyComparison.synthese?.meilleur_jour)?.reservations?.courant || 0} réservations
                </div>
              </div>
              <div className="fa-comparison-metric">
                <div className="fa-metric-label">Jours en hausse</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {weeklyComparison.synthese?.jours_en_hausse || 0}/7
                </div>
                <div className={`fa-metric-subtitle ${(weeklyComparison.synthese?.jours_en_hausse || 0) >= 4 ? 'fa-positive-text' : 'fa-negative-text'}`}>
                  {(weeklyComparison.synthese?.jours_en_hausse || 0) >= 4 ? '📈 Tendance positive' : '📉 Tendance mitigée'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // RENDER ANALYSE HORAIRE
  const renderAnalyseHoraire = () => {
    if (!hourlyData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Clock size={18} /> Distribution horaire</h3>
          </div>
          <div className="fa-no-data">
            <Database size={40} />
            <h4>Aucune donnée</h4>
            <p>Les données horaires ne sont pas disponibles.</p>
          </div>
        </div>
      );
    }

    const distribution = hourlyData.distribution_horaire || [];
    const analyses = hourlyData.analyses || {};

    if (distribution.length === 0) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Clock size={18} /> Distribution horaire</h3>
          </div>
          <div className="fa-no-data">
            <Clock size={40} />
            <h4>Aucune réservation horaire</h4>
            <p>Aucune réservation enregistrée sur la période.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Clock size={18} /> Distribution horaire des réservations</h3>
            <div className="fa-info-badge">
              <Activity size={12} />
              {hourlyData.periode || '30 jours'}
            </div>
          </div>
          
          <div className="fa-metrics-grid">
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Zap size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Heure de pointe</div>
                <div className="fa-metric-value">{analyses.meilleur_creneau?.heure || 'N/A'}h</div>
                <div className="fa-metric-subtitle">{analyses.meilleur_creneau?.reservations || 0} réservations</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Clock size={20} /></div>
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
                        <span className={parseFloat(h.taux_annulation) > 10 ? 'fa-negative-text' : 'fa-positive-text'}>
                          {safeToFixed(h.taux_annulation)}%
                        </span>
                        <div className="fa-progress-bar">
                          <div className="fa-progress-fill" style={{ width: `${Math.min(100, parseFloat(h.taux_annulation) * 2)}%`, background: '#FF5252' }} />
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
            <div className="fa-retention-summary">
              {analyses.recommandations.map((rec, i) => (
                <div key={i} className="fa-summary-item">
                  <div className="fa-summary-icon"><ThumbsUp size={18} /></div>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // RENDER TYPE TERRAIN
  const renderTypeTerrain = () => {
    if (!typeTerrainData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Target size={18} /> Performance par type</h3>
          </div>
          <div className="fa-no-data">
            <Database size={40} />
            <h4>Aucune donnée</h4>
            <p>Les données par type de terrain ne sont pas disponibles.</p>
          </div>
        </div>
      );
    }

    const types = typeTerrainData.types_terrain || [];
    const resume = typeTerrainData.resume || {};

    if (types.length === 0) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Target size={18} /> Performance par type</h3>
          </div>
          <div className="fa-no-data">
            <Target size={40} />
            <h4>Aucun type de terrain</h4>
            <p>Aucune donnée disponible sur les types de terrain.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Target size={18} /> Performance par type de terrain</h3>
            <div className="fa-info-badge">
              <Calendar size={12} />
              {typeTerrainData.periode || '90 jours'}
            </div>
          </div>
          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Réservations</th>
                  <th>Clients</th>
                  <th>Résas/terrain</th>
                  <th>Rotation</th>
                  <th>Annulation</th>
                </tr>
              </thead>
              <tbody>
                {types.map((type, idx) => (
                  <tr key={idx}>
                    <td><div className="fa-type-badge">{type.type_terrain}</div></td>
                    <td><strong>{formatNumber(type.reservations)}</strong></td>
                    <td>{formatNumber(type.clients_uniques)}</td>
                    <td>{type.reservations_par_terrain || '0'}</td>
                    <td>{type.taux_rotation || '0'}/jour</td>
                    <td className={parseFloat(type.taux_annulation) > 10 ? 'fa-negative-text' : 'fa-positive-text'}>
                      {safeToFixed(type.taux_annulation)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {resume.type_plus_populaire && (
            <div className="fa-retention-summary">
              <div className="fa-summary-item">
                <Crown size={18} className="fa-summary-icon" />
                <span>Plus populaire: <strong>{resume.type_plus_populaire}</strong></span>
              </div>
              {resume.type_meilleur_taux_rotation && (
                <div className="fa-summary-item">
                  <Zap size={18} className="fa-summary-icon" />
                  <span>Meilleur taux: <strong>{resume.type_meilleur_taux_rotation}</strong></span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // RENDER EVOLUTION
  const renderEvolution = () => {
    if (!monthlyData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><ChartLine size={18} /> Évolution mensuelle</h3>
          </div>
          <div className="fa-no-data">
            <Database size={40} />
            <h4>Aucune donnée</h4>
            <p>Les données d'évolution ne sont pas disponibles.</p>
          </div>
        </div>
      );
    }

    const donnees = Array.isArray(monthlyData?.donnees) ? monthlyData.donnees : 
                    Array.isArray(monthlyData?.data) ? monthlyData.data : [];

    if (donnees.length === 0) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><ChartLine size={18} /> Évolution mensuelle</h3>
          </div>
          <div className="fa-no-data">
            <ChartLine size={40} />
            <h4>Aucune évolution</h4>
            <p>Aucune donnée mensuelle disponible.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><ChartLine size={18} /> Évolution mensuelle des réservations</h3>
          </div>
          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr><th>Mois</th><th>Réservations</th><th>Nouveaux clients</th><th>Évolution</th></tr>
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

  // RENDER CLIENTS
  const renderClients = () => {
    if (!clientsData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Users size={18} /> Analyse clients</h3>
          </div>
          <div className="fa-no-data">
            <Database size={40} />
            <h4>Aucune donnée</h4>
            <p>Les données clients ne sont pas disponibles.</p>
          </div>
        </div>
      );
    }

    const clients = clientsData.clients_analyses || [];
    const alertes = clientsData.alertes || {};

    if (clients.length === 0) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Users size={18} /> Analyse clients</h3>
          </div>
          <div className="fa-no-data">
            <Users size={40} />
            <h4>Aucun client</h4>
            <p>Aucun client enregistré sur la période.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Users size={18} /> Analyse des clients</h3>
            <div className="fa-info-badge">
              <Users size={12} />
              {clientsData.periode || '180 jours'}
            </div>
          </div>

          <div className="fa-metrics-grid">
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><UserCheck size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Clients actifs</div>
                <div className="fa-metric-value">{formatNumber(alertes.clients_actifs)}</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><UserX size={20} /></div>
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
                    <td className={client.jours_depuis_derniere_resa > 30 ? 'fa-negative-text' : ''}>
                      {client.jours_depuis_derniere_resa}j
                    </td>
                    <td>
                      <div className={`fa-client-badge ${client.profil?.toLowerCase().replace(/ /g, '-') || ''}`}>
                        {client.profil || 'N/A'}
                      </div>
                    </td>
                    <td className={parseFloat(client.taux_annulation) > 15 ? 'fa-negative-text' : ''}>
                      {safeToFixed(client.taux_annulation)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {alertes.recommandations && alertes.recommandations.length > 0 && (
            <div className="fa-retention-summary">
              {alertes.recommandations.map((rec, i) => (
                <div key={i} className="fa-summary-item">
                  <AlertCircle size={18} className="fa-summary-icon" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // RENDER PREVISIONS
  const renderPrevisions = () => {
    if (!forecastData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Gauge size={18} /> Prévisions</h3>
          </div>
          <div className="fa-no-data">
            <Database size={40} />
            <h4>Aucune donnée</h4>
            <p>Les prévisions ne sont pas disponibles.</p>
          </div>
        </div>
      );
    }

    const previsions = forecastData.previsions || [];

    if (previsions.length === 0) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Gauge size={18} /> Prévisions</h3>
          </div>
          <div className="fa-no-data">
            <Gauge size={40} />
            <h4>Aucune prévision</h4>
            <p>Pas assez de données pour établir des prévisions.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Gauge size={18} /> Prévisions des réservations</h3>
            <div className="fa-info-badge">📈 Tendance linéaire</div>
          </div>
          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr><th>Mois</th><th>Prévisions</th><th>Confiance</th></tr>
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
          {forecastData.analyse_tendance?.recommandations && (
            <div className="fa-retention-summary">
              <div className="fa-summary-item">
                <CheckCircle size={18} className="fa-summary-icon" />
                <span><strong>{forecastData.analyse_tendance.recommandations}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // RENDER VILLE QUARTIER
  const renderVilleQuartier = () => {
    if (!villeQuartierData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><MapPin size={18} /> Villes & Quartiers</h3>
          </div>
          <div className="fa-no-data">
            <Database size={40} />
            <h4>Aucune donnée</h4>
            <p>Les données par ville ne sont pas disponibles.</p>
          </div>
        </div>
      );
    }

    const synthese = villeQuartierData.synthese || {};
    const analyseParVille = villeQuartierData.analyse_par_ville || [];

    if (analyseParVille.length === 0) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><MapPin size={18} /> Villes & Quartiers</h3>
          </div>
          <div className="fa-no-data">
            <MapPin size={40} />
            <h4>Aucune ville active</h4>
            <p>Aucune réservation par ville enregistrée.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><MapPin size={18} /> Performance par Ville et Quartier</h3>
            <div className="fa-info-badge">
              <Calendar size={12} />
              {villeQuartierData.periode || '90 jours'}
            </div>
          </div>

          <div className="fa-metrics-grid">
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Award size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Ville plus active</div>
                <div className="fa-metric-value" style={{ fontSize: '0.95rem' }}>
                  {synthese.ville_la_plus_active || 'N/A'}
                </div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><DollarSign size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Ville plus rentable</div>
                <div className="fa-metric-value" style={{ fontSize: '0.95rem' }}>
                  {synthese.ville_plus_rentable || 'N/A'}
                </div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Shield size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Meilleure fidélisation</div>
                <div className="fa-metric-value" style={{ fontSize: '0.95rem' }}>
                  {synthese.ville_meilleur_fidelisation || 'N/A'}
                </div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><MapPin size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Villes actives</div>
                <div className="fa-metric-value">{formatNumber(synthese.nombre_villes_actives)}</div>
                <div className="fa-metric-subtitle">Total: {formatNumber(synthese.total_reservations)} résas</div>
              </div>
            </div>
          </div>

          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr><th>Ville</th><th>Réservations</th><th>Clients</th><th>Revenu (DH)</th><th>Churn</th></tr>
              </thead>
              <tbody>
                {analyseParVille.map((ville, idx) => (
                  <tr key={idx}>
                    <td><strong>{ville.ville}</strong></td>
                    <td>{formatNumber(ville.total_reservations)}</td>
                    <td>{formatNumber(ville.clients_uniques)}</td>
                    <td className="fa-positive-text">{formatNumber(parseFloat(ville.revenu_total || 0))}</td>
                    <td className={parseFloat(ville.taux_churn) > 30 ? 'fa-negative-text' : 'fa-positive-text'}>
                      {safeToFixed(ville.taux_churn)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {synthese.recommandations && synthese.recommandations.length > 0 && (
            <div className="fa-retention-summary">
              {synthese.recommandations.map((rec, i) => (
                <div key={i} className="fa-summary-item">
                  <ThumbsUp size={18} className="fa-summary-icon" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // RENDER SPORT RENTABILITE
  const renderSportRentabilite = () => {
    if (!sportRentabiliteData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Trophy size={18} /> Sports & Rentabilité</h3>
          </div>
          <div className="fa-no-data">
            <Database size={40} />
            <h4>Aucune donnée</h4>
            <p>Les données sur les sports ne sont pas disponibles.</p>
          </div>
        </div>
      );
    }

    const synthese = sportRentabiliteData.synthese || {};
    const topSports = sportRentabiliteData.top_sports_rentables || [];

    if (topSports.length === 0) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Trophy size={18} /> Sports & Rentabilité</h3>
          </div>
          <div className="fa-no-data">
            <Trophy size={40} />
            <h4>Aucun sport</h4>
            <p>Aucune donnée sur les sports enregistrés.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Trophy size={18} /> Analyse des Sports et Rentabilité</h3>
            <div className="fa-info-badge">
              <Calendar size={12} />
              {sportRentabiliteData.periode || '90 jours'}
            </div>
          </div>

          <div className="fa-metrics-grid">
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Crown size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Plus rentable</div>
                <div className="fa-metric-value" style={{ fontSize: '0.95rem' }}>
                  {synthese.sport_le_plus_rentable || 'N/A'}
                </div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Flame size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Plus populaire</div>
                <div className="fa-metric-value" style={{ fontSize: '0.95rem' }}>
                  {synthese.sport_plus_populaire || 'N/A'}
                </div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><DollarSign size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Revenu total</div>
                <div className="fa-metric-value" style={{ fontSize: '0.95rem' }}>
                  {formatNumber(parseFloat(synthese.total_revenu || 0))} DH
                </div>
                <div className="fa-metric-subtitle">{formatNumber(synthese.total_reservations)} résas</div>
              </div>
            </div>
          </div>

          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr><th>#</th><th>Sport</th><th>Revenu (DH)</th><th>Réservations</th><th>Rentabilité</th></tr>
              </thead>
              <tbody>
                {topSports.map((sport, idx) => (
                  <tr key={idx}>
                    <td><span className={`fa-rank-badge ${getRankClass(idx)}`}>{idx + 1}</span></td>
                    <td><strong>{sport.sport}</strong></td>
                    <td className="fa-positive-text">{formatNumber(parseFloat(sport.revenu_total || 0))}</td>
                    <td>{formatNumber(sport.total_reservations)}</td>
                    <td className="fa-positive-text">{formatNumber(parseFloat(sport.rentabilite || 0))} DH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // RENDER TERRAINS DETAIL
  const renderTerrainsDetail = () => {
    if (!terrainsDetailData) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Building size={18} /> Terrains détaillés</h3>
          </div>
          <div className="fa-no-data">
            <Database size={40} />
            <h4>Aucune donnée</h4>
            <p>Les données détaillées des terrains ne sont pas disponibles.</p>
          </div>
        </div>
      );
    }

    const synthese = terrainsDetailData.synthese_globale || {};
    const topTerrains = terrainsDetailData.top_terrains_global || [];

    if (topTerrains.length === 0) {
      return (
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Building size={18} /> Terrains détaillés</h3>
          </div>
          <div className="fa-no-data">
            <Building size={40} />
            <h4>Aucun terrain</h4>
            <p>Aucune donnée sur les terrains.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fa-tab-content">
        <div className="fa-chart-card">
          <div className="fa-card-header">
            <h3><Building size={18} /> Analyse Détaillée des Terrains</h3>
            <div className="fa-info-badge">
              <Calendar size={12} />
              {terrainsDetailData.periode || '90 jours'}
            </div>
          </div>

          <div className="fa-metrics-grid">
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Building size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Total Terrains</div>
                <div className="fa-metric-value">{formatNumber(synthese.total_terrains)}</div>
                <div className="fa-metric-subtitle">{formatNumber(synthese.total_villes)} villes</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon"><Calendar size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">Réservations</div>
                <div className="fa-metric-value">{formatNumber(synthese.total_reservations)}</div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon" style={{ color: '#FF5252' }}><TrendingDown size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">En déclin</div>
                <div className="fa-metric-value" style={{ color: '#FF5252' }}>
                  {formatNumber(synthese.total_terrains_en_declin)}
                </div>
              </div>
            </div>
            <div className="fa-metric-card">
              <div className="fa-metric-icon" style={{ color: '#4CAF50' }}><TrendingUp size={20} /></div>
              <div className="fa-metric-info">
                <div className="fa-metric-title">En croissance</div>
                <div className="fa-metric-value" style={{ color: '#4CAF50' }}>
                  {formatNumber(synthese.total_terrains_en_croissance)}
                </div>
              </div>
            </div>
          </div>

          <div className="fa-table-container">
            <table className="fa-data-table">
              <thead>
                <tr><th>#</th><th>Terrain</th><th>Ville</th><th>Réservations</th><th>Revenu (DH)</th><th>Performance</th></tr>
              </thead>
              <tbody>
                {topTerrains.slice(0, 10).map((t, idx) => (
                  <tr key={idx}>
                    <td><span className={`fa-rank-badge ${getRankClass(idx)}`}>{idx + 1}</span></td>
                    <td><strong>{t.nom || t.numeroterrain}</strong></td>
                    <td>{t.ville}</td>
                    <td>{formatNumber(t.reservations)}</td>
                    <td className="fa-positive-text">{formatNumber(parseFloat(t.revenu))}</td>
                    <td>{getPerformanceLabel(t.performance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {terrainsDetailData.recommandations_strategiques && terrainsDetailData.recommandations_strategiques.length > 0 && (
            <div className="fa-retention-summary">
              {terrainsDetailData.recommandations_strategiques.map((rec, i) => (
                <div key={i} className="fa-summary-item">
                  <CheckCircle size={18} className="fa-summary-icon" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'analyse-horaire': return renderAnalyseHoraire();
      case 'type-terrain': return renderTypeTerrain();
      case 'evolution': return renderEvolution();
      case 'clients': return renderClients();
      case 'previsions': return renderPrevisions();
      case 'ville-quartier': return renderVilleQuartier();
      case 'sport-rentabilite': return renderSportRentabilite();
      case 'terrains-detail': return renderTerrainsDetail();
      default: return renderDashboard();
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="fa-dashboard-loader">
        <div className="fa-loader-spinner">
          <div className="fa-loader-dot" />
          <div className="fa-loader-dot" />
          <div className="fa-loader-dot" />
        </div>
        <div className="fa-loader-text">
          <Loader2 size={22} className="fa-spinning" />
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
                <Calendar size={24} />
              </div>
              <div className="fa-logo-text">
                <h1>Dashboard Réservations</h1>
                <div className="fa-subtitle">Analyse intelligente des performances</div>
              </div>
            </div>
            <div className="fa-header-actions">
              <button className="fa-btn-refresh" onClick={fetchData}>
                <RefreshCw size={14} />
                <span>Actualiser</span>
              </button>
              <button className="fa-btn-mobile-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu size={18} />
              </button>
              <div className="fa-header-time">
                <span className="fa-dot-online" />
                {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '--:--'}
              </div>
            </div>
          </div>
        </header>

        <nav className="fa-nav">
          <div className="fa-nav-track">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`fa-nav-tab ${activeTab === tab.id ? 'fa-nav-tab-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
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
              <div className="fa-chart-card" style={{ borderColor: '#FF5252' }}>
                <div className="fa-card-header">
                  <AlertCircle size={18} color="#FF5252" />
                  <h3 style={{ color: '#FF5252' }}>Erreur</h3>
                </div>
                <p style={{ color: '#6d7a86' }}>{error}</p>
                <button className="fa-btn-refresh" onClick={fetchData} style={{ marginTop: 8 }}>
                  <RefreshCw size={14} />
                  Réessayer
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ReservationDashboard;