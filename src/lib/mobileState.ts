export type MobileOauthProvider = "google" | "kakao" | "naver";

export interface MobileOauthState {
  appRedirect?: string;
  nonce?: string;
  provider?: MobileOauthProvider;
  source?: string;
}

export function decodeMobileOauthState(
  rawState: string | null | undefined,
): MobileOauthState | null {
  if (!rawState) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(rawState));
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as MobileOauthState;
  } catch {
    return null;
  }
}

export function isMobileOauthState(
  state: MobileOauthState | null,
  provider?: MobileOauthProvider,
) {
  if (!state) return false;
  if (state.source !== "shoeplan-app") return false;
  if (!state.appRedirect?.startsWith("shoeplanexpo://auth-callback")) {
    return false;
  }
  if (provider && state.provider !== provider) return false;
  return true;
}
