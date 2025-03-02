
import { ShieldCheck, Lock, ShieldPlus, Bell } from 'lucide-react';
import '../styles/main.css';

const trustFeatures = [
  {
    icon: <ShieldCheck className="card-icon" />,
    title: 'Verified Users',
    description: 'All users are verified through our robust identification process.'
  },
  {
    icon: <Lock className="card-icon" />,
    title: 'Secure Payments',
    description: 'Your transactions are protected with bank-level security and escrow protection.'
  },
  {
    icon: <ShieldPlus className="card-icon" />,
    title: 'Insurance Coverage',
    description: 'Optional coverage available for peace of mind during rentals.'
  },
  {
    icon: <Bell className="card-icon" />,
    title: '24/7 Support',
    description: 'Our team is always available to help with any issues or questions.'
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
          <span className="badge">Peace of Mind</span>
          <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>Your Trust Is Our Priority</h2>
          <p style={{color: 'var(--gray-500)', marginBottom: '3rem'}}>We've built Vhara with your safety and security as our top priorities. Here's how we protect you:</p>
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
