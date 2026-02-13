import GoogleIcon from "../common/icons/GoogleIcon";

export function GoogleLoginBtn() {
  const handleLogin = () => {
    const state = crypto.randomUUID(); // CSRF 방지
    const GOOGLE_LOGIN_URL = `
    https://accounts.google.com/o/oauth2/v2/auth
    ?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
    &redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}
    &response_type=code
    &scope=openid%20email%20profile
    &state=${state}
  `.replace(/\s+/g, "");

    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="relative flex items-center w-75 h-11.25 rounded-xl top-65 mx-auto bg-white border"
    >
      <span className="absolute left-8 flex items-center justify-center">
        <GoogleIcon />
      </span>
      <span className="font-light relative left-24">Sign in with Google</span>
    </button>
  );
}
