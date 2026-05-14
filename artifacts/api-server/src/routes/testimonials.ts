import { Router } from "express";
import { db } from "@workspace/db";
import { testimonialsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

router.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await db
      .select()
      .from(testimonialsTable)
      .orderBy(asc(testimonialsTable.displayOrder), asc(testimonialsTable.id));
    res.json(testimonials);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch testimonials");
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

router.post("/testimonials", adminAuth, async (req, res) => {
  try {
    const { name, role, quote, displayOrder } = req.body;
    const [t] = await db
      .insert(testimonialsTable)
      .values({ name, role, quote, displayOrder: displayOrder ?? 0 })
      .returning();
    res.json(t);
  } catch (err) {
    req.log.error({ err }, "Failed to create testimonial");
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});

router.put("/testimonials/:id", adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, role, quote, displayOrder } = req.body;
    const [t] = await db
      .update(testimonialsTable)
      .set({ name, role, quote, displayOrder: displayOrder ?? 0 })
      .where(eq(testimonialsTable.id, id))
      .returning();
    if (!t) { res.status(404).json({ error: "Not found" }); return; }
    res.json(t);
  } catch (err) {
    req.log.error({ err }, "Failed to update testimonial");
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

router.delete("/testimonials/:id", adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete testimonial");
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

export default router;
