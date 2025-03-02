
import '../styles/main.css';

const FooterCTA = () => {
  return (
    <section className="footer-cta">      
      <div className="container">
        <div className="footer-cta-content animate-fade-up">
          <h2 className="footer-cta-title">Ready to Join the Sharing Economy?</h2>
          <p className="footer-cta-description">Sign up today and start lending or borrowing in minutes.</p>
          <div className="footer-cta-buttons">
            <a href="#" className="footer-cta-btn-primary">Sign Up Now</a>
            <a href="#" className="footer-cta-btn-outline">Learn More</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
