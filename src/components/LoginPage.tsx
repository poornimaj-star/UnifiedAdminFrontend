import React, { useState } from 'react';
import './LoginPage.css';

interface LoginPageProps {
  onBackToHome: () => void;
  onSwitchToSignup: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome, onSwitchToSignup }) => {
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
    console.log('Login attempt:', formData);
    // Handle login logic here
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Handle forgot password logic
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
        <div className="header-content">
          <nav className="header-nav">
            <button className="nav-button login-btn active">
              Login
            </button>
            <button 
              className="nav-button signup-btn"
              onClick={onSwitchToSignup}
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-container">
          <div className="login-card">
            {/* Header Section */}
            <div className="card-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your EVAA AI portal</p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="login-form">
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
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="signin-button">
                Sign In
              </button>

              <button
                type="button"
                className="forgot-password-button"
                onClick={handleForgotPassword}
              >
                Forgot your password?
              </button>
            </form>

            <div className="signup-section">
              <p>New to EVAA AI?</p>
              <button
                type="button"
                className="create-account-button"
                onClick={onSwitchToSignup}
              >
                Create New Account
              </button>
            </div>

            <div className="back-home-section">
              <button 
                type="button" 
                className="back-home-button"
                onClick={onBackToHome}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;