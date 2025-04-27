import React from 'react';
import './Features.css';

function Features() {
  return (
    <div className="features-page">
      <div className="features-header">
        <h1>Our Key Features</h1>
        <p>Empowering ideas with the spirit of Web3 — decentralized, transparent, unstoppable.</p>
      </div>

      <div className="features-content">
        <div className="feature-card">
          <h2>Decentralization</h2>
          <p>No central authority. Projects are powered by the community — ensuring freedom, trust, and innovation without limits.</p>
        </div>

        <div className="feature-card">
          <h2>Transparency</h2>
          <p>Every transaction, contribution, and decision is recorded openly. Transparency builds trust between creators and supporters.</p>
        </div>

        <div className="feature-card">
          <h2>Security</h2>
          <p>Backed by blockchain principles, your data and funds stay secure. No middlemen, no unnecessary risks — just pure creation.</p>
        </div>
      </div>
    </div>
  );
}

export default Features;
