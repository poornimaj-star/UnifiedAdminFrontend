import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Constants } from './constant';

// interface Organization {
//   id: number;
//   name: string;
//   type: string;
//   taxId: string;
//   address: string;
//   status: 'Active' | 'Inactive';
// }

const OrganizationBusinessSetup: React.FC = () => {
  // Add custom styles to override Bootstrap
  const customRadioStyles = `
    .custom-radio.form-check-input:checked {
      background-color: #e91e63 !important;
      border-color: #e91e63 !important;
    }
    .custom-radio.form-check-input:focus {
      border-color: #e91e63 !important;
      box-shadow: 0 0 0 0.25rem rgba(233, 30, 99, 0.25) !important;
    }
    .custom-radio[type="checkbox"]:checked {
      background-color: #e91e63 !important;
      border-color: #e91e63 !important;
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
  const [form, setForm] = useState({
    // Basic Organization Info
    organizationName: '',
    taxId: '',
    
    // Address Fields
    country: 'United States of America',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Virtual Assistant Configuration
    deploymentModel: 'single'
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const countries = [
    'United States of America',
    'Canada',
    'Antigua and Barbuda',
    'Bahamas',
    'Barbados',
    'Dominica',
    'Dominican Republic',
    'Grenada',
    'Guyana',
    'Jamaica',
    'Haiti',
    'Saint Lucia',
    'St. Kitts and Nevis',
    'Saint Vincent and the Grenadines',
    'Trinidad and Tobago',
    'Suriname'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleCountrySelect = (country: string) => {
    setForm(prev => ({ ...prev, country }));
    setShowCountryDropdown(false);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    
    // Basic form validation
    if (!form.organizationName.trim()) {
      setError('Organization name is required.');
      setLoading(false);
      return;
    }
    
    try {
      // Prepare data for database according to your organizations table schema
      const organizationData = {
        ORGANIZATION_NAME: form.organizationName,
        ACCOUNT_ID: `${form.organizationName.replace(/[^A-Za-z0-9]/g, '').toUpperCase()}`, // Generate unique account ID based on org name
        CHAT_ENABLED: true, // Hard-coded value
        CONNECTION_STRING: 'default_connection_string', // Hard-coded value
        IS_MAXIMEYES_PRACTICE: false, // Hard-coded value
        IS_CLOUD_HOSTED: true, // Hard-coded value
        IOPF_URL: 'https://default-iopf.example.com', // Hard-coded value
        IS_AUTO_TAG_ENABLED: true, // Hard-coded value
        ENVIRONMENT: 'production', // Hard-coded value
        MAXIMEYES_URL: 'https://default-maximeyes.example.com', // Hard-coded value
        IS_VA_ENABLED: true, // Hard-coded value
        IS_SCRIBE_ENABLED: true, // Hard-coded value
        IS_ACTIVE: true, // Hard-coded value
        
        // Additional fields (not in database but for form completeness)
        taxId: form.taxId,
        country: form.country,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        deploymentModel: form.deploymentModel,
        
        // Auto-generated fields
        CREATE_BY: 1, // Changed to integer (admin user ID)
        // CREATE_DATE will be set by MySQL NOW() function in backend
        CREATE_PROCESS: 1 // Changed to integer (1 = organization setup process)
      };
      
      console.log('📤 Sending organization data to API:', organizationData);
      console.log('🌐 API URL:', `${Constants.API_BASE_URL}/api/organizations`);

      const response = await axios.post(`${Constants.API_BASE_URL}/api/organizations`, organizationData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('✅ API Response:', response.data);
      setSuccess(`Organization "${form.organizationName}" saved successfully! ID: ${response.data.id}`);
      
      // Reset form after successful save
      setForm({
        organizationName: '',
        taxId: '',
        country: 'United States of America',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        deploymentModel: 'single'
      });
      
    } catch (err: any) {
      console.error('❌ Error saving organization:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error config:', err.config);
      
      // More detailed error handling
      if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your internet connection.');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Please check the server configuration.');
      } else if (err.response?.status === 500) {
        setError(`Server Error: ${err.response?.data?.details || err.response?.data?.error || 'Internal server error'}`);
      } else if (err.response?.data?.details) {
        setError(`Database Error: ${err.response.data.details}`);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(`Network Error: ${err.message}`);
      } else {
        setError('Failed to save organization details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h4 fw-semibold text-dark mb-1">Organization / Business Group</h1>
        <p className="text-muted mb-0">Configure your organization/business group details</p>
      </div>

      {/* Business Information Section */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '0.75rem' }}>
        <div className="card-body">
          <div className="mb-4">
            <h5 className="fw-semibold mb-1">Organization / Business Group Information</h5>
            <p className="text-muted small mb-0">Basic organization details at the Corporation level</p>
          </div>

          
            <form onSubmit={handleSave}>
              <div className="mb-4">
                {/* Organization Name and Tax ID */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label fw-medium text-dark mb-2">Organization / Business Group Name</label>
                    <input 
                      type="text"
                      name="organizationName"
                      className="form-control p-1 px-2"
                      value={form.organizationName}
                      onChange={handleChange}
                      placeholder="Enter organization/business group name"
                      style={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e0e0e0',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        width: '100%'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label fw-medium text-dark mb-2">Tax ID</label>
                    <input 
                      type="text"
                      name="taxId"
                      className="form-control p-1 px-2"
                      value={form.taxId}
                      onChange={handleChange}
                      placeholder="XX-XXXXXXX"
                      style={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e0e0e0',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>
                
                {/* Country */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label fw-medium text-dark mb-2">Country</label>
                  <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <button
                      type="button"
                      className="form-control p-1 px-2 d-flex justify-content-between align-items-center"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      style={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e0e0e0',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{form.country}</span>
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 12 12" 
                        fill="none"
                        style={{ 
                          transform: showCountryDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    {showCountryDropdown && (
                      <div 
                        className="dropdown-menu show"
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: '0',
                          right: '0',
                          zIndex: 1000,
                          backgroundColor: '#fff',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          marginTop: '2px',
                          maxHeight: '200px',
                          overflowY: 'auto',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        {countries.map((country) => (
                          <button
                            key={country}
                            type="button"
                            className="dropdown-item"
                            onClick={() => handleCountrySelect(country)}
                            style={{
                              padding: '8px 16px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              width: '100%',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Address Line 1 */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label fw-medium text-dark mb-2">Address Line 1</label>
                  <input 
                    type="text"
                    name="addressLine1"
                    className="form-control p-1 px-2"
                    value={form.addressLine1}
                    onChange={handleChange}
                    placeholder="Street address"
                    style={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e0e0e0',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      width: '100%'
                    }}
                  />
                </div>
                
                {/* Address Line 2 */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label fw-medium text-dark mb-2">Address Line 2</label>
                  <input 
                    type="text"
                    name="addressLine2"
                    className="form-control p-1 px-2"
                    value={form.addressLine2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    style={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e0e0e0',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      width: '100%'
                    }}
                  />
                </div>
                
                {/* City, State, Zip Code */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label fw-medium text-dark mb-2">City</label>
                    <input 
                      type="text"
                      name="city"
                      className="form-control p-1 px-2"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      style={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e0e0e0',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        width: '100%'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label fw-medium text-dark mb-2">State</label>
                    <input 
                      type="text"
                      name="state"
                      className="form-control p-1 px-2"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      style={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e0e0e0',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        width: '100%'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label fw-medium text-dark mb-2">Zip Code</label>
                    <input 
                      type="text"
                      name="zipCode"
                      className="form-control p-1 px-2"
                      value={form.zipCode}
                      onChange={handleChange}
                      placeholder="XXXXX"
                      style={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e0e0e0',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary px-4 py-2"
                  style={{
                    border: '1px solid #6c757d',
                    color: '#6c757d',
                    borderRadius: '6px'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn text-white px-4 py-2"
                  disabled={loading}
                  style={{ 
                    backgroundColor: loading ? '#6c757d' : '#e91e63',
                    border: 'none',
                    borderRadius: '6px',
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>

              {/* Success/Error Messages */}
              {success && <div className="alert alert-success mt-3">{success}</div>}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
        </div>
      </div>

      {/* Virtual Assistant Configuration Section */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '0.75rem' }}>
        <div className="card-body">
          <div className="mb-4">
            <h5 className="fw-semibold mb-1 text-dark">Virtual Assistant Configuration</h5>
            <p className="text-muted small mb-0">Configure how Virtual Assistants are deployed across your organization</p>
          </div>
          
          <div className="mb-4">
            <h6 className="fw-medium text-dark mb-3">Agent Deployment Model</h6>
            
            {/* Single Virtual Assistant Option */}
            <div className="mb-3">
              <div className="form-check d-flex align-items-start">
                <input 
                  className="form-check-input custom-radio mt-1" 
                  type="radio" 
                  name="deploymentModel" 
                  value="single"
                  id="singleAssistant"
                  checked={form.deploymentModel === 'single'}
                  onChange={handleChange}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                  }}
                />
                <div className="form-check-label ms-2" style={{ marginTop: '-2px' }}>
                  <div className="fw-medium text-dark mb-1">Single Virtual Assistant for Organization</div>
                  <div className="text-muted small">One Virtual Assistant serves all businesses under this organization. Most common configuration.</div>
                </div>
              </div>
            </div>
            
            {/* Separate Virtual Assistant Option */}
            <div className="mb-3">
              <div className="form-check d-flex align-items-start">
                <input 
                  className="form-check-input custom-radio mt-1" 
                  type="radio" 
                  name="deploymentModel" 
                  value="separate"
                  id="separateAssistant"
                  checked={form.deploymentModel === 'separate'}
                  onChange={handleChange}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                  }}
                />
                <div className="form-check-label ms-2" style={{ marginTop: '-2px' }}>
                  <div className="fw-medium text-dark mb-1">Separate Virtual Assistant per Business</div>
                  <div className="text-muted small">Each business has its own specially trained Virtual Assistant with unique URL to embed.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationBusinessSetup;