import React, { useState } from 'react';

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

const LocationsManagement: React.FC = () => {
  const [locations] = useState<Location[]>([
    {
      id: 1,
      name: 'Downtown Optical Center',
      address: '123 Main St, City, ST 12345',
      phone: '(555) 123-4567',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Westside Vision Clinic',
      address: '456 Oak Ave, City, ST 12345',
      phone: '(555) 234-5678',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Eastgate Eye Care',
      address: '789 Elm Rd, City, ST 12345',
      phone: '(555) 345-6789',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Northpark Eyewear Gallery',
      address: '321 Pine Blvd, City, ST 12345',
      phone: '(555) 456-7890',
      status: 'Inactive'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = locations.filter(location => {
    return location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           location.address.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h4 fw-semibold text-dark mb-1">VisionCare Optical Centers - Locations Data</h1>
        <p className="text-muted mb-0">Manage location records and configure agent-specific settings</p>
      </div>

      {/* Location Records Section */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '0.75rem' }}>
        <div className="card-body">
          <div className="mb-4">
            <h5 className="fw-semibold mb-1">Location Records</h5>
            <p className="text-muted small mb-0">Manage locations and configure settings for each AI agent</p>
          </div>

          {/* Search Bar and Add Button */}
          <div className="row g-3 mb-4">
            <div className="col-md-10">
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">🔍</span>
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search by location name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <button className="btn btn-dark w-100">Add New Location</button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3">
            <span className="text-muted small">Showing {filteredLocations.length} of {locations.length} locations</span>
          </div>

          {/* Locations Table */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Location Name</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Address</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Phone</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Status</th>
                  <th className="fw-semibold text-muted text-end" style={{ fontSize: '0.875rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocations.map((location) => (
                  <tr key={location.id} className="border-bottom">
                    <td className="py-3">
                      <span className="fw-medium text-primary" style={{ cursor: 'pointer' }}>{location.name}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-muted">{location.address}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-dark">{location.phone}</span>
                    </td>
                    <td className="py-3">
                      <span className={`badge rounded-pill px-2 py-1 ${location.status === 'Active' ? 'bg-dark text-white' : 'bg-light text-muted border'}`} style={{ fontSize: '0.75rem' }}>
                        {location.status}
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
          {filteredLocations.length === 0 && (
            <div className="text-center py-5">
              <div className="text-muted">
                <h6>No locations found</h6>
                <p className="small mb-0">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationsManagement;
