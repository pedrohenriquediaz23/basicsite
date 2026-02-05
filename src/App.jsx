import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Steps from './components/Steps';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Checkout from './pages/Checkout';
import CheckoutUltra from './pages/CheckoutUltra';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import DashboardProfile from './pages/DashboardProfile';
import DashboardInvoices from './pages/DashboardInvoices';
import Docs from './pages/Docs';
import DocsFirstSteps from './pages/DocsFirstSteps';
import DocsTroubleshooting from './pages/DocsTroubleshooting';
import DocsTerms from './pages/DocsTerms';
import Download from './pages/Download';
import Status from './pages/Status';
import ChatAssistant from './components/ChatAssistant';

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Clean up state to prevent scrolling on subsequent renders if needed, 
        // though location.state persists until navigation changes. 
        // Ideally we might want to clear it, but for simple scroll it's fine.
      }
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Steps />
      <Testimonials />
      <Pricing />
      <Footer />
    </>
  );
};

function App() {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        e.keyCode === 123 ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U' || e.keyCode === 85))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    // Anti-debug interval
    const debugInterval = setInterval(() => {
      // This will pause execution if DevTools is open
      (function() {}.constructor('debugger')());
    }, 1000);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(debugInterval);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#030014] text-white font-sans selection:bg-purple-500 selection:text-white overflow-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout-ultra" element={<CheckoutUltra />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<DashboardProfile />} />
            <Route path="/dashboard/invoices" element={<DashboardInvoices />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/docs/primeiros-passos" element={<DocsFirstSteps />} />
            <Route path="/docs/solucao-de-problemas" element={<DocsTroubleshooting />} />
            <Route path="/docs/termos" element={<DocsTerms />} />
            <Route path="/download" element={<Download />} />
            <Route path="/status" element={<Status />} />
          </Routes>
          <ChatAssistant />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
