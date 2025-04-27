import { Routes, Route } from 'react-router-dom';
import { TransactionsProvider } from './context/TransactionContext';
import HeroSectionHomePage from './pages/heroSectionHomePage';
import Footer from './pages/Footer';
import Navbar from './pages/Navbar';
import About from './pages/About';
import Contact from './pages/Contact';
import Features from './pages/Features';
import SignupPage from './pages/Signup';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Creators from './pages/Creators';
import CreatorProfile from './pages/CreatorProfile';
import Pricing from './pages/Pricing';


function App() {
  return (
    <TransactionsProvider>
      <div className="flex flex-col h-screen"> {/* Wrapper to handle flex layout */}
        <Navbar/>
        <Routes>
          <Route path="/" element={<HeroSectionHomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/creator" element={<Creators />} />
          <Route path="/creator/:id" element={<CreatorProfile />} />
        </Routes>
        {window.location.pathname !== '/dashboard' && window.location.pathname.indexOf('/creator/') !== 0 && <Footer />}
      </div>
    </TransactionsProvider>
  );
}

export default App;
