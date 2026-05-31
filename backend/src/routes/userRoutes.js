import express from "express";
import { searchUsers } from "../controllers/userController.js";
import { sendRequest, acceptRequest } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../controllers/userController.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/search", searchUsers);
router.get("/all", getAllUsers);
router.post("/requests/:id", protect, sendRequest);
router.put("/requests/:id", protect, acceptRequest);

router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  
  }
});

export default router;
