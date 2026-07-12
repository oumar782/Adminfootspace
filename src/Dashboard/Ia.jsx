import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Brain, Users, AlertTriangle, Target, Calendar, Clock, Star, Activity,
  Shield, Loader2, RefreshCw, ThumbsUp, AlertCircle, Sun, Moon, DollarSign,
  Menu, X, Award, MapPin, Sparkles, Compass, TrendingUp, TrendingDown, BarChart3
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

// Cache manager
class CacheManager {
  constructor(ttl = 60000) { // 1 minute TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  set(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new CacheManager();

function Ia() {
  const [activeTab, setActiveTab] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  // Optimized states with useMemo for derived data
  const [monthlyData, setMonthlyData] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [churnData, setChurnData] = useState([]);
  const [churnSummary, setChurnSummary] = useState(null);
  const [churnFilter, setChurnFilter] = useState('all');

  const [surfaces, setSurfaces] = useState([]);
  const [selectedSurface, setSelectedSurface] = useState('');
  const [selectedHeure, setSelectedHeure] = useState('');
  const [recommendationData, setRecommendationData] = useState(null);

  const [cancellationData, setCancellationData] = useState(null);
  const [cancellationMetrics, setCancellationMetrics] = useState(null);
  const [cancellationDate, setCancellationDate] = useState(new Date().toISOString().split('T')[0]);

  // Refs for preventing multiple requests
  const requestInProgress = useRef({});
  const debounceTimer = useRef(null);

  // Optimized fetch with AbortController and caching
  const fetchAPI = useCallback(async (url, options = {}, requestId = 'default', useCache = true) => {
    const cacheKey = `${url}_${options.body || ''}`;
    
    // Check cache first
    if (useCache && options.method !== 'POST') {
      const cachedData = cache.get(cacheKey);
      if (cachedData) return cachedData;
    }

    // Prevent duplicate requests
    if (requestInProgress.current[requestId]) {
      return null;
    }

    const controller = new AbortController();
    requestInProgress.current[requestId] = controller;

    try {
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', ...options.headers }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      // Cache GET requests
      if (useCache && options.method !== 'POST') {
        cache.set(cacheKey, data);
      }
      
      return data;
    } catch (err) {
      if (err.name === 'AbortError') return null;
      throw err;
    } finally {
      delete requestInProgress.current[requestId];
    }
  }, []);

  // Optimized health check with shorter timeout
  const checkApiStatus = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
      const response = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      setApiStatus(response.ok ? 'online' : 'offline');
      if (!response.ok) setError('API non disponible');
      else setError(null);
      
      return response.ok;
    } catch (err) {
      setApiStatus('offline');
      setError('Connexion impossible à l\'API');
      return false;
    }
  }, []);

  // Debounced monthly prediction
  const fetchMonthlyPrediction = useCallback(async () => {
    if (apiStatus !== 'online' || requestInProgress.current['monthly']) return;
    
    setLoading(true);
    
    try {
      // Parallel fetch for months and prediction
      const [monthsData, prediction] = await Promise.all([
        fetchAPI(`${API_BASE_URL}/monthly-revenue/months`, {}, 'months'),
        fetchAPI(`${API_BASE_URL}/monthly-revenue`, {
          method: 'POST',
          body: JSON.stringify({ mois: selectedMonth })
        }, 'monthly', false) // Don't cache POST
      ]);
      
      if (monthsData?.mois_disponibles) setAvailableMonths(monthsData.mois_disponibles);
      if (prediction) setMonthlyData(prediction);
    } catch (err) {
      console.error('Monthly error:', err);
      if (err.message !== 'aborted') setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, apiStatus, fetchAPI]);

  // Optimized churn fetch with pagination
  const fetchChurnData = useCallback(async () => {
    if (apiStatus !== 'online' || requestInProgress.current['churn']) return;
    
    try {
      const [clients, summary] = await Promise.all([
        fetchAPI(`${API_BASE_URL}/customer-churn/all?limit=100`, {}, 'churn-all'),
        fetchAPI(`${API_BASE_URL}/customer-churn/summary`, {}, 'churn-summary')
      ]);
      
      if (clients) setChurnData(clients);
      if (summary) setChurnSummary(summary);
    } catch (err) {
      console.error('Churn error:', err);
      if (err.message !== 'aborted') setError(err.message);
    }
  }, [apiStatus, fetchAPI]);

  // Optimized surfaces fetch
  const fetchSurfaces = useCallback(async () => {
    if (apiStatus !== 'online') return;
    
    try {
      const surfacesData = await fetchAPI(`${API_BASE_URL}/terrain-recommendation/surfaces`, {}, 'surfaces');
      if (surfacesData?.surfaces?.length) {
        setSurfaces(surfacesData.surfaces);
        if (!selectedSurface) setSelectedSurface(surfacesData.surfaces[0]);
      }
    } catch (err) {
      console.error('Surfaces error:', err);
    }
  }, [apiStatus, fetchAPI, selectedSurface]);

  // Debounced recommendation
  const fetchRecommendation = useCallback(async () => {
    if (!selectedSurface || apiStatus !== 'online' || requestInProgress.current['recommendation']) return;
    
    setRecLoading(true);
    
    try {
      const recommendation = await fetchAPI(`${API_BASE_URL}/terrain-recommendation`, {
        method: 'POST',
        body: JSON.stringify({
          surface: selectedSurface,
          heure: selectedHeure ? parseInt(selectedHeure) : null
        })
      }, 'recommendation', false);
      
      if (recommendation) setRecommendationData(recommendation);
    } catch (err) {
      console.error('Recommendation error:', err);
      if (err.message !== 'aborted') setError(err.message);
    } finally {
      setRecLoading(false);
    }
  }, [selectedSurface, selectedHeure, apiStatus, fetchAPI]);

  // Debounced cancellation
  const fetchCancellation = useCallback(async () => {
    if (apiStatus !== 'online' || requestInProgress.current['cancellation']) return;
    
    setCancelLoading(true);
    
    try {
      const [predictions, metrics] = await Promise.all([
        fetchAPI(`${API_BASE_URL}/cancellation-prediction`, {
          method: 'POST',
          body: JSON.stringify({ date: cancellationDate })
        }, 'cancellation-pred', false),
        fetchAPI(`${API_BASE_URL}/cancellation-prediction/metrics`, {}, 'cancellation-metrics')
      ]);
      
      if (predictions) setCancellationData(predictions);
      if (metrics) setCancellationMetrics(metrics);
    } catch (err) {
      console.error('Cancellation error:', err);
      if (err.message !== 'aborted') setError(err.message);
    } finally {
      setCancelLoading(false);
    }
  }, [cancellationDate, apiStatus, fetchAPI]);

  // Optimized initialization
  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      const isOnline = await checkApiStatus();
      if (mounted && isOnline) {
        await fetchSurfaces();
        if (activeTab === 'monthly') await fetchMonthlyPrediction();
        else if (activeTab === 'churn') await fetchChurnData();
        else if (activeTab === 'cancellation') await fetchCancellation();
      }
    };
    
    init();
    return () => { mounted = false; };
  }, []);

  // Debounced tab change
  useEffect(() => {
    if (apiStatus !== 'online') return;
    
    // Clear any pending debounce
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(() => {
      if (activeTab === 'monthly') fetchMonthlyPrediction();
      else if (activeTab === 'churn') fetchChurnData();
      else if (activeTab === 'cancellation') fetchCancellation();
    }, 100);
    
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [activeTab, apiStatus, fetchMonthlyPrediction, fetchChurnData, fetchCancellation]);

  // Memoized filtered data for performance
  const filteredChurn = useMemo(() => {
    if (!churnData.length) return [];
    if (churnFilter === 'risk') return churnData.filter(c => c.risque_churn >= 40);
    if (churnFilter === 'loyal') return churnData.filter(c => c.score_fidelite >= 60);
    return churnData;
  }, [churnData, churnFilter]);

  // Utility functions
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 MAD';
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);
  };

  const getRiskClass = (risk) => {
    if (risk >= 70) return 'risk-critical';
    if (risk >= 50) return 'risk-high';
    if (risk >= 30) return 'risk-medium';
    return 'risk-low';
  };

  const tabs = [
    { id: 'monthly', label: 'Prédiction Mensuelle', icon: Calendar },
    { id: 'churn', label: 'Analyse Churn', icon: Users },
    { id: 'recommendation', label: 'Recommandation IA', icon: Target },
    { id: 'cancellation', label: 'Prédiction Annulations', icon: AlertTriangle }
  ];

  // Loading states
  const [recLoading, setRecLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Early return for offline state
  if (apiStatus === 'offline') {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <AlertCircle size={64} style={styles.errorIcon} />
          <h2>Erreur de connexion</h2>
          <button style={styles.button} onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      {/* Header - Optimized with memo */}
      <HeaderComponent 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        tabs={tabs}
        onRefresh={() => {
          cache.clear();
          if (activeTab === 'monthly') fetchMonthlyPrediction();
          else if (activeTab === 'churn') fetchChurnData();
          else if (activeTab === 'recommendation') fetchRecommendation();
          else if (activeTab === 'cancellation') fetchCancellation();
        }}
      />

      {/* Main Content with optimized rendering */}
      <main style={styles.main}>
        <div style={styles.container}>
          {activeTab === 'monthly' && (
            <MonthlyPredictionView
              loading={loading}
              monthlyData={monthlyData}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              onRefresh={fetchMonthlyPrediction}
              formatCurrency={formatCurrency}
            />
          )}

          {activeTab === 'churn' && (
            <ChurnAnalysisView
              churnData={churnData}
              churnSummary={churnSummary}
              churnFilter={churnFilter}
              setChurnFilter={setChurnFilter}
              filteredChurn={filteredChurn}
              formatCurrency={formatCurrency}
              getRiskClass={getRiskClass}
              onRefresh={fetchChurnData}
            />
          )}

          {activeTab === 'recommendation' && (
            <RecommendationView
              selectedSurface={selectedSurface}
              setSelectedSurface={setSelectedSurface}
              selectedHeure={selectedHeure}
              setSelectedHeure={setSelectedHeure}
              surfaces={surfaces}
              recommendationData={recommendationData}
              loading={recLoading}
              onRecommend={fetchRecommendation}
            />
          )}

          {activeTab === 'cancellation' && (
            <CancellationView
              cancellationDate={cancellationDate}
              setCancellationDate={setCancellationDate}
              cancellationData={cancellationData}
              loading={cancelLoading}
              onPredict={fetchCancellation}
              getRiskClass={getRiskClass}
            />
          )}

          {error && (
            <div style={styles.toastError}>
              <AlertCircle size={18} />
              <span>{error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Separated components for better performance
const HeaderComponent = React.memo(({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, tabs, onRefresh }) => (
  <header style={styles.header}>
    <div style={styles.headerContent}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}><Brain size={28} /></div>
        <div><h1 style={styles.logoTitle}>FootSpace IA</h1></div>
      </div>
      <div style={styles.headerRight}>
        <button style={styles.iconButton} onClick={onRefresh}>
          <RefreshCw size={16} />
        </button>
        <button style={styles.mobileButton} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </div>
    <nav style={{ ...styles.nav, ...(mobileMenuOpen ? styles.navOpen : {}) }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            style={{ ...styles.navItem, ...(activeTab === tab.id ? styles.navItemActive : {}) }}
            onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
          >
            <Icon size={18} /> <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  </header>
));

const MonthlyPredictionView = React.memo(({ loading, monthlyData, selectedMonth, setSelectedMonth, onRefresh, formatCurrency }) => (
  <div style={styles.tab}>
    {loading ? <LoadingSpinner /> : monthlyData ? (
      <>
        <div style={styles.card}>
          <div style={styles.monthGrid}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
              <button
                key={m}
                style={{ ...styles.monthButton, ...(selectedMonth === m ? styles.monthButtonActive : {}) }}
                onClick={() => setSelectedMonth(m)}
              >
                {new Date(2024, m-1).toLocaleString('fr', { month: 'short' })}
              </button>
            ))}
          </div>
        </div>
        <div style={styles.kpiGrid}>
          <div style={styles.kpiCard}>
            <DollarSign size={28} />
            <div><small>Revenu estimé</small><h3>{formatCurrency(monthlyData.revenu_estime)}</h3></div>
          </div>
          <div style={styles.kpiCard}>
            <Activity size={28} />
            <div><small>Taux occupation</small><h3>{monthlyData.taux_occupation}%</h3></div>
          </div>
        </div>
      </>
    ) : <ErrorCard onRetry={onRefresh} />}
  </div>
));

const LoadingSpinner = () => (
  <div style={styles.loadingState}>
    <Loader2 size={40} style={styles.spinning} />
    <p>Chargement...</p>
  </div>
);

const ErrorCard = ({ onRetry }) => (
  <div style={styles.errorCard}>
    <AlertCircle size={32} />
    <p>Erreur de chargement</p>
    <button style={styles.button} onClick={onRetry}>Réessayer</button>
  </div>
);

// Styles object (same as before but optimized)
const styles = {
  dashboard: { minHeight: '100vh', background: '#f3f4f6' },
  header: { position: 'sticky', top: 0, zIndex: 100, padding: '16px 24px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)' },
  headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { width: '44px', height: '44px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
  logoTitle: { fontSize: '20px', fontWeight: '700', margin: 0, color: '#1f2937' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  iconButton: { width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: '#e5e7eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  mobileButton: { display: 'none', '@media (max-width: 768px)': { display: 'flex' } },
  nav: { display: 'flex', gap: '8px', padding: '0 24px', margin: '16px auto', maxWidth: '1400px', overflowX: 'auto' },
  navOpen: { '@media (max-width: 768px)': { display: 'flex', flexDirection: 'column', position: 'fixed', top: '80px', left: 0, right: 0, background: '#fff', padding: '16px' } },
  navItem: { padding: '12px 24px', borderRadius: '40px', border: 'none', background: 'transparent', fontWeight: '500', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' },
  navItemActive: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' },
  main: { padding: '0 24px 24px', maxWidth: '1400px', margin: '0 auto' },
  container: { width: '100%' },
  tab: { animation: 'fadeIn 0.2s ease-out' },
  card: { background: '#fff', borderRadius: '24px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  monthGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', '@media (max-width: 768px)': { gridTemplateColumns: 'repeat(3, 1fr)' } },
  monthButton: { padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: '500' },
  monthButtonActive: { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' },
  kpiCard: { background: '#fff', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  loadingState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', color: '#6b7280' },
  spinning: { animation: 'spin 1s linear infinite' },
  errorCard: { background: '#fff', borderRadius: '24px', padding: '48px', textAlign: 'center' },
  button: { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  toastError: { position: 'fixed', bottom: '24px', right: '24px', background: '#ef4444', color: '#fff', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1000 },
  errorContainer: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  errorIcon: { marginBottom: '24px', color: '#ef4444' }
};

// Add missing components
const ChurnAnalysisView = React.memo(({ churnData, churnSummary, churnFilter, setChurnFilter, filteredChurn, formatCurrency, getRiskClass, onRefresh }) => (
  <div style={styles.tab}>
    {churnData.length > 0 && churnSummary ? (
      <>
        <div style={styles.filterGroup}>
          {['all', 'risk', 'loyal'].map(filter => (
            <button key={filter} style={{ ...styles.filterButton, ...(churnFilter === filter ? styles.filterButtonActive : {}) }} onClick={() => setChurnFilter(filter)}>
              {filter === 'all' ? `Tous (${churnData.length})` : filter === 'risk' ? `À risque (${churnData.filter(c => c.risque_churn >= 40).length})` : `Fidèles (${churnData.filter(c => c.score_fidelite >= 60).length})`}
            </button>
          ))}
        </div>
        <div style={styles.kpiGrid}>
          <div style={styles.kpiCard}><Users size={28} /><div><small>Total Clients</small><h3>{churnSummary.total_clients}</h3></div></div>
          <div style={styles.kpiCard}><AlertTriangle size={28} /><div><small>Clients à risque</small><h3>{churnSummary.clients_risque}</h3></div></div>
          <div style={styles.kpiCard}><DollarSign size={28} /><div><small>CA Total</small><h3>{formatCurrency(churnSummary.chiffre_affaires_total)}</h3></div></div>
        </div>
        <div style={styles.card}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead><tr>{['Client', 'Résas', 'Dépense', 'Inactif', 'Fidélité', 'Risque'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
              <tbody>
                {filteredChurn.slice(0, 30).map((client, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}><strong>{client.nom_client}</strong></td>
                    <td style={styles.td}>{client.nombre_reservations}</td>
                    <td style={styles.td}>{formatCurrency(client.depense_totale)}</td>
                    <td style={styles.td}>{client.jours_inactif}j</td>
                    <td style={styles.td}>{client.score_fidelite}%</td>
                    <td style={{ ...styles.td, ...styles[getRiskClass(client.risque_churn)] }}>{client.risque_churn}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    ) : <ErrorCard onRetry={onRefresh} />}
  </div>
));

const RecommendationView = React.memo(({ selectedSurface, setSelectedSurface, selectedHeure, setSelectedHeure, surfaces, recommendationData, loading, onRecommend }) => (
  <div style={styles.tab}>
    <div style={styles.card}>
      <div style={styles.cardHeader}><Compass size={20} /><h3>Recommandation de terrain</h3></div>
      <div style={styles.formGroup}>
        <label>Surface (m²)</label>
        <input type="text" value={selectedSurface} onChange={(e) => setSelectedSurface(e.target.value)} placeholder="Ex: 100, 200, 400..." style={styles.input} />
      </div>
      <div style={styles.formGroup}>
        <label>Horaire (optionnel)</label>
        <select value={selectedHeure} onChange={(e) => setSelectedHeure(e.target.value)} style={styles.select}>
          <option value="">Automatique</option>
          {[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(h => <option key={h} value={h}>{h}h-{h+1}h</option>)}
        </select>
      </div>
      <button style={styles.button} onClick={onRecommend} disabled={loading || !selectedSurface}>
        {loading ? <Loader2 size={18} style={styles.spinning} /> : <Sparkles size={18} />}
        {loading ? 'Analyse...' : 'Obtenir recommandation'}
      </button>
    </div>
    {recommendationData && (
      <div style={styles.resultCard}>
        <div style={styles.resultTerrain}>{recommendationData.terrain_recommande}</div>
        <div style={styles.resultBadge}>{recommendationData.niveau_recommandation}</div>
        <p>{recommendationData.analyse_ia}</p>
        <small>Confiance: {recommendationData.probabilite_ia}%</small>
      </div>
    )}
  </div>
));

const CancellationView = React.memo(({ cancellationDate, setCancellationDate, cancellationData, loading, onPredict, getRiskClass }) => (
  <div style={styles.tab}>
    <div style={styles.card}>
      <input type="date" value={cancellationDate} onChange={(e) => setCancellationDate(e.target.value)} style={styles.dateInput} />
      <button style={{ ...styles.button, marginTop: '16px' }} onClick={onPredict} disabled={loading}>
        {loading ? <Loader2 size={18} style={styles.spinning} /> : 'Prédire'}
      </button>
    </div>
    {cancellationData && (
      <>
        <div style={styles.insightGrid}>
          {['Critique', 'Élevé', 'Total'].map((label, i) => (
            <div key={label} style={styles.insightCard}>
              <AlertCircle size={32} />
              <h4>Risque {label}</h4>
              <div style={styles.bigNumber}>{i === 0 ? cancellationData.nombre_critiques : i === 1 ? cancellationData.nombre_eleves : cancellationData.total_analyses}</div>
            </div>
          ))}
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr><th>Client</th><th>Téléphone</th><th>Fréquence</th><th>Risque</th></tr></thead>
            <tbody>
              {cancellationData.clients_risque?.slice(0, 30).map((client, idx) => (
                <tr key={idx}>
                  <td>{client.client}</td>
                  <td>{client.telephone}</td>
                  <td>{client.frequence}</td>
                  <td style={styles[getRiskClass(client.risque_annulation)]}>{client.risque_annulation}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )}
  </div>
));

// Add missing style properties
styles.filterGroup = { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' };
styles.filterButton = { padding: '8px 20px', borderRadius: '40px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' };
styles.filterButtonActive = { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none' };
styles.tableWrapper = { overflowX: 'auto' };
styles.table = { width: '100%', borderCollapse: 'collapse' };
styles.th = { padding: '12px 16px', textAlign: 'left', background: 'linear-gradient(135deg, rgba(102,126,234,0.05), rgba(118,75,162,0.05))', fontWeight: '600', borderBottom: '1px solid #e5e7eb' };
styles.td = { padding: '12px 16px', borderBottom: '1px solid #e5e7eb' };
styles['risk-critical'] = { color: '#ef4444', fontWeight: '700' };
styles['risk-high'] = { color: '#f59e0b', fontWeight: '600' };
styles['risk-medium'] = { color: '#3b82f6' };
styles['risk-low'] = { color: '#10b981' };
styles.formGroup = { marginBottom: '20px' };
styles.input = { width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px' };
styles.select = { width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px' };
styles.dateInput = { width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px' };
styles.resultCard = { background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '24px', padding: '32px', textAlign: 'center', color: '#fff' };
styles.resultTerrain = { fontSize: '28px', fontWeight: '800', marginBottom: '12px' };
styles.resultBadge = { display: 'inline-block', padding: '6px 16px', background: 'rgba(255,255,255,0.2)', borderRadius: '40px', fontSize: '12px', marginBottom: '16px' };
styles.insightGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' };
styles.insightCard = { background: '#fff', borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
styles.bigNumber = { fontSize: '48px', fontWeight: '800', background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
styles.cardHeader = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e5e7eb' };

// CSS keyframes injection
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
  document.head.appendChild(styleSheet);
}

export default Ia;