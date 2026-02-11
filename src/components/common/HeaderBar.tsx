"use client";

import { ArrowLeft, InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { InfoPopover } from "../homeTab/InfoPopover";

export interface HeaderBarProps {
  title: string;
  showInfo?: boolean;
}

export default function HeaderBar({ title, showInfo }: HeaderBarProps) {
  const router = useRouter();
  return (
    <header className="w-full min-h-17 pt-3 shrink-0 bg-[#2F3A43]">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 h-14 text-[#CBD5E1]">
        {/* 왼족 */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="go to previous page"
          >
            <ArrowLeft className="w-6 h-6 hover:text-[#cbd5e1a5]" />
          </button>
          <span className="text-sm absolute left-1/2 -translate-x-1/2">
            {title}
          </span>
        </div>
        {/* Home 전용 InfoIcon */}
        {showInfo && (
          <InfoPopover>
            <InfoIcon className="w-6 h-6 text-[#CBD5E1] hover:text-[#cbd5e1a5]" />
          </InfoPopover>
        )}
      </div>

      {/* header 하단 구분선 */}
      <div className="h-px bg-[#242E35]" />
    </header>
  );
}
