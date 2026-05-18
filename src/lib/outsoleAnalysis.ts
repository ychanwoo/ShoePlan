export type OutsoleClass =
  | "inside"
  | "outside"
  | "neutral"
  | "insufficient"
  | "unknown";

export interface FootAnalysisResult {
  className: OutsoleClass;
  confidence: number | null;
}

export interface OutsoleAnalysisResult {
  leftImageUrl: string | null;
  rightImageUrl: string | null;
  left: FootAnalysisResult;
  right: FootAnalysisResult;
  updatedAt: string;
}

export const OUTSOLE_CLASS_LABEL: Record<OutsoleClass, string> = {
  inside: "과회내 경향",
  insufficient: "마모 부족",
  neutral: "중립",
  outside: "과회외 경향",
  unknown: "재촬영 필요",
};

export const OUTSOLE_RESULT_COPY: Record<
  OutsoleClass,
  { summary: string; recommendation: string }
> = {
  unknown: {
    summary: "러닝화 밑창 사진을 업로드해주시면 마모 패턴을 분석해드릴게요.",
    recommendation: "양쪽 밑창 전체가 보이도록 밝은 곳에서 다시 촬영해주세요.",
  },
  insufficient: {
    summary: "아직 뚜렷한 마모 패턴이 보이지 않아요.",
    recommendation:
      "러닝화가 건강한 상태에 가깝습니다. 조금 더 달린 뒤 다시 확인해보세요.",
  },
  neutral: {
    summary: "현재는 비교적 균형 잡힌 마모 패턴으로 보여요.",
    recommendation: "지금처럼 안정적인 주법을 잘 유지해보세요.",
  },
  outside: {
    summary: "바깥쪽 마모가 더 두드러져 보여요.",
    recommendation:
      "발목 바깥쪽, 종아리, 무릎에 부담이 쌓일 수 있으니 착지 습관을 한 번 점검해보세요.",
  },
  inside: {
    summary: "안쪽 마모가 더 두드러져 보여요.",
    recommendation:
      "발목 안쪽, 무릎 안쪽, 아치에 부담이 갈 수 있으니 무리하지 말고 주법을 천천히 확인해보세요.",
  },
};
