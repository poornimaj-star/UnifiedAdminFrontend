import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LoginModal from './components/LoginModal'
import SignupPage from './components/SignupPage'
import AdminDashboard from './components/AdminDashboard'
import WelcomeScreen from './components/WelcomeScreen'

type PageView = 'home' | 'signup' | 'welcome' | 'admin'

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState('')
  const [selectedAssistant, setSelectedAssistant] = useState('')

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setCurrentPage('welcome')
    setIsLoginModalOpen(false)
  }

  const handleSelectionComplete = (organization: string, assistant: string) => {
    setSelectedOrganization(organization)
    setSelectedAssistant(assistant)
    setCurrentPage('admin')
  }

  const handleBackToMain = () => {
    setCurrentPage('welcome')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setSelectedOrganization('')
    setSelectedAssistant('')
    setCurrentPage('home')
  }

  const navigateToSignup = () => {
    setCurrentPage('signup')
    setIsLoginModalOpen(false)
  }

  const navigateToHome = () => {
    setCurrentPage('home')
    setIsLoginModalOpen(false)
  }

  // Show Welcome Screen when logged in but no organization/assistant selected
  if (currentPage === 'welcome' && isLoggedIn) {
    return <WelcomeScreen onSelectionComplete={handleSelectionComplete} />
  }

  // Show Admin Dashboard when logged in and selections made
  if (currentPage === 'admin' && isLoggedIn) {
    return <AdminDashboard onLogout={handleLogout} onBackToMain={handleBackToMain} selectedOrganization={selectedOrganization} selectedAssistant={selectedAssistant} />
  }

  if (currentPage === 'signup') {
    return (
      <>
        <SignupPage 
          onBackToHome={navigateToHome}
          onSwitchToLogin={openLoginModal}
        />
        
        {/* Login Modal available on signup page */}
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
          onSwitchToSignup={navigateToSignup}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    )
  }

  // Home page
  return (
    <div className="min-vh-100 d-flex flex-column">
      <header className="navbar navbar-expand-lg navbar-custom">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-3">
            <a href="https://vite.dev" target="_blank" className="d-flex">
              <img src={viteLogo} className="me-2" height="40" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" className="d-flex">
              <img src={reactLogo} height="40" alt="React logo" />
            </a>
          </div>
          <nav className="d-flex align-items-center gap-2">
            <button 
              className="btn btn-outline-secondary"
              onClick={openLoginModal}
            >
              Sign In
            </button>
            <button 
              className="btn btn-primary"
              onClick={navigateToSignup}
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>

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

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToSignup={navigateToSignup}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}

export default App
