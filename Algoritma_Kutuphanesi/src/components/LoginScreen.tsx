import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginScreen.css';
import logoImage from '../assets/logo.png';
import { registerUser, loginUser, checkEmailExists } from '../services/authService';

interface AuthContextType {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUsername: (username: string) => void;
}

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Register form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Password strength
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  
  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Check password strength
  useEffect(() => {
    if (!registerPassword) {
      setPasswordStrength('');
      return;
    }
    
    const hasLowercase = /[a-z]/.test(registerPassword);
    const hasUppercase = /[A-Z]/.test(registerPassword);
    const hasNumbers = /\d/.test(registerPassword);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(registerPassword);
    const isLongEnough = registerPassword.length >= 8;
    
    const criteria = [hasLowercase, hasUppercase, hasNumbers, hasSpecialChars, isLongEnough];
    const metCriteria = criteria.filter(Boolean).length;
    
    if (metCriteria <= 2) {
      setPasswordStrength('weak');
    } else if (metCriteria <= 4) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }, [registerPassword]);
  
  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Basic validation
    if (!loginEmail || !loginPassword) {
      setLoginError('Lütfen tüm alanları doldurunuz.');
      return;
    }
    
    if (!isValidEmail(loginEmail)) {
      setLoginError('Geçerli bir e-posta adresi giriniz.');
      return;
    }
    
    try {
      // Test kullanıcısı kontrolü
      if (loginEmail === 'test@example.com' && loginPassword === 'password123') {
        console.log('Test kullanıcısı girişi yapılıyor...');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', 'Test Kullanıcı');
        localStorage.setItem('userId', '65f5a8c0b89f8a5e92a8ed3a');
        navigate('/');
        return;
      }
      
      // Normal kullanıcı girişi
      const result = await loginUser(loginEmail, loginPassword);
      
      if (!result) {
        setLoginError('Geçersiz email veya şifre.');
        return;
      }
      
      // Başarılı giriş
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', result.user.ad || loginEmail.split('@')[0]);
      localStorage.setItem('userId', result.user._id?.toString() || '');
      navigate('/');
    } catch (error: any) {
      console.error('Giriş sırasında hata:', error);
      
      // Test kullanıcı kontrolü - hata durumunda
      if (loginEmail === 'test@example.com' && loginPassword === 'password123') {
        console.log('MongoDB bağlantısı olmadan test kullanıcısı ile giriş');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', 'Test Kullanıcı');
        localStorage.setItem('userId', '65f5a8c0b89f8a5e92a8ed3a');
        navigate('/');
        return;
      }
      
      setLoginError(error.message || 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };
  
  // Handle registration submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setSuccessMessage('');
    
    // Basic validation
    if (!firstName || !lastName || !registerEmail || !registerPassword || !confirmPassword) {
      setRegisterError('Lütfen tüm alanları doldurunuz.');
      return;
    }
    
    if (!isValidEmail(registerEmail)) {
      setRegisterError('Geçerli bir e-posta adresi giriniz.');
      return;
    }
    
    if (registerPassword.length < 8) {
      setRegisterError('Şifre en az 8 karakter olmalıdır.');
      return;
    }
    
    if (registerPassword !== confirmPassword) {
      setRegisterError('Şifreler eşleşmiyor.');
      return;
    }
    
    try {
      // Email'in kullanımda olup olmadığını kontrol et
      const emailExists = await checkEmailExists(registerEmail);
      if (emailExists) {
        setRegisterError('Bu email adresi zaten kullanımda.');
        return;
      }
      
      // MongoDB'ye kullanıcı kaydı
      const result = await registerUser({
        ad: firstName,
        soyad: lastName,
        email: registerEmail,
        password: registerPassword
      });
      
      if (!result) {
        setRegisterError('Kayıt işlemi sırasında bir hata oluştu.');
        return;
      }
      
      if (typeof result === 'object' && 'error' in result && typeof result.error === 'string') {
        setRegisterError(result.error);
        return;
      }
      
      // Başarılı kayıt
      setSuccessMessage('Kayıt başarılı! Giriş yapabilirsiniz.');
      setTimeout(() => {
        setActiveTab('login');
        setLoginEmail(registerEmail);
        setRegisterEmail('');
        setRegisterPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Kayıt sırasında hata:', error);
      setRegisterError('Kayıt yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-header">
        <button className="login-back-button" onClick={() => navigate('/')}>
          ←
        </button>
        <div className="login-header-logo">
          <div className="logo-with-text">
            <img src={logoImage} alt="Logo" className="logo-fallback" />
            <div className="app-name">Algoritma Kütüphanesi</div>
          </div>
        </div>
      </div>
      
      <div className="login-form-container">
        <div className="login-tabs">
          <div 
            className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Giriş Yap
          </div>
          <div 
            className={`login-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Kayıt Ol
          </div>
        </div>
        
        {activeTab === 'login' ? (
          // Login Form
          <form onSubmit={handleLogin}>
            <h2 className="login-title">Hesabınıza Giriş Yapın</h2>
            
            <div className="input-group">
              <label className="input-label">E-posta Adresi</label>
              <input
                type="email"
                className="input-field"
                placeholder="ornek@mail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Şifre</label>
              <div className="password-input-container">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="Şifreniz"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Şifremi Unuttum
              </Link>
            </div>
            
            {loginError && <div className="error-message">{loginError}</div>}
            
            <button type="submit" className="login-button">
              Giriş Yap
            </button>
            
            <div className="divider">veya</div>
            
            <div className="social-buttons">
              <button type="button" className="social-button">
                <span className="social-icon">G</span>
                Google ile Giriş Yap
              </button>
              <button type="button" className="social-button">
                <span className="social-icon">f</span>
                Facebook ile Giriş Yap
              </button>
            </div>
          </form>
        ) : (
          // Register Form
          <form onSubmit={handleRegister}>
            <h2 className="login-title">Yeni Hesap Oluştur</h2>
            
            <div className="name-row">
              <div className="input-group">
                <label className="input-label">Ad</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Adınız"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Soyad</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Soyadınız"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label">E-posta Adresi</label>
              <input
                type="email"
                className="input-field"
                placeholder="ornek@mail.com"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Şifre</label>
              <div className="password-input-container">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="Şifreniz"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                >
                  {showRegisterPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              
              {registerPassword && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-bar-fill ${passwordStrength}`}></div>
                  </div>
                  <div className="strength-text">
                    Şifre Gücü: {passwordStrength === 'weak' ? 'Zayıf' : passwordStrength === 'medium' ? 'Orta' : 'Güçlü'}
                  </div>
                </div>
              )}
            </div>
            
            <div className="input-group">
              <label className="input-label">Şifre Tekrar</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              
              {registerPassword && confirmPassword && (
                <div className={`error-message ${registerPassword === confirmPassword ? 'success-message' : ''}`}>
                  {registerPassword === confirmPassword ? '✓ Şifreler eşleşiyor' : '✗ Şifreler eşleşmiyor'}
                </div>
              )}
            </div>
            
            {registerError && <div className="error-message">{registerError}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <button 
              type="submit" 
              className="login-button" 
              disabled={!!successMessage}
            >
              Kayıt Ol
            </button>
            
            <div className="password-requirements">
              <p>Şifreniz şunları içermelidir:</p>
              <div className="password-requirement">
                <span className={`requirement-icon ${registerPassword.length >= 8 ? 'met' : ''}`}>
                  {registerPassword.length >= 8 ? '✓' : '•'}
                </span>
                <span className="requirement-text">En az 8 karakter</span>
              </div>
              <div className="password-requirement">
                <span className={`requirement-icon ${/[A-Z]/.test(registerPassword) ? 'met' : ''}`}>
                  {/[A-Z]/.test(registerPassword) ? '✓' : '•'}
                </span>
                <span className="requirement-text">En az 1 büyük harf</span>
              </div>
              <div className="password-requirement">
                <span className={`requirement-icon ${/[0-9]/.test(registerPassword) ? 'met' : ''}`}>
                  {/[0-9]/.test(registerPassword) ? '✓' : '•'}
                </span>
                <span className="requirement-text">En az 1 rakam</span>
              </div>
            </div>
          </form>
        )}
        
        <div className="form-footer">
          Giriş yaparak ya da hesap oluşturarak, 
          <a href="/terms" className="register-link"> Kullanım Şartlarını </a> 
          ve 
          <a href="/privacy" className="register-link"> Gizlilik Politikasını </a> 
          kabul etmiş olursunuz.
        </div>
      </div>
    </div>
  );
};

export default LoginScreen; 