import { Router } from "express";
import { 
  loginUser, 
  registerUser, 
  googleCallback, 
  githubCallback, 
  getUserWithAccessToken,
  logoutUser
} from "../controllers/userControllers.js";
import passport from "passport";
import { validateTokens } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication routes
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     description: Authenticate a user with credentials and return access and refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "your_access_token"
 *                 refreshToken:
 *                   type: string
 *                   example: "your_refresh_token"
 *       404:
 *         description: User Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 */

router.post("/auth/login", loginUser);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/auth/signup", registerUser);

/**
 * @swagger
 * /auth/getinfo:
 *   get:
 *     summary: Get user info
 *     tags: [Authentication]
 *     description: Retrieve user details using an access token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "65f23b1b..."
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 */
router.get("/auth/getinfo", validateTokens, getUserWithAccessToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     description: Logs out the user and clears authentication tokens
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post("/auth/logout", validateTokens, logoutUser);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Google OAuth login
 *     tags: [Authentication]
 *     description: Redirects user to Google for authentication
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth login
 */
router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 *     description: Callback URL for Google OAuth authentication
 *     responses:
 *       302:
 *         description: Redirects to frontend with authentication status
 */
router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND}/login`, session: false }), 
  googleCallback
);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: GitHub OAuth login
 *     tags: [Authentication]
 *     description: Redirects user to GitHub for authentication
 *     responses:
 *       302:
 *         description: Redirects to GitHub OAuth login
 */
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     tags: [Authentication]
 *     description: Callback URL for GitHub OAuth authentication
 *     responses:
 *       302:
 *         description: Redirects to frontend with authentication status
 */
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: `${process.env.FRONTEND}/login`, session: false }),
  githubCallback
);

export default router;
