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
import "./App.css";

function App() {
  const { user } = useUserStore();
  const { data, isLoading } = useSession();

  if (isLoading) return <h2>Loading...</h2>;

  const userPermissions = user?.permissions ?? [];

  return (
    <Router>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
  
          {userPermissions.includes("Dashboard") && <Route path="/dashboard" element={<Dashboard />} />}
          {userPermissions.includes("Profile") && <Route path="/profile" element={<Profile />} />}
          {userPermissions.includes("All Users") && <Route path="/all-users" element={<AllUsers />} />}
          {userPermissions.includes("Products") && (
            <>
              <Route path="/products/add" element={<AddProducts />} />
              <Route path="/products/edit" element={<EditProduct />} />
            </>
          )}
          {userPermissions.includes("Manage Permissions") && <Route path="/manage-permissions" element={<ManagePermissions />} />}
  
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;