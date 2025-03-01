import { Router } from "express";
import { loginUser, registerUser,googleCallback,githubCallback, getUserWithAccessToken } from "../controllers/userControllers.js";
import passport from 'passport';
import { validateTokens } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/auth/login").post(loginUser);
router.post("/auth/signup", registerUser);
router.get("/auth/getinfo",validateTokens,getUserWithAccessToken);
// Google OAuth routes
router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND}login`, session: false }), 
  googleCallback  // Make sure this function is actually being called!
);

router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub OAuth callback
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: `${process.env.FRONTEND}login`,session:false }),
  githubCallback
);


export default router;
