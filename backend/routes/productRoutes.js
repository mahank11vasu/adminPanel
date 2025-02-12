import express from "express";
import { addProduct, getAllProducts, updateProduct, deleteProduct } from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/add", upload.single("productImage"), addProduct);
router.get("/all", getAllProducts);
router.put("/edit/:id", upload.single("productImage"), updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;