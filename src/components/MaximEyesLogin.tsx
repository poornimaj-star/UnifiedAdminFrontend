import React, { useState } from 'react';
import evaaIcon from '../assets/evaa-Icon.png';

interface MaximEyesLoginProps {
  onBackToSignup: () => void;
}

const MaximEyesLogin: React.FC<MaximEyesLoginProps> = ({ onBackToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

   const supportEmailStyle = `
    .support-email-link {
      color: #b80e74 !important;
      font-weight: 400;
      text-decoration: none;
    }
      .support-email-link:hover {
      color: #b80e74 !important;
      font-weight: 400;
      text-decoration: underline;
    }
  `;

  React.useEffect(() => {
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.innerText = supportEmailStyle;
      document.head.appendChild(styleSheet);
      return () => {
        document.head.removeChild(styleSheet);
      };
    }, []);

  return (
    <div style={{ background: 'linear-gradient(to bottom right, oklab(0.97 0 0) 0%, #fff 50%, #f0e6ed 100%)', backgroundColor: '#f6f6f1' }}>
      {/* Navigation Header */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{  
        backgroundColor: '#300d21',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1030
      }}>
        <div className="container">
          <div className="navbar-brand d-flex align-items-center">
            <img 
              src={evaaIcon}
              alt="EVAA"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                const fallback = (e.currentTarget.nextElementSibling as HTMLElement);
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div 
              className="fw-bold px-3 py-2 rounded me-2"
              style={{ 
                background: 'linear-gradient(45deg, #E91E63, #FF6B9D)',
                color: 'white',
                fontSize: '1.8rem',
                letterSpacing: '1px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                display: 'none'
              }}
            >
              evaa
            </div>
          </div>
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav align-items-center">                  
              <li className="nav-item">
                <button 
                  className="btn btn-link nav-link text-white fw-medium mx-2 p-0 border-0" 
                  style={{ fontSize: '1rem', textDecoration: 'none' }}
                >
                  Login
                </button>
              </li>
              <li className="nav-item ms-3">
                <button 
                  className="btn fw-semibold px-4 py-2"
                  style={{ 
                    background: '#b80e74',
                    border: 'none',
                    borderRadius: '.5rem',
                    color: 'white',
                    fontSize: '0.95rem',
                  }}
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center flex-column" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
                {/* Header */}
                  <div className="text-center mb-4">
                    <h2 className="mb-3" style={{ color: '#300d21', fontSize: '2rem' }}>
                      MaximEyes Login
                    </h2>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                      Sign in with your existing MaximEyes credentials
                    </p>
                  </div>
              <div 
                className="card border-1"
                style={{ 
                  borderRadius: '1rem',
                  width: '42rem',
                  maxWidth: '50rem',
                  margin: '0 auto', 
                  boxShadow: '0 8px 32px 0 rgba(50, 13, 33, 0.18), 0 1.5px 6px 0 rgba(184, 14, 116, 0.10)'
                }}
              >                
                <div className="card-body px-4 py-4">                  
                  {/* Verification Notice */}
                  <div className="mb-1 text-center" style={{ color: '#300d21', fontWeight: 500, fontSize: '1.2rem' }}>
                    Verify Your MaximEyes Account
                  </div>
                  <div className="text-center mb-4" style={{ color: '#6c6c6c', fontSize: '1.05rem' }}>
                    Enter your MaximEyes username and password to continue
                  </div>
                  <div className="alert d-flex align-items-center p-3 mb-4" style={{ backgroundColor: '#f0e6ed', border: '1px solid #b80e7438', borderRadius: '0.75rem', color: '#6b5b66', fontSize: '1rem' }}>
                    <span className="me-2" style={{ fontSize: '1.2rem' }}>ⓘ</span>
                    We'll verify your MaximEyes account to set up your EVAA AI services. Your credentials are securely transmitted and not stored.
                  </div>

                  {/* Username Field */}
                  <div className="mb-3 text-start">
                    <label className="fw-semibold mb-1" htmlFor="maximeyes-username" style={{ color: '#300d21' }}>
                      MaximEyes Username *
                    </label>
                    <input
                      id="maximeyes-username"
                      className="form-control"
                      type="text"
                      placeholder="Enter your MaximEyes username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      style={{ fontSize: '1rem', borderRadius: '0.5rem' }}
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-3 text-start">
                    <label className="fw-semibold mb-1" htmlFor="maximeyes-password" style={{ color: '#300d21' }}>
                      MaximEyes Password *
                    </label>
                    <div className="input-group">
                      <input
                        id="maximeyes-password"
                        className="form-control"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your MaximEyes password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{
                          fontSize: '1rem',
                          borderTopLeftRadius: '0.5rem',
                          borderBottomLeftRadius: '0.5rem',
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                          background: 'transparent',
                          boxShadow: 'none',
                          color: '#300d21'
                        }}
                        onFocus={e => e.currentTarget.style.background = 'transparent'}
                        onBlur={e => e.currentTarget.style.background = 'transparent'}
                      />
                      <span
                        className="input-group-text"
                        style={{
                          background: 'transparent',
                          borderTopRightRadius: '0.5rem',
                          borderBottomRightRadius: '0.5rem',
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          cursor: 'pointer',
                          boxShadow: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          paddingRight: '1rem',
                          paddingLeft: '0.75rem',
                          color: '#b80e74',
                          borderColor: '#d1c7d6',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          borderLeft: 'none',
                        }}
                        onClick={() => setShowPassword(v => !v)}
                      >
                        {showPassword ? (
                          <i className="fa-solid fa-eye-slash" style={{ fontSize: '1.1rem' }}></i>
                        ) : (
                          <i className="fa-solid fa-eye" style={{ fontSize: '1.1rem' }}></i>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* MaximEyes URL Input */}
                  <div className="mb-3 d-flex align-items-center" style={{ gap: '0.5rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '1.15rem', color: '#444', fontFamily: 'inherit' }}>https://</span>
                    <input
                      type="text"
                      placeholder="Enter URL"
                      style={{
                        border: '1.5px solid #d1c7d6',
                        borderRadius: '0.8rem',
                        padding: '0.6rem 1rem',
                        fontSize: '1.08rem',
                        width: '220px',
                        outline: 'none',
                        color: '#444',
                        fontFamily: 'inherit',
                        background: 'transparent',
                        boxShadow: 'none',
                        transition: 'border-color 0.2s',
                      }}
                    />
                    <span style={{ fontSize: '1.15rem', color: '#444', fontFamily: 'inherit' }}>.maximeyes.com</span>
                  </div>

                  {/* Existing Customer Notice */}
                  <div className="alert p-3 mt-3 mb-4" style={{ backgroundColor: '#f0e6ed63', borderRadius: '0.75rem', color: '#4a2b3b', fontSize: '1rem' }}>
                    <div className="fw-semibold mb-1" style={{ color: '#300d21' }}>
                      MaximEyes Customer?
                    </div>
                    <div style={{ color: '#6c6c6c', fontSize: '0.97rem' }}>
                      As an existing MaximEyes customer, your account information is already in our system. We just need to verify your identity to set up your EVAA AI services.
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-3 mt-4">
                   <button 
                    type="button" 
                    className="btn btn-outline-secondary px-4 py-2"
                    onClick={onBackToSignup}
                    style={{ borderRadius: '0.5rem' }}
                  >
                    Back
                  </button>
                    <button 
                    type="button" 
                    className="btn text-white px-5 py-2 flex-grow-1"
                    style={{ 
                      backgroundColor:'#b80e74',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      fontSize: '1rem',
                    }}
                    >
                      Verify & Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Support Contact - outside the card */}
        <div className="text-center mt-4 mb-2" style={{ fontSize: '1.05rem', color: '#6c6c6c' }}>
          Having trouble? Contact our team at{' '}
            <a href="mailto:support@evaa.ai" className="support-email-link">
            support@evaa.ai
          </a>
        </div>
      </div>
    </div>
  );
};

export default MaximEyesLogin;
