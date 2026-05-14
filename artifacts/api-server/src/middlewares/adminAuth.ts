import { Request, Response, NextFunction } from "express";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const password = req.headers["x-admin-password"] as string | undefined;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword) {
    res.status(500).json({ error: "ADMIN_PASSWORD not configured" });
    return;
  }
  if (!password || password !== envPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
