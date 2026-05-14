import { Router } from "express";
import { db } from "@workspace/db";
import { worksTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

router.get("/works", async (req, res) => {
  try {
    const works = await db
      .select()
      .from(worksTable)
      .orderBy(asc(worksTable.displayOrder), asc(worksTable.id));
    res.json(works);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch works");
    res.status(500).json({ error: "Failed to fetch works" });
  }
});

router.post("/works", adminAuth, async (req, res) => {
  try {
    const { title, description, imageUrl, siteUrl, category, displayOrder } = req.body as {
      title: string; description?: string; imageUrl?: string; siteUrl?: string; category?: string; displayOrder?: number;
    };
    const [work] = await db
      .insert(worksTable)
      .values({ title, description: description || "", imageUrl: imageUrl || "", siteUrl: siteUrl || "", category: category || "", displayOrder: displayOrder ?? 0 })
      .returning();
    res.json(work);
  } catch (err) {
    req.log.error({ err }, "Failed to create work");
    res.status(500).json({ error: "Failed to create work" });
  }
});

router.put("/works/:id", adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, imageUrl, siteUrl, category, displayOrder } = req.body as {
      title: string; description?: string; imageUrl?: string; siteUrl?: string; category?: string; displayOrder?: number;
    };
    const [work] = await db
      .update(worksTable)
      .set({ title, description: description || "", imageUrl: imageUrl || "", siteUrl: siteUrl || "", category: category || "", displayOrder: displayOrder ?? 0 })
      .where(eq(worksTable.id, id))
      .returning();
    if (!work) { res.status(404).json({ error: "Not found" }); return; }
    res.json(work);
  } catch (err) {
    req.log.error({ err }, "Failed to update work");
    res.status(500).json({ error: "Failed to update work" });
  }
});

router.delete("/works/:id", adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(worksTable).where(eq(worksTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete work");
    res.status(500).json({ error: "Failed to delete work" });
  }
});

export default router;
