import React, { useState } from 'react';

interface Organization {
  id: number;
  name: string;
  type: string;
  taxId: string;
  address: string;
  status: 'Active' | 'Inactive';
}

const OrganizationBusinessSetup: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    taxId: '',
    npi: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    state: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await import('axios').then(ax => ax.default.post('/api/organization', form));
      setSuccess('Organization details saved successfully!');
    } catch (err) {
      setError('Failed to save organization details.');
    }
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h4 fw-semibold text-dark mb-1">VisionCare Optical Centers - Organization/Business Setup</h1>
        <p className="text-muted mb-0">Configure organization details and agent-specific settings</p>
      </div>

      {/* Business Information Section */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '0.75rem' }}>
        <div className="card-body">
          <div className="mb-4">
            <h5 className="fw-semibold mb-1">Business Information</h5>
            <p className="text-muted small mb-0">Basic organization and business details</p>
          </div>

          
            <form onSubmit={handleSave}>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label small text-muted">Business Name</label>
                  <input 
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter business name"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small text-muted">Website</label>
                  <input 
                    type="url"
                    name="website"
                    className="form-control"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small text-muted">Tax Id</label>
                  <input 
                    type="text"
                    name="taxId"
                    className="form-control"
                    value={form.taxId}
                    onChange={handleChange}
                    placeholder="XX-XXXXXXX"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Group NPI ID</label>
                  <input 
                    type="text"
                    name="npi"
                    className="form-control"
                    value={form.npi}
                    onChange={handleChange}
                    placeholder="Enter Group NPI ID"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Contact Person</label>
                  <input 
                    type="text"
                    name="contactPerson"
                    className="form-control"
                    value={form.contactPerson}
                    onChange={handleChange}
                    placeholder="Contact Person"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Contact Phone</label>
                  <input 
                    type="text"
                    name="contactPhone"
                    className="form-control"
                    value={form.contactPhone}
                    onChange={handleChange}
                    placeholder="Contact Phone"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Contact Email</label>
                  <input 
                    type="email"
                    name="contactEmail"
                    className="form-control"
                    value={form.contactEmail}
                    onChange={handleChange}
                    placeholder="Contact Email"
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label small text-muted">Address</label>
                  <input 
                    type="text"
                    name="address"
                    className="form-control"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Street address"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-dark">Save</button>
              {success && <div className="alert alert-success mt-3">{success}</div>}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
              <div className="col-md-4">
                <label className="form-label small text-muted">State</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter state"  value={form.state}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">Zip Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="XXXXX"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Phone</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="(XXX) XXX-XXXX"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Ext</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Extension"
                />
              </div>
              <div className="col-md-12">
                <label className="form-label small text-muted">Logo</label>
                <input 
                  type="file" 
                  className="form-control" 
                  accept="image/*"
                />
                <small className="text-muted">Upload your organization logo (PNG, JPG, or SVG)</small>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-light me-2">Cancel</button>
              <button type="button" className="btn btn-dark">Save Changes</button>
            </div>
         
      </div>

      {/* Agent-Specific Configuration Section */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '0.75rem' }}>
        <div className="card-body">
          <div className="mb-4">
            <h5 className="fw-semibold mb-1">Agent-Specific Configuration</h5>
            <p className="text-muted small mb-0">Configure module-specific settings for each AI agent</p>
          </div>

          <form>
            <div className="row g-3 mb-4">
              <div className="col-12">
                <label className="form-label small text-muted">Select Agent</label>
                <div className="form-control bg-light text-dark py-2 px-3" style={{ cursor: 'default' }}>
                  Billing Assistant
                </div>
              </div>
              <div className="col-12">
                <label className="form-label small text-muted">Eligibility ID</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter eligibility identifier"
                />
              </div>
              <div className="col-12">
                <label className="form-label small text-muted">Clearinghouse ID</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter clearinghouse identifier"
                />
              </div>
              <div className="col-12">
                <label className="form-label small text-muted">Billing NPI</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter billing NPI number"
                />
              </div>
              <div className="col-12">
                <label className="form-label small text-muted">Taxonomy Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter taxonomy code"
                />
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-light me-2">Reset</button>
              <button type="button" className="btn btn-dark">Save Configuration</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationBusinessSetup;