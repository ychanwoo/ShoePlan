import { supabase } from "@/lib/superbase";
import GoogleIcon from "./icons/GoogleIcon";

export function GoogleLoginBtn() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000/home" },
    });
    if (error) console.log(error.message);
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
