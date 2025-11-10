import axios from 'axios';
import React, { useState } from 'react';
import { Constants } from './constant';

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  status: 'Active' | 'Inactive';
  city: string;
  state: string;
  zip: string;
  businessId?: number;
  timeZone?: string;
  isDefault?: number;
  isEnabled?: number;
  // Legacy fields for compatibility
  locationHours?: string;
  customGreeting?: string;
  templatePreferences?: string;
  departmentSpecialty?: string;
  pmsSystem?: string;
  facilityId?: string;
  connectionString?: string;
  eligibilityId?: string;
  billingNpi?: string;
  clearinghouseId?: string;
  portalUrl?: string;
  portalContact?: string;
  senderName?: string;
  smsPhone?: string;
}

const LocationsManagement: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Debug: Log locations whenever they change
  React.useEffect(() => {
    console.log('🏢 Current locations state updated:', locations);
    console.log('📊 Total locations:', locations.length);
    locations.forEach((loc, index) => {
      const localLocationIds = JSON.parse(localStorage.getItem('localLocationIds') || '[]');
      console.log(`  ${index + 1}. ID: ${loc.id} | Name: ${loc.name} | Status: ${loc.status} | Type: ${localLocationIds.includes(loc.id) ? 'Local' : 'Database'}`);
    });
  }, [locations]);

  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get locally stored locations
        let localLocations = JSON.parse(localStorage.getItem('localLocations') || '[]');
        
        // Ensure we have localLocationIds tracking - if not, initialize it from existing local locations
        let localLocationIds = JSON.parse(localStorage.getItem('localLocationIds') || '[]');
        if (localLocationIds.length === 0 && localLocations.length > 0) {
          localLocationIds = localLocations.map((loc: any) => loc.id);
          localStorage.setItem('localLocationIds', JSON.stringify(localLocationIds));
          console.log('🔧 Initialized localLocationIds from existing local locations:', localLocationIds);
        }
        
        try {
          // Try to fetch from backend with cache busting
          const response = await axios.get(`${Constants.API_BASE_URL}/api/locations?_t=${Date.now()}`);
          const dbLocations = response.data.map((loc: any) => {
            // Convert to number to ensure proper comparison
            const isActiveValue = Number(loc.IS_ACTIVE);
            const status = (isActiveValue === 1) ? 'Active' : 'Inactive';
            console.log(`📍 Initial load - Location "${loc.LOCATION_NAME}": IS_ACTIVE=${loc.IS_ACTIVE} (type: ${typeof loc.IS_ACTIVE}), converted: ${isActiveValue}, IS_ENABLED=${loc.IS_ENABLED}, Status="${status}"`);
            
            return {
              id: loc.id || loc.LOCATION_ID,
              name: loc.name || loc.LOCATION_NAME,
              address: loc.address || '',
              phone: loc.phone || '',
              status: status,
              city: loc.city || '',
              state: loc.state || '',
              zip: loc.zip || '',
              businessId: loc.BUSINESS_ID || 1,
              timeZone: loc.TIME_ZONE || 'UTC',
              isDefault: loc.IS_DEFAULT || 0,
              isEnabled: loc.IS_ENABLED || 1,
              pmsSystem: '',
              facilityId: '',
              connectionString: '',
              eligibilityId: '',
              billingNpi: '',
              clearinghouseId: '',
              portalUrl: '',
              portalContact: '',
              senderName: '',
              smsPhone: '',
              locationHours: '',
              customGreeting: '',
              templatePreferences: '',
              departmentSpecialty: '',
            };
          });
          
          // Migration: Fix any existing timestamp-based IDs in local locations
          let migratedLocalLocations = localLocations;
          let needsMigration = localLocations.some((loc: any) => loc.id > 1000000000000);
          
          if (needsMigration) {
            console.log('🔄 Migrating existing timestamp IDs to sequential IDs...');
            
            const maxDatabaseId = Math.max(...dbLocations.map((loc: Location) => loc.id), 0);
            let nextAvailableId = maxDatabaseId + 1;
            
            migratedLocalLocations = localLocations.map((loc: any) => {
              if (loc.id > 1000000000000) {
                const newId = nextAvailableId++;
                console.log(`🔄 Migrating location "${loc.name}" from ID ${loc.id} to ${newId}`);
                return { ...loc, id: newId };
              }
              return loc;
            });
            
            // Update localStorage with migrated data
            localStorage.setItem('localLocations', JSON.stringify(migratedLocalLocations));
            
            // Update the tracking array with new IDs
            const newLocalLocationIds = migratedLocalLocations.map((loc: any) => loc.id);
            localStorage.setItem('localLocationIds', JSON.stringify(newLocalLocationIds));
            
            console.log('✅ Migration complete. New local locations:', migratedLocalLocations);
          }

          // Combine backend and migrated local locations
          const combinedLocations = [...dbLocations, ...migratedLocalLocations];
          console.log('🏢 Database locations:', dbLocations);
          console.log('💾 Local locations (after migration):', migratedLocalLocations);
          console.log('🔄 Combined locations:', combinedLocations);
          setLocations(combinedLocations);
        } catch (apiErr) {
          // If backend fails, use only local locations
          console.log('Backend not available, using local locations only');
          console.log('💾 Local locations only:', localLocations);
          setLocations(localLocations);
        }
      } catch (err: any) {
        setError('Failed to fetch locations');
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = locations.filter(location => {
    return location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           location.address.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Debug: Log filtered locations
  React.useEffect(() => {
    console.log('🔍 Filtered locations (search term: "' + searchTerm + '"):', filteredLocations);
  }, [filteredLocations, searchTerm]);

  const [showModal, setShowModal] = useState(false);
  const [modalFields, setModalFields] = useState({
  locationHours: '',
  customGreeting: '',
  templatePreferences: '',
  departmentSpecialty: '',
    name: '',
    phone: '',
    address: '',
    status: 'Active',
    timeZone: 'UTC',
    businessId: 1,
    isDefault: 0,
    isEnabled: 1,
    pmsSystem: '',
    facilityId: '',
    connectionString: '',
    eligibilityId: '',
    billingNpi: '',
    clearinghouseId: '',
    portalUrl: '',
    portalContact: '',
    senderName: '',
    smsPhone: '',
    city: '',
    state: '',
    zip: '',
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

  // Force refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setModalFields(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
  };

  const openAddModal = () => {
    setModalFields({
      locationHours: '',
      customGreeting: '',
      templatePreferences: '',
      departmentSpecialty: '',
      name: '',
      phone: '',
      address: '',
      status: 'Active',
      timeZone: 'UTC',
      businessId: 1,
      isDefault: 0,
      isEnabled: 1,
      pmsSystem: '',
      facilityId: '',
      connectionString: '',
      eligibilityId: '',
      billingNpi: '',
      clearinghouseId: '',
      portalUrl: '',
      portalContact: '',
      senderName: '',
      smsPhone: '',
      city: '',
      state: '',
      zip: '',
    });
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (location: Location) => {
    console.log('📝 Opening edit modal for location:', location);
    console.log('🔢 Location ID:', location.id, 'Type:', typeof location.id);
    const localLocationIds = JSON.parse(localStorage.getItem('localLocationIds') || '[]');
    console.log('🏠 Is Local Location:', localLocationIds.includes(location.id));
    
    setModalFields({
      city: location.city || '',
      state: location.state || '',
      zip: location.zip || '',
      name: location.name || '',
      phone: location.phone || '',
      address: location.address || '',
      status: location.status || 'Active',
      timeZone: location.timeZone || 'UTC',
      businessId: location.businessId || 1,
      isDefault: location.isDefault || 0,
      isEnabled: location.isEnabled || 1,
      pmsSystem: location.pmsSystem || '',
      facilityId: location.facilityId || '',
      connectionString: location.connectionString || '',
      eligibilityId: location.eligibilityId || '',
      billingNpi: location.billingNpi || '',
      clearinghouseId: location.clearinghouseId || '',
      portalUrl: location.portalUrl || '',
      portalContact: location.portalContact || '',
      senderName: location.senderName || '',
      smsPhone: location.smsPhone || '',
      locationHours: location.locationHours || '',
      customGreeting: location.customGreeting || '',
      templatePreferences: location.templatePreferences || '',
      departmentSpecialty: location.departmentSpecialty || '',
    });
    setEditId(location.id);
    setShowModal(true);
  };

  const handleSaveLocation = async () => {
    // Map frontend fields to database field names based on actual table structure
    const dbFields: any = {};
    
    // Required fields using correct column names
    if (modalFields.name) dbFields.LOCATION_NAME = modalFields.name;
    
    // Core location fields
    dbFields.BUSINESS_ID = 1; // Default business ID
    dbFields.IS_DEFAULT = 0; // Default not default location
    dbFields.TIME_ZONE = modalFields.timeZone || 'UTC';
    dbFields.IS_ENABLED = 1; // Default enabled
    dbFields.IS_ACTIVE = modalFields.status === 'Active' ? 1 : 0;
    
    // Optional legacy fields for future compatibility
    if (modalFields.phone) dbFields.phone = modalFields.phone;
    if (modalFields.address) dbFields.address = modalFields.address;
    if (modalFields.city) dbFields.city = modalFields.city;
    if (modalFields.state) dbFields.state = modalFields.state;
    if (modalFields.zip) dbFields.zip = modalFields.zip;
    
    try {
      console.log('💾 Saving location data:', modalFields);
      console.log('📝 Edit ID:', editId);
      console.log('🗄️ Mapped database fields:', dbFields);
      console.log('🎯 Status mapping: modalFields.status =', modalFields.status, '→ IS_ACTIVE =', dbFields.IS_ACTIVE);
      
      if (editId) {
        // Check if this is a local location by checking localStorage tracking
        const localLocationIds = JSON.parse(localStorage.getItem('localLocationIds') || '[]');
        const isLocalLocation = localLocationIds.includes(editId);
        
        if (isLocalLocation) {
          console.log('Updating local location, converting to database location');
          // This is a local location - convert to database creation
          const response = await axios.post(`${Constants.API_BASE_URL}/api/locations`, dbFields);
          console.log('Create response (from local):', response.data);
          
          // Remove from local storage since it's now in database
          const localLocations = JSON.parse(localStorage.getItem('localLocations') || '[]');
          const updatedLocalLocations = localLocations.filter((loc: any) => loc.id !== editId);
          localStorage.setItem('localLocations', JSON.stringify(updatedLocalLocations));
          
          // Remove from local location IDs tracking
          const localLocationIds = JSON.parse(localStorage.getItem('localLocationIds') || '[]');
          const updatedLocalLocationIds = localLocationIds.filter((id: number) => id !== editId);
          localStorage.setItem('localLocationIds', JSON.stringify(updatedLocalLocationIds));
          
          setSuccessMessage('Location moved from local storage to live database successfully');
        } else {
          // This is a real database location - update it
          const response = await axios.put(`${Constants.API_BASE_URL}/api/locations/${editId}`, dbFields);
          console.log('Update response:', response.data);
          setSuccessMessage('Location updated successfully on live database');
        }
      } else {
        console.log('🆕 Creating NEW location with fields:', dbFields);
        console.log('🆕 NEW location status check - modalFields.status:', modalFields.status, '→ IS_ACTIVE:', dbFields.IS_ACTIVE);
        const response = await axios.post(`${Constants.API_BASE_URL}/api/locations`, dbFields);
        console.log('🆕 Create response:', response.data);
        setSuccessMessage('Location saved successfully on live database');
      }
      
      setShowModal(false);
      setEditId(null);
      
      console.log('✅ Save completed successfully, starting auto-refresh...');
      
      // Small delay to ensure database has processed the update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Refresh locations list - combine database and local locations
      setLoading(true);
      
      try {
        // Get database locations with cache busting
        const response = await axios.get(`${Constants.API_BASE_URL}/api/locations?_t=${Date.now()}`);
        console.log('Fetched locations after save:', response.data);
        
        const dbLocations = response.data.map((loc: any) => {
          // Convert to number to ensure proper comparison
          const isActiveValue = Number(loc.IS_ACTIVE);
          const status = (isActiveValue === 1) ? 'Active' : 'Inactive';
          console.log(`📍 Location "${loc.LOCATION_NAME}": IS_ACTIVE=${loc.IS_ACTIVE} (type: ${typeof loc.IS_ACTIVE}), converted: ${isActiveValue}, IS_ENABLED=${loc.IS_ENABLED}, Status="${status}"`);
          
          return {
            id: loc.id || loc.LOCATION_ID,
            name: loc.name || loc.LOCATION_NAME,
            address: loc.address || '',
            phone: loc.phone || '',
            status: status,
            city: loc.city || '',
            state: loc.state || '',
            zip: loc.zip || '',
            businessId: loc.BUSINESS_ID || 1,
            timeZone: loc.TIME_ZONE || 'UTC',
            isDefault: loc.IS_DEFAULT || 0,
            isEnabled: loc.IS_ENABLED || 1,
            pmsSystem: '',
            facilityId: '',
            connectionString: '',
            eligibilityId: '',
            billingNpi: '',
            clearinghouseId: '',
            portalUrl: '',
            portalContact: '',
            senderName: '',
            smsPhone: '',
            locationHours: '',
            customGreeting: '',
            templatePreferences: '',
            departmentSpecialty: '',
          };
        });
        
        // Get any remaining local locations
        const localLocations = JSON.parse(localStorage.getItem('localLocations') || '[]');
        
        // Combine database and local locations
        const combinedLocations = [...dbLocations, ...localLocations];
        console.log('🔄 Refreshed combined locations:', combinedLocations);
        console.log('📊 Database locations count:', dbLocations.length);
        console.log('💾 Local locations count:', localLocations.length);
        console.log('🏢 Total locations count:', combinedLocations.length);
        
        // Log final status values before setting state
        combinedLocations.forEach(loc => {
          console.log(`🎯 Final location "${loc.name}": status="${loc.status}"`);
        });
        
        console.log('🔄 About to update locations state with:', combinedLocations.length, 'locations');
        console.log('🔄 Previous locations state had:', locations.length, 'locations');
        
        // Clear the locations first to force React to re-render
        setLocations([]);
        
        // Use setTimeout to ensure React processes the empty state first
        setTimeout(() => {
          console.log('🔄 Setting new locations state...');
          setLocations(combinedLocations);
          setRefreshTrigger(prev => {
            const newTrigger = prev + 1;
            console.log('🔄 Force re-render trigger:', newTrigger);
            return newTrigger;
          });
        }, 50);
      } catch (refreshErr) {
        console.error('Error refreshing locations after save:', refreshErr);
        // If refresh fails, just get local locations
        const localLocations = JSON.parse(localStorage.getItem('localLocations') || '[]');
        setLocations(localLocations);
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error saving location:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      console.error('Request config:', err.config);
      console.error('Full error object:', err);
      
      // Log the exact data being sent
      console.error('Data sent to API:', dbFields);
      
      let errorMessage = 'Failed to save location';
      
      if (err.response) {
        // Server responded with error status
        const serverError = err.response?.data?.error || err.response?.data?.message || err.response?.data;
        errorMessage = `Server Error (${err.response.status}): ${typeof serverError === 'string' ? serverError : JSON.stringify(serverError)}`;
        
        // Check for specific database errors
        if (err.response.status === 500) {
          if (typeof serverError === 'string' && serverError.includes('ER_')) {
            errorMessage += ' - Database Error. Check if all required fields are provided and field names match the database schema.';
          }
        }
      } else if (err.request) {
        // Request made but no response received
        errorMessage = 'No response from server. Check if backend is running.';
      } else {
        // Something else happened
        errorMessage = `Request Error: ${err.message}`;
      }
      
      setError(errorMessage);
      setLoading(false);
      
      // Fallback: Store location locally if backend fails
      if (err.response?.status === 500 || !err.response) {
        console.warn('Backend failed, storing location locally as fallback');
        
        if (!editId) {
          // New location - save locally with sequential ID
          const maxId = Math.max(...locations.map(loc => loc.id), 0);
          const nextId = maxId + 1;
          console.log('🔢 Generating sequential ID - Max existing ID:', maxId, 'Next ID:', nextId);
          
          const newLocation = {
            id: nextId, // Generate sequential ID
            name: modalFields.name,
            address: modalFields.address || '',
            phone: modalFields.phone || '',
            status: modalFields.status as 'Active' | 'Inactive',
            city: modalFields.city || '',
            state: modalFields.state || '',
            zip: modalFields.zip || '',
            pmsSystem: modalFields.pmsSystem || '',
            facilityId: modalFields.facilityId || '',
            connectionString: modalFields.connectionString || '',
            eligibilityId: modalFields.eligibilityId || '',
            billingNpi: modalFields.billingNpi || '',
            clearinghouseId: modalFields.clearinghouseId || '',
            portalUrl: modalFields.portalUrl || '',
            portalContact: modalFields.portalContact || '',
            senderName: modalFields.senderName || '',
            smsPhone: modalFields.smsPhone || '',
            locationHours: modalFields.locationHours || '',
            customGreeting: modalFields.customGreeting || '',
            templatePreferences: modalFields.templatePreferences || '',
            departmentSpecialty: modalFields.departmentSpecialty || '',
          };
          
          // Add to current locations list
          setLocations(prev => [...prev, newLocation]);
          
          // Store in localStorage for persistence
          const localLocations = JSON.parse(localStorage.getItem('localLocations') || '[]');
          localLocations.push(newLocation);
          localStorage.setItem('localLocations', JSON.stringify(localLocations));
          
          // Track that this ID is a local location
          const localLocationIds = JSON.parse(localStorage.getItem('localLocationIds') || '[]');
          localLocationIds.push(nextId);
          localStorage.setItem('localLocationIds', JSON.stringify(localLocationIds));
          
          setSuccessMessage(`Location "${modalFields.name}" saved locally. Will sync to database when backend is available.`);
        } else {
          // Editing existing location - update locally
          const localLocationIds = JSON.parse(localStorage.getItem('localLocationIds') || '[]');
          const isLocalLocation = localLocationIds.includes(editId);
          
          if (isLocalLocation) {
            // Update local location in localStorage
            const localLocations = JSON.parse(localStorage.getItem('localLocations') || '[]');
            const updatedLocalLocations = localLocations.map((loc: any) => 
              loc.id === editId ? { ...loc, ...modalFields } : loc
            );
            localStorage.setItem('localLocations', JSON.stringify(updatedLocalLocations));
            
            // Update in current state
            setLocations(prev => prev.map(loc => 
              loc.id === editId ? { 
                ...loc, 
                name: modalFields.name,
                address: modalFields.address || '',
                phone: modalFields.phone || '',
                status: modalFields.status as 'Active' | 'Inactive',
                city: modalFields.city || '',
                state: modalFields.state || '',
                zip: modalFields.zip || '',
                pmsSystem: modalFields.pmsSystem || '',
                facilityId: modalFields.facilityId || '',
                connectionString: modalFields.connectionString || '',
                eligibilityId: modalFields.eligibilityId || '',
                billingNpi: modalFields.billingNpi || '',
                clearinghouseId: modalFields.clearinghouseId || '',
                portalUrl: modalFields.portalUrl || '',
                portalContact: modalFields.portalContact || '',
                senderName: modalFields.senderName || '',
                smsPhone: modalFields.smsPhone || '',
                locationHours: modalFields.locationHours || '',
                customGreeting: modalFields.customGreeting || '',
                templatePreferences: modalFields.templatePreferences || '',
                departmentSpecialty: modalFields.departmentSpecialty || '',
              } : loc
            ));
            
            setSuccessMessage(`Location "${modalFields.name}" updated locally. Will sync to database when backend is available.`);
          } else {
            // Database location failed to update - show error
            setSuccessMessage('Failed to update location. Please try again when backend is available.');
          }
        }
        
        setShowModal(false);
        setEditId(null);
        setError(null); // Clear error since we handled it locally
      }
    }
  };

  const openDeleteModal = (location: Location) => {
    setLocationToDelete(location);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setLocationToDelete(null);
  };



  const handleConfirmDelete = async () => {
    if (!locationToDelete) return;

    try {
      console.log('🗑️ Deleting location:', locationToDelete);
      
      // Check if this is a local location
      const localLocationIds = JSON.parse(localStorage.getItem('localLocationIds') || '[]');
      const isLocalLocation = localLocationIds.includes(locationToDelete.id);
      
      if (isLocalLocation) {
        // Delete from local storage
        const localLocations = JSON.parse(localStorage.getItem('localLocations') || '[]');
        const updatedLocalLocations = localLocations.filter((loc: any) => loc.id !== locationToDelete.id);
        localStorage.setItem('localLocations', JSON.stringify(updatedLocalLocations));
        
        // Remove from local location IDs tracking
        const updatedLocalLocationIds = localLocationIds.filter((id: number) => id !== locationToDelete.id);
        localStorage.setItem('localLocationIds', JSON.stringify(updatedLocalLocationIds));
        
        // Update the UI
        setLocations(prev => prev.filter(loc => loc.id !== locationToDelete.id));
        setSuccessMessage(`Location "${locationToDelete.name}" deleted from local storage.`);
      } else {
        // Delete from database
        const response = await axios.delete(`${Constants.API_BASE_URL}/api/locations/${locationToDelete.id}`);
        console.log('✅ Delete response:', response.data);
        
        if (response.data.success) {
          // Update the UI by removing the deleted location
          setLocations(prev => prev.filter(loc => loc.id !== locationToDelete.id));
          setSuccessMessage(`Location "${locationToDelete.name}" deleted successfully from database.`);
        } else {
          throw new Error('Delete operation failed');
        }
      }

      // Close the modal after successful deletion
      handleCloseDeleteModal();
    } catch (err: any) {
      console.error('❌ Error deleting location:', err);
      
      let errorMessage = 'Failed to delete location';
      
      if (err.response) {
        const serverError = err.response?.data?.error || err.response?.data?.message || err.response?.data;
        errorMessage = `Server Error (${err.response.status}): ${typeof serverError === 'string' ? serverError : JSON.stringify(serverError)}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Check if backend is running.';
      } else {
        errorMessage = `Request Error: ${err.message}`;
      }
      
      setError(errorMessage);
      
      // Show error message
      alert(errorMessage);
      
      // Close the modal even on error
      handleCloseDeleteModal();
    }
  };

  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="container-fluid" key={`locations-${refreshTrigger}`}>
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h4 fw-semibold text-dark mb-1">ClearView Eye Associates - Locations Data</h1>
        <p className="text-muted mb-0">Manage location records and configure agent-specific settings</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success" role="alert" style={{ marginBottom: 16 }}>
          {successMessage}
        </div>
      )}

      {/* Location Records Section */}
      <div className="card" style={{ borderRadius: '0.75rem', border: '1px solid #ddd', height: 'calc(100vh - 12rem)' }}>
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
              <button className="btn btn-dark w-100" onClick={openAddModal}>Add New Location</button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3">
            <span className="text-muted small">Showing {filteredLocations.length} of {locations.length} locations</span>
          </div>

          {/* Locations Table */}
          <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 29rem)', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
            <table className="table table-hover mb-0">
            <thead className="table-white" style={{ position: 'sticky', top: '0', zIndex: 10 }}>
              <tr>
                <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>Location Name</th>
                <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>Address</th>

                <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>Phone</th>
                <th className="fw-semibold text-dark" style={{ fontSize: '0.875rem' }}>Status</th>
                <th className="fw-semibold text-dark text-end" style={{ fontSize: '0.875rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.map((location) => (
                <tr key={`${location.id}-${location.status}-${refreshTrigger}`}>
                  <td className="py-3">
                    <span className="text-dark">{location.name}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-dark">{location.address}</span>
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
                    <button 
                      className="btn btn-link text-decoration-none p-1 px-2 me-2" 
                      style={{ color: '#000', fontSize: '0.9rem', border: '1px solid #ddd' }} 
                      onClick={() => openEditModal(location)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-link text-decoration-none p-1 px-2" 
                      style={{ color: '#000', fontSize: '0.9rem', border: '1px solid #ddd' }} 
                      onClick={() => openDeleteModal(location)}
                    >
                      Delete
                    </button>
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
    {/* Add New Location Modal */}
    {showModal && (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: '0.75rem', border: 'none', height: '49rem', width: '30rem' }}>
            <div className="modal-header border-0 pb-0">
              <div>
              <h6 className="modal-title text-dark">
                {editId ? `Edit Location - ${modalFields.name}` : 'Add New Location'}
              </h6>
              <p className="text-muted small mb-1">Configure location information and agent-specific settings</p>     
              </div>      
              <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto', padding: '1.5rem' }}>
              {/* Location Information Section */}
              <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                <h6 className="fw-medium mb-3 text-dark">Location Information</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small text-dark">Location Name</label>
                    <input type="text" className="form-control" name="name" value={modalFields.name} onChange={handleModalChange} placeholder="Enter location name"  style={{ backgroundColor: '#ebebeb', border: '0',}} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-dark">Phone Number</label>
                    <input type="text" className="form-control" name="phone" value={modalFields.phone} onChange={handleModalChange} placeholder="(XXX) XXX-XXXX" style={{ backgroundColor: '#ebebeb', border: '0',}} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small text-dark">Address</label>
                    <input type="text" className="form-control" name="address" value={modalFields.address} onChange={handleModalChange} placeholder="Street address" style={{ backgroundColor: '#ebebeb', border: '0',}} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-dark">City</label>
                    <input type="text" className="form-control" name="city" value={modalFields.city || ''} onChange={handleModalChange} placeholder="City"  style={{ backgroundColor: '#ebebeb', border: '0',}}/>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-dark">State</label>
                    <input type="text" className="form-control" name="state" value={modalFields.state || ''} onChange={handleModalChange} placeholder="State"  style={{ backgroundColor: '#ebebeb', border: '0',}}/>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-dark">ZIP Code</label>
                    <input type="text" className="form-control" name="zip" value={modalFields.zip || ''} onChange={handleModalChange} placeholder="ZIP"   style={{ backgroundColor: '#ebebeb', border: '0',}}/>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small text-dark">Status</label>
                    <select className="form-select" name="status" value={modalFields.status} onChange={handleModalChange}  style={{ backgroundColor: '#ebebeb', border: '0',}}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Agent-Specific Configuration Section */}
              <div className="mb-4">
                <h6 className="fw-medium mb-3 text-dark">Agent-Specific Configuration</h6>
                <p className="text-muted mb-2 small">Configure location-specific settings for each AI agent</p>
              
                {/* PMS/EHR Integration */}
                <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                  <h6 className="fw-medium mb-2 text-dark">PMS/EHR Integration</h6>
                  <p className="text-muted small mb-3">Configure practice management system for this location</p>
                  <div className="row g-3 p-2">
                    <div className="col-md-12 p-0">
                      <label className="form-label small fw-medium text-dark">PMS/EHR System</label>
                      <select className="form-select" name="pmsSystem" value={modalFields.pmsSystem} onChange={handleModalChange} style={{ backgroundColor: '#ebebeb', border: '0' }}>
                        <option value="">Use global configuration or select system</option>
                        <option value="System A">System A</option>
                        <option value="System B">System B</option>
                      </select>
                    </div>
                    <p className="text-muted small mb-0">Override global PMS/EHR settings for this location if needed</p>
                    <div className="mb-0 p-3 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                      <label className="form-label text-dark small">Location-specific credentials (if different from global)</label>
                      <div className="col-md-12">
                        <label className="form-label small text-dark fw-medium">Location/Facility ID</label>
                        <input type="text" className="form-control" name="facilityId" value={modalFields.facilityId} onChange={handleModalChange} placeholder="Location identifier in PMS" style={{ backgroundColor: '#ebebeb', border: '0' }}/>
                      </div>
                      <div className="col-md-12">
                        <label className="form-label small text-dark fw-medium">Connection String/URL (RPA systems)</label>
                        <input type="text" className="form-control" name="connectionString" value={modalFields.connectionString} onChange={handleModalChange} placeholder="https://..." style={{ backgroundColor: '#ebebeb', border: '0' }}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Virtual Assistant Section */}
              <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                <h6 className="fw-medium mb-3 text-dark">Virtual Assistant</h6>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label small text-dark fw-medium">Location Hours</label>
                    <input type="text" className="form-control" name="locationHours" value={modalFields.locationHours} onChange={handleModalChange} placeholder="e.g., Monday-Friday 8:00 AM - 5:00 PM" style={{ backgroundColor: '#ebebeb', border: '0' }}/>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small text-dark fw-medium">Custom Greeting</label>
                    <input type="text" className="form-control" name="customGreeting" value={modalFields.customGreeting} onChange={handleModalChange} placeholder="Custom greeting for this location" style={{ backgroundColor: '#ebebeb', border: '0' }}/>
                  </div>
                </div>
              </div>
              
              {/* Scribe Section */}
              <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                <h6 className="fw-medium mb-3 text-dark">Scribe</h6>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label small text-dark fw-medium">Template Preferences</label>
                    <input type="text" className="form-control" name="templatePreferences" value={modalFields.templatePreferences} onChange={handleModalChange} placeholder="Select preferred templates" style={{ backgroundColor: '#ebebeb', border: '0' }}/>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small text-dark fw-medium">Department/Specialty</label>
                    <input type="text" className="form-control" name="departmentSpecialty" value={modalFields.departmentSpecialty} onChange={handleModalChange} placeholder="e.g., Cardiology, Primary Care" style={{ backgroundColor: '#ebebeb', border: '0' }}/>
                  </div>
                </div>
              </div>
              {/* Billing Assistant Section */}
              <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                <h6 className="fw-medium mb-3 text-dark">Billing Assistant</h6>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label small text-dark fw-medium">Eligibility ID</label>
                    <input type="text" className="form-control" name="eligibilityId" value={modalFields.eligibilityId} onChange={handleModalChange} placeholder="Enter location-specific eligibility ID" style={{ backgroundColor: '#ebebeb', border: '0' }}/>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small text-dark fw-medium">Billing NPI (Location)</label>
                    <input type="text" className="form-control" name="billingNpi" value={modalFields.billingNpi} onChange={handleModalChange} placeholder="Enter location billing NPI" style={{ backgroundColor: '#ebebeb', border: '0' }}/>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small text-dark fw-medium">Clearinghouse ID</label>
                    <input type="text" className="form-control" name="clearinghouseId" value={modalFields.clearinghouseId} onChange={handleModalChange} placeholder="Enter clearinghouse ID for this location" style={{ backgroundColor: '#ebebeb', border: '0' }}/>
                  </div>
                </div>
              </div>
              {/* Patient Portal Section */}
              <div className="mb-4 p-3 border rounded" style={{ background: '#fff' }}>
                <h6 className="fw-medium mb-3 text-dark">Patient Portal</h6>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label small text-dark fw-medium">Location-Specific Portal URL</label>
                    <input type="text" className="form-control" name="portalUrl" value={modalFields.portalUrl} onChange={handleModalChange} placeholder="https://location.portal.example.com" style={{ backgroundColor: '#ebebeb', border: '0' }} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small text-dark fw-medium">Location Support Contact</label>
                    <input type="text" className="form-control" name="portalContact" value={modalFields.portalContact} onChange={handleModalChange} placeholder="location-support@example.com" style={{ backgroundColor: '#ebebeb', border: '0' }} />
                  </div>
                </div>
              </div>
              {/* Patient Engagement Section */}
              <div className="mb-0 p-3 border rounded" style={{ background: '#fff' }}>
                <h6 className="fw-medium mb-3 text-dark">Patient Engagement</h6>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label small text-dark fw-medium">Location Sender Name</label>
                    <input type="text" className="form-control" name="senderName" value={modalFields.senderName} onChange={handleModalChange} placeholder="Location name for campaigns" style={{ backgroundColor: '#ebebeb', border: '0' }} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small text-dark fw-medium">SMS Phone Number</label>
                    <input type="text" className="form-control" name="smsPhone" value={modalFields.smsPhone} onChange={handleModalChange} placeholder="(XXX) XXX-XXXX" style={{ backgroundColor: '#ebebeb', border: '0' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-1">
              <button type="button" className="btn btn-light" onClick={handleCloseModal}>Cancel</button>
              <button type="button" className="btn btn-dark" onClick={handleSaveLocation}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Delete Confirmation Modal */}
    {showDeleteModal && (
      <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: '0.75rem', border: 'none' }}>
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title text-dark fw-bold">Confirm Delete</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseDeleteModal}
                style={{ backgroundColor: 'transparent', border: 'none' }}
              ></button>
            </div>
            <div className="modal-body pt-2">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                </div>
                <h6 className="text-dark mb-3">Are you sure you want to delete this location?</h6>
                <div className="alert alert-light border" style={{ backgroundColor: '#f8f9fa' }}>
                  <strong>Location Name:</strong> {locationToDelete?.name}<br />
                  <small className="text-muted">This action cannot be undone.</small>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-light me-2"
                onClick={handleCloseDeleteModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                <i className="fas fa-trash me-2"></i>
                Delete Location
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default LocationsManagement;