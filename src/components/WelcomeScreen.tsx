import React, { useState } from 'react';
import evaaIcon from '../assets/evaa-Icon.png';
import questionIcon from '../assets/Question.svg';
import settingIcon from '../assets/Settings.svg';
import userprofileIcon from '../assets/UserProfile.svg';
import downarrowIcon from '../assets/DownArrow.svg';
import notificationIcon from '../assets/Notifications.svg';
import knowledgeIcon from '../assets/KnowledgeBase.svg';
import contactIcon from '../assets/ContactSupport.svg';
import feedbackIcon from '../assets/SendFeedback.svg';
import referIcon from '../assets/ReferColleague.svg'; 

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

  const handleAdminDashboard = () => {
    onSelectionComplete('', ''); // Call without requiring selections
  };

  const isButtonEnabled = selectedOrganization && selectedAssistant;

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Top Navigation */}
      <header className="navbar navbar-expand-lg bg-white border-bottom shadow-sm" style={{ height: '60px', zIndex: 1030 }}>
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center gap-3">
            <img 
              src={evaaIcon} 
              alt="EVAA Logo" 
              style={{ 
                width: '7rem', 
              }} 
            />
            
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
                  backgroundColor: '#f3f3f5',
                  border: 'none',
                  boxShadow: 'none'
                }}
              >
                <span className="text-start text-muted">
                  {selectedOrganization || 'Select Organization'}
                </span>
                <svg width="12" height="12" fill="currentColor" className="text-muted" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
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
                  backgroundColor: '#f3f3f5',
                  border: 'none',
                  boxShadow: 'none'
                }}
              >
                <span className="text-start text-muted">
                  {selectedAssistant || 'Select an Assistant'}
                </span>
                <svg width="12" height="12" fill="currentColor" className="text-muted" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
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
            <button className="btn px-2 d-flex gap-2 bg-transparent border-0" title="Help">
              <img src={notificationIcon} alt="Help" style={{ width: '20px', height: '20px' }} />
            </button>
            <div className="dropdown">
              <button 
                className="btn px-2 d-flex gap-2 bg-transparent border-0" 
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Help"
              >
                <img src={questionIcon} alt="Help" style={{ width: '20px', height: '20px' }} />
                <img src={downarrowIcon} alt="Help" style={{ width: '20px', height: '20px' }} />
              </button>
              <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: '200px' }}>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Knowledge Base clicked')}>
                    <img src={knowledgeIcon} alt="Knowledge Base" style={{ width: '16px', height: '16px' }} />
                    Knowledge Base
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Contact Support clicked')}>
                    <img src={contactIcon} alt="Contact Support" style={{ width: '16px', height: '16px' }} />
                    Contact Support
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Send Feedback clicked')}>
                    <img src={feedbackIcon} alt="Send Feedback" style={{ width: '16px', height: '16px' }} />
                    Send Feedback
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Refer a Colleague clicked')}>
                    <img src={referIcon} alt="Refer a Colleague" style={{ width: '16px', height: '16px' }} />
                    Refer a Colleague
                  </button>
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <button 
                className="btn px-2 d-flex gap-2 bg-transparent border-0" 
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Settings"
              >
                <img src={settingIcon} alt="Settings" style={{ width: '20px', height: '20px' }} />     
                <img src={downarrowIcon} alt="Settings" style={{ width: '20px', height: '20px' }} />                     
              </button>
              <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: '220px' }}>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={handleAdminDashboard}>
                    Admin Dashboard
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Organization/Business clicked')}>          
                    Organization/Business
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Locations clicked')}>                  
                    Locations
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Providers clicked')}>                    
                    Providers
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Insurances clicked')}>                    
                    Insurances
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Users clicked')}>                    
                    Users
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Licenses & Billing clicked')}>                    
                    Licenses & Billing
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Phone & SMS Management clicked')}>                    
                    Phone & SMS Management
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Patient Payment Setup clicked')}>                    
                    Patient Payment Setup
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('PMS/EHR Setup clicked')}>                    
                    PMS/EHR Setup
                  </button>
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <button 
                className="btn px-2 d-flex gap-2 bg-transparent border-0" 
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Profile"
              >
                <img src={userprofileIcon} alt="Profile" style={{ width: '20px', height: '20px' }} />  
                <img src={downarrowIcon} alt="Profile" style={{ width: '20px', height: '20px' }} />
              </button>
              <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: '160px' }}>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('My Profile clicked')}>                    
                    My Profile
                  </button>
                </li>                
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('Sign Out clicked')}>                    
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid h-100">
          <div className="row h-100">
            {/* Main Content Area */}
            <div className="col-12 d-flex flex-column justify-content-center align-items-start px-4 pt-3">
              <div className="mb-3">
                <h1 className="display-6 fw-bold text-dark mb-1">Welcome to EVAA</h1>
                <p className="text-muted">Please select an organization and product to get started.</p>
              </div>

              {/* Content Area Card */}
              <div className="card w-100 shadow-sm border-0">
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold mb-1">Content Area</h5>
                  <p className="text-muted mb-0">This is a placeholder for the main content area</p>
                  
                  <div className="pt-4">
                    <p className="text-dark mb-0 fw-medium">
                      Select an organization and product from the dropdowns above to access the application features.
                    </p>                                    
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