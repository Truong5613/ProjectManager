import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import {
  googleLoginCallback,
  loginController,
  logOutController,
  registerUserController,
} from "../controllers/auth.controller";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();
//dang ky 
authRoutes.post("/register", registerUserController);
//dang nhap
authRoutes.post("/login", loginController);
//dang xuat
authRoutes.post("/logout", logOutController);
//Dang nhap = google

authRoutes.get(
  "/google",
  (req, res, next) => {
    // Store the returnUrl in the session
    if (req.query.returnUrl && req.session) {
      req.session.returnUrl = req.query.returnUrl as string;
    }
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  }
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failedUrl,
  }),
  (req, res, next) => {
    // Pass the returnUrl from session to the callback
    if (req.session && req.session.returnUrl) {
      req.query.returnUrl = req.session.returnUrl;
      delete req.session.returnUrl;
    }
    googleLoginCallback(req, res, next);
  }
);

export default authRoutes;