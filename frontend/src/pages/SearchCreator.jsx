import React, { useState } from 'react';
import './SearchCreator.css';

function SearchCreators() {
  const [searchTerm, setSearchTerm] = useState('');

  const creators = [
    {
      id: 1,
      name: "Aarav Sharma",
      project: "GreenChain",
      description: "Building a blockchain-based platform for carbon tracking and trading.",
      profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Meera Patel",
      project: "Artify",
      description: "Empowering local artists to tokenize and sell their artwork digitally.",
      profilePic: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      id: 3,
      name: "Kabir Rao",
      project: "EduFund",
      description: "A decentralized crowdfunding platform for students' education.",
      profilePic: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      id: 4,
      name: "Riya Sen",
      project: "HealthOnChain",
      description: "A blockchain system for transparent healthcare data management.",
      profilePic: "https://randomuser.me/api/portraits/women/66.jpg",
    },
    {
      id: 5,
      name: "Aditya Mehra",
      project: "MetaMall",
      description: "Building a decentralized shopping experience inside the metaverse.",
      profilePic: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      id: 6,
      name: "Saanvi Kapoor",
      project: "MusicMint",
      description: "Allowing independent musicians to mint their albums as NFTs.",
      profilePic: "https://randomuser.me/api/portraits/women/34.jpg",
    },
    {
      id: 7,
      name: "Ishaan Khurana",
      project: "ChainVotes",
      description: "A Web3 voting platform making elections transparent and tamper-proof.",
      profilePic: "https://randomuser.me/api/portraits/men/78.jpg",
    },
    {
      id: 8,
      name: "Tara Gupta",
      project: "HealNet",
      description: "Decentralized telemedicine network connecting doctors worldwide.",
      profilePic: "https://randomuser.me/api/portraits/women/82.jpg",
    },
    {
      id: 9,
      name: "Neeraj Verma",
      project: "SkillBlock",
      description: "Helping freelancers prove their skills and portfolios on blockchain.",
      profilePic: "https://randomuser.me/api/portraits/men/21.jpg",
    },
    {
      id: 10,
      name: "Simran Ahuja",
      project: "CryptoCare",
      description: "Fundraising for health emergencies using cryptocurrencies.",
      profilePic: "https://randomuser.me/api/portraits/women/29.jpg",
    },
  ];
  

  const filteredCreators = creators.filter(creator =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search-creators-page">
      <div className="search-creators-header">
        <h1>Discover Creators</h1>
        <p>Find and support passionate innovators 🚀</p>

        <input
          type="text"
          placeholder="Search by name or project..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="search-creators-content">
        {filteredCreators.length > 0 ? (
          filteredCreators.map((creator, index) => (
            <div className="creator-card" key={index}>
             <img src={creator.profilePic} alt={creator.name} className="creator-profile-pic" />
<h2>{creator.name}</h2>
<h3>{creator.project}</h3>
<p>{creator.description}</p>

            </div>
          ))
        ) : (
          <p className="no-results">No creators found.</p>
        )}
      </div>

      <div className="search-creators-footer">
        <p>FundMyChai — Brewing decentralized dreams ☕🌍</p>
      </div>
    </div>
  );
}

export default SearchCreators;
