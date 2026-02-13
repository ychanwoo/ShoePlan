import NaverIcon from "./icons/NaverIcon";

export function NaverLoginBtn() {
  const handleLogin = () => {
    const state = crypto.randomUUID(); // CSRF 방지용

    const NAVER_LOGIN_URL = `
      https://nid.naver.com/oauth2.0/authorize
      ?response_type=code
      &client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}
      &redirect_uri=${process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI}
      &state=${state}
    `.replace(/\s+/g, "");

    window.location.href = NAVER_LOGIN_URL;
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="relative flex items-center w-75 h-11.25 rounded-xl top-65 mx-auto bg-[#05AC4F] text-white"
    >
      <span className="absolute left-8 flex items-center justify-center">
        <NaverIcon />
      </span>
      <span className="font-light relative left-24">Login with Naver</span>
    </button>
  );
}
