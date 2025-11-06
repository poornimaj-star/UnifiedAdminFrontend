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
          <div className="card-custom">
            {/* Header Section */}
            <div className="text-center mb-4 p-4 pb-0">
              <h1 className="display-6 fw-semibold mb-2" style={{ 
                background: 'linear-gradient(135deg, #e91e63, #ad1457)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Create Your EVAA Account
              </h1>
              <p className="text-muted">Let's start by setting up your profile.</p>
            </div>

            {/* Form Section */}
            <div className="px-4 pb-2">
              <div className="text-center mb-4 pb-3 border-bottom">
                <h2 className="h5 fw-semibold mb-1">User Information</h2>
                <p className="small text-muted mb-0">Please provide your personal details to get started</p>
              </div>

              <form className="form-custom">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name <span className="text-primary fw-semibold">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name <span className="text-primary fw-semibold">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="text-primary fw-semibold">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter your phone number (optional)"
                  />
                  <div className="form-text">
                    We'll use this to contact you about your account if needed
                  </div>
                </div>

                <div className="d-flex justify-content-between pt-3 border-top gap-3">
                  <button type="button" className="btn btn-outline-secondary px-4">
                    Back to Home
                  </button>
                  <button type="submit" className="btn btn-primary-custom flex-grow-1" style={{ maxWidth: '300px' }}>
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