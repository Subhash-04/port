import { Router } from "express";
import { db } from "@workspace/db";
import { siteContentTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

router.get("/content", async (req, res) => {
  try {
    const rows = await db.select().from(siteContentTable);
    const content: Record<string, string> = {};
    for (const row of rows) content[row.key] = row.value;
    res.json(content);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch content");
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

router.put("/content/:key", adminAuth, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body as { value: string };
    await db
      .insert(siteContentTable)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteContentTable.key, set: { value } });
    res.json({ key, value });
  } catch (err) {
    req.log.error({ err }, "Failed to update content");
    res.status(500).json({ error: "Failed to update content" });
  }
});

export default router;
