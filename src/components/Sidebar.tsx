import React, { useState } from 'react';

interface SidebarProps {
  onNavigate?: (page: string) => void;
  onBackToMain?: () => void;
  currentPage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, onBackToMain, currentPage = 'overview' }) => {
  const [activeItem, setActiveItem] = useState(currentPage);

  // Update active item when currentPage prop changes
  React.useEffect(() => {
    setActiveItem(currentPage);
  }, [currentPage]);

  const menuItems = [
    {
      id: 'back-to-main',
      label: 'Back to Main',
      icon: '←',
      isBackButton: true
    },
    {
      id: 'admin-panel',
      label: 'Admin Panel',
      icon: '',
      isHeader: true
    },
    {
      id: 'clearview',
      label: 'ClearView Eye Associates',
      icon: '',
      isSubHeader: true
    },
    {
      id: 'organization',
      label: 'Organization Management',
      icon: '',
      isSubHeader: true
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: '📊'
    },
    {
      id: 'organization-business',
      label: 'Business setup',
      icon: '🏢'
    },
    {
      id: 'locations',
      label: 'Locations',
      icon: '📍'
    },
    {
      id: 'providers',
      label: 'Providers',
      icon: '👨‍⚕️'
    },
    {
      id: 'insurances',
      label: 'Insurances',
      icon: '🛡️'
    },
    {
      id: 'users',
      label: 'Users',
      icon: '👥'
    },
    {
      id: 'licenses',
      label: 'Licenses & Billing',
      icon: '📄'
    },
    {
      id: 'pms-ehr',
      label: 'PMS/EHR Integration',
      icon: '🔗'
    },
    {
      id: 'phone-sms',
      label: 'Phone & SMS Management',
      icon: '📱'
    },
    {
      id: 'payment',
      label: 'Patient Payment Processing',
      icon: '💳'
    }
  ];

  const handleItemClick = (itemId: string) => {
    const menuItem = menuItems.find(item => item.id === itemId);
    
    if (menuItem?.isBackButton) {
      onBackToMain?.();
      return;
    }
    
    if (!menuItem?.isHeader && !menuItem?.isSubHeader) {
      setActiveItem(itemId);
      onNavigate?.(itemId);
    }
  };

  return (
    <aside className="bg-white border-end" style={{ width: '35rem', height: '100%', overflowY: 'auto' }}>
      <nav className="nav nav-pills flex-column p-3">
        {menuItems.map((item) => {
          if (item.isBackButton) {
            return (
              <button 
                key={item.id} 
                className="nav-link text-muted border-bottom rounded-0 d-flex align-items-center gap-2 mb-3 pb-3"
                style={{ fontSize: '0.9rem' }}
                onClick={() => handleItemClick(item.id)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          }
          
          if (item.isHeader) {
            return (
              <div key={item.id} className="d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-dark small">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            );
          }
          
          if (item.isSubHeader) {
            return (
              <div key={item.id} className="px-3 py-1 text-muted text-uppercase small fw-medium" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                {item.label}
              </div>
            );
          }
          
          return (
            <button
              key={item.id}
              className={`nav-link d-flex align-items-center gap-2 rounded-0 position-relative ${
                activeItem === item.id 
                  ? 'active fw-medium text-dark' 
                  : 'text-muted'
              }`}
              onClick={() => handleItemClick(item.id)}
              style={{ 
                fontSize: '0.9rem',
                backgroundColor: activeItem === item.id ? '#f5f5f5' : 'transparent',
                border: 'none'
              }}
            >
              <span className="d-flex align-items-center justify-content-center" style={{ width: '20px' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;