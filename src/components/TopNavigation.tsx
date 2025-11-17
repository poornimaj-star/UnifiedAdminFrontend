import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Constants } from './constant';
import evaaIcon from '../assets/evaa-Icon.png';
import plusIcon from '../assets/Plus.svg';
import settingIcon from '../assets/Settings.svg';
import downarrowIcon from '../assets/DownArrow.svg';
import questionIcon from '../assets/Question.svg';
import userprofileIcon from '../assets/UserProfile.svg';
import notificationIcon from '../assets/Notifications.svg';
import knowledgeIcon from '../assets/KnowledgeBase.svg';
import contactIcon from '../assets/ContactSupport.svg';
import feedbackIcon from '../assets/SendFeedback.svg';
import referIcon from '../assets/ReferColleague.svg'; 

interface TopNavigationProps {
  onLogout: () => void;
  onBackToMain?: () => void;
  onNavigate?: (page: string) => void;
  selectedOrganization: string;
  selectedAssistant: string;
}

interface Client {
  PRODUCT_NAME: any;
  CLIENT_NAME: any;
  client_id: number;
  client_name: string;
  account_id: string;
  connection_string: string;
  is_active: boolean;
  create_by: string;
  create_date: string;
  update_process: string;
  is_maineyes_practice: boolean;
  is_cloud_hosted: boolean;
  ioapi_url: string;
  chat_enabled: boolean;
  update_date: string;
}
// interface Product {
//   PRODUCT_ID: number;
//   PRODUCT_NAME: string;
//   PREFERENCES: string;
//   IS_ACTIVE: number;
//   CREATE_BY: string;
//   CREATE_DATE: string;
//   CREATE_PROCESS: string;
//   UPDATE_BY: string;
//   UPDATE_DATE: string;
//   UPDATE_PROCESS: string;
//   INTERNAL_NAME: string;
// }

const TopNavigation: React.FC<TopNavigationProps> = ({ onLogout, onNavigate, selectedOrganization: initialOrganization }) => {
  const [selectedOrganization, setSelectedOrganization] = useState(initialOrganization);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Fetch clients from the API
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      // Inside fetchClients function
      try {
        const response = await axios.get(`${Constants.API_BASE_URL}/api/clients`);
        console.log('API response data:', response.data); // Debug log
        if (!Array.isArray(response.data)) {
          console.error('Expected array response, got:', typeof response.data);
          throw new Error('Invalid response format');
        }
        setClients(response.data);
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? `Failed to fetch clients: ${err.response?.data?.error || err.message}`
          : 'Error loading clients. Using default list.';
        setError(errorMessage);
        console.error('Error details:', err); // Detailed error logging
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Close dropdown when clicking outside (only when dropdown is available)
  useEffect(() => {
    if (!onNavigate) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSettingsDropdownOpen(false);
      }
    };

    if (isSettingsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsDropdownOpen, onNavigate]);

  // Fallback to static list if API fails    

  return (
    <header className="navbar navbar-expand-lg bg-white" style={{ height: '60px', zIndex: 1030, borderBottom: '1px solid #300d2126' }}>
      <div className="container-fluid">
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
              className="btn btn-light dropdown-toggle d-flex align-items-center gap-2 bg-transparent" 
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              style={{ 
                minWidth: '200px', 
                  justifyContent: 'space-between',
                  backgroundColor: '#f3f3f5',
                  boxShadow: 'none'
              }}
            >
              {isLoading ? (
                <span className="text-start">Loading clients...</span>
              ) : (
                <span className="text-start">{selectedOrganization || 'Select Organization'}</span>
              )}
              <svg width="12" height="12" fill="currentColor" className="text-muted" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
            <ul className="dropdown-menu">
              {error && (
                <li className="dropdown-item text-danger">{error}</li>
              )}
              {clients.map((client) => (
                <li key={client.client_id}>
                  <button 
                    className={`dropdown-item ${selectedOrganization === client.client_name ? 'active' : ''}`}
                    onClick={() => setSelectedOrganization(client.client_name)}
                  >
                    {client.CLIENT_NAME}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Rest of your component */}
          {/* Assistant Dropdown */}
          <div className="dropdown">
            <button 
              className="btn btn-light dropdown-toggle d-flex align-items-center gap-2 dropdown-color" 
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              style={{  
                justifyContent: 'space-between',
              }}
            >
              <span className="text-start">
                <img src={plusIcon} alt="Help" style={{ width: '20px', height: '20px' }} />

              </span>
            </button>
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
          
          {/* Settings Button/Dropdown */}
          {onNavigate ? (          
             <div className="dropdown" ref={dropdownRef}>
              <button 
                className="btn px-2 d-flex gap-2 bg-transparent border-0" 
                type="button"
                data-bs-toggle="dropdown"
                title="Settings"                
                aria-expanded={isSettingsDropdownOpen}
                onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
              >
                <img src={settingIcon} alt="Settings" style={{ width: '20px', height: '20px' }} />     
                <img src={downarrowIcon} alt="Settings" style={{ width: '20px', height: '20px' }} />                     
              </button>
              <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: '220px' }}>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => {
                    onNavigate?.('overview');
                    setIsSettingsDropdownOpen(false);
                  }}>
                    Admin Dashboard
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => {
                    onNavigate?.('organization-business');
                    setIsSettingsDropdownOpen(false);
                  }}>          
                    Organization/Business Group
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => {
                    onNavigate?.('business');
                    setIsSettingsDropdownOpen(false);
                  }}>          
                    Business
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2"onClick={() => {
                    onNavigate?.('locations');
                    setIsSettingsDropdownOpen(false);
                  }}>                  
                    Locations
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => {
                    onNavigate?.('providers');
                    setIsSettingsDropdownOpen(false);
                  }}>                    
                    Providers
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => {
                    onNavigate?.('insurances');
                    setIsSettingsDropdownOpen(false);
                  }}>                    
                    Insurances
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => {
                    onNavigate?.('users');
                    setIsSettingsDropdownOpen(false);
                  }}>                    
                    Users
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => {
                    onNavigate?.('licenses');
                    setIsSettingsDropdownOpen(false);
                  }}>                    
                    Licenses & Billing
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2"  onClick={() => {
                    onNavigate?.('phone-sms');
                    setIsSettingsDropdownOpen(false);
                  }}>                    
                    Phone & SMS Management
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2"  onClick={() => {
                    onNavigate?.('payments');
                    setIsSettingsDropdownOpen(false);
                  }}>                    
                    Patient Payment Setup
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => console.log('PMS/EHR Setup clicked')}>                    
                    PMS/EHR Setup
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => {
                    onNavigate?.('data-tables');
                    setIsSettingsDropdownOpen(false);
                  }}>                    
                    Data Tables
                  </button>
                </li>
              </ul>
            </div>
          ) : null}
          
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
                  <button className="dropdown-item d-flex align-items-center gap-2"  onClick={onLogout} >                    
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>          
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;