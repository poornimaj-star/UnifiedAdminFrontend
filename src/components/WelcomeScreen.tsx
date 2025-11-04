import React, { useState } from 'react';

interface WelcomeScreenProps {
  onSelectionComplete: (organization: string, assistant: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectionComplete }) => {
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState('');

  const organizations = [
    'ClearView Eye Associates',
    'VisionCare Optical Centers',
    'OptiHealth Retail Group'
  ];

  const assistants = [
    'Assistant A',
    'Assistant B',
    'Assistant C'
  ];

  const handleContinue = () => {
    if (selectedOrganization && selectedAssistant) {
      onSelectionComplete(selectedOrganization, selectedAssistant);
    }
  };

  const isButtonEnabled = selectedOrganization && selectedAssistant;

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Top Navigation */}
      <header className="navbar navbar-expand-lg bg-white border-bottom shadow-sm" style={{ height: '60px', zIndex: 1030 }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-3">
            <div className="badge text-white fw-bold fs-6 px-3 py-2" style={{ 
              background: 'linear-gradient(135deg, #e91e63, #ad1457)',
              borderRadius: '0.5rem'
            }}>
              EVAA
            </div>
            
            {/* Organization Dropdown */}
            <div className="dropdown">
              <button 
                className="btn btn-light dropdown-toggle d-flex align-items-center gap-2" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                style={{ 
                  minWidth: '200px', 
                  justifyContent: 'space-between',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef'
                }}
              >
                <span className="text-start text-muted">
                  {selectedOrganization || 'Select Organization'}
                </span>
              </button>
              <ul className="dropdown-menu">
                {organizations.map((org) => (
                  <li key={org}>
                    <button 
                      className={`dropdown-item ${selectedOrganization === org ? 'active' : ''}`}
                      onClick={() => setSelectedOrganization(org)}
                    >
                      {org}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assistant Dropdown */}
            <div className="dropdown">
              <button 
                className="btn btn-light dropdown-toggle d-flex align-items-center gap-2" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                style={{ 
                  minWidth: '180px', 
                  justifyContent: 'space-between',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef'
                }}
              >
                <span className="text-start text-muted">
                  {selectedAssistant || 'Select an Assistant'}
                </span>
              </button>
              <ul className="dropdown-menu">
                {assistants.map((assistant) => (
                  <li key={assistant}>
                    <button 
                      className={`dropdown-item ${selectedAssistant === assistant ? 'active' : ''}`}
                      onClick={() => setSelectedAssistant(assistant)}
                    >
                      {assistant}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-light" style={{ width: '36px', height: '36px', padding: 0 }} title="Notifications">
              🔔
            </button>
            <button className="btn btn-light" style={{ width: '36px', height: '36px', padding: 0 }} title="Settings">
              ⚙️
            </button>
            <button className="btn btn-light" style={{ width: '36px', height: '36px', padding: 0 }} title="Profile">
              👤
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid h-100">
          <div className="row h-100">
            {/* Main Content Area */}
            <div className="col-12 d-flex flex-column justify-content-center align-items-start px-5">
              <div className="mb-5">
                <h1 className="display-6 fw-bold text-dark mb-3">Welcome to EVAA</h1>
                <p className="text-muted mb-4">Please select an organization and product to get started.</p>
              </div>

              {/* Content Area Card */}
              <div className="card w-100 shadow-sm border-0" style={{ maxWidth: '800px' }}>
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold mb-3">Content Area</h5>
                  <p className="text-muted mb-4">This is a placeholder for the main content area</p>
                  
                  <div className="border-top pt-4">
                    <p className="text-muted mb-4">
                      Select an organization and product from the dropdowns above to access the application features.
                    </p>
                    
                    {/* Continue Button */}
                    <button 
                      className={`btn ${isButtonEnabled ? 'btn-primary-custom' : 'btn-secondary'} px-4`}
                      onClick={handleContinue}
                      disabled={!isButtonEnabled}
                    >
                      Continue to Dashboard
                    </button>
                    
                    {!isButtonEnabled && (
                      <p className="text-muted mt-2 mb-0 small">
                        Please select both an organization and an assistant to continue.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;