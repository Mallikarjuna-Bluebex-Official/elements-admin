import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingHistory from './pages/BookingHistory';
import GetEvents from './pages/GetEvents';
import GetAddOn from './pages/GetAddOn';
import MyProfile from './pages/MyProfile';
import PaymentIntegration from './pages/PaymentIntegration';
import Transaction from './pages/Transaction'
import InvoiceTemplate1 from './components/InvoiceTemplate1';
import InvoiceTemplate2 from './components/InvoiceTemplate2';
import InvoiceTemplate3 from './components/InvoiceTemplate3';
import InvoiceTemplate4 from './components/InvoiceTemplate4';
import SelectInvoice from './pages/SelectInvoice';
import InvoiceTemplate5 from './components/InvoiceTemplate5';
import PromoAdminPanel from './components/Promo';
import MediaUpload from './components/MediaUpload';


// Utility function
const isAuthenticated = () => !!sessionStorage.getItem('token');

// Wrapper for protected routes
const Protected = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Prevent login page for logged-in users
const PublicOnly = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />

          {/* Protected Routes */}
          <Route path="/media" element={<Protected><MediaUpload /></Protected>} />
          <Route path="/promo" element={<Protected><PromoAdminPanel /></Protected>} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/events" element={<Protected><GetEvents /></Protected>} />
          <Route path="/add-ons" element={<Protected><GetAddOn /></Protected>} />
          <Route path="/history" element={<Protected><BookingHistory /></Protected>} />
          <Route path="/profile" element={<Protected><MyProfile /></Protected>} />
          <Route path="/transaction" element={<Protected><Transaction /></Protected>} />
          <Route path="/payment" element={<Protected><PaymentIntegration /></Protected>} />
          <Route path="/select-invoice" element={<Protected><SelectInvoice /></Protected>} />
          <Route path="/invoice-temp1/:bookingId" element={<Protected><InvoiceTemplate1 /></Protected>} />
          <Route path="/invoice-temp2/:bookingId" element={<Protected><InvoiceTemplate2 /></Protected>} />
          <Route path="/invoice-temp3/:bookingId" element={<Protected><InvoiceTemplate3 /></Protected>} />
          <Route path="/invoice-temp4/:bookingId" element={<Protected><InvoiceTemplate4 /></Protected>} />
          <Route path="/invoice-temp5/:bookingId" element={<Protected><InvoiceTemplate5 /></Protected>} />

          {/* Default redirect logic */}
          <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;