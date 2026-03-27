"use client";
import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";

export default function TermsPage() {
  return (
    <>
      <HeaderBar title="Terms of Service" />
      <div className="pt-8 px-5 h-[calc(100dvh-11vh)] overflow-y-auto pb-28">
        <div className="bg-[#242E35] w-full mx-auto py-6 px-5 rounded-2xl shadow-lg mb-6">
          <p className="text-xs text-[#6B7280] mb-4">
            최종 수정일: 2026년 3월 27일
          </p>
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">
            서비스 이용약관
          </h2>

          {/* 💡 상단 핵심 요약 박스 (TL;DR) */}
          <div className="bg-[#1E7F4F]/10 border border-[#1E7F4F]/30 rounded-xl p-4 mb-8">
            <h3 className="text-[#1E7F4F] text-sm font-bold mb-1">
              📌 한 줄 요약
            </h3>
            <p className="text-[#CBD5E1] text-xs leading-relaxed">
              본 서비스는 러닝화 수명 예측을 돕는 보조 도구입니다. 제공되는
              데이터는 통계적 수치일 뿐이므로, 실제 러닝 시에는 본인의 신체
              상태와 신발의 마모도를 직접 확인하시기 바랍니다.
            </p>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-white font-medium text-lg mb-2">
                제 1 조 (목적)
              </h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed break-keep">
                본 약관은 사용자가 제공하는 러닝화 관리 및 수명 계산 서비스(이하
                &quot;서비스&quot;)를 이용함에 있어, 회사와 사용자 간의 권리,
                의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>
            <div className="h-px bg-[#374151]"></div> {/* 구분선 추가 */}
            <section>
              <h3 className="text-white font-medium text-lg mb-2">
                제 2 조 (서비스의 제공 및 변경)
              </h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed break-keep">
                1. 본 서비스는 사용자가 입력한 신체 정보(키, 체중) 및 러닝
                습관(월간 거리, 주행 타입)을 바탕으로 러닝화의 예상 수명을
                통계적으로 계산하여 제공합니다.
                <br />
                2. 회사는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스의
                전부 또는 일부를 변경하거나 종료할 수 있습니다.
              </p>
            </section>
            <div className="h-px bg-[#374151]"></div>
            <section>
              <h3 className="text-white font-medium text-lg mb-2">
                제 3 조 (회원의 의무)
              </h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed break-keep">
                회원은 서비스를 이용할 때 본인의 정확한 정보를 입력해야 하며,
                비정상적인 방법으로 서비스 시스템에 접근하거나 데이터를 조작하는
                행위를 해서는 안 됩니다.
              </p>
            </section>
            <div className="h-px bg-[#374151]"></div>
            <section>
              <h3 className="text-white font-medium text-lg mb-2">
                제 4 조 (면책 조항)
              </h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed break-keep">
                회사는 회원이 서비스에 입력한 정보의 정확성에 대해 책임지지
                않으며, 서비스에서 제공하는 교체 권장 시기를 따르지 않거나
                맹신하여 발생한 부상 및 손해에 대해 어떠한 법적 책임도 지지
                않습니다.
              </p>
            </section>
          </div>
        </div>
      </div>
      <TabBar />
    </>
  );
}
