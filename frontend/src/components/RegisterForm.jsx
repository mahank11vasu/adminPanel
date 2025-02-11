import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import { Box, Card, Container } from "@mui/material";
import "../styles/Auth.css";

const Register = () => {
  const { registerUser, error, success, setError } = useUserStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    verifyPassword: "",
    age: "",
    phone: "",
    role: "",
    profileImage: null,
  });

  useEffect(() => {
    setError(null);
  }, [setError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(formData);
  };

  return (
    <Container maxWidth="sm">
      <Box className="auth-box">
        <Card className="auth-card">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" name="verifyPassword" placeholder="Verify Password" onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
            <select name="role" onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="manager">Manager</option>
              <option value="player">Player</option>
              <option value="backend dev">Backend Developer</option>
              <option value="frontend dev">Frontend Developer</option>
              <option value="editor">Editor</option>
              <option value="organizer">Organizer</option>
              <option value="customer">Customer</option>
              <option value="subscriber">Subscriber</option>
            </select>
            <input type="file" name="profileImage" onChange={handleFileChange} />
            <button type="submit">Register</button>
          </form>

          {error && (
            <div className="error-box">
              {Array.isArray(error) ? error.map((err, idx) => <p key={idx} className="error">{err}</p>) : <p className="error">{error}</p>}
            </div>
          )}

          {success && <p className="success">{success}</p>}
          <button className="link-btn" onClick={() => navigate("/")}>Go Back to Login</button>
        </Card>
      </Box>
    </Container>
  );
};

export default Register;