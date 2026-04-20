import express from "express";
import {
  register,
  login,
  logout,
  refresh,
  me,
} from "../controllers/authController.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

const registerValidation = [
  body("username").notEmpty().trim().escape(),
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

router.post("/register", registerValidation, register);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login,
);

router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", me);

export default router;
