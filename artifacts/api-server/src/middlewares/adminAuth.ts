import { Request, Response, NextFunction } from "express";
import { db, adminSessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"] as string | undefined;

  if (!token) {
    res.status(401).json({ error: "Unauthorized — no session token" });
    return;
  }

  try {
    const rows = await db
      .select()
      .from(adminSessionsTable)
      .where(eq(adminSessionsTable.token, token));

    if (rows.length === 0) {
      res.status(401).json({ error: "Invalid or expired session" });
      return;
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Auth check failed" });
  }
}
