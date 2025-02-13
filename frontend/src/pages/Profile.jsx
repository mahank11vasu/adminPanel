import { useState } from "react";
import { Box, Card, Container, Modal } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useMutation, useQuery } from "@tanstack/react-query";
import useUserStore, { useSession } from "../store/userStore";
import { updateUserProfile } from "../api/userApi";
import "../styles/Profile.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const { user, setUser } = useUserStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "",
    phone: user?.phone || "",
    role: user?.role || "",
    profileImage: null,
  });

  const { data: sessionData, isLoading } = useSession();

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, formData }) => updateUserProfile(id, formData),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setOpen(false);
    },
  });

  if (isLoading) return <p>Loading profile...</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      console.error("User ID is missing!");
      return;
    }

    await updateProfileMutation.mutateAsync({ id: user.id, formData });
  };

  const profileImageUrl = user?.profileImage ? `${API_BASE_URL}/${user.profileImage}` : null;

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-content">
        <Container maxWidth="md">
          <Box className="profile-box">
            <Card className="profile-card">
              <h2>User Profile</h2>
              <div className="user-info">
                {profileImageUrl && <img src={profileImageUrl} alt="Profile" className="profile-image" />}
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Age:</strong> {user?.age}</p>
                <p><strong>Phone:</strong> {user?.phone}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </div>
              <button onClick={() => setOpen(true)}>Edit Profile</button>
            </Card>
          </Box>
        </Container>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="modal-content">
          <h2>Edit Profile</h2>
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
          <button onClick={handleSubmit} disabled={updateProfileMutation.isLoading}>
            {updateProfileMutation.isLoading ? "Saving..." : "Save"}
          </button>
          <button onClick={() => setOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;