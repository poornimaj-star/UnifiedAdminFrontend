import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  onLoginSuccess?: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignup, onLoginSuccess }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
    
    // Simulate successful login (replace with actual authentication)
    if (formData.email && formData.password) {
      // Call the success callback to navigate to admin dashboard
      onLoginSuccess?.();
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log('Forgot password clicked');
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '0.75rem' }}>
          <div className="modal-header border-0 text-center flex-column pb-0">
            <button 
              type="button" 
              className="btn-close position-absolute top-0 end-0 mt-3 me-3" 
              onClick={onClose}
              style={{ fontSize: '1.2rem' }}
            ></button>
            <h2 className="modal-title fs-2 fw-semibold mb-2" style={{ 
              background: 'linear-gradient(135deg, #e91e63, #ad1457)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome Back
            </h2>
            <p className="text-muted mb-0">Sign in to your EVAA AI portal</p>
          </div>

          <div className="modal-body px-4 pb-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-medium">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 py-2 fw-semibold mt-3">
                Sign In
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link text-primary p-0 text-decoration-underline"
                  onClick={handleForgotPassword}
                >
                  Forgot your password?
                </button>
              </div>
            </form>

            <div className="text-center mt-4 pt-3 border-top">
              <p className="text-muted small mb-2">New to EVAA AI?</p>
              <button
                type="button"
                className="btn btn-link text-primary fw-semibold text-decoration-underline p-0"
                onClick={onSwitchToSignup}
              >
                Create New Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;