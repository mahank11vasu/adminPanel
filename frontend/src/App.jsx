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

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        <Route path="/all-users" element={user ? <AllUsers /> : <Navigate to="/" />} />
        <Route path="/products/add" element={user ? <AddProducts /> : <Navigate to="/" />} />
        <Route path="/products/edit" element={user ? <EditProduct /> : <Navigate to="/" />} />
        <Route path="/manage-permissions" element={user ? <ManagePermissions /> : <Navigate to ="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;