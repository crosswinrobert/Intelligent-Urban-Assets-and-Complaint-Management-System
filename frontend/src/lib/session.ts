import { createHmac, timingSafeEqual } from "node:crypto";

export type SessionUser = {
  user_id: number;
  Fname: string;
  Lname: string;
  Email: string;
  Role: "Admin" | "Citizen" | "Staff";
  dept_id: number | null;
};

const COOKIE_NAME = "urban_pulse_session";
const SESSION_SECONDS = 60 * 60 * 8;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 64) {
    throw new Error("SESSION_SECRET must contain at least 64 characters.");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createSessionToken(user: SessionUser): string {
  const payload = Buffer.from(
    JSON.stringify({
      ...user,
      exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expected = Buffer.from(sign(payload));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      return null;
    }

    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || data.exp <= Math.floor(Date.now() / 1000)) return null;
    if (!Number.isInteger(data.user_id) || !data.Email) return null;
    if (!["Admin", "Citizen", "Staff"].includes(data.Role)) return null;

    const { exp: _exp, ...user } = data;
    return user as SessionUser;
  } catch {
    return null;
  }
}

export { COOKIE_NAME, SESSION_SECONDS };
