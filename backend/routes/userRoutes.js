import express from "express";
import { login, register, logout, getUser ,otpSend , verification } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/OTP-send",isAuthenticated,otpSend)
router.post("/verify-otp",isAuthenticated,verification)
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);

export default router;