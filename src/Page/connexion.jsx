import React, { useState } from 'react';
import { Mail, Lock, LogIn, HelpCircle, User, Check, X, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        mdp: ''
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [showPassword, setShowPassword] = useState(false);

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://backend-foot-omega.vercel.app/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                showToast('Connexion réussie ! Redirection en cours...', 'success');
                
                setTimeout(() => {
                    if (data.data.typeuser === 'administrateur') {
                        window.location.href = '/dashboard';
                    } else if (data.data.typeuser === 'gestionnaire') {
                        window.location.href = '/interface-gestionnaire';
                    } else {
                        window.location.href = '/profile';
                    }
                }, 2000);
            } else {
                showToast(data.message || 'Email ou mot de passe incorrect', 'error');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showToast('Erreur de connexion au serveur. Veuillez réessayer.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-main-container">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

                .login-main-container {
                    --login-primary: #1a472a;
                    --login-primary-dark: #0f2d1a;
                    --login-primary-light: #2d5a3d;
                    --login-accent: #27ae60;
                    --login-accent-light: #58d68d;
                    --login-white: #ffffff;
                    --login-gray-light: #f8f9fa;
                    --login-gray: #6c757d;
                    --login-gray-medium: #adb5bd;
                    --login-gray-dark: #343a40;
                    --login-success: #28a745;
                    --login-error: #dc3545;
                    
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    font-family: 'Inter', sans-serif;
                    overflow-y: auto;
                }

                .login-bg-shapes {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    pointer-events: none;
                    overflow: hidden;
                }

                .login-floating-shape {
                    position: absolute;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(39, 174, 96, 0.1), rgba(26, 71, 42, 0.05));
                    animation: login-float-animation 8s ease-in-out infinite;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .login-shape-one {
                    width: 300px;
                    height: 300px;
                    top: 5%;
                    left: 5%;
                    animation-delay: 0s;
                }

                .login-shape-two {
                    width: 200px;
                    height: 200px;
                    top: 65%;
                    right: 8%;
                    animation-delay: 2s;
                }

                .login-shape-three {
                    width: 150px;
                    height: 150px;
                    bottom: 15%;
                    left: 15%;
                    animation-delay: 4s;
                }

                .login-shape-four {
                    width: 250px;
                    height: 250px;
                    top: 20%;
                    right: 15%;
                    animation-delay: 6s;
                }

                @keyframes login-float-animation {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg) scale(1);
                    }
                    50% {
                        transform: translateY(-30px) rotate(180deg) scale(1.05);
                    }
                }

                .login-card-wrapper {
                    position: relative;
                    z-index: 1;
                    background: var(--login-white);
                    padding: 4rem 3.5rem;
                    border-radius: 24px;
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
                    width: 100%;
                    max-width: 520px;
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    transform: translateY(0);
                    transition: all 0.4s ease;
                    animation: login-fadeIn 0.8s ease-out;
                    margin: auto;
                }

                .login-card-wrapper:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.25);
                }

                @keyframes login-fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .login-header-section {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .login-logo-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                }

                .login-logo-circle {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, var(--login-primary), var(--login-accent));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 25px rgba(39, 174, 96, 0.4);
                    transition: all 0.3s ease;
                }

                .login-logo-circle:hover {
                    transform: scale(1.05);
                    box-shadow: 0 12px 35px rgba(39, 174, 96, 0.6);
                }

                .login-logo-icon {
                    color: var(--login-white);
                }

                .login-main-title {
                    font-family: 'Orbitron', monospace;
                    font-weight: 900;
                    font-size: 2.75rem;
                    background: linear-gradient(135deg, var(--login-primary), var(--login-accent));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.75rem;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    line-height: 1.2;
                }

                .login-subtitle-text {
                    color: var(--login-gray);
                    font-size: 1.1rem;
                    font-weight: 400;
                    letter-spacing: 0.8px;
                    line-height: 1.5;
                }

                .login-form-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .login-input-group {
                    position: relative;
                }

                .login-field-label {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                    color: var(--login-gray-dark);
                    font-weight: 600;
                    font-size: 0.95rem;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                }

                .login-label-icon {
                    color: var(--login-primary);
                    opacity: 0.9;
                }

                .login-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    width: 100%;
                }

                .login-text-input {
                    width: 100%;
                    padding: 1.25rem 3.5rem;
                    border: 2.5px solid #e9ecef;
                    border-radius: 16px;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    background: var(--login-gray-light);
                    font-family: 'Inter', sans-serif;
                    font-weight: 500;
                    height: 60px;
                }

                .login-text-input:focus {
                    outline: none;
                    border-color: var(--login-primary);
                    background: var(--login-white);
                    box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.15);
                    transform: translateY(-2px);
                }

                .login-text-input::placeholder {
                    color: var(--login-gray-medium);
                    opacity: 0.8;
                    font-weight: 400;
                }

                .login-icon-position {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    z-index: 2;
                }

                .login-icon-left {
                    left: 1.25rem;
                    color: var(--login-primary);
                }

                .login-text-input:focus ~ .login-icon-left {
                    color: var(--login-accent);
                    transform: scale(1.1);
                }

                .login-password-toggle {
                    position: absolute;
                    right: 1.25rem;
                    background: none;
                    border: none;
                    color: var(--login-gray-medium);
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 3;
                }

                .login-password-toggle:hover {
                    color: var(--login-primary);
                    background: rgba(39, 174, 96, 0.1);
                }

                .login-options-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 1rem 0;
                }

                .login-remember-check {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: var(--login-gray-dark);
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }

                .login-remember-check:hover {
                    color: var(--login-primary);
                }

                .login-checkbox-input {
                    display: none;
                }

                .login-checkbox-mark {
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--login-gray-medium);
                    border-radius: 5px;
                    position: relative;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .login-checkbox-input:checked + .login-checkbox-mark {
                    background: var(--login-primary);
                    border-color: var(--login-primary);
                }

                .login-checkbox-input:checked + .login-checkbox-mark::after {
                    content: '✓';
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                }

                .login-forgot-link {
                    color: var(--login-primary);
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .login-forgot-link:hover {
                    color: var(--login-accent);
                    text-decoration: underline;
                }

                .login-submit-btn {
                    background: linear-gradient(135deg, var(--login-primary), var(--login-primary-dark));
                    color: var(--login-white);
                    border: none;
                    padding: 1.5rem 2.5rem;
                    border-radius: 16px;
                    font-size: 1.2rem;
                    font-weight: 700;
                    font-family: 'Orbitron', monospace;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    margin-top: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    height: 65px;
                    box-shadow: 0 8px 25px rgba(26, 71, 42, 0.3);
                }

                .login-submit-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 35px rgba(39, 174, 96, 0.4);
                    background: linear-gradient(135deg, var(--login-primary-dark), var(--login-primary));
                    animation: login-pulse 2s infinite;
                }

                @keyframes login-pulse {
                    0%, 100% {
                        transform: scale(1) translateY(-3px);
                    }
                    50% {
                        transform: scale(1.05) translateY(-3px);
                    }
                }

                .login-submit-btn:active:not(:disabled) {
                    transform: translateY(-1px);
                }

                .login-submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .login-submit-btn.login-btn-loading {
                    pointer-events: none;
                }

                .login-btn-icon {
                    transition: transform 0.3s ease;
                }

                .login-submit-btn:hover .login-btn-icon {
                    transform: translateX(3px);
                }

                .login-loading-spinner {
                    width: 24px;
                    height: 24px;
                    border: 3px solid transparent;
                    border-top: 3px solid var(--login-white);
                    border-radius: 50%;
                    animation: login-spin 1s linear infinite;
                }

                @keyframes login-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .login-footer-section {
                    margin-top: 3rem;
                    padding-top: 2.5rem;
                    border-top: 1px solid #e9ecef;
                }

                .login-support-block {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                }

                .login-support-icon {
                    color: var(--login-gray);
                    opacity: 0.8;
                }

                .login-support-text {
                    color: var(--login-gray);
                    font-size: 0.95rem;
                }

                .login-support-link {
                    color: var(--login-primary);
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.3s ease;
                }

                .login-support-link:hover {
                    color: var(--login-accent);
                    text-decoration: underline;
                }

                .login-demo-box {
                    background: linear-gradient(135deg, var(--login-gray-light), #f1f3f4);
                    padding: 1.5rem;
                    border-radius: 12px;
                    border-left: 4px solid var(--login-accent);
                }

                .login-demo-title {
                    font-weight: 700;
                    color: var(--login-gray-dark);
                    margin-bottom: 0.75rem;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .login-demo-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .login-demo-item {
                    font-size: 0.85rem;
                    color: var(--login-gray);
                    font-family: 'Courier New', monospace;
                }

                .login-demo-item strong {
                    color: var(--login-primary);
                }

                .login-toast-container {
                    position: fixed;
                    top: 40px;
                    right: 40px;
                    z-index: 1000;
                    animation: login-slideInRight 0.4s ease, login-slideOutRight 0.4s ease 3.6s forwards;
                }

                .login-toast-content {
                    background: var(--login-white);
                    padding: 1.25rem 1.5rem;
                    border-radius: 16px;
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-weight: 600;
                    border-left: 5px solid;
                    min-width: 350px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .login-toast-container.login-toast-success .login-toast-content {
                    border-left-color: var(--login-success);
                    color: var(--login-success);
                    background: linear-gradient(135deg, #ffffff, #f8fff9);
                }

                .login-toast-container.login-toast-error .login-toast-content {
                    border-left-color: var(--login-error);
                    color: var(--login-error);
                    background: linear-gradient(135deg, #ffffff, #fff8f8);
                }

                .login-toast-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .login-toast-message {
                    flex: 1;
                    font-size: 0.95rem;
                }

                @keyframes login-slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes login-slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }

                @media (max-width: 768px) {
                    .login-main-container {
                        padding: 20px 15px;
                    }
                    
                    .login-card-wrapper {
                        padding: 3rem 2rem;
                        margin: 1rem;
                    }
                    
                    .login-main-title {
                        font-size: 2.25rem;
                    }
                    
                    .login-floating-shape {
                        display: none;
                    }
                    
                    .login-toast-container {
                        right: 20px;
                        left: 20px;
                        top: 20px;
                    }
                    
                    .login-toast-content {
                        min-width: auto;
                        width: 100%;
                    }
                    
                    .login-options-row {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: flex-start;
                    }
                }

                @media (max-width: 480px) {
                    .login-card-wrapper {
                        padding: 2.5rem 1.5rem;
                    }
                    
                    .login-main-title {
                        font-size: 2rem;
                        letter-spacing: 2px;
                    }
                    
                    .login-text-input {
                        padding: 1.1rem 3rem;
                        height: 55px;
                        font-size: 1rem;
                    }
                    
                    .login-icon-left {
                        left: 1rem;
                    }
                    
                    .login-password-toggle {
                        right: 1rem;
                    }
                    
                    .login-submit-btn {
                        padding: 1.25rem 2rem;
                        height: 60px;
                        font-size: 1.1rem;
                    }
                    
                    .login-demo-box {
                        padding: 1.25rem;
                    }
                    
                    .login-logo-circle {
                        width: 70px;
                        height: 70px;
                    }
                }

                .login-submit-btn:focus,
                .login-text-input:focus,
                .login-password-toggle:focus {
                    outline: 2px solid var(--login-accent);
                    outline-offset: 2px;
                }
            `}</style>

            {toast.show && (
                <div className={`login-toast-container login-toast-${toast.type}`}>
                    <div className="login-toast-content">
                        <div className="login-toast-icon">
                            {toast.type === 'success' ? <Check size={20} /> : <X size={20} />}
                        </div>
                        <span className="login-toast-message">{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="login-card-wrapper">
                <div className="login-header-section">
                    <div className="login-logo-container">
                        <div className="login-logo-circle">
                            <User size={32} className="login-logo-icon" />
                        </div>
                    </div>
                    <h1 className="login-main-title">ESPACE CONNEXION</h1>
                    <div className="login-subtitle-text">
                        Accédez à votre tableau de bord personnel
                    </div>
                </div>

                <form className="login-form-container" onSubmit={handleSubmit}>
                    <div className="login-input-group">
                        <label htmlFor="login-email" className="login-field-label">
                            <Mail size={18} className="login-label-icon" />
                            Adresse Email
                        </label>
                        <div className="login-input-wrapper">
                            <div className="login-icon-position login-icon-left">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                id="login-email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="login-text-input"
                                placeholder="saisissez.votre@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="login-input-group">
                        <label htmlFor="login-mdp" className="login-field-label">
                            <Lock size={18} className="login-label-icon" />
                            Mot de Passe
                        </label>
                        <div className="login-input-wrapper">
                            <div className="login-icon-position login-icon-left">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="login-mdp"
                                name="mdp"
                                value={formData.mdp}
                                onChange={handleChange}
                                className="login-text-input"
                                placeholder="Votre mot de passe sécurisé"
                                required
                            />
                            <button 
                                type="button"
                                className="login-password-toggle"
                                onClick={togglePasswordVisibility}
                                aria-label="Afficher/Masquer le mot de passe"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="login-options-row">
                        <label className="login-remember-check">
                            <input type="checkbox" className="login-checkbox-input" />
                            <span className="login-checkbox-mark"></span>
                            Se souvenir de moi
                        </label>
                        <a href="/forgot-password" className="login-forgot-link">
                            Mot de passe oublié ?
                        </a>
                    </div>

                    <button 
                        type="submit"
                        className={`login-submit-btn ${loading ? 'login-btn-loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="login-loading-spinner"></div>
                                Connexion en cours...
                            </>
                        ) : (
                            <>
                                <LogIn size={22} className="login-btn-icon" />
                                SE CONNECTER
                            </>
                        )}
                    </button>
                </form>

               
            </div>

            <div className="login-bg-shapes">
                <div className="login-floating-shape login-shape-one"></div>
                <div className="login-floating-shape login-shape-two"></div>
                <div className="login-floating-shape login-shape-three"></div>
                <div className="login-floating-shape login-shape-four"></div>
            </div>
        </div>
    );
};

export default Login;