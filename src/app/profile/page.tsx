"use client";

import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";
import Image, { StaticImageData } from "next/image";
import GoogleIcon from "@/assets/google.svg";
import NaverIcon from "@/assets/naver.svg";
import KakaoIcon from "@/assets/kakao.png";
import Link from "next/link";
import {
  LogOut,
  MessageCircleQuestionMark,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/common/Loading";

interface UserInfo {
  id: string;
  email: string;
  nickname: string;
  profile_image: string | null;
  provider: string;
}

interface ProfileInfo {
  runner_nickname: string | null;
  motto: string | null;
}

const PROVIDER_ICONS: Record<string, StaticImageData | string> = {
  google: GoogleIcon,
  naver: NaverIcon,
  kakao: KakaoIcon,
};

export default function ProfilePage() {
  const router = useRouter();
  // Logout
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // user / userInfo
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  // running nickname and motto
  const [inputNickname, setInputNickname] = useState("");
  const [inputMotto, setInputMotto] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  //* users DB에서 사용자 로그인 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (data.user) setUserInfo(data.user);

        // * user_profile
        if (data.profile) {
          setProfileInfo(data.profile);
          if (data.profile.runner_nickname)
            setInputNickname(data.profile.runner_nickname);
          if (data.profile.motto) setInputMotto(data.profile.motto);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);

    try {
      // 보낼 데이터 준비 (빈 문자열이면 null로 처리)
      const payload = {
        runner_nickname: inputNickname.trim() === "" ? null : inputNickname,
        motto: inputMotto.trim() === "" ? null : inputMotto,
      };

      // API로 데이터 전송
      const res = await fetch("/api/profileSave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setToast("프로필이 저장되었습니다.");
        // 저장 성공 시 현재 상태 업데이트
        setProfileInfo(payload);
      } else {
        const errorData = await res.json();
        setToast(errorData.message || "저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Profile save error:", error);
      setToast("서버 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setToast(""), 3000);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);

    const res = await fetch("/api/logout", { method: "POST" });

    if (res.ok) {
      setIsLogoutOpen(false);
      setToast("로그아웃 완료");

      setTimeout(() => {
        router.replace("/login");
      }, 1000);
    } else {
      setToast("로그아웃에 실패했습니다.");
      setIsLoading(false);
    }
  };

  if (isLoading) return Loading();

  const defaultNickname = userInfo?.id
    ? `Runner${String(parseInt(userInfo.id.slice(0, 6), 16) % 1000000).padStart(6, "0")}`
    : "Runner...";

  return (
    <>
      <HeaderBar title="Profile" />

      <section className="space-y-5 pb-28 h-[calc(100vh-11vh)] overflow-y-auto">
        {/* profile 영역 */}
        <div className="flex pt-5">
          {/* 프로필 이미지 (DB에 이미지가 있으면 사용 없으면 기본 초록색 원) */}
          {userInfo?.profile_image ? (
            <div className="relative w-16 h-16 ml-7 rounded-full overflow-hidden shrink-0">
              <Image
                src={userInfo.profile_image}
                alt="profile image"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full ml-7 bg-[#8FA68E] shrink-0" />
          )}

          <div className="flex-1 font-extralight space-y-3 ml-7 mt-1">
            <p className="text-white">
              {userInfo?.nickname || defaultNickname}
            </p>
            <p className="text-[#CBD5E1] text-sm">
              {userInfo?.email || "이메일 불러오기 일시적 오류"}
            </p>
          </div>

          {/* provider에 따른 로그인 아이콘 이미지 변경 */}
          {userInfo?.provider && PROVIDER_ICONS[userInfo.provider] && (
            <Image
              src={PROVIDER_ICONS[userInfo.provider]}
              alt={`${userInfo.provider} login`}
              width={30}
              height={30}
              className="mt-7 mr-5 w-7.5 h-7.5"
            />
          )}
        </div>
        {/* 하단 구분선*/}
        <div className="h-px bg-[#242E35]" />

        {/* nickname */}
        <div className="ml-10 space-y-5">
          <div className="text-[#CBD5E1] flex flex-col gap-y-2">
            <label htmlFor="nickname" className="text-sm font-light">
              Your Runner Nickname
            </label>
            <input
              type="text"
              id="nickname"
              value={inputNickname}
              onChange={(e) => setInputNickname(e.target.value)}
              placeholder={defaultNickname}
              className="bg-[#242E35] w-52.5 h-10 rounded-md text-[#CBD5E1] text-sm focus:outline-none text-center"
            />
          </div>
          {/* Motto */}
          <div className="text-[#CBD5E1] flex flex-col gap-y-2">
            <label htmlFor="motto" className="text-sm font-light">
              Your Motto
            </label>
            <div className="flex items-end">
              {/* 고정 박스 */}
              <div className="bg-[#242E35] w-52.5 h-17.5 rounded-md flex items-center justify-center px-3">
                <div
                  contentEditable
                  onInput={(e) =>
                    setInputMotto(e.currentTarget.textContent || "")
                  }
                  suppressContentEditableWarning
                  className="w-full text-center text-[#CBD5E1] text-sm outline-none wrap-break-words"
                >
                  {profileInfo?.motto || ""}
                </div>
              </div>

              {/* 버튼 */}
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className={`text-white h-7 w-14 rounded-2xl text-xs flex items-center justify-center shrink-0 ml-[10vw] min-[380px]:ml-[13vw] min-[420px]:ml-[17vw] min-[700px]:ml-[10vw] min-[1000px]:ml-[7vw] min-[1500px]:ml-[5vw] ${
                  isSaving
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#1E7F4F] hover:bg-[#196e43]"
                }`}
              >
                {isSaving ? "..." : "Save"}
              </button>
            </div>
          </div>
        </div>
        {/* 하단 구분선*/}
        <div className="h-px bg-[#242E35]" />

        {/* About */}
        <div className="text-[#CBD5E1]">
          <h3 className="font-semibold pl-6 pb-2">About</h3>
          <div className="bg-[#242E35] flex flex-col h-37.5 p-5 justify-between">
            <Link href="/policy">
              <div className="flex gap-x-2 hover:text-[#cbd5e1cc]">
                <ShieldCheck />
                <span>Privacy Policy</span>
              </div>
            </Link>

            <Link href="/service">
              <div className="flex gap-x-2 hover:text-[#cbd5e1cc]">
                <ScrollText />
                <span>Terms of Service</span>
              </div>
            </Link>

            <Link href="/contact">
              <div className="flex gap-x-2 hover:text-[#cbd5e1cc]">
                <MessageCircleQuestionMark />
                <span>Contact</span>
              </div>
            </Link>
          </div>
        </div>
        {/* Account */}
        <div className="text-[#CBD5E1]">
          <h3 className="font-semibold pl-6 pb-2">Account</h3>
          <div className="bg-[#242E35] flex flex-col h-12.5 justify-center p-5 hover:text-[#cbd5e1cc]">
            <button
              onClick={() => setIsLogoutOpen(true)}
              className="flex gap-x-2"
            >
              <LogOut />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </section>

      {isLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-110 bg-black/60"
            onClick={() => !isLoading && setIsLogoutOpen(false)}
          />

          <div className="relative bg-[#1B242C] w-80 rounded-2xl p-6 text-center shadow-xl">
            <p className="text-white text-lg font-medium mb-6">
              로그아웃 하시겠습니까?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setIsLogoutOpen(false)}
                disabled={isLoading}
                className="flex-1 h-10 rounded-xl bg-[#242E35] text-[#CBD5E1]"
              >
                아니오
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex-1 h-10 rounded-xl bg-[#1E7F4F] text-white"
              >
                {isLoading ? "처리 중..." : "예"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로그아웃 토스트창 */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-99 animate-toast">
          <div className="flex items-center gap-3 bg-[#1B242C] text-white px-6 py-4 rounded-2xl shadow-2xl border border-[#242E35]">
            {/* 아이콘 */}
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1E7F4F] text-sm">
              ✓
            </div>

            {/* 메시지 */}
            <p className="text-sm font-medium">{toast}</p>
          </div>
        </div>
      )}

      <TabBar />
    </>
  );
}
