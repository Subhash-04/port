import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

router.get("/projects", async (req, res) => {
  try {
    const projects = await db
      .select()
      .from(projectsTable)
      .orderBy(asc(projectsTable.displayOrder), asc(projectsTable.id));
    res.json(projects);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch projects");
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.post("/projects", adminAuth, async (req, res) => {
  try {
    const { title, description, imageUrl, siteUrl, category, displayOrder } = req.body;
    const [project] = await db
      .insert(projectsTable)
      .values({ title, description: description || "", imageUrl: imageUrl || "", siteUrl: siteUrl || "", category: category || "", displayOrder: displayOrder ?? 0 })
      .returning();
    res.json(project);
  } catch (err) {
    req.log.error({ err }, "Failed to create project");
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.put("/projects/:id", adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, imageUrl, siteUrl, category, displayOrder } = req.body;
    const [project] = await db
      .update(projectsTable)
      .set({ title, description: description || "", imageUrl: imageUrl || "", siteUrl: siteUrl || "", category: category || "", displayOrder: displayOrder ?? 0 })
      .where(eq(projectsTable.id, id))
      .returning();
    if (!project) { res.status(404).json({ error: "Not found" }); return; }
    res.json(project);
  } catch (err) {
    req.log.error({ err }, "Failed to update project");
    res.status(500).json({ error: "Failed to update project" });
  }
});

router.delete("/projects/:id", adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(projectsTable).where(eq(projectsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete project");
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
