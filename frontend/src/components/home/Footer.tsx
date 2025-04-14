import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import '../../styles/main.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Logo & Description */}
          <div>
            <a href="/" className="footer-logo">
              <span className="footer-logo-highlight">V</span>ara
            </a>
            <p className="footer-description">
              The trusted community marketplace for lending and borrowing everyday items. Save money, earn income, and live more sustainably.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link">
                <Facebook size={18} />
              </a>
              <a href="#" className="footer-social-link">
                <Twitter size={18} />
              </a>
              <a href="#" className="footer-social-link">
                <Instagram size={18} />
              </a>
              <a href="#" className="footer-social-link">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="footer-column-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">About Us</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
              <li><a href="#" className="footer-link">Press</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="footer-column-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">Contact Us</a></li>
              <li><a href="#" className="footer-link">FAQ</a></li>
              <li><a href="#" className="footer-link">Trust & Safety</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="footer-column-title">Legal</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Cookie Policy</a></li>
            </ul>
            
            {/* Language Selector */}
            <div className="mt-6">
              <Select defaultValue="en">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">Bangla</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          © 2025 Vara, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
