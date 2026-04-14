import React, { useState, useEffect } from "react";
import { 
  Eye, Edit, Trash2, RefreshCw, Search, ChevronLeft, ChevronRight,
  Users, CheckCircle, Clock, Calendar, 
  Mail, Phone, CreditCard, Printer, AlertCircle,
  Plus, User, CalendarDays, BadgeCheck, Building2, TrendingUp, X, DollarSign
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  :root {
    --green-900: #023d12;
    --green-700: #056f25;
    --green-500: #0c9c30;
    --green-300: #4ade80;
    --green-100: #d1fae5;
    --green-50:  #f0fdf4;
    --ink: #0d1117;
    --ink-soft: #374151;
    --ink-muted: #6b7280;
    --surface: #ffffff;
    --surface-2: #f9fafb;
    --border: rgba(0,0,0,0.08);
    --red: #ef4444;
    --red-bg: rgba(239,68,68,0.08);
    --yellow: #f59e0b;
    --yellow-bg: rgba(245,158,11,0.08);
    --blue: #3b82f6;
    --blue-bg: rgba(59,130,246,0.08);
    --grad: linear-gradient(135deg, var(--green-700), var(--green-500));
    --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06);
    --shadow-pop: 0 4px 6px rgba(5,111,37,0.08), 0 24px 48px rgba(5,111,37,0.16);
    --shadow-xl: 0 25px 60px rgba(0,0,0,0.18);
    --radius: 24px;
    --radius-sm: 14px;
    --radius-pill: 999px;
    --transition: 0.3s cubic-bezier(0.4,0,0.2,1);
    --bounce: 0.4s cubic-bezier(0.34,1.2,0.64,1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dashboard-wrap {
    font-family: 'DM Sans', sans-serif;
    background: #f4f6f0;
    min-height: 100vh;
    padding: 96px 24px 80px;
    position: relative;
    overflow: hidden;
    margin-left: 65px;
  }

  .dashboard-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
  }
  .dashboard-blob-1 {
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(5,111,37,0.12), transparent 70%);
    top: -120px; left: -160px;
  }
  .dashboard-blob-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(12,156,48,0.08), transparent 70%);
    bottom: 0; right: -100px;
  }

  .dashboard-inner {
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .dashboard-head {
    text-align: center;
    margin-bottom: 48px;
  }
  .dashboard-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--surface);
    border: 1.5px solid var(--green-100);
    color: var(--green-700);
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 18px;
    border-radius: var(--radius-pill);
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(5,111,37,0.08);
  }
  .dashboard-eyebrow::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green-500);
  }
  .dashboard-head h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 5vw, 48px);
    font-weight: 800;
    line-height: 1.1;
    color: var(--ink);
    margin-bottom: 16px;
  }
  .dashboard-head h1 em {
    font-style: normal;
    background: var(--grad);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .dashboard-head p {
    font-size: 17px;
    color: var(--ink-muted);
    max-width: 600px;
    margin: 0 auto;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 40px;
  }
  .stat-card {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 24px;
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-card);
    transition: transform var(--transition), box-shadow var(--transition);
  }
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }
  .stat-icon {
    margin-bottom: 16px;
    color: var(--green-700);
  }
  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: var(--ink);
    margin-bottom: 8px;
  }
  .stat-label {
    font-size: 14px;
    color: var(--ink-muted);
    font-weight: 500;
  }
  .stat-trend {
    font-size: 12px;
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .stat-trend.up { color: var(--green-700); }
  .stat-trend.down { color: var(--red); }

  .filters-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 32px;
    padding: 20px 24px;
    background: var(--surface);
    border-radius: var(--radius);
    border: 1.5px solid var(--border);
  }
  .search-box {
    flex: 1;
    min-width: 250px;
    position: relative;
  }
  .search-box input {
    width: 100%;
    padding: 12px 16px 12px 42px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-pill);
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    transition: var(--transition);
  }
  .search-box input:focus {
    outline: none;
    border-color: var(--green-500);
    box-shadow: 0 0 0 3px rgba(5,111,37,0.1);
  }
  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ink-muted);
  }
  .filter-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .filter-select {
    padding: 10px 16px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-pill);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    background: var(--surface);
    cursor: pointer;
    transition: var(--transition);
  }
  .filter-select:focus {
    outline: none;
    border-color: var(--green-500);
  }
  .add-btn {
    padding: 10px 24px;
    background: var(--grad);
    color: white;
    border: none;
    border-radius: var(--radius-pill);
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: var(--transition);
  }
  .add-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-pop);
  }
  .refresh-btn {
    padding: 10px 20px;
    background: var(--surface-2);
    color: var(--ink);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-pill);
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: var(--transition);
  }
  .refresh-btn:hover {
    background: var(--surface);
    transform: translateY(-2px);
  }

  .table-container {
    background: var(--surface);
    border-radius: var(--radius);
    border: 1.5px solid var(--border);
    overflow-x: auto;
    margin-bottom: 32px;
  }
  .souscription-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  .souscription-table th {
    text-align: left;
    padding: 16px 20px;
    background: var(--surface-2);
    font-weight: 700;
    color: var(--ink-soft);
    border-bottom: 1.5px solid var(--border);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .souscription-table td {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    color: var(--ink);
  }
  .souscription-table tr:hover {
    background: var(--green-50);
  }
  .souscription-table tr:last-child td {
    border-bottom: none;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: var(--radius-pill);
    font-size: 12px;
    font-weight: 600;
  }
  .status-badge.active {
    background: var(--green-100);
    color: var(--green-700);
  }
  .status-badge.en_attente {
    background: var(--yellow-bg);
    color: var(--yellow);
  }
  .status-badge.annulee {
    background: var(--red-bg);
    color: var(--red);
  }
  .status-badge.expiree {
    background: var(--border);
    color: var(--ink-muted);
  }

  .plan-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: var(--radius-pill);
    font-size: 12px;
    font-weight: 600;
  }
  .plan-badge.starter {
    background: #e0e7ff;
    color: #4338ca;
  }
  .plan-badge.pro {
    background: var(--green-100);
    color: var(--green-700);
  }
  .plan-badge.enterprise {
    background: #fef3c7;
    color: #d97706;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }
  .action-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
  }
  .action-btn.view {
    background: var(--blue-bg);
    color: var(--blue);
  }
  .action-btn.view:hover {
    background: var(--blue);
    color: white;
    transform: scale(1.1);
  }
  .action-btn.edit {
    background: var(--yellow-bg);
    color: var(--yellow);
  }
  .action-btn.edit:hover {
    background: var(--yellow);
    color: white;
    transform: scale(1.1);
  }
  .action-btn.delete {
    background: var(--red-bg);
    color: var(--red);
  }
  .action-btn.delete:hover {
    background: var(--red);
    color: white;
    transform: scale(1.1);
  }
  .action-btn.print {
    background: var(--green-100);
    color: var(--green-700);
  }
  .action-btn.print:hover {
    background: var(--green-700);
    color: white;
    transform: scale(1.1);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 32px;
  }
  .page-btn {
    padding: 8px 16px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-pill);
    background: var(--surface);
    cursor: pointer;
    font-weight: 500;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .page-btn:hover:not(:disabled) {
    border-color: var(--green-500);
    background: var(--green-50);
  }
  .page-btn.active {
    background: var(--grad);
    color: white;
    border-color: transparent;
  }
  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .page-info {
    font-size: 14px;
    color: var(--ink-muted);
  }

  /* Modal Styles */
  .ps-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(13,17,23,0.7);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: fadeIn 0.2s ease;
  }
  .ps-modal {
    background: var(--surface);
    border-radius: var(--radius);
    width: 100%;
    max-width: 780px;
    max-height: 92vh;
    overflow-y: auto;
    box-shadow: var(--shadow-xl);
    animation: slideUp 0.35s var(--bounce);
  }
  .ps-modal-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 32px 36px 24px;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    background: var(--surface);
    border-radius: var(--radius) var(--radius) 0 0;
  }
  .ps-modal-eyebrow {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--green-700);
    display: block;
    margin-bottom: 10px;
  }
  .ps-modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: var(--ink);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ps-modal-title span {
    background: var(--grad);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .ps-close-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: var(--surface-2);
    cursor: pointer;
    font-size: 18px;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ps-close-btn:hover {
    background: var(--red-bg);
    color: var(--red);
    transform: rotate(90deg);
  }
  .ps-form {
    padding: 28px 36px 36px;
  }
  .ps-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  .ps-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .ps-field label {
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--ink-soft);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .ps-input, .ps-select {
    padding: 13px 16px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    transition: var(--transition);
  }
  .ps-input:focus, .ps-select:focus {
    outline: none;
    border-color: var(--green-500);
    box-shadow: 0 0 0 3px rgba(5,111,37,0.1);
  }
  .ps-submit {
    width: 100%;
    padding: 17px 28px;
    border: none;
    border-radius: var(--radius-pill);
    background: var(--grad);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .ps-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-pop);
  }
  .ps-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .delete-warning {
    background: var(--red-bg);
    color: var(--red);
    padding: 16px;
    border-radius: var(--radius-sm);
    margin-bottom: 24px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }
  .btn-cancel {
    flex: 1;
    padding: 14px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-pill);
    background: var(--surface);
    cursor: pointer;
    font-weight: 600;
  }
  .btn-cancel:hover {
    background: var(--surface-2);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to { opacity: 1; transform: none; }
  }

  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media (max-width: 768px) {
    .dashboard-wrap { padding: 80px 16px 60px; margin-left: 0; }
    .filters-bar { flex-direction: column; align-items: stretch; }
    .ps-form-grid { grid-template-columns: 1fr; }
    .ps-modal-head { padding: 24px; flex-direction: column; gap: 14px; }
    .ps-form { padding: 20px 24px 28px; }
    .souscription-table th, .souscription-table td { padding: 12px 16px; }
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const API_BASE_URL = "https://backend-foot-omega.vercel.app/api/souscription";

export default function SouscriptionDashboard() {
  const [souscriptions, setSouscriptions] = useState([]);
  const [filteredSouscriptions, setFilteredSouscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedSouscription, setSelectedSouscription] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    plan: "starter",
    type_facturation: "mensuel",
    prix_paye: "",
    mode_paiement: "Carte",
    date_debut: "",
    date_fin: "",
    statut: "en_attente"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    actives: 0,
    en_attente: 0,
    annulees: 0,
    expirees: 0,
    taux_activation: 0
  });

  const itemsPerPage = 10;

  // Récupérer toutes les souscriptions
  const fetchSouscriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();
      if (data.success) {
        setSouscriptions(data.data);
        applyFilters(data.data);
        calculateLocalStats(data.data);
      }
    } catch (error) {
      console.error("Erreur fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les stats localement
  const calculateLocalStats = (data) => {
    const total = data.length;
    const actives = data.filter(s => s.statut === 'active').length;
    const en_attente = data.filter(s => s.statut === 'en_attente').length;
    const annulees = data.filter(s => s.statut === 'annulee').length;
    const expirees = data.filter(s => s.statut === 'expiree').length;
    
    setStats({
      total,
      actives,
      en_attente,
      annulees,
      expirees,
      taux_activation: total > 0 ? (actives / total) * 100 : 0
    });
  };

  // Récupérer les statistiques depuis l'API dashboard
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`);
      const data = await response.json();
      if (data.success) {
        setStats({
          total: data.data.synthese.total_souscriptions || 0,
          actives: data.data.synthese.actives || 0,
          en_attente: data.data.synthese.en_attente || 0,
          annulees: data.data.synthese.annulees || 0,
          expirees: data.data.synthese.expirees || 0,
          taux_activation: data.data.synthese.taux_activation || 0
        });
      }
    } catch (error) {
      console.error("Erreur stats:", error);
      if (souscriptions.length > 0) {
        calculateLocalStats(souscriptions);
      }
    }
  };

  const applyFilters = (data) => {
    let filtered = [...data];
    
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.statut === statusFilter);
    }
    
    if (planFilter !== "all") {
      filtered = filtered.filter(s => s.plan === planFilter);
    }
    
    setFilteredSouscriptions(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchSouscriptions();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters(souscriptions);
  }, [searchTerm, statusFilter, planFilter, souscriptions]);

  const totalPages = Math.ceil(filteredSouscriptions.length / itemsPerPage);
  const paginatedData = filteredSouscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPlanLabel = (plan) => {
    switch(plan) {
      case 'starter': return 'Starter';
      case 'pro': return 'Pro';
      case 'enterprise': return 'Enterprise';
      default: return 'Starter';
    }
  };

  const getPlanBadgeClass = (plan) => {
    switch(plan) {
      case 'starter': return 'starter';
      case 'pro': return 'pro';
      case 'enterprise': return 'enterprise';
      default: return 'starter';
    }
  };

  const getStatusBadgeClass = (statut) => {
    switch(statut) {
      case 'active': return 'active';
      case 'en_attente': return 'en_attente';
      case 'annulee': return 'annulee';
      case 'expiree': return 'expiree';
      default: return 'en_attente';
    }
  };

  const getStatusLabel = (statut) => {
    switch(statut) {
      case 'active': return 'Active';
      case 'en_attente': return 'En attente';
      case 'annulee': return 'Annulée';
      case 'expiree': return 'Expirée';
      default: return 'En attente';
    }
  };

  const handleAdd = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      plan: "starter",
      type_facturation: "mensuel",
      prix_paye: "",
      mode_paiement: "Carte",
      date_debut: "",
      date_fin: "",
      statut: "en_attente"
    });
    setModalMode("add");
    setShowModal(true);
  };

  const handleView = (souscription) => {
    setSelectedSouscription(souscription);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEdit = (souscription) => {
    setSelectedSouscription(souscription);
    setFormData({
      nom: souscription.nom,
      prenom: souscription.prenom,
      email: souscription.email,
      telephone: souscription.telephone,
      plan: souscription.plan,
      type_facturation: souscription.type_facturation,
      prix_paye: souscription.prix_paye,
      mode_paiement: souscription.mode_paiement,
      date_debut: souscription.date_debut?.split('T')[0] || '',
      date_fin: souscription.date_fin?.split('T')[0] || '',
      statut: souscription.statut
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDeleteConfirm = (souscription) => {
    setSelectedSouscription(souscription);
    setModalMode("delete");
    setShowModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        await fetchSouscriptions();
        await fetchStats();
        setShowModal(false);
      } else {
        alert(data.message || "Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${selectedSouscription.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        await fetchSouscriptions();
        await fetchStats();
        setShowModal(false);
      } else {
        alert(data.message || "Erreur lors de la modification");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${selectedSouscription.id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (data.success) {
        await fetchSouscriptions();
        await fetchStats();
        setShowModal(false);
      } else {
        alert(data.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/statut`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        await fetchSouscriptions();
        await fetchStats();
      } else {
        alert(data.message || "Erreur lors du changement de statut");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion au serveur");
    }
  };

  const handlePrintInvoice = (souscription) => {
    const printWindow = window.open('', '_blank');
    const totalAmount = souscription.type_facturation === 'annuel' 
      ? souscription.prix_paye * 12 
      : souscription.prix_paye;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Facture #${souscription.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'DM Sans', sans-serif;
            background: white;
            padding: 40px;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #056f25;
          }
          .invoice-title {
            font-family: 'Syne', sans-serif;
            font-size: 32px;
            font-weight: 800;
            color: #056f25;
            margin-bottom: 10px;
          }
          .invoice-subtitle {
            color: #6b7280;
            font-size: 14px;
          }
          .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 20px;
            background: #f9fafb;
            border-radius: 14px;
          }
          .invoice-info-box h4 {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .invoice-info-box p {
            font-size: 14px;
            font-weight: 600;
            color: #0d1117;
          }
          .invoice-details {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .invoice-details th {
            background: #f9fafb;
            padding: 12px;
            text-align: left;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e5e7eb;
          }
          .invoice-details td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          .invoice-total {
            text-align: right;
            padding: 20px;
            background: #f9fafb;
            border-radius: 14px;
            margin-top: 20px;
          }
          .invoice-total p {
            font-size: 20px;
            font-weight: 800;
            color: #056f25;
          }
          .invoice-footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 11px;
            color: #6b7280;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
          }
          .status-active { background: #d1fae5; color: #056f25; }
          .status-en_attente { background: #fef3c7; color: #f59e0b; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="invoice-title">FACTURE</div>
            <div class="invoice-subtitle">Facture d'abonnement</div>
          </div>
          
          <div class="invoice-info">
            <div class="invoice-info-box">
              <h4>Facturé à</h4>
              <p>${souscription.prenom} ${souscription.nom}</p>
              <p>${souscription.email}</p>
              <p>${souscription.telephone}</p>
            </div>
            <div class="invoice-info-box">
              <h4>Détails facture</h4>
              <p>N° Facture: #${souscription.id}</p>
              <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
              <p>Status: <span class="status-badge status-${souscription.statut}">${getStatusLabel(souscription.statut)}</span></p>
            </div>
          </div>
          
          <table class="invoice-details">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Abonnement ${getPlanLabel(souscription.plan)} - ${souscription.type_facturation === 'annuel' ? 'Annuel' : 'Mensuel'}</td>
                <td>1</td>
                <td>${souscription.prix_paye}€</td>
                <td>${souscription.type_facturation === 'annuel' ? souscription.prix_paye * 12 : souscription.prix_paye}€</td>
              </tr>
            </tbody>
          </table>
          
          <div class="invoice-total">
            <p>Total TTC: ${souscription.type_facturation === 'annuel' ? souscription.prix_paye * 12 : souscription.prix_paye}€</p>
            <small>${souscription.type_facturation === 'annuel' ? 'Facturation annuelle' : 'Facturation mensuelle'}</small>
          </div>
          
          <div class="invoice-footer">
            <p>Période: ${new Date(souscription.date_debut).toLocaleDateString('fr-FR')} - ${new Date(souscription.date_fin).toLocaleDateString('fr-FR')}</p>
            <p>Mode de paiement: ${souscription.mode_paiement}</p>
            <p>Merci de votre confiance !</p>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <style>{styles}</style>

      <div className="dashboard-wrap">
        <div className="dashboard-blob dashboard-blob-1" />
        <div className="dashboard-blob dashboard-blob-2" />

        <div className="dashboard-inner">
          <div className="dashboard-head">
            <div className="dashboard-eyebrow">Administration</div>
            <h1>Gestion des <em>souscriptions</em></h1>
            <p>Visualisez, modifiez et gérez toutes les souscriptions clients</p>
          </div>

          {/* Statistiques - 3 cartes */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><Users size={28} /></div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total souscriptions</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><CheckCircle size={28} /></div>
              <div className="stat-value">{stats.actives}</div>
              <div className="stat-label">Actives</div>
              <div className="stat-trend up">
                <TrendingUp size={12} /> 
                {stats.total > 0 ? `${Math.round((stats.actives / stats.total) * 100)}% du total` : '0% du total'}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Clock size={28} /></div>
              <div className="stat-value">{stats.en_attente}</div>
              <div className="stat-label">En attente</div>
            </div>
          </div>

          {/* Filtres */}
          <div className="filters-bar">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="active">Actives</option>
                <option value="en_attente">En attente</option>
                <option value="annulee">Annulées</option>
                <option value="expiree">Expirées</option>
              </select>
              <select className="filter-select" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
                <option value="all">Tous les plans</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <button className="add-btn" onClick={handleAdd}>
                <Plus size={16} /> Ajouter
              </button>
              <button className="refresh-btn" onClick={() => { fetchSouscriptions(); fetchStats(); }}>
                <RefreshCw size={14} /> Actualiser
              </button>
            </div>
          </div>

          {/* Tableau */}
          <div className="table-container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>Chargement des données...</div>
            ) : filteredSouscriptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ink-muted)' }}>
                Aucune souscription trouvée
              </div>
            ) : (
              <table className="souscription-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Facturation</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Date début</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.id}</td>
                      <td><strong>{sub.prenom} {sub.nom}</strong></td>
                      <td>{sub.email}</td>
                      <td>
                        <span className={`plan-badge ${getPlanBadgeClass(sub.plan)}`}>
                          {getPlanLabel(sub.plan)}
                        </span>
                      </td>
                      <td>{sub.type_facturation === 'mensuel' ? 'Mensuel' : 'Annuel'}</td>
                      <td>{sub.prix_paye}€</td>
                      <td>
                        <select
                          className={`status-badge ${getStatusBadgeClass(sub.statut)}`}
                          value={sub.statut}
                          onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                          style={{ cursor: 'pointer', border: 'none' }}
                        >
                          <option value="en_attente">En attente</option>
                          <option value="active">Active</option>
                          <option value="annulee">Annulée</option>
                          <option value="expiree">Expirée</option>
                        </select>
                      </td>
                      <td>{new Date(sub.date_debut).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view" onClick={() => handleView(sub)} title="Voir">
                            <Eye size={14} />
                          </button>
                          <button className="action-btn print" onClick={() => handlePrintInvoice(sub)} title="Imprimer facture">
                            <Printer size={14} />
                          </button>
                          <button className="action-btn edit" onClick={() => handleEdit(sub)} title="Modifier">
                            <Edit size={14} />
                          </button>
                          <button className="action-btn delete" onClick={() => handleDeleteConfirm(sub)} title="Supprimer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft size={14} /> Précédent
              </button>
              <span className="page-info">Page {currentPage} sur {totalPages}</span>
              <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                Suivant <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Vue */}
      {showModal && modalMode === "view" && selectedSouscription && (
        <div className="ps-overlay" onClick={() => setShowModal(false)}>
          <div className="ps-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ps-modal-head">
              <div>
                <span className="ps-modal-eyebrow">Détails</span>
                <h2 className="ps-modal-title">
                  Souscription <span>#{selectedSouscription.id}</span>
                </h2>
              </div>
              <button className="ps-close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="ps-form">
              <div className="ps-form-grid">
                <div className="ps-field"><label><User size={12} /> Nom</label><input className="ps-input" value={selectedSouscription.nom} readOnly /></div>
                <div className="ps-field"><label><User size={12} /> Prénom</label><input className="ps-input" value={selectedSouscription.prenom} readOnly /></div>
                <div className="ps-field"><label><Mail size={12} /> Email</label><input className="ps-input" value={selectedSouscription.email} readOnly /></div>
                <div className="ps-field"><label><Phone size={12} /> Téléphone</label><input className="ps-input" value={selectedSouscription.telephone} readOnly /></div>
                <div className="ps-field"><label><Building2 size={12} /> Plan</label><input className="ps-input" value={getPlanLabel(selectedSouscription.plan)} readOnly /></div>
                <div className="ps-field"><label><CalendarDays size={12} /> Facturation</label><input className="ps-input" value={selectedSouscription.type_facturation === 'mensuel' ? 'Mensuel' : 'Annuel'} readOnly /></div>
                <div className="ps-field"><label><DollarSign size={12} /> Prix</label><input className="ps-input" value={`${selectedSouscription.prix_paye}€`} readOnly /></div>
                <div className="ps-field"><label><CreditCard size={12} /> Paiement</label><input className="ps-input" value={selectedSouscription.mode_paiement} readOnly /></div>
                <div className="ps-field"><label><Calendar size={12} /> Date début</label><input className="ps-input" value={new Date(selectedSouscription.date_debut).toLocaleDateString('fr-FR')} readOnly /></div>
                <div className="ps-field"><label><Calendar size={12} /> Date fin</label><input className="ps-input" value={new Date(selectedSouscription.date_fin).toLocaleDateString('fr-FR')} readOnly /></div>
                <div className="ps-field"><label><BadgeCheck size={12} /> Statut</label>
                  <span className={`status-badge ${getStatusBadgeClass(selectedSouscription.statut)}`} style={{ display: 'inline-block', width: 'fit-content' }}>
                    {getStatusLabel(selectedSouscription.statut)}
                  </span>
                </div>
              </div>
              <div className="form-actions">
                <button className="action-btn print" onClick={() => handlePrintInvoice(selectedSouscription)} style={{ width: 'auto', padding: '12px 24px', borderRadius: '999px', gap: '8px', background: 'var(--green-100)', color: 'var(--green-700)' }}>
                  <Printer size={16} /> Imprimer la facture
                </button>
                <button className="ps-submit" onClick={() => setShowModal(false)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajout */}
      {showModal && modalMode === "add" && (
        <div className="ps-overlay" onClick={() => setShowModal(false)}>
          <div className="ps-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ps-modal-head">
              <div>
                <span className="ps-modal-eyebrow">Nouvelle souscription</span>
                <h2 className="ps-modal-title">
                  <Plus size={24} /> Ajouter une <span>souscription</span>
                </h2>
              </div>
              <button className="ps-close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="ps-form" onSubmit={handleAddSubmit}>
              <div className="ps-form-grid">
                <div className="ps-field"><label><User size={12} /> Nom *</label><input className="ps-input" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} required /></div>
                <div className="ps-field"><label><User size={12} /> Prénom *</label><input className="ps-input" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} required /></div>
                <div className="ps-field"><label><Mail size={12} /> Email *</label><input className="ps-input" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
                <div className="ps-field"><label><Phone size={12} /> Téléphone *</label><input className="ps-input" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} required /></div>
                <div className="ps-field">
                  <label><Building2 size={12} /> Plan</label>
                  <select className="ps-select" value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})}>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="ps-field">
                  <label><CalendarDays size={12} /> Facturation</label>
                  <select className="ps-select" value={formData.type_facturation} onChange={(e) => setFormData({...formData, type_facturation: e.target.value})}>
                    <option value="mensuel">Mensuel</option>
                    <option value="annuel">Annuel</option>
                  </select>
                </div>
                <div className="ps-field"><label><DollarSign size={12} /> Prix (€)</label><input className="ps-input" type="number" value={formData.prix_paye} onChange={(e) => setFormData({...formData, prix_paye: parseFloat(e.target.value)})} required /></div>
                <div className="ps-field">
                  <label><CreditCard size={12} /> Paiement</label>
                  <select className="ps-select" value={formData.mode_paiement} onChange={(e) => setFormData({...formData, mode_paiement: e.target.value})}>
                    <option value="Carte">Carte Bancaire</option>
                    <option value="Especes">Espèces</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Virement">Virement Bancaire</option>
                  </select>
                </div>
                <div className="ps-field"><label><Calendar size={12} /> Date début</label><input className="ps-input" type="date" value={formData.date_debut} onChange={(e) => setFormData({...formData, date_debut: e.target.value})} required /></div>
                <div className="ps-field"><label><Calendar size={12} /> Date fin</label><input className="ps-input" type="date" value={formData.date_fin} onChange={(e) => setFormData({...formData, date_fin: e.target.value})} required /></div>
                <div className="ps-field">
                  <label><BadgeCheck size={12} /> Statut</label>
                  <select className="ps-select" value={formData.statut} onChange={(e) => setFormData({...formData, statut: e.target.value})}>
                    <option value="en_attente">En attente</option>
                    <option value="active">Active</option>
                    <option value="annulee">Annulée</option>
                    <option value="expiree">Expirée</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="ps-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modification */}
      {showModal && modalMode === "edit" && selectedSouscription && (
        <div className="ps-overlay" onClick={() => setShowModal(false)}>
          <div className="ps-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ps-modal-head">
              <div>
                <span className="ps-modal-eyebrow">Modification</span>
                <h2 className="ps-modal-title">
                  Modifier la <span>souscription</span>
                </h2>
              </div>
              <button className="ps-close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="ps-form" onSubmit={handleUpdate}>
              <div className="ps-form-grid">
                <div className="ps-field"><label><User size={12} /> Nom *</label><input className="ps-input" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} required /></div>
                <div className="ps-field"><label><User size={12} /> Prénom *</label><input className="ps-input" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} required /></div>
                <div className="ps-field"><label><Mail size={12} /> Email *</label><input className="ps-input" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
                <div className="ps-field"><label><Phone size={12} /> Téléphone *</label><input className="ps-input" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} required /></div>
                <div className="ps-field">
                  <label><Building2 size={12} /> Plan</label>
                  <select className="ps-select" value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})}>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="ps-field">
                  <label><CalendarDays size={12} /> Facturation</label>
                  <select className="ps-select" value={formData.type_facturation} onChange={(e) => setFormData({...formData, type_facturation: e.target.value})}>
                    <option value="mensuel">Mensuel</option>
                    <option value="annuel">Annuel</option>
                  </select>
                </div>
                <div className="ps-field"><label><DollarSign size={12} /> Prix (€)</label><input className="ps-input" type="number" value={formData.prix_paye} onChange={(e) => setFormData({...formData, prix_paye: parseFloat(e.target.value)})} required /></div>
                <div className="ps-field">
                  <label><CreditCard size={12} /> Paiement</label>
                  <select className="ps-select" value={formData.mode_paiement} onChange={(e) => setFormData({...formData, mode_paiement: e.target.value})}>
                    <option value="Carte">Carte Bancaire</option>
                    <option value="Especes">Espèces</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Virement">Virement Bancaire</option>
                  </select>
                </div>
                <div className="ps-field"><label><Calendar size={12} /> Date début</label><input className="ps-input" type="date" value={formData.date_debut} onChange={(e) => setFormData({...formData, date_debut: e.target.value})} required /></div>
                <div className="ps-field"><label><Calendar size={12} /> Date fin</label><input className="ps-input" type="date" value={formData.date_fin} onChange={(e) => setFormData({...formData, date_fin: e.target.value})} required /></div>
                <div className="ps-field">
                  <label><BadgeCheck size={12} /> Statut</label>
                  <select className="ps-select" value={formData.statut} onChange={(e) => setFormData({...formData, statut: e.target.value})}>
                    <option value="en_attente">En attente</option>
                    <option value="active">Active</option>
                    <option value="annulee">Annulée</option>
                    <option value="expiree">Expirée</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="ps-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showModal && modalMode === "delete" && selectedSouscription && (
        <div className="ps-overlay" onClick={() => setShowModal(false)}>
          <div className="ps-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ps-modal-head">
              <div>
                <span className="ps-modal-eyebrow">Confirmation</span>
                <h2 className="ps-modal-title">
                  Confirmer la <span>suppression</span>
                </h2>
              </div>
              <button className="ps-close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="ps-form">
              <div className="delete-warning">
                <AlertCircle size={20} /> Attention : Cette action est irréversible !
              </div>
              <p style={{ marginBottom: '24px', textAlign: 'center' }}>
                Êtes-vous sûr de vouloir supprimer la souscription de <strong>{selectedSouscription.prenom} {selectedSouscription.nom}</strong> ?
              </p>
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
                <button className="ps-submit" onClick={handleDelete} disabled={isSubmitting} style={{ background: 'var(--red)' }}>
                  {isSubmitting ? 'Suppression...' : 'Confirmer la suppression'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}