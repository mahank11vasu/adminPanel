import { useState, useEffect } from "react";
import { Box, Card, Container, Modal } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { fetchRoles, fetchRolePermissions, updateRolePermissions } from "../api/roleApi";
import "../styles/ManagePermissions.css";

const availablePages = ["Dashboard", "Profile", "Products", "All Users", "Settings", "Manage Permissions"];

const ManagePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);

  useEffect(() => {
    const getRoles = async () => {
      const data = await fetchRoles();
      setRoles(data || []);
    };
    getRoles();
  }, []);

  const handleOpenModal = async (role) => {
    setSelectedRole(role);
    const permissions = await fetchRolePermissions(role);
    setRolePermissions(permissions);
    setOpen(true);
  };

  const handleGrantPermission = async (page) => {
    if (!selectedRole) return;
    const updatedPermissions = [...new Set([...rolePermissions, page])];
    setRolePermissions(updatedPermissions);
    await updateRolePermissions(selectedRole, updatedPermissions);
  };

  const handleRemovePermission = async (page) => {
    if (!selectedRole) return;
    const updatedPermissions = rolePermissions.filter((perm) => perm !== page);
    setRolePermissions(updatedPermissions);
    await updateRolePermissions(selectedRole, updatedPermissions);
  };

  return (
    <div className="permissions-container">
      <Sidebar />
      <div className="permissions-content">
        <Container maxWidth="md">
          <Box className="permissions-box">
            <h2>Manage Role Permissions</h2>
            <div className="roles-list">
              {roles.map((role) => (
                <Card key={role} className="role-card">
                  <h3>{role}</h3>
                  <button className="manage-btn" onClick={() => handleOpenModal(role)}>Manage Permissions</button>
                </Card>
              ))}
            </div>
          </Box>
        </Container>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="modal-content">
          <h2>Manage Permissions for {selectedRole}</h2>
          <div className="permissions-modal">
            <div className="available-pages">
              <h4>Available Pages</h4>
              {availablePages.map((page) => (
                <div key={page} className="permission-item">
                  <span>{page}</span>
                  <button className="grant-btn" onClick={() => handleGrantPermission(page)}>Grant</button>
                </div>
              ))}
            </div>

            <div className="granted-pages">
              <h4>Granted Permissions</h4>
              {rolePermissions.length > 0 ? (
                rolePermissions.map((page) => (
                  <div key={page} className="granted-item">
                    <span>{page}</span>
                    <button className="remove-btn" onClick={() => handleRemovePermission(page)}>Remove</button>
                  </div>
                ))
              ) : (
                <p>No permissions assigned</p>
              )}
            </div>
          </div>
          <button className="close-btn" onClick={() => setOpen(false)}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default ManagePermissions;