import NaverIcon from "./icons/NaverIcon";

export function NaverLoginBtn() {
  const handleLogin = () => {
    // 현재는 임시로 /home 이동
    window.location.href = "/home";
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
