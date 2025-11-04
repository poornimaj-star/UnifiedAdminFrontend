import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface TopNavigationProps {
  onLogout: () => void;
  onBackToMain?: () => void;
  onNavigate?: (page: string) => void;
  selectedOrganization: string;
  selectedAssistant: string;
}

interface Client {
  client_id: number;
  client_name: string;
  // Add other fields from your stored procedure as needed
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onLogout, onBackToMain, onNavigate, selectedOrganization: initialOrganization, selectedAssistant: initialAssistant }) => {
  const [selectedOrganization, setSelectedOrganization] = useState(initialOrganization);
  const [selectedAssistant, setSelectedAssistant] = useState(initialAssistant);
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
        const response = await axios.get('http://localhost:3001/api/clients');
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
        console.error('Error details:', err);
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
  const organizations = clients.length > 0 
    ? clients.map(client => client.client_name)
    : [
        'ClearView Eye Associates',
        'VisionCare Optical Centers',
        'OptiHealth Retail Group'
      ];

  const assistants = [
    'Assistant A',
    'Assistant B',
    'Assistant C'
  ];

  return (
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
              {isLoading ? (
                <span className="text-start">Loading clients...</span>
              ) : (
                <span className="text-start">{selectedOrganization}</span>
              )}
            </button>
            <ul className="dropdown-menu">
              {error && (
                <li className="dropdown-item text-danger">{error}</li>
              )}
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
          
          {/* Rest of your component */}
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
              <span className="text-start">{selectedAssistant}</span>
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
          {onBackToMain && (
            <button 
              className="btn btn-outline-primary btn-sm px-3" 
              onClick={onBackToMain} 
              title="Back to Main Screen"
            >
              ← Back to Main
            </button>
          )}
          <button className="btn btn-light" style={{ width: '36px', height: '36px', padding: 0 }} title="Notifications">
            🔔
          </button>
          
          {/* Settings Button/Dropdown */}
          {onNavigate ? (
            <div className="dropdown position-relative" ref={dropdownRef}>
              <button 
                className="btn btn-light dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded={isSettingsDropdownOpen}
                onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
                style={{ width: '36px', height: '36px', padding: 0, border: 'none' }} 
                title="Settings"
              >
                ⚙️
              </button>
              <ul 
                className={`dropdown-menu dropdown-menu-end settings-dropdown ${isSettingsDropdownOpen ? 'show' : ''}`} 
                style={{ 
                  minWidth: '220px',
                  display: isSettingsDropdownOpen ? 'block' : 'none',
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  zIndex: 1000
                }}
              >
              <li>
                <button 
                  className="dropdown-item d-flex align-items-center gap-3 py-2"
                  onClick={() => {
                    onNavigate?.('overview');
                    setIsSettingsDropdownOpen(false);
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📊</span>
                  <span>Admin Dashboard</span>
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item d-flex align-items-center gap-3 py-2"
                  onClick={() => {
                    onNavigate?.('users');
                    setIsSettingsDropdownOpen(false);
                  }}
                >
                  <span style={{ fontSize: '16px' }}>👥</span>
                  <span>Users</span>
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item d-flex align-items-center gap-3 py-2"
                  onClick={() => {
                    onNavigate?.('licenses');
                    setIsSettingsDropdownOpen(false);
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📋</span>
                  <span>Licenses & Billing</span>
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item d-flex align-items-center gap-3 py-2"
                  onClick={() => {
                    onNavigate?.('phone-sms');
                    setIsSettingsDropdownOpen(false);
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📱</span>
                  <span>Phone & SMS Management</span>
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item d-flex align-items-center gap-3 py-2"
                  onClick={() => {
                    onNavigate?.('payments');
                    setIsSettingsDropdownOpen(false);
                  }}
                >
                  <span style={{ fontSize: '16px' }}>💳</span>
                  <span>Payments Setup</span>
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item d-flex align-items-center gap-3 py-2"
                  onClick={() => {
                    onNavigate?.('data-tables');
                    setIsSettingsDropdownOpen(false);
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📁</span>
                  <span>Data Tables</span>
                </button>
              </li>
            </ul>
            </div>
          ) : (
            <button className="btn btn-light" style={{ width: '36px', height: '36px', padding: 0 }} title="Settings">
              ⚙️
            </button>
          )}
          
          <button className="btn btn-light" style={{ width: '36px', height: '36px', padding: 0 }} title="Profile">
            👤
          </button>
          <button 
            className="btn btn-light text-danger" 
            style={{ width: '36px', height: '36px', padding: 0 }} 
            onClick={onLogout} 
            title="Logout"
          >
            🚪
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;