import { Router, type IRouter } from "express";
import healthRouter from "./health";
import worksRouter from "./works";
import testimonialsRouter from "./testimonials";
import contentRouter from "./content";
import sectionsRouter from "./sections";
import analyticsRouter from "./analytics-route";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(worksRouter);
router.use(testimonialsRouter);
router.use(contentRouter);
router.use(sectionsRouter);
router.use(analyticsRouter);
router.use(authRouter);

export default router;
