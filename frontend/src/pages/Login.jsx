import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import { Box, Card, Container } from "@mui/material";
import "../styles/Auth.css"; 

const Login = () => {
  const { login, error } = useUserStore();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(identifier, password);
  };

  return (
    <Container maxWidth="sm">
      <Box className="auth-box">
        <Card className="auth-card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username or Email" onChange={(e) => setIdentifier(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
          {error && <p className="error">{error}</p>}
          <button className="link-btn" onClick={() => navigate("/register")}>New? Register Here</button>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;