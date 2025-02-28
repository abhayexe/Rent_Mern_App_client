// Import necessary components and pages
import Home from './pages/Home';
import Resource from './pages/resource';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LogIn from './pages/login';
import Signup from './pages/signup';
import ContactUs from './pages/ContactUs';
import Profile from './pages/Profile';
import Admin from './pages/Admin'; // Import the Admin page
import { Routes, Route, useLocation } from "react-router-dom";
import ViewResources from './components/viewResources/ViewResources';
import AdminDashboard from './pages/AdminDashboard';
import AddResources from './pages/AddResources';
import UpdateResources from './pages/UpdateResources';
import RemoveResources from './pages/RemoveResources';
import ViewAllResources from './pages/ViewAllResources';

const App = () => {
  const location = useLocation();

  // Determine if the current route is for admins
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Render Navbar only for non-admin routes */}
      {!isAdminRoute && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resource />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} /> {/* Admin route added */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Admin Dashboard route */}
          <Route path="view-resource-details/:id" element={<ViewResources />} />
          <Route path="/admin-dashboard/add-resource" element={<AddResources />} />
          <Route path="admin-dashboard/update-resource" element={<UpdateResources />} />
          <Route path="admin-dashboard/delete-resource" element={<RemoveResources />} />
          <Route path="admin-dashboard" element={<ViewAllResources />} />
          <Route
            path="*"
            element={
              <div className="text-center py-16 text-red-600 text-xl">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
