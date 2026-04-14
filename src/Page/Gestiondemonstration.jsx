import React, { useState, useEffect } from 'react';
import './demonstration.css';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(), 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    return (
        <div className={`toast toast-${type}`}>
            <p>{message}</p>
            <button className="toast-close" onClick={onClose}>&times;</button>
        </div>
    );
};

const ClientModal = ({ client, onClose, isOpen }) => {
    const [modalState, setModalState] = useState('exited');

    useEffect(() => {
        if (isOpen) {
            setModalState('entering');
            setTimeout(() => setModalState('entered'), 10);
        } else {
            setModalState('exiting');
            setTimeout(() => setModalState('exited'), 300);
        }
    }, [isOpen]);

    if (!isOpen && modalState === 'exited') return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`modal-overlay ${modalState !== 'exited' ? 'active' : ''}`}>
            <div className="modal-overlay-bg" onClick={onClose} />
            <div className={`modal-content ${modalState}`}>
                <button onClick={onClose} className="modal-close-btn" aria-label="Fermer">
                    &times;
                </button>
                <div className="modal-body">
                    <h2 className="modal-title">Détails complets de la Démonstration</h2>
                    <div className="client-details-container">
                        <div className="client-info-section">
                            <div className="detail-item">
                                <span className="detail-label">ID:</span>
                                <span className="detail-value">{client?.id_demonstration || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Date de demande:</span>
                                <span className="detail-value">{formatDate(client?.date_demande)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Statut:</span>
                                <span className={`status-badge status-${client?.statut?.toLowerCase().replace(' ', '-')}`}>
                                    {client?.statut || 'En attente'}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Nom complet:</span>
                                <span className="detail-value">{client?.nom || 'Non renseigné'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Adresse email:</span>
                                <span className="detail-value">{client?.email || 'Non renseigné'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Nom de l'entreprise:</span>
                                <span className="detail-value">{client?.entreprise || 'Non spécifié'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Nombre de terrains:</span>
                                <span className="detail-value">{client?.nombreterrains || 0}</span>
                            </div>
                        </div>
                        <div className="message-section">
                            <div className="detail-item message-detail">
                                <span className="detail-label">Message / Demande:</span>
                                <div className="message-content">
                                    {client?.message 
                                        ? <p className="message-text">{client.message}</p>
                                        : <p className="no-message">Aucun message fourni</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={onClose} className="btn btn-secondary">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClientForm = ({ clientToEdit, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        entreprise: '',
        nombreterrains: '',
        message: '',
        statut: 'En attente'
    });

    useEffect(() => {
        if (clientToEdit) {
            console.log('ClientToEdit dans le formulaire:', clientToEdit);
            setFormData({
                nom: clientToEdit.nom || '',
                email: clientToEdit.email || '',
                entreprise: clientToEdit.entreprise || '',
                nombreterrains: clientToEdit.nombreterrains || '',
                message: clientToEdit.message || '',
                statut: clientToEdit.statut || 'En attente'
            });
        }
    }, [clientToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Vérifier que tous les champs requis sont présents
        if (!formData.nom || !formData.email || !formData.entreprise || !formData.nombreterrains || !formData.message) {
            alert('Veuillez remplir tous les champs requis');
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="client-form animate-fade-in">
            <h2 className="form-title">
                {clientToEdit ? 'Modifier la démonstration' : 'Ajouter une nouvelle démonstration'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    {clientToEdit && (
                        <>
                            <div className="form-group">
                                <label htmlFor="id" className="form-label">ID</label>
                                <input
                                    type="text"
                                    id="id"
                                    name="id"
                                    value={clientToEdit.id_demonstration || ''}
                                    className="form-input"
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date_demande" className="form-label">Date de demande</label>
                                <input
                                    type="text"
                                    id="date_demande"
                                    name="date_demande"
                                    value={clientToEdit.date_demande ? new Date(clientToEdit.date_demande).toLocaleString() : ''}
                                    className="form-input"
                                    disabled
                                />
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <label htmlFor="nom" className="form-label">Nom complet *</label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className="form-input"
                            required
                            placeholder="Entrez le nom complet"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Adresse email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            required
                            placeholder="exemple@entreprise.com"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="entreprise" className="form-label">Nom de l'entreprise *</label>
                        <input
                            type="text"
                            id="entreprise"
                            name="entreprise"
                            value={formData.entreprise}
                            onChange={handleChange}
                            className="form-input"
                            required
                            placeholder="Nom de l'entreprise"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombreterrains" className="form-label">Nombre de terrains *</label>
                        <input
                            type="number"
                            id="nombreterrains"
                            name="nombreterrains"
                            value={formData.nombreterrains}
                            onChange={handleChange}
                            className="form-input"
                            required
                            min="0"
                            placeholder="0"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="statut" className="form-label">Statut de la démonstration</label>
                        <select
                            id="statut"
                            name="statut"
                            value={formData.statut}
                            onChange={handleChange}
                            className="form-input"
                            required
                        >
                            <option value="En attente">📋 En attente</option>
                            <option value="Confirmé">✅ Confirmé</option>
                            <option value="Réalisé">🎯 Réalisé</option>
                            <option value="Annulé">❌ Annulé</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="message" className="form-label">Message / Demande *</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="form-textarea"
                            required
                            placeholder="Décrivez votre demande ou vos besoins spécifiques..."
                        />
                    </div>
                </div>
                <div className="form-footer">
                    <button type="button" onClick={onCancel} className="btn btn-cancel">
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {clientToEdit ? 'Mettre à jour' : 'Ajouter la démonstration'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const ClientsList = ({ clients = [], onEdit, onDelete, onView, isLoading }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = clients.filter(client => {
        if (!client) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
            (client.nom?.toLowerCase().includes(searchLower) ?? false) ||
            (client.email?.toLowerCase().includes(searchLower) ?? false) ||
            (client.entreprise?.toLowerCase().includes(searchLower) ?? false) ||
            (client.statut?.toLowerCase().includes(searchLower) ?? false) ||
            (String(client.nombreterrains).includes(searchLower) ?? false) ||
            (String(client.id_demonstration).includes(searchLower) ?? false) ||
            (client.message?.toLowerCase().includes(searchLower) ?? false)
        );
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR');
        } catch {
            return '';
        }
    };

    const getStatutEmoji = (statut) => {
        switch (statut) {
            case 'En attente': return '📋';
            case 'Confirmé': return '✅';
            case 'Réalisé': return '🎯';
            case 'Annulé': return '❌';
            default: return '📋';
        }
    };

    return (
        <div className="clients-list animate-fade-in">
            <div className="list-header">
                <h2 className="list-title">Liste des Démonstrations</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email, entreprise, statut..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
            {isLoading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Chargement des démonstrations...</p>
                </div>
            ) : filteredClients.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3 className="empty-title">Aucune démonstration trouvée</h3>
                    <p className="empty-message">
                        {searchTerm ? 'Aucun résultat pour votre recherche' : 'Commencez par ajouter une nouvelle démonstration'}
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="clients-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Entreprise</th>
                                <th>Terrains</th>
                                <th>Statut</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((client) => (
                                <tr key={client.id_demonstration} className="table-row">
                                    <td>{client.id_demonstration}</td>
                                    <td>{formatDate(client.date_demande)}</td>
                                    <td>
                                        <div className="client-info" onClick={() => onView(client)} style={{ cursor: 'pointer' }}>
                                            <div className="client-avatar">
                                                {client.nom?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="client-details">
                                                <div className="client-name">{client.nom}</div>
                                                {client.message && (
                                                    <div className="client-message-preview">
                                                        {client.message.length > 30 ? client.message.substring(0, 30) + '...' : client.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{client.email}</td>
                                    <td>{client.entreprise || 'Non spécifié'}</td>
                                    <td>
                                        <span className="fields-count">
                                            {client.nombreterrains}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${client.statut?.toLowerCase().replace(' ', '-')}`}>
                                            {getStatutEmoji(client.statut)} {client.statut || 'En attente'}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <div className="actions-container">
                                            <button
                                                onClick={() => onView(client)}
                                                className="action-btn view-btn"
                                                title="Voir les détails"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                onClick={() => {
                                                    console.log('Edit button clicked for client:', client);
                                                    onEdit(client);
                                                }}
                                                className="action-btn edit-btn"
                                                title="Modifier"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => onDelete(client.id_demonstration)}
                                                className="action-btn delete-btn"
                                                title="Supprimer"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const Demonstration = () => {
    const [demonstrations, setDemonstrations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [demonstrationToEdit, setDemonstrationToEdit] = useState(null);
    const [demonstrationToView, setDemonstrationToView] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toasts, setToasts] = useState([]);

    const API_URL = 'https://backend-foot-omega.vercel.app/api/demonstration';

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), 3000);
    };

    const fetchDemonstrations = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            const result = await response.json();
            console.log('Fetch result complet:', result);
            
            if (result.success && Array.isArray(result.data)) {
                console.log('Données reçues:', result.data);
                setDemonstrations(result.data);
            } else {
                console.error('Format de réponse inattendu:', result);
                setDemonstrations([]);
            }
            setError(null);
        } catch (err) {
            console.error('Erreur fetch:', err);
            setError('Erreur lors du chargement des données');
            addToast('Erreur lors du chargement des données', "error");
            setDemonstrations([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDemonstrations();
    }, []);

    const handleAddDemonstration = () => {
        setDemonstrationToEdit(null);
        setShowForm(true);
    };

    const handleEditDemonstration = (demonstration) => {
        console.log('=== handleEditDemonstration appelé ===');
        console.log('Démonstration reçue:', demonstration);
        console.log('ID récupéré:', demonstration.id_demonstration);
        
        if (!demonstration || !demonstration.id_demonstration) {
            console.error('ID invalide:', demonstration);
            addToast("ID de démonstration invalide", "error");
            return;
        }
        
        setDemonstrationToEdit(demonstration);
        setShowForm(true);
    };

    const handleDeleteDemonstration = async (id) => {
        console.log('=== handleDeleteDemonstration appelé ===');
        console.log('ID reçu pour suppression:', id);
        
        if (!id) {
            addToast("ID invalide", "error");
            return;
        }
        
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette démonstration ?')) {
            try {
                const url = `${API_URL}/${id}`;
                console.log('URL de suppression:', url);
                
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                const result = await response.json();
                console.log('Résultat suppression:', result);
                
                if (response.ok && result.success) {
                    addToast("Démonstration supprimée avec succès", "success");
                    await fetchDemonstrations();
                } else {
                    throw new Error(result.message || "Échec de la suppression");
                }
            } catch (err) {
                console.error("Erreur suppression:", err);
                addToast(err.message || "Échec de la suppression", "error");
            }
        }
    };

    const handleViewDemonstration = (demonstration) => {
        console.log('View demonstration:', demonstration);
        setDemonstrationToView(demonstration);
        setIsModalOpen(true);
    };

    const handleSubmitForm = async (formData) => {
        console.log('=== handleSubmitForm appelé ===');
        console.log('demonstrationToEdit:', demonstrationToEdit);
        
        try {
            const payload = {
                nom: formData.nom,
                email: formData.email,
                entreprise: formData.entreprise,
                nombreterrains: parseInt(formData.nombreterrains, 10),
                message: formData.message,
                statut: formData.statut
            };
            
            console.log('Payload à envoyer:', payload);
            
            let response;
            let url = API_URL;
            let method = 'POST';
            
            if (demonstrationToEdit) {
                const editId = demonstrationToEdit.id_demonstration;
                console.log('ID pour modification:', editId);
                
                if (!editId) {
                    throw new Error("ID de démonstration invalide pour la modification");
                }
                
                url = `${API_URL}/${editId}`;
                method = 'PUT';
                console.log('URL PUT:', url);
            } else {
                console.log('URL POST:', url);
            }
            
            response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            console.log('Résultat de la requête:', result);
            
            if (response.ok && result.success) {
                addToast(
                    demonstrationToEdit ? "Démonstration mise à jour avec succès" : "Démonstration créée avec succès", 
                    "success"
                );
                await fetchDemonstrations();
                setShowForm(false);
                setDemonstrationToEdit(null);
            } else {
                throw new Error(result.message || "Erreur lors de la sauvegarde");
            }
        } catch (err) {
            console.error('Erreur sauvegarde:', err);
            addToast(err.message || 'Erreur lors de la sauvegarde', "error");
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setDemonstrationToEdit(null);
    };

    return (
        <div className="app-container">
            <div className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Gestion des démonstrations</h1>
                    {!showForm && (
                        <button
                            onClick={handleAddDemonstration}
                            className="btn btn-primary add-client-btn"
                        >
                            + Ajouter une démonstration
                        </button>
                    )}
                </div>
                
                {error && (
                    <div className="error-alert">
                        <p>{error}</p>
                        <button onClick={() => setError(null)} className="close-error-btn">
                            &times;
                        </button>
                    </div>
                )}
                
                {showForm ? (
                    <ClientForm
                        clientToEdit={demonstrationToEdit}
                        onSubmit={handleSubmitForm}
                        onCancel={handleCancelForm}
                    />
                ) : (
                    <ClientsList
                        clients={demonstrations}
                        onEdit={handleEditDemonstration}
                        onDelete={handleDeleteDemonstration}
                        onView={handleViewDemonstration}
                        isLoading={isLoading}
                    />
                )}
            </div>
            
            <ClientModal
                client={demonstrationToView}
                onClose={() => setIsModalOpen(false)}
                isOpen={isModalOpen}
            />
            
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    />
                ))}
            </div>
        </div>
    );
};

export default Demonstration;