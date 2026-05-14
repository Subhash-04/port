import { Router } from "express";
import { db, analyticsEventsTable } from "@workspace/db";
import { eq, gte, and, sql } from "drizzle-orm";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

/* POST /analytics/track — log an event (no auth required) */
router.post("/analytics/track", async (req, res) => {
  try {
    const { type, section } = req.body as { type?: string; section?: string };
    if (!type) { res.status(400).json({ error: "type required" }); return; }
    await db.insert(analyticsEventsTable).values({
      eventType: type,
      section: section ?? null,
    });
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to track event");
    res.status(500).json({ error: "Track failed" });
  }
});

/* GET /analytics/stats — aggregated stats (admin only) */
router.get("/analytics/stats", adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(analyticsEventsTable)
      .where(eq(analyticsEventsTable.eventType, "pageview"));

    const [todayRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(analyticsEventsTable)
      .where(and(eq(analyticsEventsTable.eventType, "pageview"), gte(analyticsEventsTable.createdAt, todayStart)));

    const [weekRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(analyticsEventsTable)
      .where(and(eq(analyticsEventsTable.eventType, "pageview"), gte(analyticsEventsTable.createdAt, weekStart)));

    const sectionRows = await db
      .select({
        section: analyticsEventsTable.section,
        count: sql<number>`count(*)::int`,
      })
      .from(analyticsEventsTable)
      .where(eq(analyticsEventsTable.eventType, "section_view"))
      .groupBy(analyticsEventsTable.section);

    const recent = await db
      .select()
      .from(analyticsEventsTable)
      .orderBy(sql`created_at DESC`)
      .limit(20);

    res.json({
      total: totalRow?.count ?? 0,
      today: todayRow?.count ?? 0,
      thisWeek: weekRow?.count ?? 0,
      sections: sectionRows.filter(r => r.section),
      recent,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get analytics stats");
    res.status(500).json({ error: "Stats failed" });
  }
});

export default router;
