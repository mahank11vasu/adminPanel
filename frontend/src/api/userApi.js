import apiClient from "./apiClient";

export const registerUser = async (formData) => {
  try {
    const response = await apiClient.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed!";
  }
};

export const loginUser = async (identifier, password) => {
  const response = await apiClient.post(
    "/users/login",
    { identifier, password },
    { withCredentials: true } 
  );
  return response.data;
};

export const getSessionUser = async () => {
  try {
    const response = await apiClient.get("/users/session", { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null; 
    }
    throw error.response?.data?.message || "Failed to fetch session!";
  }
};

export const logoutUser = async () => {
  await apiClient.post("/users/logout", {}, { withCredentials: true });
};

export const updateUserProfile = async (userId, formData) => {
  if (!userId) {
    throw new Error("User ID is required for profile update!");
  }

  try {
    const response = await apiClient.put(`/users/update/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return response.data.user;
  } catch (error) {
    throw error.response?.data?.message || "Profile update failed!";
  }
};

export const getAllUsers = async () => {
  const response = await apiClient.get("/users/all");
  return response.data;
};


export const deleteUser = async (id) => {
  await apiClient.delete(`/users/delete/${id}`);
};

export const updateUser = async (id, formData) => {
  const response = await apiClient.put(`/users/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};