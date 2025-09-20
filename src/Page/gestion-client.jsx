import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import './GestionClient.css';

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
  const [selectedClientData, setSelectedClientData] = useState(null);

  // Formulaires
  const [newClientData, setNewClientData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    statut: 'actif'
  });

  const [editClientData, setEditClientData] = useState({
    idclient: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    statut: 'actif'
  });

  // Toast
  const [clientToast, setClientToast] = useState(null);

  // Constantes
  const CLIENTS_PER_PAGE = 10;
  const API_URL = 'https://backend-foot-omega.vercel.app/api/clients';

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

  useEffect(() => {
    fetchAllClientsData();
  }, []);

  // Filtrer, rechercher et trier les clients
  const filteredAndSortedClients = useMemo(() => {
    let result = [...allClients];
    
    // Appliquer le filtre de statut
    if (clientsFilter !== 'all') {
      result = result.filter(client => client.statut === clientsFilter);
    }
    
    // Appliquer la recherche
    if (searchClientsTerm) {
      const searchTerm = searchClientsTerm.toLowerCase().trim();
      result = result.filter(client => 
        client.nom.toLowerCase().includes(searchTerm) ||
        client.prenom.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.telephone.includes(searchTerm) ||
        client.idclient.toString().includes(searchTerm)
      );
    }
    
    // Appliquer le tri
    if (clientsSort === 'nom-asc') {
      result.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (clientsSort === 'nom-desc') {
      result.sort((a, b) => b.nom.localeCompare(a.nom));
    }
    
    return result;
  }, [allClients, clientsFilter, searchClientsTerm, clientsSort]);

  // Pagination des résultats filtrés
  const paginatedClients = useMemo(() => {
    const startIndex = (currentClientsPage - 1) * CLIENTS_PER_PAGE;
    return filteredAndSortedClients.slice(startIndex, startIndex + CLIENTS_PER_PAGE);
  }, [filteredAndSortedClients, currentClientsPage]);

  // Mettre à jour la pagination quand les résultats changent
  useEffect(() => {
    const totalPages = Math.ceil(filteredAndSortedClients.length / CLIENTS_PER_PAGE);
    setTotalClientsPages(totalPages || 1);
    
    // Si la page actuelle est supérieure au nombre total de pages, revenir à la première page
    if (currentClientsPage > totalPages && totalPages > 0) {
      setCurrentClientsPage(1);
    }
  }, [filteredAndSortedClients, currentClientsPage]);

  // Gestion des actions CRUD
  const handleAddNewClient = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClientData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNewClientData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          statut: 'actif'
        });
        setShowAddClientModal(false);
        showClientToast('Client ajouté avec succès', 'success');
        fetchAllClientsData(); // Recharger tous les clients
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
        body: JSON.stringify({
          nom: editClientData.nom,
          prenom: editClientData.prenom,
          email: editClientData.email,
          telephone: editClientData.telephone,
          statut: editClientData.statut
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowEditClientModal(false);
        showClientToast('Client modifié avec succès', 'success');
        fetchAllClientsData(); // Recharger tous les clients
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
        fetchAllClientsData(); // Recharger tous les clients
      } else {
        showClientToast(data.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showClientToast('Erreur lors de la suppression du client', 'error');
    }
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

  // Render
  return (
    <div className="clients-management-container">
      <div className="clients-table-wrapper">
        {/* Header */}
        <div className="clients-header-section">
          <h1>Gestion des Clients</h1>
          <button 
            className="clients-add-btn clients-primary-btn"
            onClick={() => setShowAddClientModal(true)}
          >
            <FaPlus /> Ajouter Client
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className="clients-toolbar-section">
          <div className="clients-search-container">
            <FaSearch className="clients-search-icon" />
            <input
              type="text"
              className="clients-search-input"
              placeholder="Rechercher par nom, prénom, email, téléphone ou ID..."
              value={searchClientsTerm}
              onChange={(e) => setSearchClientsTerm(e.target.value)}
            />
            {searchClientsTerm && (
              <button 
                className="clients-clear-search"
                onClick={() => setSearchClientsTerm('')}
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="clients-filters-container">
            <select 
              className="clients-filter-select"
              value={clientsSort}
              onChange={(e) => setClientsSort(e.target.value)}
            >
              <option value="nom-asc">Trier par nom (A-Z)</option>
              <option value="nom-desc">Trier par nom (Z-A)</option>
            </select>
            <select 
              className="clients-filter-select"
              value={clientsFilter}
              onChange={(e) => setClientsFilter(e.target.value)}
            >
              <option value="all">Tous les clients</option>
              <option value="actif">Clients actifs</option>
              <option value="inactif">Clients inactifs</option>
              <option value="en attente">En attente</option>
            </select>
          </div>
        </div>

        {/* Tableau des clients */}
        <div className="clients-table-responsive">
          <table className="clients-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="clients-loading-message">
                    <div className="clients-loading-spinner"></div>
                    Chargement en cours...
                  </td>
                </tr>
              ) : paginatedClients.length > 0 ? (
                paginatedClients.map(client => (
                  <tr key={client.idclient}>
                    <td>{client.idclient}</td>
                    <td>{client.nom}</td>
                    <td>{client.prenom}</td>
                    <td>{client.email}</td>
                    <td>{client.telephone}</td>
                    <td>
                      <span className={`clients-status-badge clients-${client.statut}-badge`}>
                        {getStatusLabel(client.statut)}
                      </span>
                    </td>
                    <td>
                      <div className="clients-actions-group">
                        <button 
                          className="clients-action-btn clients-view-btn"
                          onClick={() => {
                            setSelectedClientData(client);
                            setShowViewClientModal(true);
                          }}
                          title="Voir détails"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="clients-action-btn clients-edit-btn"
                          onClick={() => {
                            setEditClientData({ ...client });
                            setShowEditClientModal(true);
                          }}
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="clients-action-btn clients-delete-btn"
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="clients-no-data">
                    <div className="clients-no-data-icon">
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
        <div className="clients-pagination-section">
          <div className="clients-pagination-info">
            {filteredAndSortedClients.length} client{filteredAndSortedClients.length !== 1 ? 's' : ''} trouvé{filteredAndSortedClients.length !== 1 ? 's' : ''}
            {(searchClientsTerm || clientsFilter !== 'all') && ' avec les filtres appliqués'}
          </div>
          <div className="clients-pagination-controls">
            <button 
              className="clients-pagination-btn"
              onClick={() => setCurrentClientsPage(prev => Math.max(prev - 1, 1))}
              disabled={currentClientsPage === 1}
            >
              <FaChevronLeft /> Précédent
            </button>
            <span className="clients-pagination-numbers">
              Page {currentClientsPage} sur {totalClientsPages}
            </span>
            <button 
              className="clients-pagination-btn"
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
        <div className="clients-modal-overlay">
          <div className="clients-add-modal">
            <div className="clients-modal-header">
              <h3>Ajouter un Client</h3>
              <button className="clients-close-btn" onClick={() => setShowAddClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="clients-modal-body">
              <div className="clients-form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  value={newClientData.nom}
                  onChange={(e) => setNewClientData({...newClientData, nom: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
                <label>Prénom *</label>
                <input
                  type="text"
                  value={newClientData.prenom}
                  onChange={(e) => setNewClientData({...newClientData, prenom: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={newClientData.email}
                  onChange={(e) => setNewClientData({...newClientData, email: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
                <label>Téléphone *</label>
                <input
                  type="tel"
                  value={newClientData.telephone}
                  onChange={(e) => setNewClientData({...newClientData, telephone: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
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
            <div className="clients-modal-footer">
              <button 
                className="clients-secondary-btn"
                onClick={() => setShowAddClientModal(false)}
              >
                Annuler
              </button>
              <button 
                className="clients-primary-btn"
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
        <div className="clients-modal-overlay">
          <div className="clients-view-modal">
            <div className="clients-modal-header">
              <h3>Détails du Client</h3>
              <button className="clients-close-btn" onClick={() => setShowViewClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="clients-modal-body">
              <div className="clients-detail-header">
                <div className="clients-avatar">
                  {getClientInitials(selectedClientData)}
                </div>
                <div className="clients-detail-info">
                  <h2>{getClientFullName(selectedClientData)}</h2>
                  <span className={`clients-status-badge clients-${selectedClientData.statut}-badge`}>
                    {getStatusLabel(selectedClientData.statut)}
                  </span>
                </div>
              </div>
              <div className="clients-detail-item">
                <div className="clients-detail-label">ID</div>
                <div className="clients-detail-value">{selectedClientData.idclient}</div>
              </div>
              <div className="clients-detail-item">
                <div className="clients-detail-label">Nom</div>
                <div className="clients-detail-value">{selectedClientData.nom}</div>
              </div>
              <div className="clients-detail-item">
                <div className="clients-detail-label">Prénom</div>
                <div className="clients-detail-value">{selectedClientData.prenom}</div>
              </div>
              <div className="clients-detail-item">
                <div className="clients-detail-label">Email</div>
                <div className="clients-detail-value">{selectedClientData.email}</div>
              </div>
              <div className="clients-detail-item">
                <div className="clients-detail-label">Téléphone</div>
                <div className="clients-detail-value">{selectedClientData.telephone}</div>
              </div>
              <div className="clients-detail-item">
                <div className="clients-detail-label">Statut</div>
                <div className="clients-detail-value">
                  {getStatusLabel(selectedClientData.statut)}
                </div>
              </div>
            </div>
            <div className="clients-modal-footer">
              <button 
                className="clients-primary-btn"
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
        <div className="clients-modal-overlay">
          <div className="clients-edit-modal">
            <div className="clients-modal-header">
              <h3>Modifier le Client</h3>
              <button className="clients-close-btn" onClick={() => setShowEditClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="clients-modal-body">
              <div className="clients-form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  value={editClientData.nom}
                  onChange={(e) => setEditClientData({...editClientData, nom: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
                <label>Prénom *</label>
                <input
                  type="text"
                  value={editClientData.prenom}
                  onChange={(e) => setEditClientData({...editClientData, prenom: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={editClientData.email}
                  onChange={(e) => setEditClientData({...editClientData, email: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
                <label>Téléphone *</label>
                <input
                  type="tel"
                  value={editClientData.telephone}
                  onChange={(e) => setEditClientData({...editClientData, telephone: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
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
            <div className="clients-modal-footer">
              <button 
                className="clients-secondary-btn"
                onClick={() => setShowEditClientModal(false)}
              >
                Annuler
              </button>
              <button 
                className="clients-primary-btn"
                onClick={handleEditCurrentClient}
                disabled={!editClientData.nom || !editClientData.prenom || !editClientData.email || !editClientData.telephone}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {showDeleteClientModal && selectedClientData && (
        <div className="clients-modal-overlay">
          <div className="clients-delete-modal">
            <div className="clients-modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="clients-close-btn" onClick={() => setShowDeleteClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="clients-delete-modal-body">
              <div className="clients-warning-container">
                <div className="clients-warning-icon">
                  <FaTrash />
                </div>
                <p>Êtes-vous sûr de vouloir supprimer le client <strong>{getClientFullName(selectedClientData)}</strong> ?</p>
              </div>
              <p className="clients-warning-text">
                Cette action est irréversible et supprimera toutes les données associées à ce client.
              </p>
            </div>
            <div className="clients-modal-footer">
              <button 
                className="clients-secondary-btn"
                onClick={() => setShowDeleteClientModal(false)}
              >
                Annuler
              </button>
              <button 
                className="clients-danger-btn"
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
        <div className={`clients-toast clients-toast-${clientToast.type}`}>
          {clientToast.message}
        </div>
      )}
    </div>
  );
};

export default GestionClients;