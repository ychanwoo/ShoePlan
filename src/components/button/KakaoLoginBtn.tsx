import KakaoIcon from "../common/icons/KakaoIcon";

export function KakaoLoginBtn() {
  const handleLogin = () => {
    const state = crypto.randomUUID(); // CSRF 방지
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error("Missing Kakao OAuth env", {
        clientId: Boolean(clientId),
        redirectUri: Boolean(redirectUri),
      });
      alert("Kakao login config is missing. Check env vars.");
      return;
    }

    const KAKAO_LOGIN_URL = `
    https://kauth.kakao.com/oauth/authorize
    ?response_type=code
    &client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}
    &redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}
    &state=${state}
  `.replace(/\s+/g, "");

    window.location.href = KAKAO_LOGIN_URL;
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="relative flex items-center w-75 h-11.25 rounded-xl top-65 mx-auto bg-[#FEE500]"
    >
      <span className="absolute left-8 flex items-center justify-center">
        <KakaoIcon />
      </span>
      <span className="font-light relative left-24">Login with Kakao</span>
    </button>
  );
}
