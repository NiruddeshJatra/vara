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
    <section className="section bg-gradient-to-b from-green-50 to-white relative" style={{overflow: 'hidden'}}>
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
        <div style={{maxWidth: '48rem', margin: '0 auto', textAlign: 'center'}}>
          <span className="badge">Safe Transactions</span>
          <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>Company-Mediated Assurance</h2>
          <p style={{color: 'var(--gray-500)', marginBottom: '3rem'}}>We handle the complexities so you can rent with confidence:</p>
        </div>

        <div className="card-grid">
          {trustFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="card-card animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-icon-container">
                {feature.icon}
              </div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;