import { Router } from "express";
const signupRouter = Router();
import { signupController } from "../controller/signupController.js";
import passport from "passport";

signupRouter.get("/", signupController.get);
signupRouter.get("/failsignup", signupController.errorSignup);

signupRouter.post(
  "/",
  passport.authenticate("signup", { failureRedirect: "/signup/failsignup" }),
  signupController.postsignup
);

export default signupRouter;
