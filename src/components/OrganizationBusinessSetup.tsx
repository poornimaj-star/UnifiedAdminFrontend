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
  const [organization] = useState<Organization>({
    id: 1,
    name: 'VisionCare Optical Centers',
    type: 'Healthcare Provider',
    taxId: '12-3456789',
    address: '123 Vision Way, Optometry City, OC 12345',
    status: 'Active'
  });

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

          <form>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label small text-muted">Business Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  defaultValue={organization.name} 
                  placeholder="Enter business name"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">Country</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="United States of America"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">Website</label>
                <input 
                  type="url" 
                  className="form-control" 
                  placeholder="https://example.com"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Group NPI ID</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter Group NPI ID"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Individual NPI</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter Individual NPI"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Individual NPIS</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter Individual NPIS"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Tax Id</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="XX-XXXXXXX"
                />
              </div>
              <div className="col-md-12">
                <label className="form-label small text-muted">Address Line 1</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Street address"
                />
              </div>
              <div className="col-md-12">
                <label className="form-label small text-muted">Address Line 2</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Apartment, suite, unit, etc. (optional)"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">City</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="City"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">State</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter state"
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
          </form>
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