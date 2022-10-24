import { Router } from "express";
import { productController } from "../controller/productController.js";

const productRouter = Router();

productRouter.get("/", productController.getData);

export default productRouter;
