import React from 'react';
import './Pricing.css';

const Pricing = () => {
  return (
    <div className="w-screen pricing-container">
      <div className="pricing-header mt-10">
        <h1>PRICING PLANS</h1>
        <p>Fuel your creative journey with our flexible subscription options ☕🚀</p>
      </div>

      <div className="pricing-toggle">
        <span className="toggle-option active">Monthly</span>
        <span className="toggle-option">Yearly</span>
      </div>

      <div className="pricing-cards">
        <div className="pricing-card basic">
          <div className="card-header">
            <h2>Basic</h2>
            <div className="price">
              <span className="amount">0.005</span>
              <span className="eth-symbol">ETH</span>
              <span className="period">/month</span>
            </div>
            <p>Perfect for new creators just getting started</p>
          </div>
          <div className="card-features">
            <ul>
              <li>✓ Unlimited posts</li>
              <li>✓ Basic analytics</li>
              <li>✓ 3 membership tiers</li>
              <li>✓ 5 merchandise items</li>
              <li>✓ Standard support</li>
              <li>✗ Custom branding</li>
              <li>✗ Priority support</li>
            </ul>
          </div>
          <button className="card-button">Get Started</button>
        </div>

        <div className="pricing-card pro">
          <div className="popular-tag">Most Popular</div>
          <div className="card-header">
            <h2>Pro</h2>
            <div className="price">
              <span className="amount">0.015</span>
              <span className="eth-symbol">ETH</span>
              <span className="period">/month</span>
            </div>
            <p>For established creators ready to grow</p>
          </div>
          <div className="card-features">
            <ul>
              <li>✓ Unlimited posts</li>
              <li>✓ Advanced analytics</li>
              <li>✓ 10 membership tiers</li>
              <li>✓ 20 merchandise items</li>
              <li>✓ Priority support</li>
              <li>✓ Custom branding</li>
              <li>✓ Early access to new features</li>
            </ul>
          </div>
          <button className="card-button">Get Started</button>
        </div>

        <div className="pricing-card premium">
          <div className="card-header">
            <h2>Premium</h2>
            <div className="price">
              <span className="amount">0.05</span>
              <span className="eth-symbol">ETH</span>
              <span className="period">/month</span>
            </div>
            <p>For professional creators and teams</p>
          </div>
          <div className="card-features">
            <ul>
              <li>✓ Unlimited everything</li>
              <li>✓ Enterprise analytics</li>
              <li>✓ Unlimited membership tiers</li>
              <li>✓ Unlimited merchandise</li>
              <li>✓ 24/7 dedicated support</li>
              <li>✓ White-label solution</li>
              <li>✓ API access</li>
            </ul>
          </div>
          <button className="card-button">Contact Sales</button>
        </div>
      </div>

      <div className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I switch plans later?</h3>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
          </div>
          <div className="faq-item">
            <h3>Do you offer refunds?</h3>
            <p>We offer a 14-day money-back guarantee for all plans. If you're not satisfied, contact our support team.</p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and cryptocurrency payments including ETH and BTC.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a free trial?</h3>
            <p>Yes, all plans come with a 7-day free trial. No credit card required to start.</p>
          </div>
        </div>
      </div>

      <div className="pricing-cta">
        <h2>Ready to Start Monetizing Your Content?</h2>
        <p>Join thousands of creators who are already earning with our platform</p>
        <button className="cta-button">Sign Up Now</button>
      </div>
    </div>
  );
};

export default Pricing;
