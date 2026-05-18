"use client";

import HeaderBar from "@/components/common/HeaderBar";
import TabBar from "@/components/common/TabBar";
import "@/styles/globals.css";
import { Activity, BarChart3, ShieldCheck, TrendingUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

interface ShoeInsightsResponse {
  averageAccumulatedDistance: number;
  averageUsagePercent: number;
  distanceMode: string;
  monthlyMileageMode: number;
  riskCounts: {
    caution: number;
    replace: number;
    safe: number;
  };
  runningTypeCounts: Record<string, number>;
  totalUsers: number;
  warningUsers: number;
}

const emptyInsights: ShoeInsightsResponse = {
  averageAccumulatedDistance: 0,
  averageUsagePercent: 0,
  distanceMode: "데이터 없음",
  monthlyMileageMode: 0,
  riskCounts: {
    caution: 0,
    replace: 0,
    safe: 0,
  },
  runningTypeCounts: {},
  totalUsers: 0,
  warningUsers: 0,
};

const riskRows = [
  { color: "bg-[#34D399]", key: "safe", label: "안전" },
  { color: "bg-[#FBBF24]", key: "caution", label: "주의" },
  { color: "bg-[#F87171]", key: "replace", label: "교체 권장" },
] as const;

export default function ShoePage() {
  const router = useRouter();
  const [insights, setInsights] = useState<ShoeInsightsResponse>(emptyInsights);
  const [isInsightLoading, setIsInsightLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const response = await fetch("/api/shoe-insights", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to load shoe insights");
        const data = (await response.json()) as ShoeInsightsResponse;
        setInsights(data);
      } catch (error) {
        console.error("Shoe insights load error:", error);
      } finally {
        setIsInsightLoading(false);
      }
    };

    loadInsights();
    const intervalId = window.setInterval(loadInsights, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadInsights();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const runningTypeRows = useMemo(() => {
    const entries = Object.entries(insights.runningTypeCounts).sort(
      (a, b) => b[1] - a[1],
    );
    const max = Math.max(...entries.map(([, count]) => count), 1);

    return entries.map(([label, count]) => ({
      count,
      label,
      width: `${Math.max(12, (count / max) * 100)}%`,
    }));
  }, [insights.runningTypeCounts]);

  const warningPercent = insights.totalUsers
    ? Math.round((insights.warningUsers / insights.totalUsers) * 100)
    : 0;

  return (
    <>
      <HeaderBar title="Shoe" />

      <div className="h-[calc(100vh-11vh)] overflow-y-auto pt-3 pb-28">
        <div className="mt-5 ml-5 flex gap-x-1 text-xl text-[#CBD5E1]">
          <Activity className="text-[#CBD5E1]" />
          <h2>ShoePlan Insight</h2>
        </div>

        <div className="mt-4">
          <Swiper
            autoplay={{ delay: 2600, disableOnInteraction: false }}
            className="shoe-insight-swiper"
            loop
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            slidesPerView={1}
            spaceBetween={16}
          >
            <SwiperSlide>
              <InsightSlide>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-[#CBD5E1]" size={20} />
                  <h3 className="text-base font-medium text-[#CBD5E1]">
                    Runner Average
                  </h3>
                </div>

                {isInsightLoading ? (
                  <p className="mt-5 text-sm text-[#94A3B8]">
                    인사이트를 불러오는 중입니다...
                  </p>
                ) : (
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <MetricBox label="교체 주의" value={`${warningPercent}%`} />
                    <MetricBox
                      label="월 평균 마일리지"
                      value={`${insights.monthlyMileageMode}km`}
                    />
                    <MetricBox
                      label="평균 사용률"
                      value={`${insights.averageUsagePercent}%`}
                    />
                  </div>
                )}
              </InsightSlide>
            </SwiperSlide>

            <SwiperSlide>
              <InsightSlide>
                <div className="flex items-center gap-2">
                  <TrendingUpDown className="text-[#CBD5E1]" size={20} />
                  <h3 className="text-base font-medium text-[#CBD5E1]">
                    Shoe Risk
                  </h3>
                </div>
                <div className="mt-4 flex flex-col gap-2.5">
                  {riskRows.map((row) => (
                    <InsightBar
                      key={row.key}
                      color={row.color}
                      count={insights.riskCounts[row.key]}
                      label={row.label}
                      max={Math.max(
                        insights.riskCounts.safe,
                        insights.riskCounts.caution,
                        insights.riskCounts.replace,
                        1,
                      )}
                      total={insights.totalUsers}
                    />
                  ))}
                </div>
              </InsightSlide>
            </SwiperSlide>

            <SwiperSlide>
              <InsightSlide>
                <div className="flex items-center gap-2">
                  <BarChart3 className="text-[#CBD5E1]" size={20} />
                  <h3 className="text-base font-medium text-[#CBD5E1]">
                    Running Type
                  </h3>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {runningTypeRows.length ? (
                    runningTypeRows.map((row) => (
                      <div
                        className="rounded-xl bg-[#1B242C] px-2.5 py-2"
                        key={row.label}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-[11px] text-[#CBD5E1]">
                            {row.label}
                          </span>
                          <span className="shrink-0 text-[11px] text-[#94A3B8]">
                            {insights.totalUsers
                              ? Math.round(
                                  (row.count / insights.totalUsers) * 100,
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#2B3740]">
                          <div
                            className="h-full rounded-full bg-[#60A5FA]"
                            style={{ width: row.width }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#94A3B8]">
                      아직 러닝 타입 데이터가 없습니다.
                    </p>
                  )}
                </div>
              </InsightSlide>
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="mx-auto mt-5 h-40 w-92.5 rounded-2xl bg-[#242E35] text-[#CBD5E1]">
          <div className="ml-4 flex gap-x-2 pt-5">
            <TrendingUpDown />
            <h2 className="text-xl">Trend Insight</h2>
          </div>
          <div className="mt-3 flex flex-col gap-2 px-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/70">20대 러너</span>
              <span className="font-semibold text-green-400">
                데일리화 · 레이싱화
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/70">30대 러너</span>
              <span className="font-semibold text-yellow-300">
                쿠셔닝 · 데일리화
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/70">40대 이상</span>
              <span className="font-semibold text-blue-300">
                균형형 · 안정성
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 px-4">
          <p className="mb-4 text-center text-[15px] font-semibold tracking-tight text-white/90">
            내 러닝화 상태를 확인해보세요
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              className="group relative overflow-hidden rounded-[24px] bg-linear-to-br from-[#1E7F4F] to-[#16643D] p-4 text-left text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition active:scale-[0.98] hover:from-[#1a7247] hover:to-[#135836]"
              onClick={() => router.push("/shoe/outsole")}
            >
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/10 blur-2xl transition group-hover:scale-110" />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-white/70 transition-all duration-300 group-hover:w-full" />

              <div className="relative flex h-32 flex-col justify-between">
                <div>
                  <span className="inline-flex rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white/80 uppercase">
                    Analysis
                  </span>
                  <p className="mt-3 text-[16px] leading-tight font-bold tracking-[-0.02em]">
                    아웃솔 분석
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/75">
                    마모 패턴 확인
                  </p>
                </div>

                <div className="flex items-end justify-between">
                  <span className="text-[11px] text-white/55">
                    Outsole Check
                  </span>
                  <span className="text-sm font-medium text-white/90 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </button>

            <button
              className="group relative overflow-hidden rounded-[24px] border border-white/8 bg-[#27323A] p-4 text-left text-white shadow-[0_10px_30px_rgba(0,0,0,0.14)] transition active:scale-[0.98] hover:border-white/15 hover:bg-[#2d3942]"
              onClick={() => router.push("/shoe/recommend")}
            >
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/8 blur-2xl transition group-hover:scale-110" />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-white/50 transition-all duration-300 group-hover:w-full" />

              <div className="relative flex h-32 flex-col justify-between">
                <div>
                  <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white/70 uppercase">
                    Recommend
                  </span>
                  <p className="mt-3 text-[16px] leading-tight font-bold tracking-[-0.02em]">
                    러닝화 추천
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/75">
                    트렌드 기반 추천
                  </p>
                </div>

                <div className="flex items-end justify-between">
                  <span className="text-[11px] text-white/55">Trend Pick</span>
                  <span className="text-sm font-medium text-white/90 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <TabBar />
    </>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#1B242C] p-3">
      <p className="text-[11px] text-[#94A3B8]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#CBD5E1]">{value}</p>
    </div>
  );
}

function InsightSlide({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto h-43 w-92.5 overflow-hidden rounded-2xl bg-[#242E35] p-4 text-[#CBD5E1] shadow-lg">
      {children}
    </section>
  );
}

function InsightBar({
  color,
  count,
  label,
  max,
  total,
}: {
  color: string;
  count: number;
  label: string;
  max: number;
  total: number;
}) {
  const width = `${Math.max(8, (count / max) * 100)}%`;
  const percent = total ? Math.round((count / total) * 100) : 0;

  return (
    <div>
      <div className="mb-0.5 flex justify-between text-[11px]">
        <span className="text-[#CBD5E1]">{label}</span>
        <span className="text-[#94A3B8]">{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#1B242C]">
        <div className={`h-full rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  );
}
