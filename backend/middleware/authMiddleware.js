import Role from "../models/roleModel.js";

export const checkPermission = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRole = req.session.user.role;
    const requestedPage = req.path.split("/")[1];

    const role = await Role.findOne({ role: userRole });

    if (!role || !role.permissions.includes(requestedPage)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next(); 
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

