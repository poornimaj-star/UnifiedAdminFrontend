import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  pricePerUnit: number;
  currentQuantity: number;
  billingUnit: string;
  additionalInfo?: string;
}

const LicensingBilling: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Scribe',
      description: 'Licensed per provider',
      icon: '📝',
      color: '#e91e63',
      pricePerUnit: 299,
      currentQuantity: 5,
      billingUnit: 'provider'
    },
    {
      id: 2,
      name: 'Virtual Assistant',
      description: 'Licensed per location with conversation limits',
      icon: '🤖',
      color: '#ad1457',
      pricePerUnit: 299,
      currentQuantity: 3,
      billingUnit: 'location',
      additionalInfo: '750 conversations/month per location'
    }
  ]);

  const handleQuantityChange = (productId: number, increment: boolean) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const newQuantity = increment 
          ? product.currentQuantity + 1 
          : Math.max(0, product.currentQuantity - 1);
        return { ...product, currentQuantity: newQuantity };
      }
      return product;
    }));
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + (product.pricePerUnit * product.currentQuantity);
    }, 0);
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h4 fw-semibold text-dark mb-1">ClearView Eye Associates - Licenses & Billing</h1>
        <p className="text-muted mb-0">Manage product licenses and view usage for your organization</p>
      </div>

      {/* Total Monthly Cost Card */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '0.75rem', backgroundColor: '#f8f9fa' }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="text-muted">💰</span>
            <span className="text-muted fw-medium">Total Monthly Cost</span>
          </div>
          <h2 className="h3 fw-bold mb-1">${calculateTotal().toLocaleString()}/month</h2>
          <p className="text-muted small mb-0">Current billing cycle: October 2025</p>
        </div>
      </div>

      {/* Product Sections */}
      {products.map((product) => (
        <div key={product.id} className="card shadow-sm border-0 mb-4" style={{ borderRadius: '0.75rem' }}>
          <div className="card-body p-4">
            <div className="row align-items-center">
              {/* Product Info */}
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded"
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      backgroundColor: `${product.color}15`,
                      color: product.color,
                      fontSize: '24px'
                    }}
                  >
                    {product.icon}
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-1">{product.name}</h5>
                    <p className="text-muted mb-0">{product.description}</p>
                    {product.additionalInfo && (
                      <p className="text-muted small mb-0">{product.additionalInfo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="col-md-3 text-md-end">
                <h4 className="fw-bold mb-0">${(product.pricePerUnit * product.currentQuantity).toLocaleString()}/mo</h4>
                <p className="text-muted small mb-0">${product.pricePerUnit}/{product.billingUnit}</p>
              </div>

              {/* Quantity Controls */}
              <div className="col-md-3 text-md-end">
                <div className="d-flex align-items-center justify-content-md-end gap-3">
                  <button 
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', padding: 0 }}
                    onClick={() => handleQuantityChange(product.id, false)}
                    disabled={product.currentQuantity <= 0}
                  >
                    −
                  </button>
                  <span className="fw-semibold" style={{ minWidth: '20px', textAlign: 'center' }}>
                    {product.currentQuantity}
                  </span>
                  <button 
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', padding: 0 }}
                    onClick={() => handleQuantityChange(product.id, true)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Provider/Location Licenses Section */}
            {product.name === 'Scribe' && (
              <div className="mt-4 pt-3 border-top">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="text-muted">👨‍⚕️</span>
                  <span className="fw-medium">Provider Licenses</span>
                </div>
                <div className="text-muted small mb-2">{product.currentQuantity} of {product.currentQuantity} licenses in use</div>
                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div className="progress-bar bg-dark" style={{ width: '100%' }}></div>
                </div>
              </div>
            )}

            {product.name === 'Virtual Assistant' && (
              <>
                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="text-muted">📍</span>
                    <span className="fw-medium">Location Licenses</span>
                  </div>
                  <div className="text-muted small mb-2">750 conversations/month per location</div>
                  <div className="d-flex align-items-center justify-content-end gap-3 mt-3">
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(product.id, false)}
                      disabled={product.currentQuantity <= 0}
                    >
                      −
                    </button>
                    <span className="fw-semibold">{product.currentQuantity}</span>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(product.id, true)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="text-muted">💬</span>
                    <span className="fw-medium">Additional Conversation Packages</span>
                  </div>
                  <div className="text-muted small mb-2">500 conversations for $250/month each</div>
                  <div className="d-flex align-items-center justify-content-end gap-3 mt-3">
                    <button className="btn btn-outline-secondary btn-sm">−</button>
                    <span className="fw-semibold">2</span>
                    <button className="btn btn-outline-secondary btn-sm">+</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LicensingBilling;