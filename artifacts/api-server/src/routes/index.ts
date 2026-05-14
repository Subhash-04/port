import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import testimonialsRouter from "./testimonials";
import contentRouter from "./content";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(testimonialsRouter);
router.use(contentRouter);
router.use(authRouter);

export default router;
