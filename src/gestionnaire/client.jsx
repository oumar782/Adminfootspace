import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  UserPlus,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Calendar,
  Printer,
  Tag,
  DollarSign,
  CreditCard,
  Hash,
  Award,
  Star,
  Crown,
  Sparkles,
  LayoutGrid,
  List,
  Download,
  FileText,
  Bell,
  HelpCircle,
  MoreVertical,
  Settings,
  Info,
  AlertTriangle
} from 'lucide-react';
import './client.css';

const GestionAbonnes = () => {
  // ===== ÉTATS =====
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortConfig, setSortConfig] = useState({ field: 'nom', direction: 'asc' });
  
  const [modalState, setModalState] = useState({ 
    add: false, 
    view: false, 
    edit: false, 
    delete: false 
  });
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState(null);

  // Formulaire avec heure_fin
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    statut: 'actif',
    type_abonnement: '',
    prix_total: '',
    date_debut: '',
    date_fin: '',
    mode_paiement: '',
    heure_reservation: '',
    heure_fin: ''
  });

  const ITEMS_PER_PAGE = 12;
  const API_URL = 'https://backend-foot-omega.vercel.app/api/clients';

  // ===== CHARGEMENT DES DONNÉES =====
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data || []);
        setFilteredData(result.data || []);
        showNotification('Données chargées avec succès', 'success');
      } else {
        showNotification(result.message || 'Erreur de chargement', 'error');
      }
    } catch (err) {
      console.error('Erreur fetch:', err);
      showNotification('Erreur de connexion au serveur', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  // ===== FILTRES ET TRI =====
  useEffect(() => {
    let result = [...data];
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      result = result.filter(item => item.statut === statusFilter);
    }
    
    // Recherche textuelle
    if (searchTerm) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(item => 
        item.nom?.toLowerCase().includes(query) ||
        item.prenom?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.telephone?.includes(query) ||
        (item.type_abonnement && item.type_abonnement.toLowerCase().includes(query)) ||
        item.idclient?.toString().includes(query) ||
        (item.heure_reservation && item.heure_reservation.includes(query)) ||
        (item.heure_fin && item.heure_fin.includes(query))
      );
    }
    
    // Tri
    result.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];
      
      if (sortConfig.field === 'prix_total') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (sortConfig.field === 'heure_reservation' || sortConfig.field === 'heure_fin') {
        aValue = aValue || '00:00';
        bValue = bValue || '00:00';
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredData(result);
    setCurrentPage(1);
  }, [data, statusFilter, searchTerm, sortConfig]);

  // ===== PAGINATION =====
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1);
  }, [filteredData]);

  // ===== NOTIFICATIONS =====
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ===== GESTION FORMULAIRE =====
  const resetForm = () => {
    setFormData({
      nom: '', prenom: '', email: '', telephone: '', statut: 'actif',
      type_abonnement: '', prix_total: '', date_debut: '', date_fin: '',
      mode_paiement: '', heure_reservation: '', heure_fin: ''
    });
    setSelectedItem(null);
  };

  // ===== MODALES =====
  const openModal = (type, item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        nom: item.nom || '',
        prenom: item.prenom || '',
        email: item.email || '',
        telephone: item.telephone || '',
        statut: item.statut || 'actif',
        type_abonnement: item.type_abonnement || '',
        prix_total: item.prix_total || '',
        date_debut: item.date_debut || '',
        date_fin: item.date_fin || '',
        mode_paiement: item.mode_paiement || '',
        heure_reservation: item.heure_reservation || '',
        heure_fin: item.heure_fin || ''
      });
    }
    setModalState({ ...modalState, [type]: true });
  };

  const closeModal = (type) => {
    setModalState({ ...modalState, [type]: false });
    resetForm();
  };

  // ===== VALIDATION DES HEURES =====
  const validateHeures = (debut, fin) => {
    if (!debut || !fin) return true;
    
    // Convertir en objets Date pour la comparaison
    const debutDate = new Date(`1970-01-01T${debut}`);
    const finDate = new Date(`1970-01-01T${fin}`);
    
    if (debutDate >= finDate) {
      showNotification("L'heure de fin doit être postérieure à l'heure de début", 'error');
      return false;
    }
    
    return true;
  };

  // ===== PRÉPARATION DES DONNÉES POUR L'API =====
  const prepareDataForApi = () => {
    const dataToSend = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      statut: formData.statut || 'actif',
      type_abonnement: formData.type_abonnement || null,
      prix_total: formData.prix_total ? parseFloat(formData.prix_total) : null,
      date_debut: formData.date_debut || null,
      date_fin: formData.date_fin || null,
      mode_paiement: formData.mode_paiement || null,
      heure_reservation: formData.heure_reservation || null,
      heure_fin: formData.heure_fin || null
    };

    // Log pour debug
    console.log('Données envoyées à l\'API:', dataToSend);
    
    return dataToSend;
  };

  // ===== CRUD =====
  const handleAdd = async () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
      showNotification('Nom, prénom, email et téléphone sont obligatoires', 'error');
      return;
    }

    // Validation des heures
    if (!validateHeures(formData.heure_reservation, formData.heure_fin)) {
      return;
    }

    const dataToSend = prepareDataForApi();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification('Abonné ajouté avec succès', 'success');
        closeModal('add');
        fetchData();
      } else {
        showNotification(result.message || 'Erreur lors de l\'ajout', 'error');
      }
    } catch (err) {
      console.error('Erreur ajout:', err);
      showNotification('Erreur de connexion au serveur', 'error');
    }
  };

  const handleEdit = async () => {
    if (!selectedItem || !selectedItem.idclient) {
      showNotification('Erreur: ID client manquant', 'error');
      return;
    }

    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
      showNotification('Nom, prénom, email et téléphone sont obligatoires', 'error');
      return;
    }

    // Validation des heures
    if (!validateHeures(formData.heure_reservation, formData.heure_fin)) {
      return;
    }

    const dataToSend = prepareDataForApi();

    try {
      const response = await fetch(`${API_URL}/${selectedItem.idclient}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification('Abonné modifié avec succès', 'success');
        closeModal('edit');
        fetchData();
      } else {
        showNotification(result.message || 'Erreur lors de la modification', 'error');
      }
    } catch (err) {
      console.error('Erreur modification:', err);
      showNotification('Erreur de connexion au serveur', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedItem || !selectedItem.idclient) {
      showNotification('Erreur: ID client manquant', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${selectedItem.idclient}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification('Abonné supprimé avec succès', 'success');
        closeModal('delete');
        fetchData();
      } else {
        showNotification(result.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (err) {
      console.error('Erreur suppression:', err);
      showNotification('Erreur de connexion au serveur', 'error');
    }
  };

  // ===== IMPRESSION PDF =====
  const handlePrint = () => {
    if (!selectedItem) return;
    
    const statusClass = selectedItem.statut === 'actif' ? 'actif' : 
                        selectedItem.statut === 'inactif' ? 'inactif' : 
                        selectedItem.statut === 'en attente' ? 'en-attente' : 'expire';
    
    const statusText = selectedItem.statut === 'actif' ? 'Actif' : 
                       selectedItem.statut === 'inactif' ? 'Inactif' : 
                       selectedItem.statut === 'en attente' ? 'En attente' : 'Expiré';
    
    const heureReservation = selectedItem.heure_reservation || '-';
    const heureFin = selectedItem.heure_fin || '-';
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Fiche Abonné - ${selectedItem.nom} ${selectedItem.prenom}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: linear-gradient(135deg, #f6f9fc 0%, #e9f2f9 100%);
              min-height: 100vh;
              padding: 40px 20px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .print-card {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 32px;
              box-shadow: 0 30px 60px rgba(0, 40, 20, 0.3);
              overflow: hidden;
              position: relative;
            }
            .print-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 8px;
              background: linear-gradient(90deg, #015502, #023a03, #015502);
            }
            .print-header {
              background: linear-gradient(135deg, #015502 0%, #023a03 100%);
              color: white;
              padding: 40px;
              position: relative;
              overflow: hidden;
            }
            .print-header::after {
              content: '';
              position: absolute;
              top: -50%;
              right: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
              animation: rotate 20s linear infinite;
            }
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .print-header h1 {
              font-size: 36px;
              font-weight: 800;
              margin-bottom: 10px;
              letter-spacing: -1px;
              position: relative;
              z-index: 1;
            }
            .print-subtitle {
              font-size: 16px;
              opacity: 0.9;
              position: relative;
              z-index: 1;
            }
            .print-id {
              position: absolute;
              top: 30px;
              right: 40px;
              background: rgba(255,255,255,0.2);
              backdrop-filter: blur(10px);
              padding: 12px 24px;
              border-radius: 50px;
              font-size: 18px;
              font-weight: 600;
              border: 1px solid rgba(255,255,255,0.3);
              z-index: 1;
            }
            .print-content {
              padding: 40px;
            }
            .print-profile {
              display: flex;
              align-items: center;
              gap: 40px;
              margin-bottom: 40px;
              padding: 30px;
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              border-radius: 24px;
            }
            .print-avatar {
              width: 120px;
              height: 120px;
              background: linear-gradient(135deg, #015502, #023a03);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 48px;
              font-weight: 700;
              color: white;
              border: 6px solid white;
              box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            }
            .print-profile-info h2 {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 15px;
              color: #1e293b;
            }
            .print-status {
              display: inline-block;
              padding: 10px 24px;
              border-radius: 50px;
              font-weight: 600;
              font-size: 15px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .print-status.actif {
              background: rgba(16, 185, 129, 0.15);
              color: #059669;
              border: 1px solid rgba(16, 185, 129, 0.3);
            }
            .print-status.inactif {
              background: rgba(239, 68, 68, 0.15);
              color: #dc2626;
              border: 1px solid rgba(239, 68, 68, 0.3);
            }
            .print-status.en-attente {
              background: rgba(245, 158, 11, 0.15);
              color: #d97706;
              border: 1px solid rgba(245, 158, 11, 0.3);
            }
            .print-status.expire {
              background: rgba(100, 116, 139, 0.15);
              color: #475569;
              border: 1px solid rgba(100, 116, 139, 0.3);
            }
            .print-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 24px;
            }
            .print-info-card {
              background: white;
              border-radius: 20px;
              padding: 24px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.05);
              border: 1px solid #e2e8f0;
            }
            .print-info-card h3 {
              font-size: 18px;
              color: #015502;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid #e2e8f0;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .print-info-row {
              display: flex;
              margin-bottom: 15px;
              padding-bottom: 15px;
              border-bottom: 1px dashed #e2e8f0;
            }
            .print-info-row:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .print-label {
              width: 130px;
              font-size: 14px;
              font-weight: 600;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .print-value {
              flex: 1;
              font-size: 16px;
              font-weight: 500;
              color: #1e293b;
            }
            .print-value.price {
              color: #015502;
              font-weight: 700;
              font-size: 18px;
            }
            .print-footer {
              text-align: center;
              padding: 25px 40px;
              background: #f8fafc;
              border-top: 2px solid #e2e8f0;
              font-size: 14px;
              color: #94a3b8;
            }
            .heure-row {
              display: flex;
              gap: 20px;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 1px dashed #e2e8f0;
            }
            .heure-item {
              flex: 1;
              text-align: center;
              background: #f8fafc;
              padding: 10px;
              border-radius: 12px;
            }
            .heure-item .label {
              font-size: 12px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
            }
            .heure-item .value {
              font-size: 18px;
              font-weight: 700;
              color: #015502;
            }
            @media print {
              body { background: white; padding: 0; }
              .print-card { box-shadow: none; border: 1px solid #ddd; }
            }
          </style>
        </head>
        <body>
          <div class="print-card">
            <div class="print-header">
              <h1>FICHE ABONNÉ</h1>
              <div class="print-subtitle">Document officiel d'abonnement</div>
              <div class="print-id">#${selectedItem.idclient}</div>
            </div>
            
            <div class="print-content">
              <div class="print-profile">
                <div class="print-avatar">
                  ${selectedItem.nom?.[0]}${selectedItem.prenom?.[0]}
                </div>
                <div class="print-profile-info">
                  <h2>${selectedItem.nom} ${selectedItem.prenom}</h2>
                  <span class="print-status ${statusClass}">${statusText}</span>
                </div>
              </div>

              <div class="print-grid">
                <div class="print-info-card">
                  <h3>📧 Coordonnées</h3>
                  <div class="print-info-row">
                    <span class="print-label">Email</span>
                    <span class="print-value">${selectedItem.email || '-'}</span>
                  </div>
                  <div class="print-info-row">
                    <span class="print-label">Téléphone</span>
                    <span class="print-value">${selectedItem.telephone || '-'}</span>
                  </div>
                </div>

                <div class="print-info-card">
                  <h3>📦 Abonnement</h3>
                  <div class="print-info-row">
                    <span class="print-label">Type</span>
                    <span class="print-value">${selectedItem.type_abonnement || '-'}</span>
                  </div>
                  <div class="print-info-row">
                    <span class="print-label">Prix</span>
                    <span class="print-value price">${selectedItem.prix_total ? selectedItem.prix_total + ' DH' : '-'}</span>
                  </div>
                </div>

                <div class="print-info-card">
                  <h3>📅 Période</h3>
                  <div class="print-info-row">
                    <span class="print-label">Début</span>
                    <span class="print-value">${selectedItem.date_debut ? new Date(selectedItem.date_debut).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}</span>
                  </div>
                  <div class="print-info-row">
                    <span class="print-label">Fin</span>
                    <span class="print-value">${selectedItem.date_fin ? new Date(selectedItem.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}</span>
                  </div>
                </div>

                <div class="print-info-card">
                  <h3>💰 Paiement</h3>
                  <div class="print-info-row">
                    <span class="print-label">Mode</span>
                    <span class="print-value">${selectedItem.mode_paiement || '-'}</span>
                  </div>
                </div>
              </div>

              ${heureReservation !== '-' || heureFin !== '-' ? `
              <div class="print-info-card" style="margin-top: 24px;">
                <h3>⏰ Horaires de réservation</h3>
                <div class="heure-row">
                  <div class="heure-item">
                    <div class="label">Début</div>
                    <div class="value">${heureReservation}</div>
                  </div>
                  <div class="heure-item">
                    <div class="label">Fin</div>
                    <div class="value">${heureFin}</div>
                  </div>
                </div>
              </div>
              ` : ''}
            </div>

            <div class="print-footer">
              <p>Document généré le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <p style="margin-top: 5px; font-size: 12px;">Ce document fait office de justificatif d'abonnement</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // ===== UTILITAIRES =====
  const getStatusBadge = (statut) => {
    switch(statut) {
      case 'actif': 
        return { icon: <CheckCircle size={14} />, text: 'Actif', class: 'ga2-badge-active' };
      case 'inactif': 
        return { icon: <XCircle size={14} />, text: 'Inactif', class: 'ga2-badge-inactive' };
      case 'en attente': 
        return { icon: <Clock size={14} />, text: 'En attente', class: 'ga2-badge-pending' };
      case 'expire':
        return { icon: <AlertCircle size={14} />, text: 'Expiré', class: 'ga2-badge-expired' };
      default: 
        return { icon: <HelpCircle size={14} />, text: statut, class: '' };
    }
  };

  const getInitials = (nom, prenom) => {
    return nom && prenom ? `${nom[0]}${prenom[0]}`.toUpperCase() : '?';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatHeure = (heure) => {
    if (!heure) return '-';
    return heure.length > 5 ? heure.substring(0, 5) : heure;
  };

  const getTypeIcon = (type) => {
    if (!type) return <Tag size={12} />;
    const t = type.toLowerCase();
    if (t.includes('vip')) return <Crown size={12} />;
    if (t.includes('premium')) return <Star size={12} />;
    if (t.includes('essai')) return <Sparkles size={12} />;
    return <Tag size={12} />;
  };

  const handleSort = (field) => {
    setSortConfig({
      field,
      direction: sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getHeuresResume = (debut, fin) => {
    if (!debut && !fin) return null;
    if (debut && !fin) return formatHeure(debut);
    if (!debut && fin) return `→ ${formatHeure(fin)}`;
    return `${formatHeure(debut)} - ${formatHeure(fin)}`;
  };

  // ===== RENDU =====
  return (
    <div className="ga2-root">
      {/* En-tête */}
      <div className="ga2-header">
        <div className="ga2-header-left">
          <div className="ga2-header-icon">
            <Users size={32} />
          </div>
          <div className="ga2-header-title">
            <h1>Gestion des Abonnés</h1>
            <p>
              <span className="ga2-count">{filteredData.length}</span> abonné{filteredData.length !== 1 ? 's' : ''}
              <span className="ga2-separator">•</span>
              <span className="ga2-active-count">{data.filter(d => d.statut === 'actif').length}</span> actifs
            </p>
          </div>
        </div>
        <div className="ga2-header-actions">
          <button className="ga2-btn ga2-btn-outline" onClick={fetchData}>
            <RefreshCw size={16} />
            Actualiser
          </button>
          <button className="ga2-btn ga2-btn-primary" onClick={() => openModal('add')}>
            <UserPlus size={16} />
            Nouvel abonné
          </button>
        </div>
      </div>

      {/* Barre de filtres */}
      <div className="ga2-filters">
        <div className="ga2-search-box">
          <Search size={18} className="ga2-search-icon" />
          <input
            type="text"
            className="ga2-search-input"
            placeholder="Rechercher par nom, email, téléphone, abonnement, horaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="ga2-search-clear" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>
        
        <div className="ga2-filter-group">
          <Filter size={18} className="ga2-filter-icon" />
          <select 
            className="ga2-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="inactif">Inactifs</option>
            <option value="en attente">En attente</option>
            <option value="expire">Expirés</option>
          </select>
        </div>

        <div className="ga2-view-toggle">
          <button
            className={`ga2-toggle-btn ${viewMode === 'grid' ? 'ga2-active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`ga2-toggle-btn ${viewMode === 'table' ? 'ga2-active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <List size={18} />
          </button>
        </div>

        <button className="ga2-btn ga2-btn-outline">
          <Download size={16} />
          Exporter
        </button>
      </div>

      {/* Contenu principal */}
      <div className="ga2-content">
        {isLoading ? (
          <div className="ga2-loading">
            <div className="ga2-spinner"></div>
            <p>Chargement des données...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="ga2-empty">
            <User size={64} />
            <h3>Aucun abonné trouvé</h3>
            <p>Modifiez vos filtres de recherche</p>
            <button className="ga2-btn ga2-btn-primary" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
              Réinitialiser
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="ga2-grid">
            {paginatedData.map((item, index) => {
              const status = getStatusBadge(item.statut);
              const isNew = item.date_debut && new Date() - new Date(item.date_debut) < 30 * 24 * 60 * 60 * 1000;
              const isExpiring = item.date_fin && new Date(item.date_fin) - new Date() < 7 * 24 * 60 * 60 * 1000 && item.statut === 'actif';
              const heures = getHeuresResume(item.heure_reservation, item.heure_fin);
              
              return (
                <div key={item.idclient} className="ga2-card" style={{ animationDelay: `${index * 0.05}s` }}>
                  {/* Badges */}
                  <div className="ga2-card-badges">
                    {isNew && (
                      <span className="ga2-badge ga2-badge-new">
                        <Sparkles size={10} /> Nouveau
                      </span>
                    )}
                    {isExpiring && (
                      <span className="ga2-badge ga2-badge-expiring">
                        <Clock size={10} /> Expire bientôt
                      </span>
                    )}
                  </div>

                  {/* En-tête de la carte */}
                  <div className="ga2-card-header">
                    <div className="ga2-card-avatar">
                      {getInitials(item.nom, item.prenom)}
                    </div>
                    <div className="ga2-card-id">#{item.idclient}</div>
                  </div>
                  
                  {/* Corps de la carte */}
                  <div className="ga2-card-body">
                    <h3 className="ga2-card-name">{item.nom} {item.prenom}</h3>
                    
                    <div className="ga2-card-status">
                      <span className={`ga2-status-badge ${status.class}`}>
                        {status.icon} {status.text}
                      </span>
                    </div>

                    <div className="ga2-card-info">
                      <div className="ga2-info-row">
                        <Mail size={12} />
                        <span>{item.email}</span>
                      </div>
                      <div className="ga2-info-row">
                        <Phone size={12} />
                        <span>{item.telephone}</span>
                      </div>
                      
                      {item.type_abonnement && (
                        <div className="ga2-info-row">
                          {getTypeIcon(item.type_abonnement)}
                          <span>{item.type_abonnement}</span>
                        </div>
                      )}
                      
                      {item.prix_total && (
                        <div className="ga2-info-row ga2-price-row">
                          <DollarSign size={12} />
                          <span className="ga2-price">{item.prix_total} DH</span>
                        </div>
                      )}
                      
                      {item.date_debut && (
                        <div className="ga2-info-row">
                          <Calendar size={12} />
                          <span>Début: {formatDate(item.date_debut)}</span>
                        </div>
                      )}
                      
                      {item.date_fin && (
                        <div className="ga2-info-row">
                          <Calendar size={12} />
                          <span>Fin: {formatDate(item.date_fin)}</span>
                        </div>
                      )}
                      
                      {item.mode_paiement && (
                        <div className="ga2-info-row">
                          <CreditCard size={12} />
                          <span>{item.mode_paiement}</span>
                        </div>
                      )}
                      
                      {heures && (
                        <div className="ga2-info-row">
                          <Clock size={12} />
                          <span>{heures}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Pied de la carte */}
                  <div className="ga2-card-footer">
                    <button className="ga2-action ga2-action-view" onClick={() => openModal('view', item)}>
                      <Eye size={14} /> Détails
                    </button>
                    <button className="ga2-action ga2-action-edit" onClick={() => openModal('edit', item)}>
                      <Pencil size={14} /> Modifier
                    </button>
                    <button className="ga2-action ga2-action-delete" onClick={() => openModal('delete', item)}>
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>

                  {/* Effet de brillance */}
                  <div className="ga2-card-shine"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ga2-table-wrapper">
            <table className="ga2-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('idclient')}>
                    <Hash size={12} />
                    ID {sortConfig.field === 'idclient' && <ArrowUpDown size={12} className={`ga2-sort-${sortConfig.direction}`} />}
                  </th>
                  <th onClick={() => handleSort('nom')}>
                    <User size={12} />
                    Nom {sortConfig.field === 'nom' && <ArrowUpDown size={12} className={`ga2-sort-${sortConfig.direction}`} />}
                  </th>
                  <th onClick={() => handleSort('prenom')}>
                    Prénom {sortConfig.field === 'prenom' && <ArrowUpDown size={12} className={`ga2-sort-${sortConfig.direction}`} />}
                  </th>
                  <th>Contact</th>
                  <th onClick={() => handleSort('type_abonnement')}>
                    <Tag size={12} />
                    Abonnement {sortConfig.field === 'type_abonnement' && <ArrowUpDown size={12} className={`ga2-sort-${sortConfig.direction}`} />}
                  </th>
                  <th onClick={() => handleSort('prix_total')}>
                    <DollarSign size={12} />
                    Prix {sortConfig.field === 'prix_total' && <ArrowUpDown size={12} className={`ga2-sort-${sortConfig.direction}`} />}
                  </th>
                  <th>
                    <Calendar size={12} />
                    Période
                  </th>
                  <th>
                    <CreditCard size={12} />
                    Paiement
                  </th>
                  <th onClick={() => handleSort('heure_reservation')}>
                    <Clock size={12} />
                    Horaire {sortConfig.field === 'heure_reservation' && <ArrowUpDown size={12} className={`ga2-sort-${sortConfig.direction}`} />}
                  </th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(item => {
                  const status = getStatusBadge(item.statut);
                  const heures = getHeuresResume(item.heure_reservation, item.heure_fin);
                  
                  return (
                    <tr key={item.idclient}>
                      <td className="ga2-table-id">#{item.idclient}</td>
                      <td>{item.nom}</td>
                      <td>{item.prenom}</td>
                      <td>
                        <div className="ga2-table-contact">
                          <div><Mail size={10} /> {item.email}</div>
                          <div><Phone size={10} /> {item.telephone}</div>
                        </div>
                      </td>
                      <td>
                        {item.type_abonnement && (
                          <span className="ga2-table-badge">
                            {getTypeIcon(item.type_abonnement)} {item.type_abonnement}
                          </span>
                        )}
                      </td>
                      <td className="ga2-table-price">{item.prix_total ? `${item.prix_total} DH` : '-'}</td>
                      <td className="ga2-table-period">
                        {item.date_debut && <div><Calendar size={10} /> {formatDate(item.date_debut)}</div>}
                        {item.date_fin && <div><Calendar size={10} /> {formatDate(item.date_fin)}</div>}
                      </td>
                      <td>{item.mode_paiement || '-'}</td>
                      <td>
                        {heures && (
                          <span className="ga2-table-heures">
                            <Clock size={10} /> {heures}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`ga2-status-badge ${status.class}`}>
                          {status.icon} {status.text}
                        </span>
                      </td>
                      <td className="ga2-table-actions">
                        <button className="ga2-icon-btn ga2-view" onClick={() => openModal('view', item)}>
                          <Eye size={14} />
                        </button>
                        <button className="ga2-icon-btn ga2-edit" onClick={() => openModal('edit', item)}>
                          <Pencil size={14} />
                        </button>
                        <button className="ga2-icon-btn ga2-delete" onClick={() => openModal('delete', item)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="ga2-pagination">
          <div className="ga2-pagination-info">
            <FileText size={14} />
            <span>
              {`${(currentPage - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} sur ${filteredData.length}`}
            </span>
          </div>
          <div className="ga2-pagination-controls">
            <button 
              className="ga2-pagination-btn" 
              onClick={() => setCurrentPage(p => p - 1)} 
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Précédent
            </button>
            <span className="ga2-page-numbers">{currentPage} / {totalPages}</span>
            <button 
              className="ga2-pagination-btn" 
              onClick={() => setCurrentPage(p => p + 1)} 
              disabled={currentPage === totalPages}
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modal Ajout/Modification */}
      {(modalState.add || modalState.edit) && (
        <div className="ga2-modal-overlay" onClick={() => closeModal(modalState.add ? 'add' : 'edit')}>
          <div className="ga2-modal" onClick={e => e.stopPropagation()}>
            <div className="ga2-modal-header">
              <h3>
                {modalState.add ? <UserPlus size={20} /> : <Pencil size={20} />}
                {modalState.add ? 'Nouvel abonné' : 'Modifier l\'abonné'}
              </h3>
              <button className="ga2-modal-close" onClick={() => closeModal(modalState.add ? 'add' : 'edit')}>
                <X size={18} />
              </button>
            </div>
            
            <div className="ga2-modal-body">
              <form onSubmit={(e) => { e.preventDefault(); modalState.add ? handleAdd() : handleEdit(); }}>
                <div className="ga2-form-row">
                  <div className="ga2-form-group">
                    <label>Nom <span className="ga2-required">*</span></label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={e => setFormData({...formData, nom: e.target.value})}
                      placeholder="Nom"
                      required
                    />
                  </div>
                  <div className="ga2-form-group">
                    <label>Prénom <span className="ga2-required">*</span></label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={e => setFormData({...formData, prenom: e.target.value})}
                      placeholder="Prénom"
                      required
                    />
                  </div>
                </div>

                <div className="ga2-form-row">
                  <div className="ga2-form-group">
                    <label>Email <span className="ga2-required">*</span></label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="email@exemple.com"
                      required
                    />
                  </div>
                  <div className="ga2-form-group">
                    <label>Téléphone <span className="ga2-required">*</span></label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={e => setFormData({...formData, telephone: e.target.value})}
                      placeholder="06 XX XX XX XX"
                      required
                    />
                  </div>
                </div>

                <div className="ga2-form-row">
                  <div className="ga2-form-group">
                    <label>Type d'abonnement</label>
                    <input
                      type="text"
                      value={formData.type_abonnement}
                      onChange={e => setFormData({...formData, type_abonnement: e.target.value})}
                      placeholder="Ex: Premium, VIP..."
                    />
                  </div>
                  <div className="ga2-form-group">
                    <label>Prix (DH)</label>
                    <input
                      type="number"
                      value={formData.prix_total}
                      onChange={e => setFormData({...formData, prix_total: e.target.value})}
                      placeholder="0"
                      min="0"
                      step="1"
                    />
                  </div>
                </div>

                <div className="ga2-form-row">
                  <div className="ga2-form-group">
                    <label>Date début</label>
                    <input
                      type="date"
                      value={formData.date_debut}
                      onChange={e => setFormData({...formData, date_debut: e.target.value})}
                    />
                  </div>
                  <div className="ga2-form-group">
                    <label>Date fin</label>
                    <input
                      type="date"
                      value={formData.date_fin}
                      onChange={e => setFormData({...formData, date_fin: e.target.value})}
                    />
                  </div>
                </div>

                <div className="ga2-form-row">
                  <div className="ga2-form-group">
                    <label>Mode de paiement</label>
                    <input
                      type="text"
                      value={formData.mode_paiement}
                      onChange={e => setFormData({...formData, mode_paiement: e.target.value})}
                      placeholder="Carte, espèces..."
                    />
                  </div>
                  <div className="ga2-form-group">
                    <label>Statut</label>
                    <select value={formData.statut} onChange={e => setFormData({...formData, statut: e.target.value})}>
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                      <option value="en attente">En attente</option>
                    </select>
                  </div>
                </div>

                <div className="ga2-form-row">
                  <div className="ga2-form-group">
                    <label>Heure début réservation</label>
                    <input
                      type="time"
                      value={formData.heure_reservation}
                      onChange={e => setFormData({...formData, heure_reservation: e.target.value})}
                    />
                  </div>
                  <div className="ga2-form-group">
                    <label>Heure fin réservation</label>
                    <input
                      type="time"
                      value={formData.heure_fin}
                      onChange={e => setFormData({...formData, heure_fin: e.target.value})}
                    />
                  </div>
                </div>

                {formData.heure_reservation && formData.heure_fin && (
                  <div className="ga2-form-info">
                    <Info size={14} />
                    <span>Créneau : {formData.heure_reservation} - {formData.heure_fin}</span>
                  </div>
                )}
              </form>
            </div>

            <div className="ga2-modal-footer">
              <button className="ga2-btn ga2-btn-secondary" onClick={() => closeModal(modalState.add ? 'add' : 'edit')}>
                Annuler
              </button>
              <button className="ga2-btn ga2-btn-primary" onClick={modalState.add ? handleAdd : handleEdit}>
                {modalState.add ? 'Ajouter' : 'Modifier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualisation */}
      {modalState.view && selectedItem && (
        <div className="ga2-modal-overlay" onClick={() => closeModal('view')}>
          <div className="ga2-modal ga2-view-modal" onClick={e => e.stopPropagation()}>
            <div className="ga2-modal-header">
              <h3><Eye size={20} /> Détails de l'abonné</h3>
              <button className="ga2-modal-close" onClick={() => closeModal('view')}>
                <X size={18} />
              </button>
            </div>
            
            <div className="ga2-modal-body">
              <div className="ga2-view-profile">
                <div className="ga2-view-avatar">
                  {getInitials(selectedItem.nom, selectedItem.prenom)}
                </div>
                <div className="ga2-view-info">
                  <h2>{selectedItem.nom} {selectedItem.prenom}</h2>
                  {(() => {
                    const status = getStatusBadge(selectedItem.statut);
                    return <span className={`ga2-status-badge ${status.class}`}>{status.icon} {status.text}</span>;
                  })()}
                </div>
              </div>

              <div className="ga2-view-details">
                <div className="ga2-view-section">
                  <h4>📋 Informations générales</h4>
                  <div className="ga2-view-row">
                    <span className="ga2-view-label">ID Client</span>
                    <span className="ga2-view-value">#{selectedItem.idclient}</span>
                  </div>
                  <div className="ga2-view-row">
                    <span className="ga2-view-label">Email</span>
                    <span className="ga2-view-value">{selectedItem.email}</span>
                  </div>
                  <div className="ga2-view-row">
                    <span className="ga2-view-label">Téléphone</span>
                    <span className="ga2-view-value">{selectedItem.telephone}</span>
                  </div>
                </div>

                <div className="ga2-view-section">
                  <h4>📦 Abonnement</h4>
                  <div className="ga2-view-row">
                    <span className="ga2-view-label">Type</span>
                    <span className="ga2-view-value">{selectedItem.type_abonnement || '-'}</span>
                  </div>
                  <div className="ga2-view-row">
                    <span className="ga2-view-label">Prix</span>
                    <span className="ga2-view-value ga2-price">{selectedItem.prix_total ? `${selectedItem.prix_total} DH` : '-'}</span>
                  </div>
                  <div className="ga2-view-row">
                    <span className="ga2-view-label">Date début</span>
                    <span className="ga2-view-value">{formatDate(selectedItem.date_debut)}</span>
                  </div>
                  <div className="ga2-view-row">
                    <span className="ga2-view-label">Date fin</span>
                    <span className="ga2-view-value">{formatDate(selectedItem.date_fin)}</span>
                  </div>
                </div>

                <div className="ga2-view-section">
                  <h4>💰 Paiement</h4>
                  <div className="ga2-view-row">
                    <span className="ga2-view-label">Mode</span>
                    <span className="ga2-view-value">{selectedItem.mode_paiement || '-'}</span>
                  </div>
                </div>

                {(selectedItem.heure_reservation || selectedItem.heure_fin) && (
                  <div className="ga2-view-section">
                    <h4>⏰ Horaires de réservation</h4>
                    <div className="ga2-view-heures">
                      <div className="ga2-heure-item">
                        <span className="ga2-heure-label">Début</span>
                        <span className="ga2-heure-value">{formatHeure(selectedItem.heure_reservation)}</span>
                      </div>
                      {selectedItem.heure_reservation && selectedItem.heure_fin && (
                        <div className="ga2-heure-separator">→</div>
                      )}
                      <div className="ga2-heure-item">
                        <span className="ga2-heure-label">Fin</span>
                        <span className="ga2-heure-value">{formatHeure(selectedItem.heure_fin)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="ga2-modal-footer">
              <button className="ga2-btn ga2-btn-secondary" onClick={() => closeModal('view')}>
                Fermer
              </button>
              <button className="ga2-btn ga2-btn-primary" onClick={handlePrint}>
                <Printer size={16} /> Imprimer
              </button>
              <button className="ga2-btn ga2-btn-primary" onClick={() => {
                closeModal('view');
                openModal('edit', selectedItem);
              }}>
                <Pencil size={16} /> Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {modalState.delete && selectedItem && (
        <div className="ga2-modal-overlay" onClick={() => closeModal('delete')}>
          <div className="ga2-modal ga2-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="ga2-modal-header">
              <h3><Trash2 size={20} /> Confirmation</h3>
              <button className="ga2-modal-close" onClick={() => closeModal('delete')}>
                <X size={18} />
              </button>
            </div>
            
            <div className="ga2-modal-body">
              <div className="ga2-delete-content">
                <AlertCircle size={64} />
                <p>
                  Êtes-vous sûr de vouloir supprimer <strong>{selectedItem.nom} {selectedItem.prenom}</strong> ?
                </p>
                <p className="ga2-warning">Cette action est irréversible</p>
              </div>
            </div>

            <div className="ga2-modal-footer">
              <button className="ga2-btn ga2-btn-secondary" onClick={() => closeModal('delete')}>
                Annuler
              </button>
              <button className="ga2-btn ga2-btn-danger" onClick={handleDelete}>
                <Trash2 size={16} /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`ga2-notification ga2-notification-${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default GestionAbonnes;