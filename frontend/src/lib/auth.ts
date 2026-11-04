import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken, type SessionUser } from "@/lib/session";
export async function getCurrentUser(): Promise<SessionUser | null> {
 const jar = await cookies();
 const token = jar.get(COOKIE_NAME)?.value;
 return token ? verifySessionToken(token) : null;
}
