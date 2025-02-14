import { Router } from "express";
import { verifyJWT } from "../middleware/authMiddleware";
import { userLogin, userSignup } from "../controllers/auth";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/user";

const router = Router();

// Authentication Routes
router.post("/auth/signup", userSignup); // Create User
router.post("/auth/login", userLogin);

// USER routes
router.get("/users", verifyJWT, getAllUsers);
router.get("/users/:id", verifyJWT, getUser);
router.put("/users/:id", verifyJWT, updateUser);
router.delete("/users/:id", verifyJWT, deleteUser);

export default router;
