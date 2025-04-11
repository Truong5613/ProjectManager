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
    // Pass returnUrl directly to the state parameter
    const state = req.query.returnUrl ? encodeURIComponent(req.query.returnUrl as string) : undefined;
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
      state: state
    })(req, res, next);
  }
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failedUrl,
    session: false,
  }),
  (req, res, next) => {
    // Get returnUrl from state parameter
    if (req.query.state) {
      req.query.returnUrl = decodeURIComponent(req.query.state as string);
    }
    next();
  },
  googleLoginCallback
);

export default authRoutes;