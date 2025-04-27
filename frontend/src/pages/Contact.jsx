import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="h-screen contact-page">
      <div className="contact-header">
        <h1>CONTACT US</h1>
        
        <p>We would love to hear from you! ☕📩</p>
      </div>

      <div className="contact-content">
        <section className="contact-section">
          <h2>Get in Touch</h2>
          <p>If you have any questions, feedback, or just want to share some chai stories, drop us a message below!</p>

          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </section>

        <section className="contact-section">
          <h2>Our Socials</h2>
          <ul>
            <li><strong>Email:</strong> support@fundmychai.com</li>
            <li><strong>Instagram:</strong> @fundmychai</li>
            <li><strong>Twitter:</strong> @fundmychai</li>
            <li><strong>LinkedIn:</strong> FundMyChai</li>
          </ul>
        </section>

        {/* <div className="contact-footer">
          <p>Made with ❤️ by the FundMyChai Team | HackSpire 2025</p>
        </div> */}
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Contact;
