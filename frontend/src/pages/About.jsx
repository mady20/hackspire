import React from 'react';
import './About.css';

function About() {
  return (
    <div className="w-screen about-page">
      {/* <Navbar /> */}
      <div className="about-header mt-10">
        <h1>ABOUT US</h1> 
        <p>Fueling dreams one idea at a time, brewed with innovation and creativity ☕🚀</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At FundMyChai, we believe every great idea deserves a chance to grow. 
            We're committed to empowering innovators, dreamers, and creators 
            by providing a platform to showcase their projects and gain the support they need.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Journey</h2>
          <p>
            Born during HackSpire 2025, FundMyChai started as a passion project fueled by late-night brainstorming 
            and countless cups of chai. What began as a spark has now evolved into a platform that connects ideas 
            with opportunities across the globe.
          </p>
        </section>

        <section className="about-section">
          <h2>Why FundMyChai?</h2>
          <p>
            Innovation should be accessible. Whether it's tech projects, art, community initiatives, 
            or something completely out-of-the-box, FundMyChai gives creators a space to tell their stories, 
            find supporters, and make an impact.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Creativity:</strong> Nurturing originality and imagination.</li>
            <li><strong>Integrity:</strong> Building trust through transparency and honesty.</li>
            <li><strong>Community:</strong> Fostering collaboration and mutual growth.</li>
            <li><strong>Impact:</strong> Empowering ideas that make a real difference.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default About;
