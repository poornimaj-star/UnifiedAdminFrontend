import React, { useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  lastLogin: string;
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: 'john.doe',
      email: 'john.doe@clearvieweye.com',
      roles: ['Admin', 'Billing Manager'],
      permissions: ['Read', 'Write', 'Delete', 'Manage Users'],
      lastLogin: '2025-10-29 09:15 AM',
      status: 'Active',
      createdAt: '2025-01-15'
    },
    {
      id: 2,
      username: 'sarah.wilson',
      email: 'sarah.wilson@clearvieweye.com',
      roles: ['Doctor', 'Scribe User'],
      permissions: ['Read', 'Write', 'Patient Records'],
      lastLogin: '2025-10-28 02:30 PM',
      status: 'Active',
      createdAt: '2025-02-20'
    },
    {
      id: 3,
      username: 'mike.johnson',
      email: 'mike.johnson@clearvieweye.com',
      roles: ['Receptionist'],
      permissions: ['Read', 'Appointments'],
      lastLogin: '2025-10-25 11:45 AM',
      status: 'Active',
      createdAt: '2025-03-10'
    },
    {
      id: 4,
      username: 'emily.brown',
      email: 'emily.brown@clearvieweye.com',
      roles: ['Billing Staff'],
      permissions: ['Read', 'Billing', 'Insurance'],
      lastLogin: 'Never',
      status: 'Pending',
      createdAt: '2025-10-28'
    },
    {
      id: 5,
      username: 'david.clark',
      email: 'david.clark@clearvieweye.com',
      roles: ['IT Support'],
      permissions: ['Read', 'System Settings'],
      lastLogin: '2025-09-15 03:20 PM',
      status: 'Inactive',
      createdAt: '2024-12-05'
    },
    {
      id: 6,
      username: 'lisa.garcia',
      email: 'lisa.garcia@clearvieweye.com',
      roles: ['Nurse', 'Assistant'],
      permissions: ['Read', 'Write', 'Patient Care'],
      lastLogin: '2025-10-29 08:00 AM',
      status: 'Active',
      createdAt: '2025-01-30'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleView = (userId: number) => {
    console.log('View user:', userId);
    // View functionality would be implemented here
  };

  const handleEdit = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser({ ...user });
      setShowEditModal(true);
    }
  };

  const handleDelete = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserToDelete(user);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setUserToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const saveUserChanges = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...editingUser } : user
      ));
      setEditingUser(null);
      setShowEditModal(false);
    }
  };

  const handleEditFieldChange = (field: keyof User, value: any) => {
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        [field]: value
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Active': 'bg-success text-white',
      'Inactive': 'bg-secondary text-white',
      'Pending': 'bg-warning text-dark'
    };
    
    return `badge rounded-pill px-2 py-1 ${statusClasses[status as keyof typeof statusClasses]}`;
  };

  const getAllRoles = () => {
    const roles = new Set<string>();
    users.forEach(user => user.roles.forEach(role => roles.add(role)));
    return Array.from(roles);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === '' || user.roles.includes(filterRole);
    const matchesStatus = filterStatus === '' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h4 fw-semibold text-dark mb-1">Users Management</h1>
            <p className="text-muted mb-0">Manage user accounts, roles, and permissions for your organization</p>
          </div>
          <button className="btn btn-primary">
            + Add New User
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 bg-info bg-opacity-10 h-100">
            <div className="card-body text-center">
              <h3 className="h5 mb-1 text-info">{users.filter(u => u.status === 'Active').length}</h3>
              <p className="small mb-0 text-muted">Active Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-warning bg-opacity-10 h-100">
            <div className="card-body text-center">
              <h3 className="h5 mb-1 text-warning">{users.filter(u => u.status === 'Pending').length}</h3>
              <p className="small mb-0 text-muted">Pending Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-secondary bg-opacity-10 h-100">
            <div className="card-body text-center">
              <h3 className="h5 mb-1 text-secondary">{users.filter(u => u.status === 'Inactive').length}</h3>
              <p className="small mb-0 text-muted">Inactive Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-info bg-opacity-10 h-100">
            <div className="card-body text-center">
              <h3 className="h5 mb-1 text-info">{users.length}</h3>
              <p className="small mb-0 text-muted">Total Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '0.75rem' }}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="search" className="form-label fw-medium">Search Users</label>
              <input
                type="text"
                className="form-control"
                id="search"
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="roleFilter" className="form-label fw-medium">Filter by Role</label>
              <select
                className="form-select"
                id="roleFilter"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                {getAllRoles().map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="statusFilter" className="form-label fw-medium">Filter by Status</label>
              <select
                className="form-select"
                id="statusFilter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setFilterRole('');
                  setFilterStatus('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '0.75rem' }}>
        <div className="card-header bg-transparent border-0 pb-0">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-semibold mb-1">Users ({filteredUsers.length})</h5>
              <p className="text-muted small mb-0">Showing {filteredUsers.length} of {users.length} users</p>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr className="border-bottom">
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Username</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Roles</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Permissions</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Status</th>
                  <th className="fw-semibold text-muted" style={{ fontSize: '0.875rem' }}>Last Login</th>
                  <th className="fw-semibold text-muted text-end" style={{ fontSize: '0.875rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-bottom">
                    <td className="py-3">
                      <div>
                        <div className="fw-medium">{user.username}</div>
                        <div className="text-muted small">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex flex-wrap gap-1">
                        {user.roles.map((role, index) => (
                          <span 
                            key={index} 
                            className="badge bg-light text-dark border"
                            style={{ fontSize: '0.75rem' }}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex flex-wrap gap-1">
                        {user.permissions.slice(0, 2).map((permission, index) => (
                          <span 
                            key={index} 
                            className="badge bg-info bg-opacity-10 text-info border-0"
                            style={{ fontSize: '0.75rem' }}
                          >
                            {permission}
                          </span>
                        ))}
                        {user.permissions.length > 2 && (
                          <span 
                            className="badge bg-secondary text-white"
                            style={{ fontSize: '0.75rem' }}
                            title={user.permissions.slice(2).join(', ')}
                          >
                            +{user.permissions.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={getStatusBadge(user.status)} style={{ fontSize: '0.75rem' }}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-muted small">{user.lastLogin}</span>
                    </td>
                    <td className="py-3 text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button 
                          className="btn btn-outline-info btn-sm d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          onClick={() => handleView(user.id)}
                          title="View User"
                        >
                          👁️
                        </button>
                        <button 
                          className="btn btn-outline-info btn-sm d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          onClick={() => handleEdit(user.id)}
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          onClick={() => handleDelete(user.id)}
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-5">
              <div className="text-muted">
                <h6>No users found</h6>
                <p className="small mb-0">Try adjusting your search criteria or filters</p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <div className="text-muted small">
                Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries
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

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {editingUser && (
                  <form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUser.username}
                          onChange={(e) => handleEditFieldChange('username', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={editingUser.email}
                          onChange={(e) => handleEditFieldChange('email', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          value={editingUser.status}
                          onChange={(e) => handleEditFieldChange('status', e.target.value as 'Active' | 'Inactive' | 'Pending')}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Roles</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUser.roles.join(', ')}
                          onChange={(e) => handleEditFieldChange('roles', e.target.value.split(', ').filter(r => r.trim()))}
                          placeholder="Separate roles with commas"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Permissions</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUser.permissions.join(', ')}
                          onChange={(e) => handleEditFieldChange('permissions', e.target.value.split(', ').filter(p => p.trim()))}
                          placeholder="Separate permissions with commas"
                        />
                      </div>
                    </div>
                  </form>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-info"
                  onClick={saveUserChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {userToDelete && (
                  <p>
                    Are you sure you want to delete user <strong>{userToDelete.username}</strong>? 
                    This action cannot be undone.
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;