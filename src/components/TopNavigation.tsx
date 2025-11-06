import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Constants } from './constant';

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
interface Product {
  PRODUCT_ID: number;
  PRODUCT_NAME: string;
  PREFERENCES: string;
  IS_ACTIVE: number;
  CREATE_BY: string;
  CREATE_DATE: string;
  CREATE_PROCESS: string;
  UPDATE_BY: string;
  UPDATE_DATE: string;
  UPDATE_PROCESS: string;
  INTERNAL_NAME: string;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onLogout, onBackToMain, onNavigate, selectedOrganization: initialOrganization, selectedAssistant: initialAssistant }) => {
  const [selectedOrganization, setSelectedOrganization] = useState(initialOrganization);
  const [selectedAssistant, setSelectedAssistant] = useState(initialAssistant);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
const [products, setProducts] = useState<Product[]>([]);


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

  const assistants = [
    'Assistant A',
    'Assistant B',
    'Assistant C'
  ];

  function handleAssistantSelect(assistant: string): void {
    setSelectedAssistant(assistant);
    // Find the selected client by organization name
    const selectedClient = clients.find(
      client => client.client_name === selectedOrganization || client.CLIENT_NAME === selectedOrganization
    );
    const accountId = selectedClient?.account_id;
    if (accountId) {
      axios.get(`${Constants.API_BASE_URL}/api/products`, {
        params: {
          accountId: accountId
          // You can add internalName, doj, llm if needed
        }
      })
        .then(res => setProducts(res.data))
        .catch(() => setProducts([]));
    } else {
      setProducts([]);
    }
  }

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
                <span className="text-start">{selectedOrganization || 'Select Organization'}</span>
              )}
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
        onClick={(e) => {
          e.stopPropagation(); // Stop event propagation
          handleAssistantSelect(assistant);
        }}
      >
        {assistant}
      </button>
      {/* Show products for selected assistant */}
      {selectedAssistant === assistant && products.length > 0 && (
        <ul className="list-group mt-2" onClick={(e) => e.stopPropagation()}>
          {products.map(product => (
            <li key={product.PRODUCT_ID} className="list-group-item">
              {product.PRODUCT_NAME}
            </li>
          ))}
        </ul>
      )}
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