import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import { shortenAddress } from '../utils/shortenAddress';
import useFetch from '../hooks/useFetch';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalDonations, setTotalDonations] = useState(0);
  const [activeTab, setActiveTab] = useState('profile');
  const { 
    transactions = [], 
    getAllTransactions = () => {}, 
    currentAccount = '' 
  } = useContext(TransactionContext) || {};
  const [posts, setPosts] = useState([]);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [merchandise, setMerchandise] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [postImage, setPostImage] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState(null);
  const [newPlan, setNewPlan] = useState({ title: '', description: '', price: '', benefits: '' });
  const [newMerchandise, setNewMerchandise] = useState({ title: '', description: '', price: '' });
  const [merchandiseImage, setMerchandiseImage] = useState(null);
  const [merchandiseImagePreview, setMerchandiseImagePreview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    // Fetch blockchain transactions
    getAllTransactions();

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Fetch user details and donations from backend
      fetchUserData(parsedUser);
      
      // Fetch posts, membership plans, and merchandise
      if (parsedUser.userId) {
        fetchPosts(parsedUser);
        fetchMembershipPlans(parsedUser);
        fetchMerchandise(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setError('Something went wrong. Please login again.');
      setLoading(false);
    }
  }, [navigate]);

  const fetchUserData = async (userData) => {
    try {
      if (!userData.token) {
        throw new Error('No authentication token found');
      }
      
      // Fetch user profile data with JWT token
      const profileResponse = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${userData.token}`
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to authenticate user');
      }

      const profileData = await profileResponse.json();
      
      // Fetch donations data
      const donationsResponse = await fetch('http://localhost:5000/api/auth/donations', {
        headers: {
          'Authorization': `Bearer ${userData.token}`
        }
      });

      if (!donationsResponse.ok) {
        throw new Error('Failed to fetch donations data');
      }

      const donationsData = await donationsResponse.json();
      
      // Update user data with profile info from backend
      setUser(prevUser => ({
        ...prevUser,
        ...profileData.data
      }));

      // Set donations from backend
      setTotalDonations(donationsData.data.totalDonations);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Authentication failed. Please login again.');
      // If authentication fails, redirect to login
      localStorage.removeItem('user');
      setTimeout(() => navigate('/login'), 2000);
      setLoading(false);
    }
  };
  
  const fetchPosts = async (userData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/creator/${userData.userId}`, {
        headers: {
          'Authorization': `Bearer ${userData.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  const fetchMembershipPlans = async (userData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/membership-plans/creator/${userData.userId}`, {
        headers: {
          'Authorization': `Bearer ${userData.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch membership plans');
      }
      
      const data = await response.json();
      setMembershipPlans(data.data);
    } catch (error) {
      console.error('Error fetching membership plans:', error);
    }
  };
  
  const fetchMerchandise = async (userData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/merchandise/creator/${userData.userId}`, {
        headers: {
          'Authorization': `Bearer ${userData.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch merchandise');
      }
      
      const data = await response.json();
      setMerchandise(data.data);
    } catch (error) {
      console.error('Error fetching merchandise:', error);
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Redirect to home page
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {isChangingPassword && (
        <div className="password-change-modal">
          <div className="password-change-content">
            <h2>Change Password</h2>
            {passwordError && <p className="password-error">{passwordError}</p>}
            
            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
            </div>
            
            <div className="form-actions">
              <button 
                className="cancel-btn"
                onClick={() => setIsChangingPassword(false)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={async () => {
                  // Validate passwords
                  if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                    setPasswordError('All fields are required');
                    return;
                  }
                  
                  if (passwordData.newPassword !== passwordData.confirmPassword) {
                    setPasswordError('New passwords do not match');
                    return;
                  }
                  
                  try {
                    const response = await fetch('http://localhost:5000/api/auth/update-password', {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                      },
                      body: JSON.stringify({
                        currentPassword: passwordData.currentPassword,
                        newPassword: passwordData.newPassword
                      })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                      throw new Error(data.message || 'Failed to update password');
                    }
                    
                    // Close modal and show success
                    setIsChangingPassword(false);
                    alert('Password updated successfully!');
                  } catch (error) {
                    console.error('Error updating password:', error);
                    setPasswordError(error.message || 'Failed to update password');
                  }
                }}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="dashboard-header">
        <h1>Creator Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`dashboard-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'memberships' ? 'active' : ''}`}
          onClick={() => setActiveTab('memberships')}
        >
          Memberships
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'merchandise' ? 'active' : ''}`}
          onClick={() => setActiveTab('merchandise')}
        >
          Merchandise
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-tab">
            {!isEditing ? (
              <div className="profile-section">
                <div className="profile-image-container">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`} 
                      alt="Profile" 
                      className="profile-image" 
                    />
                  ) : (
                    <div className="profile-image-placeholder">
                      {user?.username?.charAt(0).toUpperCase() || 'C'}
                    </div>
                  )}
                </div>
                
                <div className="profile-details">
                  <h2>{user?.username || 'Creator'}</h2>
                  <p className="wallet-address">
                    Wallet: {user?.walletAddress ? `${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 4)}` : 'Not connected'}
                  </p>
                  {user?.bio && <p className="bio">{user.bio}</p>}
                  
                  <button 
                    className="edit-profile-btn"
                    onClick={() => {
                      setIsEditing(true);
                      setEditedUser({
                        username: user?.username || '',
                        email: user?.email || '',
                        bio: user?.bio || '',
                        socialLinks: {
                          twitter: user?.socialLinks?.twitter || '',
                          instagram: user?.socialLinks?.instagram || '',
                          youtube: user?.socialLinks?.youtube || '',
                          github: user?.socialLinks?.github || '',
                          linkedin: user?.socialLinks?.linkedin || '',
                          website: user?.socialLinks?.website || ''
                        }
                      });
                    }}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="edit-profile-form">
                <h2>Edit Your Profile</h2>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={editedUser.username}
                    onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    rows="4"
                    value={editedUser.bio}
                    onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                  ></textarea>
                </div>
                
                <div className="social-links-section">
                  <h3>Social Media Links</h3>
                  
                  <div className="form-group">
                    <label>Twitter</label>
                    <input 
                      type="text" 
                      value={editedUser.socialLinks.twitter}
                      onChange={(e) => setEditedUser({
                        ...editedUser, 
                        socialLinks: {
                          ...editedUser.socialLinks,
                          twitter: e.target.value
                        }
                      })}
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Instagram</label>
                    <input 
                      type="text" 
                      value={editedUser.socialLinks.instagram}
                      onChange={(e) => setEditedUser({
                        ...editedUser, 
                        socialLinks: {
                          ...editedUser.socialLinks,
                          instagram: e.target.value
                        }
                      })}
                      placeholder="https://instagram.com/yourusername"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>YouTube</label>
                    <input 
                      type="text" 
                      value={editedUser.socialLinks.youtube}
                      onChange={(e) => setEditedUser({
                        ...editedUser, 
                        socialLinks: {
                          ...editedUser.socialLinks,
                          youtube: e.target.value
                        }
                      })}
                      placeholder="https://youtube.com/c/yourchannel"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>GitHub</label>
                    <input 
                      type="text" 
                      value={editedUser.socialLinks.github}
                      onChange={(e) => setEditedUser({
                        ...editedUser, 
                        socialLinks: {
                          ...editedUser.socialLinks,
                          github: e.target.value
                        }
                      })}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>LinkedIn</label>
                    <input 
                      type="text" 
                      value={editedUser.socialLinks.linkedin}
                      onChange={(e) => setEditedUser({
                        ...editedUser, 
                        socialLinks: {
                          ...editedUser.socialLinks,
                          linkedin: e.target.value
                        }
                      })}
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Website</label>
                    <input 
                      type="text" 
                      value={editedUser.socialLinks.website}
                      onChange={(e) => setEditedUser({
                        ...editedUser, 
                        socialLinks: {
                          ...editedUser.socialLinks,
                          website: e.target.value
                        }
                      })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Profile Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedImage(file);
                        // Create a preview URL
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {imagePreview && (
                    <div className="image-preview-container">
                      <img 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        className="image-preview" 
                      />
                    </div>
                  )}
                </div>
                
                <div className="form-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="change-password-btn"
                    onClick={() => {
                      setIsChangingPassword(true);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordError('');
                    }}
                  >
                    Change Password
                  </button>
                  <button 
                    className="save-btn"
                    disabled={uploading}
                    onClick={async () => {
                      try {
                        setUploading(true);
                        
                        // First update profile text data
                        const profileResponse = await fetch('http://localhost:5000/api/auth/update-profile', {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                          },
                          body: JSON.stringify(editedUser)
                        });
                        
                        if (!profileResponse.ok) {
                          throw new Error('Failed to update profile');
                        }
                        
                        const profileData = await profileResponse.json();
                        let updatedUser = {...user, ...profileData.data};
                        
                        // If there's a new image, upload it
                        if (selectedImage) {
                          const formData = new FormData();
                          formData.append('profileImage', selectedImage);
                          
                          const imageResponse = await fetch('http://localhost:5000/api/auth/upload-profile-image', {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${user.token}`
                            },
                            body: formData
                          });
                          
                          if (!imageResponse.ok) {
                            throw new Error('Failed to upload profile image');
                          }
                          
                          const imageData = await imageResponse.json();
                          updatedUser = {...updatedUser, profileImage: imageData.data.profileImage};
                        }
                        
                        setUser(updatedUser);
                        setIsEditing(false);
                        setSelectedImage(null);
                        setImagePreview(null);
                      } catch (error) {
                        console.error('Error updating profile:', error);
                        alert('Failed to update profile. Please try again.');
                      } finally {
                        setUploading(false);
                      }
                    }}
                  >
                    {uploading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
            
            <div className="stats-section">
              <div className="stat-card">
                <h3>Total Donations</h3>
                <div className="stat-value">{totalDonations} ETH</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'content' && (
          <div className="content-tab">
            <h2>Your Content</h2>
            
            <div className="new-post-form">
              <h3>Create New Post</h3>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Enter post title"
                />
              </div>
              
              <div className="form-group">
                <label>Content</label>
                <textarea 
                  rows="6"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Write your post content here..."
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Image (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPostImage(file);
                      // Create a preview URL
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPostImagePreview(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {postImagePreview && (
                  <div className="post-image-preview-container">
                    <img 
                      src={postImagePreview} 
                      alt="Post Preview" 
                      className="post-image-preview" 
                    />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={() => {
                        setPostImage(null);
                        setPostImagePreview(null);
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                className="create-post-btn"
                disabled={uploading}
                onClick={async () => {
                  try {
                    if (!newPost.title || !newPost.content) {
                      alert('Please provide both title and content');
                      return;
                    }
                    
                    setUploading(true);
                    
                    // If there's an image, we need to use FormData instead of JSON
                    if (postImage) {
                      const formData = new FormData();
                      formData.append('title', newPost.title);
                      formData.append('content', newPost.content);
                      formData.append('image', postImage);
                      
                      const response = await fetch('http://localhost:5000/api/posts', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${user.token}`
                        },
                        body: formData
                      });
                      
                      if (!response.ok) {
                        throw new Error('Failed to create post');
                      }
                      
                      const data = await response.json();
                      setPosts([data.data, ...posts]);
                      setNewPost({ title: '', content: '' });
                      setPostImage(null);
                      setPostImagePreview(null);
                    } else {
                      // No image, use JSON
                      const response = await fetch('http://localhost:5000/api/posts', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${user.token}`
                        },
                        body: JSON.stringify({
                          title: newPost.title,
                          content: newPost.content
                        })
                      });
                      
                      if (!response.ok) {
                        throw new Error('Failed to create post');
                      }
                      
                      const data = await response.json();
                      setPosts([data.data, ...posts]);
                      setNewPost({ title: '', content: '' });
                    }
                  } catch (error) {
                    console.error('Error creating post:', error);
                    alert('Failed to create post. Please try again.');
                  } finally {
                    setUploading(false);
                  }
                }}
              >
                {uploading ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
            
            <div className="posts-list">
              <h3>Your Posts</h3>
              {posts.length === 0 ? (
                <p className="no-posts">You haven't created any posts yet.</p>
              ) : (
                posts.map(post => (
                  <div className="post-item" key={post._id}>
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
                    <p className="post-excerpt">{post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}</p>
                    <div className="post-actions">
                      <button 
                        className="edit-post-btn"
                        onClick={() => {
                          // Set up editing functionality
                          setNewPost({
                            id: post._id,
                            title: post.title,
                            content: post.content
                          });
                          // Scroll to the form
                          document.querySelector('.new-post-form').scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-post-btn"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this post?')) {
                            try {
                              const response = await fetch(`http://localhost:5000/api/posts/${post._id}`, {
                                method: 'DELETE',
                                headers: {
                                  'Authorization': `Bearer ${user.token}`
                                }
                              });
                              
                              if (!response.ok) {
                                throw new Error('Failed to delete post');
                              }
                              
                              // Remove post from state
                              setPosts(posts.filter(p => p._id !== post._id));
                            } catch (error) {
                              console.error('Error deleting post:', error);
                              alert('Failed to delete post. Please try again.');
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'memberships' && (
          <div className="memberships-tab">
            <h2>Membership Plans</h2>
            
            <div className="new-plan-form">
              <h3>Create New Membership Plan</h3>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
                  placeholder="e.g. Silver, Gold, Premium"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows="3"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                  placeholder="Describe what this membership offers"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Price (ETH per month)</label>
                <input 
                  type="number" 
                  step="0.001"
                  min="0.001"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                  placeholder="0.05"
                />
              </div>
              
              <div className="form-group">
                <label>Benefits (one per line)</label>
                <textarea 
                  rows="4"
                  value={newPlan.benefits}
                  onChange={(e) => setNewPlan({...newPlan, benefits: e.target.value})}
                  placeholder="Exclusive content\nEarly access\nDirectly message creator"
                ></textarea>
              </div>
              
              <button 
                className="create-plan-btn"
                onClick={async () => {
                  try {
                    if (!newPlan.title || !newPlan.price) {
                      alert('Please provide at least a title and price');
                      return;
                    }
                    
                    const response = await fetch('http://localhost:5000/api/membership-plans', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                      },
                      body: JSON.stringify({
                        title: newPlan.title,
                        description: newPlan.description,
                        price: parseFloat(newPlan.price),
                        benefits: newPlan.benefits.split('\n').filter(b => b.trim() !== '')
                      })
                    });
                    
                    if (!response.ok) {
                      throw new Error('Failed to create membership plan');
                    }
                    
                    const data = await response.json();
                    setMembershipPlans([data.data, ...membershipPlans]);
                    setNewPlan({ title: '', description: '', price: '', benefits: '' });
                  } catch (error) {
                    console.error('Error creating membership plan:', error);
                    alert('Failed to create membership plan. Please try again.');
                  }
                }}
              >
                Create Plan
              </button>
            </div>
            
            <div className="plans-list">
              <h3>Your Membership Plans</h3>
              {membershipPlans.length === 0 ? (
                <p className="no-plans">You haven't created any membership plans yet.</p>
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
                      <div className="plan-actions">
                        <button 
                          className="edit-plan-btn"
                          onClick={() => {
                            // Set up editing functionality
                            setNewPlan({
                              id: plan._id,
                              title: plan.title,
                              description: plan.description,
                              price: plan.price.toString(),
                              benefits: plan.benefits.join('\n')
                            });
                            // Scroll to the form
                            document.querySelector('.new-plan-form').scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-plan-btn"
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this membership plan?')) {
                              try {
                                const response = await fetch(`http://localhost:5000/api/membership-plans/${plan._id}`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Authorization': `Bearer ${user.token}`
                                  }
                                });
                                
                                if (!response.ok) {
                                  throw new Error('Failed to delete membership plan');
                                }
                                
                                // Remove plan from state
                                setMembershipPlans(membershipPlans.filter(p => p._id !== plan._id));
                              } catch (error) {
                                console.error('Error deleting membership plan:', error);
                                alert('Failed to delete membership plan. Please try again.');
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'merchandise' && (
          <div className="merchandise-tab">
            <h2>Your Merchandise</h2>
            
            <div className="new-merchandise-form">
              <h3>Create New Merchandise</h3>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={newMerchandise.title}
                  onChange={(e) => setNewMerchandise({...newMerchandise, title: e.target.value})}
                  placeholder="Enter merchandise title"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows="3"
                  value={newMerchandise.description}
                  onChange={(e) => setNewMerchandise({...newMerchandise, description: e.target.value})}
                  placeholder="Describe your merchandise"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Price (ETH)</label>
                <input 
                  type="number" 
                  step="0.001"
                  min="0.001"
                  value={newMerchandise.price}
                  onChange={(e) => setNewMerchandise({...newMerchandise, price: e.target.value})}
                  placeholder="0.05"
                />
              </div>
              
              <div className="form-group">
                <label>Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setMerchandiseImage(file);
                      // Create a preview URL
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setMerchandiseImagePreview(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {merchandiseImagePreview && (
                  <div className="merchandise-image-preview-container">
                    <img 
                      src={merchandiseImagePreview} 
                      alt="Merchandise Preview" 
                      className="merchandise-image-preview" 
                    />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={() => {
                        setMerchandiseImage(null);
                        setMerchandiseImagePreview(null);
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                className="create-merchandise-btn"
                disabled={uploading}
                onClick={async () => {
                  try {
                    if (!newMerchandise.title || !newMerchandise.description || !newMerchandise.price) {
                      alert('Please provide title, description, and price');
                      return;
                    }
                    
                    if (!merchandiseImage) {
                      alert('Please upload an image for your merchandise');
                      return;
                    }
                    
                    setUploading(true);
                    
                    const formData = new FormData();
                    formData.append('title', newMerchandise.title);
                    formData.append('description', newMerchandise.description);
                    formData.append('price', newMerchandise.price);
                    formData.append('image', merchandiseImage);
                    
                    const response = await fetch('http://localhost:5000/api/merchandise', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${user.token}`
                      },
                      body: formData
                    });
                    
                    if (!response.ok) {
                      throw new Error('Failed to create merchandise');
                    }
                    
                    const data = await response.json();
                    setMerchandise([data.data, ...merchandise]);
                    setNewMerchandise({ title: '', description: '', price: '' });
                    setMerchandiseImage(null);
                    setMerchandiseImagePreview(null);
                  } catch (error) {
                    console.error('Error creating merchandise:', error);
                    alert('Failed to create merchandise. Please try again.');
                  } finally {
                    setUploading(false);
                  }
                }}
              >
                {uploading ? 'Creating...' : 'Create Merchandise'}
              </button>
            </div>
            
            <div className="merchandise-list">
              <h3>Your Merchandise</h3>
              {merchandise.length === 0 ? (
                <p className="no-merchandise">You haven't created any merchandise yet.</p>
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
                      <div className="merchandise-actions">
                        <button 
                          className="edit-merchandise-btn"
                          onClick={() => {
                            // Set up editing functionality
                            setNewMerchandise({
                              id: item._id,
                              title: item.title,
                              description: item.description,
                              price: item.price.toString()
                            });
                            // Scroll to the form
                            document.querySelector('.new-merchandise-form').scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-merchandise-btn"
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this merchandise?')) {
                              try {
                                const response = await fetch(`http://localhost:5000/api/merchandise/${item._id}`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Authorization': `Bearer ${user.token}`
                                  }
                                });
                                
                                if (!response.ok) {
                                  throw new Error('Failed to delete merchandise');
                                }
                                
                                // Remove merchandise from state
                                setMerchandise(merchandise.filter(m => m._id !== item._id));
                              } catch (error) {
                                console.error('Error deleting merchandise:', error);
                                alert('Failed to delete merchandise. Please try again.');
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <h2>Analytics & Insights</h2>
            
            <div className="analytics-cards">
              <div className="analytics-card">
                <h3>Total Supporters</h3>
                <div className="analytics-value">12</div>
              </div>
              
              <div className="analytics-card">
                <h3>Monthly Revenue</h3>
                <div className="analytics-value">0.85 ETH</div>
              </div>
              
              <div className="analytics-card">
                <h3>Content Views</h3>
                <div className="analytics-value">256</div>
              </div>
            </div>
            
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon donation"></div>
                  <div className="activity-details">
                    <p><strong>New Donation</strong> - 0.05 ETH from 0x71C...3E4F</p>
                    <p className="activity-time">2 hours ago</p>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon subscription"></div>
                  <div className="activity-details">
                    <p><strong>New Subscriber</strong> - Gold Plan from 0x8A2...9B3C</p>
                    <p className="activity-time">1 day ago</p>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon view"></div>
                  <div className="activity-details">
                    <p><strong>Content Milestone</strong> - Your post "Ethereum 2.0 Explained" reached 100 views</p>
                    <p className="activity-time">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
