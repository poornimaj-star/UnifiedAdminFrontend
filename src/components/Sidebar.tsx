import React, { useState } from 'react';
import overviewIcon from '../assets/Overview.svg';
import locationIcon from '../assets/Location.svg';
import providersIcon from '../assets/Providers.svg';
import insurancesIcon from '../assets/Insurances.svg';
import usersIcon from '../assets/Users.svg';
import licensesIcon from '../assets/Licenses&Billing.svg';
import ehrIcon from '../assets/EHRIntegration.svg';
import phoneSmsIcon from '../assets/Phone&SMS Management.svg';
import backButtonIcon from '../assets/BackuttonArrow.svg';

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
      icon: backButtonIcon,
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
      isSubSubHeader: true
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: overviewIcon
    },
    {
      id: 'organization-business',
      label: 'Organization / Business Group',
      icon: overviewIcon
    },
    {
      id: 'locations',
      label: 'Locations',
      icon: locationIcon
    },
    {
      id: 'providers',
      label: 'Providers',
      icon: providersIcon
    },
    {
      id: 'insurances',
      label: 'Insurances',
      icon: insurancesIcon
    },
    {
      id: 'users',
      label: 'Users',
      icon: usersIcon
    },
    {
      id: 'licenses',
      label: 'Licenses & Billing',
      icon: licensesIcon
    },
    {
      id: 'pms-ehr',
      label: 'PMS/EHR Integration',
      icon: ehrIcon
    },
    {
      id: 'phone-sms',
      label: 'Phone & SMS Management',
      icon: phoneSmsIcon
    },
    {
      id: 'payment',
      label: 'Patient Payment Processing',
      icon: licensesIcon
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
    <aside className="bg-light border-end" style={{ width: '18rem', height: '100%', overflowY: 'auto' }}>
      <nav className="nav nav-pills flex-column p-3">
        {menuItems.map((item) => {
          if (item.isBackButton) {
            return (
              <button 
                key={item.id} 
                className="nav-link text-muted rounded-0 d-flex align-items-center gap-2 mb-0 pb-3"
                style={{ fontSize: '0.9rem' }}
                onClick={() => handleItemClick(item.id)}
              >
                <span>
                  {typeof item.icon === 'string' && item.icon.length <= 2 ? (
                    item.icon
                  ) : (
                    <img src={item.icon} alt={item.label} style={{ width: '16px', height: '16px' }} />
                  )}
                </span>
                <span className='text-dark fw-medium'>{item.label}</span>
              </button>
            );
          }
          
          if (item.isHeader) {
            return (
              <div key={item.id} className="d-flex align-items-center gap-2 px-0 py-2 pb-0 fw-semibold text-dark small">
                <span>
                  {typeof item.icon === 'string' && item.icon.length <= 2 ? (
                    item.icon
                  ) : item.icon ? (
                    <img src={item.icon} alt={item.label} style={{ width: '16px', height: '16px' }} />
                  ) : null}
                </span>
                <span>{item.label}</span>
              </div>
            );
          }
          
          if (item.isSubHeader) {
            return (
              <div key={item.id} className="px-2 py-1 text-muted text-uppercase small fw-medium" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                {item.label}
              </div>
            );
          }

          if (item.isSubSubHeader) {
            return (
              <div key={item.id} className="px-3 py-1 pt-3 text-muted text-uppercase small fw-medium" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
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
                {typeof item.icon === 'string' && item.icon.length <= 2 ? (
                  item.icon
                ) : (
                  <img src={item.icon} alt={item.label} style={{ width: '16px', height: '16px' }} />
                )}
              </span>
              <span className='text-dark fw-medium'>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;