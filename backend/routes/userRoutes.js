import express from "express";
import { registerUser, upload, loginUser, logoutUser, getSessionUser, updateUser, getAllUsers, deleteUser } from "../controllers/userController.js";
import { validateLogin, validateRegistration } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("profileImage"), validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/logout", logoutUser);
router.get("/session", getSessionUser);
router.put("/update/:id", upload.single("profileImage"), updateUser); 
router.get("/all", getAllUsers);
router.delete("/delete/:id", deleteUser);

export default router;