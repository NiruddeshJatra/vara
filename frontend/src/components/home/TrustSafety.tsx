import React from 'react';
import { ShieldCheck, CheckCircle, ShieldOff, MessageSquare } from 'lucide-react';
import '../../styles/main.css';

const trustFeatures = [
  {
    icon: <ShieldCheck className="card-icon" />,
    title: 'Verified Community',
    description: 'All users undergo ID verification and background checks before participating'
  },
  {
    icon: <CheckCircle className="card-icon" />,
    title: 'Admin-Approved Listings',
    description: 'Every listing is manually verified by our team before being published'
  },
  {
    icon: <ShieldOff className="card-icon" />,
    title: 'Damage Protection',
    description: 'Security deposits held in escrow until safe return confirmation'
  },
  {
    icon: <MessageSquare className="card-icon" />,
    title: 'Mediation Support',
    description: 'Dedicated team resolves disputes and oversees product handoffs/returns'
  }
];

const TrustSafety = () => {
  return (
    <section id="trust-safety" className="section relative bg-gradient-to-b from-green-50 to-white" style={{overflow: 'hidden'}}>
      {/* Background Elements */}
      <div className="bg-gradient-radial" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -10,
        background: 'radial-gradient(circle, rgba(93, 171, 31, 0.05) 0%, transparent 70%)'
      }}></div>
      
      <div className="container">
        <div style={{maxWidth: '48rem', margin: '0 auto', textAlign: 'center'}} className="animate-fade-up">
          <span className="badge">Safe Transactions</span>
          <h2 className="text-green-900 mb-4 font-bold">Company-Mediated Assurance</h2>
          <p className="text-green-700/80 mb-3">We handle the complexities so you can rent with confidence</p>
        </div>

        <div className="card-grid">
          {trustFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="card-card hover-lift animate-fade-up" 
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="card-icon-container">
                <div className="card-icon">{feature.icon}</div>
              </div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-description">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12 animate-fade-up" style={{animationDelay: '750ms'}}>
          <button className="bg-transparent border border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-colors duration-300 font-medium rounded-full px-8 py-3">
            Learn More About Our Trust & Safety
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;