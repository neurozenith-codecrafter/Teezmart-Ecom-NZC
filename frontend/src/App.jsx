import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Auth from "./Services/Auth";
import ProductPage from "./Pages/ProductPage";
import ScrollToTop from "./constants/ScrollToTop";
import { AdminProvider } from "./context/AdminProvider";
import { useAdmin } from "./context/useAdmin";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Dashboard } from "./Pages/admin/Dashboard";
import { Products } from "./Pages/admin/Products";
import { Orders } from "./Pages/admin/Orders";
import { Users } from "./Pages/admin/Users";
import "./App.css";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { admin } = useAdmin();
  if (!allowedRoles.includes(admin.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/product/:id" element={<ProductPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={["DEV_ADMIN"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
