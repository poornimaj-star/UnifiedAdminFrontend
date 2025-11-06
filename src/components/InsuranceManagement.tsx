import React, { useState } from 'react';

interface Insurance {
  id: number;
  name: string;
  payerId: string;
  location: string;
  eligibilityMapping: 'Mapped' | 'Unmapped';
}

interface Provider {
  id: number;
  name: string;
  specialty: string;
  selected: boolean;
}

const InsuranceManagement: React.FC = () => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null);
  
  const [providers, setProviders] = useState<Provider[]>([
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Ophthalmology', selected: true },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Optometry', selected: true },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Pediatric Ophthalmology', selected: false },
    { id: 4, name: 'Dr. David Williams', specialty: 'Retina Specialist', selected: true },
    { id: 5, name: 'Dr. Lisa Thompson', specialty: 'Optometry', selected: false },
    { id: 6, name: 'Dr. James Park', specialty: 'Internal Medicine', selected: false }
  ]);
  const [insuranceConfig, setInsuranceConfig] = useState({
    insuranceName: '',
    location: '',
    customerServicePhone: '',
    eligibilityPayerId: '',
    unusedBenefits: 'Enabled',
    website: '',
    username: '',
    password: '',
    corporateId: '',
    excludeEligibility: false,
    excludeClaimSubmission: false,
    excludePosting: false,
    excludeARManagement: false,
    inNetworkProviders: ''
  });

  const [insurances] = useState<Insurance[]>([
    {
      id: 1,
      name: 'Anthem Blue Cross and Blue Shield - 12345',
      payerId: 'ANTHEM001',
      location: 'Main Office',
      eligibilityMapping: 'Mapped'
    },
    {
      id: 2,
      name: 'Blue Cross Blue Shield',
      payerId: 'BCBS001',
      location: 'Main Office',
      eligibilityMapping: 'Mapped'
    },
    {
      id: 3,
      name: 'Health Care Service Corporation Group - 33434',
      payerId: 'CIGNA001',
      location: 'Downtown Clinic',
      eligibilityMapping: 'Unmapped'
    },
    {
      id: 4,
      name: 'Humana Gold Plus HMO',
      payerId: 'HUMANA001',
      location: 'West Branch',
      eligibilityMapping: 'Mapped'
    },
    {
      id: 5,
      name: 'Kaiser Permanente',
      payerId: 'KAISER001',
      location: 'Downtown Clinic',
      eligibilityMapping: 'Unmapped'
    },
    {
      id: 6,
      name: 'Medicaid Managed Care - 45678',
      payerId: 'MCAID001',
      location: 'All Locations',
      eligibilityMapping: 'Unmapped'
    },
    {
      id: 7,
      name: 'Medicare Part A',
      payerId: 'MCARE001',
      location: 'All Locations',
      eligibilityMapping: 'Mapped'
    },
    {
      id: 8,
      name: 'Tricare Standard',
      payerId: 'TRICARE001',
      location: 'All Locations',
      eligibilityMapping: 'Unmapped'
    },
    {
      id: 9,
      name: 'United Steelworkers Union Health Insurance',
      payerId: 'AETNA001',
      location: 'Main Office',
      eligibilityMapping: 'Mapped'
    },
    {
      id: 10,
      name: 'UnitedHealthcare Community Plan',
      payerId: 'UHC001',
      location: 'Main Office',
      eligibilityMapping: 'Mapped'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [insuranceFilter, setInsuranceFilter] = useState('');

  const locations = ['All Locations', 'Main Office', 'Downtown Clinic', 'West Branch'];

  const filteredInsurances = insurances.filter(insurance => {
    const matchesSearch = insurance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insurance.payerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === '' || locationFilter === 'All Locations' || insurance.location === locationFilter;
    const matchesInsuranceFilter = insuranceFilter === '' || insurance.eligibilityMapping === insuranceFilter;
    
    return matchesSearch && matchesLocation && matchesInsuranceFilter;
  });

  const handleEditConfiguration = (insuranceId: number) => {
    const insurance = insurances.find(ins => ins.id === insuranceId);
    if (insurance) {
      setIsEditing(true);
      setSelectedInsurance(insurance);
      setInsuranceConfig({
        insuranceName: insurance.name,
        location: insurance.location,
        customerServicePhone: '(XXX) XXX-XXXX',
        eligibilityPayerId: insurance.payerId,
        unusedBenefits: 'Enabled',
        website: 'https://www.example-insurance.com',
        username: 'admin@practice.com',
        password: '••••••••',
        corporateId: 'CORP12345',
        excludeEligibility: false,
        excludeClaimSubmission: false,
        excludePosting: true,
        excludeARManagement: false,
        inNetworkProviders: 'Dr. Sarah Johnson, Dr. Michael Chen, Dr. David Williams'
      });
      setShowConfigModal(true);
    }
  };

  const handleCloseConfigModal = () => {
    setShowConfigModal(false);
    setIsEditing(false);
    setSelectedInsurance(null);
  };

  const handleConfigInputChange = (field: keyof typeof insuranceConfig, value: string | boolean) => {
    setInsuranceConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving insurance configuration:', insuranceConfig);
    handleCloseConfigModal();
  };

  const handleOpenProviderModal = () => {
    setShowProviderModal(true);
  };

  const handleCloseProviderModal = () => {
    setShowProviderModal(false);
  };

  const handleProviderToggle = (providerId: number) => {
    setProviders(prev => 
      prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, selected: !provider.selected }
          : provider
      )
    );
  };

  const handleSaveProviders = () => {
    const selectedProviders = providers
      .filter(provider => provider.selected)
      .map(provider => provider.name)
      .join(', ');
    
    setInsuranceConfig(prev => ({
      ...prev,
      inNetworkProviders: selectedProviders
    }));
    
    handleCloseProviderModal();
  };

  const handleAddNewInsurance = () => {
    setIsEditing(false);
    setSelectedInsurance(null);
    setInsuranceConfig({
      insuranceName: '',
      location: 'Main Office',
      customerServicePhone: '',
      eligibilityPayerId: '',
      unusedBenefits: 'Enabled',
      website: '',
      username: '',
      password: '',
      corporateId: '',
      excludeEligibility: false,
      excludeClaimSubmission: false,
      excludePosting: false,
      excludeARManagement: false,
      inNetworkProviders: ''
    });
    setShowConfigModal(true);
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h4 fw-semibold text-dark mb-1">VisionCare Optical Centers - Insurances Data</h1>
        <p className="text-muted mb-0">Manage insurance records and configure agent-specific settings</p>
      </div>

      {/* Insurance Records Section */}
      <div className="card border-1" style={{ borderRadius: '0.75rem', borderColor: '#ddd' }}>
        <div className="card-body">
          <div className="mb-4">
            <h6 className="fw-semibold mb-1">Insurance Records</h6>
            <p className="text-muted small mb-0">Search and manage insurance records with agent-specific configurations</p>
          </div>

          {/* Search and Filters */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search by insurance name or payer ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={insuranceFilter}
                onChange={(e) => setInsuranceFilter(e.target.value)}
              >
                <option value="">All Insurances</option>
                <option value="Mapped">Mapped</option>
                <option value="Unmapped">Unmapped</option>
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-dark w-100"
                onClick={handleAddNewInsurance}
              >
                Add New Insurance
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3">
            <span className="text-muted small">Showing {filteredInsurances.length} of {insurances.length} insurance records</span>
          </div>

          {/* Insurance Table */}
          <div className="table-responsive" style={{ border: '1px solid #ddd', borderRadius: '.5rem', height: 'calc(100vh - 25rem)', overflow: 'hidden' }}>
            <table className="table table-hover mb-0">
              <thead className="table-light sticky-top">
                <tr>
                  <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem', width: '38.4rem' }}>Insurance Name</th>
                  <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem', width: '12.3rem' }}>Payer ID</th>
                  <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem', width: '15rem' }}>Location</th>
                  <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem', width: '20rem' }}>Eligibility Mapping</th>
                  <th className="fw-semibold text-dark text-end" style={{ fontSize: '0.875rem', }}>Actions</th>
                </tr>
              </thead>
            </table>
            <div style={{ height: 'calc(100vh - 27.5rem)', overflowY: 'auto' }}>
              <table className="table table-hover mb-0">
                <tbody>
                  {filteredInsurances.map((insurance) => (
                    <tr key={insurance.id} className="border-bottom">
                      <td className="py-3">
                        <span className="text-dark" style={{ cursor: 'pointer', fontSize: '.9rem' }}>
                          {insurance.name}
                        </span>
                      </td>
                      <td className="py-3" style={{ fontSize: '.9rem' }}>
                        <span className="text-dark">{insurance.payerId}</span>
                      </td>
                      <td className="py-3" style={{ fontSize: '.9rem' }}>
                        <span className="text-dark">{insurance.location}</span>
                      </td>
                      <td className="py-3">
                        <span 
                          className={`badge rounded-pill px-2 py-1 ${
                            insurance.eligibilityMapping === 'Mapped' 
                              ? 'bg-dark text-white' 
                              : 'bg-light text-muted border'
                          }`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {insurance.eligibilityMapping}
                        </span>
                      </td>
                      <td className="py-3 text-end">
                        <button
                          className="btn btn-link text-decoration-none p-1 px-2"
                          onClick={() => handleEditConfiguration(insurance.id)}
                          style={{ color: '#000', fontSize: '0.875rem', border: '1px solid #ddd' }}
                        >
                          Edit Configuration
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* No Results */}
          {filteredInsurances.length === 0 && (
            <div className="text-center py-5">
              <div className="text-muted">
                <h6>No insurance records found</h6>
                <p className="small mb-0">Try adjusting your search criteria or filters</p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {/* {filteredInsurances.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
              <div className="text-muted small">
                Showing 1 to {filteredInsurances.length} of {filteredInsurances.length} entries
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className="page-item disabled">
                    <span className="page-link">Previous</span>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">1</span>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link">Next</span>
                  </li>
                </ul>
              </nav>
            </div>
          )} */}
        </div>
      </div>

      {/* Insurance Configuration Modal */}
      {showConfigModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg justify-content-center">
            <div className="modal-content" style={{ borderRadius: '0.75rem', border: 'none', width: '32rem' }}>
              <div className="modal-header border-bottom-0 pb-2">
                <div>
                  <h5 className="modal-title fw-semibold mb-1 text-dark">
                    {isEditing ? `Edit Insurance Configuration - ${selectedInsurance?.name}` : 'Add New Insurance'}
                  </h5>
                  <p className="text-muted small mb-0">
                    {isEditing ? 'Configure settings for this insurance provider' : 'Configure settings for new insurance provider'}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-dark" 
                  onClick={handleCloseConfigModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0">
                <form onSubmit={handleSaveConfiguration}>
                  <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '1.5rem' }}>
                    
                    {/* Insurance Information Section */}
                    <div className="mb-4 p-3" style={{ border: '1px solid #ddd', borderRadius: '.5rem',}}>
                      <h6 className="mb-3 text-dark" style={{fontWeight: '400'}}>Insurance Information</h6>
                      
                      <div className="mb-3">
                        <label className="form-label text-dark small fw-medium">Insurance Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={insuranceConfig.insuranceName}
                          onChange={(e) => handleConfigInputChange('insuranceName', e.target.value)}
                          style={{ backgroundColor: '#f8f9fa', border: '0' }}
                        />
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-medium">Location</label>
                          <select
                            className="form-select"
                            value={insuranceConfig.location}
                            onChange={(e) => handleConfigInputChange('location', e.target.value)}
                            style={{ backgroundColor: '#f8f9fa', border: '0' }}
                          >
                            <option value="Main Office">Main Office</option>
                            <option value="Downtown Clinic">Downtown Clinic</option>
                            <option value="West Branch">West Branch</option>
                            <option value="All Locations">All Locations</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-medium">Customer Service Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="(XXX) XXX-XXXX"
                            value={insuranceConfig.customerServicePhone}
                            onChange={(e) => handleConfigInputChange('customerServicePhone', e.target.value)}
                            style={{ backgroundColor: '#f8f9fa', border: '0' }}
                          />
                        </div>
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-md-12">
                          <label className="form-label text-dark small fw-medium">
                            Eligibility Payer ID 
                            <span className="text-muted ms-1">ⓘ</span>
                          </label>
                          <select
                            className="form-select"
                            value={insuranceConfig.eligibilityPayerId}
                            onChange={(e) => handleConfigInputChange('eligibilityPayerId', e.target.value)}
                            style={{ backgroundColor: '#f8f9fa', border: '0' }}
                          >
                            <option value="ANTHEM001 - Anthem">ANTHEM001 - Anthem</option>
                            <option value="BCBS001 - Blue Cross Blue Shield">BCBS001 - Blue Cross Blue Shield</option>
                            <option value="CIGNA001 - Cigna">CIGNA001 - Cigna</option>
                          </select>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label text-dark small fw-medium">
                            Unused Benefits 
                            <span className="text-muted ms-1">ⓘ</span>
                          </label>
                          <select
                            className="form-select"
                            value={insuranceConfig.unusedBenefits}
                            onChange={(e) => handleConfigInputChange('unusedBenefits', e.target.value)}
                            style={{ backgroundColor: '#f8f9fa', border: '0' }}
                          >
                            <option value="Enabled">Enabled</option>
                            <option value="Disabled">Disabled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Website Credentials Section */}
                    <div className="mb-4 p-3" style={{ border: '1px solid #ddd', borderRadius: '.5rem',}}>
                      <div className="d-flex align-items-center mb-3">
                        <h6 className="fw-semibold mb-0 me-2 text-dark">Website Credentials</h6>
                        <span className="text-muted">ⓘ</span>
                      </div>
                      <p className="text-muted small mb-3">Login information for the insurance provider portal</p>
                      
                      <div className="mb-3">
                        <label className="form-label text-dark small fw-medium">Website</label>
                        <input
                          type="url"
                          className="form-control"
                          value={insuranceConfig.website}
                          onChange={(e) => handleConfigInputChange('website', e.target.value)}
                          style={{ backgroundColor: '#f8f9fa', border: '0' }}
                        />
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-medium">Username</label>
                          <input
                            type="text"
                            className="form-control"
                            value={insuranceConfig.username}
                            onChange={(e) => handleConfigInputChange('username', e.target.value)}
                            style={{ backgroundColor: '#f8f9fa', border: '0' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-dark small fw-medium">Password</label>
                          <div className="input-group">
                            <input
                              type="password"
                              className="form-control"
                              value={insuranceConfig.password}
                              onChange={(e) => handleConfigInputChange('password', e.target.value)}
                              style={{ backgroundColor: '#f8f9fa', border: '0' }}
                            />                            
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label text-dark small fw-medium">
                          Corporate ID 
                          <span className="text-muted ms-1">ⓘ</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={insuranceConfig.corporateId}
                          onChange={(e) => handleConfigInputChange('corporateId', e.target.value)}
                          style={{ backgroundColor: '#f8f9fa', border: '0' }}
                        />
                      </div>
                    </div>
                    
                    {/* Exclude from Automation Section */}
                    <div className="mb-4 p-3" style={{ border: '1px solid #ddd', borderRadius: '.5rem',}}>
                      <h6 className="fw-semibold mb-2 text-dark">Exclude from Automation</h6>
                      <p className="text-muted small mb-3">Select which automated processes should skip this insurance</p>
                      
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="excludeEligibility"
                              checked={insuranceConfig.excludeEligibility}
                              onChange={(e) => handleConfigInputChange('excludeEligibility', e.target.checked)}
                              style={{
                                backgroundColor: insuranceConfig.excludeEligibility ? '#000' : '#fff',
                                borderColor: insuranceConfig.excludeEligibility ? '#000' : '#dee2e6'
                              }}
                            />
                            <label className="form-check-label text-dark" htmlFor="excludeEligibility">
                              Eligibility
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="excludeClaimSubmission"
                              checked={insuranceConfig.excludeClaimSubmission}
                              onChange={(e) => handleConfigInputChange('excludeClaimSubmission', e.target.checked)}
                              style={{
                                backgroundColor: insuranceConfig.excludeClaimSubmission ? '#000' : '#fff',
                                borderColor: insuranceConfig.excludeClaimSubmission ? '#000' : '#dee2e6'
                              }}
                            />
                            <label className="form-check-label text-dark" htmlFor="excludeClaimSubmission">
                              Claim Submission
                            </label>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="excludePosting"
                              checked={insuranceConfig.excludePosting}
                              onChange={(e) => handleConfigInputChange('excludePosting', e.target.checked)}
                              style={{
                                backgroundColor: insuranceConfig.excludePosting ? '#000' : '#fff',
                                borderColor: insuranceConfig.excludePosting ? '#000' : '#dee2e6'
                              }}
                            />
                            <label className="form-check-label text-dark" htmlFor="excludePosting">
                              Posting
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="excludeARManagement"
                              checked={insuranceConfig.excludeARManagement}
                              onChange={(e) => handleConfigInputChange('excludeARManagement', e.target.checked)}
                              style={{
                                backgroundColor: insuranceConfig.excludeARManagement ? '#000' : '#fff',
                                borderColor: insuranceConfig.excludeARManagement ? '#000' : '#dee2e6'
                              }}
                            />
                            <label className="form-check-label text-dark" htmlFor="excludeARManagement">
                              AR Management
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* In-Network Providers Section */}
                    <div className="mb-4 p-3" style={{ border: '1px solid #ddd', borderRadius: '.5rem',}}>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="fw-semibold mb-0 text-dark">In-Network Providers</h6>
                          <p className="text-muted small mb-0">Providers who are in-network for this insurance</p>
                        </div>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary btn-sm text-dark"
                          onClick={handleOpenProviderModal}
                        >
                          Select Providers
                        </button>
                      </div>
                      
                      <div className="mb-3">
                        <textarea
                          className="form-control"
                          rows={3}
                          value={insuranceConfig.inNetworkProviders}
                          onChange={(e) => handleConfigInputChange('inNetworkProviders', e.target.value)}
                          style={{ backgroundColor: '#f8f9fa', border: '0', resize: 'none' }}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="d-flex gap-2 justify-content-end p-3 border-top" style={{ backgroundColor: '#ffffff', borderRadius: '0 0 .75rem .75rem' }}>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary px-4"
                      onClick={handleCloseConfigModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-dark px-4"
                    >
                      {isEditing ? 'Save Changes' : 'Add Insurance'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provider Selection Modal */}
      {showProviderModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '0.75rem', border: 'none' }}>
              <div className="modal-header border-bottom-0 pb-2">
                <div>
                  <h5 className="modal-title fw-semibold mb-1">Select In-Network Providers</h5>
                  <p className="text-muted small mb-0">
                    Choose which providers are in-network for {selectedInsurance ? selectedInsurance.name : 'this insurance'}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseProviderModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body pt-3">
                <div className="providers-list">
                  {providers.map((provider) => (
                    <div 
                      key={provider.id} 
                      className={`d-flex align-items-center justify-content-between p-3 mb-2 border rounded ${
                        provider.selected ? 'bg-light border-success' : 'bg-white border-light'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleProviderToggle(provider.id)}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input me-3"
                          checked={provider.selected}
                          readOnly
                          style={{
                            backgroundColor: provider.selected ? '#000' : '#fff',
                            borderColor: provider.selected ? '#000' : '#dee2e6',
                            cursor: 'pointer'
                          }}
                        />
                        <div>
                          <div className="fw-medium text-dark">{provider.name}</div>
                          <div className="text-muted small">- {provider.specialty}</div>
                        </div>
                      </div>
                      {provider.selected && (
                        <div className="text-success">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-3">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary px-4"
                  onClick={handleCloseProviderModal}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-dark px-4"
                  onClick={handleSaveProviders}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceManagement;