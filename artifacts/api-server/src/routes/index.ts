import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import testimonialsRouter from "./testimonials";
import contentRouter from "./content";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(testimonialsRouter);
router.use(contentRouter);

export default router;
