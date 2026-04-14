import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Activity, Clock, AlertTriangle,
  Mail, Users, MessageSquare, BarChart3, PieChart,
  Target, Zap, Star, Crown, Bell, ChevronRight,
  RefreshCw, Download, User, Building2, Flame, Gauge,
  ThumbsUp, ThumbsDown, Eye, Calendar, Award, Shield,
  Rocket, Brain, Sparkles, Heart, Compass, Filter, Search,
  CheckCircle, XCircle, HelpCircle, Info, Loader2
} from 'lucide-react';
import './anacontact.css';

const ContactsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [urgent, setUrgent] = useState(null);
  const [scoring, setScoring] = useState(null);
  const [motifs, setMotifs] = useState([]);
  const [topSenders, setTopSenders] = useState([]);
  const [dailyBoard, setDailyBoard] = useState(null);
  const [executive, setExecutive] = useState(null);
  const [topSubjects, setTopSubjects] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const API_URL = 'https://backend-foot-omega.vercel.app/api/contact-analytics';

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        urgentRes,
        scoringRes,
        motifsRes,
        sendersRes,
        dailyRes,
        executiveRes,
        subjectsRes
      ] = await Promise.all([
        fetch(`${API_URL}/analytics/stats`),
        fetch(`${API_URL}/analytics/urgent`),
        fetch(`${API_URL}/analytics/scoring`),
        fetch(`${API_URL}/analytics/by-motif`),
        fetch(`${API_URL}/analytics/top-senders`),
        fetch(`${API_URL}/analytics/daily-board`),
        fetch(`${API_URL}/analytics/executive`),
        fetch(`${API_URL}/analytics/top-subjects`)
      ]);

      const statsData = await statsRes.json();
      const urgentData = await urgentRes.json();
      const scoringData = await scoringRes.json();
      const motifsData = await motifsRes.json();
      const sendersData = await sendersRes.json();
      const dailyData = await dailyRes.json();
      const executiveData = await executiveRes.json();
      const subjectsData = await subjectsRes.json();

      if (statsData.success) setStats(statsData.data);
      if (urgentData.success) setUrgent(urgentData.data);
      if (scoringData.success) setScoring(scoringData.data);
      if (motifsData.success) setMotifs(motifsData.data.motifs);
      if (sendersData.success) setTopSenders(sendersData.data.top_emetteurs);
      if (dailyData.success) setDailyBoard(dailyData.data);
      if (executiveData.success) setExecutive(executiveData.data);
      if (subjectsData.success) setTopSubjects(subjectsData.data.top_sujets);
    } catch (error) {
      console.error('Error:', error);
      showToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="contacts-main-container">
        <div className="contacts-bg-shapes">
          <div className="contacts-floating-shape contacts-shape-one"></div>
          <div className="contacts-floating-shape contacts-shape-two"></div>
          <div className="contacts-floating-shape contacts-shape-three"></div>
          <div className="contacts-floating-shape contacts-shape-four"></div>
        </div>
        <div className="contacts-card-wrapper">
          <div className="contacts-loading">
            <Loader2 size={48} className="contacts-loading-spinner" />
            <p>Chargement des données contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contacts-main-container">
      <div className="contacts-bg-shapes">
        <div className="contacts-floating-shape contacts-shape-one"></div>
        <div className="contacts-floating-shape contacts-shape-two"></div>
        <div className="contacts-floating-shape contacts-shape-three"></div>
        <div className="contacts-floating-shape contacts-shape-four"></div>
      </div>

      {toast.show && (
        <div className={`contacts-toast-container contacts-toast-${toast.type}`}>
          <div className="contacts-toast-content">
            <div className="contacts-toast-icon">
              {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div className="contacts-toast-message">{toast.message}</div>
          </div>
        </div>
      )}

      <div className="contacts-card-wrapper">
        <div className="contacts-header-section">
          <div className="contacts-logo-container">
            <div className="contacts-logo-circle">
              <Mail size={40} className="contacts-logo-icon" />
            </div>
          </div>
          <h1 className="contacts-main-title">CONTACT ANALYTICS</h1>
          <p className="contacts-subtitle-text">Analyse décisionnelle des contacts clients</p>
        </div>

        {/* Navigation Tabs */}
        <div className="contacts-tabs">
          <button className={`contacts-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <Compass size={16} />
            <span>Vue Globale</span>
          </button>
      
          <button className={`contacts-tab ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>
            <PieChart size={16} />
            <span>Analyses</span>
          </button>
          <button className={`contacts-tab ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>
            <Users size={16} />
            <span>Top Clients</span>
          </button>
          
        </div>

        <div className="contacts-tab-content">
          {/* Vue Globale */}
          {activeTab === 'overview' && stats && executive && (
            <>
              {/* Stats Cards */}
              <div className="contacts-stats-grid">
                <div className="contacts-stat-card">
                  <div className="contacts-stat-icon">
                    <Mail size={28} />
                  </div>
                  <div className="contacts-stat-value">{stats.total_contacts}</div>
                  <div className="contacts-stat-title">Total Contacts</div>
                </div>
                <div className="contacts-stat-card">
                  <div className="contacts-stat-icon">
                    <Users size={28} />
                  </div>
                  <div className="contacts-stat-value">{stats.contacts_uniques}</div>
                  <div className="contacts-stat-title">Clients Uniques</div>
                </div>
                <div className="contacts-stat-card">
                  <div className="contacts-stat-icon">
                    <AlertTriangle size={28} />
                  </div>
                  <div className="contacts-stat-value">{stats.reclamations || 0}</div>
                  <div className="contacts-stat-title">Réclamations</div>
                </div>
                <div className="contacts-stat-card">
                  <div className="contacts-stat-icon">
                    <MessageSquare size={28} />
                  </div>
                  <div className="contacts-stat-value">{stats.longueur_moyenne_message || 0}</div>
                  <div className="contacts-stat-title">Caractères/message</div>
                </div>
              </div>

              {/* Executive Dashboard */}
              <div className="contacts-executive">
                <div className="contacts-section-header">
                  <Crown size={18} />
                  <h3>Tableau de bord exécutif</h3>
                </div>
                <div className="contacts-executive-grid">
                  <div className="contacts-exec-card">
                    <div className="contacts-exec-value">{executive.synthese?.total_contacts || 0}</div>
                    <div className="contacts-exec-label">Messages reçus</div>
                  </div>
                  <div className="contacts-exec-card">
                    <div className="contacts-exec-value">{executive.synthese?.taux_reclamation || 0}%</div>
                    <div className="contacts-exec-label">Taux réclamation</div>
                  </div>
                  <div className="contacts-exec-card">
                    <div className="contacts-exec-value">{executive.details?.support_technique || 0}</div>
                    <div className="contacts-exec-label">Support technique</div>
                  </div>
                  <div className="contacts-exec-card">
                    <div className="contacts-exec-value">{executive.details?.demandes_demo || 0}</div>
                    <div className="contacts-exec-label">Demandes démo</div>
                  </div>
                </div>
                <div className={`contacts-exec-note ${executive.note_globale === 'Critique' ? 'critical' : executive.note_globale === 'À améliorer' ? 'warning' : 'success'}`}>
                  <Star size={14} />
                  <span>Note globale : {executive.note_globale}</span>
                </div>
                <div className="contacts-exec-reco">
                  <Shield size={14} />
                  <span>{executive.recommandation}</span>
                </div>
              </div>

              {/* Motifs Distribution */}
              {motifs.length > 0 && (
                <div className="contacts-motifs">
                  <div className="contacts-section-header">
                    <PieChart size={18} />
                    <h3>Répartition par motif</h3>
                  </div>
                  <div className="contacts-motifs-list">
                    {motifs.map((motif, idx) => {
                      const total = motifs.reduce((a, b) => a + b.total, 0);
                      const percent = (motif.total / total * 100).toFixed(1);
                      return (
                        <div key={idx} className="contacts-motif-item">
                          <div className="contacts-motif-header">
                            <span className="contacts-motif-name">{motif.motif}</span>
                            <span className="contacts-motif-count">{motif.total}</span>
                          </div>
                          <div className="contacts-motif-bar">
                            <div className="contacts-motif-fill" style={{ width: `${percent}%` }}></div>
                          </div>
                          <div className="contacts-motif-percent">{percent}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Daily Board */}
              {dailyBoard && (
                <div className="contacts-daily">
                  <div className="contacts-section-header">
                    <Bell size={18} />
                    <h3>Alertes & Actions</h3>
                  </div>
                  <div className={`contacts-alert ${dailyBoard.niveau_urgence === 'CRITIQUE' ? 'critical' : dailyBoard.niveau_urgence === 'ÉLEVÉ' ? 'high' : 'normal'}`}>
                    <div className="contacts-alert-icon">
                      {dailyBoard.niveau_urgence === 'CRITIQUE' ? <Flame size={20} /> : <Activity size={20} />}
                    </div>
                    <div className="contacts-alert-content">
                      <strong>Niveau d'urgence : {dailyBoard.niveau_urgence}</strong>
                      <span>{dailyBoard.actions_prioritaires?.[0] || "Situation normale"}</span>
                    </div>
                  </div>
                  <div className="contacts-actions-list">
                    {dailyBoard.actions_prioritaires?.map((action, idx) => (
                      <div key={idx} className="contacts-action-item">
                        <div className="contacts-action-dot"></div>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Urgences */}
          {activeTab === 'urgent' && urgent && (
            <>
              <div className="contacts-urgent-header">
                <div className="contacts-urgent-title">
                  <Flame size={24} />
                  <h2>Contacts prioritaires</h2>
                </div>
                <div className="contacts-urgent-stats">
                  <div className="contacts-urgent-stat critical">
                    <span>Critique</span>
                    <strong>{urgent.resume?.critique || 0}</strong>
                  </div>
                  <div className="contacts-urgent-stat high">
                    <span>Haute</span>
                    <strong>{urgent.resume?.haute || 0}</strong>
                  </div>
                  <div className="contacts-urgent-stat medium">
                    <span>Moyenne</span>
                    <strong>{urgent.resume?.moyenne || 0}</strong>
                  </div>
                </div>
              </div>

              {urgent.contacts?.critique?.length > 0 && (
                <div className="contacts-urgent-section critical">
                  <div className="contacts-section-badge critical">
                    <Flame size={12} />
                    <span>À traiter immédiatement</span>
                  </div>
                  <div className="contacts-urgent-list">
                    {urgent.contacts.critique.map((contact, idx) => (
                      <div key={idx} className="contacts-urgent-card critical">
                        <div className="contacts-urgent-avatar">
                          <User size={20} />
                        </div>
                        <div className="contacts-urgent-info">
                          <div className="contacts-urgent-name">{contact.nom}</div>
                          <div className="contacts-urgent-email">{contact.email}</div>
                          <div className="contacts-urgent-subject">{contact.sujet}</div>
                        </div>
                        <div className="contacts-urgent-badge critical">
                          <Flame size={12} />
                          <span>CRITIQUE</span>
                        </div>
                        <button className="contacts-urgent-btn">Traiter <ChevronRight size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {urgent.contacts?.haute?.length > 0 && (
                <div className="contacts-urgent-section high">
                  <div className="contacts-section-badge high">
                    <Zap size={12} />
                    <span>À traiter rapidement</span>
                  </div>
                  <div className="contacts-urgent-list">
                    {urgent.contacts.haute.slice(0, 5).map((contact, idx) => (
                      <div key={idx} className="contacts-urgent-card high">
                        <div className="contacts-urgent-avatar">
                          <User size={20} />
                        </div>
                        <div className="contacts-urgent-info">
                          <div className="contacts-urgent-name">{contact.nom}</div>
                          <div className="contacts-urgent-email">{contact.email}</div>
                          <div className="contacts-urgent-subject">{contact.sujet}</div>
                        </div>
                        <div className="contacts-urgent-badge high">
                          <Zap size={12} />
                          <span>HAUTE</span>
                        </div>
                        <button className="contacts-urgent-btn">Traiter <ChevronRight size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {urgent.contacts?.critique?.length === 0 && urgent.contacts?.haute?.length === 0 && (
                <div className="contacts-empty">
                  <Heart size={48} />
                  <h3>Aucune urgence</h3>
                  <p>Tous les contacts sont traités ou en attente normale</p>
                </div>
              )}
            </>
          )}

          {/* Analyses */}
          {activeTab === 'analysis' && scoring && (
            <>
              <div className="contacts-scoring-header">
                <div className="contacts-scoring-title">
                  <Gauge size={24} />
                  <h2>Score des contacts</h2>
                </div>
                <div className="contacts-scoring-global">
                  <div className="contacts-global-score">
                    <span className="contacts-score-value">{scoring.resume?.score_moyen || 0}</span>
                    <span className="contacts-score-label">Score moyen</span>
                  </div>
                </div>
              </div>

              <div className="contacts-score-distribution">
                <div className="contacts-distrib-item">
                  <div className="contacts-distrib-label">Urgent</div>
                  <div className="contacts-distrib-bar">
                    <div className="contacts-distrib-fill urgent" style={{ width: `${(scoring.priorites?.urgent?.length / scoring.resume?.total * 100) || 0}%` }}></div>
                  </div>
                  <div className="contacts-distrib-count">{scoring.priorites?.urgent?.length || 0}</div>
                </div>
                <div className="contacts-distrib-item">
                  <div className="contacts-distrib-label">À suivre</div>
                  <div className="contacts-distrib-bar">
                    <div className="contacts-distrib-fill medium" style={{ width: `${(scoring.priorites?.a_suivre?.length / scoring.resume?.total * 100) || 0}%` }}></div>
                  </div>
                  <div className="contacts-distrib-count">{scoring.priorites?.a_suivre?.length || 0}</div>
                </div>
                <div className="contacts-distrib-item">
                  <div className="contacts-distrib-label">Standard</div>
                  <div className="contacts-distrib-bar">
                    <div className="contacts-distrib-fill standard" style={{ width: `${(scoring.priorites?.standard?.length / scoring.resume?.total * 100) || 0}%` }}></div>
                  </div>
                  <div className="contacts-distrib-count">{scoring.priorites?.standard?.length || 0}</div>
                </div>
              </div>

              {topSubjects.length > 0 && (
                <div className="contacts-subjects">
                  <div className="contacts-section-header">
                    <Target size={18} />
                    <h3>Sujets les plus fréquents</h3>
                  </div>
                  <div className="contacts-subjects-list">
                    {topSubjects.map((subject, idx) => (
                      <div key={idx} className="contacts-subject-item">
                        <div className="contacts-subject-rank">{idx + 1}</div>
                        <div className="contacts-subject-name">{subject.sujet}</div>
                        <div className="contacts-subject-count">{subject.occurrences} fois</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Top Clients */}
          {activeTab === 'clients' && topSenders.length > 0 && (
            <>
              <div className="contacts-clients-header">
                <Users size={24} />
                <h2>Top émetteurs</h2>
              </div>
              <div className="contacts-table-container">
                <table className="contacts-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Client</th>
                      <th>Email</th>
                      <th>Contacts</th>
                      <th>Réclamations</th>
                      <th>Motifs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSenders.map((client, idx) => (
                      <tr key={idx}>
                        <td className="contacts-rank">{idx + 1}</td>
                        <td className="contacts-name">{client.nom || 'Anonyme'}</td>
                        <td className="contacts-email">{client.email}</td>
                        <td className="contacts-count">{client.total_contacts}</td>
                        <td className={`contacts-reclamations ${client.reclamations > 0 ? 'danger' : ''}`}>
                          {client.reclamations || 0}
                        </td>
                        <td className="contacts-motifs-cell">{client.motifs?.substring(0, 30)}...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Recommandations */}
          {activeTab === 'insights' && (
            <>
              <div className="contacts-insights-grid">
                <div className="contacts-insight-card premium">
                  <div className="contacts-insight-icon">
                    <Brain size={24} />
                  </div>
                  <div className="contacts-insight-content">
                    <h4>Recommandation IA</h4>
                    <p>{executive?.recommandation || "Analyser les motifs de contact pour améliorer la satisfaction"}</p>
                  </div>
                </div>

                <div className="contacts-insight-card">
                  <div className="contacts-insight-icon">
                    <BarChart3 size={24} />
                  </div>
                  <div className="contacts-insight-content">
                    <h4>Support vs Commercial</h4>
                    <p>
                      {dailyBoard?.comparatif_support_vs_demo?.support || 0} supports techniques
                      vs {dailyBoard?.comparatif_support_vs_demo?.demandes_demo || 0} demandes commerciales
                    </p>
                    {dailyBoard?.comparatif_support_vs_demo?.ratio > 2 && (
                      <div className="contacts-insight-warning">
                        <AlertTriangle size={12} />
                        <span>Trop de support par rapport aux demandes commerciales</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="contacts-insight-card">
                  <div className="contacts-insight-icon">
                    <MessageSquare size={24} />
                  </div>
                  <div className="contacts-insight-content">
                    <h4>Qualité des messages</h4>
                    <p>Longueur moyenne : {stats?.longueur_moyenne_message || 0} caractères</p>
                    {stats?.longueur_moyenne_message < 100 && (
                      <div className="contacts-insight-warning">
                        <ThumbsDown size={12} />
                        <span>Messages courts - Manquent peut-être de détails</span>
                      </div>
                    )}
                    {stats?.longueur_moyenne_message > 200 && (
                      <div className="contacts-insight-success">
                        <ThumbsUp size={12} />
                        <span>Messages détaillés - Clients investis</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="contacts-insight-card">
                  <div className="contacts-insight-icon">
                    <Award size={24} />
                  </div>
                  <div className="contacts-insight-content">
                    <h4>Taux de réclamation</h4>
                    <p className={`contacts-rate ${executive?.synthese?.taux_reclamation > 15 ? 'danger' : executive?.synthese?.taux_reclamation > 5 ? 'warning' : 'success'}`}>
                      {executive?.synthese?.taux_reclamation || 0}%
                    </p>
                    {executive?.synthese?.taux_reclamation > 15 && (
                      <div className="contacts-insight-critical">
                        <Flame size={12} />
                        <span>Niveau critique - Action immédiate requise</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="contacts-plan">
                <div className="contacts-plan-header">
                  <Rocket size={18} />
                  <h3>Plan d'action recommandé</h3>
                </div>
                <div className="contacts-plan-steps">
                  <div className="contacts-plan-step">
                    <div className="contacts-step-number">1</div>
                    <div className="contacts-step-content">
                      <strong>Traiter les urgences</strong>
                      <p>{urgent?.resume?.critique || 0} réclamations en attente de traitement prioritaire</p>
                    </div>
                  </div>
                  <div className="contacts-plan-step">
                    <div className="contacts-step-number">2</div>
                    <div className="contacts-step-content">
                      <strong>Analyser les motifs récurrents</strong>
                      <p>Le motif "{motifs[0]?.motif}" revient {motifs[0]?.total} fois</p>
                    </div>
                  </div>
                  <div className="contacts-plan-step">
                    <div className="contacts-step-number">3</div>
                    <div className="contacts-step-content">
                      <strong>Contacter les clients à risque</strong>
                      <p>{topSenders.filter(s => s.total_contacts > 3).length} clients contactent trop fréquemment</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="contacts-footer-section">
          <div className="contacts-support-block">
            <div className="contacts-support-icon">
              <Shield size={14} />
            </div>
            <div className="contacts-support-text">Données analytiques en temps réel</div>
            <button className="contacts-refresh-btn" onClick={fetchAllData}>
              <RefreshCw size={14} />
              <span>Rafraîchir</span>
            </button>
          </div>
          <div className="contacts-demo-box">
            <div className="contacts-demo-title">
              <BarChart3 size={14} />
              <span>Indicateurs clés</span>
            </div>
            <div className="contacts-demo-list">
              <div className="contacts-demo-item">
                <strong>{stats?.total_contacts || 0}</strong> contacts au total
              </div>
              <div className="contacts-demo-item">
                <strong>{urgent?.resume?.critique || 0}</strong> urgences à traiter
              </div>
              <div className="contacts-demo-item">
                <strong>{scoring?.resume?.score_moyen || 0}</strong> score moyen de priorité
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsAnalytics;