import crypto from "crypto";

export interface MobileTokenPayload {
  exp: number;
  oauthId: string;
  provider: string;
}

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

function getMobileSecret() {
  const secret =
    process.env.MOBILE_APP_TOKEN_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret) {
    throw new Error("MOBILE_APP_TOKEN_SECRET is not configured.");
  }

  return secret;
}

function encodeBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function signPayload(payload: string) {
  return crypto
    .createHmac("sha256", getMobileSecret())
    .update(payload)
    .digest("base64url");
}

export function signMobileToken(oauthId: string, provider: string) {
  const payload: MobileTokenPayload = {
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    oauthId,
    provider,
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

export function verifyMobileToken(token: string | null | undefined) {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = signPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as MobileTokenPayload;

    if (!decoded.oauthId || decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice("Bearer ".length).trim();
}
