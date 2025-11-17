import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Constants } from './constant';
// Type for a business row from the DB
interface Business {
  business_id: number;
  organization_id: number;
  business_name: string;
  is_enabled: number;
  is_active: number;
  create_by: number | null;
  create_date: string;
  create_process: number | string | null;
  update_by: number | null;
  update_date: string;
  update_process: number | string | null;
  dba_name?: string;
  address_line_one?: string;
  address_line_two?: string;
  phone_number?: number | string;
  extension?: string;
}
const initialForm = {
  businessName: '',
  website: '',
  country: 'United States of America',
  groupNpiId: '',
  individualNpi: '',
  individualNpis: '',
  taxId: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  ext: '',
  logo: null as File | null,
  agent: 'Billing Assistant',
  eligibilityId: '',
  clearinghouseId: '',
  billingNpi: '',
  taxonomyCode: '',
  dbaName: '',
  addressLineOne: '',
  addressLineTwo: '',
  phoneNumber: '',
  extension: '',
};

const BusinessPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${Constants.API_BASE_URL}/api/businesses`);
        setBusinesses(res.data);
      } catch (err) {
        setError('Failed to fetch businesses');
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter(b =>
    (b.business_name || '').toLowerCase().includes(search.toLowerCase())
  );


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setForm(f => ({ ...f, [name]: file }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const [editId, setEditId] = useState<number | null>(null);

  const handleOpenModal = () => {
    setForm(initialForm);
    setEditId(null);
    setShowModal(true);
  };

  const handleEdit = (business: Business) => {
    setForm({
      businessName: business.business_name,
      website: '',
      country: 'United States of America',
      groupNpiId: '',
      individualNpi: '',
      individualNpis: '',
      taxId: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      ext: '',
      logo: null,
      agent: 'Billing Assistant',
      eligibilityId: '',
      clearinghouseId: '',
      billingNpi: '',
      taxonomyCode: '',
      dbaName: business.dba_name || '',
      addressLineOne: business.address_line_one || '',
      addressLineTwo: business.address_line_two || '',
      phoneNumber: business.phone_number ? String(business.phone_number) : '',
      extension: business.extension || '',
    });
    setEditId(business.business_id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Map frontend fields to DB columns
    const dbFields: any = {};
    dbFields.organization_id = 1; // Set as needed or make dynamic
    dbFields.business_name = form.businessName;
    dbFields.is_enabled = 1;
    dbFields.is_active = 1;
    dbFields.create_by = 1;
    dbFields.create_process = 1;
    dbFields.update_by = 1;
    dbFields.update_process = 1;
    dbFields.dba_name = form.dbaName;
    dbFields.address_line_one = form.addressLineOne;
    dbFields.address_line_two = form.addressLineTwo;
    dbFields.phone_number = form.phoneNumber ? parseInt(form.phoneNumber) : null;
    dbFields.extension = form.extension;

    try {
      console.log('💾 Saving business data:', form);
      console.log('🗄️ Mapped database fields:', dbFields);
      let response;
      if (editId) {
        // Update existing business
        response = await axios.put(`${Constants.API_BASE_URL}/api/businesses/${editId}`, dbFields);
        console.log('📝 Update response:', response.data);
      } else {
        // Create new business
        response = await axios.post(`${Constants.API_BASE_URL}/api/businesses`, dbFields);
        console.log('🆕 Create response:', response.data);
      }
      setShowModal(false);
      setEditId(null);
      // Small delay to ensure DB processes update
      await new Promise(resolve => setTimeout(resolve, 100));
      // Refresh businesses
      const res = await axios.get(`${Constants.API_BASE_URL}/api/businesses?_t=${Date.now()}`);
      setBusinesses(res.data);
    } catch (err: any) {
      console.error('Error saving business:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      console.error('Request config:', err.config);
      console.error('Full error object:', err);
      // Log the exact data being sent
      console.error('Data sent to API:', dbFields);
      let errorMessage = 'Failed to save business';
      if (err.response) {
        const serverError = err.response?.data?.error || err.response?.data?.message || err.response?.data;
        errorMessage = `Server Error (${err.response.status}): ${typeof serverError === 'string' ? serverError : JSON.stringify(serverError)}`;
        if (err.response.status === 500) {
          if (typeof serverError === 'string' && serverError.includes('ER_')) {
            errorMessage += ' - Database Error. Check if all required fields are provided and field names match the database schema.';
          }
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Check if backend is running.';
      } else {
        errorMessage = `Request Error: ${err.message}`;
      }
      alert(errorMessage);
      // Fallback: Store business locally if backend fails
      if (err.response?.status === 500 || !err.response) {
        console.warn('Backend failed, storing business locally as fallback');
        const localBusinesses = JSON.parse(localStorage.getItem('localBusinesses') || '[]');
        if (editId) {
          // Update local business
          const idx = localBusinesses.findIndex((b: any) => b.business_id === editId);
          if (idx !== -1) {
            localBusinesses[idx] = {
              ...localBusinesses[idx],
              business_name: form.businessName,
              update_by: 1,
              update_process: 1,
              update_date: new Date().toISOString(),
            };
            localStorage.setItem('localBusinesses', JSON.stringify(localBusinesses));
            setBusinesses(localBusinesses);
          }
        } else {
          // Create new local business
          const maxId = Math.max(...localBusinesses.map((b: any) => b.business_id || 0), 0);
          const nextId = maxId + 1;
          const newBusiness = {
            business_id: nextId,
            business_name: form.businessName,
            organization_id: 1,
            is_enabled: 1,
            is_active: 1,
            create_by: 1,
            create_process: 1,
            update_by: 1,
            update_process: 1,
            create_date: new Date().toISOString(),
            update_date: new Date().toISOString(),
          };
          localBusinesses.push(newBusiness);
          localStorage.setItem('localBusinesses', JSON.stringify(localBusinesses));
          setBusinesses([...businesses, newBusiness]);
        }
        setShowModal(false);
        setEditId(null);
      }
    }
  };

  return (
    <div className="container-fluid">
      {/* Loader Overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255,255,255,0.7)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="spinner-border text-primary" role="status" style={{ width: 60, height: 60 }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className='mb-4'>
        <h5 className="fw-semibold text-dark mb-1">Enterprise Optical Group - Businesses</h5>
        <p className="text-muted mb-0" style={{ fontSize: '.9rem' }}>
          Manage businesses under this organization/business group
        </p>
      </div>
      <div className="card p-4" style={{ borderRadius: '0.75rem', borderColor: '#300d2126' }}>
        <div className='mb-3'>
          <h6 className="fw-semibold mb-1" style={{ color: '#300d21' }}>Business Records</h6>
          <p className="text-muted small mb-0">
            Manage businesses and configure settings for each business
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 16 }}>
          <input
            type="text"
            placeholder="Search by business name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '.85rem' }}
          />
          <button
          className='px-3 py-2'
            style={{ background: '#b80e74', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 500, fontSize: '.85rem', cursor: 'pointer' }}
            onClick={handleOpenModal}
          >
            Add New Business
          </button>
          {/* Modal for Add New Business */}
          {showModal && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
              <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '72rem' }}>
                <div className="modal-content" style={{ borderRadius: '1rem', border: 'none', position: 'relative',    backgroundColor: '#f6f6f1' }}>
                  <div className="modal-header border-0 pb-0" style={{ alignItems: 'flex-start' }}>
                    <div className='mb-2'>
                      <h5 className="modal-title text-dark fw-semibold" style={{ fontSize: '1rem' }}>Add New Business</h5>
                      <div className="text-muted" style={{ fontSize: '.85rem', marginTop: 2 }}>Configure business information and agent-specific settings</div>
                    </div>
                    <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                  </div>
                  <form className="modal-body" style={{height: '42rem', overflowY: 'auto', fontSize: '.85rem', color: '#300d21' }} onSubmit={handleSubmit}>                                    
                      <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '1px solid #300d2126' }}>
                        <div style={{ fontWeight: 600, fontSize: '.95rem', marginBottom: 2 }}>Business Information</div>
                        <div className='text-muted' style={{ fontSize: '.85rem', marginBottom: 18 }}>Business details for healthcare operations</div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 12, }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>Business Name</label><br />
                            <input className="form-control" name="businessName" value={form.businessName} onChange={handleInputChange} placeholder="Enter business name" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, marginBottom: 0, fontSize: '1rem' }} required />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>Doing Business As</label><br />
                            <input className="form-control" name="dbaName" value={form.dbaName} onChange={handleInputChange} placeholder="Enter DBA name" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>Website</label><br />
                            <input className="form-control" name="website" value={form.website} onChange={handleInputChange} placeholder="https://example.com" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ fontWeight: 500 }}>Address Line 1</label><br />
                            <input className="form-control" name="addressLineOne" value={form.addressLineOne} onChange={handleInputChange} placeholder="Street address" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ fontWeight: 500 }}>Address Line 2</label><br />
                            <input className="form-control" name="addressLineTwo" value={form.addressLineTwo} onChange={handleInputChange} placeholder="Apartment, suite, unit, etc. (optional)" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                        </div>
                         <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>City</label><br />
                            <input className="form-control" name="city" value={form.city} onChange={handleInputChange} placeholder="City" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>State</label><br />
                            <input className="form-control" name="state" value={form.state} onChange={handleInputChange} placeholder="Enter state" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>Zip Code</label><br />
                            <input className="form-control" name="zip" value={form.zip} onChange={handleInputChange} placeholder="XXXXX" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>Country</label><br />
                            <div className="dropdown" style={{ width: '100%' }}>
                              <button className="btn btn-light dropdown-toggle w-100 text-start" type="button" id="countryDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{ padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '.95rem' }}>
                                {form.country || 'Select Country'}
                              </button>
                              <ul className="dropdown-menu w-100" aria-labelledby="countryDropdown" style={{ maxHeight: 200, overflowY: 'auto' }}>
                                {['United States of America', 'Canada', 'United Kingdom', 'India', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Brazil', 'Mexico', 'Japan', 'China', 'South Africa'].map((country) => (
                                  <li key={country}>
                                    <button className="dropdown-item" type="button" onClick={() => setForm(f => ({ ...f, country }))}>
                                      {country}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 12, borderBottom: '1px solid #300d2126', paddingBottom: '1.2rem' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>Phone Number</label><br />
                            <input className="form-control" name="phoneNumber" value={form.phoneNumber} onChange={handleInputChange} placeholder="Enter phone number" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>Extension</label><br />
                            <input className="form-control" name="extension" value={form.extension} onChange={handleInputChange} placeholder="Extension" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{fontSize: '.85rem'}}>
                            Business Identifiers
                          </div>
                          <div className='text-muted' style={{ fontSize: '.75rem', marginBottom: 18 }}>
                            Enter identifiers here if they are the same for all locations under this business. If identifiers vary by location, configure them at the location level instead.
                          </div>                        
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>Group NPI ID <span title="Group National Provider Identifier">&#9432;</span></label><br />
                            <input className="form-control" name="groupNpiId" value={form.groupNpiId} onChange={handleInputChange} placeholder="Enter Group NPI ID" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>Individual NPI <span title="Individual National Provider Identifier">&#9432;</span></label><br />
                            <input className="form-control" name="individualNpi" value={form.individualNpi} onChange={handleInputChange} placeholder="Enter Individual NPI" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>Individual NPIS <span title="Multiple Individual NPIs, comma separated">&#9432;</span></label><br />
                            <input className="form-control" name="individualNpis" value={form.individualNpis} onChange={handleInputChange} placeholder="Enter Individual NPIS" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>Tax Id</label><br />
                            <input className="form-control" name="taxId" value={form.taxId} onChange={handleInputChange} placeholder="XX-XXXXXXXX" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ccc', marginTop: 2, fontSize: '1rem' }} />
                          </div>
                        </div>                                              
                        <div style={{ marginBottom: 18 }}>
                          <label style={{ fontWeight: 500 }}>Logo</label><br />
                          <input className="form-control"
                            name="logo"
                            type="file"
                            accept="image/png,image/jpeg,image/svg+xml"
                            onChange={handleInputChange}
                            style={{ marginTop: 2, marginBottom: 2, maxWidth: '100%' }}
                          />
                          <div className='text-muted' style={{ fontSize: '0.8rem', marginTop: 2 }}>
                            Upload your organization logo (PNG, JPG, or SVG)
                          </div>
                        </div>  
                      </div>
                  </form>
                  <div className="modal-footer border-0 pt-0" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid #f3f1ea', paddingTop: 18, marginTop: 24 }}>
                    <button type="button" className="btn btn-light" onClick={handleCloseModal}>Cancel</button>
                    <button type="button" className="btn btn-dark" style={{ background: '#c8007f', border: 'none' }} onClick={handleSubmit}>Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ marginBottom: 12, color: '#666', fontSize: '0.85rem' }}>
          {loading ? 'Loading businesses...' : `Showing ${filteredBusinesses.length} of ${businesses.length} businesses`}
          {error && <span style={{ color: 'red', marginLeft: 12 }}>{error}</span>}
        </div>
        <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '.5rem', fontSize: '.85rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f0e9e9' }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: '#300d21' }}>Business Name</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: '#300d21' }}>Locations</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: '#300d21' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600, color: '#300d21' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((b) => (
                <tr key={b.business_id} style={{ borderBottom: '1px solid #f0e9e9' }}>
                  <td style={{ padding: '12px 8px', color: '#300d21', fontWeight: 500 }}>{b.business_name}</td>
                  <td style={{ padding: '12px 8px', color: '#300d21' }}>-</td>
                  <td style={{ padding: '12px 8px' }}>
                    {b.is_active ? (
                      <span className='px-2 py-1' style={{ background: '#c8007f', color: '#fff', borderRadius: '.5rem', fontWeight: 600, fontSize: '0.85rem' }}>Active</span>
                    ) : (
                      <span className='px-2 py-1' style={{ background: '#f3f1ea', color: '#7a6c6c', borderRadius: '.5rem', fontWeight: 600, fontSize: '0.85rem' }}>Inactive</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <button
                      style={{ background: '#f6f6f1', color: '#300d21', border: '1px solid #300d2126', borderRadius: '8px', padding: '6px 18px', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
                      onClick={() => handleEdit(b)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
