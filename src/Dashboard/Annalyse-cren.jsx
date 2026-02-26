import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, DollarSign, AlertTriangle, 
  Calendar, CheckCircle, XCircle, Clock,
  Activity, Target, Award, Shield,
  RefreshCw, Download, Filter, Search,
  BarChart3, PieChart, TrendingDown, Zap,
  Bell, Mail, Phone, Eye, Heart, Star,
  UserCheck, UserX, MapPin, CreditCard, ArrowUpRight, ArrowDownRight,
  Home, LineChart as LineChartIcon, BarChart2, Target as TargetIcon,
  Shield as ShieldIcon, Bell as BellIcon, Users as UsersIcon,
  Clock as ClockIcon, Percent, Award as AwardIcon,
  AlertCircle, ArrowRight, Loader2, Sparkles
} from 'lucide-react';
import './anacren.css';

const API_BASE_URL = 'https://backend-foot-omega.vercel.app/api/annalyse-abonnes';

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('principal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [santeData, setSanteData] = useState(null);
  const [revenusData, setRevenusData] = useState(null);
  const [comportementData, setComportementData] = useState(null);
  const [fideliteData, setFideliteData] = useState(null);
  const [risquesData, setRisquesData] = useState(null);
  const [securiteData, setSecuriteData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [santeGlobale, setSanteGlobale] = useState(null);
  const [abonnesRelancer, setAbonnesRelancer] = useState(null);
  const [analyseParType, setAnalyseParType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterPriority, setFilterPriority] = useState('all');
  const [loadingSections, setLoadingSections] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchAllData();
  }, [refreshKey]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoints = [
        { key: 'dashboard', url: '/dashboard-principal', setter: setDashboardData },
        { key: 'sante', url: '/sante-abonnements', setter: setSanteData },
        { key: 'revenus', url: '/analyse-revenus', setter: setRevenusData },
        { key: 'comportement', url: '/comportement-abonnes', setter: setComportementData },
        { key: 'fidelite', url: '/analyse-fidelite', setter: setFideliteData },
        { key: 'risques', url: '/analyse-risques', setter: setRisquesData },
        { key: 'securite', url: '/securite-controle', setter: setSecuriteData },
        { key: 'stats', url: '/stats-globales', setter: setStatsData },
        { key: 'santeGlobale', url: '/systeme-sante-global', setter: setSanteGlobale },
        { key: 'relancer', url: '/abonnes-a-relancer', setter: setAbonnesRelancer },
        { key: 'parType', url: '/analyse-par-type', setter: setAnalyseParType }
      ];

      const promises = endpoints.map(async (endpoint) => {
        try {
          setLoadingSections(prev => ({ ...prev, [endpoint.key]: true }));
          const response = await fetch(`${API_BASE_URL}${endpoint.url}`);
          if (!response.ok) throw new Error(`Erreur ${response.status}`);
          const result = await response.json();
          
          if (result.success && result.data) {
            console.log(`✅ ${endpoint.key} chargé:`, result.data);
            endpoint.setter(result.data);
          } else {
            console.warn(`⚠️ Données invalides pour ${endpoint.key}:`, result);
            endpoint.setter(null);
          }
        } catch (err) {
          console.error(`❌ Erreur ${endpoint.key}:`, err);
          endpoint.setter(null);
        } finally {
          setLoadingSections(prev => ({ ...prev, [endpoint.key]: false }));
        }
      });

      await Promise.all(promises);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Transformations des données pour les graphiques
  const getComportementChartData = () => {
    if (!comportementData?.heuresPopulaires) return [];
    return comportementData.heuresPopulaires.map(item => ({
      label: `${item.heure}h`,
      value: item.total_reservations || 0
    }));
  };

  const getFrequenceChartData = () => {
    if (!comportementData?.frequenceUtilisation) return [];
    return comportementData.frequenceUtilisation.map(item => ({
      label: item.type_abonnement || 'Non spécifié',
      value: parseFloat(item.taux_utilisation) || 0
    }));
  };

  const getFideliteSegmentationData = () => {
    if (!fideliteData?.segmentationAnciennete) return [];
    return fideliteData.segmentationAnciennete.map(item => ({
      label: item.segment_anciennete,
      value: item.nombre_clients || 0
    }));
  };

  const getRevenusMensuelsData = () => {
    if (!revenusData?.historiqueMensuel) return [];
    return revenusData.historiqueMensuel.map(item => ({
      label: item.mois?.split('-').reverse().join('/') || '',
      value: parseFloat(item.revenu_mois) || 0
    })).reverse();
  };

  const getTypesAbonnementData = () => {
    if (!analyseParType?.distribution) return [];
    return analyseParType.distribution.map(item => ({
      label: item.type_abonnement,
      value: parseFloat(item.pourcentage_total) || 0
    }));
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'CRITIQUE', color: 'critical' };
    if (score >= 60) return { level: 'ÉLEVÉ', color: 'high' };
    if (score >= 40) return { level: 'MOYEN', color: 'medium' };
    if (score >= 20) return { level: 'FAIBLE', color: 'low' };
    return { level: 'MINIMAL', color: 'minimal' };
  };

  const getHeatMapData = () => {
    if (!comportementData?.heuresPopulaires) return [];
    return comportementData.heuresPopulaires.map(item => ({
      label: `${item.heure}h`,
      value: item.total_reservations || 0
    }));
  };

  // COMPOSANTS GRAPHIQUES
  const KPICard = ({ icon: Icon, title, value, subtitle, trend, color = 'green', badge, loading = false }) => (
    <div className={`fad-kpi-card fad-kpi-${color}`}>
      <div className="fad-kpi-icon-wrapper">
        <div className={`fad-kpi-icon fad-icon-${color}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        {badge && <span className="fad-kpi-badge">{badge}</span>}
      </div>
      <div className="fad-kpi-content">
        <h3 className="fad-kpi-title">{title}</h3>
        {loading ? (
          <div className="fad-kpi-loading">
            <div className="fad-kpi-loading-bar"></div>
          </div>
        ) : (
          <>
            <div className="fad-kpi-value">{value}</div>
            {subtitle && <p className="fad-kpi-subtitle">{subtitle}</p>}
            {trend !== undefined && trend !== null && (
              <div className={`fad-kpi-trend ${trend > 0 ? 'fad-trend-up' : trend < 0 ? 'fad-trend-down' : ''}`}>
                {trend > 0 ? <ArrowUpRight size={16} /> : trend < 0 ? <ArrowDownRight size={16} /> : null}
                {trend !== 0 && <span>{Math.abs(trend)}%</span>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const ProgressRing = ({ value, max = 100, color = 'green', size = 120, label, showValue = true }) => {
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = ((value || 0) / max) * circumference;
    
    return (
      <div className="fad-progress-ring-container">
        <div className="fad-progress-ring" style={{ width: size, height: size }}>
          <svg width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--fad-bg-dark)"
              strokeWidth="12"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={`var(--fad-${color})`}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              className="fad-progress-circle"
            />
          </svg>
          <div className="fad-progress-content">
            {showValue && (
              <div className="fad-progress-value" style={{ color: `var(--fad-${color})` }}>
                {value}%
              </div>
            )}
            {label && <div className="fad-progress-label">{label}</div>}
          </div>
        </div>
      </div>
    );
  };

  const BarChart = ({ data, title, valueKey, labelKey, color = 'primary', loading = false, maxBars = 8, horizontal = false }) => {
    if (loading) {
      return (
        <div className="fad-chart-container">
          <div className="fad-chart-header">
            <h3 className="fad-chart-title">{title}</h3>
          </div>
          <div className="fad-chart-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="fad-loading-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>
      );
    }
    
    if (!data || data.length === 0) {
      return (
        <div className="fad-chart-container">
          <div className="fad-chart-header">
            <h3 className="fad-chart-title">{title}</h3>
          </div>
          <div className="fad-chart-empty">
            <AlertCircle size={32} />
            <p>Aucune donnée disponible</p>
          </div>
        </div>
      );
    }
    
    const displayData = data.slice(0, maxBars);
    const maxValue = Math.max(...displayData.map(d => parseFloat(d[valueKey]) || 0));
    
    if (horizontal) {
      return (
        <div className="fad-chart-container">
          <div className="fad-chart-header">
            <h3 className="fad-chart-title">{title}</h3>
          </div>
          <div className="fad-horizontal-bars">
            {displayData.map((item, index) => {
              const value = parseFloat(item[valueKey]) || 0;
              const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
              return (
                <div key={index} className="fad-h-bar-item">
                  <div className="fad-h-bar-header">
                    <span className="fad-h-bar-label">
                      {item[labelKey]?.toString().length > 20 
                        ? `${item[labelKey]?.toString().substring(0, 18)}...` 
                        : item[labelKey]}
                    </span>
                    <span className="fad-h-bar-value">{value.toLocaleString()}</span>
                  </div>
                  <div className="fad-h-bar-track">
                    <div 
                      className={`fad-h-bar-fill fad-${color}`}
                      style={{ 
                        width: `${width}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    return (
      <div className="fad-chart-container">
        <div className="fad-chart-header">
          <h3 className="fad-chart-title">{title}</h3>
        </div>
        <div className="fad-vertical-bars">
          {displayData.map((item, index) => {
            const value = parseFloat(item[valueKey]) || 0;
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            return (
              <div key={index} className="fad-v-bar-wrapper">
                <div className="fad-v-bar-value">{value.toLocaleString()}</div>
                <div className="fad-v-bar-track">
                  <div 
                    className={`fad-v-bar-fill fad-${color}`}
                    style={{ 
                      height: `${height}%`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  />
                </div>
                <div className="fad-v-bar-label">
                  {item[labelKey]?.toString().length > 12 
                    ? `${item[labelKey]?.toString().substring(0, 10)}...` 
                    : item[labelKey]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const LineChart = ({ data, title, valueKey = 'value', labelKey = 'label', color = 'primary', loading = false }) => {
    if (loading) {
      return (
        <div className="fad-chart-container">
          <div className="fad-chart-header">
            <h3 className="fad-chart-title">{title}</h3>
          </div>
          <div className="fad-chart-loading">
            <div className="fad-loading-line"></div>
          </div>
        </div>
      );
    }
    
    if (!data || data.length === 0) {
      return (
        <div className="fad-chart-container">
          <div className="fad-chart-header">
            <h3 className="fad-chart-title">{title}</h3>
          </div>
          <div className="fad-chart-empty">
            <AlertCircle size={32} />
            <p>Aucune donnée disponible</p>
          </div>
        </div>
      );
    }
    
    const values = data.map(d => parseFloat(d[valueKey]) || 0);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;
    
    const points = data.map((item, index, arr) => {
      const x = (index / Math.max(arr.length - 1, 1)) * 700 + 50;
      const y = 250 - ((parseFloat(item[valueKey]) - minValue) / range * 200);
      return { x, y, label: item[labelKey], value: parseFloat(item[valueKey]) };
    });
    
    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    
    return (
      <div className="fad-chart-container">
        <div className="fad-chart-header">
          <h3 className="fad-chart-title">{title}</h3>
        </div>
        <div className="fad-line-chart">
          <svg viewBox="0 0 800 300" className="fad-line-svg">
            {/* Grille */}
            {[...Array(5)].map((_, i) => (
              <g key={`grid-${i}`}>
                <line 
                  x1="50" 
                  y1={50 + i * 50} 
                  x2="750" 
                  y2={50 + i * 50} 
                  className="fad-grid-line"
                />
                <text x="30" y={55 + i * 50} className="fad-grid-label">
                  {Math.round(maxValue - (range / 4) * i).toLocaleString()}
                </text>
              </g>
            ))}
            
            {/* Ligne */}
            <path
              d={pathData}
              className={`fad-line-path fad-${color}`}
              fill="none"
            />
            
            {/* Points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  className={`fad-line-point fad-${color}`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                />
                <g className="fad-point-tooltip">
                  <rect 
                    x={point.x - 40} 
                    y={point.y - 45} 
                    width="80" 
                    height="35" 
                    rx="4"
                    className="fad-tooltip-bg"
                  />
                  <text 
                    x={point.x} 
                    y={point.y - 35} 
                    textAnchor="middle" 
                    className="fad-tooltip-label"
                  >
                    {point.label}
                  </text>
                  <text 
                    x={point.x} 
                    y={point.y - 20} 
                    textAnchor="middle" 
                    className="fad-tooltip-value"
                  >
                    {point.value.toLocaleString()}
                  </text>
                </g>
                <text 
                  x={point.x} 
                  y="280" 
                  textAnchor="middle" 
                  className="fad-axis-label"
                >
                  {point.label.length > 8 ? `${point.label.substring(0, 6)}...` : point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  const DonutChart = ({ data, title, valueKey = 'value', labelKey = 'label', loading = false, colors = null }) => {
    if (loading) {
      return (
        <div className="fad-chart-container">
          <div className="fad-chart-header">
            <h3 className="fad-chart-title">{title}</h3>
          </div>
          <div className="fad-chart-loading">
            <div className="fad-loading-donut"></div>
          </div>
        </div>
      );
    }
    
    if (!data || data.length === 0) {
      return (
        <div className="fad-chart-container">
          <div className="fad-chart-header">
            <h3 className="fad-chart-title">{title}</h3>
          </div>
          <div className="fad-chart-empty">
            <AlertCircle size={32} />
            <p>Aucune donnée disponible</p>
          </div>
        </div>
      );
    }
    
    const total = data.reduce((sum, item) => sum + (parseFloat(item[valueKey]) || 0), 0);
    const defaultColors = [
      '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', 
      '#EF4444', '#EC4899', '#14B8A6', '#6366F1'
    ];
    const chartColors = colors || defaultColors;
    
    let cumulativePercent = 0;
    
    return (
      <div className="fad-chart-container">
        <div className="fad-chart-header">
          <h3 className="fad-chart-title">{title}</h3>
        </div>
        <div className="fad-donut-wrapper">
          <div className="fad-donut-chart">
            <svg viewBox="0 0 200 200">
              {data.map((item, index) => {
                const percent = total > 0 ? (parseFloat(item[valueKey]) / total) * 100 : 0;
                const strokeDasharray = `${percent * 2.513} 251.3`;
                const strokeDashoffset = -cumulativePercent * 2.513;
                cumulativePercent += percent;
                
                return (
                  <circle
                    key={index}
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={chartColors[index % chartColors.length]}
                    strokeWidth="40"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 100 100)"
                    className="fad-donut-segment"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                );
              })}
              <text x="100" y="95" textAnchor="middle" className="fad-donut-total">
                {total.toLocaleString()}
              </text>
              <text x="100" y="115" textAnchor="middle" className="fad-donut-label">
                Total
              </text>
            </svg>
          </div>
          <div className="fad-donut-legend">
            {data.slice(0, 8).map((item, index) => (
              <div key={index} className="fad-legend-item">
                <span className="fad-legend-color" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                <div className="fad-legend-content">
                  <span className="fad-legend-label">
                    {item[labelKey]?.length > 15 ? `${item[labelKey]?.substring(0, 13)}...` : item[labelKey]}
                  </span>
                  <span className="fad-legend-value">{parseFloat(item[valueKey] || 0).toLocaleString()}</span>
                </div>
                <span className="fad-legend-percent">
                  {total > 0 ? ((parseFloat(item[valueKey]) / total) * 100).toFixed(1) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const HeatMapChart = ({ data, title, loading = false }) => {
    if (loading) {
      return (
        <div className="fad-chart-container">
          <div className="fad-chart-header">
            <h3 className="fad-chart-title">{title}</h3>
          </div>
          <div className="fad-chart-loading">
            <div className="fad-loading-heatmap">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="fad-loading-heatmap-cell" style={{ animationDelay: `${i * 0.02}s` }}></div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (!data || data.length === 0) {
      return (
        <div className="fad-chart-container">
          <div className="fad-chart-header">
            <h3 className="fad-chart-title">{title}</h3>
          </div>
          <div className="fad-chart-empty">
            <AlertCircle size={32} />
            <p>Aucune donnée disponible</p>
          </div>
        </div>
      );
    }
    
    const maxValue = Math.max(...data.map(d => d.value || 0));
    
    return (
      <div className="fad-chart-container">
        <div className="fad-chart-header">
          <h3 className="fad-chart-title">{title}</h3>
        </div>
        <div className="fad-heatmap">
          <div className="fad-heatmap-grid">
            {data.map((item, index) => {
              const intensity = maxValue > 0 ? (item.value / maxValue) : 0;
              const colorIntensity = Math.floor(intensity * 100);
              
              return (
                <div 
                  key={index} 
                  className="fad-heatmap-cell"
                  style={{
                    backgroundColor: `rgb(16, 185, 129, ${intensity * 0.8 + 0.2})`,
                    animationDelay: `${index * 0.05}s`
                  }}
                  data-tooltip={`${item.label}: ${item.value} réservations`}
                >
                  <span className="fad-cell-label">{item.label}</span>
                  <span className="fad-cell-value">{item.value}</span>
                </div>
              );
            })}
          </div>
          <div className="fad-heatmap-legend">
            <span>Faible</span>
            <div className="fad-legend-gradient"></div>
            <span>Élevé</span>
          </div>
        </div>
      </div>
    );
  };

  const DataTable = ({ data, columns, title, maxRows = 10, loading = false, exportable = true }) => {
    
    const handleExport = (exportData, filename) => {
      try {
        const csvContent = convertToCSV(exportData);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Erreur lors de l\'export:', error);
      }
    };

    const convertToCSV = (exportData) => {
      if (!exportData || exportData.length === 0) return '';
      const headers = Object.keys(exportData[0]);
      const csvRows = [headers.join(',')];
      exportData.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        });
        csvRows.push(values.join(','));
      });
      return csvRows.join('\n');
    };

    if (loading) {
      return (
        <div className="fad-table-container">
          <div className="fad-table-header">
            <h3 className="fad-table-title">{title}</h3>
          </div>
          <div className="fad-table-loading">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="fad-loading-row" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>
      );
    }
    
    if (!data || data.length === 0) {
      return (
        <div className="fad-table-container">
          <div className="fad-table-header">
            <h3 className="fad-table-title">{title}</h3>
          </div>
          <div className="fad-table-empty">
            <AlertCircle size={24} />
            <p>Aucune donnée disponible</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="fad-table-container">
        <div className="fad-table-header">
          <h3 className="fad-table-title">{title}</h3>
          <div className="fad-table-actions">
            {exportable && (
              <button className="fad-btn-icon" onClick={() => handleExport(data, title)} title="Exporter">
                <Download size={18} />
              </button>
            )}
          </div>
        </div>
        <div className="fad-table-wrapper">
          <table className="fad-data-table">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, maxRows).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.render ? col.render(row[col.key], row) : row[col.key] || 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > maxRows && (
          <div className="fad-table-footer">
            Affichage de {maxRows} sur {data.length} résultats
          </div>
        )}
      </div>
    );
  };

  if (loading && refreshKey === 0) {
    return (
      <div className="fad-loading-overlay">
        <div className="fad-loading-spinner">
          <Loader2 size={48} className="fad-spinning" />
        </div>
        <div className="fad-loading-text">
          <h2>Chargement des données...</h2>
          <p>Analyse en cours d'initialisation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fad-dashboard">
      {/* HEADER */}
      <header className="fad-dashboard-header">
        <div className="fad-header-content">
          <div className="fad-header-left">
            <div className="fad-title-wrapper">
              <div className="fad-logo">
                <Sparkles size={24} />
              </div>
              <div>
                <h1 className="fad-dashboard-title">Football Analytics Pro</h1>
                <p className="fad-dashboard-subtitle">Dashboard d'analyse avancée des abonnés</p>
              </div>
            </div>
          </div>
          <div className="fad-header-right">
            <div className="fad-search-container">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher un abonné..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="fad-search-input"
              />
            </div>
            <button onClick={handleRefresh} className="fad-refresh-btn">
              <RefreshCw size={18} />
              Actualiser
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="fad-dashboard-nav">
        {[
          { id: 'principal', label: 'Vue Principale', icon: Home },
          { id: 'sante', label: 'Santé', icon: Activity },
          { id: 'revenus', label: 'Revenus', icon: DollarSign },
          { id: 'comportement', label: 'Comportement', icon: UsersIcon },
          { id: 'fidelite', label: 'Fidélité', icon: AwardIcon },
          { id: 'risques', label: 'Risques', icon: ShieldIcon },
          { id: 'relancer', label: 'À Relancer', icon: BellIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`fad-nav-tab ${activeTab === tab.id ? 'fad-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* CONTENU PRINCIPAL */}
      <main className="fad-dashboard-content">
        {/* VUE PRINCIPALE */}
        {activeTab === 'principal' && (
          <div className="fad-tab-content">
            {/* KPIs PRINCIPAUX */}
            <div className="fad-kpi-grid">
              <KPICard 
                icon={Users} 
                title="Total Abonnés" 
                value={dashboardData?.kpis?.totalAbonnes?.toLocaleString() || '0'}
                subtitle={`${dashboardData?.kpis?.pourcentageActifs || 0}% actifs`}
                color="primary"
                loading={loadingSections.dashboard}
              />
              <KPICard 
                icon={CheckCircle} 
                title="Abonnés Actifs" 
                value={dashboardData?.kpis?.abonnesActifs?.toLocaleString() || '0'}
                subtitle="En cours d'abonnement"
                color="success"
                loading={loadingSections.dashboard}
              />
              <KPICard 
                icon={DollarSign} 
                title="CA ce Mois" 
                value={formatCurrency(dashboardData?.kpis?.caMois || 0)}
                subtitle={`Total: ${formatCurrency(dashboardData?.kpis?.caTotal || 0)}`}
                color="success"
                loading={loadingSections.dashboard}
              />
              <KPICard 
                icon={TrendingUp} 
                title="Taux d'Utilisation" 
                value={`${dashboardData?.kpis?.tauxUtilisation || 0}%`}
                subtitle="Utilisation active"
                color="info"
                loading={loadingSections.dashboard}
              />
              <KPICard 
                icon={TrendingDown} 
                title="Taux de Churn" 
                value={`${dashboardData?.kpis?.tauxChurn || 0}%`}
                subtitle="Perte mensuelle"
                color="warning"
                loading={loadingSections.dashboard}
              />
              <KPICard 
                icon={AlertTriangle} 
                title="Photos Manquantes" 
                value={dashboardData?.kpis?.photoManquante?.toLocaleString() || '0'}
                subtitle="À compléter"
                color="warning"
                loading={loadingSections.dashboard}
              />
            </div>

            {/* SANTÉ GLOBALE */}
            {santeGlobale && (
              <div className="fad-health-card">
                <div className="fad-health-header">
                  <h3>
                    <Activity size={20} />
                    Santé Globale du Système
                  </h3>
                  <div className={`fad-health-status ${(santeGlobale.niveauSante || '').toLowerCase() || 'medium'}`}>
                    {santeGlobale.niveauSante || 'MOYEN'}
                  </div>
                </div>
                <div className="fad-health-body">
                  <div className="fad-health-score">
                    <div className="fad-score-circle" style={{ '--fad-score': santeGlobale.scoreSante || 0 }}>
                      <div className="fad-score-value">{santeGlobale.scoreSante || 0}</div>
                      <div className="fad-score-label">SCORE</div>
                    </div>
                  </div>
                  <div className="fad-health-metrics">
                    <div className="fad-metric">
                      <div className="fad-metric-label">Taux d'Actifs</div>
                      <div className="fad-metric-value">{santeGlobale.pourcentages?.actifs || 0}%</div>
                      <div className="fad-metric-bar">
                        <div 
                          className="fad-metric-fill fad-success" 
                          style={{ width: `${santeGlobale.pourcentages?.actifs || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="fad-metric">
                      <div className="fad-metric-label">Photos Complètes</div>
                      <div className="fad-metric-value">{100 - (santeGlobale.pourcentages?.photoManquante || 0)}%</div>
                      <div className="fad-metric-bar">
                        <div 
                          className="fad-metric-fill fad-warning" 
                          style={{ width: `${100 - (santeGlobale.pourcentages?.photoManquante || 0)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="fad-metric">
                      <div className="fad-metric-label">Utilisation Active</div>
                      <div className="fad-metric-value">{100 - (santeGlobale.pourcentages?.sansReservation || 0)}%</div>
                      <div className="fad-metric-bar">
                        <div 
                          className="fad-metric-fill fad-info" 
                          style={{ width: `${100 - (santeGlobale.pourcentages?.sansReservation || 0)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GRAPHIQUES PRINCIPAUX */}
            <div className="fad-charts-grid">
              <div className="fad-chart-card">
                <LineChart 
                  data={getRevenusMensuelsData()}
                  title="Évolution des Revenus Mensuels"
                  loading={loadingSections.revenus}
                />
              </div>
              <div className="fad-chart-card">
                <DonutChart 
                  data={getTypesAbonnementData()}
                  title="Répartition par Type d'Abonnement"
                  loading={loadingSections.parType}
                />
              </div>
            </div>

            {/* STATISTIQUES RAPIDES */}
            <div className="fad-stats-grid">
              <div className="fad-stat-card fad-warning">
                <div className="fad-stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="fad-stat-content">
                  <h4>Expirent dans 7j</h4>
                  <p className="fad-stat-value">{dashboardData?.expirations?.dans7jours || 0}</p>
                  <p className="fad-stat-sub">Urgent</p>
                </div>
              </div>
              <div className="fad-stat-card fad-info">
                <div className="fad-stat-icon">
                  <Clock size={24} />
                </div>
                <div className="fad-stat-content">
                  <h4>Expirent dans 30j</h4>
                  <p className="fad-stat-value">{dashboardData?.expirations?.dans30jours || 0}</p>
                  <p className="fad-stat-sub">À surveiller</p>
                </div>
              </div>
              <div className="fad-stat-card fad-success">
                <div className="fad-stat-icon">
                  <TargetIcon size={24} />
                </div>
                <div className="fad-stat-content">
                  <h4>Nouveaux ce Mois</h4>
                  <p className="fad-stat-value">{dashboardData?.tendances?.nouveauxCeMois || 0}</p>
                  <p className="fad-stat-sub">Acquisition</p>
                </div>
              </div>
              <div className="fad-stat-card fad-primary">
                <div className="fad-stat-icon">
                  <RefreshCw size={24} />
                </div>
                <div className="fad-stat-content">
                  <h4>Renouvellements</h4>
                  <p className="fad-stat-value">{dashboardData?.tendances?.renouvellementsCeMois || 0}</p>
                  <p className="fad-stat-sub">Rétention</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SANTÉ DES ABONNEMENTS */}
        {activeTab === 'sante' && (
          <div className="fad-tab-content">
            <div className="fad-stats-grid">
              <div className="fad-stat-card fad-success">
                <div className="fad-stat-icon">
                  <CheckCircle size={32} />
                </div>
                <div className="fad-stat-content">
                  <h4>Abonnés Actifs</h4>
                  <p className="fad-stat-value">{santeData?.resume?.actifs?.toLocaleString() || '0'}</p>
                  <p className="fad-stat-sub">{santeData?.resume?.pourcentageActifs || 0}% du total</p>
                </div>
              </div>
              <div className="fad-stat-card fad-warning">
                <div className="fad-stat-icon">
                  <XCircle size={32} />
                </div>
                <div className="fad-stat-content">
                  <h4>Abonnés Expirés</h4>
                  <p className="fad-stat-value">{santeData?.resume?.expires?.toLocaleString() || '0'}</p>
                  <p className="fad-stat-sub">{santeData?.resume?.pourcentageExpires || 0}% du total</p>
                </div>
              </div>
              <div className="fad-stat-card fad-info">
                <div className="fad-stat-icon">
                  <Clock size={32} />
                </div>
                <div className="fad-stat-content">
                  <h4>Expirent Bientôt</h4>
                  <p className="fad-stat-value">{santeData?.resume?.bientotExpires?.toLocaleString() || '0'}</p>
                  <p className="fad-stat-sub">{santeData?.resume?.pourcentageARelancer || 0}% des actifs</p>
                </div>
              </div>
              <div className="fad-stat-card fad-primary">
                <div className="fad-stat-icon">
                  <AlertTriangle size={32} />
                </div>
                <div className="fad-stat-content">
                  <h4>Jamais Renouvelés</h4>
                  <p className="fad-stat-value">{santeData?.resume?.jamaisRenouvelles?.toLocaleString() || '0'}</p>
                  <p className="fad-stat-sub">Clients à risque</p>
                </div>
              </div>
            </div>

            <div className="fad-charts-grid">
              <div className="fad-chart-card">
                <BarChart 
                  data={santeData?.statsParType || []}
                  title="Distribution par Type d'Abonnement"
                  valueKey="total"
                  labelKey="type_abonnement"
                  loading={loadingSections.sante}
                />
              </div>
              <div className="fad-chart-card">
                <BarChart 
                  data={santeData?.statsParType?.map(item => ({
                    type_abonnement: item.type_abonnement,
                    actifs: item.actifs || 0
                  })) || []}
                  title="Abonnés Actifs par Type"
                  valueKey="actifs"
                  labelKey="type_abonnement"
                  loading={loadingSections.sante}
                  horizontal={true}
                />
              </div>
            </div>

            {santeData?.aRelancer && santeData.aRelancer.length > 0 && (
              <DataTable 
                data={santeData.aRelancer}
                title="Abonnés à Relancer"
                columns={[
                  { key: 'nom', label: 'Nom' },
                  { key: 'prenom', label: 'Prénom' },
                  { key: 'email', label: 'Email' },
                  { key: 'telephone', label: 'Téléphone' },
                  { key: 'type_abonnement', label: 'Type' },
                  { 
                    key: 'date_fin', 
                    label: 'Date Fin', 
                    render: (val) => formatDate(val)
                  },
                  {
                    key: 'prix_total',
                    label: 'Prix',
                    render: (val) => formatCurrency(val)
                  },
                  {
                    key: 'categorie_relance',
                    label: 'Catégorie',
                    render: (val) => (
                      <span className={`fad-badge ${val === 'EXPIRE' ? 'fad-critical' : 
                        val === 'EXPIRE_DANS_7_JOURS' ? 'fad-warning' : 'fad-info'}`}>
                        {val?.replace(/_/g, ' ') || 'N/A'}
                      </span>
                    )
                  }
                ]}
                loading={loadingSections.sante}
              />
            )}
          </div>
        )}

        {/* ANALYSE DES REVENUS */}
        {activeTab === 'revenus' && (
          <div className="fad-tab-content">
            <div className="fad-revenue-grid">
              <div className="fad-revenue-card fad-success">
                <DollarSign size={24} />
                <div>
                  <h4>Revenu Total</h4>
                  <p className="fad-revenue-value">{formatCurrency(revenusData?.resume?.revenuTotal || 0)}</p>
                </div>
              </div>
              <div className="fad-revenue-card fad-primary">
                <TrendingUp size={24} />
                <div>
                  <h4>Revenu ce Mois</h4>
                  <p className="fad-revenue-value">{formatCurrency(revenusData?.resume?.revenuMois || 0)}</p>
                </div>
              </div>
              <div className="fad-revenue-card fad-info">
                <Target size={24} />
                <div>
                  <h4>Panier Moyen</h4>
                  <p className="fad-revenue-value">{formatCurrency(revenusData?.resume?.panierMoyen || 0)}</p>
                </div>
              </div>
              <div className="fad-revenue-card fad-warning">
                <Activity size={24} />
                <div>
                  <h4>Transactions</h4>
                  <p className="fad-revenue-value">{revenusData?.resume?.nombreTransactions?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </div>

            <div className="fad-charts-grid">
              <div className="fad-chart-card">
                <LineChart 
                  data={getRevenusMensuelsData()}
                  title="Évolution des Revenus Mensuels"
                  loading={loadingSections.revenus}
                />
              </div>
              <div className="fad-chart-card">
                <BarChart 
                  data={revenusData?.parModePaiement || []}
                  title="Revenus par Mode de Paiement"
                  valueKey="revenu_total"
                  labelKey="mode_paiement"
                  loading={loadingSections.revenus}
                  horizontal={true}
                />
              </div>
            </div>

            <div className="fad-charts-grid">
              <div className="fad-chart-card">
                <DonutChart 
                  data={revenusData?.parTypeAbonnement?.slice(0, 6).map(item => ({
                    label: item.type_abonnement,
                    value: item.revenu_total
                  })) || []}
                  title="Répartition des Revenus par Type"
                  loading={loadingSections.revenus}
                />
              </div>
              <div className="fad-chart-card">
                <BarChart 
                  data={revenusData?.repartitionPrix || []}
                  title="Répartition par Tranche de Prix"
                  valueKey="revenu_tranche"
                  labelKey="tranche_prix"
                  loading={loadingSections.revenus}
                />
              </div>
            </div>

            {revenusData?.topAbonnementsChers && revenusData.topAbonnementsChers.length > 0 && (
              <DataTable 
                data={revenusData.topAbonnementsChers}
                title="Top 10 Abonnements les Plus Chers"
                columns={[
                  { key: 'nom', label: 'Nom' },
                  { key: 'prenom', label: 'Prénom' },
                  { key: 'email', label: 'Email' },
                  { key: 'type_abonnement', label: 'Type' },
                  {
                    key: 'prix_total',
                    label: 'Prix',
                    render: (val) => formatCurrency(val)
                  },
                  {
                    key: 'date_debut',
                    label: 'Date Début',
                    render: (val) => formatDate(val)
                  },
                  {
                    key: 'statut',
                    label: 'Statut',
                    render: (val) => (
                      <span className={`fad-badge ${val === 'actif' ? 'fad-success' : 'fad-warning'}`}>
                        {val || 'N/A'}
                      </span>
                    )
                  }
                ]}
                loading={loadingSections.revenus}
              />
            )}
          </div>
        )}

        {/* COMPORTEMENT DES ABONNÉS */}
        {activeTab === 'comportement' && (
          <div className="fad-tab-content">
            {comportementData ? (
              <>
                <div className="fad-charts-grid">
                  <div className="fad-chart-card">
                    <HeatMapChart 
                      data={getHeatMapData()}
                      title="Heatmap des Réservations par Heure"
                      loading={loadingSections.comportement}
                    />
                  </div>
                  <div className="fad-chart-card">
                    <BarChart 
                      data={getComportementChartData()}
                      title="Heures de Réservation les Plus Populaires"
                      valueKey="value"
                      labelKey="label"
                      loading={loadingSections.comportement}
                    />
                  </div>
                </div>

                <div className="fad-charts-grid">
                  <div className="fad-chart-card">
                    <BarChart 
                      data={getFrequenceChartData()}
                      title="Taux d'Utilisation par Type d'Abonnement"
                      valueKey="value"
                      labelKey="label"
                      loading={loadingSections.comportement}
                      horizontal={true}
                    />
                  </div>
                  <div className="fad-chart-card">
                    <DonutChart 
                      data={comportementData?.topUtilisateurs?.slice(0, 6).map(user => ({
                        label: `${user.nom} ${user.prenom}`.substring(0, 15),
                        value: user.nombre_reservations || 0
                      })) || []}
                      title="Top Utilisateurs par Réservations"
                      loading={loadingSections.comportement}
                    />
                  </div>
                </div>

                <div className="fad-stats-grid">
                  <div className="fad-stat-card fad-info">
                    <div className="fad-stat-icon">
                      <Activity size={32} />
                    </div>
                    <div className="fad-stat-content">
                      <h4>Taux d'Activation</h4>
                      <p className="fad-stat-value">{comportementData?.statistiquesComportement?.taux_activation || 0}%</p>
                      <p className="fad-stat-sub">Clients actifs</p>
                    </div>
                  </div>
                  <div className="fad-stat-card fad-primary">
                    <div className="fad-stat-icon">
                      <Clock size={32} />
                    </div>
                    <div className="fad-stat-content">
                      <h4>Heure Moyenne</h4>
                      <p className="fad-stat-value">{comportementData?.statistiquesComportement?.heure_moyenne || 0}h</p>
                      <p className="fad-stat-sub">Période d'affluence</p>
                    </div>
                  </div>
                  <div className="fad-stat-card fad-success">
                    <div className="fad-stat-icon">
                      <Users size={32} />
                    </div>
                    <div className="fad-stat-content">
                      <h4>Créneaux Utilisés</h4>
                      <p className="fad-stat-value">{comportementData?.statistiquesComportement?.creneaux_utilises || 0}/24</p>
                      <p className="fad-stat-sub">Diversification horaire</p>
                    </div>
                  </div>
                  <div className="fad-stat-card fad-warning">
                    <div className="fad-stat-icon">
                      <UserX size={32} />
                    </div>
                    <div className="fad-stat-content">
                      <h4>Clients Dormants</h4>
                      <p className="fad-stat-value">{comportementData?.clientsDormants?.length || 0}</p>
                      <p className="fad-stat-sub">À réactiver</p>
                    </div>
                  </div>
                </div>

                {comportementData?.topUtilisateurs && comportementData.topUtilisateurs.length > 0 && (
                  <DataTable 
                    data={comportementData.topUtilisateurs}
                    title="Top 20 Utilisateurs les Plus Actifs"
                    columns={[
                      { key: 'nom', label: 'Nom' },
                      { key: 'prenom', label: 'Prénom' },
                      { key: 'email', label: 'Email' },
                      { key: 'nombre_reservations', label: 'Réservations' },
                      { key: 'type_abonnement', label: 'Type' },
                      {
                        key: 'montant_total_depense',
                        label: 'Dépenses',
                        render: (val) => formatCurrency(val)
                      },
                      {
                        key: 'statut',
                        label: 'Statut',
                        render: (val) => (
                          <span className={`fad-badge ${val === 'actif' ? 'fad-success' : 'fad-warning'}`}>
                            {val || 'N/A'}
                          </span>
                        )
                      }
                    ]}
                    loading={loadingSections.comportement}
                  />
                )}
              </>
            ) : (
              <div className="fad-empty-state">
                <UsersIcon size={64} />
                <h3>Analyse du Comportement</h3>
                <p>Les données de comportement sont en cours de chargement...</p>
              </div>
            )}
          </div>
        )}

        {/* FIDÉLITÉ */}
        {activeTab === 'fidelite' && (
          <div className="fad-tab-content">
            {fideliteData ? (
              <>
                <div className="fad-charts-grid">
                  <div className="fad-chart-card">
                    <BarChart 
                      data={getFideliteSegmentationData()}
                      title="Segmentation par Ancienneté"
                      valueKey="value"
                      labelKey="label"
                      loading={loadingSections.fidelite}
                    />
                  </div>
                  <div className="fad-chart-card">
                    {fideliteData?.statistiquesFidelite && (
                      <div className="fad-fidelity-stats-card">
                        <h3>
                          <Award size={20} />
                          Statistiques de Fidélité
                        </h3>
                        <div className="fad-fidelity-grid">
                          <div className="fad-fidelity-item">
                            <div className="fad-fidelity-icon fad-success">
                              <Percent size={24} />
                            </div>
                            <div className="fad-fidelity-content">
                              <div className="fad-fidelity-value">{fideliteData.statistiquesFidelite.taux_fidelite || 0}%</div>
                              <div className="fad-fidelity-label">Taux de Fidélité</div>
                            </div>
                          </div>
                          <div className="fad-fidelity-item">
                            <div className="fad-fidelity-icon fad-primary">
                              <TrendingUp size={24} />
                            </div>
                            <div className="fad-fidelity-content">
                              <div className="fad-fidelity-value">
                                {parseFloat(fideliteData.statistiquesFidelite.frequence_moyenne || 0).toFixed(1)}
                              </div>
                              <div className="fad-fidelity-label">Fréquence Moyenne</div>
                            </div>
                          </div>
                          <div className="fad-fidelity-item">
                            <div className="fad-fidelity-icon fad-info">
                              <DollarSign size={24} />
                            </div>
                            <div className="fad-fidelity-content">
                              <div className="fad-fidelity-value">
                                {formatCurrency(fideliteData.statistiquesFidelite.revenu_moyen_vie || 0)}
                              </div>
                              <div className="fad-fidelity-label">LTV Moyen</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="fad-charts-grid">
                  <div className="fad-chart-card">
                    <DonutChart 
                      data={fideliteData?.segmentationAnciennete?.map(item => ({
                        label: item.segment_anciennete,
                        value: item.revenu_segment
                      })) || []}
                      title="Répartition des Revenus par Segment"
                      loading={loadingSections.fidelite}
                    />
                  </div>
                  <div className="fad-chart-card">
                    <LineChart 
                      data={fideliteData?.analyseRetention?.map(item => ({
                        label: item.mois_entree,
                        value: parseFloat(item.taux_retention) || 0
                      })).reverse() || []}
                      title="Évolution du Taux de Rétention"
                      loading={loadingSections.fidelite}
                    />
                  </div>
                </div>

                {fideliteData?.clientsFideles && fideliteData.clientsFideles.length > 0 && (
                  <DataTable 
                    data={fideliteData.clientsFideles}
                    title="Clients Fidèles (Plusieurs Abonnements)"
                    columns={[
                      { key: 'nom', label: 'Nom' },
                      { key: 'prenom', label: 'Prénom' },
                      { key: 'email', label: 'Email' },
                      { key: 'nombre_abonnements', label: 'Nb Abonnements' },
                      {
                        key: 'revenu_total',
                        label: 'Revenu Total',
                        render: (val) => formatCurrency(val)
                      },
                      {
                        key: 'panier_moyen',
                        label: 'Panier Moyen',
                        render: (val) => formatCurrency(val)
                      },
                      {
                        key: 'premier_abonnement',
                        label: 'Depuis',
                        render: (val) => formatDate(val)
                      }
                    ]}
                    loading={loadingSections.fidelite}
                  />
                )}

                {fideliteData?.meilleursClients && fideliteData.meilleursClients.length > 0 && (
                  <DataTable 
                    data={fideliteData.meilleursClients}
                    title="Top 30 Meilleurs Clients (LTV)"
                    columns={[
                      { key: 'nom', label: 'Nom' },
                      { key: 'prenom', label: 'Prénom' },
                      { key: 'email', label: 'Email' },
                      { key: 'nombre_abonnements', label: 'Nb Abonnements' },
                      {
                        key: 'revenu_total',
                        label: 'LTV Total',
                        render: (val) => formatCurrency(val)
                      },
                      {
                        key: 'premier_achat',
                        label: 'Premier Achat',
                        render: (val) => formatDate(val)
                      },
                      {
                        key: 'statut_actuel',
                        label: 'Statut',
                        render: (val) => (
                          <span className={`fad-badge ${val === 'actif' ? 'fad-success' : 'fad-warning'}`}>
                            {val || 'N/A'}
                          </span>
                        )
                      }
                    ]}
                    loading={loadingSections.fidelite}
                  />
                )}
              </>
            ) : (
              <div className="fad-empty-state">
                <Award size={64} />
                <h3>Analyse de Fidélité</h3>
                <p>Les statistiques de fidélité sont en cours de chargement...</p>
              </div>
            )}
          </div>
        )}

        {/* RISQUES ET ALERTES */}
        {activeTab === 'risques' && (
          <div className="fad-tab-content">
            {risquesData ? (
              <>
                <div className="fad-risk-header">
                  <div className="fad-risk-meter">
                    <div className="fad-risk-meter-header">
                      <Shield size={24} />
                      <h3>Niveau de Risque Global</h3>
                    </div>
                    <div className="fad-risk-scale">
                      <div className="fad-risk-bar">
                        <div 
                          className={`fad-risk-fill fad-${getRiskLevel(risquesData.scoreRisque || 0).color}`}
                          style={{ width: `${risquesData.scoreRisque || 0}%` }}
                        />
                      </div>
                      <div className="fad-risk-labels">
                        <span>0%</span>
                        <span>20%</span>
                        <span>40%</span>
                        <span>60%</span>
                        <span>80%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div className="fad-risk-score">
                      <div className="fad-risk-value">{risquesData.scoreRisque || 0}%</div>
                      <div className={`fad-risk-level fad-${getRiskLevel(risquesData.scoreRisque || 0).color}`}>
                        {getRiskLevel(risquesData.scoreRisque || 0).level}
                      </div>
                    </div>
                  </div>
                  
                  <div className="fad-risk-filters">
                    <div className="fad-filter-label">Filtrer par priorité:</div>
                    <div className="fad-filter-buttons">
                      {['all', 'URGENT', 'CRITIQUE', 'HAUTE', 'MOYENNE'].map(priority => (
                        <button
                          key={priority}
                          className={`fad-filter-btn ${filterPriority === priority ? 'fad-active' : ''}`}
                          onClick={() => setFilterPriority(priority)}
                        >
                          {priority === 'all' ? 'Tous' : priority}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="fad-stats-grid">
                  <div className="fad-stat-card fad-critical">
                    <div className="fad-stat-icon">
                      <AlertTriangle size={32} />
                    </div>
                    <div className="fad-stat-content">
                      <h4>Sans Date Fin</h4>
                      <p className="fad-stat-value">{risquesData.resumeProblemes?.sans_date_fin || 0}</p>
                      <p className="fad-stat-sub">Problème critique</p>
                    </div>
                  </div>
                  <div className="fad-stat-card fad-warning">
                    <div className="fad-stat-icon">
                      <XCircle size={32} />
                    </div>
                    <div className="fad-stat-content">
                      <h4>Statuts Incohérents</h4>
                      <p className="fad-stat-value">{risquesData.resumeProblemes?.statut_incoherent || 0}</p>
                      <p className="fad-stat-sub">Incohérence</p>
                    </div>
                  </div>
                  <div className="fad-stat-card fad-info">
                    <div className="fad-stat-icon">
                      <Eye size={32} />
                    </div>
                    <div className="fad-stat-content">
                      <h4>Sans Photo</h4>
                      <p className="fad-stat-value">{risquesData.resumeProblemes?.sans_photo || 0}</p>
                      <p className="fad-stat-sub">Sécurité</p>
                    </div>
                  </div>
                  <div className="fad-stat-card fad-warning">
                    <div className="fad-stat-icon">
                      <DollarSign size={32} />
                    </div>
                    <div className="fad-stat-content">
                      <h4>Prix Invalides</h4>
                      <p className="fad-stat-value">{risquesData.resumeProblemes?.prix_invalide || 0}</p>
                      <p className="fad-stat-sub">Erreur financière</p>
                    </div>
                  </div>
                </div>

                {risquesData?.detailsProblemes && risquesData.detailsProblemes.length > 0 && (
                  <DataTable 
                    data={risquesData.detailsProblemes.filter(item => 
                      filterPriority === 'all' || item.type_probleme === filterPriority
                    )}
                    title="Détails des Problèmes Identifiés"
                    columns={[
                      { key: 'nom', label: 'Nom' },
                      { key: 'prenom', label: 'Prénom' },
                      { key: 'email', label: 'Email' },
                      {
                        key: 'type_probleme',
                        label: 'Type',
                        render: (val) => (
                          <span className={`fad-badge ${val === 'DATE_FIN_MANQUANTE' ? 'fad-critical' : 
                            val === 'STATUT_INCOHERENT' ? 'fad-warning' : 
                            val === 'PHOTO_MANQUANTE' ? 'fad-info' : 'fad-low'}`}>
                            {val?.replace(/_/g, ' ')}
                          </span>
                        )
                      },
                      { key: 'type_abonnement', label: 'Type Abonnement' },
                      {
                        key: 'prix_total',
                        label: 'Montant',
                        render: (val) => formatCurrency(val)
                      },
                      {
                        key: 'date_fin',
                        label: 'Date Fin',
                        render: (val) => formatDate(val)
                      },
                      {
                        key: 'statut',
                        label: 'Statut',
                        render: (val) => (
                          <span className={`fad-badge ${val === 'actif' ? 'fad-success' : 'fad-warning'}`}>
                            {val || 'N/A'}
                          </span>
                        )
                      }
                    ]}
                    maxRows={15}
                    loading={loadingSections.risques}
                  />
                )}

                {risquesData?.doublons && risquesData.doublons.length > 0 && (
                  <DataTable 
                    data={risquesData.doublons}
                    title="Doublons Potentiels"
                    columns={[
                      { key: 'email', label: 'Email' },
                      { key: 'occurrences', label: 'Occurrences' },
                      { key: 'noms_statuts', label: 'Noms & Statuts' },
                      { key: 'types_abonnements', label: 'Types' },
                      {
                        key: 'total_depense',
                        label: 'Total Dépensé',
                        render: (val) => formatCurrency(val)
                      }
                    ]}
                    loading={loadingSections.risques}
                  />
                )}
              </>
            ) : (
              <div className="fad-empty-state">
                <Shield size={64} />
                <h3>Analyse des Risques</h3>
                <p>L'analyse des risques est en cours de chargement...</p>
              </div>
            )}
          </div>
        )}

        {/* ABONNÉS À RELANCER */}
        {activeTab === 'relancer' && (
          <div className="fad-tab-content">
            {abonnesRelancer ? (
              <>
                <div className="fad-stats-grid">
                  <div className="fad-stat-card fad-critical">
                    <div className="fad-stat-icon">
                      <Bell size={32} />
                    </div>
                    <div className="fad-stat-content">
                      <h4>Expirent dans 7j</h4>
                      <p className="fad-stat-value">{abonnesRelancer.statsRelances?.expirent_7j || 0}</p>
                      <p className="fad-stat-sub">Urgent</p>
                    </div>
                  </div>
                  <div className="fad-stat-card fad-warning">
                    <div className="fad-stat-icon">
                      <Calendar size={32} />
                    </div>
                    <div className="fad-stat-content">
                      <h4>Expirent 15-30j</h4>
                      <p className="fad-stat-value">{abonnesRelancer.statsRelances?.expirent_15a30j || 0}</p>
                      <p className="fad-stat-sub">À surveiller</p>
                    </div>
                  </div>
                  <div className="fad-stat-card fad-info">
                    <div className="fad-stat-icon">
                      <Clock size={32} />
                    </div>
                    <div className="fad-stat-content">
                      <h4>Expirés Récemment</h4>
                      <p className="fad-stat-value">{abonnesRelancer.statsRelances?.expires_recemment || 0}</p>
                      <p className="fad-stat-sub">À récupérer</p>
                    </div>
                  </div>
                  <div className="fad-stat-card fad-primary">
                    <div className="fad-stat-icon">
                      <DollarSign size={32} />
                    </div>
                    <div className="fad-stat-content">
                      <h4>Revenu à Risque</h4>
                      <p className="fad-stat-value">
                        {formatCurrency(abonnesRelancer.statsRelances?.revenu_a_risque || 0)}
                      </p>
                      <p className="fad-stat-sub">Potentiel perte</p>
                    </div>
                  </div>
                </div>

                {abonnesRelancer.parPriorite?.urgent && abonnesRelancer.parPriorite.urgent.length > 0 && (
                  <DataTable 
                    data={abonnesRelancer.parPriorite.urgent}
                    title="🔴 URGENT - Expirent dans moins de 7 jours"
                    columns={[
                      { key: 'nom', label: 'Nom' },
                      { key: 'prenom', label: 'Prénom' },
                      { key: 'email', label: 'Email' },
                      { key: 'telephone', label: 'Téléphone' },
                      { key: 'type_abonnement', label: 'Type' },
                      {
                        key: 'date_fin',
                        label: 'Date Fin',
                        render: (val) => formatDate(val)
                      },
                      {
                        key: 'jours_restants',
                        label: 'Jours Restants',
                        render: (val) => (
                          <span className="fad-badge fad-critical">{val || 0} jours</span>
                        )
                      },
                      {
                        key: 'prix_total',
                        label: 'Valeur',
                        render: (val) => formatCurrency(val)
                      }
                    ]}
                    loading={loadingSections.relancer}
                  />
                )}

                {abonnesRelancer.parPriorite?.haute && abonnesRelancer.parPriorite.haute.length > 0 && (
                  <DataTable 
                    data={abonnesRelancer.parPriorite.haute}
                    title="🟠 HAUTE - Expirés Récemment & Forte Valeur"
                    columns={[
                      { key: 'nom', label: 'Nom' },
                      { key: 'prenom', label: 'Prénom' },
                      { key: 'email', label: 'Email' },
                      { key: 'telephone', label: 'Téléphone' },
                      { key: 'type_abonnement', label: 'Type' },
                      {
                        key: 'date_fin',
                        label: 'Date Fin',
                        render: (val) => formatDate(val)
                      },
                      { key: 'motif', label: 'Motif' },
                      {
                        key: 'prix_total',
                        label: 'Valeur',
                        render: (val) => formatCurrency(val)
                      }
                    ]}
                    loading={loadingSections.relancer}
                  />
                )}

                {abonnesRelancer.parPriorite?.moyenne && abonnesRelancer.parPriorite.moyenne.length > 0 && (
                  <DataTable 
                    data={abonnesRelancer.parPriorite.moyenne}
                    title="🟡 MOYENNE - À risque de churn"
                    columns={[
                      { key: 'nom', label: 'Nom' },
                      { key: 'prenom', label: 'Prénom' },
                      { key: 'email', label: 'Email' },
                      { key: 'telephone', label: 'Téléphone' },
                      { key: 'type_abonnement', label: 'Type' },
                      {
                        key: 'date_fin',
                        label: 'Date Fin',
                        render: (val) => formatDate(val)
                      },
                      {
                        key: 'statut',
                        label: 'Statut',
                        render: (val) => (
                          <span className={`fad-badge ${val === 'actif' ? 'fad-success' : 'fad-warning'}`}>
                            {val || 'N/A'}
                          </span>
                        )
                      }
                    ]}
                    maxRows={8}
                    loading={loadingSections.relancer}
                  />
                )}
              </>
            ) : (
              <div className="fad-empty-state">
                <Bell size={64} />
                <h3>Abonnés à Relancer</h3>
                <p>La liste des abonnés à relancer est en cours de chargement...</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="fad-dashboard-footer">
        <div className="fad-footer-content">
          <div className="fad-footer-left">
            <p>© 2026 Football Analytics Dashboard - Système d'analyse professionnel</p>
            <p>Données en temps réel - API: {API_BASE_URL}</p>
          </div>
          <div className="fad-footer-right">
            <p>Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}</p>
            <p>Statut: <span className="fad-status-success">● Connecté</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AnalyticsDashboard;