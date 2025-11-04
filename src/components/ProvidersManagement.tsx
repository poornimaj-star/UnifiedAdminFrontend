import React, { useState } from 'react';

interface Provider {
  id: number;
  name: string;
  specialty: string;
  npi: string;
  status: 'Active' | 'Inactive';
}

const ProvidersManagement: React.FC = () => {
  const [providers] = useState<Provider[]>([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Ophthalmology',
      npi: '1234567890',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Optometry',
      npi: '2345678901',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatric Ophthalmology',
      npi: '3456789012',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Dr. David Williams',
      specialty: 'Retina Specialist',
      npi: '4567890123',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Dr. Lisa Thompson',
      specialty: 'Optometry',
      npi: '5678901234',
      status: 'Inactive'
    },
    {
      id: 6,
      name: 'Dr. James Park',
      specialty: 'Cornea Specialist',
      npi: '6789012345',
      status: 'Active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProviders = providers.filter(provider => {
    return provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
           provider.npi.includes(searchTerm);
  });

  const handleOpenModal = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
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

          {/* Search Bar and Add Button */}
          <div className="row g-3 mb-4">
            <div className="col-md-10">
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
            <table className="table table-hover">
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
                {filteredProviders.map((provider) => (
                  <tr key={provider.id} className="border-bottom">
                    <td className="py-3">
                      <span className="fw-medium text-primary" style={{ cursor: 'pointer' }}>{provider.name}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-muted">{provider.specialty}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-dark">{provider.npi}</span>
                    </td>
                    <td className="py-3">
                      <span className={`badge rounded-pill px-2 py-1 ${provider.status === 'Active' ? 'bg-dark text-white' : 'bg-light text-muted border'}`} style={{ fontSize: '0.75rem' }}>
                        {provider.status}
                      </span>
                    </td>
                    <td className="py-3 text-end">
                      <button className="btn btn-link text-decoration-none p-0" style={{ color: '#6c757d', fontSize: '0.875rem' }}>Edit</button>
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: '0.75rem' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-semibold">Add New Provider</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-4">Collect provider information and agent-specific settings</p>
                
                <form>
                  {/* Provider Information Section */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">Provider Information</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small text-muted">First Name</label>
                        <input type="text" className="form-control" placeholder="Enter first name" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-muted">Last Name</label>
                        <input type="text" className="form-control" placeholder="Enter last name" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-muted">Specialty</label>
                        <input type="text" className="form-control" placeholder="e.g., Optometry" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-muted">NPI Number</label>
                        <input type="text" className="form-control" placeholder="10-digit NPI" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-muted">Email</label>
                        <input type="email" className="form-control" placeholder="provider@example.com" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-muted">Phone</label>
                        <input type="tel" className="form-control" placeholder="(555) 555-5555" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-muted">Status</label>
                        <select className="form-select">
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
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
                <button type="button" className="btn btn-light" onClick={handleCloseModal}>Cancel</button>
                <button type="button" className="btn btn-dark">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvidersManagement;