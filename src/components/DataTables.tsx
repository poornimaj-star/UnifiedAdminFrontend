import React, { useState } from 'react';

const DataTables: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState('patients');

  const tableOptions = [
    { id: 'patients', name: 'Patients', count: 1250 },
    { id: 'appointments', name: 'Appointments', count: 3450 },
    { id: 'treatments', name: 'Treatments', count: 890 },
    { id: 'billing', name: 'Billing Records', count: 2100 },
    { id: 'insurance', name: 'Insurance Claims', count: 567 }
  ];

  const patientData = [
    {
      id: 'P001',
      name: 'John Doe',
      phone: '(555) 123-4567',
      email: 'john.doe@email.com',
      lastVisit: '2024-10-25',
      status: 'Active'
    },
    {
      id: 'P002',
      name: 'Jane Smith',
      phone: '(555) 987-6543',
      email: 'jane.smith@email.com',
      lastVisit: '2024-10-28',
      status: 'Active'
    },
    {
      id: 'P003',
      name: 'Robert Johnson',
      phone: '(555) 456-7890',
      email: 'robert.j@email.com',
      lastVisit: '2024-10-20',
      status: 'Inactive'
    }
  ];

  const appointmentData = [
    {
      id: 'A001',
      patient: 'John Doe',
      doctor: 'Dr. Smith',
      type: 'Eye Exam',
      date: '2024-11-01',
      time: '10:00 AM',
      status: 'Scheduled'
    },
    {
      id: 'A002',
      patient: 'Jane Smith',
      doctor: 'Dr. Johnson',
      type: 'Follow-up',
      date: '2024-11-02',
      time: '2:30 PM',
      status: 'Confirmed'
    }
  ];

  const renderTableContent = () => {
    if (selectedTable === 'patients') {
      return (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patientData.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.email}</td>
                  <td>{patient.lastVisit}</td>
                  <td>
                    <span className={`badge ${patient.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                    <button className="btn btn-sm btn-outline-info me-1">View</button>
                    <button className="btn btn-sm btn-outline-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (selectedTable === 'appointments') {
      return (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Appointment ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointmentData.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.patient}</td>
                  <td>{appointment.doctor}</td>
                  <td>{appointment.type}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <span className={`badge ${appointment.status === 'Confirmed' ? 'bg-success' : 'bg-primary'}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                    <button className="btn btn-sm btn-outline-info me-1">View</button>
                    <button className="btn btn-sm btn-outline-danger">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="text-center py-5">
        <div className="h2 text-muted mb-3">📊</div>
        <h5 className="text-muted">No data available</h5>
        <p className="text-muted">Select a table from the left to view data.</p>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="h4 fw-semibold text-dark mb-4">Data Tables</h1>
          
          <div className="row">
            {/* Table Selection Sidebar */}
            <div className="col-md-3 mb-4">
              <div className="card">
                <div className="card-header">
                  <h6 className="card-title mb-0">Available Tables</h6>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {tableOptions.map((table) => (
                      <button
                        key={table.id}
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                          selectedTable === table.id ? 'active' : ''
                        }`}
                        onClick={() => setSelectedTable(table.id)}
                      >
                        <span>{table.name}</span>
                        <span className="badge bg-secondary">{table.count.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Export Options */}
              <div className="card mt-3">
                <div className="card-header">
                  <h6 className="card-title mb-0">Export Options</h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-success btn-sm">
                      📄 Export to Excel
                    </button>
                    <button className="btn btn-outline-info btn-sm">
                      📑 Export to CSV
                    </button>
                    <button className="btn btn-outline-danger btn-sm">
                      📋 Export to PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Data Table */}
            <div className="col-md-9">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    {tableOptions.find(t => t.id === selectedTable)?.name || 'Data Table'}
                  </h5>
                  <div>
                    <button className="btn btn-primary btn-sm me-2">
                      ➕ Add New
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      🔄 Refresh
                    </button>
                  </div>
                </div>
                
                {/* Search and Filter */}
                <div className="card-body border-bottom">
                  <div className="row">
                    <div className="col-md-6">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search records..." 
                      />
                    </div>
                    <div className="col-md-3">
                      <select className="form-select">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select className="form-select">
                        <option>Last 30 days</option>
                        <option>Last 7 days</option>
                        <option>This month</option>
                        <option>Custom range</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Table Content */}
                <div className="card-body p-0">
                  {renderTableContent()}
                </div>
                
                {/* Pagination */}
                <div className="card-footer">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                      Showing 1 to {selectedTable === 'patients' ? patientData.length : appointmentData.length} of {tableOptions.find(t => t.id === selectedTable)?.count || 0} entries
                    </span>
                    <nav>
                      <ul className="pagination pagination-sm mb-0">
                        <li className="page-item disabled">
                          <a className="page-link" href="#">Previous</a>
                        </li>
                        <li className="page-item active">
                          <a className="page-link" href="#">1</a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">2</a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">3</a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">Next</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTables;