"use client";
import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";

export default function PolicyPage() {
  return (
    <>
      <HeaderBar title="Privacy Policy" />
      <div className="pt-8 px-5 h-[calc(100dvh-11vh)] overflow-y-auto pb-28">
        <div className="bg-[#242E35] w-full mx-auto py-6 px-5 rounded-2xl shadow-lg mb-6">
          <p className="text-xs text-[#6B7280] mb-4">
            최종 수정일: 2026년 3월 27일
          </p>
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">
            개인정보 처리방침
          </h2>

          {/* 💡 요약 박스로 유저 안심시키기 */}
          <div className="bg-[#1E7F4F]/10 border border-[#1E7F4F]/30 rounded-xl p-4 mb-8">
            <h3 className="text-[#1E7F4F] text-sm font-bold mb-1">
              🔒 안심하세요!
            </h3>
            <p className="text-[#CBD5E1] text-xs leading-relaxed">
              수집된 키, 체중 등의 신체 데이터는 오직 사용자님의 러닝화 수명
              분석 알고리즘에만 사용되며, 제3자에게 절대 제공되거나 마케팅
              용도로 사용되지 않습니다.
            </p>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1B242C] text-[#1E7F4F] flex items-center justify-center text-xs font-bold">
                  1
                </span>
                수집하는 개인정보 항목
              </h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed break-keep mb-3">
                회사는 원활한 맞춤형 러닝화 분석을 위해 아래의 정보를 최소한으로
                수집합니다.
              </p>
              <div className="bg-[#1B242C] p-4 rounded-xl text-sm space-y-2">
                <p className="text-[#CBD5E1]">
                  <span className="text-[#1E7F4F] font-semibold mr-2">
                    [필수]
                  </span>
                  소셜 로그인 식별자
                </p>
                <p className="text-[#CBD5E1]">
                  <span className="text-gray-400 font-semibold mr-2">
                    [선택]
                  </span>
                  키, 체중, 러닝 빈도, 브랜드, 모델명
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1B242C] text-[#1E7F4F] flex items-center justify-center text-xs font-bold">
                  2
                </span>
                개인정보의 수집 및 이용 목적
              </h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed break-keep">
                수집된 정보는 체중에 따른 쿠션 마모도 보정, 러닝 타입에 맞춘
                최적의 신발 추천 및 수명 예측 알고리즘 계산, 그리고 서비스 이용
                통계 분석을 위해서만 사용됩니다.
              </p>
            </section>

            <section>
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1B242C] text-[#1E7F4F] flex items-center justify-center text-xs font-bold">
                  3
                </span>
                개인정보의 보관 및 파기
              </h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed break-keep">
                사용자의 데이터는 회원 탈퇴 시 지체 없이 복구 불가능한 방법으로
                파기됩니다. 단, 관련 법령에 의해 보존할 필요가 있는 경우
                법령에서 정한 기간 동안 보관합니다.
              </p>
            </section>

            <section>
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1B242C] text-[#1E7F4F] flex items-center justify-center text-xs font-bold">
                  4
                </span>
                개인정보 보호를 위한 조치
              </h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed break-keep">
                회사는 사용자의 데이터를 안전하게 보호하기 위해 암호화
                통신(SSL)을 사용하며, 데이터베이스 접근 권한을 엄격하게 통제하고
                있습니다.
              </p>
            </section>
          </div>
        </div>
      </div>
      <TabBar />
    </>
  );
}
