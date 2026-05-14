import { logger } from "./logger";

const PHONE = "+919014470659";

export async function sendOtp(otp: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    logger.info({ otp }, "DEV MODE — Admin OTP (set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER)");
    return true;
  }

  try {
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const body = new URLSearchParams({
      From: fromNumber,
      To: PHONE,
      Body: `Your Subhash Admin OTP is ${otp}. Valid for 10 minutes. Do not share.`,
    });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      }
    );

    const data = (await res.json()) as { sid?: string; message?: string };
    if (data.sid) {
      logger.info({ sid: data.sid }, "OTP SMS sent via Twilio");
      return true;
    }
    logger.error({ data }, "Twilio returned no SID");
    return false;
  } catch (err) {
    logger.error({ err }, "Failed to send OTP via Twilio");
    return false;
  }
}
