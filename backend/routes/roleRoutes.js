import express from "express";
import {
  getRoles,
  getRolePermissions,
  updateRolePermissions,
} from "../controllers/roleController.js";

const router = express.Router();

router.get("/", getRoles); 
router.get("/:role/permissions", getRolePermissions); 
router.put("/:role/permissions", updateRolePermissions); 

export default router;