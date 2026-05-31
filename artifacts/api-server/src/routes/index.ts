import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import fruitsVeggiesRouter from "./fruitsVeggies";
import homeFoodsRouter from "./homeFoods";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(fruitsVeggiesRouter);
router.use(homeFoodsRouter);

export default router;
