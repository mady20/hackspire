import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SiEthereum } from 'react-icons/si';
import { BsInfoCircle } from 'react-icons/bs';
import { TransactionContext } from '../context/TransactionContext';
import { shortenAddress } from '../utils/shortenAddress';
import useFetch from '../hooks/useFetch';
import './CreatorProfile.css';

const CreatorProfile = () => {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [merchandise, setMerchandise] = useState([]);
  const [activeTab, setActiveTab] = useState('content');
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  
  // Transaction context with default values for safety
  const { 
    currentAccount = '', 
    connectWallet = () => {}, 
    handleChange = () => {}, 
    sendTransaction = async () => {}, 
    formData = { addressTo: "", amount: "0.01", keyword: "", message: "" }, 
    setFormData = () => {},
    isLoading = false 
  } = useContext(TransactionContext) || {};
  
  // Get GIF URL based on keyword
  const gifUrl = useFetch({ keyword: formData.keyword });

  useEffect(() => {
    fetchCreatorData();
    fetchCreatorPosts();
    fetchCreatorMembershipPlans();
    fetchCreatorMerchandise();
    
    // Reset form data when component mounts
    setFormData({ addressTo: "", amount: "0.01", keyword: "", message: "" });
  }, [id]);

  const fetchCreatorData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/auth/creator/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch creator data');
      }

      const data = await response.json();
      setCreator(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching creator data:', error);
      setError('Failed to load creator profile. Please try again later.');
      setLoading(false);
    }
  };
  
  const fetchCreatorPosts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/creator/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch creator posts');
      }
      
      const data = await response.json();
      setPosts(data.data);
    } catch (error) {
      console.error('Error fetching creator posts:', error);
    }
  };
  
  const fetchCreatorMembershipPlans = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/membership-plans/creator/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch creator membership plans');
      }
      
      const data = await response.json();
      setMembershipPlans(data.data);
    } catch (error) {
      console.error('Error fetching creator membership plans:', error);
    }
  };
  
  const fetchCreatorMerchandise = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/merchandise/creator/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch creator merchandise');
      }
      
      const data = await response.json();
      setMerchandise(data.data);
    } catch (error) {
      console.error('Error fetching creator merchandise:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!creator || !creator.walletAddress) {
      alert('Creator wallet address not available');
      return;
    }

    if (!currentAccount) {
      alert('Please connect your wallet first');
      return;
    }
    
    const { amount, keyword, message } = formData;

    if (!amount || !keyword || !message) {
      alert('Please fill all fields');
      return;
    }

    try {
      // Send transaction using the context
      const txHash = await sendTransaction(creator.walletAddress);
      
      // Record donation in the backend
      await fetch('http://localhost:5000/api/auth/donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorId: creator._id,
          donorAddress: currentAccount,
          amount: formData.amount,
          transactionHash: txHash
        }),
      });

      setTransactionSuccess(true);
      setTransactionHash(txHash);
      
      // Reset form
      setFormData({ addressTo: "", amount: "0.01", keyword: "", message: "" });
      
      // Refresh creator data to update donation total
      setTimeout(() => fetchCreatorData(), 2000);
    } catch (error) {
      console.error('Error sending transaction:', error);
      alert('Transaction failed: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="creator-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading creator profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="creator-profile-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/creator" className="back-button">Back to Creators</Link>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="creator-profile-error">
        <h2>Creator Not Found</h2>
        <p>The creator you're looking for doesn't exist or has been removed.</p>
        <Link to="/creator" className="back-button">Back to Creators</Link>
      </div>
    );
  }

  return (
    <div className="creator-profile-container">
      <div className="creator-profile-header">
        <Link to="/creator" className="back-link">
          &larr; Back to Creators
        </Link>
        <h1>Creator Profile</h1>
      </div>

      <div className="creator-profile-content">
        <div className="creator-profile-card">
          <div className="creator-profile-image-container">
            {creator.profileImage ? (
              <img 
                src={creator.profileImage.startsWith('http') ? creator.profileImage : `http://localhost:5000${creator.profileImage}`} 
                alt={creator.username} 
                className="creator-profile-image" 
                onError={(e) => {
                  // If image fails to load, show placeholder instead
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="creator-profile-image-placeholder">
                {creator.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="creator-profile-details">
            <h2 className="creator-profile-name">{creator.username}</h2>
            
            <div className="creator-profile-wallet">
              <span className="wallet-label">Wallet Address:</span>
              <span className="wallet-value">{creator.walletAddress}</span>
            </div>
            
            <div className="creator-profile-joined">
              <span className="joined-label">Joined:</span>
              <span className="joined-value">
                {new Date(creator.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="creator-profile-bio">
              <h3>About</h3>
              <p>{creator.bio || 'No bio provided.'}</p>
            </div>
            
            <div className="creator-profile-stats">
              <div className="creator-profile-stat">
                <span className="stat-label">Total Received:</span>
                <span className="stat-value">{creator.totalDonations} ETH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="creator-profile-tabs">
        <button 
          className={`creator-tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button 
          className={`creator-tab ${activeTab === 'memberships' ? 'active' : ''}`}
          onClick={() => setActiveTab('memberships')}
        >
          Memberships
        </button>
        <button 
          className={`creator-tab ${activeTab === 'merchandise' ? 'active' : ''}`}
          onClick={() => setActiveTab('merchandise')}
        >
          Merchandise
        </button>
        <button 
          className={`creator-tab ${activeTab === 'support' ? 'active' : ''}`}
          onClick={() => setActiveTab('support')}
        >
          Support
        </button>
      </div>
      
      <div className="creator-profile-tab-content">
        {activeTab === 'content' && (
          <div className="creator-content">
            <h3>Latest Content</h3>
            {posts.length === 0 ? (
              <p className="no-content">This creator hasn't posted any content yet.</p>
            ) : (
              <div className="creator-posts">
                {posts.map(post => (
                  <div className="creator-post-item" key={post._id}>
                    <h4>{post.title}</h4>
                    <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
                    {post.image && (
                      <div className="post-image-container">
                        <img 
                          src={post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`} 
                          alt={post.title} 
                          className="post-image" 
                        />
                      </div>
                    )}
                    <p className="post-content">{post.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'memberships' && (
          <div className="creator-memberships">
            <h3>Membership Plans</h3>
            {membershipPlans.length === 0 ? (
              <p className="no-content">This creator doesn't have any membership plans yet.</p>
            ) : (
              <div className="plans-grid">
                {membershipPlans.map(plan => (
                  <div className="plan-card" key={plan._id}>
                    <h4 className="plan-title">{plan.title}</h4>
                    <div className="plan-price">{plan.price} ETH<span>/month</span></div>
                    <p className="plan-description">{plan.description}</p>
                    <ul className="plan-benefits">
                      {plan.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                    <button className="subscribe-btn">Subscribe</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'merchandise' && (
          <div className="creator-merchandise">
            <h3>Merchandise</h3>
            {merchandise.length === 0 ? (
              <p className="no-content">This creator doesn't have any merchandise yet.</p>
            ) : (
              <div className="merchandise-grid">
                {merchandise.map(item => (
                  <div className="merchandise-card" key={item._id}>
                    <div className="merchandise-image-container">
                      {item.image ? (
                        <img 
                          src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} 
                          alt={item.title} 
                          className="merchandise-image" 
                        />
                      ) : (
                        <div className="merchandise-image-placeholder">
                          No Image
                        </div>
                      )}
                    </div>
                    <h4 className="merchandise-title">{item.title}</h4>
                    <div className="merchandise-price">{item.price} ETH</div>
                    <p className="merchandise-description">{item.description}</p>
                    <button className="buy-btn">Buy Now</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'support' && (
          <div className="creator-profile-donation">
            <h3>Support This Creator</h3>
            
            <div className="flex w-full justify-center items-center">
              <div className="flex flex-col flex-1 items-center justify-start w-full mt-4">
                <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
                  <div className="flex justify-between flex-col w-full h-full">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                        <SiEthereum fontSize={21} color="#fff" />
                      </div>
                      <BsInfoCircle fontSize={17} color="#fff" />
                    </div>
                    <div>
                      <p className="text-white font-light text-sm">
                        {currentAccount ? shortenAddress(currentAccount) : "Connect Wallet"}
                      </p>
                      <p className="text-white font-semibold text-lg mt-1">
                        Ethereum
                      </p>
                    </div>
                  </div>
                </div>
                
                {!currentAccount ? (
                  <button 
                    className="connect-wallet-btn" 
                    onClick={connectWallet}
                  >
                    Connect Wallet to Support
                  </button>
                ) : (
                  <div className="transaction-form blue-glassmorphism">
                    <input 
                      placeholder="Amount (ETH)" 
                      name="amount" 
                      type="number"
                      step="0.0001"
                      value={formData.amount}
                      onChange={(e) => handleChange(e, "amount")}
                      className="transaction-input"
                    />
                    <input 
                      placeholder="Keyword (for GIF)" 
                      name="keyword" 
                      type="text"
                      value={formData.keyword}
                      onChange={(e) => handleChange(e, "keyword")}
                      className="transaction-input"
                    />
                    <input 
                      placeholder="Enter Message" 
                      name="message" 
                      type="text"
                      value={formData.message}
                      onChange={(e) => handleChange(e, "message")}
                      className="transaction-input"
                    />
                    
                    <div className="h-[1px] w-full bg-gray-400 my-2" />
                    
                    {isLoading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="donate-btn"
                      >
                        Send Now
                      </button>
                    )}
                  </div>
                )}
                
                {gifUrl && (
                  <div className="gif-container">
                    <h4>GIF Preview:</h4>
                    <img src={gifUrl} alt="gif" className="gif-image" />
                  </div>
                )}
                
                {transactionSuccess && (
                  <div className="transaction-success">
                    <p>Transaction successful! Thank you for your support.</p>
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${transactionHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="transaction-link"
                    >
                      View on Etherscan
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorProfile;
