import { Router } from "express";
import passport from "passport";

const router = Router();

// Ruta para iniciar login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Ruta callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/login?error=github",
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/proyectos");
  }
);

export default router;
