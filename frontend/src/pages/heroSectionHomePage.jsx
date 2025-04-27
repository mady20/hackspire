import React from 'react';
import './heroSectionHomePage.css';
import { Link } from 'react-router-dom';
import chaiLogo from '../assets/chai.png';

const HeroSectionHomePage = () => {
  return (
    <section className="w-screen flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-700 to-black px-8 md:px-20 py-12 text-center">
    
        {/* Image */}
    <div className="flex justify-center my-2">
        <img
        src={chaiLogo}
        alt="Crowdfunding Illustration"
        className="w-64 md:w-64 object-contain my-2"
        />
    </div>
    {/* Heading */}
    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight py-6" id="heading">
        Let's get you started <br /> with your chai
    </h1>

    {/* Subheading */}
    <p className="text-lg md:text-xl text-white/90 max-w-2xl py-5" id="subhead">
        Join a community of innovators and fund your dreams today.
    </p>

    {/* Buttons */}
    <div className="flex flex-col md:flex-row gap-6 mb-12">
        <Link to="/signup">
        <button className="font-semibold transition" id="btn2">
            Get Started
        </button>
        </Link>
        <Link to="/login">
        <button className="text-white font-semibold py-3 px-8 hover:bg-white hover:text-red-600 transition" id="btn">
            Login
        </button>
        </Link>
    </div>
</section>

  );
};

export default HeroSectionHomePage;
