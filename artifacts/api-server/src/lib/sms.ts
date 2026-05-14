import { logger } from "./logger";

const PHONE = "9014470659";

export async function sendOtp(otp: string): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    logger.info({ otp }, "DEV MODE — Admin OTP (no FAST2SMS_API_KEY set)");
    return true;
  }

  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        numbers: PHONE,
        message: `Your Subhash Admin OTP is ${otp}. Valid 10 mins. Do not share.`,
        flash: 0,
      }),
    });
    const data = (await res.json()) as { return?: boolean };
    return data.return === true;
  } catch (err) {
    logger.error({ err }, "Failed to send OTP SMS");
    return false;
  }
}
