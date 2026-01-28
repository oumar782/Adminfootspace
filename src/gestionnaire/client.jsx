import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FaPlus, FaEye, FaEdit, FaTrash, FaSearch, FaChevronLeft, 
  FaChevronRight, FaTimes, FaCalendar, FaMoneyBillWave, 
  FaCreditCard, FaUserCircle, FaClock, FaChartBar, FaPrint, 
  FaUpload, FaCamera, FaQrcode, FaIdCard, FaDownload, FaFilePdf 
} from 'react-icons/fa';
import './client.css';

const GestionClients = () => {
  // State principal
  const [clientsList, setClientsList] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentClientsPage, setCurrentClientsPage] = useState(1);
  const [totalClientsPages, setTotalClientsPages] = useState(1);
  const [searchClientsTerm, setSearchClientsTerm] = useState('');
  const [clientsFilter, setClientsFilter] = useState('all');
  const [clientsSort, setClientsSort] = useState('nom-asc');

  // Modals et états associés
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showViewClientModal, setShowViewClientModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [showDeleteClientModal, setShowDeleteClientModal] = useState(false);
  const [showAbonnementModal, setShowAbonnementModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showStatistiquesModal, setShowStatistiquesModal] = useState(false);
  const [showCarteModal, setShowCarteModal] = useState(false);
  const [selectedClientData, setSelectedClientData] = useState(null);
  const [statistiques, setStatistiques] = useState(null);
  const [carteClientData, setCarteClientData] = useState(null);

  // Upload photo
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  // Formulaires
  const [newClientData, setNewClientData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    statut: 'actif',
    type_abonnement: '',
    date_debut: '',
    date_fin: '',
    prix_total: '',
    mode_paiement: '',
    photo_abonne: '',
    heure_reservation: ''
  });

  const [editClientData, setEditClientData] = useState({
    idclient: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    statut: 'actif',
    type_abonnement: '',
    date_debut: '',
    date_fin: '',
    prix_total: '',
    mode_paiement: '',
    photo_abonne: '',
    heure_reservation: ''
  });

  const [abonnementData, setAbonnementData] = useState({
    type_abonnement: '',
    date_debut: '',
    date_fin: '',
    prix_total: '',
    mode_paiement: ''
  });

  // Toast
  const [clientToast, setClientToast] = useState(null);

  // Références
  const carteRef = useRef(null);

  // Constantes
  const CLIENTS_PER_PAGE = 10;
  const API_URL = 'https://backend-foot-omega.vercel.app/api/clients'; // Changé pour localhost pour l'upload

  // Types d'abonnement valides
  const TYPES_ABONNEMENT = ['mensuel', 'trimestriel', 'semestriel', 'annuel', 'ponctuel'];
  
  // Modes de paiement
  const MODES_PAIEMENT = ['Carte bancaire', 'Espèces', 'Virement', 'Chèque', 'Mobile Money'];

  // Récupérer tous les clients depuis l'API
  const fetchAllClientsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      if (data.success) {
        setAllClients(data.data || []);
      } else {
        showClientToast(data.message || 'Erreur lors du chargement', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showClientToast('Erreur de connexion au serveur', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les statistiques
  const fetchStatistiques = async () => {
    try {
      const response = await fetch(`${API_URL}/statistiques/totales`);
      const data = await response.json();
      
      if (data.success) {
        setStatistiques(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  useEffect(() => {
    fetchAllClientsData();
    fetchStatistiques();
  }, []);

  // Filtrer, rechercher et trier les clients
  const filteredAndSortedClients = useMemo(() => {
    let result = [...allClients];
    
    // Appliquer le filtre de statut
    if (clientsFilter !== 'all') {
      if (clientsFilter === 'abonnement_actif') {
        const today = new Date().toISOString().split('T')[0];
        result = result.filter(client => 
          client.type_abonnement && 
          client.date_debut && 
          client.date_fin &&
          client.date_debut <= today && 
          client.date_fin >= today &&
          client.statut === 'actif'
        );
      } else if (clientsFilter === 'abonnement_expire') {
        const today = new Date().toISOString().split('T')[0];
        result = result.filter(client => 
          client.type_abonnement && 
          client.date_fin && 
          client.date_fin < today &&
          client.statut === 'actif'
        );
      } else {
        result = result.filter(client => client.statut === clientsFilter);
      }
    }
    
    // Appliquer la recherche
    if (searchClientsTerm) {
      const searchTerm = searchClientsTerm.toLowerCase().trim();
      result = result.filter(client => 
        client.nom.toLowerCase().includes(searchTerm) ||
        client.prenom.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.telephone.includes(searchTerm) ||
        client.idclient.toString().includes(searchTerm) ||
        (client.type_abonnement && client.type_abonnement.toLowerCase().includes(searchTerm)) ||
        (client.mode_paiement && client.mode_paiement.toLowerCase().includes(searchTerm))
      );
    }
    
    // Appliquer le tri
    switch(clientsSort) {
      case 'nom-asc':
        result.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      case 'nom-desc':
        result.sort((a, b) => b.nom.localeCompare(a.nom));
        break;
      case 'date_creation-desc':
        result.sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation));
        break;
      case 'date_fin-asc':
        result.sort((a, b) => new Date(a.date_fin || 0) - new Date(b.date_fin || 0));
        break;
    }
    
    return result;
  }, [allClients, clientsFilter, searchClientsTerm, clientsSort]);

  // Pagination des résultats filtrés
  const paginatedClients = useMemo(() => {
    const startIndex = (currentClientsPage - 1) * CLIENTS_PER_PAGE;
    return filteredAndSortedClients.slice(startIndex, startIndex + CLIENTS_PER_PAGE);
  }, [filteredAndSortedClients, currentClientsPage]);

  // Mettre à jour la pagination
  useEffect(() => {
    const totalPages = Math.ceil(filteredAndSortedClients.length / CLIENTS_PER_PAGE);
    setTotalClientsPages(totalPages || 1);
    
    if (currentClientsPage > totalPages && totalPages > 0) {
      setCurrentClientsPage(1);
    }
  }, [filteredAndSortedClients, currentClientsPage]);

  // Fonction pour convertir une image en base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Gestion des actions CRUD
  const handleAddNewClient = async () => {
    let photoBase64 = null;
    
    // Si une photo a été sélectionnée, la convertir en base64
    if (photoFile) {
      try {
        photoBase64 = await convertImageToBase64(photoFile);
      } catch (error) {
        console.error('Erreur de conversion:', error);
        showClientToast('Erreur lors de la conversion de l\'image', 'error');
        return;
      }
    }

    const clientData = {
      ...newClientData,
      photo_base64: photoBase64
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNewClientData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          statut: 'actif',
          type_abonnement: '',
          date_debut: '',
          date_fin: '',
          prix_total: '',
          mode_paiement: '',
          photo_abonne: '',
          heure_reservation: ''
        });
        setPhotoPreview(null);
        setPhotoFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setShowAddClientModal(false);
        showClientToast('Client ajouté avec succès', 'success');
        fetchAllClientsData();
        fetchStatistiques();
      } else {
        showClientToast(data.message || 'Erreur lors de l\'ajout', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showClientToast('Erreur lors de l\'ajout du client', 'error');
    }
  };

  const handleEditCurrentClient = async () => {
    try {
      const response = await fetch(`${API_URL}/${editClientData.idclient}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editClientData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowEditClientModal(false);
        showClientToast('Client modifié avec succès', 'success');
        fetchAllClientsData();
        fetchStatistiques();
      } else {
        showClientToast(data.message || 'Erreur lors de la modification', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showClientToast('Erreur lors de la modification du client', 'error');
    }
  };

  const handleDeleteSelectedClient = async () => {
    try {
      const response = await fetch(`${API_URL}/${selectedClientData.idclient}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowDeleteClientModal(false);
        showClientToast('Client supprimé avec succès', 'success');
        fetchAllClientsData();
        fetchStatistiques();
      } else {
        showClientToast(data.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showClientToast('Erreur lors de la suppression du client', 'error');
    }
  };

  const handleUpdateAbonnement = async () => {
    try {
      const response = await fetch(`${API_URL}/${selectedClientData.idclient}/abonnement`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(abonnementData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowAbonnementModal(false);
        setAbonnementData({
          type_abonnement: '',
          date_debut: '',
          date_fin: '',
          prix_total: '',
          mode_paiement: ''
        });
        showClientToast('Abonnement mis à jour avec succès', 'success');
        fetchAllClientsData();
        fetchStatistiques();
      } else {
        showClientToast(data.message || 'Erreur lors de la mise à jour', 'error');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
      showClientToast('Erreur lors de la mise à jour de l\'abonnement', 'error');
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile || !selectedClientData) {
      showClientToast('Veuillez sélectionner une photo', 'error');
      return;
    }

    try {
      const photoBase64 = await convertImageToBase64(photoFile);
      
      const response = await fetch(`${API_URL}/${selectedClientData.idclient}/photo-base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photo_base64: photoBase64 })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowPhotoModal(false);
        setPhotoPreview(null);
        setPhotoFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        showClientToast('Photo uploadée avec succès', 'success');
        fetchAllClientsData();
      } else {
        showClientToast(data.message || 'Erreur lors de l\'upload', 'error');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      showClientToast('Erreur lors de l\'upload de la photo', 'error');
    }
  };

  // Gestion de la sélection de fichier
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showClientToast('La taille de l\'image ne doit pas dépasser 5MB', 'error');
        return;
      }
      
      // Vérifier le type de fichier
      if (!file.type.match('image.*')) {
        showClientToast('Veuillez sélectionner une image valide (JPG, PNG, GIF)', 'error');
        return;
      }

      setPhotoFile(file);
      
      // Créer un preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestion de l'impression de la carte
  const handlePrintCarte = () => {
    if (!carteRef.current || !carteClientData) return;

    const printWindow = window.open('', '_blank');
    const carteHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Carte d'abonnement - ${carteClientData.nom} ${carteClientData.prenom}</title>
        <style>
          @media print {
            @page { margin: 0; size: 85mm 54mm; }
            body { margin: 0; padding: 0; }
          }
          
          body {
            font-family: Arial, sans-serif;
            width: 85mm;
            height: 54mm;
            margin: 0;
            padding: 5mm;
            background: linear-gradient(135deg, #0a6e0e 0%, #034307 100%);
            color: white;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
          }
          
          .carte-container {
            position: relative;
            z-index: 2;
          }
          
          .carte-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3mm;
          }
          
          .carte-logo {
            font-size: 4mm;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .carte-type {
            background: rgba(255, 255, 255, 0.2);
            padding: 1mm 3mm;
            border-radius: 20mm;
            font-size: 3mm;
            font-weight: bold;
          }
          
          .carte-body {
            display: grid;
            grid-template-columns: 35mm 40mm;
            gap: 3mm;
          }
          
          .carte-photo {
            width: 35mm;
            height: 40mm;
            border-radius: 3mm;
            overflow: hidden;
            border: 1mm solid white;
          }
          
          .carte-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .carte-info {
            display: flex;
            flex-direction: column;
            gap: 2mm;
          }
          
          .carte-name {
            font-size: 5mm;
            font-weight: bold;
            margin: 0;
          }
          
          .carte-id {
            font-size: 3mm;
            opacity: 0.8;
          }
          
          .carte-details {
            font-size: 3mm;
            margin-top: 2mm;
          }
          
          .carte-details div {
            margin-bottom: 1mm;
          }
          
          .carte-footer {
            position: absolute;
            bottom: 3mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 2.5mm;
            opacity: 0.9;
          }
          
          .carte-qr {
            position: absolute;
            bottom: 3mm;
            right: 3mm;
            width: 15mm;
            height: 15mm;
            background: white;
            border-radius: 2mm;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2mm;
            color: #333;
            text-align: center;
            padding: 1mm;
          }
        </style>
      </head>
      <body>
        <div class="carte-container">
          <div class="carte-header">
            <div class="carte-logo">FOOT CLUB</div>
            <div class="carte-type">${getAbonnementLabel(carteClientData.type_abonnement)}</div>
          </div>
          
          <div class="carte-body">
            <div class="carte-photo">
              ${carteClientData.photo_abonne ? 
                `<img src="${carteClientData.photo_abonne}" alt="Photo">` : 
                `<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: rgba(255,255,255,0.1);">
                  ${getClientInitials(carteClientData)}
                </div>`
              }
            </div>
            
            <div class="carte-info">
              <h1 class="carte-name">${carteClientData.nom} ${carteClientData.prenom}</h1>
              <div class="carte-id">ID: ${carteClientData.idclient}</div>
              
              <div class="carte-details">
                <div>Validité: ${formatDate(carteClientData.date_debut)} - ${formatDate(carteClientData.date_fin)}</div>
                <div>Type: ${getAbonnementLabel(carteClientData.type_abonnement)}</div>
                <div>Statut: ${getStatusLabel(carteClientData.statut)}</div>
              </div>
            </div>
          </div>
          
          <div class="carte-footer">
            Carte d'abonné • Émise le ${new Date().toLocaleDateString('fr-FR')}
          </div>
          
          <div class="carte-qr">
            ${carteClientData.idclient}<br/>
            ${carteClientData.nom.substring(0, 3)}${carteClientData.prenom.substring(0, 3)}
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(carteHTML);
    printWindow.document.close();
    showClientToast('Carte générée avec succès', 'success');
  };

  // Utilitaires
  const showClientToast = (message, type = 'info') => {
    setClientToast({ message, type });
    setTimeout(() => setClientToast(null), 3000);
  };

  const getClientFullName = (client) => {
    return `${client.nom} ${client.prenom}`;
  };

  const getClientInitials = (client) => {
    if (!client.nom || !client.prenom) return "CL";
    return `${client.nom[0]}${client.prenom[0]}`.toUpperCase();
  };

  const getStatusLabel = (statut) => {
    switch(statut) {
      case 'actif': return 'Actif';
      case 'inactif': return 'Inactif';
      case 'en attente': return 'En attente';
      default: return statut;
    }
  };

  const getAbonnementLabel = (type) => {
    if (!type) return 'Aucun';
    switch(type) {
      case 'mensuel': return 'Mensuel';
      case 'trimestriel': return 'Trimestriel';
      case 'semestriel': return 'Semestriel';
      case 'annuel': return 'Annuel';
      case 'ponctuel': return 'Ponctuel';
      default: return type;
    }
  };

  const getAbonnementColor = (type) => {
    switch(type) {
      case 'mensuel': return 'abonnement-mensuel';
      case 'trimestriel': return 'abonnement-trimestriel';
      case 'semestriel': return 'abonnement-semestriel';
      case 'annuel': return 'abonnement-annuel';
      case 'ponctuel': return 'abonnement-ponctuel';
      default: return 'abonnement-none';
    }
  };

  const calculateDaysRemaining = (dateFin) => {
    if (!dateFin) return null;
    const today = new Date();
    const finDate = new Date(dateFin);
    const diffTime = finDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0,00 DH';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount).replace('MAD', 'DH');
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Non défini';
    return timeString.substring(0, 5);
  };

  // Rendu de l'avatar
  const renderAvatar = (client) => {
    if (client.photo_abonne) {
      return (
        <img 
          src={client.photo_abonne} 
          alt={getClientFullName(client)} 
          className="gestion-clients-avatar-img"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<div class="gestion-clients-avatar-text">${getClientInitials(client)}</div>`;
          }}
        />
      );
    }
    return <div className="gestion-clients-avatar-text">{getClientInitials(client)}</div>;
  };

  // Calculer les abonnements actifs et expirés
  const abonnementsActifsCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return allClients.filter(client => 
      client.type_abonnement && 
      client.date_debut && 
      client.date_fin &&
      client.date_debut <= today && 
      client.date_fin >= today &&
      client.statut === 'actif'
    ).length;
  }, [allClients]);

  const abonnementsExpiresCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return allClients.filter(client => 
      client.type_abonnement && 
      client.date_fin && 
      client.date_fin < today &&
      client.statut === 'actif'
    ).length;
  }, [allClients]);

  // Rendu de la carte d'abonnement
  const renderCarteAbonnement = () => {
    if (!carteClientData) return null;

    return (
      <div className="carte-abonnement-container" ref={carteRef}>
        <div className="carte-header">
          <div className="carte-logo">FOOT CLUB PREMIUM</div>
          <div className="carte-type">{getAbonnementLabel(carteClientData.type_abonnement)}</div>
        </div>
        
        <div className="carte-body">
          <div className="carte-info">
            <div className="carte-info-item">
              <div className="carte-label">Nom complet</div>
              <div className="carte-value">{getClientFullName(carteClientData)}</div>
            </div>
            
            <div className="carte-info-item">
              <div className="carte-label">Numéro d'adhérent</div>
              <div className="carte-id">{carteClientData.idclient}</div>
            </div>
            
            <div className="carte-info-item">
              <div className="carte-label">Type d'abonnement</div>
              <div className="carte-value">{getAbonnementLabel(carteClientData.type_abonnement)}</div>
            </div>
            
            <div className="carte-info-item">
              <div className="carte-label">Validité</div>
              <div className="carte-value">
                {formatDate(carteClientData.date_debut)} - {formatDate(carteClientData.date_fin)}
              </div>
            </div>
          </div>
          
          <div className="carte-client-photo">
            <div className="carte-photo-container">
              {carteClientData.photo_abonne ? (
                <img 
                  src={carteClientData.photo_abonne} 
                  alt={getClientFullName(carteClientData)} 
                  className="carte-photo-img"
                />
              ) : (
                <div className="carte-no-photo">
                  <FaUserCircle />
                  <p>Pas de photo</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="carte-footer">
          <div className="carte-qr-code">
            <FaQrcode />
            <div>ID: {carteClientData.idclient}</div>
          </div>
          <div className="carte-validite">
            Carte d'abonné • Foot Club
          </div>
          <div className="carte-dates">
            <span>Émise le: {new Date().toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="gestion-clients-container">
      <div className="gestion-clients-wrapper">
        {/* Header */}
        <div className="gestion-clients-header">
          <h1>Gestion des Clients & Abonnements</h1>
          <div className="gestion-clients-header-actions">
            <button 
              className="gestion-clients-stats-btn gestion-clients-secondary-btn"
              onClick={() => setShowStatistiquesModal(true)}
            >
              <FaChartBar /> Statistiques
            </button>
            <button 
              className="gestion-clients-add-btn gestion-clients-primary-btn"
              onClick={() => setShowAddClientModal(true)}
            >
              <FaPlus /> Nouveau Client
            </button>
          </div>
        </div>

        {/* Cartes de statistiques rapides */}
        <div className="gestion-clients-stats-cards">
          <div className="gestion-clients-stat-card">
            <div className="gestion-clients-stat-icon gestion-clients-stat-total">
              <FaUserCircle />
            </div>
            <div className="gestion-clients-stat-content">
              <h3>{allClients.length}</h3>
              <p>Clients total</p>
            </div>
          </div>
          <div className="gestion-clients-stat-card">
            <div className="gestion-clients-stat-icon gestion-clients-stat-actif">
              <FaCalendar />
            </div>
            <div className="gestion-clients-stat-content">
              <h3>{abonnementsActifsCount}</h3>
              <p>Abonnements actifs</p>
            </div>
          </div>
          <div className="gestion-clients-stat-card">
            <div className="gestion-clients-stat-icon gestion-clients-stat-expire">
              <FaMoneyBillWave />
            </div>
            <div className="gestion-clients-stat-content">
              <h3>{abonnementsExpiresCount}</h3>
              <p>Abonnements expirés</p>
            </div>
          </div>
          <div className="gestion-clients-stat-card">
            <div className="gestion-clients-stat-icon gestion-clients-stat-revenu">
              <FaCreditCard />
            </div>
            <div className="gestion-clients-stat-content">
              <h3>
                {statistiques ? formatCurrency(statistiques.revenuTotal) : '0,00 DH'}
              </h3>
              <p>Revenu total</p>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="gestion-clients-toolbar">
          <div className="gestion-clients-search">
            <FaSearch className="gestion-clients-search-icon" />
            <input
              type="text"
              className="gestion-clients-search-input"
              placeholder="Rechercher client, email, téléphone, abonnement..."
              value={searchClientsTerm}
              onChange={(e) => setSearchClientsTerm(e.target.value)}
            />
            {searchClientsTerm && (
              <button 
                className="gestion-clients-clear-search"
                onClick={() => setSearchClientsTerm('')}
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="gestion-clients-filters">
            <select 
              className="gestion-clients-filter-select"
              value={clientsSort}
              onChange={(e) => setClientsSort(e.target.value)}
            >
              <option value="nom-asc">Nom (A-Z)</option>
              <option value="nom-desc">Nom (Z-A)</option>
              <option value="date_creation-desc">Plus récent</option>
              <option value="date_fin-asc">Date fin (proche)</option>
            </select>
            <select 
              className="gestion-clients-filter-select"
              value={clientsFilter}
              onChange={(e) => setClientsFilter(e.target.value)}
            >
              <option value="all">Tous les clients</option>
              <option value="actif">Clients actifs</option>
              <option value="inactif">Clients inactifs</option>
              <option value="en attente">En attente</option>
              <option value="abonnement_actif">Abonnements actifs</option>
              <option value="abonnement_expire">Abonnements expirés</option>
            </select>
          </div>
        </div>

        {/* Tableau des clients */}
        <div className="gestion-clients-table-container">
          <table className="gestion-clients-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Contact</th>
                <th>Abonnement</th>
                <th>Période</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="gestion-clients-loading">
                    <div className="gestion-clients-spinner"></div>
                    Chargement en cours...
                  </td>
                </tr>
              ) : paginatedClients.length > 0 ? (
                paginatedClients.map(client => {
                  const daysRemaining = calculateDaysRemaining(client.date_fin);
                  return (
                    <tr key={client.idclient}>
                      <td>
                        <div className="gestion-clients-client-info">
                          <div className="gestion-clients-avatar-small">
                            {renderAvatar(client)}
                          </div>
                          <div className="gestion-clients-client-details">
                            <strong>{getClientFullName(client)}</strong>
                            <small>ID: {client.idclient}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="gestion-clients-contact-info">
                          <div>{client.email}</div>
                          <div>{client.telephone}</div>
                          {client.heure_reservation && (
                            <div className="gestion-clients-heure">
                              <FaClock /> {formatTime(client.heure_reservation)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="gestion-clients-abonnement-info">
                          <span className={`gestion-clients-abonnement-badge ${getAbonnementColor(client.type_abonnement)}`}>
                            {getAbonnementLabel(client.type_abonnement)}
                          </span>
                          {client.mode_paiement && (
                            <small>Paiement: {client.mode_paiement}</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="gestion-clients-dates-info">
                          {client.date_debut ? (
                            <>
                              <div>Début: {formatDate(client.date_debut)}</div>
                              <div>Fin: {formatDate(client.date_fin)}</div>
                              {daysRemaining !== null && daysRemaining >= 0 && (
                                <div className="gestion-clients-days-remaining">
                                  {daysRemaining} jour{daysRemaining !== 1 ? 's' : ''} restant{daysRemaining !== 1 ? 's' : ''}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="gestion-clients-no-dates">Pas d'abonnement</div>
                          )}
                        </div>
                      </td>
                      <td>
                        {client.prix_total ? (
                          <div className="gestion-clients-price">
                            {formatCurrency(client.prix_total)}
                          </div>
                        ) : (
                          <div className="gestion-clients-no-price">-</div>
                        )}
                      </td>
                      <td>
                        <span className={`gestion-clients-status gestion-clients-status-${client.statut}`}>
                          {getStatusLabel(client.statut)}
                        </span>
                        <div className="gestion-clients-date-creation">
                          Créé le: {formatDate(client.date_creation)}
                        </div>
                      </td>
                      <td>
                        <div className="gestion-clients-actions">
                          <button 
                            className="gestion-clients-action-btn gestion-clients-view-btn"
                            onClick={() => {
                              setSelectedClientData(client);
                              setShowViewClientModal(true);
                            }}
                            title="Voir détails"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="gestion-clients-action-btn gestion-clients-edit-btn"
                            onClick={() => {
                              setEditClientData({ ...client });
                              setShowEditClientModal(true);
                            }}
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="gestion-clients-action-btn gestion-clients-abonnement-btn"
                            onClick={() => {
                              setSelectedClientData(client);
                              setAbonnementData({
                                type_abonnement: client.type_abonnement || '',
                                date_debut: client.date_debut || '',
                                date_fin: client.date_fin || '',
                                prix_total: client.prix_total || '',
                                mode_paiement: client.mode_paiement || ''
                              });
                              setShowAbonnementModal(true);
                            }}
                            title="Gérer abonnement"
                          >
                            <FaCalendar />
                          </button>
                          <button 
                            className="gestion-clients-action-btn gestion-clients-photo-btn"
                            onClick={() => {
                              setSelectedClientData(client);
                              setPhotoPreview(client.photo_abonne || null);
                              setPhotoFile(null);
                              setShowPhotoModal(true);
                            }}
                            title="Modifier photo"
                          >
                            <FaCamera />
                          </button>
                          <button 
                            className="gestion-clients-action-btn gestion-clients-carte-btn"
                            onClick={() => {
                              setCarteClientData(client);
                              setShowCarteModal(true);
                            }}
                            title="Générer carte"
                          >
                            <FaIdCard />
                          </button>
                          <button 
                            className="gestion-clients-action-btn gestion-clients-delete-btn"
                            onClick={() => {
                              setSelectedClientData(client);
                              setShowDeleteClientModal(true);
                            }}
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="gestion-clients-empty">
                    <div className="gestion-clients-empty-icon">
                      <FaSearch />
                    </div>
                    {searchClientsTerm || clientsFilter !== 'all' 
                      ? 'Aucun client ne correspond à vos critères de recherche' 
                      : 'Aucun client trouvé'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="gestion-clients-pagination">
          <div className="gestion-clients-pagination-info">
            {filteredAndSortedClients.length} client{filteredAndSortedClients.length !== 1 ? 's' : ''} trouvé{filteredAndSortedClients.length !== 1 ? 's' : ''}
            {(searchClientsTerm || clientsFilter !== 'all') && ' avec les filtres appliqués'}
          </div>
          <div className="gestion-clients-pagination-controls">
            <button 
              className="gestion-clients-pagination-btn"
              onClick={() => setCurrentClientsPage(prev => Math.max(prev - 1, 1))}
              disabled={currentClientsPage === 1}
            >
              <FaChevronLeft /> Précédent
            </button>
            <span className="gestion-clients-pagination-numbers">
              Page {currentClientsPage} sur {totalClientsPages}
            </span>
            <button 
              className="gestion-clients-pagination-btn"
              onClick={() => setCurrentClientsPage(prev => prev + 1)}
              disabled={currentClientsPage === totalClientsPages || paginatedClients.length < CLIENTS_PER_PAGE}
            >
              Suivant <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Ajout Client */}
      {showAddClientModal && (
        <div className="gestion-clients-modal-overlay">
          <div className="gestion-clients-modal gestion-clients-add-modal">
            <div className="gestion-clients-modal-header">
              <h3>Nouveau Client</h3>
              <button className="gestion-clients-close-btn" onClick={() => setShowAddClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="gestion-clients-modal-body">
              <div className="photo-upload-section">
                <div className="photo-upload-container">
                  <div className="photo-preview-container">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="photo-preview" />
                    ) : (
                      <div className="photo-placeholder">
                        <FaUserCircle />
                        <p>Aucune photo</p>
                      </div>
                    )}
                  </div>
                  <button className="photo-upload-btn">
                    <FaUpload /> Choisir une photo
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="photo-upload-input"
                    />
                  </button>
                  {photoFile && (
                    <p className="photo-file-name">{photoFile.name} ({(photoFile.size / 1024).toFixed(1)} KB)</p>
                  )}
                </div>
              </div>

              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={newClientData.nom}
                    onChange={(e) => setNewClientData({...newClientData, nom: e.target.value})}
                    required
                  />
                </div>
                <div className="gestion-clients-form-group">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    value={newClientData.prenom}
                    onChange={(e) => setNewClientData({...newClientData, prenom: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newClientData.email}
                    onChange={(e) => setNewClientData({...newClientData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="gestion-clients-form-group">
                  <label>Téléphone *</label>
                  <input
                    type="tel"
                    value={newClientData.telephone}
                    onChange={(e) => setNewClientData({...newClientData, telephone: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Type d'abonnement</label>
                  <select
                    value={newClientData.type_abonnement}
                    onChange={(e) => setNewClientData({...newClientData, type_abonnement: e.target.value})}
                  >
                    <option value="">Sélectionner...</option>
                    {TYPES_ABONNEMENT.map(type => (
                      <option key={type} value={type}>{getAbonnementLabel(type)}</option>
                    ))}
                  </select>
                </div>
                <div className="gestion-clients-form-group">
                  <label>Statut</label>
                  <select
                    value={newClientData.statut}
                    onChange={(e) => setNewClientData({...newClientData, statut: e.target.value})}
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                    <option value="en attente">En attente</option>
                  </select>
                </div>
              </div>
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Date début</label>
                  <input
                    type="date"
                    value={newClientData.date_debut}
                    onChange={(e) => setNewClientData({...newClientData, date_debut: e.target.value})}
                  />
                </div>
                <div className="gestion-clients-form-group">
                  <label>Date fin</label>
                  <input
                    type="date"
                    value={newClientData.date_fin}
                    onChange={(e) => setNewClientData({...newClientData, date_fin: e.target.value})}
                  />
                </div>
              </div>
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Prix total (DH)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newClientData.prix_total}
                    onChange={(e) => setNewClientData({...newClientData, prix_total: e.target.value})}
                  />
                </div>
                <div className="gestion-clients-form-group">
                  <label>Mode de paiement</label>
                  <select
                    value={newClientData.mode_paiement}
                    onChange={(e) => setNewClientData({...newClientData, mode_paiement: e.target.value})}
                  >
                    <option value="">Sélectionner...</option>
                    {MODES_PAIEMENT.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Heure de réservation préférée</label>
                  <input
                    type="time"
                    value={newClientData.heure_reservation}
                    onChange={(e) => setNewClientData({...newClientData, heure_reservation: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="gestion-clients-modal-footer">
              <button 
                className="gestion-clients-secondary-btn"
                onClick={() => setShowAddClientModal(false)}
              >
                Annuler
              </button>
              <button 
                className="gestion-clients-primary-btn"
                onClick={handleAddNewClient}
                disabled={!newClientData.nom || !newClientData.prenom || !newClientData.email || !newClientData.telephone}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualisation Client */}
      {showViewClientModal && selectedClientData && (
        <div className="gestion-clients-modal-overlay">
          <div className="gestion-clients-modal gestion-clients-view-modal">
            <div className="gestion-clients-modal-header">
              <h3>Détails du Client</h3>
              <button className="gestion-clients-close-btn" onClick={() => setShowViewClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="gestion-clients-modal-body">
              <div className="gestion-clients-detail-header">
                <div className="gestion-clients-avatar-large">
                  {renderAvatar(selectedClientData)}
                </div>
                <div className="gestion-clients-detail-info">
                  <h2>{getClientFullName(selectedClientData)}</h2>
                  <span className={`gestion-clients-status gestion-clients-status-${selectedClientData.statut}`}>
                    {getStatusLabel(selectedClientData.statut)}
                  </span>
                  <div className="gestion-clients-id">ID: {selectedClientData.idclient}</div>
                </div>
              </div>
              
              <div className="gestion-clients-detail-grid">
                <div className="gestion-clients-detail-section">
                  <h4>Informations personnelles</h4>
                  <div className="gestion-clients-detail-item">
                    <div className="gestion-clients-detail-label">Nom</div>
                    <div className="gestion-clients-detail-value">{selectedClientData.nom}</div>
                  </div>
                  <div className="gestion-clients-detail-item">
                    <div className="gestion-clients-detail-label">Prénom</div>
                    <div className="gestion-clients-detail-value">{selectedClientData.prenom}</div>
                  </div>
                  <div className="gestion-clients-detail-item">
                    <div className="gestion-clients-detail-label">Email</div>
                    <div className="gestion-clients-detail-value">{selectedClientData.email}</div>
                  </div>
                  <div className="gestion-clients-detail-item">
                    <div className="gestion-clients-detail-label">Téléphone</div>
                    <div className="gestion-clients-detail-value">{selectedClientData.telephone}</div>
                  </div>
                  <div className="gestion-clients-detail-item">
                    <div className="gestion-clients-detail-label">Date de création</div>
                    <div className="gestion-clients-detail-value">{formatDate(selectedClientData.date_creation)}</div>
                  </div>
                </div>

                <div className="gestion-clients-detail-section">
                  <h4>Abonnement</h4>
                  <div className="gestion-clients-detail-item">
                    <div className="gestion-clients-detail-label">Type</div>
                    <div className="gestion-clients-detail-value">
                      <span className={`gestion-clients-abonnement-badge ${getAbonnementColor(selectedClientData.type_abonnement)}`}>
                        {getAbonnementLabel(selectedClientData.type_abonnement)}
                      </span>
                    </div>
                  </div>
                  <div className="gestion-clients-detail-item">
                    <div className="gestion-clients-detail-label">Date début</div>
                    <div className="gestion-clients-detail-value">{formatDate(selectedClientData.date_debut)}</div>
                  </div>
                  <div className="gestion-clients-detail-item">
                    <div className="gestion-clients-detail-label">Date fin</div>
                    <div className="gestion-clients-detail-value">{formatDate(selectedClientData.date_fin)}</div>
                  </div>
                  {calculateDaysRemaining(selectedClientData.date_fin) !== null && (
                    <div className="gestion-clients-detail-item">
                      <div className="gestion-clients-detail-label">Jours restants</div>
                      <div className="gestion-clients-detail-value">
                        <span className={`gestion-clients-days-badge ${calculateDaysRemaining(selectedClientData.date_fin) < 7 ? 'warning' : ''}`}>
                          {calculateDaysRemaining(selectedClientData.date_fin)} jours
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="gestion-clients-detail-item">
                    <div className="gestion-clients-detail-label">Prix total</div>
                    <div className="gestion-clients-detail-value">{formatCurrency(selectedClientData.prix_total)}</div>
                  </div>
                  <div className="gestion-clients-detail-item">
                    <div className="gestion-clients-detail-label">Mode de paiement</div>
                    <div className="gestion-clients-detail-value">{selectedClientData.mode_paiement || 'Non spécifié'}</div>
                  </div>
                </div>
              </div>

              <div className="gestion-clients-detail-section">
                <h4>Préférences</h4>
                <div className="gestion-clients-detail-row">
                  <div className="gestion-clients-detail-item">
                    <div className="gestion-clients-detail-label">Heure de réservation</div>
                    <div className="gestion-clients-detail-value">
                      {selectedClientData.heure_reservation ? formatTime(selectedClientData.heure_reservation) : 'Non définie'}
                    </div>
                  </div>
                  <div className="gestion-clients-detail-item">
                    <div className="gestion-clients-detail-label">Photo</div>
                    <div className="gestion-clients-detail-value">
                      {selectedClientData.photo_abonne ? 'Photo disponible' : 'Aucune photo'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="gestion-clients-modal-footer">
              <button 
                className="gestion-clients-primary-btn"
                onClick={() => setShowViewClientModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modification Client */}
      {showEditClientModal && (
        <div className="gestion-clients-modal-overlay">
          <div className="gestion-clients-modal gestion-clients-edit-modal">
            <div className="gestion-clients-modal-header">
              <h3>Modifier le Client</h3>
              <button className="gestion-clients-close-btn" onClick={() => setShowEditClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="gestion-clients-modal-body">
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={editClientData.nom}
                    onChange={(e) => setEditClientData({...editClientData, nom: e.target.value})}
                    required
                  />
                </div>
                <div className="gestion-clients-form-group">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    value={editClientData.prenom}
                    onChange={(e) => setEditClientData({...editClientData, prenom: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={editClientData.email}
                    onChange={(e) => setEditClientData({...editClientData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="gestion-clients-form-group">
                  <label>Téléphone *</label>
                  <input
                    type="tel"
                    value={editClientData.telephone}
                    onChange={(e) => setEditClientData({...editClientData, telephone: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Type d'abonnement</label>
                  <select
                    value={editClientData.type_abonnement}
                    onChange={(e) => setEditClientData({...editClientData, type_abonnement: e.target.value})}
                  >
                    <option value="">Sélectionner...</option>
                    {TYPES_ABONNEMENT.map(type => (
                      <option key={type} value={type}>{getAbonnementLabel(type)}</option>
                    ))}
                  </select>
                </div>
                <div className="gestion-clients-form-group">
                  <label>Statut</label>
                  <select
                    value={editClientData.statut}
                    onChange={(e) => setEditClientData({...editClientData, statut: e.target.value})}
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                    <option value="en attente">En attente</option>
                  </select>
                </div>
              </div>
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Date début</label>
                  <input
                    type="date"
                    value={editClientData.date_debut}
                    onChange={(e) => setEditClientData({...editClientData, date_debut: e.target.value})}
                  />
                </div>
                <div className="gestion-clients-form-group">
                  <label>Date fin</label>
                  <input
                    type="date"
                    value={editClientData.date_fin}
                    onChange={(e) => setEditClientData({...editClientData, date_fin: e.target.value})}
                  />
                </div>
              </div>
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Prix total (DH)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editClientData.prix_total}
                    onChange={(e) => setEditClientData({...editClientData, prix_total: e.target.value})}
                  />
                </div>
                <div className="gestion-clients-form-group">
                  <label>Mode de paiement</label>
                  <select
                    value={editClientData.mode_paiement}
                    onChange={(e) => setEditClientData({...editClientData, mode_paiement: e.target.value})}
                  >
                    <option value="">Sélectionner...</option>
                    {MODES_PAIEMENT.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Heure de réservation</label>
                  <input
                    type="time"
                    value={editClientData.heure_reservation}
                    onChange={(e) => setEditClientData({...editClientData, heure_reservation: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="gestion-clients-modal-footer">
              <button 
                className="gestion-clients-secondary-btn"
                onClick={() => setShowEditClientModal(false)}
              >
                Annuler
              </button>
              <button 
                className="gestion-clients-primary-btn"
                onClick={handleEditCurrentClient}
                disabled={!editClientData.nom || !editClientData.prenom || !editClientData.email || !editClientData.telephone}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestion Abonnement */}
      {showAbonnementModal && selectedClientData && (
        <div className="gestion-clients-modal-overlay">
          <div className="gestion-clients-modal gestion-clients-abonnement-modal">
            <div className="gestion-clients-modal-header">
              <h3>Gestion de l'Abonnement</h3>
              <button className="gestion-clients-close-btn" onClick={() => setShowAbonnementModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="gestion-clients-modal-body">
              <div className="gestion-clients-client-info-modal">
                <div className="gestion-clients-avatar-small">
                  {renderAvatar(selectedClientData)}
                </div>
                <div>
                  <h4>{getClientFullName(selectedClientData)}</h4>
                  <small>ID: {selectedClientData.idclient}</small>
                </div>
              </div>
              <div className="gestion-clients-form-group">
                <label>Type d'abonnement *</label>
                <select
                  value={abonnementData.type_abonnement}
                  onChange={(e) => setAbonnementData({...abonnementData, type_abonnement: e.target.value})}
                  required
                >
                  <option value="">Sélectionner...</option>
                  {TYPES_ABONNEMENT.map(type => (
                    <option key={type} value={type}>{getAbonnementLabel(type)}</option>
                  ))}
                </select>
              </div>
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Date début *</label>
                  <input
                    type="date"
                    value={abonnementData.date_debut}
                    onChange={(e) => setAbonnementData({...abonnementData, date_debut: e.target.value})}
                    required
                  />
                </div>
                <div className="gestion-clients-form-group">
                  <label>Date fin *</label>
                  <input
                    type="date"
                    value={abonnementData.date_fin}
                    onChange={(e) => setAbonnementData({...abonnementData, date_fin: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="gestion-clients-form-row">
                <div className="gestion-clients-form-group">
                  <label>Prix total (DH) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={abonnementData.prix_total}
                    onChange={(e) => setAbonnementData({...abonnementData, prix_total: e.target.value})}
                    required
                  />
                </div>
                <div className="gestion-clients-form-group">
                  <label>Mode de paiement</label>
                  <select
                    value={abonnementData.mode_paiement}
                    onChange={(e) => setAbonnementData({...abonnementData, mode_paiement: e.target.value})}
                  >
                    <option value="">Sélectionner...</option>
                    {MODES_PAIEMENT.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="gestion-clients-modal-footer">
              <button 
                className="gestion-clients-secondary-btn"
                onClick={() => setShowAbonnementModal(false)}
              >
                Annuler
              </button>
              <button 
                className="gestion-clients-primary-btn"
                onClick={handleUpdateAbonnement}
                disabled={!abonnementData.type_abonnement || !abonnementData.date_debut || !abonnementData.date_fin || !abonnementData.prix_total}
              >
                Mettre à jour l'abonnement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Photo */}
      {showPhotoModal && selectedClientData && (
        <div className="gestion-clients-modal-overlay">
          <div className="gestion-clients-modal gestion-clients-photo-modal">
            <div className="gestion-clients-modal-header">
              <h3>Photo du Client</h3>
              <button className="gestion-clients-close-btn" onClick={() => setShowPhotoModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="gestion-clients-modal-body">
              <div className="photo-upload-section">
                <div className="photo-upload-container">
                  <div className="photo-preview-container">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="photo-preview" />
                    ) : selectedClientData.photo_abonne ? (
                      <img src={selectedClientData.photo_abonne} alt="Current" className="photo-preview" />
                    ) : (
                      <div className="photo-placeholder">
                        <FaUserCircle />
                        <p>Aucune photo</p>
                      </div>
                    )}
                  </div>
                  <button className="photo-upload-btn">
                    <FaUpload /> Choisir une nouvelle photo
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="photo-upload-input"
                    />
                  </button>
                  {photoFile && (
                    <p className="photo-file-name">{photoFile.name} ({(photoFile.size / 1024).toFixed(1)} KB)</p>
                  )}
                  <p className="photo-instructions">
                    Taille max: 5MB • Formats: JPG, PNG, GIF
                  </p>
                </div>
              </div>
            </div>
            <div className="gestion-clients-modal-footer">
              <button 
                className="gestion-clients-secondary-btn"
                onClick={() => setShowPhotoModal(false)}
              >
                Annuler
              </button>
              <button 
                className="gestion-clients-primary-btn"
                onClick={handlePhotoUpload}
                disabled={!photoFile}
              >
                <FaUpload /> Mettre à jour la photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Carte d'Abonnement */}
      {showCarteModal && carteClientData && (
        <div className="gestion-clients-modal-overlay">
          <div className="gestion-clients-modal gestion-clients-carte-modal">
            <div className="gestion-clients-modal-header">
              <h3>Carte d'Abonnement</h3>
              <button className="gestion-clients-close-btn" onClick={() => setShowCarteModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="gestion-clients-modal-body">
              <div className="carte-abonnement-wrapper">
                {renderCarteAbonnement()}
              </div>
              <div className="carte-actions">
                <button 
                  className="carte-print-btn"
                  onClick={handlePrintCarte}
                >
                  <FaPrint /> Imprimer la carte
                </button>
                <button 
                  className="gestion-clients-secondary-btn"
                  onClick={() => setShowCarteModal(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Statistiques */}
      {showStatistiquesModal && statistiques && (
        <div className="gestion-clients-modal-overlay">
          <div className="gestion-clients-modal gestion-clients-stats-modal">
            <div className="gestion-clients-modal-header">
              <h3>Statistiques des Clients</h3>
              <button className="gestion-clients-close-btn" onClick={() => setShowStatistiquesModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="gestion-clients-modal-body">
              <div className="gestion-clients-stats-grid">
                <div className="gestion-clients-stat-box">
                  <h4>Total Clients</h4>
                  <div className="gestion-clients-stat-number">{statistiques.total}</div>
                </div>
                <div className="gestion-clients-stat-box">
                  <h4>Clients Actifs</h4>
                  <div className="gestion-clients-stat-number">{statistiques.actifs}</div>
                </div>
                <div className="gestion-clients-stat-box">
                  <h4>Clients Inactifs</h4>
                  <div className="gestion-clients-stat-number">{statistiques.inactifs}</div>
                </div>
                <div className="gestion-clients-stat-box">
                  <h4>Revenu Total</h4>
                  <div className="gestion-clients-stat-number">{formatCurrency(statistiques.revenuTotal)}</div>
                </div>
              </div>

              <div className="gestion-clients-stats-section">
                <h4>Répartition par Statut</h4>
                <div className="gestion-clients-stats-list">
                  {statistiques.parStatut.map((item, index) => (
                    <div key={index} className="gestion-clients-stat-item">
                      <div className="gestion-clients-stat-label">
                        {getStatusLabel(item.statut)}
                      </div>
                      <div className="gestion-clients-stat-value">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gestion-clients-stats-section">
                <h4>Répartition par Type d'Abonnement</h4>
                <div className="gestion-clients-stats-list">
                  {statistiques.parAbonnement.map((item, index) => (
                    <div key={index} className="gestion-clients-stat-item">
                      <div className="gestion-clients-stat-label">
                        {getAbonnementLabel(item.type_abonnement)}
                      </div>
                      <div className="gestion-clients-stat-value">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="gestion-clients-modal-footer">
              <button 
                className="gestion-clients-primary-btn"
                onClick={() => setShowStatistiquesModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {showDeleteClientModal && selectedClientData && (
        <div className="gestion-clients-modal-overlay">
          <div className="gestion-clients-modal gestion-clients-delete-modal">
            <div className="gestion-clients-modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="gestion-clients-close-btn" onClick={() => setShowDeleteClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="gestion-clients-modal-body">
              <div className="gestion-clients-warning">
                <div className="gestion-clients-warning-icon">
                  <FaTrash />
                </div>
                <p>Êtes-vous sûr de vouloir supprimer le client <strong>{getClientFullName(selectedClientData)}</strong> ?</p>
              </div>
              <div className="gestion-clients-delete-details">
                <p><strong>ID:</strong> {selectedClientData.idclient}</p>
                <p><strong>Email:</strong> {selectedClientData.email}</p>
                <p><strong>Abonnement:</strong> {getAbonnementLabel(selectedClientData.type_abonnement)}</p>
              </div>
              <p className="gestion-clients-warning-text">
                ⚠️ Cette action est irréversible. Toutes les données associées à ce client seront supprimées.
              </p>
            </div>
            <div className="gestion-clients-modal-footer">
              <button 
                className="gestion-clients-secondary-btn"
                onClick={() => setShowDeleteClientModal(false)}
              >
                Annuler
              </button>
              <button 
                className="gestion-clients-danger-btn"
                onClick={handleDeleteSelectedClient}
              >
                <FaTrash /> Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {clientToast && (
        <div className={`gestion-clients-toast gestion-clients-toast-${clientToast.type}`}>
          {clientToast.message}
        </div>
      )}
    </div>
  );
};

export default GestionClients;