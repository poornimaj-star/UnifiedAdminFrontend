import React, { useState } from 'react';
import TopNavigation from './TopNavigation';
import Sidebar from './Sidebar';
import Overview from './Overview';
import PhoneSmsManagement from './PhoneSmsManagement';
import LicensingBilling from './LicensingBilling';
import UsersManagement from './UsersManagement';
import PatientPaymentProcessing from './PatientPaymentProcessing';
import DataTables from './DataTables';
import InsuranceManagement from './InsuranceManagement';
import LocationsManagement from './LocationsManagement';
import ProvidersManagement from './ProvidersManagement';
import OrganizationBusinessSetup from './OrganizationBusinessSetup';
import BusinessPage from './BusinessPage';

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToMain: () => void;
  selectedOrganization: string;
  selectedAssistant: string;
}

type DashboardPage = 'overview' | 'users' | 'licenses' | 'phone-sms' | 'payment' | 'data-tables' | 'organization-business' | 'business' | 'locations' | 'providers' | 'insurances' | 'pms-ehr';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onBackToMain, selectedOrganization, selectedAssistant }) => {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('overview');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as DashboardPage);
  };

  // Update sidebar active item when currentPage changes
  React.useEffect(() => {
    // Sync sidebar with current page
  }, [currentPage]);
  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
      case 'users':
        return <UsersManagement />;
      case 'licenses':
        return <LicensingBilling />;
      case 'phone-sms':
        return <PhoneSmsManagement />;
      case 'payment':
        return <PatientPaymentProcessing />;
      case 'data-tables':
        return <DataTables />;
      case 'organization-business':
        return <OrganizationBusinessSetup />;
      case 'business':
        return <BusinessPage />;
      case 'locations':
        return <LocationsManagement />;
      case 'providers':
        return <ProvidersManagement />;
      case 'insurances':
        return <InsuranceManagement />;
      case 'pms-ehr':
        return (
          <div className="container-fluid">
            <h1 className="h4 fw-semibold text-dark mb-3">PMS/EHR Integration</h1>
            <p className="text-muted">Configure Practice Management System and Electronic Health Record integrations.</p>
            {/* PMS/EHR content will be implemented here */}
          </div>
        );
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Top Navigation */}
      <TopNavigation 
        onLogout={onLogout} 
        onBackToMain={onBackToMain} 
        onNavigate={handleNavigate}
        selectedOrganization={selectedOrganization} 
        selectedAssistant={selectedAssistant} 
      />
      
      {/* Main Layout */}
      <div className="d-flex flex-grow-1" style={{ height: 'calc(100vh - 60px)', backgroundColor: '#f6f6f1' }}>
        {/* Sidebar */}
        <Sidebar 
          onNavigate={handleNavigate}
          onBackToMain={onBackToMain}
          currentPage={currentPage}
        />
        
        {/* Main Content */}
        <main className="flex-grow-1 p-4 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;