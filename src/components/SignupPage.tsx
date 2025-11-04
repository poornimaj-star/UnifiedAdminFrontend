import React, { useState } from 'react';

interface SignupPageProps {
  onBackToHome: () => void;
  onSwitchToLogin: () => void; // Opens login modal
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const SignupPage: React.FC<SignupPageProps> = ({ onBackToHome, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle next step - Business Details
    console.log('User Information:', formData);
    // Here you would typically navigate to the next step or make API call
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Header */}
      <header className="py-3" style={{ background: 'linear-gradient(135deg, #4a1a3d, #6b2758)' }}>
        <div className="container">
          <nav className="d-flex justify-content-end gap-3">
            <button 
              className="btn btn-outline-light"
              onClick={onSwitchToLogin}
            >
              Login
            </button>
            <button className="btn btn-light text-primary fw-semibold">
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="card border shadow-sm" style={{ borderRadius: '1rem' }}>
            {/* Header Section */}
            <div className="card-header">
              <h1>Create Your EVAA Account</h1>
              <p>Let's start by setting up your profile.</p>
            </div>

            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <h2>User Information</h2>
                <p>Please provide your personal details to get started</p>
              </div>

              <form onSubmit={handleNext} className="signup-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      First Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="asfsaf"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">
                      Last Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="asfasfd"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="asdf@click5.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number (optional)"
                  />
                  <p className="field-note">
                    We'll use this to contact you about your account if needed
                  </p>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="back-button"
                    onClick={onBackToHome}
                  >
                    Back to Home
                  </button>
                  <button type="submit" className="next-button">
                    Next: Business Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;