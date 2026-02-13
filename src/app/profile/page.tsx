"use client";

import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";
import Image from "next/image";
import GoogleIcon from "@/assets/google.svg";
import Link from "next/link";
import {
  LogOut,
  MessageCircleQuestionMark,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleLogout = () => {
    // 쿠키 삭제
    document.cookie = "userId=; path=/; max-age=0";
    document.cookie = "provider=; path=/; max-age=0";
    document.cookie = "nickname=; path=/; max-age=0";
    document.cookie = "email=; path=/; max-age=0";
    document.cookie = "profile_image=; path=/; max-age=0";

    console.log("로그아웃 완료");
    router.replace("/login");
  };
  return (
    <>
      <HeaderBar title="Profile" />

      <section className="space-y-5 pb-28 h-[calc(100vh-11vh)] overflow-y-auto">
        {/* profile 영역 */}
        <div className="flex pt-5">
          <div className="w-16 h-16 rounded-full ml-7 bg-[#8FA68E]" />
          <div className="flex-1 font-extralight space-y-3 ml-7 mt-1">
            <p className="text-white">Ychanwoo</p>
            <p className="text-[#CBD5E1] text-sm">example@google.com</p>
          </div>

          <Image
            src={GoogleIcon}
            alt="login-account image"
            width={30}
            height={30}
            className="mt-7 mr-5"
          />
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
                  onInput={(e) => setText(e.currentTarget.textContent || "")}
                  suppressContentEditableWarning
                  className="w-full text-center text-[#CBD5E1] text-sm outline-none wrap-break-words"
                />
              </div>

              {/* 버튼 */}
              <button
                className="text-white px-4 h-7 w-14 rounded-2xl bg-[#1E7F4F] text-xs
                flex items-center justify-center hover:bg-[#196e43] shrink-0 absolute right-5"
              >
                Save
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
            <button onClick={handleLogout} className="flex gap-x-2">
              <LogOut />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </section>

      <TabBar />
    </>
  );
}
