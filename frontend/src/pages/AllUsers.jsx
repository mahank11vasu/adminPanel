import { useState } from "react";
import { Box, Card, Container, Modal } from "@mui/material";
import Sidebar from "../components/Sidebar";
import useUserStore from "../store/userStore";
import "../styles/AllUsers.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AllUsers = () => {
  const { fetchUsers, updateUser, deleteUser } = useUserStore();
  const { data: users, isLoading } = fetchUsers();
  const updateMutation = updateUser();
  const deleteMutation = deleteUser();

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    role: "",
    profileImage: null,
  });

  const handleOpen = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      age: user.age,
      phone: user.phone,
      role: user.role,
      profileImage: null,
    });
    setOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;
    updateMutation.mutate({ id: selectedUser._id, formData });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="all-users-container">
      <Sidebar />
      <div className="users-content">
        <Container maxWidth="md">
          <h2>All Users</h2>
          {isLoading ? <p>Loading users...</p> : (
            <Box className="users-box">
              {users?.map((user) => (
                <Card key={user._id} className="user-card">
                  <img src={`${API_BASE_URL}/${user.profileImage}`} alt="Profile" className="user-image" />
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Age:</strong> {user.age}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <button onClick={() => handleOpen(user)}>Edit</button>
                  <button onClick={() => handleDelete(user._id)} className="delete-btn">Delete</button>
                </Card>
              ))}
            </Box>
          )}
        </Container>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="modal-content">
          <h2>Edit User</h2>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          <select name="role" value={formData.role} onChange={handleChange} required>
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
          <button onClick={handleSubmit}>Save</button>
          <button onClick={() => setOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default AllUsers;