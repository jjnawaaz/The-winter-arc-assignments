import express from "express";
import { signinUser, signupUser } from "../controller/authController.js";
const router = express.Router();

/**
 * Authentication routes
 *
 * POST /signup - Register a new user
 * POST /signin - Authenticate an existing user
 *
 * @returns - Routes for user registration and authentication
 */
router.post("/signup", signupUser);
router.post("/signin", signinUser);

export default router;
