import apiClient from "./apiClient";

export const fetchRoles = async () => {
  try {
    const response = await apiClient.get("/roles");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch roles");
  }
};

export const fetchRolePermissions = async (role) => {
  try {
    const response = await apiClient.get(`/roles/${role}/permissions`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch role permissions");
  }
};

export const getRolePermissions = async (role) => {
  try {
    const response = await apiClient.get(`/roles/${role}/permissions`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch role permissions");
  }
};

export const updateRolePermissions = async (role, permissions) => {
  try {
    const response = await apiClient.put(`/roles/${role}/permissions`, { permissions });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update role permissions");
  }
};