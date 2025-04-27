import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const connectWallet = async () => {
    setError('');
    
    // Check if ethereum object exists in window (MetaMask injects this)
    if (window.ethereum) {
      try {
        // Request account access
        console.log('Requesting MetaMask accounts...');
        
        // Reset any previous connection state
        setWalletAddress('');
        
        // Request accounts from MetaMask
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          console.log('Connected wallet:', address);
          setWalletAddress(address);
          return address;
        } else {
          console.error('No accounts returned from MetaMask');
          setError('No accounts found. Please check MetaMask and try again.');
          return null;
        }
      } catch (error) {
        // Handle specific error cases
        console.error('MetaMask connection error:', error);
        
        if (error.code === 4001) {
          // User rejected the request
          setError('You rejected the connection request. Please approve the MetaMask connection.');
        } else if (error.code === -32002) {
          // Request already pending
          setError('A connection request is already pending. Please check your MetaMask extension.');
        } else {
          // Generic error
          setError(`Failed to connect to MetaMask: ${error.message || 'Unknown error'}`);
        }
        return null;
      }
    } else {
      console.error('MetaMask not detected');
      setError('MetaMask not detected. Please install the MetaMask extension to continue.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Check if wallet is connected
    if (!walletAddress) {
      setError('Please connect your MetaMask wallet first');
      return;
    }
    
    setLoading(true);
    
    try {      
      // Prepare form data
      const userData = {
        username,
        email,
        password,
        walletAddress,
        bio
      };
      
      console.log('Submitting user data:', userData);
      
      // Send data to backend
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // If we have a profile image, upload it after successful registration
      if (profileImageFile && data.data && data.data.username) {
        try {
          // First login to get a token
          const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
          
          const loginData = await loginResponse.json();
          
          if (!loginResponse.ok) {
            console.error('Auto-login failed after registration');
            // Continue to login page even if auto-login fails
            alert('Registration successful! Please login.');
            navigate('/login');
            return;
          }
          
          // Now upload the profile image with the token
          const formData = new FormData();
          formData.append('profileImage', profileImageFile);
          
          const imageResponse = await fetch('http://localhost:5000/api/auth/upload-profile-image', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${loginData.data.token}`
            },
            body: formData
          });
          
          if (!imageResponse.ok) {
            console.error('Profile image upload failed');
          }
        } catch (error) {
          console.error('Error uploading profile image after registration:', error);
        }
      }
      
      // Registration successful
      alert('Registration successful! Please login.');
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-heading">
          Join Us 🚀
        </h1>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="signup-form">

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your password again"
              required
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Profile Picture</label>
            <input
              type="file"
              onChange={handleImageChange}
            />
            {profileImage && (
              <img
                src={profileImage}
                alt="Profile Preview"
                className="profile-preview"
              />
            )}
          </div>

          <div className="form-group">
            <label>Connect Your Wallet</label>
            <div className="wallet-connect-container">
              {walletAddress ? (
                <div className="wallet-connected">
                  <div className="wallet-status connected">
                    <span className="wallet-icon">✓</span>
                    Wallet Connected
                  </div>
                  <div className="wallet-address">
                    {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </div>
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={connectWallet} 
                  className="connect-wallet-btn-large"
                  disabled={loading}
                >
                  Connect MetaMask Wallet
                </button>
              )}
            </div>
          </div>

          <div className="form-button">
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Register Now'}
            </button>
          </div>

          <div className="form-button">
            <Link to="/login" className="login-link">
              Already Registered? Login Now
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Signup;
