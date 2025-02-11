import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); 
  };

  return (
    <nav className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;