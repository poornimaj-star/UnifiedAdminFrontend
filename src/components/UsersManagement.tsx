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
  phone?: string;
  locations?: string[];
  defaultBusiness?: string;
  defaultProduct?: string;
  productAccess?: string[];
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localUserIds, setLocalUserIds] = useState<number[]>([]);

  // Function to sync stored backend user changes to the API
  const syncBackendChanges = async () => {
    const backendUserChanges = JSON.parse(localStorage.getItem('backendUserChanges') || '{}');
    const changeIds = Object.keys(backendUserChanges);

    if (changeIds.length === 0) return;

    console.log(`🔄 Syncing ${changeIds.length} stored backend user changes...`);

    for (const userId of changeIds) {
      try {
        const updatedUser = backendUserChanges[userId];
        const axios = await import('axios');

        // Split the username back to first and last name
        const nameParts = updatedUser.username.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Convert status back to database boolean fields
        const isActive = updatedUser.status === 'Active';
        const isBlocked = updatedUser.status === 'Inactive';

        // Convert roles back to boolean flags
        const isProvider = updatedUser.roles.includes('Provider');
        const isTechnician = updatedUser.roles.includes('Technician');
        const isReferringPhysician = updatedUser.roles.includes('Referring Physician');

        await axios.default.put(`/api/users/${userId}`, {
          FIRST_NAME: firstName,
          LAST_NAME: lastName,
          EMAIL: updatedUser.email,
          IS_ACTIVE: isActive ? 1 : 0,
          IS_BLOCKED: isBlocked ? 1 : 0,
          IS_PROVIDER: isProvider ? 1 : 0,
          IS_TECHNICIAN: isTechnician ? 1 : 0,
          IS_REFERRING_PHYSICIAN: isReferringPhysician ? 1 : 0,
          PHONE: updatedUser.phone,
          PERMISSIONS: updatedUser.permissions.join(','),
          UPDATE_DATE: new Date().toISOString(),
          USER_INITITALS: `${firstName.charAt(0)} ${lastName.charAt(0)}`.trim()
        });

        // Remove successfully synced change
        delete backendUserChanges[userId];
        console.log(`✅ Synced changes for user ${userId}`);
      } catch (error) {
        console.warn(`⚠️ Failed to sync changes for user ${userId}:`, error);
      }
    }

    // Update localStorage with remaining unsynced changes
    localStorage.setItem('backendUserChanges', JSON.stringify(backendUserChanges));

    if (Object.keys(backendUserChanges).length === 0) {
      console.log('🎉 All backend user changes synced successfully!');
    }
  };

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get locally created users from localStorage
        const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');

        // Get stored local user IDs to track which users were created locally
        const storedLocalUserIds = JSON.parse(localStorage.getItem('localUserIds') || '[]');

        // Ensure all existing local users are tracked in localUserIds
        localUsers.forEach((user: any) => {
          if (user.id && !storedLocalUserIds.includes(user.id)) {
            console.log('📝 Adding existing local user ID to tracking:', user.id, user.username);
            storedLocalUserIds.push(user.id);
          }
        });

        setLocalUserIds(storedLocalUserIds);

        // Validate local users have IDs
        localUsers.forEach((user: any) => {
          if (!user.id) {
            console.warn('⚠️ Local user missing ID:', user);
            // Generate a sequential ID for local users without one
            const nextId = Math.max(...storedLocalUserIds, ...localUsers.map((u: any) => u.id || 0), 0) + 1;
            user.id = nextId;
            storedLocalUserIds.push(nextId);
          }
        });

        // Note: Migration will happen after we load database users to know the highest existing ID

        // Update the state with any new IDs
        setLocalUserIds(storedLocalUserIds);
        localStorage.setItem('localUserIds', JSON.stringify(storedLocalUserIds));

        // Try to fetch users from backend
        try {
          const response = await import('axios').then(ax => ax.default.get('/api/users'));
          const dbUsers = response.data.map((user: any, index: number) => {
            console.log('🗄️ Processing DB user:', user);

            // Use the correct field name from the database
            const userId = user.USER_ID || user.ID || user.id || (Date.now() + index);

            if (!user.USER_ID && !user.ID && !user.id) {
              console.warn('⚠️ DB user missing ID, generating fallback:', userId, user);
            }

            // Handle Buffer fields for boolean values
            const parseBufferBoolean = (buffer: any) => {
              if (!buffer) return false;
              if (buffer.type === 'Buffer' && buffer.data) {
                return buffer.data[0] === 1;
              }
              return !!buffer;
            };

            // Create username from first and last name
            const username = `${user.FIRST_NAME || ''} ${user.LAST_NAME || ''}`.trim() ||
              user.USERNAME || user.username || user.USER_INITITALS || '';

            // Determine status based on IS_ACTIVE and IS_BLOCKED
            let status: 'Active' | 'Inactive' | 'Pending' = 'Pending';
            if (parseBufferBoolean(user.IS_ACTIVE)) {
              status = parseBufferBoolean(user.IS_BLOCKED) ? 'Inactive' : 'Active';
            }

            // Determine roles based on boolean flags
            const roles: string[] = [];
            if (parseBufferBoolean(user.IS_PROVIDER)) roles.push('Provider');
            if (parseBufferBoolean(user.IS_TECHNICIAN)) roles.push('Technician');
            if (parseBufferBoolean(user.IS_REFERRING_PHYSICIAN)) roles.push('Referring Physician');
            if (roles.length === 0) roles.push('User'); // Default role

            return {
              id: userId,
              username: username,
              email: user.EMAIL || user.email || '',
              roles: roles,
              permissions: user.PERMISSIONS ? user.PERMISSIONS.split(',') : [],
              lastLogin: user.LAST_LOGIN || user.lastLogin || 'Never',
              status: status,
              createdAt: user.CREATE_DATE || user.createdAt || '',
              phone: user.PHONE || user.phone || '',
              locations: user.LOCATIONS ? user.LOCATIONS.split(',') : [],
              defaultBusiness: user.DEFAULT_BUSINESS || user.defaultBusiness || '',
              defaultProduct: user.DEFAULT_PRODUCT || user.defaultProduct || '',
              productAccess: user.PRODUCT_ACCESS ? user.PRODUCT_ACCESS.split(',') : []
            };
          });

          // Apply any stored backend user changes
          const backendUserChanges = JSON.parse(localStorage.getItem('backendUserChanges') || '{}');
          const updatedDbUsers = dbUsers.map((user: User) => {
            if (backendUserChanges[user.id]) {
              console.log('🔄 Applying stored changes to backend user:', user.id);
              return { ...user, ...backendUserChanges[user.id] } as User;
            }
            return user;
          });

          // Combine backend users (with applied changes) and local users
          console.log('🗄️ DB Users (with changes):', updatedDbUsers);
          console.log('💾 Local Users:', localUsers);

          const combinedUsers = [...updatedDbUsers, ...localUsers];
          console.log('🔄 Combined Users:', combinedUsers);
          console.log('📧 All emails in order:', combinedUsers.map((u, i) => `${i}: ${u.email}`));
          console.log('🆔 All IDs in order:', combinedUsers.map((u, i) => `${i}: ${u.id}`));

          // Migrate local users with problematic IDs to proper sequential IDs
          let needsMigration = false;
          const allExistingIds = combinedUsers.map(u => u.id);
          const maxExistingId = Math.max(...allExistingIds, 0);
          let nextAvailableId = maxExistingId;

          console.log('🔍 Migration check - Max existing ID:', maxExistingId);

          localUsers.forEach((user: any) => {
            let shouldMigrate = false;
            const oldId = user.id;

            // Check if this local user needs migration
            if (user.id && user.id > 1000000000000) {
              // Timestamp ID
              shouldMigrate = true;
              console.log('🔄 Found timestamp ID to migrate:', user.id);
            } else if (user.id && user.id < maxExistingId && updatedDbUsers.some((dbUser: any) => dbUser.id === user.id)) {
              // Local user ID conflicts with a database user
              shouldMigrate = true;
              console.log('🔄 Found conflicting local user ID to migrate:', user.id);
            }

            if (shouldMigrate) {
              needsMigration = true;
              nextAvailableId++;
              user.id = nextAvailableId;

              // Update the user in combinedUsers array as well
              const userIndex = combinedUsers.findIndex(u => u === user);
              if (userIndex > -1) {
                combinedUsers[userIndex].id = nextAvailableId;
              }

              // Update tracking arrays
              const oldIdIndex = storedLocalUserIds.indexOf(oldId);
              if (oldIdIndex > -1) {
                storedLocalUserIds[oldIdIndex] = nextAvailableId;
              } else {
                storedLocalUserIds.push(nextAvailableId);
              }

              console.log('✅ Migrated user:', user.username || user.email, 'from ID', oldId, 'to ID', nextAvailableId);
            }
          });

          if (needsMigration) {
            console.log('✅ Completed user ID migration, saving to localStorage');
            localStorage.setItem('localUsers', JSON.stringify(localUsers));
            setLocalUserIds(storedLocalUserIds);
            localStorage.setItem('localUserIds', JSON.stringify(storedLocalUserIds));
          }

          // Check for duplicate IDs and warn if found
          const idCounts = combinedUsers.reduce((acc: any, user: any) => {
            acc[user.id] = (acc[user.id] || 0) + 1;
            return acc;
          }, {});

          const duplicateIds = Object.keys(idCounts).filter(id => idCounts[id] > 1);
          if (duplicateIds.length > 0) {
            console.warn('⚠️ Duplicate user IDs found:', duplicateIds);
            duplicateIds.forEach(id => {
              const duplicateUsers = combinedUsers.filter(u => u.id == id);
              console.warn(`ID ${id} appears ${idCounts[id]} times:`, duplicateUsers.map(u => u.email));
            });
          }

          // Check for users with undefined IDs and filter them out
          const validUsers = combinedUsers.filter(u => {
            const hasValidId = u.id !== undefined && u.id !== null && u.id !== '';
            if (!hasValidId) {
              console.error('❌ Filtering out user without valid ID:', u);
            }
            return hasValidId;
          });

          if (validUsers.length !== combinedUsers.length) {
            console.warn(`⚠️ Filtered out ${combinedUsers.length - validUsers.length} users with invalid IDs`);
          }

          // Ensure all users have productAccess property for compatibility
          const migratedUsers = validUsers.map(user => {
            if (!user.productAccess) {
              console.log('🔄 Migrating user to add productAccess property:', user.username);
              return { ...user, productAccess: [] };
            }
            return user;
          });

          console.log('✅ Final migrated users:', migratedUsers);
          setUsers(migratedUsers);

          // Try to sync any pending backend changes since backend is available
          syncBackendChanges();
        } catch (apiErr) {
          // If backend fails, just use local users
          console.log('Backend not available, using local users only');

          // Validate local users have proper IDs
          const validLocalUsers = localUsers.filter((user: any) => {
            const hasValidId = user.id !== undefined && user.id !== null && user.id !== '';
            if (!hasValidId) {
              console.error('❌ Local user without valid ID:', user);
            }
            return hasValidId;
          });

          // Ensure all local users have productAccess property for compatibility
          const migratedLocalUsers = validLocalUsers.map((user: any) => {
            if (!user.productAccess) {
              console.log('🔄 Migrating local user to add productAccess property:', user.username);
              return { ...user, productAccess: [] };
            }
            return user;
          });

          setUsers(migratedLocalUsers);
        }
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showInactiveUsers, setShowInactiveUsers] = useState(false);

  // Tab toggle state
  const [activeTab, setActiveTab] = useState<'users' | 'userGroups'>('users');

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Add User Modal fields
  const [addUserFields, setAddUserFields] = useState({
    fullName: '',
    role: 'User',
    email: '',
    phoneNumber: '',
    status: 'Active',
    locations: [] as string[],
    defaultBusiness: '',
    defaultProduct: '',
    productAccess: {
      virtualAssistant: false,
      scribe: false,
      billingAssistant: false,
      patientPortal: false,
      patientEngagement: false
    },
    permissions: {
      adminOverview: false,
      orgBusinessView: false,
      locationsView: false,
      providersView: false,
      insurancesView: false,
      usersView: false,
      licenseBillingView: false,
      phoneSmsView: false,
      patientPaymentSetupView: false,
      pmsEhrView: false
    }
  });

  // Edit User Modal fields
  const [editUserFields, setEditUserFields] = useState({
    fullName: '',
    role: 'User',
    email: '',
    phoneNumber: '',
    status: 'Active',
    locations: [] as string[],
    defaultBusiness: '',
    defaultProduct: '',
    productAccess: {
      virtualAssistant: false,
      scribe: false,
      billingAssistant: false,
      patientPortal: false,
      patientEngagement: false
    },
    permissions: {
      adminOverview: false,
      orgBusinessView: false,
      locationsView: false,
      providersView: false,
      insurancesView: false,
      usersView: false,
      licenseBillingView: false,
      phoneSmsView: false,
      patientPaymentSetupView: false,
      pmsEhrView: false
    }
  });

  const handleView = (userId: number) => {
    console.log('View user:', userId);
    // View functionality would be implemented here
  };

  const handleEdit = (userId: number) => {
    debugger;
    console.log('🔍 EDIT CLICKED for user ID:', userId);

    const user = users.find(u => u.id === userId);
    console.log('Found user object:', user);
    console.log('User email specifically:', user?.email);
    console.log('All user emails:', users.map(u => ({ id: u.id, email: u.email })));

    if (user) {
      // First, clear any existing form data to prevent stale state
      setEditUserFields({
        fullName: '',
        role: 'User',
        email: '',
        phoneNumber: '',
        status: 'Active',
        locations: [],
        defaultBusiness: '',
        defaultProduct: '',
        productAccess: {
          virtualAssistant: false,
          scribe: false,
          billingAssistant: false,
          patientPortal: false,
          patientEngagement: false,
        },
        permissions: {
          adminOverview: false,
          orgBusinessView: false,
          locationsView: false,
          providersView: false,
          insurancesView: false,
          usersView: false,
          licenseBillingView: false,
          phoneSmsView: false,
          patientPaymentSetupView: false,
          pmsEhrView: false,
        }
      });

      setEditingUser({ ...user });

      // Use setTimeout to ensure state is cleared before setting new data
      setTimeout(() => {
        const formData = {
          fullName: user.username || '',
          role: (user.roles && user.roles.length > 0) ? user.roles[0] : 'User',
          email: user.email || '',
          phoneNumber: user.phone || '',
          status: user.status || 'Active',
          locations: user.locations ? [...user.locations] : [],
          defaultBusiness: user.defaultBusiness || '',
          defaultProduct: user.defaultProduct || '',
          productAccess: {
            virtualAssistant: user.productAccess ? user.productAccess.includes('Virtual assistant') : false,
            scribe: user.productAccess ? user.productAccess.includes('Scribe') : false,
            billingAssistant: user.productAccess ? user.productAccess.includes('Billing assistant') : false,
            patientPortal: user.productAccess ? user.productAccess.includes('Patient portal') : false,
            patientEngagement: user.productAccess ? user.productAccess.includes('Patient engagement') : false
          },
          permissions: {
            adminOverview: user.permissions ? user.permissions.includes('admin overview') : false,
            orgBusinessView: user.permissions ? user.permissions.includes('org business view') : false,
            locationsView: user.permissions ? user.permissions.includes('locations view') : false,
            providersView: user.permissions ? user.permissions.includes('providers view') : false,
            insurancesView: user.permissions ? user.permissions.includes('insurances view') : false,
            usersView: user.permissions ? user.permissions.includes('users view') : false,
            licenseBillingView: user.permissions ? user.permissions.includes('license billing view') : false,
            phoneSmsView: user.permissions ? user.permissions.includes('phone sms view') : false,
            patientPaymentSetupView: user.permissions ? user.permissions.includes('patient payment setup view') : false,
            pmsEhrView: user.permissions ? user.permissions.includes('pms ehr view') : false
          }
        };

        console.log('📝 Setting form data for user:', user.username);
        console.log('Form email specifically:', formData.email);
        console.log('User phone number:', user.phone);
        console.log('Form phoneNumber field:', formData.phoneNumber);
        console.log('User productAccess array:', user.productAccess);
        console.log('Checking mappings:');
        console.log('  virtualAssistant:', user.productAccess ? user.productAccess.includes('Virtual assistant') : false);
        console.log('  scribe:', user.productAccess ? user.productAccess.includes('Scribe') : false);
        console.log('  billingAssistant:', user.productAccess ? user.productAccess.includes('Billing assistant') : false);
        console.log('  patientPortal:', user.productAccess ? user.productAccess.includes('Patient portal') : false);
        console.log('  patientEngagement:', user.productAccess ? user.productAccess.includes('Patient engagement') : false);
        console.log('Mapped productAccess form data:', formData.productAccess);
        console.log('Full form data:', formData);

        setEditUserFields(formData);
        setShowEditModal(true);
      }, 10);
    }
  };

  const handleDelete = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserToDelete(user);
      setShowDeleteModal(true);
    }
  };

  const handleAddUserFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('productAccess.')) {
        const field = name.split('.')[1];
        setAddUserFields(prev => ({
          ...prev,
          productAccess: { ...prev.productAccess, [field]: checkbox.checked }
        }));
      } else if (name.startsWith('permissions.')) {
        const field = name.split('.')[1];
        setAddUserFields(prev => ({
          ...prev,
          permissions: { ...prev.permissions, [field]: checkbox.checked }
        }));
      }
    } else {
      setAddUserFields(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    setAddUserFields(prev => ({
      ...prev,
      locations: checked
        ? [...prev.locations, location]
        : prev.locations.filter(loc => loc !== location)
    }));
  };

  const handleEditUserFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('productAccess.')) {
        const field = name.split('.')[1];
        setEditUserFields(prev => ({
          ...prev,
          productAccess: { ...prev.productAccess, [field]: checkbox.checked }
        }));
      } else if (name.startsWith('permissions.')) {
        const field = name.split('.')[1];
        setEditUserFields(prev => ({
          ...prev,
          permissions: { ...prev.permissions, [field]: checkbox.checked }
        }));
      }
    } else {
      setEditUserFields(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditLocationChange = (location: string, checked: boolean) => {
    setEditUserFields(prev => ({
      ...prev,
      locations: checked
        ? [...prev.locations, location]
        : prev.locations.filter(loc => loc !== location)
    }));
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditUserFields({
      fullName: '',
      role: 'User',
      email: '',
      phoneNumber: '',
      status: 'Active',
      locations: [],
      defaultBusiness: '',
      defaultProduct: '',
      productAccess: {
        virtualAssistant: false,
        scribe: false,
        billingAssistant: false,
        patientPortal: false,
        patientEngagement: false,
      },
      permissions: {
        adminOverview: false,
        orgBusinessView: false,
        locationsView: false,
        providersView: false,
        insurancesView: false,
        usersView: false,
        licenseBillingView: false,
        phoneSmsView: false,
        patientPaymentSetupView: false,
        pmsEhrView: false,
      }
    });
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    // Reset form
    setAddUserFields({
      fullName: '',
      role: 'User',
      email: '',
      phoneNumber: '',
      status: 'Active',
      locations: [],
      defaultBusiness: '',
      defaultProduct: '',
      productAccess: {
        virtualAssistant: false,
        scribe: false,
        billingAssistant: false,
        patientPortal: false,
        patientEngagement: false
      },
      permissions: {
        adminOverview: false,
        orgBusinessView: false,
        locationsView: false,
        providersView: false,
        insurancesView: false,
        usersView: false,
        licenseBillingView: false,
        phoneSmsView: false,
        patientPaymentSetupView: false,
        pmsEhrView: false
      }
    });
  };

  const handleCreateUser = async () => {
    try {
      // Basic validation
      if (!addUserFields.fullName.trim()) {
        alert('Please enter a full name');
        return;
      }
      if (!addUserFields.email.trim()) {
        alert('Please enter an email address');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(addUserFields.email)) {
        alert('Please enter a valid email address');
        return;
      }

      console.log('Creating user:', addUserFields);

      // Create new user object with proper structure - use sequential ID
      // Consider all existing IDs: from current users array AND from localUserIds tracking
      const allUserIds = users.map((user: User) => user.id);
      const maxFromUsers = allUserIds.length > 0 ? Math.max(...allUserIds) : 0;
      const maxFromLocalIds = localUserIds.length > 0 ? Math.max(...localUserIds) : 0;

      // Use the next available ID after the highest existing ID
      const maxId = Math.max(maxFromUsers, maxFromLocalIds, 0);
      const nextId = maxId + 1;

      console.log('🔢 Generating sequential user ID:');
      console.log('   All user IDs from users array:', allUserIds);
      console.log('   Max from users array:', maxFromUsers);
      console.log('   Local user IDs tracking:', localUserIds);
      console.log('   Max from local IDs:', maxFromLocalIds);
      console.log('   Final max ID:', maxId);
      console.log('   Next ID will be:', nextId);

      const newUser: User = {
        id: nextId, // Generate sequential ID
        username: addUserFields.fullName,
        email: addUserFields.email,
        roles: [addUserFields.role],
        permissions: Object.entries(addUserFields.permissions)
          .filter(([_, value]) => value)
          .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').toLowerCase()),
        lastLogin: 'Never',
        status: addUserFields.status as 'Active' | 'Inactive' | 'Pending',
        createdAt: new Date().toISOString().split('T')[0],
        phone: addUserFields.phoneNumber,
        locations: addUserFields.locations,
        defaultBusiness: addUserFields.defaultBusiness,
        defaultProduct: addUserFields.defaultProduct,
        productAccess: Object.entries(addUserFields.productAccess)
          .filter(([_, value]) => value)
          .map(([key, _]) => {
            // Convert camelCase to readable format
            const formatted = key.replace(/([A-Z])/g, ' $1').toLowerCase();
            return formatted.charAt(0).toUpperCase() + formatted.slice(1);
          })
      };

      // Add user to the local state
      setUsers(prevUsers => [...prevUsers, newUser]);

      // Save to localStorage for persistence
      const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
      localUsers.push(newUser);
      localStorage.setItem('localUsers', JSON.stringify(localUsers));

      // Track that this ID is a local user
      const updatedLocalUserIds = [...localUserIds, nextId];
      setLocalUserIds(updatedLocalUserIds);
      localStorage.setItem('localUserIds', JSON.stringify(updatedLocalUserIds));

      // TODO: Make actual API call when backend endpoint is ready
      // const response = await import('axios').then(ax => ax.default.post('/api/users', {
      //   fullName: addUserFields.fullName,
      //   role: addUserFields.role,
      //   email: addUserFields.email,
      //   phone: addUserFields.phoneNumber,
      //   status: addUserFields.status,
      //   locations: addUserFields.locations,
      //   defaultBusiness: addUserFields.defaultBusiness,
      //   defaultProduct: addUserFields.defaultProduct,
      //   productAccess: addUserFields.productAccess,
      //   permissions: addUserFields.permissions
      // }));

      // Close modal and reset form
      handleCloseAddModal();

      // Show success message
      setSuccessMessage(`User "${newUser.username}" has been created successfully!`);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      console.log('User created successfully:', newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
  };

  const confirmDelete = async () => {
    if (userToDelete && userToDelete.id !== undefined) {
      try {
        // Check if it's a local user or backend user
        const isLocalUser = localUserIds.includes(userToDelete.id);

        if (!isLocalUser) {
          // Try to delete from backend if it's a backend user
          await import('axios').then(ax => ax.default.delete(`/api/users/${userToDelete.id}`));
        }

        // Remove from local state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));

        // Remove from localStorage if it's a local user
        if (isLocalUser) {
          const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
          const updatedLocalUsers = localUsers.filter((user: User) => user.id !== userToDelete.id);
          localStorage.setItem('localUsers', JSON.stringify(updatedLocalUsers));

          // Remove from localUserIds tracking
          const updatedLocalUserIds = localUserIds.filter(id => id !== userToDelete.id);
          setLocalUserIds(updatedLocalUserIds);
          localStorage.setItem('localUserIds', JSON.stringify(updatedLocalUserIds));
        }

        // Show success message
        setSuccessMessage(`User "${userToDelete.username}" has been deleted successfully!`);
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);

      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user from server.');
      }
      setUserToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const saveUserChanges = async () => {
    if (editingUser) {
      try {
        console.log('Saving changes for user:', editingUser.id, editingUser.username);
        console.log('Edit form fields:', editUserFields);
        console.log('Phone number being saved:', editUserFields.phoneNumber);

        // Create updated user object from form fields - create completely new object
        const updatedUser: User = {
          id: editingUser.id,
          username: editUserFields.fullName,
          email: editUserFields.email,
          roles: [editUserFields.role],
          permissions: Object.entries(editUserFields.permissions)
            .filter(([_, value]) => value)
            .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').toLowerCase()),
          status: editUserFields.status as 'Active' | 'Inactive' | 'Pending',
          phone: editUserFields.phoneNumber,
          locations: [...editUserFields.locations], // Create new array
          defaultBusiness: editUserFields.defaultBusiness,
          defaultProduct: editUserFields.defaultProduct,
          productAccess: Object.entries(editUserFields.productAccess)
            .filter(([_, value]) => value)
            .map(([key, _]) => {
              // Convert camelCase to readable format
              const formatted = key.replace(/([A-Z])/g, ' $1').toLowerCase();
              const result = formatted.charAt(0).toUpperCase() + formatted.slice(1);
              console.log('🔄 Converting productAccess:', key, '→', result);
              return result;
            }),
          lastLogin: editingUser.lastLogin,
          createdAt: editingUser.createdAt
        };

        console.log('Updated user object:', updatedUser);
        console.log('Updated user phone specifically:', updatedUser.phone);

        // Update users in state - create a completely new array with only the target user changed
        const targetUserId = editingUser.id;
        const updatedUsers: User[] = [];

        for (let i = 0; i < users.length; i++) {
          const currentUser = users[i];
          if (currentUser.id === targetUserId) {
            console.log('✅ Updating user with ID:', currentUser.id, 'from:', currentUser.username, 'to:', updatedUser.username);
            updatedUsers.push(updatedUser);
          } else {
            console.log('🔄 Keeping user unchanged:', currentUser.id, currentUser.username);
            // Create a completely new user object to avoid any reference issues
            updatedUsers.push({
              id: currentUser.id,
              username: currentUser.username,
              email: currentUser.email,
              roles: [...currentUser.roles],
              permissions: [...currentUser.permissions],
              status: currentUser.status,
              phone: currentUser.phone,
              locations: currentUser.locations ? [...currentUser.locations] : [],
              defaultBusiness: currentUser.defaultBusiness,
              defaultProduct: currentUser.defaultProduct,
              productAccess: currentUser.productAccess ? [...currentUser.productAccess] : [],
              lastLogin: currentUser.lastLogin,
              createdAt: currentUser.createdAt
            });
          }
        }

        console.log('Original users count:', users.length);
        console.log('Updated users count:', updatedUsers.length);
        console.log('Target user ID:', targetUserId);

        setUsers(updatedUsers);

        // Persist the user changes
        const isLocalUser = localUserIds.includes(editingUser.id);

        if (isLocalUser) {
          // Update localStorage for local users
          const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
          const updatedLocalUsers = localUsers.map((user: User) =>
            user.id === editingUser.id ? updatedUser : user
          );
          localStorage.setItem('localUsers', JSON.stringify(updatedLocalUsers));
          console.log('✅ Updated local user in localStorage');
        } else {
          // For backend users, try API call first, fallback to localStorage
          try {
            const axios = await import('axios');

            // Split the username back to first and last name
            const nameParts = updatedUser.username.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Convert status back to database boolean fields
            const isActive = updatedUser.status === 'Active';
            const isBlocked = updatedUser.status === 'Inactive';

            // Convert roles back to boolean flags
            const isProvider = updatedUser.roles.includes('Provider');
            const isTechnician = updatedUser.roles.includes('Technician');
            const isReferringPhysician = updatedUser.roles.includes('Referring Physician');

            await axios.default.put(`/api/users/${editingUser.id}`, {
              FIRST_NAME: firstName,
              LAST_NAME: lastName,
              EMAIL: updatedUser.email,
              IS_ACTIVE: isActive ? 1 : 0,
              IS_BLOCKED: isBlocked ? 1 : 0,
              IS_PROVIDER: isProvider ? 1 : 0,
              IS_TECHNICIAN: isTechnician ? 1 : 0,
              IS_REFERRING_PHYSICIAN: isReferringPhysician ? 1 : 0,
              PHONE: updatedUser.phone,
              PERMISSIONS: updatedUser.permissions.join(','),
              UPDATE_DATE: new Date().toISOString(),
              USER_INITITALS: `${firstName.charAt(0)} ${lastName.charAt(0)}`.trim()
            });
            console.log('✅ Updated backend user via API');
          } catch (apiError) {
            console.warn('⚠️ API update failed, storing changes locally:', apiError);

            // Store backend user changes in localStorage as a fallback
            const backendUserChanges = JSON.parse(localStorage.getItem('backendUserChanges') || '{}');
            backendUserChanges[editingUser.id] = updatedUser;
            localStorage.setItem('backendUserChanges', JSON.stringify(backendUserChanges));
            console.log('💾 Stored backend user changes in localStorage for sync later');
          }
        }

        // Close modal and reset state
        setShowEditModal(false);
        setEditingUser(null);

        // Reset edit form to prevent any lingering state
        setEditUserFields({
          fullName: '',
          role: 'User',
          email: '',
          phoneNumber: '',
          status: 'Active',
          locations: [],
          defaultBusiness: '',
          defaultProduct: '',
          productAccess: {
            virtualAssistant: false,
            scribe: false,
            billingAssistant: false,
            patientPortal: false,
            patientEngagement: false,
          },
          permissions: {
            adminOverview: false,
            orgBusinessView: false,
            locationsView: false,
            providersView: false,
            insurancesView: false,
            usersView: false,
            licenseBillingView: false,
            phoneSmsView: false,
            patientPaymentSetupView: false,
            pmsEhrView: false,
          }
        });

        // Show success message
        setSuccessMessage(`User "${updatedUser.username}" has been updated successfully!`);
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
      }
    }
  };



  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Active': 'badge bg-dark text-white border',
      'Inactive': 'badge bg-light text-dark border',
      'Pending': 'badge text-dark border'
    };

    return `badge rounded-pill px-2 py-1 ${statusClasses[status as keyof typeof statusClasses]}`;
  };

  const getRoleBadge = (role: string) => {
    const roleClasses = {
      'Admin': 'badge bg-dark text-white border',
      'Manager': 'badge text-dark border',
      'User': 'badge bg-light text-dark border'
    };

    return `badge rounded-pill px-2 py-1 ${roleClasses[role as keyof typeof roleClasses] || 'badge bg-light text-dark border'}`;
  };

  const getAllRoles = () => {
    const roles = new Set<string>();
    users.forEach(user => user.roles.forEach(role => roles.add(role)));
    return Array.from(roles);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === '' || user.roles.includes(filterRole);
    const matchesStatus = filterStatus === '' || user.status === filterStatus;
    
    // If showInactiveUsers is false, exclude inactive users
    const matchesActiveStatus = showInactiveUsers || user.status !== 'Inactive';

    return matchesSearch && matchesRole && matchesStatus && matchesActiveStatus;
  });

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h4 fw-semibold text-dark mb-1">VisionCare Optical Centers - User Management</h1>
            <p className="text-muted mb-0">Manage user accounts, groups, and assign product access</p>
          </div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="mb-4">
        <div className="d-flex align-items-center">
          <div className="btn-group border rounded-pill p-1" role="group" aria-label="User management tabs" style={{ backgroundColor: '#ddd' }}>
            <button
              type="button"
              className={`btn fw-medium ${activeTab === 'users' ? 'bg-white rounded-pill' : 'bg-transparent'}`}
              onClick={() => setActiveTab('users')}
              style={{ fontSize: '0.875rem' }}
            >
              Users
            </button>
            <button
              type="button"
              className={`btn fw-medium ${activeTab === 'userGroups' ? 'bg-white rounded-pill' : 'bg-transparent'}`}
              onClick={() => setActiveTab('userGroups')}
              style={{ fontSize: '0.875rem' }}
            >
              User Groups
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {/* {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )} */}

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <>
          {/* Filters and Search */}

          {/* Users Data Table */}
          <div className="card" style={{ borderRadius: '0.75rem', border: '1px solid #ddd' }}>
            <div className="card-header bg-transparent border-0 pb-0">
              <div className="">
                <div className='mb-2'>
                  <h5 className="fw-medium text-dark mb-1">Users</h5>
                  <p className='text-muted small'>Manage Users and their access to EVAA product</p>
                </div>
                <div className="row g-3">
                  <div className="col-md-10">                    
                    <input
                      type="text"
                      className="form-control"
                      id="search"
                      placeholder="Search by username or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    <button className="btn btn-dark w-100" onClick={() => setShowAddModal(true)}>
                      + Add New User
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Show inactive users checkbox and count */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="showInactiveUsers"
                    checked={showInactiveUsers}
                    onChange={(e) => setShowInactiveUsers(e.target.checked)}
                    style={{
                      accentColor: '#000',
                      backgroundColor: showInactiveUsers ? '#000' : '',
                      borderColor: showInactiveUsers ? '#000' : ''
                    }}
                  />
                  <label className="form-check-label text-muted" htmlFor="showInactiveUsers">
                    Show inactive users
                  </label>
                </div>
                <div className="text-muted small">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
              </div>

              <div className="table-responsive" style={{ maxHeight: `calc(100vh - 26rem)`, overflowY: 'auto', border: '1px solid #ddd',  borderRadius: '0.75rem' }}>
                <table className="table table-hover">
                  <thead className="sticky-top bg-white">
                    <tr className="border-bottom">
                      <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>Name</th>
                      <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>Email</th>
                      <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>Phone</th>
                      <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>Role</th>
                      <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>Product Access</th>
                      <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>Status</th>
                      <th className="fw-semibold text-dark text-end" style={{ fontSize: '0.875rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => {
                      console.log(`👤 Rendering user ${index}:`, { id: user.id, username: user.username, email: user.email });
                      if (!user.id) {
                        console.error('❌ User with undefined ID found:', user);
                      }
                      return (
                        <tr key={`user-${user.id || index}-${user.email || user.username || user.phone || index}`} className="border-bottom">
                          <td className="py-3">
                            <div>
                              <div className="text-dark small">{user.username}</div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div>
                              <div className="text-dark small">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div>
                              <div className="text-dark small">{user.phone}</div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="d-flex flex-wrap gap-1">
                              {user.roles.map((role, index) => (
                                <span
                                  key={index}
                                  className={getRoleBadge(role)}
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="d-flex flex-wrap gap-1">
                              {user.productAccess && user.productAccess.length > 0 ? (
                                <span
                                  className="badge text-dark border"
                                  style={{ fontSize: '0.75rem' }}
                                  title={user.productAccess.join(', ')}
                                >
                                  {user.productAccess.length} Active
                                </span>
                              ) : (
                                <span className="badge bg-dark text-white border">No Access</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={getStatusBadge(user.status)} style={{ fontSize: '0.75rem' }}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              {/* <button 
                          className="btn btn-outline-info btn-sm d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          onClick={() => handleView(user.id)}
                          title="View User"
                        >
                          👁️
                        </button> */}
                              <button
                                className="btn btn-sm d-flex align-items-center justify-content-center text-dark"
                                onClick={() => {
                                  console.log('🎯 Edit button clicked for user:', user.username, 'ID:', user.id);
                                  handleEdit(user.id);
                                }}
                                style={{ border: '1px solid #ddd' }}
                                title="Edit User"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm d-flex align-items-center justify-content-center text-dark"
                                onClick={() => handleDelete(user.id)}
                                style={{ border: '1px solid #ddd' }}
                                title="Delete User"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
              {/* {filteredUsers.length > 0 && (
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
          )} */}
            </div>
          </div>

          {/* Edit User Modal */}
          {showEditModal && editingUser && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1} key={`edit-modal-${editingUser.id}`}>
              <div className="modal-dialog modal-dialog-centered modal-lg justify-content-center">
                <div className="modal-content" style={{ borderRadius: '0.75rem', border: 'none', maxHeight: '90vh', overflow: 'hidden', width: '30rem' }}>
                  <div className="modal-header border-0 pb-0">
                    <div>
                      <h6 className="modal-title text-dark">Edit User</h6>
                      <p className="text-muted small mb-1">Update user information, product access, and permissions</p>
                    </div>
                    <button type="button" className="btn-close" onClick={handleCloseEditModal} aria-label="Close"></button>
                  </div>

                  <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '1.5rem' }}>
                    {/* User Information Section */}
                    <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                      <h6 className="fw-medium mb-3 text-dark">User Information</h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small text-dark">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fullName"
                            key={`fullName-${editingUser?.id}`}
                            value={editUserFields.fullName}
                            onChange={handleEditUserFieldChange}
                            placeholder="Enter full name"
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small text-dark">Role</label>
                          <select
                            className="form-select"
                            name="role"
                            value={editUserFields.role}
                            onChange={handleEditUserFieldChange}
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                          </select>
                          <small className="text-muted">Only Admin users can edit other users</small>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small text-dark">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            key={`email-${editingUser?.id}`}
                            value={editUserFields.email}
                            onChange={handleEditUserFieldChange}
                            placeholder="user@example.com"
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small text-dark">Phone Number</label>
                          <input
                            type="text"
                            className="form-control"
                            name="phoneNumber"
                            value={editUserFields.phoneNumber}
                            onChange={handleEditUserFieldChange}
                            placeholder="(XXX) XXX-XXXX"
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small text-dark">Status</label>
                          <select
                            className="form-select"
                            name="status"
                            value={editUserFields.status}
                            onChange={handleEditUserFieldChange}
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Location Assignment Section */}
                    <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                      <h6 className="fw-medium mb-3 text-dark">Location Assignment</h6>
                      <p className="text-muted small mb-3">Assign user to one or more locations</p>
                      <div className="row g-2">
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="editAllLocations"
                              onChange={(e) => handleEditLocationChange('All Locations', e.target.checked)}
                              checked={editUserFields.locations.includes('All Locations')}
                              style={{
                                accentColor: '#000',
                                backgroundColor: editUserFields.locations.includes('All Locations') ? '#000' : '',
                                borderColor: editUserFields.locations.includes('All Locations') ? '#000' : ''
                              }}
                            />
                            <label className="form-check-label" htmlFor="editAllLocations">All Locations</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="editDowntownOptical"
                              onChange={(e) => handleEditLocationChange('Downtown Optical Center', e.target.checked)}
                              checked={editUserFields.locations.includes('Downtown Optical Center')}
                              style={{
                                accentColor: '#000',
                                backgroundColor: editUserFields.locations.includes('Downtown Optical Center') ? '#000' : '',
                                borderColor: editUserFields.locations.includes('Downtown Optical Center') ? '#000' : ''
                              }}
                            />
                            <label className="form-check-label" htmlFor="editDowntownOptical">Downtown Optical Center</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="editWestsideVision"
                              onChange={(e) => handleEditLocationChange('Westside Vision Clinic', e.target.checked)}
                              checked={editUserFields.locations.includes('Westside Vision Clinic')}
                              style={{
                                accentColor: '#000',
                                backgroundColor: editUserFields.locations.includes('Westside Vision Clinic') ? '#000' : '',
                                borderColor: editUserFields.locations.includes('Westside Vision Clinic') ? '#000' : ''
                              }}
                            />
                            <label className="form-check-label" htmlFor="editWestsideVision">Westside Vision Clinic</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="editEastgateEye"
                              onChange={(e) => handleEditLocationChange('Eastgate Eye Care', e.target.checked)}
                              checked={editUserFields.locations.includes('Eastgate Eye Care')}
                              style={{
                                accentColor: '#000',
                                backgroundColor: editUserFields.locations.includes('Eastgate Eye Care') ? '#000' : '',
                                borderColor: editUserFields.locations.includes('Eastgate Eye Care') ? '#000' : ''
                              }}
                            />
                            <label className="form-check-label" htmlFor="editEastgateEye">Eastgate Eye Care</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="editNorthparkEyewear"
                              onChange={(e) => handleEditLocationChange('Northpark Eyewear Gallery', e.target.checked)}
                              checked={editUserFields.locations.includes('Northpark Eyewear Gallery')}
                              style={{
                                accentColor: '#000',
                                backgroundColor: editUserFields.locations.includes('Northpark Eyewear Gallery') ? '#000' : '',
                                borderColor: editUserFields.locations.includes('Northpark Eyewear Gallery') ? '#000' : ''
                              }}
                            />
                            <label className="form-check-label" htmlFor="editNorthparkEyewear">Northpark Eyewear Gallery</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Default Preferences Section */}
                    <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                      <h6 className="fw-medium mb-3 text-dark">Default Preferences</h6>
                      <p className="text-muted small mb-3">Set default business and product that will be selected when this user logs in</p>
                      <div className="row g-3">
                        <div className="col-md-12">
                          <label className="form-label small text-dark">Default Business</label>
                          <select
                            className="form-select"
                            name="defaultBusiness"
                            value={editUserFields.defaultBusiness}
                            onChange={handleEditUserFieldChange}
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          >
                            <option value="">Select default business/location</option>
                            <option value="downtown">Downtown Optical Center</option>
                            <option value="westside">Westside Vision Clinic</option>
                            <option value="eastgate">Eastgate Eye Care</option>
                            <option value="northpark">Northpark Eyewear Gallery</option>
                          </select>
                          <small className="text-muted">This location will be automatically selected on login</small>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label small text-dark">Default EVAA Product</label>
                          <select
                            className="form-select"
                            name="defaultProduct"
                            value={editUserFields.defaultProduct}
                            onChange={handleEditUserFieldChange}
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          >
                            <option value="">Select default product</option>
                            <option value="virtual-assistant">Virtual Assistant</option>
                            <option value="scribe">Scribe</option>
                            <option value="billing-assistant">Billing Assistant</option>
                            <option value="patient-portal">Patient Portal</option>
                          </select>
                          <small className="text-muted">This product will be automatically selected on login</small>
                        </div>
                      </div>
                    </div>

                    {/* Product Access Section */}
                    <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                      <h6 className="fw-medium mb-3 text-dark">Product Access</h6>
                      <p className="text-muted small mb-3">Enable or disable access to EVAA products for this user</p>

                      <div className="row g-3">
                        <div className="col-md-12">
                          <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div>
                              <div className="fw-medium">Virtual Assistant <span className="badge bg-white border text-dark ms-2">AI Phone Agent</span></div>
                              <small className="text-muted">Access to AI-powered phone assistant</small>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAccess.virtualAssistant"
                                checked={editUserFields.productAccess.virtualAssistant}
                                onChange={handleEditUserFieldChange}
                                style={{
                                  accentColor: '#000',
                                  backgroundColor: editUserFields.productAccess.virtualAssistant ? '#000' : '',
                                  borderColor: editUserFields.productAccess.virtualAssistant ? '#000' : ''
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div>
                              <div className="fw-medium">Scribe <span className="badge bg-white border text-dark ms-2">Medical Documentation</span></div>
                              <small className="text-muted">Access to AI scribe and clinical documentation</small>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAccess.scribe"
                                checked={editUserFields.productAccess.scribe}
                                onChange={handleEditUserFieldChange}
                                style={{
                                  accentColor: '#000',
                                  backgroundColor: editUserFields.productAccess.scribe ? '#000' : '',
                                  borderColor: editUserFields.productAccess.scribe ? '#000' : ''
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div>
                              <div className="fw-medium">Billing Assistant <span className="badge bg-white border text-dark ms-2">Revenue Cycle</span></div>
                              <small className="text-muted">Access to billing and claims management</small>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAccess.billingAssistant"
                                checked={editUserFields.productAccess.billingAssistant}
                                onChange={handleEditUserFieldChange}
                                style={{
                                  accentColor: '#000',
                                  backgroundColor: editUserFields.productAccess.billingAssistant ? '#000' : '',
                                  borderColor: editUserFields.productAccess.billingAssistant ? '#000' : ''
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div>
                              <div className="fw-medium">Patient Portal <span className="badge bg-white border text-dark ms-2">Patient Access</span></div>
                              <small className="text-muted">Access to patient portal management</small>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAccess.patientPortal"
                                checked={editUserFields.productAccess.patientPortal}
                                onChange={handleEditUserFieldChange}
                                style={{
                                  accentColor: '#000',
                                  backgroundColor: editUserFields.productAccess.patientPortal ? '#000' : '',
                                  borderColor: editUserFields.productAccess.patientPortal ? '#000' : ''
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div>
                              <div className="fw-medium">Patient Engagement <span className="badge bg-white border text-dark ms-2">Marketing & Outreach</span></div>
                              <small className="text-muted">Access to patient engagement and campaign management</small>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAccess.patientEngagement"
                                checked={editUserFields.productAccess.patientEngagement}
                                onChange={handleEditUserFieldChange}
                                style={{
                                  accentColor: '#000',
                                  backgroundColor: editUserFields.productAccess.patientEngagement ? '#000' : '',
                                  borderColor: editUserFields.productAccess.patientEngagement ? '#000' : ''
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="mb-0 p-3 border rounded" style={{ background: '#fff' }}>
                      <h6 className="fw-medium mb-3 text-dark">Permissions</h6>
                      <p className="text-muted small mb-3">Configure user permissions for each product and administrative functions</p>

                      <div className="mb-3">
                        <h6 className="small fw-medium text-dark mb-2">Admin Console Permissions</h6>
                        <small className="text-muted d-block mb-3">Access controls for each admin page</small>

                        <div className="row g-2">
                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Admin Overview</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.adminOverview"
                                  checked={editUserFields.permissions.adminOverview}
                                  onChange={handleEditUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: editUserFields.permissions.adminOverview ? '#000' : '',
                                    borderColor: editUserFields.permissions.adminOverview ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Org/Business - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.orgBusinessView"
                                  checked={editUserFields.permissions.orgBusinessView}
                                  onChange={handleEditUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: editUserFields.permissions.orgBusinessView ? '#000' : '',
                                    borderColor: editUserFields.permissions.orgBusinessView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Locations - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.locationsView"
                                  checked={editUserFields.permissions.locationsView}
                                  onChange={handleEditUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: editUserFields.permissions.locationsView ? '#000' : '',
                                    borderColor: editUserFields.permissions.locationsView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Providers - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.providersView"
                                  checked={editUserFields.permissions.providersView}
                                  onChange={handleEditUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: editUserFields.permissions.providersView ? '#000' : '',
                                    borderColor: editUserFields.permissions.providersView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Insurances - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.insurancesView"
                                  checked={editUserFields.permissions.insurancesView}
                                  onChange={handleEditUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: editUserFields.permissions.insurancesView ? '#000' : '',
                                    borderColor: editUserFields.permissions.insurancesView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Users - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.usersView"
                                  checked={editUserFields.permissions.usersView}
                                  onChange={handleEditUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: editUserFields.permissions.usersView ? '#000' : '',
                                    borderColor: editUserFields.permissions.usersView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">License and Billing - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.licenseBillingView"
                                  checked={editUserFields.permissions.licenseBillingView}
                                  onChange={handleEditUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: editUserFields.permissions.licenseBillingView ? '#000' : '',
                                    borderColor: editUserFields.permissions.licenseBillingView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Phone & SMS - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.phoneSmsView"
                                  checked={editUserFields.permissions.phoneSmsView}
                                  onChange={handleEditUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: editUserFields.permissions.phoneSmsView ? '#000' : '',
                                    borderColor: editUserFields.permissions.phoneSmsView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Patient Payment Setup - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.patientPaymentSetupView"
                                  checked={editUserFields.permissions.patientPaymentSetupView}
                                  onChange={handleEditUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: editUserFields.permissions.patientPaymentSetupView ? '#000' : '',
                                    borderColor: editUserFields.permissions.patientPaymentSetupView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">PMS/EHR - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.pmsEhrView"
                                  checked={editUserFields.permissions.pmsEhrView}
                                  onChange={handleEditUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: editUserFields.permissions.pmsEhrView ? '#000' : '',
                                    borderColor: editUserFields.permissions.pmsEhrView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-1">
                    <button type="button" className="btn btn-light" onClick={handleCloseEditModal}>Cancel</button>
                    <button type="button" className="btn btn-dark" onClick={saveUserChanges}>Save Changes</button>
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

          {/* Add New User Modal */}
          {showAddModal && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
              <div className="modal-dialog modal-dialog-centered modal-lg justify-content-center">
                <div className="modal-content" style={{ borderRadius: '0.75rem', border: 'none', maxHeight: '90vh', overflow: 'hidden', width: '30rem' }}>
                  <div className="modal-header border-0 pb-0">
                    <div>
                      <h6 className="modal-title text-dark">Add New User</h6>
                      <p className="text-muted small mb-1">Configure user information, product access, and permissions</p>
                    </div>
                    <button type="button" className="btn-close" onClick={handleCloseAddModal} aria-label="Close"></button>
                  </div>

                  <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '1.5rem' }}>
                    {/* User Information Section */}
                    <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                      <h6 className="fw-medium mb-3 text-dark">User Information</h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small text-dark">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fullName"
                            value={addUserFields.fullName}
                            onChange={handleAddUserFieldChange}
                            placeholder="Enter full name"
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small text-dark">Role</label>
                          <select
                            className="form-select"
                            name="role"
                            value={addUserFields.role}
                            onChange={handleAddUserFieldChange}
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                          </select>
                          <small className="text-muted">Only Admin users can edit other users</small>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small text-dark">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={addUserFields.email}
                            onChange={handleAddUserFieldChange}
                            placeholder="user@example.com"
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small text-dark">Phone Number</label>
                          <input
                            type="text"
                            className="form-control"
                            name="phoneNumber"
                            value={addUserFields.phoneNumber}
                            onChange={handleAddUserFieldChange}
                            placeholder="(XXX) XXX-XXXX"
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small text-dark">Status</label>
                          <select
                            className="form-select"
                            name="status"
                            value={addUserFields.status}
                            onChange={handleAddUserFieldChange}
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Location Assignment Section */}
                    <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                      <h6 className="fw-medium mb-3 text-dark">Location Assignment</h6>
                      <p className="text-muted small mb-3">Assign user to one or more locations</p>
                      <div className="row g-2">
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="allLocations"
                              onChange={(e) => handleLocationChange('All Locations', e.target.checked)}
                              checked={addUserFields.locations.includes('All Locations')}
                              style={{
                                accentColor: '#000',
                                backgroundColor: addUserFields.locations.includes('All Locations') ? '#000' : '',
                                borderColor: addUserFields.locations.includes('All Locations') ? '#000' : ''
                              }}
                            />
                            <label className="form-check-label" htmlFor="allLocations">All Locations</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="downtownOptical"
                              onChange={(e) => handleLocationChange('Downtown Optical Center', e.target.checked)}
                              checked={addUserFields.locations.includes('Downtown Optical Center')}
                              style={{
                                accentColor: '#000',
                                backgroundColor: addUserFields.locations.includes('Downtown Optical Center') ? '#000' : '',
                                borderColor: addUserFields.locations.includes('Downtown Optical Center') ? '#000' : ''
                              }}
                            />
                            <label className="form-check-label" htmlFor="downtownOptical">Downtown Optical Center</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="westsideVision"
                              onChange={(e) => handleLocationChange('Westside Vision Clinic', e.target.checked)}
                              checked={addUserFields.locations.includes('Westside Vision Clinic')}
                              style={{
                                accentColor: '#000',
                                backgroundColor: addUserFields.locations.includes('Westside Vision Clinic') ? '#000' : '',
                                borderColor: addUserFields.locations.includes('Westside Vision Clinic') ? '#000' : ''
                              }}
                            />
                            <label className="form-check-label" htmlFor="westsideVision">Westside Vision Clinic</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="eastgateEye"
                              onChange={(e) => handleLocationChange('Eastgate Eye Care', e.target.checked)}
                              checked={addUserFields.locations.includes('Eastgate Eye Care')}
                              style={{
                                accentColor: '#000',
                                backgroundColor: addUserFields.locations.includes('Eastgate Eye Care') ? '#000' : '',
                                borderColor: addUserFields.locations.includes('Eastgate Eye Care') ? '#000' : ''
                              }}
                            />
                            <label className="form-check-label" htmlFor="eastgateEye">Eastgate Eye Care</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="northparkEyewear"
                              onChange={(e) => handleLocationChange('Northpark Eyewear Gallery', e.target.checked)}
                              checked={addUserFields.locations.includes('Northpark Eyewear Gallery')}
                              style={{
                                accentColor: '#000',
                                backgroundColor: addUserFields.locations.includes('Northpark Eyewear Gallery') ? '#000' : '',
                                borderColor: addUserFields.locations.includes('Northpark Eyewear Gallery') ? '#000' : ''
                              }}
                            />
                            <label className="form-check-label" htmlFor="northparkEyewear">Northpark Eyewear Gallery</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Default Preferences Section */}
                    <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                      <h6 className="fw-medium mb-3 text-dark">Default Preferences</h6>
                      <p className="text-muted small mb-3">Set default business and product that will be selected when this user logs in</p>
                      <div className="row g-3">
                        <div className="col-md-12">
                          <label className="form-label small text-dark">Default Business</label>
                          <select
                            className="form-select"
                            name="defaultBusiness"
                            value={addUserFields.defaultBusiness}
                            onChange={handleAddUserFieldChange}
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          >
                            <option value="">Select default business/location</option>
                            <option value="downtown">Downtown Optical Center</option>
                            <option value="westside">Westside Vision Clinic</option>
                            <option value="eastgate">Eastgate Eye Care</option>
                            <option value="northpark">Northpark Eyewear Gallery</option>
                          </select>
                          <small className="text-muted">This location will be automatically selected on login</small>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label small text-dark">Default EVAA Product</label>
                          <select
                            className="form-select"
                            name="defaultProduct"
                            value={addUserFields.defaultProduct}
                            onChange={handleAddUserFieldChange}
                            style={{ backgroundColor: '#ebebeb', border: '0' }}
                          >
                            <option value="">Select default product</option>
                            <option value="virtual-assistant">Virtual Assistant</option>
                            <option value="scribe">Scribe</option>
                            <option value="billing-assistant">Billing Assistant</option>
                            <option value="patient-portal">Patient Portal</option>
                          </select>
                          <small className="text-muted">This product will be automatically selected on login</small>
                        </div>
                      </div>
                    </div>

                    {/* Product Access Section */}
                    <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                      <h6 className="fw-medium mb-3 text-dark">Product Access</h6>
                      <p className="text-muted small mb-3">Enable or disable access to EVAA products for this user</p>

                      <div className="row g-3">
                        <div className="col-md-12">
                          <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div>
                              <div className="fw-medium">Virtual Assistant <span className="badge bg-white border text-dark ms-2">AI Phone Agent</span></div>
                              <small className="text-muted">Access to AI-powered phone assistant</small>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAccess.virtualAssistant"
                                checked={addUserFields.productAccess.virtualAssistant}
                                onChange={handleAddUserFieldChange}
                                style={{
                                  accentColor: '#000',
                                  backgroundColor: addUserFields.productAccess.virtualAssistant ? '#000' : '',
                                  borderColor: addUserFields.productAccess.virtualAssistant ? '#000' : ''
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div>
                              <div className="fw-medium">Scribe <span className="badge bg-white border text-dark ms-2">Medical Documentation</span></div>
                              <small className="text-muted">Access to AI scribe and clinical documentation</small>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAccess.scribe"
                                checked={addUserFields.productAccess.scribe}
                                onChange={handleAddUserFieldChange}
                                style={{
                                  accentColor: '#000',
                                  backgroundColor: addUserFields.productAccess.scribe ? '#000' : '',
                                  borderColor: addUserFields.productAccess.scribe ? '#000' : ''
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div>
                              <div className="fw-medium">Billing Assistant <span className="badge bg-white border text-dark ms-2">Revenue Cycle</span></div>
                              <small className="text-muted">Access to billing and claims management</small>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAccess.billingAssistant"
                                checked={addUserFields.productAccess.billingAssistant}
                                onChange={handleAddUserFieldChange}
                                style={{
                                  accentColor: '#000',
                                  backgroundColor: addUserFields.productAccess.billingAssistant ? '#000' : '',
                                  borderColor: addUserFields.productAccess.billingAssistant ? '#000' : ''
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div>
                              <div className="fw-medium">Patient Portal <span className="badge bg-white border text-dark ms-2">Patient Access</span></div>
                              <small className="text-muted">Access to patient portal management</small>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAccess.patientPortal"
                                checked={addUserFields.productAccess.patientPortal}
                                onChange={handleAddUserFieldChange}
                                style={{
                                  accentColor: '#000',
                                  backgroundColor: addUserFields.productAccess.patientPortal ? '#000' : '',
                                  borderColor: addUserFields.productAccess.patientPortal ? '#000' : ''
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div>
                              <div className="fw-medium">Patient Engagement <span className="badge bg-white border text-dark ms-2">Marketing & Outreach</span></div>
                              <small className="text-muted">Access to patient engagement and campaign management</small>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAccess.patientEngagement"
                                checked={addUserFields.productAccess.patientEngagement}
                                onChange={handleAddUserFieldChange}
                                style={{
                                  accentColor: '#000',
                                  backgroundColor: addUserFields.productAccess.patientEngagement ? '#000' : '',
                                  borderColor: addUserFields.productAccess.patientEngagement ? '#000' : ''
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="mb-0 p-3 border rounded" style={{ background: '#fff' }}>
                      <h6 className="fw-medium mb-3 text-dark">Permissions</h6>
                      <p className="text-muted small mb-3">Configure user permissions for each product and administrative functions</p>

                      <div className="mb-3">
                        <h6 className="small fw-medium text-dark mb-2">Admin Console Permissions</h6>
                        <small className="text-muted d-block mb-3">Access controls for each admin page</small>

                        <div className="row g-2">
                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Admin Overview</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.adminOverview"
                                  checked={addUserFields.permissions.adminOverview}
                                  onChange={handleAddUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: addUserFields.permissions.adminOverview ? '#000' : '',
                                    borderColor: addUserFields.permissions.adminOverview ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Org/Business - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.orgBusinessView"
                                  checked={addUserFields.permissions.orgBusinessView}
                                  onChange={handleAddUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: addUserFields.permissions.orgBusinessView ? '#000' : '',
                                    borderColor: addUserFields.permissions.orgBusinessView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Locations - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.locationsView"
                                  checked={addUserFields.permissions.locationsView}
                                  onChange={handleAddUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: addUserFields.permissions.locationsView ? '#000' : '',
                                    borderColor: addUserFields.permissions.locationsView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Providers - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.providersView"
                                  checked={addUserFields.permissions.providersView}
                                  onChange={handleAddUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: addUserFields.permissions.providersView ? '#000' : '',
                                    borderColor: addUserFields.permissions.providersView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Insurances - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.insurancesView"
                                  checked={addUserFields.permissions.insurancesView}
                                  onChange={handleAddUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: addUserFields.permissions.insurancesView ? '#000' : '',
                                    borderColor: addUserFields.permissions.insurancesView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Users - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.usersView"
                                  checked={addUserFields.permissions.usersView}
                                  onChange={handleAddUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: addUserFields.permissions.usersView ? '#000' : '',
                                    borderColor: addUserFields.permissions.usersView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">License and Billing - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.licenseBillingView"
                                  checked={addUserFields.permissions.licenseBillingView}
                                  onChange={handleAddUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: addUserFields.permissions.licenseBillingView ? '#000' : '',
                                    borderColor: addUserFields.permissions.licenseBillingView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Phone & SMS - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.phoneSmsView"
                                  checked={addUserFields.permissions.phoneSmsView}
                                  onChange={handleAddUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: addUserFields.permissions.phoneSmsView ? '#000' : '',
                                    borderColor: addUserFields.permissions.phoneSmsView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">Patient Payment Setup - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.patientPaymentSetupView"
                                  checked={addUserFields.permissions.patientPaymentSetupView}
                                  onChange={handleAddUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: addUserFields.permissions.patientPaymentSetupView ? '#000' : '',
                                    borderColor: addUserFields.permissions.patientPaymentSetupView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="form-check-label small">PMS/EHR - View</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="permissions.pmsEhrView"
                                  checked={addUserFields.permissions.pmsEhrView}
                                  onChange={handleAddUserFieldChange}
                                  style={{
                                    accentColor: '#000',
                                    backgroundColor: addUserFields.permissions.pmsEhrView ? '#000' : '',
                                    borderColor: addUserFields.permissions.pmsEhrView ? '#000' : ''
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-1">
                    <button type="button" className="btn btn-light" onClick={handleCloseAddModal}>Cancel</button>
                    <button type="button" className="btn btn-dark" onClick={handleCreateUser}>Create User</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* User Groups Tab Content */}
      {activeTab === 'userGroups' && (
        <div className="text-center py-5">
          <div className="text-muted">
            <h5>User Groups Management</h5>
            <p>This functionality will be implemented soon.</p>
            <p className="small">Create and manage user groups, assign permissions to groups, and organize users by departments or roles.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;