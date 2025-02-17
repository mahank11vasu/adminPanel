import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AllUsers from "./pages/AllUsers";
import AddProducts from "./pages/AddProducts";
import EditProduct from "./pages/EditProduct";
import ManagePermissions from "./pages/ManagePermission";
import useUserStore from "./store/userStore";
import { useSession } from "./store/userStore";
import PromoCodeManager from "./components/PromoCodeManager/page";
import "./App.css";

function App() {
  const { user } = useUserStore();
  const { data, isLoading } = useSession();

  if (isLoading) return <h2>Loading...</h2>;

  function ProtectedRoute({ children, permission }) {
    const { user } = useUserStore();
    if (!user) return <Navigate to="/" />;
    if (permission && !user.permissions?.includes(permission)) return <Navigate to="/dashboard" />;
    return children;
  }

  return (
    <Router>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

          <Route path="/dashboard" element={<ProtectedRoute permission="Dashboard"><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute permission="Profile"><Profile /></ProtectedRoute>} />
          <Route path="/all-users" element={<ProtectedRoute permission="All Users"><AllUsers /></ProtectedRoute>} />
          <Route path="/products/add" element={<ProtectedRoute permission="Products"><AddProducts /></ProtectedRoute>} />
          <Route path="/products/edit" element={<ProtectedRoute permission="Products"><EditProduct /></ProtectedRoute>} />
          <Route path="/manage-permissions" element={<ProtectedRoute permission="Manage Permissions"><ManagePermissions /></ProtectedRoute>} />
          <Route path="/promo-codes" element={<PromoCodeManager />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;