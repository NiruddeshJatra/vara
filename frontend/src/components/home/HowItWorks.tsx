import { UserPlus, Plus, Search, ShieldCheck, CheckCircle } from 'lucide-react';
import '../../styles/main.css';

const steps = [
  {
    icon: <UserPlus className="process-step-icon" />,
    title: 'Create Account & Verify',
    description: 'Register with basic information and verify your email/phone to join our trusted community'
  },
  {
    icon: <Plus className="process-step-icon" />,
    title: 'List Your Item',
    description: 'Lenders provide product details, set pricing/availability, and submit for admin approval'
  },
  {
    icon: <Search className="process-step-icon" />,
    title: 'Request to Rent',
    description: 'Browse available items, select products, and submit rental requests with preferred parameters'
  },
  {
    icon: <ShieldCheck className="process-step-icon" />,
    title: 'Admin Approval',
    description: 'Admins review requests and select suitable renters based on ratings and availability'
  },
  {
    icon: <CheckCircle className="process-step-icon" />,
    title: 'Complete Rental & Review',
    description: 'Coordinate handoff/return through company hubs, complete payment, and leave reviews'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section bg-gradient-to-b from-green-50 to-white">
      <div className="container">
        <div className="section-title">
          <span className="badge">Process Flow</span>
          <h2 className="text-green-800 font-bold mb-3">Seamless Rental Experience</h2>
          <p className="text-green-700/80 mb-3">From listing to return, we handle every step with care and security</p>
        </div>

        <div className="process-container">
          <div className="process-line"></div>
          
          <div className="process-steps-container">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="process-step"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="process-step-icon-container">
                  <div className="process-step-icon-bg">
                    {step.icon}
                  </div>
                  <div className="process-step-icon-shadow"></div>
                  <div className="process-step-number">
                    {index + 1}
                  </div>
                </div>
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-button-container">
          <button className="btn-cta animate-fade-up" style={{ animationDelay: '0.5s' }}>
            Start Renting Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;