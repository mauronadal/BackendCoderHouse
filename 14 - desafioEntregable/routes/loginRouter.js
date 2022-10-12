import { Router } from "express";
const loginRouter = Router();
import { loginController } from "../controller/loginController.js";

loginRouter.get("/", loginController.get);

loginRouter.post("/", loginController.postLogin);

export default loginRouter;
