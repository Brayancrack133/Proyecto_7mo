import { Router } from "express";
import passport from "passport";

const router = Router();

// 1. Iniciar login con Google
router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// 2. Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login?error=google",
  }),
  (req, res) => {
    // Aquí ya está logueado
    res.redirect("http://localhost:5173/proyectos"); 
  }
);

export default router;
