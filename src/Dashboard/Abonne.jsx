import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  Clock,
  Calendar,
  DollarSign,
  CreditCard,
  PieChart,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Phone,
  Mail,
  RefreshCw,
  Menu,
  ChevronUp,
  ChevronDown,
  Globe,
  Award,
  Target,
  Bell,
  Download,
  Filter,
  Search,
  MoreVertical,
  Star,
  Heart,
  Shield,
  Zap,
  Activity,
  Briefcase,
  MapPin,
  Package,
  LineChart,
  TrendingDown,
  UserPlus,
  UserMinus,
  Percent,
  CalendarDays,
  BadgeCheck,
  Sparkles,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Settings,
  LogOut,
  Home,
  BarChart2,
  Layers,
  Gift,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  HelpCircle,
  Bookmark,
  Flag,
  Grid,
  List,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Printer,
  Share2,
  Copy,
  Edit,
  Trash2,
  Plus,
  Minus,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowLeftCircle,
  ArrowRightCircle,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Anchor,
  Archive,
  BookOpen,
  Box,
  Camera,
  Cast,
  Chrome,
  Clipboard,
  Cloud,
  Coffee,
  Command,
  Compass,
  Cpu,
  Crop,
  Crosshair,
  Database,
  Disc,
  Dribbble,
  Droplet,
  Edit3,
  ExternalLink,
  Facebook,
  Feather,
  Figma,
  File,
  Film,
  Folder,
  Frown,
  GitBranch,
  Github,
  Gitlab,
  HardDrive,
  Hash,
  Headphones,
  Image,
  Inbox,
  Instagram,
  Key,
  Layout,
  LifeBuoy,
  Link,
  Linkedin,
  Loader,
  Lock,
  LogIn,
  Map,
  Maximize,
  Meh,
  Mic,
  Monitor,
  MoreHorizontal,
  Move,
  Music,
  Navigation,
  Paperclip,
  Pause,
  PauseCircle,
  PenTool,
  Play,
  PlayCircle,
  PlusCircle,
  Pocket,
  Power,
  Radio,
  RefreshCcw,
  Repeat,
  Rewind,
  RotateCcw,
  RotateCw,
  Rss,
  Save,
  Scissors,
  Send,
  Server,
  Share,
  ShoppingBag,
  ShoppingCart,
  Shuffle,
  SkipBack,
  SkipForward,
  Slack,
  Slash,
  Sliders,
  Smartphone,
  Smile,
  Speaker,
  StopCircle,
  Sunrise,
  Sunset,
  Tablet,
  Tag,
  Terminal,
  Thermometer,
  ToggleLeft,
  ToggleRight,
  Trash,
  Truck,
  Tv,
  Twitch,
  Twitter,
  Type,
  Umbrella,
  Underline,
  Unlock,
  Upload,
  User,
  Video,
  Voicemail,
  Volume1,
  Volume2,
  VolumeX,
  Watch,
  Wifi,
  Wind,
  XOctagon,
  XSquare,
  Youtube,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import './abonne.css';

// Composants de graphiques personnalisés
const SimpleBarChart = ({ data, width = '100%', height = 300 }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value || 0));
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${data.length * 60} 300`}>
      {data.map((item, index) => {
        const barHeight = maxValue > 0 ? (item.value / maxValue) * 250 : 0;
        return (
          <g key={index}>
            <rect
              x={index * 60 + 10}
              y={280 - barHeight}
              width={40}
              height={barHeight}
              fill="url(#gradient)"
              rx="4"
            >
              <animate
                attributeName="height"
                from="0"
                to={barHeight}
                dur="1s"
                fill="freeze"
              />
            </rect>
            <text
              x={index * 60 + 30}
              y={290}
              fontSize="10"
              textAnchor="middle"
              fill="var(--gray)"
            >
              {item.label || 'N/A'}
            </text>
            <text
              x={index * 60 + 30}
              y={270 - barHeight}
              fontSize="10"
              textAnchor="middle"
              fill="var(--primary)"
              fontWeight="bold"
            >
              {item.value || 0}
            </text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary-light)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const SimpleLineChart = ({ data, width = '100%', height = 300 }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value || 0));
  
  if (maxValue === 0) return null;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 500 + 50;
    const y = 250 - ((d.value || 0) / maxValue) * 200;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} viewBox="0 0 600 300">
      {/* Grille */}
      {[0, 1, 2, 3, 4].map(i => (
        <line
          key={i}
          x1="50"
          y1={50 + i * 50}
          x2="550"
          y2={50 + i * 50}
          stroke="var(--gray-lighter)"
          strokeDasharray="5,5"
        />
      ))}
      
      {/* Ligne principale */}
      <polyline
        points={points}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3"
      />
      
      {/* Points */}
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * 500 + 50;
        const y = 250 - ((d.value || 0) / maxValue) * 200;
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="6"
              fill="var(--white)"
              stroke="var(--primary)"
              strokeWidth="2"
            />
            <text
              x={x}
              y={y - 15}
              fontSize="10"
              textAnchor="middle"
              fill="var(--primary)"
              fontWeight="bold"
            >
              {d.value || 0}
            </text>
            <text
              x={x}
              y={280}
              fontSize="10"
              textAnchor="middle"
              fill="var(--gray)"
            >
              {d.label || 'N/A'}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const SimplePieChart = ({ data, size = 200 }) => {
  if (!data || data.length === 0) return null;
  
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
  if (total === 0) return null;
  
  let startAngle = 0;
  const colors = ['var(--primary)', 'var(--secondary)', 'var(--warning)', 'var(--info)', 'var(--danger)'];
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((item, index) => {
        const angle = ((item.value || 0) / total) * 360;
        const endAngle = startAngle + angle;
        
        // Calcul des points pour l'arc
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;
        const x1 = size/2 + (size/2 - 20) * Math.cos(startRad);
        const y1 = size/2 + (size/2 - 20) * Math.sin(startRad);
        const x2 = size/2 + (size/2 - 20) * Math.cos(endRad);
        const y2 = size/2 + (size/2 - 20) * Math.sin(endRad);
        
        const largeArcFlag = angle > 180 ? 1 : 0;
        
        const pathData = [
          `M ${size/2} ${size/2}`,
          `L ${x1} ${y1}`,
          `A ${size/2 - 20} ${size/2 - 20} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ');
        
        startAngle = endAngle;
        
        return (
          <path
            key={index}
            d={pathData}
            fill={colors[index % colors.length]}
            stroke="var(--white)"
            strokeWidth="2"
          >
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="1s"
              fill="freeze"
            />
          </path>
        );
      })}
    </svg>
  );
};

