import React, { useState } from 'react';

interface Insurance {
  id: number;
  name: string;
  payerId: string;
  location: string;
  eligibilityMapping: 'Mapped' | 'Unmapped';
}

const InsuranceManagement: React.FC = () => {
  const [insurances, setInsurances] = useState<Insurance[]>([
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
    
    return matchesSearch && matchesLocation;
  });

  const handleEditConfiguration = (insuranceId: number) => {
    console.log('Edit configuration for insurance:', insuranceId);
    // Edit configuration functionality would be implemented here
  };

  const handleAddNewInsurance = () => {
    console.log('Add new insurance');
    // Add new insurance functionality would be implemented here
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h4 fw-semibold text-dark mb-1">VisionCare Optical Centers - Insurances Data</h1>
        <p className="text-muted mb-0">Manage insurance records and configure agent-specific settings</p>
      </div>

      {/* Insurance Records Section */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '0.75rem' }}>
        <div className="card-body">
          <div className="mb-4">
            <h5 className="fw-semibold mb-1">Insurance Records</h5>
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
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Insurance Name</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Payer ID</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Location</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Eligibility Mapping</th>
                  <th className="fw-semibold text-muted text-end" style={{ fontSize: '0.875rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInsurances.map((insurance) => (
                  <tr key={insurance.id} className="border-bottom">
                    <td className="py-3">
                      <span className="fw-medium text-primary" style={{ cursor: 'pointer' }}>
                        {insurance.name}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-dark">{insurance.payerId}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-muted">{insurance.location}</span>
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
                        className="btn btn-link text-decoration-none p-0"
                        onClick={() => handleEditConfiguration(insurance.id)}
                        style={{ color: '#6c757d', fontSize: '0.875rem' }}
                      >
                        Edit Configuration
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          {filteredInsurances.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default InsuranceManagement;