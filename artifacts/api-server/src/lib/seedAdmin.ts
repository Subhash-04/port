import { randomBytes, pbkdf2Sync } from "crypto";
import { db, adminConfigTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD ?? "subhash2026";

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const test = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return test === hash;
}

export async function seedAdmin(): Promise<void> {
  try {
    const existing = await db
      .select()
      .from(adminConfigTable)
      .where(eq(adminConfigTable.key, "pw_hash"));

    if (existing.length === 0) {
      const { hash, salt } = hashPassword(DEFAULT_PASSWORD);
      await db.insert(adminConfigTable).values([
        { key: "pw_hash", value: hash },
        { key: "pw_salt", value: salt },
      ]);
      logger.info("Admin password seeded from ADMIN_PASSWORD env (default: subhash2026)");
    }
  } catch (err) {
    logger.warn({ err }, "Admin seed skipped — tables may not exist yet");
  }
}