const DashboardAbonnes = () => {
  const [data, setData] = useState(null);
  const [churnData, setChurnData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('resume');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('6mois');
  const [darkMode, setDarkMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [expandedCards, setExpandedCards] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes
  const [chartType, setChartType] = useState('bar');
  const [selectedChart, setSelectedChart] = useState('evolution');
  const [useMockData, setUseMockData] = useState(false);
  
  // URLs CORRIGÉES
  const API_URL_ANALYSE = 'https://backend-foot-omega.vercel.app/api/annalyse-abonnes/analyse-complete';
  const API_URL_CHURN = 'https://backend-foot-omega.vercel.app/api/annalyse-abonnes/etude-churn';

  // Données simulées pour l'analyse complète
  const mockData = {
    success: true,
    resume_executif: {
      metriques_principales: {
        total_clients: 245,
        clients_actifs: 189,
        clients_inactifs: 32,
        clients_en_attente: 15,
        clients_expires: 9,
        pourcentage_actifs: 77.1
      },
      chiffre_affaires: {
        total: 125000,
        evolution_mensuelle: '+12.5',
        panier_moyen: 450
      },
      indicateurs_cles: {
        taux_desabonnement_mensuel: '3.2%',
        nouveaux_clients_mois: 28
      }
    },
    tendances: {
      evolution_mensuelle: [
        { mois: 'Jan', nouveaux_clients: 15, revenus_mois: 7500 },
        { mois: 'Fév', nouveaux_clients: 18, revenus_mois: 8200 },
        { mois: 'Mar', nouveaux_clients: 22, revenus_mois: 9500 },
        { mois: 'Avr', nouveaux_clients: 20, revenus_mois: 8900 },
        { mois: 'Mai', nouveaux_clients: 25, revenus_mois: 11200 },
        { mois: 'Juin', nouveaux_clients: 28, revenus_mois: 12500 }
      ],
      evolution_statuts: [
        { mois: 'Jan', actifs: 150, expires: 5 },
        { mois: 'Fév', actifs: 158, expires: 7 },
        { mois: 'Mar', actifs: 165, expires: 6 },
        { mois: 'Avr', actifs: 172, expires: 8 },
        { mois: 'Mai', actifs: 180, expires: 9 },
        { mois: 'Juin', actifs: 189, expires: 9 }
      ]
    },
    commercial: {
      performance_mois: {
        ventes: 42,
        chiffre_affaires: 18900,
        panier_moyen: 450,
        nouveaux_clients: 28
      },
      comparaison_mois_precedent: {
        ventes_precedent: 38,
        evolution_ventes: '+10.5'
      },
      top_clients: [
        { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', total_depense: 2500 },
        { nom: 'Martin', prenom: 'Marie', email: 'marie.martin@email.com', total_depense: 2100 },
        { nom: 'Bernard', prenom: 'Pierre', email: 'pierre.bernard@email.com', total_depense: 1850 }
      ],
      par_type_abonnement: [
        { type_abonnement: 'Premium', nombre: 85, revenu_total: 42500 },
        { type_abonnement: 'Standard', nombre: 120, revenu_total: 48000 },
        { type_abonnement: 'Essentiel', nombre: 40, revenu_total: 12000 }
      ],
      par_mode_paiement: [
        { mode_paiement: 'Carte', nombre_transactions: 150, revenu_total: 67500 },
        { mode_paiement: 'Espèces', nombre_transactions: 75, revenu_total: 33750 },
        { mode_paiement: 'Virement', nombre_transactions: 20, revenu_total: 9000 }
      ]
    },
    clients: {
      repartition_par_statut: [
        { statut: 'actif', nombre_clients: 189, revenu_total: 85050 },
        { statut: 'inactif', nombre_clients: 32, revenu_total: 14400 },
        { statut: 'en attente', nombre_clients: 15, revenu_total: 6750 },
        { statut: 'expire', nombre_clients: 9, revenu_total: 4050 }
      ],
      repartition_geographique: [
        { region: 'France', nombre_clients: 150, revenu_total: 67500 },
        { region: 'Belgique', nombre_clients: 45, revenu_total: 20250 },
        { region: 'Suisse', nombre_clients: 30, revenu_total: 13500 }
      ],
      repartition_par_tranche_prix: [
        { tranche: 'Moins de 100 DH', nombre_clients: 45, revenu_tranche: 3600 },
        { tranche: '100 - 300 DH', nombre_clients: 120, revenu_tranche: 24000 },
        { tranche: '301 - 500 DH', nombre_clients: 60, revenu_tranche: 24000 },
        { tranche: 'Plus de 1000 DH', nombre_clients: 20, revenu_tranche: 30000 }
      ]
    },
    actions: {
      clients_a_contacter: [
        { nom: 'Petit', prenom: 'Thomas', email: 'thomas.petit@email.com', date_expiration: '15/07/2024', jours_restants: 5, priorite: 'Urgent' },
        { nom: 'Robert', prenom: 'Sophie', email: 'sophie.robert@email.com', date_expiration: '20/07/2024', jours_restants: 10, priorite: 'À relancer' }
      ],
      alertes: {
        expirations_urgentes: 1,
        expirations_prochaines: 1
      }
    },
    satisfaction: {
      indicateurs: {
        taux_activite: '77.1%',
        clients_actifs: 189,
        clients_inactifs: 32,
        en_attente_validation: 15
      }
    },
    previsions: {
      renouvellements_3_mois: [
        { mois: '07/2024', nb_renouvellements: 25, montant_total: 11250 },
        { mois: '08/2024', nb_renouvellements: 30, montant_total: 13500 },
        { mois: '09/2024', nb_renouvellements: 28, montant_total: 12600 }
      ],
      montant_total_renouvellements: 37350
    },
    recommandations: [
      { priorite: 'Haute', domaine: 'Fidélisation', action: 'Contacter les clients dont l\'abonnement expire bientôt', impact: 'Maintien du taux de rétention' },
      { priorite: 'Moyenne', domaine: 'Rétention', action: 'Mettre en place un programme de fidélisation', impact: 'Réduction du taux de désabonnement' }
    ],
    metriques_financieres: {
      total_revenus: '125 000 DH',
      revenu_mensuel_moyen: '10 417 DH',
      panier_moyen_global: '450 DH',
      prevision_3mois: '37 350 DH'
    }
  };

  // Données simulées pour le churn
  const mockChurnData = {
    success: true,
    donnees: [
      {
        mois: "2026-03",
        nb_desabonnements: "1",
        revenu_perdu: "500,00 DH",
        duree_moyenne_abonnement: "35.0",
        desabonnes_premiers_30j: "0",
        premium_perdus: "0",
        standard_perdus: "0",
        essentiel_perdus: "0",
        taux_premiers_30j: "0.00%"
      },
      {
        mois: "2026-02",
        nb_desabonnements: "3",
        revenu_perdu: "1500,00 DH",
        duree_moyenne_abonnement: "42.5",
        desabonnes_premiers_30j: "1",
        premium_perdus: "1",
        standard_perdus: "1",
        essentiel_perdus: "1",
        taux_premiers_30j: "33.33%"
      },
      {
        mois: "2026-01",
        nb_desabonnements: "2",
        revenu_perdu: "950,00 DH",
        duree_moyenne_abonnement: "28.0",
        desabonnes_premiers_30j: "1",
        premium_perdus: "0",
        standard_perdus: "1",
        essentiel_perdus: "1",
        taux_premiers_30j: "50.00%"
      }
    ],
    total: {
      desabonnements: 6,
      revenu_perdu: "2950,00 DH"
    }
  };

  // Fonction pour récupérer les données
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser les données simulées si demandé
      if (useMockData) {
        console.log('Utilisation des données simulées');
        setTimeout(() => {
          setData(mockData);
          setChurnData(mockChurnData);
          setLastUpdate(new Date());
          setLoading(false);
          generateNotifications(mockData, mockChurnData);
        }, 1000);
        return;
      }
      
      console.log('Chargement des données depuis:', API_URL_ANALYSE);
      console.log('Chargement des données churn depuis:', API_URL_CHURN);
      
      // Charger les deux endpoints en parallèle
      const [analyseResponse, churnResponse] = await Promise.all([
        fetch(API_URL_ANALYSE, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }),
        fetch(API_URL_CHURN, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        })
      ]);

      // Vérifier les réponses
      if (!analyseResponse.ok) {
        if (analyseResponse.status === 404) {
          throw new Error('API analyse non trouvée');
        }
        throw new Error(`Erreur HTTP ${analyseResponse.status} sur l'analyse`);
      }

      if (!churnResponse.ok) {
        if (churnResponse.status === 404) {
          throw new Error('API churn non trouvée');
        }
        throw new Error(`Erreur HTTP ${churnResponse.status} sur le churn`);
      }

      const analyseText = await analyseResponse.text();
      const churnText = await churnResponse.text();

      if (analyseText.trim().startsWith('<!DOCTYPE')) {
        throw new Error('L\'API analyse a retourné une page HTML');
      }

      if (churnText.trim().startsWith('<!DOCTYPE')) {
        throw new Error('L\'API churn a retourné une page HTML');
      }

      const analyseResult = JSON.parse(analyseText);
      const churnResult = JSON.parse(churnText);
      
      if (analyseResult.success) {
        setData(analyseResult);
        setChurnData(churnResult);
        setLastUpdate(new Date());
        setRetryCount(0);
        
        // Générer des notifications basées sur les données
        generateNotifications(analyseResult, churnResult);
      } else {
        throw new Error(analyseResult.message || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
      setRetryCount(prev => prev + 1);
      
      // Si erreur après 3 tentatives, proposer d'utiliser les données simulées
      if (retryCount >= 2) {
        setError(`${err.message} - Voulez-vous utiliser les données de démonstration ?`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Générer des notifications automatiques
  const generateNotifications = (analyseData, churnData) => {
    const notifs = [];
    
    if (analyseData.actions?.alertes?.expirations_urgentes > 0) {
      notifs.push({
        id: Date.now() + 1,
        type: 'urgent',
        message: `${analyseData.actions.alertes.expirations_urgentes} clients ont des abonnements qui expirent dans moins de 7 jours`,
        time: 'Maintenant',
        read: false
      });
    }
    
    if (parseFloat(analyseData.resume_executif?.indicateurs_cles?.taux_desabonnement_mensuel) > 5) {
      notifs.push({
        id: Date.now() + 2,
        type: 'warning',
        message: `Taux de désabonnement élevé : ${analyseData.resume_executif.indicateurs_cles.taux_desabonnement_mensuel}`,
        time: 'Maintenant',
        read: false
      });
    }
    
    if (parseFloat(analyseData.resume_executif?.chiffre_affaires?.evolution_mensuelle) > 10) {
      notifs.push({
        id: Date.now() + 3,
        type: 'success',
        message: `Bonne progression du CA : ${analyseData.resume_executif.chiffre_affaires.evolution_mensuelle}`,
        time: 'Maintenant',
        read: false
      });
    }

    // Notification basée sur les données churn
    if (churnData && churnData.donnees && churnData.donnees.length > 0) {
      const dernierMois = churnData.donnees[0];
      if (parseInt(dernierMois.nb_desabonnements) > 2) {
        notifs.push({
          id: Date.now() + 4,
          type: 'warning',
          message: `${dernierMois.nb_desabonnements} désabonnements en ${dernierMois.mois} - Revenu perdu: ${dernierMois.revenu_perdu}`,
          time: 'Maintenant',
          read: false
        });
      }
    }
    
    setNotifications(prev => [...notifs, ...prev].slice(0, 10));
  };

  // Auto-refresh
  useEffect(() => {
    fetchData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // Retry automatique
  useEffect(() => {
    if (error && retryCount < 3 && !useMockData) {
      const timer = setTimeout(() => {
        fetchData();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  // Gestion du fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };

  // Formatage des nombres avec gestion NaN
  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Formatage des prix en DH avec gestion NaN
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '0 DH';
    
    // Si c'est déjà une chaîne formatée, la retourner
    if (typeof amount === 'string' && amount.includes('DH')) {
      return amount;
    }
    
    return new Intl.NumberFormat('fr-MA', { 
      style: 'currency', 
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('MAD', 'DH');
  };

  // Formatage des pourcentages avec gestion NaN
  const formatPercent = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0%';
    
    // Si c'est déjà une chaîne avec %, la retourner
    if (typeof value === 'string' && value.includes('%')) {
      return value;
    }
    
    return `${parseFloat(value).toFixed(1)}%`;
  };

  // Fonction sécurisée pour extraire les valeurs numériques
  const safeNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined) return defaultValue;
    
    // Si c'est une chaîne avec des symboles, extraire le nombre
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Fonction sécurisée pour extraire les chaînes
  const safeString = (value, defaultValue = '') => {
    if (value === null || value === undefined) return defaultValue;
    return String(value);
  };

  // Icône de tendance
  const getTrendIcon = (value) => {
    const numValue = safeNumber(value);
    if (numValue > 0) return <ChevronUp size={16} className="trend-up" />;
    if (numValue < 0) return <ChevronDown size={16} className="trend-down" />;
    return <Minus size={16} className="trend-neutral" />;
  };

  // Couleur de statut
  const getStatusColor = (statut) => {
    const colors = {
      'actif': 'success',
      'inactif': 'gray',
      'en attente': 'warning',
      'expire': 'danger'
    };
    return colors[safeString(statut).toLowerCase()] || 'gray';
  };

  // Couleur de priorité
  const getPriorityColor = (priorite) => {
    const colors = {
      'urgent': 'danger',
      'À relancer': 'warning',
      'information': 'info'
    };
    return colors[safeString(priorite)] || 'gray';
  };

  // Filtrage des clients
  const filterClients = (clients) => {
    if (!clients || !Array.isArray(clients)) return [];
    return clients.filter(client => {
      const fullName = `${safeString(client.nom)} ${safeString(client.prenom)}`.toLowerCase();
      const email = safeString(client.email).toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      return fullName.includes(searchLower) || email.includes(searchLower);
    });
  };

  // Toggle d'expansion des cartes
  const toggleCardExpand = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Marquer une notification comme lue
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Supprimer une notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Activer les données simulées
  const enableMockData = () => {
    setUseMockData(true);
    setLoading(true);
    setTimeout(() => {
      setData(mockData);
      setChurnData(mockChurnData);
      setLastUpdate(new Date());
      setLoading(false);
      setError(null);
      generateNotifications(mockData, mockChurnData);
    }, 500);
  };

  // Préparer les données pour les graphiques
  const prepareChartData = () => {
    if (!data) return { evolution: [], repartition: [], abonnements: [] };
    
    const evolution = (data.tendances?.evolution_mensuelle || []).map(item => ({
      label: safeString(item.mois).slice(5) || safeString(item.mois),
      value: safeNumber(item.nouveaux_clients),
      revenu: safeNumber(item.revenus_mois)
    }));
    
    const repartition = (data.clients?.repartition_par_statut || []).map(item => ({
      label: safeString(item.statut),
      value: safeNumber(item.nombre_clients)
    }));
    
    const abonnements = (data.commercial?.par_type_abonnement || []).map(item => ({
      label: safeString(item.type_abonnement),
      value: safeNumber(item.nombre),
      revenu: safeNumber(item.revenu_total)
    }));
    
    return { evolution, repartition, abonnements };
  };

  // Préparer les données de churn pour les graphiques
  const prepareChurnChartData = () => {
    if (!churnData || !churnData.donnees) return [];
    
    return churnData.donnees.map(item => ({
      label: item.mois,
      value: safeNumber(item.nb_desabonnements),
      revenu: safeNumber(item.revenu_perdu),
      duree: safeNumber(item.duree_moyenne_abonnement),
      taux30j: item.taux_premiers_30j
    }));
  };

  // Loader
  if (loading) {
    return (
      <div className={`dashboard-loader ${darkMode ? 'dark' : ''}`}>
        <div className="loader-spinner">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
        <div className="loader-text">
          {retryCount > 0 ? `Tentative ${retryCount}/3...` : 'Chargement du tableau de bord...'}
        </div>
        <div className="loader-progress">
          <div className="loader-progress-bar" style={{ width: `${(retryCount / 3) * 100}%` }}></div>
        </div>
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div className={`dashboard-error ${darkMode ? 'dark' : ''}`}>
        <AlertTriangle size={64} className="error-icon" />
        <h2>Erreur de chargement</h2>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={fetchData} className="retry-button primary">
            <RefreshCw size={20} />
            Réessayer
          </button>
          <button 
            onClick={enableMockData} 
            className="retry-button secondary"
          >
            Mode Démo (données simulées)
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button secondary"
          >
            Recharger la page
          </button>
        </div>
        <div className="error-details">
          <p>URL Analyse: {API_URL_ANALYSE}</p>
          <p>URL Churn: {API_URL_CHURN}</p>
          <p>Statut: {retryCount > 0 ? `Tentative ${retryCount}/3` : 'En attente'}</p>
          <p>Conseil: Utilisez le mode démo pour tester l'interface</p>
        </div>
      </div>
    );
  }

  // Pas de données
  if (!data || !data.resume_executif) {
    return (
      <div className={`dashboard-error ${darkMode ? 'dark' : ''}`}>
        <Info size={64} className="error-icon warning" />
        <h2>Format de données inattendu</h2>
        <p>L'API a répondu mais le format n'est pas celui attendu</p>
        <button onClick={enableMockData} className="retry-button primary">
          Mode Démo
        </button>
        <button onClick={fetchData} className="retry-button secondary">
          <RefreshCw size={20} />
          Réessayer
        </button>
      </div>
    );
  }

  const { 
    resume_executif, 
    tendances, 
    commercial, 
    clients, 
    actions, 
    satisfaction, 
    previsions, 
    recommandations,
    evolution_ca_mensuelle,
    metriques_financieres
  } = data;

  const chartData = prepareChartData();
  const churnChartData = prepareChurnChartData();

  // ============================================
  // RENDU DES COMPOSANTS
  // ============================================

  // Cartes KPI
  const renderKpiCards = () => (
    <div className="kpi-grid">
      <div className="kpi-card kpi-primary" style={{ animationDelay: '0.1s' }}>
        <div className="kpi-icon-wrapper">
          <Users size={28} />
        </div>
        <div className="kpi-content">
          <div className="kpi-title">Total Clients</div>
          <div className="kpi-value">{formatNumber(resume_executif.metriques_principales?.total_clients || 0)}</div>
          <div className="kpi-trend positive">
            <UserCheck size={14} />
            {safeNumber(resume_executif.metriques_principales?.pourcentage_actifs).toFixed(1)}% actifs
          </div>
        </div>
      </div>

      <div className="kpi-card kpi-success" style={{ animationDelay: '0.2s' }}>
        <div className="kpi-icon-wrapper">
          <DollarSign size={28} />
        </div>
        <div className="kpi-content">
          <div className="kpi-title">CA Total</div>
          <div className="kpi-value">{metriques_financieres?.total_revenus || formatCurrency(resume_executif.chiffre_affaires?.total || 0)}</div>
          <div className="kpi-trend positive">
            <TrendingUp size={14} />
            +{resume_executif.indicateurs_cles?.nouveaux_clients_mois || 0} nouveaux
          </div>
        </div>
      </div>

      <div className="kpi-card kpi-secondary" style={{ animationDelay: '0.3s' }}>
        <div className="kpi-icon-wrapper">
          <CreditCard size={28} />
        </div>
        <div className="kpi-content">
          <div className="kpi-title">Panier Moyen</div>
          <div className="kpi-value">{formatCurrency(resume_executif.chiffre_affaires?.panier_moyen || 0)}</div>
          <div className="kpi-trend positive">
            <Package size={14} />
            {commercial?.performance_mois?.ventes || 0} ventes
          </div>
        </div>
      </div>

      <div className="kpi-card kpi-warning" style={{ animationDelay: '0.4s' }}>
        <div className="kpi-icon-wrapper">
          <Clock size={28} />
        </div>
        <div className="kpi-content">
          <div className="kpi-title">À Contacter</div>
          <div className="kpi-value">{(actions?.clients_a_contacter || []).length}</div>
          <div className="kpi-trend negative">
            <AlertCircle size={14} />
            {actions?.alertes?.expirations_urgentes || 0} urgents
          </div>
        </div>
      </div>
    </div>
  );

  // Panneau de contrôle des graphiques
  const renderChartControls = () => (
    <div className="chart-controls">
      <div className="chart-type-selector">
        <button 
          className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
          onClick={() => setChartType('bar')}
        >
          <BarChart3 size={16} />
          Barres
        </button>
        <button 
          className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
          onClick={() => setChartType('line')}
        >
          <LineChart size={16} />
          Lignes
        </button>
        <button 
          className={`chart-type-btn ${chartType === 'pie' ? 'active' : ''}`}
          onClick={() => setChartType('pie')}
        >
          <PieChart size={16} />
          Camembert
        </button>
      </div>
      <div className="chart-data-selector">
        <select 
          className="chart-data-select"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
        >
          <option value="evolution">Évolution des clients</option>
          <option value="repartition">Répartition par statut</option>
          <option value="abonnements">Types d'abonnement</option>
        </select>
      </div>
    </div>
  );

  // Rendu du graphique sélectionné
  const renderSelectedChart = () => {
    let chartData = [];
    let title = '';
    
    switch(selectedChart) {
      case 'evolution':
        chartData = prepareChartData().evolution;
        title = 'Évolution des nouveaux clients';
        break;
      case 'repartition':
        chartData = prepareChartData().repartition;
        title = 'Répartition par statut';
        break;
      case 'abonnements':
        chartData = prepareChartData().abonnements;
        title = 'Types d\'abonnement';
        break;
      default:
        chartData = [];
    }
    
    if (chartData.length === 0) {
      return (
        <div className="no-data">
          <BarChart3 size={48} className="no-data-icon" />
          <p>Aucune donnée disponible</p>
        </div>
      );
    }
    
    return (
      <div className="chart-display">
        <h4 className="chart-title">{title}</h4>
        <div className="chart-wrapper">
          {chartType === 'bar' && <SimpleBarChart data={chartData} height={300} />}
          {chartType === 'line' && <SimpleLineChart data={chartData} height={300} />}
          {chartType === 'pie' && <SimplePieChart data={chartData} size={300} />}
        </div>
        <div className="chart-legend-detailed">
          {chartData.map((item, index) => (
            <div key={index} className="legend-item-detailed">
              <span className="legend-color" style={{ backgroundColor: `var(--${index % 5 === 0 ? 'primary' : index % 5 === 1 ? 'secondary' : index % 5 === 2 ? 'warning' : index % 5 === 3 ? 'info' : 'danger'})` }}></span>
              <span className="legend-label">{item.label || 'N/A'}</span>
              <span className="legend-value">{formatNumber(item.value)}</span>
              {item.revenu > 0 && <span className="legend-revenu">{formatCurrency(item.revenu)}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Graphique d'évolution mensuelle amélioré
  const renderEvolutionChart = () => {
    const data = tendances?.evolution_mensuelle || [];
    const maxRevenu = Math.max(...data.map(i => safeNumber(i.revenus_mois)), 0);
    
    return (
      <div className="chart-card">
        <div className="card-header">
          <h3>
            <BarChart3 size={20} className="card-icon" />
            Évolution mensuelle
          </h3>
          <div className="card-actions">
            <span className={`trend-badge ${safeNumber(resume_executif.chiffre_affaires?.evolution_mensuelle) >= 0 ? 'croissance' : 'decroissance'}`}>
              {getTrendIcon(resume_executif.chiffre_affaires?.evolution_mensuelle)}
              {formatPercent(resume_executif.chiffre_affaires?.evolution_mensuelle)}
            </span>
            <button className="card-action-btn" onClick={() => toggleCardExpand('evolution')}>
              {expandedCards['evolution'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
        <div className={`chart-container ${expandedCards['evolution'] ? 'expanded' : ''}`}>
          {data.length > 0 ? (
            <>
              <div className="chart-bars">
                {data.slice(0, expandedCards['evolution'] ? 12 : 6).map((item, index) => {
                  const height = maxRevenu > 0 ? ((safeNumber(item.revenus_mois)) / maxRevenu) * 100 : 0;
                  return (
                    <div key={index} className="chart-bar-wrapper">
                      <div className="chart-bar-track">
                        <div 
                          className="chart-bar-fill"
                          style={{ 
                            height: `${height}%`,
                            background: `linear-gradient(180deg, var(--primary-light), var(--primary))`
                          }}
                        >
                          <span className="chart-bar-value">{formatNumber(item.nouveaux_clients)}</span>
                        </div>
                      </div>
                      <span className="chart-bar-label">{item.mois || 'N/A'}</span>
                    </div>
                  );
                })}
              </div>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: 'var(--primary)' }}></span>
                  Nouveaux clients
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: 'var(--secondary)' }}></span>
                  Revenus
                </span>
              </div>
            </>
          ) : (
            <div className="no-data">
              <BarChart3 size={48} className="no-data-icon" />
              <p>Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Répartition par statut
  const renderStatutRepartition = () => {
    const statuts = clients?.repartition_par_statut || [];
    const total = resume_executif.metriques_principales?.total_clients || 1;
    
    return (
      <div className="chart-card">
        <div className="card-header">
          <h3>
            <PieChart size={20} className="card-icon" />
            Répartition par statut
          </h3>
          <div className="card-actions">
            <span className="info-badge">
              <Users size={14} />
              {total} total
            </span>
            <button className="card-action-btn" onClick={() => toggleCardExpand('statut')}>
              {expandedCards['statut'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
        <div className={`statut-list ${expandedCards['statut'] ? 'expanded' : ''}`}>
          {statuts.map((statut, index) => {
            const nombre = safeNumber(statut.nombre_clients);
            const pourcentage = total > 0 ? (nombre / total * 100).toFixed(1) : 0;
            const color = getStatusColor(statut.statut);
            
            return (
              <div key={index} className="statut-item">
                <div className="statut-info">
                  <span className={`statut-badge statut-${color}`}>
                    {statut.statut || 'Inconnu'}
                  </span>
                  <span className="statut-count">{formatNumber(nombre)}</span>
                </div>
                <div className="statut-bar">
                  <div 
                    className={`statut-bar-fill statut-${color}`}
                    style={{ width: `${pourcentage}%` }}
                  ></div>
                </div>
                <span className="statut-percent">{pourcentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Top clients
  const renderTopClients = () => {
    const tops = commercial?.top_clients || [];
    const filteredTops = filterClients(tops);
    
    return (
      <div className="insight-card">
        <div className="card-header">
          <h3>
            <Award size={20} className="card-icon" />
            Top 5 Clients
          </h3>
          <div className="card-actions">
            <span className="info-badge">
              <Star size={14} />
              Meilleurs acheteurs
            </span>
            <button className="card-action-btn" onClick={() => toggleCardExpand('top')}>
              {expandedCards['top'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>
        <div className={`top-clients-list ${expandedCards['top'] ? 'expanded' : ''}`}>
          {filteredTops.slice(0, expandedCards['top'] ? 20 : 5).map((client, index) => (
            <div key={index} className="client-item">
              <div className="client-rank">{index + 1}</div>
              <div className="client-avatar">
                {client.nom ? client.nom.charAt(0) : 'C'}
              </div>
              <div className="client-info">
                <div className="client-name">{client.nom || ''} {client.prenom || ''}</div>
                <div className="client-email">{client.email || ''}</div>
              </div>
              <div className="client-amount">{formatCurrency(safeNumber(client.total_depense))}</div>
            </div>
          ))}
          {filteredTops.length === 0 && (
            <div className="no-data">
              <Users size={32} className="no-data-icon" />
              <p>Aucun client trouvé</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Alertes et actions
  const renderAlertes = () => {
    const alertes = actions?.clients_a_contacter || [];
    const filteredAlertes = filterClients(alertes);
    
    return (
      <div className="insight-card">
        <div className="card-header">
          <h3>
            <Bell size={20} className="card-icon" />
            Alertes et actions
          </h3>
          <div className="card-actions">
            <span className={`trend-badge ${alertes.length > 0 ? 'warning' : 'success'}`}>
              <AlertCircle size={14} />
              {alertes.length} alertes
            </span>
            <button className="card-action-btn" onClick={() => toggleCardExpand('alertes')}>
              {expandedCards['alertes'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
        <div className={`alert-list ${expandedCards['alertes'] ? 'expanded' : ''}`}>
          {filteredAlertes.slice(0, expandedCards['alertes'] ? 20 : 5).map((client, index) => (
            <div key={index} className={`alert-item priority-${getPriorityColor(client.priorite)}`}>
              <AlertCircle size={18} />
              <div className="alert-content">
                <strong>{client.nom || ''} {client.prenom || ''}</strong>
                <div className="alert-details">
                  Expire le {client.date_expiration || 'N/A'} • {client.jours_restants || 0} jours restants
                </div>
              </div>
              <span className={`priority-tag priority-${getPriorityColor(client.priorite)}`}>
                {client.priorite || 'N/A'}
              </span>
            </div>
          ))}
          {filteredAlertes.length === 0 && (
            <div className="no-data">
              <CheckCircle size={32} className="no-data-icon success" />
              <p>Aucune alerte</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Mini graphiques
  const renderMiniCharts = () => {
    const stats = [
      { label: 'Actifs', value: safeNumber(resume_executif.metriques_principales?.clients_actifs), color: 'var(--success)' },
      { label: 'Inactifs', value: safeNumber(resume_executif.metriques_principales?.clients_inactifs), color: 'var(--gray)' },
      { label: 'En attente', value: safeNumber(resume_executif.metriques_principales?.clients_en_attente), color: 'var(--warning)' },
      { label: 'Expirés', value: safeNumber(resume_executif.metriques_principales?.clients_expires), color: 'var(--danger)' },
    ];
    
    const total = stats.reduce((acc, s) => acc + s.value, 0);
    
    return (
      <div className="mini-charts">
        <div className="mini-chart">
          <h4>Distribution des statuts</h4>
          <div className="progress-stack">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="progress-segment"
                style={{
                  width: total > 0 ? `${(stat.value / total) * 100}%` : '0%',
                  backgroundColor: stat.color
                }}
                title={`${stat.label}: ${stat.value} (${total > 0 ? ((stat.value / total) * 100).toFixed(1) : 0}%)`}
              />
            ))}
          </div>
          <div className="stats-mini-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-mini-item">
                <span className="stat-mini-dot" style={{ backgroundColor: stat.color }}></span>
                <span className="stat-mini-label">{stat.label}</span>
                <span className="stat-mini-value">{formatNumber(stat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Nouvelle section pour l'analyse du churn
  const renderChurnAnalysis = () => {
    if (!churnData || !churnData.donnees || churnData.donnees.length === 0) {
      return (
        <div className="chart-card">
          <div className="card-header">
            <h3>
              <TrendingDown size={20} className="card-icon" />
              Analyse du Churn
            </h3>
          </div>
          <div className="no-data">
            <TrendingDown size={48} className="no-data-icon" />
            <p>Aucune donnée de churn disponible</p>
          </div>
        </div>
      );
    }

    const churnForChart = churnChartData.map(item => ({
      label: item.label,
      value: item.value
    }));

    return (
      <div className="chart-card">
        <div className="card-header">
          <h3>
            <TrendingDown size={20} className="card-icon" />
            Analyse du Churn
          </h3>
          <div className="card-actions">
            <span className="info-badge">
              <Users size={14} />
              Total: {churnData.total?.desabonnements || 0} désab.
            </span>
            <button className="card-action-btn" onClick={() => toggleCardExpand('churn')}>
              {expandedCards['churn'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
        
        <div className={`churn-container ${expandedCards['churn'] ? 'expanded' : ''}`}>
          {/* Graphique des désabonnements */}
          <div className="churn-chart">
            <SimpleBarChart data={churnForChart} height={200} />
          </div>

          {/* Statistiques globales */}
          <div className="churn-stats-grid">
            <div className="churn-stat-card">
              <div className="churn-stat-label">Total désabonnés</div>
              <div className="churn-stat-value">{churnData.total?.desabonnements || 0}</div>
            </div>
            <div className="churn-stat-card">
              <div className="churn-stat-label">Revenu perdu</div>
              <div className="churn-stat-value">{churnData.total?.revenu_perdu || '0 DH'}</div>
            </div>
          </div>

          {/* Détails mensuels */}
          <div className="churn-details">
            <h4>Détails par mois</h4>
            <table className="churn-table">
              <thead>
                <tr>
                  <th>Mois</th>
                  <th>Désabonnements</th>
                  <th>Revenu perdu</th>
                  <th>Durée moyenne</th>
                  <th>Taux 30j</th>
                </tr>
              </thead>
              <tbody>
                {churnData.donnees.map((item, index) => (
                  <tr key={index}>
                    <td>{item.mois}</td>
                    <td>{item.nb_desabonnements}</td>
                    <td>{item.revenu_perdu}</td>
                    <td>{item.duree_moyenne_abonnement} jours</td>
                    <td>
                      <span className={`churn-taux ${safeNumber(item.taux_premiers_30j) > 30 ? 'warning' : 'normal'}`}>
                        {item.taux_premiers_30j}
                      </span>
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

  // Onglet Résumé
  const renderResume = () => (
    <div className="tab-content">
      {renderKpiCards()}
      
      <div className="charts-main">
        {renderChartControls()}
        <div className="chart-main-card">
          {renderSelectedChart()}
        </div>
      </div>

      <div className="charts-row">
        {renderEvolutionChart()}
        {renderStatutRepartition()}
      </div>

      <div className="insight-section">
        {renderTopClients()}
        {renderAlertes()}
      </div>

      {renderMiniCharts()}

      {/* Ajout de l'analyse churn dans le résumé */}
      {renderChurnAnalysis()}

      {resume_executif.client_plus_performant && (
        <div className="featured-client">
          <div className="featured-client-header">
            <Sparkles size={24} className="featured-icon" />
            <h3>Client Premium</h3>
          </div>
          <div className="featured-client-content">
            <div className="featured-client-avatar">
              {resume_executif.client_plus_performant.prenom?.charAt(0)}
              {resume_executif.client_plus_performant.nom?.charAt(0)}
            </div>
            <div className="featured-client-info">
              <div className="featured-client-name">
                {resume_executif.client_plus_performant.prenom} {resume_executif.client_plus_performant.nom}
              </div>
              <div className="featured-client-details">
                <span className="featured-detail">
                  <Package size={14} />
                  {resume_executif.client_plus_performant.nombre_abonnements || 0} abonnements
                </span>
                <span className="featured-detail">
                  <DollarSign size={14} />
                  {resume_executif.client_plus_performant.total_depense_formate || '0 DH'}
                </span>
                <span className="featured-detail">
                  <BadgeCheck size={14} />
                  {resume_executif.client_plus_performant.type_abonnement || 'Standard'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Onglet Commercial (inchangé)
  const renderCommercial = () => (
    <div className="tab-content">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-title">CA du mois</div>
            <div className="metric-value">{formatCurrency(commercial?.performance_mois?.chiffre_affaires || 0)}</div>
            <div className="metric-subtitle">
              {getTrendIcon(commercial?.comparaison_mois_precedent?.evolution_ventes)}
              {formatPercent(commercial?.comparaison_mois_precedent?.evolution_ventes)}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Package size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-title">Ventes du mois</div>
            <div className="metric-value">{formatNumber(commercial?.performance_mois?.ventes)}</div>
            <div className="metric-subtitle">
              vs {formatNumber(commercial?.comparaison_mois_precedent?.ventes_precedent)} le mois dernier
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <UserPlus size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-title">Nouveaux clients</div>
            <div className="metric-value">{formatNumber(commercial?.performance_mois?.nouveaux_clients)}</div>
            <div className="metric-subtitle">Ce mois-ci</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <CreditCard size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-title">Panier moyen</div>
            <div className="metric-value">{formatCurrency(commercial?.performance_mois?.panier_moyen)}</div>
            <div className="metric-subtitle">Par transaction</div>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="card-header">
            <h3>
              <BarChart3 size={20} className="card-icon" />
              Performance par type d'abonnement
            </h3>
            <button className="card-action-btn" onClick={() => toggleCardExpand('abonnement')}>
              {expandedCards['abonnement'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
          <div className={`abonnement-stats ${expandedCards['abonnement'] ? 'expanded' : ''}`}>
            {(commercial?.par_type_abonnement || []).map((item, index) => (
              <div key={index} className="abonnement-stat">
                <span className="abonnement-type">{item.type_abonnement || 'Inconnu'}</span>
                <span className="abonnement-count">{formatNumber(item.nombre)} abonnés</span>
                <span className="abonnement-revenu">{formatCurrency(item.revenu_total)}</span>
              </div>
            ))}
            {(!commercial?.par_type_abonnement || commercial.par_type_abonnement.length === 0) && (
              <div className="no-data">
                <BarChart3 size={32} className="no-data-icon" />
                <p>Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3>
              <CreditCard size={20} className="card-icon" />
              Modes de paiement
            </h3>
            <button className="card-action-btn" onClick={() => toggleCardExpand('paiement')}>
              {expandedCards['paiement'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
          <div className={`paiement-stats ${expandedCards['paiement'] ? 'expanded' : ''}`}>
            {(commercial?.par_mode_paiement || []).map((item, index) => (
              <div key={index} className="paiement-stat">
                <span className="paiement-type">{item.mode_paiement || 'Inconnu'}</span>
                <span className="paiement-count">{formatNumber(item.nombre_transactions)} transactions</span>
                <span className="paiement-revenu">{formatCurrency(item.revenu_total)}</span>
              </div>
            ))}
            {(!commercial?.par_mode_paiement || commercial.par_mode_paiement.length === 0) && (
              <div className="no-data">
                <CreditCard size={32} className="no-data-icon" />
                <p>Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {evolution_ca_mensuelle && (
        <div className="chart-card">
          <div className="card-header">
            <h3>
              <LineChart size={20} className="card-icon" />
              Évolution du CA comparatif
            </h3>
            <button className="card-action-btn" onClick={() => toggleCardExpand('ca')}>
              {expandedCards['ca'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
          <div className={`evolution-ca ${expandedCards['ca'] ? 'expanded' : ''}`}>
            <div className="evolution-ca-grid">
              {(evolution_ca_mensuelle.donnees || []).slice(0, expandedCards['ca'] ? 24 : 6).map((item, index) => (
                <div key={index} className="evolution-ca-item">
                  <div className="evolution-ca-mois">{item.mois}</div>
                  <div className="evolution-ca-valeur">{item.ca_mois}</div>
                  <div className="evolution-ca-trend">
                    {getTrendIcon(item.evolution_mensuelle_pourcentage)}
                    <span className={safeNumber(item.evolution_mensuelle_pourcentage) >= 0 ? 'positive' : 'negative'}>
                      {formatPercent(item.evolution_mensuelle_pourcentage)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Onglet Clients (inchangé)
  const renderClients = () => (
    <div className="tab-content">
      <div className="charts-row">
        <div className="chart-card">
          <div className="card-header">
            <h3>
              <Globe size={20} className="card-icon" />
              Répartition géographique
            </h3>
            <button className="card-action-btn" onClick={() => toggleCardExpand('geo')}>
              {expandedCards['geo'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
          <div className={`geo-list ${expandedCards['geo'] ? 'expanded' : ''}`}>
            {(clients?.repartition_geographique || []).map((item, index) => (
              <div key={index} className="geo-item">
                <span className="geo-region">{item.region || 'Inconnu'}</span>
                <span className="geo-count">{formatNumber(item.nombre_clients)} clients</span>
                <span className="geo-revenu">{formatCurrency(item.revenu_total)}</span>
              </div>
            ))}
            {(!clients?.repartition_geographique || clients.repartition_geographique.length === 0) && (
              <div className="no-data">
                <Globe size={32} className="no-data-icon" />
                <p>Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3>
              <DollarSign size={20} className="card-icon" />
              Tranches de prix
            </h3>
            <button className="card-action-btn" onClick={() => toggleCardExpand('prix')}>
              {expandedCards['prix'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
          <div className={`tranches-list ${expandedCards['prix'] ? 'expanded' : ''}`}>
            {(clients?.repartition_par_tranche_prix || []).map((item, index) => {
              const maxRevenu = Math.max(...(clients.repartition_par_tranche_prix || []).map(i => safeNumber(i.revenu_tranche)), 0);
              return (
                <div key={index} className="tranche-item">
                  <span className="tranche-label">{item.tranche || 'Inconnu'}</span>
                  <span className="tranche-count">{formatNumber(item.nombre_clients)} clients</span>
                  <div className="tranche-bar">
                    <div 
                      className="tranche-bar-fill"
                      style={{ 
                        width: maxRevenu > 0 ? `${(safeNumber(item.revenu_tranche) / maxRevenu) * 100}%` : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {(!clients?.repartition_par_tranche_prix || clients.repartition_par_tranche_prix.length === 0) && (
              <div className="no-data">
                <DollarSign size={32} className="no-data-icon" />
                <p>Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="chart-card">
        <div className="card-header">
          <h3>
            <Clock size={20} className="card-icon" />
            Évolution des statuts
          </h3>
          <button className="card-action-btn" onClick={() => toggleCardExpand('evolutionStatuts')}>
            {expandedCards['evolutionStatuts'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
        <div className={`statut-evolution ${expandedCards['evolutionStatuts'] ? 'expanded' : ''}`}>
          {(tendances?.evolution_statuts || []).map((item, index) => (
            <div key={index} className="statut-evolution-item">
              <span className="statut-evolution-mois">{item.mois || 'N/A'}</span>
              <div className="statut-evolution-bars">
                <div className="statut-evolution-bar actifs" style={{ width: `${Math.min((item.actifs || 0) * 2, 200)}px` }}>
                  <span>Actifs: {item.actifs || 0}</span>
                </div>
                <div className="statut-evolution-bar expires" style={{ width: `${Math.min((item.expires || 0) * 2, 200)}px` }}>
                  <span>Expirés: {item.expires || 0}</span>
                </div>
              </div>
            </div>
          ))}
          {(!tendances?.evolution_statuts || tendances.evolution_statuts.length === 0) && (
            <div className="no-data">
              <Clock size={32} className="no-data-icon" />
              <p>Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Onglet Actions (inchangé)
  const renderActions = () => (
    <div className="tab-content">
      <div className="chart-card">
        <div className="card-header">
          <h3>
            <AlertCircle size={20} className="card-icon" />
            Clients à contacter
          </h3>
          <div className="card-actions">
            <span className={`trend-badge ${(actions?.clients_a_contacter || []).length > 0 ? 'warning' : 'success'}`}>
              {(actions?.clients_a_contacter || []).length} à relancer
            </span>
            <button className="card-action-btn" onClick={() => toggleCardExpand('clientsContact')}>
              {expandedCards['clientsContact'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>
        <div className={`clients-table-container ${expandedCards['clientsContact'] ? 'expanded' : ''}`}>
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Contact</th>
                <th>Abonnement</th>
                <th>Expiration</th>
                <th>Priorité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {actions?.clients_a_contacter && filterClients(actions.clients_a_contacter)
                .slice(0, expandedCards['clientsContact'] ? 100 : 10)
                .map((client, index) => (
                <tr key={index}>
                  <td>
                    <div className="client-cell">
                      <div className="client-avatar-small">
                        {client.nom ? client.nom.charAt(0) : 'C'}
                      </div>
                      <strong>{client.nom || ''} {client.prenom || ''}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <span className="contact-item">
                        <Mail size={12} /> {client.email || 'N/A'}
                      </span>
                      <span className="contact-item">
                        <Phone size={12} /> {client.telephone || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="abonnement-tag">{client.type_abonnement || 'N/A'}</span>
                  </td>
                  <td>
                    <div className="expiration-info">
                      <span>{client.date_expiration || 'N/A'}</span>
                      <span className="jours-restants">({client.jours_restants || 0}j)</span>
                    </div>
                  </td>
                  <td>
                    <span className={`priority-tag priority-${getPriorityColor(client.priorite)}`}>
                      {client.priorite || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" title="Appeler">
                        <Phone size={16} />
                      </button>
                      <button className="action-btn" title="Envoyer un email">
                        <Mail size={16} />
                      </button>
                      <button className="action-btn" title="Plus d'options">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!actions?.clients_a_contacter || filterClients(actions.clients_a_contacter).length === 0) && (
                <tr>
                  <td colSpan="6" className="no-data-cell">
                    <div className="no-data">
                      <CheckCircle size={32} className="no-data-icon success" />
                      <p>Aucun client à contacter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-card">
        <div className="card-header">
          <h3>
            <Calendar size={20} className="card-icon" />
            Renouvellements prévus
          </h3>
          <button className="card-action-btn" onClick={() => toggleCardExpand('renouvellements')}>
            {expandedCards['renouvellements'] ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
        <div className={`renouvellements-list ${expandedCards['renouvellements'] ? 'expanded' : ''}`}>
          {(previsions?.renouvellements_3_mois || []).map((item, index) => (
            <div key={index} className="renouvellement-item">
              <span className="renouvellement-mois">Mois {item.mois || 'N/A'}</span>
              <span className="renouvellement-count">{formatNumber(item.nb_renouvellements)} renouvellements</span>
              <span className="renouvellement-montant">{formatCurrency(item.montant_total)}</span>
            </div>
          ))}
          {(previsions?.renouvellements_3_mois || []).length > 0 && (
            <div className="renouvellement-total">
              <span className="total-label">Total</span>
              <span className="total-count">
                {formatNumber((previsions.renouvellements_3_mois || []).reduce((acc, r) => acc + (r.nb_renouvellements || 0), 0))} renouvellements
              </span>
              <span className="total-montant">{formatCurrency(previsions.montant_total_renouvellements || 0)}</span>
            </div>
          )}
          {(!previsions?.renouvellements_3_mois || previsions.renouvellements_3_mois.length === 0) && (
            <div className="no-data">
              <Calendar size={32} className="no-data-icon" />
              <p>Aucun renouvellement prévu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Onglet Recommandations
  const renderRecommandations = () => (
    <div className="tab-content">
      <div className="chart-card">
        <div className="card-header">
          <h3>
            <Target size={20} className="card-icon" />
            Recommandations stratégiques
          </h3>
          <span className="info-badge">
            <Zap size={14} />
            {(recommandations || []).length} actions prioritaires
          </span>
        </div>
        <div className="recommandations-list">
          {(recommandations || []).map((rec, index) => (
            <div key={index} className={`recommandation-item priority-${(rec.priorite || '').toLowerCase()}`}>
              <div className="recommandation-header">
                <span className={`priority-badge priority-${(rec.priorite || '').toLowerCase()}`}>
                  {rec.priorite || 'N/A'}
                </span>
                <span className="recommandation-domaine">{rec.domaine || 'N/A'}</span>
              </div>
              <div className="recommandation-action">{rec.action || 'N/A'}</div>
              <div className="recommandation-impact">
                <Zap size={14} />
                Impact: {rec.impact || 'N/A'}
              </div>
            </div>
          ))}
          {(!recommandations || recommandations.length === 0) && (
            <div className="no-data">
              <Target size={32} className="no-data-icon" />
              <p>Aucune recommandation disponible</p>
            </div>
          )}
        </div>
      </div>

      <div className="insight-section">
        <div className="insight-card">
          <div className="card-header">
            <h3>
              <Heart size={20} className="card-icon" />
              Satisfaction client
            </h3>
          </div>
          <div className="satisfaction-metrics">
            <div className="satisfaction-item">
              <div className="satisfaction-label">
                <UserCheck size={16} />
                Taux d'activité
              </div>
              <div className="satisfaction-value">{satisfaction?.indicateurs?.taux_activite || '0%'}</div>
            </div>
            <div className="satisfaction-item">
              <div className="satisfaction-label">
                <UserX size={16} />
                Clients inactifs
              </div>
              <div className="satisfaction-value">{formatNumber(satisfaction?.indicateurs?.clients_inactifs)}</div>
            </div>
            <div className="satisfaction-item">
              <div className="satisfaction-label">
                <Clock size={16} />
                En attente
              </div>
              <div className="satisfaction-value">{formatNumber(satisfaction?.indicateurs?.en_attente_validation)}</div>
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div className="card-header">
            <h3>
              <Shield size={20} className="card-icon" />
              Indicateurs clés
            </h3>
          </div>
          <div className="key-metrics">
            <div className="key-metric">
              <div className="key-metric-label">
                <TrendingDown size={16} />
                Taux désabonnement
              </div>
              <div className="key-metric-value">{resume_executif?.indicateurs_cles?.taux_desabonnement_mensuel || '0%'}</div>
            </div>
            <div className="key-metric">
              <div className="key-metric-label">
                <UserPlus size={16} />
                Nouveaux ce mois
              </div>
              <div className="key-metric-value">{formatNumber(resume_executif?.indicateurs_cles?.nouveaux_clients_mois)}</div>
            </div>
            <div className="key-metric">
              <div className="key-metric-label">
                <Percent size={16} />
                Taux de rétention
              </div>
              <div className="key-metric-value">
                {(100 - safeNumber(resume_executif?.indicateurs_cles?.taux_desabonnement_mensuel)).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ajout de l'analyse churn détaillée dans l'onglet stratégie */}
      {renderChurnAnalysis()}
    </div>
  );

  // ============================================
  // RENDU PRINCIPAL
  // ============================================
  return (
    <div className={`dashboard ${darkMode ? 'dark' : ''} ${fullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <Activity size={24} />
              <div className="logo-pulse"></div>
            </div>
            <div className="logo-text">
              <h1>Analytics Dashboard</h1>
              <span className="header-date">
                <Clock size={12} />
                Dernière mise à jour: {lastUpdate?.toLocaleString('fr-FR') || 'N/A'}
                {useMockData && <span className="mock-badge"> (Mode Démo)</span>}
              </span>
            </div>
          </div>
          
          <div className="header-actions">
            {/* Search */}
            <div className="header-search">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Auto-refresh toggle */}
            <button 
              className={`header-icon-button ${autoRefresh ? 'active' : ''}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
              title={autoRefresh ? 'Auto-refresh activé' : 'Auto-refresh désactivé'}
            >
              <RefreshCw size={18} className={autoRefresh ? 'spinning' : ''} />
            </button>

            {/* Notifications */}
            <div className="notifications-dropdown">
              <button 
                className="notifications-button"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={18} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="notifications-badge">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="notifications-panel">
                  <div className="notifications-header">
                    <h4>Notifications</h4>
                    <button onClick={markAllAsRead} className="mark-read">
                      Tout marquer comme lu
                    </button>
                  </div>
                  <div className="notifications-list">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`notification-item ${notif.read ? 'read' : ''} ${notif.type}`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className="notification-icon">
                            {notif.type === 'urgent' && <AlertCircle size={16} />}
                            {notif.type === 'warning' && <AlertTriangle size={16} />}
                            {notif.type === 'success' && <CheckCircle size={16} />}
                          </div>
                          <div className="notification-content">
                            <p>{notif.message}</p>
                            <span className="notification-time">{notif.time}</span>
                          </div>
                          <button 
                            className="notification-close"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notif.id);
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        <Bell size={24} />
                        <p>Aucune notification</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <button 
              className="header-icon-button"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Fullscreen toggle */}
            <button 
              className="header-icon-button"
              onClick={toggleFullscreen}
              title={fullscreen ? 'Quitter le plein écran' : 'Plein écran'}
            >
              {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            {/* Refresh button */}
            <button className="refresh-button" onClick={fetchData}>
              <RefreshCw size={18} className={loading ? 'spinning' : ''} />
              <span>Actualiser</span>
            </button>

            {/* Mobile menu button */}
            <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`dashboard-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-track">
          <div 
            className="nav-indicator" 
            style={{ 
              left: activeTab === 'resume' ? '0%' : 
                     activeTab === 'commercial' ? '20%' : 
                     activeTab === 'clients' ? '40%' : 
                     activeTab === 'actions' ? '60%' : 
                     activeTab === 'recommandations' ? '80%' : '0%'
            }}
          ></div>
          <button 
            className={`nav-tab ${activeTab === 'resume' ? 'active' : ''}`}
            onClick={() => { setActiveTab('resume'); setMobileMenuOpen(false); }}
          >
            <PieChart size={18} />
            Résumé
          </button>
          <button 
            className={`nav-tab ${activeTab === 'commercial' ? 'active' : ''}`}
            onClick={() => { setActiveTab('commercial'); setMobileMenuOpen(false); }}
          >
            <TrendingUp size={18} />
            Commercial
          </button>
          <button 
            className={`nav-tab ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => { setActiveTab('clients'); setMobileMenuOpen(false); }}
          >
            <Users size={18} />
            Clients
          </button>
          <button 
            className={`nav-tab ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => { setActiveTab('actions'); setMobileMenuOpen(false); }}
          >
            <AlertCircle size={18} />
            Actions
          </button>
          <button 
            className={`nav-tab ${activeTab === 'recommandations' ? 'active' : ''}`}
            onClick={() => { setActiveTab('recommandations'); setMobileMenuOpen(false); }}
          >
            <Target size={18} />
            Stratégie
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="dashboard-main">
        {/* Filters bar */}
        <div className="filters-bar">
          <div className="filters-left">
            <button 
              className={`filter-button ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filtres
            </button>
            <select 
              className="period-select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="30j">30 derniers jours</option>
              <option value="3mois">3 derniers mois</option>
              <option value="6mois">6 derniers mois</option>
              <option value="1an">1 an</option>
            </select>
          </div>
          <div className="filters-right">
            <div className="view-mode">
              <button 
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </button>
              <button 
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
            </div>
            <button className="export-button">
              <Download size={16} />
              Exporter
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Période</label>
              <input type="date" className="filter-input" />
              <span>à</span>
              <input type="date" className="filter-input" />
            </div>
            <div className="filter-group">
              <label>Statut</label>
              <select className="filter-select">
                <option>Tous</option>
                <option>Actif</option>
                <option>Inactif</option>
                <option>En attente</option>
                <option>Expiré</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Abonnement</label>
              <select className="filter-select">
                <option>Tous</option>
                <option>Premium</option>
                <option>Standard</option>
                <option>Essentiel</option>
              </select>
            </div>
            <button className="apply-filters">Appliquer</button>
          </div>
        )}

        {/* Active tab content */}
        {activeTab === 'resume' && renderResume()}
        {activeTab === 'commercial' && renderCommercial()}
        {activeTab === 'clients' && renderClients()}
        {activeTab === 'actions' && renderActions()}
        {activeTab === 'recommandations' && renderRecommandations()}
      </main>
    </div>
  );
};

export default DashboardAbonnes;