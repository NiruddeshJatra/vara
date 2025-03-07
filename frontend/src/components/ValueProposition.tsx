
import { DollarSign, TrendingUp, Leaf } from 'lucide-react';
import '../styles/main.css';
import { Button } from './ui/button';

const features = [
  {
    icon: <DollarSign className="card-icon" />,
    title: 'Save Money',
    description: 'Why buy when you can rent? Access thousands of items at a fraction of the cost.'
  },
  {
    icon: <TrendingUp className="card-icon" />,
    title: 'Earn Extra Income',
    description: 'Turn your unused items into a steady income stream. Set your own rates and availability.'
  },
  {
    icon: <Leaf className="card-icon" />,
    title: 'Sustainable Living',
    description: 'Reduce waste and environmental impact by sharing resources within your community.'
  }
];

const ValueProposition = () => {
  return (
    <section className="section bg-gradient-to-b from-green-50 to-white">
      <div className="container">
        <div className="section-title">
          <span className="badge">Our Benefits</span>
          <h2 className="text-green-800">Why Choose Bhara?</h2>
          <p>Join thousands of people saving money and living more sustainably.</p>
        </div>

        <div className="card-grid">
          {features.map((feature, index) => (
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

export default ValueProposition;
