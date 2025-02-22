import { Router } from "express";
import { loginUser, registerUser,googleCallback } from "../controllers/userControllers.js";
import passport from 'passport';

const router = Router();

router.route("/auth/login").post(loginUser);
router.post("/auth/signup", registerUser);

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']  
}));

router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',  
}), googleCallback);  

export default router;
