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
  { summary: string; shoeType: string; recommendation: string }
> = {
  unknown: {
    summary: "러닝화 밑창 사진을 업로드해주시면 마모 패턴을 분석해드릴게요.",
    shoeType: "재촬영 후 안내",
    recommendation: "양쪽 밑창 전체가 보이도록 밝은 곳에서 다시 촬영해주세요.",
  },
  insufficient: {
    summary: "아직 마모가 충분하지 않아 정확한 경향 판단이 어렵습니다.",
    shoeType: "현재 신발 유지, 추가 주행 후 재분석",
    recommendation:
      "현재 신발을 조금 더 사용한 뒤 다시 분석해보세요.",
  },
  neutral: {
    summary: "마모 패턴이 비교적 균형적으로 나타났습니다.",
    shoeType: "데일리 트레이너, 경량 트레이너, 레이싱화 (목적에 맞게)",
    recommendation:
      "특별한 보정 기능이 강한 신발보다는, 사용 목적과 착용감에 맞는 러닝화를 선택하는 것을 권장합니다.",
  },
  outside: {
    summary: "바깥쪽 마모가 두드러져 보여요.",
    shoeType: "쿠션화, 충격 흡수형, 기본형 러닝화",
    recommendation:
      "충격 흡수를 도와주는 쿠션형 러닝화가 잘 맞을 수 있습니다.",
  },
  inside: {
    summary: "안쪽 마모가 두드러져 보여요.",
    shoeType: "안정화, 서포트화, 모션 컨트롤화",
    recommendation:
      "발의 안쪽 지지력을 보완할 수 있는 안정화 또는 서포트형 러닝화를 고려해보세요.",
  },
};
