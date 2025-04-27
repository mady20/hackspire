import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Creators.css';

const Creators = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/creators');
      
      if (!response.ok) {
        throw new Error('Failed to fetch creators');
      }

      const data = await response.json();
      setCreators(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching creators:', error);
      setError('Failed to load creators. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCreators = creators.filter(creator => 
    creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (creator.bio && creator.bio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="creators-loading">
        <div className="loading-spinner"></div>
        <p>Loading creators...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="creators-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchCreators}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="creators-container">
      <div className="creators-header">
        <h1>Discover Creators</h1>
        <p className="creators-subtitle">Support your favorite content creators with Ethereum donations</p>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search creators by name or bio..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {filteredCreators.length === 0 ? (
        <div className="no-creators">
          <p>No creators found matching your search.</p>
        </div>
      ) : (
        <div className="creators-grid">
          {filteredCreators.map(creator => (
            <div className="creator-card" key={creator._id}>
              <div className="creator-image-container">
                {creator.profileImage ? (
                  <img 
                    src={creator.profileImage.startsWith('http') ? creator.profileImage : `http://localhost:5000${creator.profileImage}`} 
                    alt={creator.username} 
                    className="creator-image" 
                    onError={(e) => {
                      // If image fails to load, show placeholder instead
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="creator-image-placeholder">
                    {creator.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="creator-details">
                <h2 className="creator-name">{creator.username}</h2>
                
                <p className="creator-wallet">
                  {creator.walletAddress.substring(0, 6)}...{creator.walletAddress.substring(creator.walletAddress.length - 4)}
                </p>
                
                <p className="creator-bio">
                  {creator.bio}
                </p>
                
                <div className="creator-stats">
                  <div className="creator-donations">
                    <span className="donation-label">Total Received:</span>
                    <span className="donation-amount">{creator.totalDonations} ETH</span>
                  </div>
                </div>
                
                <div className="creator-actions">
                  <Link to={`/creator/${creator._id}`} className="donate-button">
                    Support Creator
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Creators;
