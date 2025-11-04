import React from 'react';

const PatientPaymentProcessing: React.FC = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="h4 fw-semibold text-dark mb-4">Patient Payment Processing</h1>
          
          {/* Payment Methods Section */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Payment Methods</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card border-primary">
                    <div className="card-body text-center">
                      <div className="h2 text-primary mb-2">💳</div>
                      <h6 className="card-title">Credit Cards</h6>
                      <p className="card-text text-muted">Visa, Mastercard, AMEX</p>
                      <button className="btn btn-outline-primary btn-sm">Configure</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-success">
                    <div className="card-body text-center">
                      <div className="h2 text-success mb-2">🏦</div>
                      <h6 className="card-title">ACH/Bank Transfer</h6>
                      <p className="card-text text-muted">Direct bank payments</p>
                      <button className="btn btn-outline-success btn-sm">Configure</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-info">
                    <div className="card-body text-center">
                      <div className="h2 text-info mb-2">📱</div>
                      <h6 className="card-title">Digital Wallets</h6>
                      <p className="card-text text-muted">Apple Pay, Google Pay</p>
                      <button className="btn btn-outline-info btn-sm">Configure</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Payment Settings</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Payment Gateway</label>
                    <select className="form-select">
                      <option>Stripe</option>
                      <option>Square</option>
                      <option>PayPal</option>
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Currency</label>
                    <select className="form-select">
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Processing Fee (%)</label>
                    <input type="number" className="form-control" placeholder="2.9" />
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="autoCapture" />
                    <label className="form-check-label" htmlFor="autoCapture">
                      Auto-capture payments
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <button className="btn btn-primary me-2">Save Settings</button>
                <button className="btn btn-outline-secondary">Test Connection</button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent Transactions</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Patient</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#TXN001</td>
                      <td>John Doe</td>
                      <td>$125.00</td>
                      <td>Credit Card</td>
                      <td><span className="badge bg-success">Completed</span></td>
                      <td>2024-10-30</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">View</button>
                        <button className="btn btn-sm btn-outline-secondary">Refund</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#TXN002</td>
                      <td>Jane Smith</td>
                      <td>$89.50</td>
                      <td>ACH</td>
                      <td><span className="badge bg-warning">Pending</span></td>
                      <td>2024-10-30</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">View</button>
                        <button className="btn btn-sm btn-outline-secondary">Cancel</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#TXN003</td>
                      <td>Robert Johnson</td>
                      <td>$200.00</td>
                      <td>Apple Pay</td>
                      <td><span className="badge bg-success">Completed</span></td>
                      <td>2024-10-29</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">View</button>
                        <button className="btn btn-sm btn-outline-secondary">Refund</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPaymentProcessing;