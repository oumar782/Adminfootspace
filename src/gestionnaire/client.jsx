import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
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
    <div className="gestion-clients-container">
      <div className="gestion-clients-wrapper">
        {/* Header */}
        <div className="gestion-clients-header">
          <h1>Gestion des Clients</h1>
          <button 
            className="gestion-clients-add-btn gestion-clients-primary-btn"
            onClick={() => setShowAddClientModal(true)}
          >
            <FaPlus /> Ajouter Client
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className="gestion-clients-toolbar">
          <div className="gestion-clients-search">
            <FaSearch className="gestion-clients-search-icon" />
            <input
              type="text"
              className="gestion-clients-search-input"
              placeholder="Rechercher par nom, prénom, email, téléphone ou ID..."
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
              <option value="nom-asc">Trier par nom (A-Z)</option>
              <option value="nom-desc">Trier par nom (Z-A)</option>
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
            </select>
          </div>
        </div>

        {/* Tableau des clients */}
        <div className="gestion-clients-table-container">
          <table className="gestion-clients-table">
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
                  <td colSpan="7" className="gestion-clients-loading">
                    <div className="gestion-clients-spinner"></div>
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
                      <span className={`gestion-clients-status gestion-clients-status-${client.statut}`}>
                        {getStatusLabel(client.statut)}
                      </span>
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
                ))
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
              <h3>Ajouter un Client</h3>
              <button className="gestion-clients-close-btn" onClick={() => setShowAddClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="gestion-clients-modal-body">
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
                <div className="gestion-clients-avatar">
                  {getClientInitials(selectedClientData)}
                </div>
                <div className="gestion-clients-detail-info">
                  <h2>{getClientFullName(selectedClientData)}</h2>
                  <span className={`gestion-clients-status gestion-clients-status-${selectedClientData.statut}`}>
                    {getStatusLabel(selectedClientData.statut)}
                  </span>
                </div>
              </div>
              <div className="gestion-clients-detail-item">
                <div className="gestion-clients-detail-label">ID</div>
                <div className="gestion-clients-detail-value">{selectedClientData.idclient}</div>
              </div>
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
                <div className="gestion-clients-detail-label">Statut</div>
                <div className="gestion-clients-detail-value">
                  {getStatusLabel(selectedClientData.statut)}
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
              <p className="gestion-clients-warning-text">
                Cette action est irréversible et supprimera toutes les données associées à ce client.
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