import React, { useState } from 'react';
import evaaIcon from '../assets/evaa-Icon.png';

interface SignupPageProps {
  onBackToHome: () => void;
  onSwitchToLogin: () => void;
  onMaximEyesLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onBackToHome, onSwitchToLogin, onMaximEyesLogin }) => {
  const [selectedEHR, setSelectedEHR] = useState<string>('');

  // Add custom styles to override Bootstrap radio button colors
  const customRadioStyles = `
    .custom-radio.form-check-input:checked {
      background-color: #b80e74 !important;
      border-color: #b80e74 !important;
    }
    .custom-radio.form-check-input:focus {
      border-color: #b80e74 !important;
      box-shadow: 0 0 0 0.25rem rgba(233, 30, 99, 0.25) !important;
    }
  `;
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

  // Inject styles
  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = customRadioStyles;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = supportEmailStyle;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const ehrSystems = [
    'MaximEyes',
    'Epic', 
    'NextGen',
    'Compulink',
    'Revolution',
    'Crystal',
    'Officemate',
    'Encompass',
    'EyeCarePro',
    'FoxFire',
    'Other / Not Listed'
  ];

  const handleEHRSelection = (ehr: string) => {
    setSelectedEHR(ehr);
  };

  const handleContinue = () => {
    if (!selectedEHR) {
      alert('Please select a Practice Management / EHR system to continue.');
      return;
    }
    if (selectedEHR === 'MaximEyes') {
      onMaximEyesLogin();
      return;
    }
    // Handle continue logic here
    console.log('Selected EHR:', selectedEHR);
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: 'linear-gradient(to bottom right, oklab(0.97 0 0) 0%, #fff 50%, #f0e6ed 100%)',
        backgroundColor: '#f6f6f1'
      }}
    >
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
                <button 
                  className="btn btn-link nav-link text-white fw-medium mx-2 p-0 border-0" 
                  style={{ fontSize: '1rem', textDecoration: 'none' }}
                  onClick={onSwitchToLogin}
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
                  onClick={onBackToHome}
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
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-3" style={{ color: '#300d21', fontSize: '2rem' }}>
                    Welcome to EVAA AI
                  </h2>
                  <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                    Let's get started with your free trial
                  </p>
                </div>

                {/* Question */}
                <div className="mb-4">
                  <h5 className="fw-semibold mb-4" style={{ color: '#300d21' }}>
                    Which Practice Management / EHR system are you currently using?
                  </h5>

                  {/* EHR Options Grid */}
                  <div className="row g-3">
                    {ehrSystems.map((ehr, index) => (
                      <div key={index} className="col-md-6">
                        <div 
                          className="rounded p-2"
                          style={{ 
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: selectedEHR === ehr ? '#b80e7414' : '#fff',
                            borderColor: selectedEHR === ehr ? '#b80e74' : '#e0e0e0',
                            borderWidth: '1px',
                            borderStyle: 'solid'
                          }}
                          onClick={() => handleEHRSelection(ehr)}
                          onMouseEnter={(e) => {
                            if (selectedEHR !== ehr) {
                              e.currentTarget.style.borderColor = '#b80e74';
                              e.currentTarget.style.backgroundColor = '#f0e6ed';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedEHR !== ehr) {
                              e.currentTarget.style.borderColor = '#e0e0e0';
                              e.currentTarget.style.backgroundColor = '#fff';
                            }
                          }}
                        >
                          <div className="form-check m-0">
                            <input
                              className="form-check-input custom-radio"
                              type="radio"
                              name="ehrSystem"
                              id={`ehr-${index}`}
                              value={ehr}
                              checked={selectedEHR === ehr}
                              onChange={() => handleEHRSelection(ehr)}
                              style={{ 
                                marginTop: '0.2rem'
                              }}
                            />
                            <label 
                              className="form-check-label ms-2" 
                              htmlFor={`ehr-${index}`}
                              style={{ 
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                color: '#333',
                                fontWeight: '400'
                              }}
                            >
                              {ehr}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Existing EVAA Customers Notice */}
                <div 
                  className="alert d-flex align-items-start p-4 mb-4"
                  style={{ 
                    backgroundColor: '#f0e6ed',
                    border: '1px solid #b80e7438',
                    borderRadius: '0.75rem'
                  }}
                >
                  <div 
                    className="me-3 mt-1"
                    style={{ 
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#6c757d',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    i
                  </div>
                  <div>
                    <div className="fw-semibold mb-2" style={{ color: '#495057' }}>
                      Existing EVAA customers:
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '0.95rem' }}>
                      If you already have an EVAA account, please use the{' '}<br></br>
                      <button 
                        className="btn btn-link p-0 fw-semibold text-decoration-none"
                        style={{ verticalAlign: 'baseline', color: '#495057' }}
                        onClick={onSwitchToLogin}
                      >
                        Login
                      </button><br></br>
                      {' '}button in the header to access your admin console.
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-3 mt-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary px-4 py-2 flex-grow-1"
                    onClick={onBackToHome}
                    style={{ 
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      fontSize: '1rem',
                      flexBasis: '0',
                      minWidth: 0
                    }}
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    className="btn text-white px-4 py-2 flex-grow-1"
                    onClick={handleContinue}
                    style={{ 
                      backgroundColor: selectedEHR ? '#b80e74' : '#b80e7480',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      fontSize: '1rem',
                      cursor: selectedEHR ? 'pointer' : 'not-allowed',
                      flexBasis: '0',
                      minWidth: 0
                    }}
                    disabled={!selectedEHR}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
          {/* Close main content wrapper */}
          </div>
        {/* Support Contact - outside the card */}
        <div className="text-center mt-4 mb-2" style={{ fontSize: '1.05rem', color: '#6c6c6c' }}>
          Questions? Contact our team at{' '}
            <a href="mailto:support@evaa.ai" className="support-email-link">
            support@evaa.ai
          </a>

        </div>
      </div>
    </div>
  );
}
export default SignupPage;