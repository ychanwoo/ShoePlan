"use client";
import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";
import { Mail, MessageCircle } from "lucide-react"; // 아이콘 라이브러리 (lucide-react 사용 중이신 걸로 보입니다)

export default function ContactPage() {
  return (
    <>
      <HeaderBar title="Contact Us" />
      <div className="pt-8 px-5 h-[calc(100dvh-11vh)] overflow-y-auto pb-28 space-y-5">
        {/* 인사말 카드 */}
        <div className="bg-[#242E35] w-full mx-auto py-6 px-5 rounded-2xl shadow-lg text-center">
          <div className="w-12 h-12 bg-[#1E7F4F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="text-[#1E7F4F] w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            도움이 필요하신가요?
          </h2>
          <p className="text-[#94A3B8] text-sm leading-relaxed break-keep">
            러닝화 등록 오류, 새로운 신발 모델 추가 요청, 기타 피드백이 있다면
            언제든 알려주세요. 빠르게 확인 후 반영해 드리겠습니다!
          </p>
        </div>

        {/* 이메일 문의 버튼 카드 */}
        <div className="bg-[#242E35] w-full mx-auto p-2 rounded-2xl shadow-lg">
          <a
            href="mailto:wooych4931@gmail.com"
            className="flex items-center justify-between bg-[#1B242C] p-4 rounded-xl hover:border-[#1E7F4F] border border-transparent transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mail className="text-[#CBD5E1] w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium">
                  이메일로 문의하기
                </span>
                <span className="text-[#6B7280] text-xs">
                  wooych4931@gmail.com
                </span>
              </div>
            </div>
            <span className="text-[#1E7F4F] text-sm font-medium">보내기 →</span>
          </a>
        </div>

        {/* 미니 FAQ */}
        <div className="px-2 pt-4">
          <h3 className="text-[#CBD5E1] text-sm font-medium mb-3">
            자주 묻는 질문
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-white text-sm font-medium mb-1">
                Q. 제 신발 모델이 목록에 없어요.
              </p>
              <p className="text-[#94A3B8] text-xs leading-relaxed">
                A. 위 이메일로 브랜드와 모델명을 남겨주시면, 수명 데이터를
                분석하여 다음 업데이트에 빠르게 반영해 드립니다!
              </p>
            </div>
          </div>
        </div>
      </div>
      <TabBar />
    </>
  );
}
