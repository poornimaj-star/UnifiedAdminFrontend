import React from 'react';
import evaaImage from '../assets/evaaImage.png';
import evaaIcon from '../assets/evaa-Icon.png';
import {
  MAXIMEYES_CONNECT_URL,
  CLIENT_ID,
  COMMON_ADMIN_URL,
  LOGIN_SCOPE,
  LOGIN_AUD,
  LOGIN_STATE,
  LOGIN_SHOWUSERNAME,
  LOGIN_RESPONSE_TYPE
} from '../config';

interface EVAALandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const EVAALandingPage: React.FC<EVAALandingPageProps> = ({ onLogin, onSignup }) => {

  const handleLoginRedirect = () => {
    const url = `${MAXIMEYES_CONNECT_URL}/connect/authorize?` +
      `redirect_uri=${encodeURIComponent(COMMON_ADMIN_URL)}` +
      `&scope=${encodeURIComponent(LOGIN_SCOPE)}` +
      `&response_type=${encodeURIComponent(LOGIN_RESPONSE_TYPE)}` +
      `&state=${encodeURIComponent(LOGIN_STATE)}` +
      `&aud=${encodeURIComponent(LOGIN_AUD)}` +
      `&client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&showusername=${encodeURIComponent(LOGIN_SHOWUSERNAME)}`;
    window.location.href = url;
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #300d21 0%, #5c1a42 100%)',
    }}>
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
                // If image fails to load, show text fallback
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
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
                display: 'none' // Hidden by default, shown if image fails
              }}
            >
              evaa
            </div>
          </div>
          
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav align-items-center">
              <li className="nav-item">
                <a className="nav-link text-white fw-medium mx-2" href="#products" style={{ fontSize: '1rem' }}>Products</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white fw-medium mx-2" href="#resources" style={{ fontSize: '1rem' }}>Resources</a>
              </li>
              <li className="nav-item">
                <button 
                  className="btn btn-link nav-link text-white fw-medium mx-2 p-0 border-0" 
                  style={{ fontSize: '1rem', textDecoration: 'none' }}
                  onClick={handleLoginRedirect}
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
                  onClick={onSignup}
                >
                  Sign Up
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
                  onClick={onLogin}
                >
                  Admin
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="" style={{ paddingTop: '5rem', paddingBottom: '5rem', marginTop: ' 3rem' }}>
        <div className="container">
          <div className="row align-items-center">
          {/* Left Side - EVAA Image */}
          <div className="col-lg-6 text-center">
            <div className="d-flex justify-content-center">
              <img 
                src={evaaImage}
                alt="EVAA AI Assistant"
                className="img-fluid"
                style={{
                  height: '35rem',
                }}
                onError={(e) => {
                  // If image fails to load, show a placeholder
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              {/* Fallback if image doesn't load */}              
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="col-lg-6">
            <div className="text-white" style={{ maxWidth: '600px' }}>
              <h1 
                className="display-2 fw-bold mb-4"
                style={{ 
                  fontSize: '4rem',
                  lineHeight: '1.1',
                  letterSpacing: '-1px'
                }}
              >
                Meet EVAA AI
              </h1>
              
              <p 
                className="fs-4 mb-5 opacity-90"
                style={{ 
                  lineHeight: '1.6',
                  fontWeight: '300'
                }}
              >
                Your always-on AI assistant built to simplify the way your practice works. From the front desk to the back office, EVAA handles the most time-consuming tasks so your team can focus on what matters most: delivering exceptional care.
              </p>
              
              <div className="d-flex gap-3 flex-wrap">
                <button 
                  className="btn btn-lg fw-semibold px-5 py-3 d-flex align-items-center gap-2"
                  style={{ 
                    backgroundColor: '#b80e74',
                    border: 'none',
                    borderRadius: '.5rem',
                    color: 'white',
                    fontSize: '1.1rem'
                  }}
                  onClick={handleLoginRedirect}
                >
                  Start Free Trial
                  <svg width="16" height="16" fill="currentColor" className="ms-1" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
                
                <button 
                  className="btn btn-lg btn-outline-light fw-semibold px-5 py-3"
                  style={{ 
                    borderRadius: '.5rem',
                    borderWidth: '2px',
                    fontSize: '1.1rem'
                  }}
                >
                  Watch Demo
                </button>
              </div>
              
              <p className="mt-4 opacity-75" style={{ fontSize: '0.95rem' }}>
                Setup in minutes • Cancel anytime during trial
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ 
        backgroundColor: '#f6f6f1', 
        color: '#300d21',
        paddingBottom: '4rem',
      }}>
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-12 mb-5">
              <h2 className="h3 fw-bold">Why Practices Choose EVAA AI</h2>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="p-4">
                <div className="mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-3"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: '#fff',
                      color: '#b80e74',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <i className="fas fa-bolt" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                </div>
                <h4 className="h5 fw-semibold mb-3" style={{ color: '#300d21' }}>Always-On AI Assistant</h4>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>EVAA AI works 24/7 to handle time-consuming tasks across your practice.</p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="p-4">
                <div className="mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-3"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: '#fff',
                      color: '#b80e74',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <i className="fas fa-shield-alt" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                </div>
                <h4 className="h5 fw-semibold mb-3" style={{ color: '#300d21' }}>HIPAA Compliant</h4>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>Enterprise-grade security ensures your patient data is always protected.</p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="p-4">
                <div className="mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-3"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: '#fff',
                      color: '#b80e74',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <i className="fas fa-users" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                </div>
                <h4 className="h5 fw-semibold mb-3" style={{ color: '#300d21' }}>End-to-End Practice Support</h4>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>From front desk to back office, streamline every aspect of your workflow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EVAALandingPage;