import React, { useState } from 'react';

interface Location {
  id: number;
  name: string;
  assignedNumber: string;
  status: 'Active' | 'Inactive';
}

const PhoneSmsManagement: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([
    {
      id: 1,
      name: 'Downtown Optical Center',
      assignedNumber: '+1 (555) 123-4567',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Westside Vision Clinic',
      assignedNumber: '+1 (555) 234-5678',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Eastgate Eye Care',
      assignedNumber: 'No number assigned',
      status: 'Inactive'
    },
    {
      id: 4,
      name: 'Northpark Eyewear Gallery',
      assignedNumber: '+1 (555) 345-6789',
      status: 'Active'
    }
  ]);

  const [termsUrl, setTermsUrl] = useState('https://example.com/terms');
  const [privacyUrl, setPrivacyUrl] = useState('https://example.com/privacy');

  const handleEdit = (locationId: number) => {
    console.log('Edit location:', locationId);
    // Edit functionality would be implemented here
  };

  const handleAssignNumber = (locationId: number) => {
    console.log('Assign number to location:', locationId);
    // Assign number functionality would be implemented here
  };

  const handleSaveSettings = () => {
    console.log('Save compliance settings');
    // Save functionality would be implemented here
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h4 fw-semibold text-dark mb-1">Phone & SMS Management</h1>
        <p className="text-muted mb-0">Set up phone numbers and compliance URLs for your organization's locations.</p>
      </div>

      {/* Active Locations Section */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '0.75rem' }}>
        <div className="card-header bg-transparent border-0 pb-0">
          <h5 className="fw-semibold mb-1">Active Locations</h5>
          <p className="text-muted small mb-0">Manage phone numbers for each location in ClearView Eye Associates</p>
        </div>

        <div className="card-body">
          {/* Table Header */}
          <div className="row fw-semibold text-muted border-bottom pb-2 mb-3" style={{ fontSize: '0.875rem' }}>
            <div className="col-3">Location Name</div>
            <div className="col-3">Assigned Phone Number</div>
            <div className="col-2">Status</div>
            <div className="col-4 text-end">Actions</div>
          </div>

          {/* Table Rows */}
          {locations.map((location) => (
            <div key={location.id} className="row align-items-center py-3 border-bottom">
              <div className="col-3">
                <span className="fw-medium">{location.name}</span>
              </div>
              <div className="col-3">
                <span className={location.assignedNumber === 'No number assigned' ? 'text-muted fst-italic' : ''}>
                  {location.assignedNumber}
                </span>
              </div>
              <div className="col-2">
                <span 
                  className={`badge rounded-pill px-3 py-1 ${
                    location.status === 'Active' 
                      ? 'bg-dark text-white' 
                      : 'bg-secondary text-white'
                  }`}
                  style={{ fontSize: '0.75rem' }}
                >
                  {location.status}
                </span>
              </div>
              <div className="col-4 text-end">
                {location.assignedNumber === 'No number assigned' ? (
                  <button 
                    className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2"
                    onClick={() => handleAssignNumber(location.id)}
                  >
                    <span>➕</span>
                    Assign Number
                  </button>
                ) : (
                  <button 
                    className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2"
                    onClick={() => handleEdit(location.id)}
                  >
                    <span>✏️</span>
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Setup Section */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '0.75rem' }}>
        <div className="card-header bg-transparent border-0 pb-2">
          <div className="d-flex align-items-center gap-2">
            <h5 className="fw-semibold mb-0">Compliance Setup</h5>
            <span 
              className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-muted"
              style={{ width: '20px', height: '20px', fontSize: '12px' }}
              title="Information"
            >
              ℹ️
            </span>
          </div>
          <p className="text-muted small mb-0 mt-1">These URLs are required for SMS and non-robocall compliance.</p>
        </div>

        <div className="card-body">
          <div className="row g-4">
            {/* Terms and Conditions URL */}
            <div className="col-md-6">
              <label htmlFor="termsUrl" className="form-label fw-medium">
                Terms and Conditions URL <span className="text-danger">*</span>
              </label>
              <input
                type="url"
                className="form-control"
                id="termsUrl"
                value={termsUrl}
                onChange={(e) => setTermsUrl(e.target.value)}
                placeholder="https://example.com/terms"
                style={{ fontSize: '0.875rem' }}
              />
            </div>

            {/* Privacy Policy URL */}
            <div className="col-md-6">
              <label htmlFor="privacyUrl" className="form-label fw-medium">
                Privacy Policy URL <span className="text-danger">*</span>
              </label>
              <input
                type="url"
                className="form-control"
                id="privacyUrl"
                value={privacyUrl}
                onChange={(e) => setPrivacyUrl(e.target.value)}
                placeholder="https://example.com/privacy"
                style={{ fontSize: '0.875rem' }}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-4">
            <button 
              className="btn btn-dark px-4"
              onClick={handleSaveSettings}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneSmsManagement;