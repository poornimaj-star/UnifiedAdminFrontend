import React from 'react';

const Overview: React.FC = () => {
  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h4 fw-semibold text-dark mb-1">ClearView Eye Associates - Admin Overview</h1>
        <p className="text-muted mb-0">Monitor setup status and configuration for all AI agents</p>
      </div>

      {/* Alert Banner */}
      <div className="alert alert-warning d-flex align-items-start gap-3 mb-4" style={{ backgroundColor: '#fff3cd', borderColor: '#ffeaa7', color: '#856404' }}>
        <div className="fs-5 mt-1">⚠️</div>
        <div className="flex-grow-1">
          <h6 className="fw-semibold mb-1" style={{ color: '#856404' }}>Missing Scheduled Jobs • Billing Assistant</h6>
          <p className="mb-0 small" style={{ lineHeight: '1.4' }}>
            The following modules have active subscriptions but are missing scheduled jobs: Unused Benefits. Please configure scheduled jobs in the Billing Assistant Setup.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="row g-4">
        {/* Billing Assistant Card */}
        <div className="col-lg-6">
          <div className="card h-100 border shadow-sm" style={{ borderRadius: '0.5rem', minHeight: '400px' }}>
            <div className="card-header bg-transparent border-0 d-flex align-items-center gap-2 p-3">
              <div className="fs-4">🤖</div>
              <h5 className="card-title flex-grow-1 mb-0 fw-semibold">Billing Assistant</h5>
              <button className="btn btn-light btn-sm" style={{ width: '32px', height: '32px', padding: '0' }}>⚙️</button>
            </div>
            
            <div className="card-body pt-0">
              <p className="text-muted small mb-3">Insurance and eligibility configuration</p>
              
              {/* Missing Jobs Alert */}
              <div className="alert alert-danger alert-sm d-flex align-items-start gap-2 mb-3 py-2 px-3" style={{ backgroundColor: '#fff5f5', borderColor: '#fecaca', color: '#dc2626' }}>
                <div className="small">⚠️</div>
                <div>
                  <div className="fw-semibold small">Missing Scheduled Jobs</div>
                  <div style={{ fontSize: '0.75rem' }}>1 module(s) need configuration</div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="border-bottom pb-3 mb-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small">Eligibility Mapping</span>
                  <span className="small fw-semibold">75%</span>
                </div>
                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div className="progress-bar bg-dark" style={{ width: '75%' }}></div>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>8 of 10 insurances mapped</p>
              </div>

              {/* Config Items */}
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <span className="small">Unused Benefits Tracking</span>
                <button className="btn btn-sm btn-link text-muted p-0">→</button>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <span className="small">Insurance Sync</span>
                <span className="badge bg-dark text-white rounded-pill px-2">⚫ Enabled</span>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3">
                <span className="small">Eligibility Sync</span>
                <span className="badge bg-secondary text-white rounded-pill px-2">⚫ Disabled</span>
              </div>
            </div>

            <div className="card-footer bg-transparent border-top text-center">
              <button className="btn btn-link text-dark p-0 text-decoration-none small">
                Configure Billing Assistant →
              </button>
            </div>
          </div>
        </div>

        {/* Virtual Assistant Card */}
        <div className="col-lg-6">
          <div className="card h-100 border shadow-sm" style={{ borderRadius: '0.5rem', minHeight: '400px' }}>
            <div className="card-header bg-transparent border-0 d-flex align-items-center gap-2 p-3">
              <div className="fs-4">🎧</div>
              <h5 className="card-title flex-grow-1 mb-0 fw-semibold">Virtual Assistant</h5>
              <button className="btn btn-light btn-sm" style={{ width: '32px', height: '32px', padding: '0' }}>⚙️</button>
            </div>
            
            <div className="card-body pt-0">
              <p className="text-muted small mb-4">Call handling and automation setup</p>
              
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <span className="small">Appointments</span>
                <span className="badge bg-dark text-white rounded-pill px-2">⚫ Enabled</span>
              </div>
              
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <span className="small">Insurance Update</span>
                <span className="badge bg-dark text-white rounded-pill px-2">⚫ Enabled</span>
              </div>
              
              <div className="d-flex justify-content-between align-items-center py-3">
                <span className="small">Voicemail Setup</span>
                <span className="badge bg-secondary text-white rounded-pill px-2">⚫ Not Configured</span>
              </div>
            </div>

            <div className="card-footer bg-transparent border-top text-center">
              <button className="btn btn-link text-dark p-0 text-decoration-none small">
                Configure Virtual Assistant →
              </button>
            </div>
          </div>
        </div>

        {/* Scribe Card */}
        <div className="col-lg-6">
          <div className="card h-100 border shadow-sm" style={{ borderRadius: '0.5rem', minHeight: '400px' }}>
            <div className="card-header bg-transparent border-0 d-flex align-items-center gap-2 p-3">
              <div className="fs-4">📝</div>
              <h5 className="card-title flex-grow-1 mb-0 fw-semibold">Scribe</h5>
              <button className="btn btn-light btn-sm" style={{ width: '32px', height: '32px', padding: '0' }}>⚙️</button>
            </div>
            
            <div className="card-body pt-0 d-flex align-items-center justify-content-center">
              <p className="text-muted text-center fst-italic">Documentation and template configuration</p>
            </div>
          </div>
        </div>

        {/* Patient Portal Card */}
        <div className="col-lg-6">
          <div className="card h-100 border shadow-sm" style={{ borderRadius: '0.5rem', minHeight: '400px' }}>
            <div className="card-header bg-transparent border-0 d-flex align-items-center gap-2 p-3">
              <div className="fs-4">👥</div>
              <h5 className="card-title flex-grow-1 mb-0 fw-semibold">Patient Portal</h5>
              <button className="btn btn-light btn-sm" style={{ width: '32px', height: '32px', padding: '0' }}>⚙️</button>
            </div>
            
            <div className="card-body pt-0 d-flex align-items-center justify-content-center">
              <p className="text-muted text-center fst-italic">Patient access and authentication</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;