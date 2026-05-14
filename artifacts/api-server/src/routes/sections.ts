import { Router } from "express";
import { db, sectionContentTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

/* GET /sections — flat key-value of ALL sections (for portfolio use) */
router.get("/sections", async (req, res) => {
  try {
    const rows = await db.select().from(sectionContentTable);
    const content: Record<string, string> = {};
    for (const row of rows) content[row.key] = row.value;
    res.json(content);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch sections");
    res.status(500).json({ error: "Failed to fetch sections" });
  }
});

/* GET /sections/:section — key-value for one section */
router.get("/sections/:section", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(sectionContentTable)
      .where(eq(sectionContentTable.section, req.params.section));
    const content: Record<string, string> = {};
    for (const row of rows) content[row.key] = row.value;
    res.json(content);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch section");
    res.status(500).json({ error: "Failed to fetch section" });
  }
});

/* PUT /sections/:section/:key — upsert a field (admin) */
router.put("/sections/:section/:key", adminAuth, async (req, res) => {
  try {
    const { section, key } = req.params;
    const { value } = req.body as { value: string };
    await db
      .insert(sectionContentTable)
      .values({ section, key, value })
      .onConflictDoUpdate({
        target: [sectionContentTable.section, sectionContentTable.key],
        set: { value },
      });
    res.json({ section, key, value });
  } catch (err) {
    req.log.error({ err }, "Failed to update section field");
    res.status(500).json({ error: "Failed to update section field" });
  }
});

export default router;
