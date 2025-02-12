import Role from "../models/roleModel.js";
import User from "../models/userModel.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await User.distinct("role"); 
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles", error });
  }
};

export const getRolePermissions = async (req, res) => {
  try {
    const role = await Role.findOne({ role: req.params.role });
    
    if (!role) {
      return res.status(404).json({ message: "Role not found!" });
    }
    res.json(role.permissions);
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const updateRolePermissions = async (req, res) => {
  try {
    const { role } = req.params;
    const { permissions } = req.body;

    let roleData = await Role.findOne({ role });
    if (!roleData) {
      roleData = new Role({ role, permissions });
    } else {
      roleData.permissions = permissions;
    }

    await roleData.save();
    res.json({ message: "Permissions updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating permissions", error });
  }
};