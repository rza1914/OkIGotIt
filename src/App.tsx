import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import RequireAuth from './routes/RequireAuth';
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import BlogManagement from "./admin/BlogManagement";

function App() {
  return (
    <Routes>
      {/* Customer/User Routes */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="blog" element={<Blog />} />
        <Route element={<RequireAuth />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
      
      {/* Admin Routes - Separate from customer layout */}
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}

// Admin routes component with protected routes
const AdminRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="banners" element={<Admin />} />
    <Route path="blog" element={<BlogManagement />} />
    <Route path="orders" element={<ComingSoon title="Order Management" />} />
    <Route path="products" element={<ComingSoon title="Product Management" />} />
    <Route path="users" element={<ComingSoon title="User Management" />} />
    <Route path="settings" element={<ComingSoon title="Settings" />} />
    {/* Redirect /admin to /admin/dashboard */}
    <Route index element={<AdminDashboard />} />
  </Routes>
);

// Coming Soon component for placeholder pages
const ComingSoon = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600 mb-8">This feature is coming soon!</p>
      <a 
        href="/admin/dashboard" 
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        ← Back to Dashboard
      </a>
    </div>
  </div>
);

export default App;
