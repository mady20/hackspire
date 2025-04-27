import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }
    
    setLoading(true);
    
    try {
      // First authenticate with backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // If login is successful, connect to MetaMask
      if (window.ethereum) {
        try {
          console.log('Requesting MetaMask accounts after login...');
          
          // Request accounts from MetaMask
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);
            console.log('Connected wallet:', address);
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify({
              ...data.data,
              currentWalletAddress: address
            }));
            
            // Redirect to creator dashboard
            navigate('/dashboard');
          } else {
            console.error('No accounts returned from MetaMask');
            setError('No wallet accounts found. Please check MetaMask and try again.');
          }
        } catch (error) {
          console.error('Wallet connection failed:', error);
          
          if (error.code === 4001) {
            // User rejected the request
            setError('You rejected the wallet connection request. Please approve the MetaMask connection.');
          } else if (error.code === -32002) {
            // Request already pending
            setError('A wallet connection request is already pending. Please check your MetaMask extension.');
          } else {
            // Generic error
            setError(`Failed to connect to MetaMask: ${error.message || 'Unknown error'}`);
          }
        }
      } else {
        console.error('MetaMask not detected');
        setError('MetaMask not detected. Please install the MetaMask extension to continue.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-heading">
          Connect Your Wallet 🚀
        </h1>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin} className="login-form">

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
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-button">
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Login & Connect Wallet'}
            </button>
          </div>
          
          <div className="form-link">
            <Link to="/signup">Don't have an account? Sign up</Link>
          </div>

        </form>

        {walletAddress && (
          <div className="wallet-address">
            Wallet Connected: {walletAddress}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
