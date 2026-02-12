import { supabase } from "@/lib/superbase";
import KakaoIcon from "./icons/KakaoIcon";

export function KakaoLoginBtn() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao", // 이제 공식 지원
      options: { redirectTo: "http://localhost:3000/home" },
    });
    if (error) console.log(error.message);
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
