import { Router } from "express";
import { randomBytes } from "crypto";
import { db, adminConfigTable, adminOtpsTable, adminSessionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { verifyPassword, hashPassword } from "../lib/seedAdmin";
import { sendOtp } from "../lib/sms";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

/* POST /admin/login — verify password, generate + send OTP */
router.post("/admin/login", async (req, res) => {
  const { password } = req.body as { password?: string };
  if (!password) {
    res.status(400).json({ error: "Password required" });
    return;
  }

  try {
    const [hashRow] = await db
      .select()
      .from(adminConfigTable)
      .where(eq(adminConfigTable.key, "pw_hash"));
    const [saltRow] = await db
      .select()
      .from(adminConfigTable)
      .where(eq(adminConfigTable.key, "pw_salt"));

    if (!hashRow || !saltRow) {
      res.status(500).json({ error: "Admin not configured — restart the server" });
      return;
    }

    if (!verifyPassword(password, hashRow.value, saltRow.value)) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    /* Clear any unused, expired OTPs (older than 10 min) */
    const allOtps = await db.select().from(adminOtpsTable).where(eq(adminOtpsTable.used, false));
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    for (const o of allOtps) {
      if (o.createdAt < tenMinsAgo) {
        await db.delete(adminOtpsTable).where(eq(adminOtpsTable.id, o.id));
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await db.insert(adminOtpsTable).values({ code: otp, used: false });

    const devMode = !process.env.FAST2SMS_API_KEY;
    await sendOtp(otp);

    req.log.info("OTP generated and sent");
    res.json({
      step: "otp",
      devMode,
      ...(devMode ? { devOtp: otp } : {}),
    });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    res.status(500).json({ error: "Login failed" });
  }
});

/* POST /admin/verify-otp — verify OTP, create session */
router.post("/admin/verify-otp", async (req, res) => {
  const { otp } = req.body as { otp?: string };
  if (!otp) {
    res.status(400).json({ error: "OTP required" });
    return;
  }

  try {
    const rows = await db
      .select()
      .from(adminOtpsTable)
      .where(and(eq(adminOtpsTable.code, otp), eq(adminOtpsTable.used, false)));

    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    const otpRow = rows[0];

    if (!otpRow || otpRow.createdAt < tenMinsAgo) {
      res.status(401).json({ error: "Invalid or expired OTP" });
      return;
    }

    await db
      .update(adminOtpsTable)
      .set({ used: true })
      .where(eq(adminOtpsTable.id, otpRow.id));

    const token = randomBytes(32).toString("hex");
    await db.insert(adminSessionsTable).values({ token });

    req.log.info("Admin session created");
    res.json({ token });
  } catch (err) {
    req.log.error({ err }, "OTP verification failed");
    res.status(500).json({ error: "OTP verification failed" });
  }
});

/* POST /admin/logout — invalidate session */
router.post("/admin/logout", adminAuth, async (req, res) => {
  const token = req.headers["x-admin-token"] as string;
  await db.delete(adminSessionsTable).where(eq(adminSessionsTable.token, token));
  res.json({ ok: true });
});

/* GET /admin/check — check if session is valid */
router.get("/admin/check", async (req, res) => {
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!token) { res.json({ ok: false }); return; }
  const rows = await db
    .select()
    .from(adminSessionsTable)
    .where(eq(adminSessionsTable.token, token));
  res.json({ ok: rows.length > 0 });
});

/* POST /admin/change-password — update stored password */
router.post("/admin/change-password", adminAuth, async (req, res) => {
  const { password } = req.body as { password?: string };
  if (!password || password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }
  try {
    const { hash, salt } = hashPassword(password);
    await db
      .insert(adminConfigTable)
      .values({ key: "pw_hash", value: hash })
      .onConflictDoUpdate({ target: adminConfigTable.key, set: { value: hash } });
    await db
      .insert(adminConfigTable)
      .values({ key: "pw_salt", value: salt })
      .onConflictDoUpdate({ target: adminConfigTable.key, set: { value: salt } });
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Change password failed");
    res.status(500).json({ error: "Failed to change password" });
  }
});

export default router;
