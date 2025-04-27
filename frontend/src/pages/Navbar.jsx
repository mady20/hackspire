import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Don't forget to import the CSS!

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/" className="text-red-700" id="navHead">FMC</Link>
      </div>

      {/* Desktop Links */}
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/creator" className="nav-link">Creators</Link>
        <Link to="/pricing" className="nav-link">Pricing</Link>
      </div>

      {/* Desktop Buttons */}
      <div className="navbar-buttons">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">
              <button className="nav-button dashboard-button">Dashboard</button>
            </Link>
            <button 
              className="nav-button logout-button"
              onClick={() => {
                localStorage.removeItem('user');
                setIsLoggedIn(false);
                setUser(null);
                window.location.href = '/';
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="nav-button login-button">Login</button>
            </Link>
            <Link to="/signup">
              <button className="nav-button get-started-button">Get Started</button>
            </Link>
          </>
        )}
      </div>

      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        <svg
          className="hamburger-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16">
          </path>
        </svg>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={toggleMenu}>Home</Link>
          <Link to="/about" className="mobile-link" onClick={toggleMenu}>About</Link>
          <Link to="/creator" className="mobile-link" onClick={toggleMenu}>Creator</Link>
          <Link to="/pricing" className="mobile-link" onClick={toggleMenu}>Pricing</Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" onClick={toggleMenu}>
                <button className="nav-button dashboard-button">Dashboard</button>
              </Link>
              <button 
                className="nav-button logout-button"
                onClick={() => {
                  localStorage.removeItem('user');
                  setIsLoggedIn(false);
                  setUser(null);
                  window.location.href = '/';
                  toggleMenu();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleMenu}>
                <button className="nav-button login-button">Login</button>
              </Link>
              <Link to="/signup" onClick={toggleMenu}>
                <button className="nav-button get-started-button">Get Started</button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
