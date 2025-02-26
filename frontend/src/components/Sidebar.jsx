import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import { useSession } from "../store/userStore"; 
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { user, logout } = useUserStore();  
  const { data: sessionData, isLoading } = useSession(); 
  const navigate = useNavigate();
  const [showProducts, setShowProducts] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userPermissions = user?.permissions ?? [];

  if (isLoading) return <p>Loading sidebar...</p>;

  return (
    <nav className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul>
        {userPermissions.includes("Dashboard") && (
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        )}
        {userPermissions.includes("Profile") && (
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        )}
        {userPermissions.includes("All Users") && (
          <li>
            <Link to="/all-users">All Users</Link>
          </li>
        )}
        {userPermissions.includes("Products") && (
          <li>
            <button onClick={() => setShowProducts(!showProducts)}>Products ▼</button>
            {showProducts && (
              <ul className="dropdown">
                {userPermissions.includes("Products") && <li><Link to="/products/add">Add Product</Link></li>}
                {userPermissions.includes("Products") && <li><Link to="/products/edit">Edit Product</Link></li>}
              </ul>
            )}
          </li>
        )}
        {userPermissions.includes("Manage Permissions") && (
          <li>
            <Link to="/manage-permissions">Manage Permissions</Link>
          </li>
        )}
        {userPermissions.includes("Settings") && (
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        )}
        <li>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;