
import { UserPlus, Search, MessageSquare, CreditCard, RotateCw } from 'lucide-react';
import '../styles/main.css';

const steps = [
  {
    icon: <UserPlus className="process-step-icon" />,
    title: 'Sign Up',
    description: 'Create your free account with basic information to join our trusted community.'
  },
  {
    icon: <Search className="process-step-icon" />,
    title: 'Browse or List',
    description: 'Search for items to rent or list your own items to lend to others.'
  },
  {
    icon: <MessageSquare className="process-step-icon" />,
    title: 'Request & Approve',
    description: 'Send rental requests or approve incoming requests from potential borrowers.'
  },
  {
    icon: <CreditCard className="process-step-icon" />,
    title: 'Secure Payment',
    description: 'Pay through our secure platform. Funds are held safely until rental is complete.'
  },
  {
    icon: <RotateCw className="process-step-icon" />,
    title: 'Exchange & Return',
    description: 'Meet to exchange the item and return it in the same condition when done.'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section bg-gradient-to-b from-green-50 to-white">
      <div className="container">
        <div className="section-title">
          <span className="badge">The Process</span>
          <h2>Simple, Secure, Straightforward</h2>
          <p>Our platform makes borrowing and lending easy, safe, and reliable.</p>
        </div>

        <div className="process-container">
          {/* Connection Line */}
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
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
