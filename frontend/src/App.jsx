import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./Pages/Home";
import Auth from "./Services/Auth";
import ProductPage from "./Pages/ProductPage";
import ScrollToTop from "./constants/ScrollToTop";
import { AdminProvider } from "./context/AdminProvider";
import { useAdmin } from "./context/useAdmin";
import { AdminLayout } from "./components/admin/AdminLayout";
import PublicLayout from "./components/PublicLayout";
import { Dashboard } from "./Pages/admin/Dashboard";
import { Products } from "./Pages/admin/Products";
import { Orders } from "./Pages/admin/Orders";
import { Users } from "./Pages/admin/Users";
import CartPage from "./Pages/CartPage";
import WishlistPage from "./Pages/WishlistPage";
import { useAuth } from "./Hooks/useAuth";
import CatalogPage from "./Pages/CatalogPage";
import CheckoutPage from "./Pages/CheckoutPage";
import "./App.css";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { admin } = useAdmin();
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(admin.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { admin } = useAdmin();
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!["admin", "devAdmin"].includes(admin.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Auth />} />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
        </Route>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["devAdmin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AnimatedRoutes />
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
