import { Link } from 'react-router-dom';  
import React from 'react';
import './Footer.css'; 


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>FundMyChai</h2>
          <p>"FundMyChai is on a mission to revolutionize the way ideas are funded and brought to life. We're building the future with innovation, creativity, and a whole lot of passion. Powered by cutting-edge technology, our platform is designed to fuel the entrepreneurial spirit. Created with love ❤️ during the HackSpire 2025, we’re committed to turning groundbreaking ideas into reality—one cup of chai at a time."
</p>
        </div>

        <div className="footer-section">
          <h2>Quick Links</h2>
          <ul>
             <li><Link to="/home">Home</Link></li>   
             <li><Link to="/features">Features</Link></li>   
             <li><Link to="/about">About Us</Link></li>     
             <li><Link to="/contact">Contact</Link></li>  
        </ul>
        </div>

        <div className="footer-section">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

     
      <div className="footer-bottom">
        © 2025 FundMyChai All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
