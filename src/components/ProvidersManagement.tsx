import React, { useState } from 'react';
import axios from 'axios';
import { Constants } from './constant';

interface Provider {
  provider_id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  specialty: string;
  NPI: string;
  is_enabled: number;
  is_active: number;
  create_by: number;
  create_process: number;
  create_date: string;
  update_process: number;
  update_date: string;
}

const ProvidersManagement: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Attempting to fetch providers from:', `${Constants.API_BASE_URL}/api/providers`);
        
        const response = await axios.get(`${Constants.API_BASE_URL}/api/providers`, {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('API response data:', response.data);
        
        if (!Array.isArray(response.data)) {
          console.error('Expected array response, got:', typeof response.data);
          throw new Error('Invalid response format - expected array');
        }
        
        setProviders(response.data);
        setError(null);
        
      } catch (err) {
        console.error('Error fetching providers:', err);
        
        let errorMessage = 'Failed to load providers. ';
        
        if (axios.isAxiosError(err)) {
          if (err.code === 'ECONNABORTED') {
            errorMessage += 'Server timeout. Check if backend is running on port 3001.';
          } else if (err.code === 'ERR_NETWORK') {
            errorMessage += 'Cannot connect to backend server. Is it running?';
          } else if (err.response?.status === 500) {
            errorMessage += 'Server maintenance in progress.';
          } else if (err.response?.status === 404) {
            errorMessage += 'API endpoint /api/providers not found.';
          } else {
            errorMessage += `Network issue detected (${err.response?.status || err.code}).`;
          }
        } else {
          errorMessage += 'Connection unavailable.';
        }
        
        setError(errorMessage);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Form state for new provider - matching your table columns
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    specialty: '',
    NPI: '',
    is_enabled: 1,
    is_active: 1
  });

  const fetchProviders = async () => {
    try {
      console.log('🔄 Manually fetching providers...');
      const response = await axios.get(`${Constants.API_BASE_URL}/api/providers?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log('📊 Manual fetch - providers data:', response.data);
      setProviders(response.data);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('❌ Error manually fetching providers:', err);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const fullName = `${provider.first_name} ${provider.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
    provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.NPI.includes(searchTerm);
  });

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditingProvider(null);
    setShowAddModal(true);
  };

  const handleEditProvider = (provider: Provider) => {
    setIsEditMode(true);
    setEditingProvider(provider);
    setFormData({
      first_name: provider.first_name,
      last_name: provider.last_name,
      middle_name: provider.middle_name || '',
      specialty: provider.specialty || '',
      NPI: provider.NPI,
      is_enabled: provider.is_enabled,
      is_active: provider.is_active
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditingProvider(null);
    // Reset form data when closing
    setFormData({
      first_name: '',
      last_name: '',
      middle_name: '',
      specialty: '',
      NPI: '',
      is_enabled: 1,
      is_active: 1
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProvider = async () => {
    try {
      setSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Basic validation
      if (!formData.first_name.trim() || !formData.last_name.trim()) {
        setErrorMessage('First name and last name are required.');
        return;
      }

      if (!formData.NPI.trim()) {
        setErrorMessage('NPI number is required.');
        return;
      }

      // Prepare data for API - match the exact table columns
      const providerData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name,
        specialty: formData.specialty,
        NPI: formData.NPI,
        is_enabled: formData.is_enabled,
        is_active: formData.is_active,
        ...(isEditMode ? {
          update_by: 1, // Admin user ID
          update_process: 2 // Provider update process
        } : {
          create_by: 1, // Admin user ID
          create_process: 1 // Provider creation process
        })
      };

      console.log(`📤 ${isEditMode ? 'Updating' : 'Creating'} provider data:`, providerData);

      let response;
      if (isEditMode && editingProvider) {
        // Update existing provider
        response = await axios.put(`${Constants.API_BASE_URL}/api/providers/${editingProvider.provider_id}`, providerData);
        console.log('✅ Provider updated:', response.data);
        setSuccessMessage('Provider updated successfully!');
      } else {
        // Create new provider
        response = await axios.post(`${Constants.API_BASE_URL}/api/providers`, providerData);
        console.log('✅ Provider created:', response.data);
        setSuccessMessage('Provider added successfully!');
      }
      
      // Refresh providers list using manual fetch function
      await fetchProviders();
      
      // Close modal after a short delay
      setTimeout(() => {
        handleCloseModal();
      }, 1500);

    } catch (err: any) {
      console.error('❌ Error saving provider:', err);
      if (err.response?.data?.details) {
        setErrorMessage(`Database Error: ${err.response.data.details}`);
      } else if (err.response?.data?.error) {
        setErrorMessage(err.response.data.error);
      } else if (err.message) {
        setErrorMessage(`Error: ${err.message}`);
      } else {
        setErrorMessage('Failed to save provider. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h4 fw-semibold text-dark mb-1">VisionCare Optical Centers - Providers Data</h1>
        <p className="text-muted mb-0">Manage provider records and configure agent-specific settings</p>
      </div>

      {/* Provider Records Section */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '0.75rem' }}>
        <div className="card-body">
          <div className="mb-4">
            <h5 className="fw-semibold mb-1">Provider Records</h5>
            <p className="text-muted small mb-0">Manage providers and configure settings for each AI agent</p>
          </div>

          {/* Search Bar and Buttons */}
          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">🔍</span>
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search by provider name, specialty, or NPI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <button className="btn btn-dark w-100" onClick={handleOpenModal}>Add New Provider</button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3">
            <span className="text-muted small">Showing {filteredProviders.length} of {providers.length} providers</span>
          </div>

          {/* Providers Table */}
          <div className="table-responsive">
            <table className="table table-hover" key={`providers-table-${refreshKey}`}>
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Provider Name</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Specialty</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>NPI</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Status</th>
                  <th className="fw-semibold text-muted text-end" style={{ fontSize: '0.875rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                      Loading providers...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <div className="text-warning">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : filteredProviders.map((provider) => (
                  <tr key={provider.provider_id} className="border-bottom">
                    <td className="py-3">
                      <span className="fw-medium text-primary" style={{ cursor: 'pointer' }}>{`${provider.first_name} ${provider.last_name}`}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-muted">{provider.specialty}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-dark">{provider.NPI}</span>
                    </td>
                    <td className="py-3">
                      <span className={`badge rounded-pill px-2 py-1 ${provider.is_active && provider.is_enabled ? 'bg-dark text-white' : 'bg-light text-muted border'}`} style={{ fontSize: '0.75rem' }}>
                        {provider.is_active && provider.is_enabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-end">
                      <button 
                        className="btn btn-link text-decoration-none p-1 px-2 " 
                        style={{ color: '#000', fontSize: '0.9rem', border: '1px solid #ddd' }}
                        onClick={() => handleEditProvider(provider)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No Results */}
          {filteredProviders.length === 0 && (
            <div className="text-center py-5">
              <div className="text-muted">
                <h6>No providers found</h6>
                <p className="small mb-0">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Provider Modal */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-lg justify-content-center">
            <div className="modal-content" style={{ borderRadius: '0.75rem', width: '30rem' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-semibold">{isEditMode ? 'Edit Provider' : 'Add New Provider'}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-4">{isEditMode ? 'Update provider information and agent-specific settings' : 'Collect provider information and agent-specific settings'}</p>
                
                <form style={{height: 'calc(100vh - 15rem)', overflowY: 'auto', overflowX: 'hidden'}}>
                  {/* Provider Information Section */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">Provider Information</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small text-muted">First Name <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          name="first_name"
                          className="form-control" 
                          placeholder="Enter first name" 
                          value={formData.first_name}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-muted">Last Name <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          name="last_name"
                          className="form-control" 
                          placeholder="Enter last name" 
                          value={formData.last_name}
                          onChange={handleFormChange}
                          required
                        />
                      </div>                      
                      <div className="col-md-6">
                        <label className="form-label small text-muted">NPI Number <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          name="NPI"
                          className="form-control" 
                          placeholder="10-digit NPI" 
                          value={formData.NPI}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-muted">Specialty</label>
                        <input 
                          type="text" 
                          name="specialty"
                          className="form-control" 
                          placeholder="e.g., Optometry" 
                          value={formData.specialty}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-muted">Status</label>
                        <select 
                          name="is_active"
                          className="form-select"
                          value={formData.is_active}
                          onChange={handleFormChange}
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Agent-Specific Configuration */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">Agent-Specific Configuration</h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small text-muted">Greeting Message</label>
                        <textarea className="form-control" rows={2} placeholder="Custom greeting for this provider"></textarea>
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-muted">Virtual Assistant</label>
                        <select className="form-select">
                          <option>Default (standard for this provider)</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-muted">Provider Schedule Template</label>
                        <select className="form-select">
                          <option>Default schedule for this provider</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-muted">Availability Message</label>
                        <textarea className="form-control" rows={2} placeholder="Custom availability message"></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Upsell */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">Upsell</h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small text-muted">Preferred Documentation Style</label>
                        <select className="form-select">
                          <option>Standard documentation</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-muted">Digital Signature</label>
                        <input type="text" className="form-control" placeholder="Provider's digital signature" />
                      </div>
                    </div>
                  </div>

                  {/* Billing Assistant */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">Billing Assistant</h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small text-muted">Specialty</label>
                        <input type="text" className="form-control" placeholder="Enter provider-specific details" />
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-muted">Billing NPI</label>
                        <input type="text" className="form-control" placeholder="Billing NPI number" />
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-muted">Default CPT Codes</label>
                        <textarea className="form-control" rows={2} placeholder="Common CPT codes for this provider"></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Patient Portal */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">Patient Portal</h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small text-muted">Provider Bio</label>
                        <textarea className="form-control" rows={2} placeholder="Bio for patient portal"></textarea>
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-muted">Provider Photo</label>
                        <input type="file" className="form-control" />
                      </div>
                    </div>
                  </div>

                  {/* Patient Engagement */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">Patient Engagement</h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small text-muted">Campaign Preferences</label>
                        <select className="form-select">
                          <option>Default campaign settings</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-muted">Email Signature</label>
                        <textarea className="form-control" rows={2} placeholder="Signature for patient communications"></textarea>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer border-0 pt-0">
                {/* Success/Error Messages */}
                {successMessage && (
                  <div className="alert alert-success alert-sm mb-2 w-100">
                    <small>{successMessage}</small>
                  </div>
                )}
                {errorMessage && (
                  <div className="alert alert-danger alert-sm mb-2 w-100">
                    <small>{errorMessage}</small>
                  </div>
                )}
                
                <button type="button" className="btn btn-light" onClick={handleCloseModal}>Cancel</button>
                <button 
                  type="button" 
                  className="btn btn-dark"
                  onClick={handleSaveProvider}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (isEditMode ? 'Update Provider' : 'Save Changes')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvidersManagement;