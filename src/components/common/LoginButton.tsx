import { ReactNode } from "react";
import GoogleIcon from "./icons/GoogleIcon";
import KakaoIcon from "./icons/KakaoIcon";
import NaverIcon from "./icons/NaverIcon";

type Provider = "kakao" | "naver" | "google";

const PROVIDER_CONFIG: Record<
  Provider,
  {
    bg: string;
    icon: ReactNode;
    label: string;
    hoverBg: string;
    textColor?: string;
  }
> = {
  kakao: {
    bg: "bg-[#FEE500]",
    icon: <KakaoIcon />,
    label: "Login with Kakao",
    hoverBg: "",
  },
  naver: {
    bg: "bg-[#05AC4F]",
    icon: <NaverIcon />,
    label: "Login with Naver",
    hoverBg: "",
    textColor: "text-white",
  },
  google: {
    bg: "bg-white border",
    icon: <GoogleIcon />,
    label: "Sign in with Google",
    hoverBg: "",
  },
};

// * 나중에 onClick ? 제거
interface LoginButtonProps {
  provider: Provider;
  onClick?: () => void;
}

export function LoginButton({ provider, onClick }: LoginButtonProps) {
  const { bg, textColor, icon, label } = PROVIDER_CONFIG[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`
        relative flex items-center
        w-75 h-11.25 rounded-xl top-65 mx-auto
        ${bg} ${textColor}
      `}
    >
      <span className="absolute left-8 flex items-center justify-center">
        {icon}
      </span>

      <span className="font-light relative left-24">{label}</span>
    </button>
  );
}
