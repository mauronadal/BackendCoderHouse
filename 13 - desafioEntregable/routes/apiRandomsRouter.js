import { Router } from "express";
import { apiRandomController } from "../controller/apiRandomController.js";
const apiRandomsRouter = Router();

apiRandomsRouter.get("/", apiRandomController.get);

apiRandomsRouter.post("/", apiRandomController.post);

export default apiRandomsRouter;
