import { Box, Card, Container } from "@mui/material";
import Sidebar from "../components/Sidebar";
import useUserStore from "../store/userStore";
import "../styles/Dashboard.css"; 

const Dashboard = () => {
  const { user } = useUserStore();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Container maxWidth="md">
          <Box className="dashboard-box">
            <Card className="dashboard-card">
              <h2>Welcome, {user?.name}!</h2>
              <p>Your role: <strong>{user?.role}</strong></p>
            </Card>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;