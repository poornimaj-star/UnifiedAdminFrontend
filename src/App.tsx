import { useState } from 'react'
import LoginModal from './components/LoginModal'
import SignupPage from './components/SignupPage'
import AdminDashboard from './components/AdminDashboard'
import WelcomeScreen from './components/WelcomeScreen'
import EVAALandingPage from './components/EVAALandingPage'

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

  // Home page - EVAA Landing Page
  return (
    <>
      <EVAALandingPage onLogin={openLoginModal} onSignup={navigateToSignup} />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToSignup={navigateToSignup}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}

export default App
