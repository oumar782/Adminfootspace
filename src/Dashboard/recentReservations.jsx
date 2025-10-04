import React, { useState, useEffect } from 'react';
import './custom.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecentReservations = () => {
  const [expandedReservation, setExpandedReservation] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://backend-foot-omega.vercel.app/api/reservation';

  // Charger les réservations
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();
      
      if (result.success) {
        const formattedReservations = result.data.map(res => ({
          id: res.id,
          client: {
            name: `${res.prenom} ${res.nomclient}`,
            initials: `${res.prenom?.charAt(0) || ''}${res.nomclient?.charAt(0) || ''}`.toUpperCase(),
            email: res.email,
            telephone: res.telephone
          },
          field: res.nomterrain || `Terrain ${res.numeroterrain} - ${res.typeterrain || 'Standard'}`,
          date: new Date(res.datereservation).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          }),
          time: `${res.heurereservation} - ${res.heurefin || 'Fin'}`,
          duration: calculateDuration(res.heurereservation, res.heurefin),
          status: mapStatus(res.statut),
          players: 10, // Valeur par défaut, à adapter selon vos données
          amount: res.tarif || 0,
          rawData: res
        }));
        setReservations(formattedReservations);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return "1h30";
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const diff = (endTime - startTime) / (1000 * 60 * 60);
    return `${diff}h`;
  };

  const mapStatus = (status) => {
    const statusMap = {
      'confirmée': 'confirmé',
      'annulée': 'annulé',
      'en attente': 'en attente',
      'terminée': 'terminé'
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Confirmer une réservation
  const confirmReservation = async (reservationId) => {
    try {
      const response = await fetch(`${API_URL}/${reservationId}/statut`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: 'confirmée' })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Réservation confirmée avec succès !');
        if (result.emailSent) {
          toast.info('Email de confirmation envoyé au client');
        }
        fetchReservations(); // Recharger les données
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Erreur confirmation:', error);
      toast.error('Erreur lors de la confirmation');
    }
  };

  // Annuler une réservation
  const cancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`${API_URL}/${reservationId}/statut`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: 'annulée' })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Réservation annulée avec succès !');
        fetchReservations();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Erreur annulation:', error);
      toast.error('Erreur lors de l\'annulation');
    }
  };

  // Envoyer un email
  const sendEmail = (reservation) => {
    const subject = `Confirmation de votre réservation ${reservation.id}`;
    const body = `
Bonjour ${reservation.client.name},

Votre réservation pour le ${reservation.date} à ${reservation.time.split(' - ')[0]} a été confirmée.

Détails de votre réservation:
- Terrain: ${reservation.field}
- Date: ${reservation.date}
- Heure: ${reservation.time}
- Durée: ${reservation.duration}
- Montant: ${reservation.amount}€

Nous vous remercions pour votre confiance !

Cordialement,
L'équipe du complexe sportif
    `.trim();

    const mailtoLink = `mailto:${reservation.client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    toast.info('Ouverture de votre client email...');
  };

  // Envoyer un message WhatsApp
  const sendWhatsApp = (reservation) => {
    const message = `Bonjour ${reservation.client.name}, votre réservation pour le ${reservation.date} à ${reservation.time.split(' - ')[0]} sur le ${reservation.field} a été confirmée. Merci !`;
    const whatsappLink = `https://wa.me/${reservation.client.telephone?.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
    toast.info('Ouverture de WhatsApp...');
  };

  // Générer et télécharger le PDF
  const generatePDF = (reservation) => {
    const pdfContent = `
      <html>
        <head>
          <title>Confirmation Réservation ${reservation.id}</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0; 
              padding: 40px; 
              color: #333;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container { 
              background: white; 
              padding: 40px; 
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              max-width: 600px;
              margin: 0 auto;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              border-bottom: 3px solid #667eea;
              padding-bottom: 20px;
            }
            .logo { 
              font-size: 32px; 
              font-weight: bold; 
              color: #667eea;
              margin-bottom: 10px;
            }
            .title { 
              font-size: 28px; 
              color: #2d3748;
              margin-bottom: 10px;
            }
            .reservation-id { 
              background: #667eea; 
              color: white; 
              padding: 8px 16px; 
              border-radius: 20px;
              font-weight: bold;
              display: inline-block;
            }
            .section { 
              margin: 25px 0; 
              padding: 20px;
              background: #f7fafc;
              border-radius: 15px;
              border-left: 4px solid #667eea;
            }
            .section-title { 
              font-size: 18px; 
              color: #2d3748; 
              margin-bottom: 15px;
              font-weight: bold;
            }
            .detail-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 15px; 
            }
            .detail-item { 
              margin: 8px 0; 
            }
            .label { 
              font-weight: bold; 
              color: #4a5568; 
              display: block;
              font-size: 14px;
            }
            .value { 
              color: #2d3748; 
              font-size: 16px;
            }
            .status-confirmed { 
              background: #48bb78; 
              color: white; 
              padding: 6px 12px; 
              border-radius: 15px;
              display: inline-block;
              font-weight: bold;
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              color: #718096;
              font-size: 14px;
            }
            .qr-code { 
              text-align: center; 
              margin: 20px 0; 
              padding: 20px;
              background: white;
              border-radius: 15px;
              border: 2px dashed #cbd5e0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚽ FootCenter</div>
              <h1 class="title">Confirmation de Réservation</h1>
              <div class="reservation-id">${reservation.id}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Informations Client</div>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Nom:</span>
                  <span class="value">${reservation.client.name}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Email:</span>
                  <span class="value">${reservation.client.email}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Téléphone:</span>
                  <span class="value">${reservation.client.telephone || 'Non renseigné'}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Détails de la Réservation</div>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Terrain:</span>
                  <span class="value">${reservation.field}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Date:</span>
                  <span class="value">${reservation.date}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Heure:</span>
                  <span class="value">${reservation.time}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Durée:</span>
                  <span class="value">${reservation.duration}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Montant:</span>
                  <span class="value">${reservation.amount}€</span>
                </div>
                <div class="detail-item">
                  <span class="label">Statut:</span>
                  <span class="status-confirmed">${reservation.status}</span>
                </div>
              </div>
            </div>

            <div class="qr-code">
              <div style="font-weight: bold; margin-bottom: 10px; color: #4a5568;">
                📱 Code QR de présentation
              </div>
              <div style="background: #f7fafc; padding: 20px; border-radius: 10px; display: inline-block;">
                [CODE QR ICI]<br/>
                <small>Présentez ce code à l'accueil</small>
              </div>
            </div>

            <div class="footer">
              <p>Merci pour votre confiance !</p>
              <p>Complexe Sportif FootCenter • contact@footcenter.com • +33 1 23 45 67 89</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      toast.success('PDF généré avec succès !');
    }, 500);
  };

  const filteredReservations = filterStatus === "all" 
    ? reservations 
    : reservations.filter(res => res.status === filterStatus);

  const toggleExpand = (id) => {
    setExpandedReservation(expandedReservation === id ? null : id);
  };

  const statusCounts = {
    all: reservations.length,
    confirmé: reservations.filter(r => r.status === "confirmé").length,
    "en attente": reservations.filter(r => r.status === "en attente").length,
    annulé: reservations.filter(r => r.status === "annulé").length,
  };

  if (loading) {
    return (
      <div className="reservations-card">
        <div className="loading">Chargement des réservations...</div>
      </div>
    );
  }

  return (
    <div className="reservations-card">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="card-header">
        <div className="header-contentsss">
          <h2>Réservations récentes</h2>
          <p>Gérez les réservations de vos terrains</p>
        </div>
        <button className="view-all-btn" onClick={fetchReservations}>
          Actualiser
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
      </div>

      <div className="filters">
        <button 
          className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          Tous <span className="count-badge">{statusCounts.all}</span>
        </button>
        <button 
          className={`filter-btn ${filterStatus === "confirmé" ? "active" : ""}`}
          onClick={() => setFilterStatus("confirmé")}
        >
          Confirmés <span className="count-badge">{statusCounts.confirmé}</span>
        </button>
        <button 
          className={`filter-btn ${filterStatus === "en attente" ? "active" : ""}`}
          onClick={() => setFilterStatus("en attente")}
        >
          En attente <span className="count-badge">{statusCounts["en attente"]}</span>
        </button>
        <button 
          className={`filter-btn ${filterStatus === "annulé" ? "active" : ""}`}
          onClick={() => setFilterStatus("annulé")}
        >
          Annulés <span className="count-badge">{statusCounts.annulé}</span>
        </button>
      </div>

      <div className="reservations-list">
        {filteredReservations.length === 0 ? (
          <div className="no-reservations">
            Aucune réservation trouvée
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <div 
              key={reservation.id} 
              className={`reservation-item ${expandedReservation === reservation.id ? "expanded" : ""}`}
              onClick={() => toggleExpand(reservation.id)}
            >
              <div className="reservation-main">
                <div className="client-info">
                  <div className="avatar">
                    <span>{reservation.client.initials}</span>
                  </div>
                  <div className="client-details">
                    <h3>{reservation.client.name}</h3>
                    <p>{reservation.field}</p>
                  </div>
                </div>

                <div className="reservation-details">
                  <div className="time-info">
                    <span className="date">{reservation.date}</span>
                    <span className="time">{reservation.time}</span>
                  </div>
                  <StatusBadge status={reservation.status} />
                </div>

                <div className="expand-icon">
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{ transform: expandedReservation === reservation.id ? "rotate(180deg)" : "rotate(0)" }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              {expandedReservation === reservation.id && (
                <div className="reservation-expanded">
                  <div className="expanded-details">
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{reservation.client.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Téléphone</span>
                      <span className="detail-value">{reservation.client.telephone || 'Non renseigné'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Durée</span>
                      <span className="detail-value">{reservation.duration}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Montant</span>
                      <span className="detail-value">{reservation.amount}€</span>
                    </div>
                  </div>
                  
                  <div className="action-buttons">
                    <button 
                      className="action-btn primary" 
                      onClick={(e) => {
                        e.stopPropagation();
                        sendEmail(reservation);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      Envoyer email
                    </button>
                    
                    {reservation.client.telephone && (
                      <button 
                        className="action-btn whatsapp"
                        onClick={(e) => {
                          e.stopPropagation();
                          sendWhatsApp(reservation);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        WhatsApp
                      </button>
                    )}
                    
                    <button 
                      className="action-btn pdf"
                      onClick={(e) => {
                        e.stopPropagation();
                        generatePDF(reservation);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      Générer PDF
                    </button>

                    {reservation.status === "en attente" && (
                      <>
                        <button 
                          className="action-btn success"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmReservation(reservation.id);
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5"></path>
                          </svg>
                          Confirmer
                        </button>
                        
                        <button 
                          className="action-btn danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelReservation(reservation.id);
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"></path>
                          </svg>
                          Annuler
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "confirmé":
        return {
          color: "#10b981",
          bgColor: "#ecfdf5",
          text: "Confirmé"
        };
      case "en attente":
        return {
          color: "#f59e0b",
          bgColor: "#ffedd5",
          text: "En attente"
        };
      case "annulé":
        return {
          color: "#ef4444",
          bgColor: "#fef2f2",
          text: "Annulé"
        };
      case "terminé":
        return {
          color: "#6b7280",
          bgColor: "#f3f4f6",
          text: "Terminé"
        };
      default:
        return {
          color: "#6b7280",
          bgColor: "#f3f4f6",
          text: "Inconnu"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span 
      className="status-badge"
      style={{ 
        backgroundColor: config.bgColor,
        color: config.color
      }}
    >
      {config.text}
    </span>
  );
};

export default RecentReservations;