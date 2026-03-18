import { SHOES_DB } from "@/data/shoeDB";

interface UserProfile {
  running_place?: string;
  shoe_pros?: string[];
  shoe_cons?: string[];
}

export function getRecommendations(userProfile: UserProfile) {
  const { running_place, shoe_pros, shoe_cons } = userProfile;

  const scoredShoes = SHOES_DB.map((shoe) => ({
    ...shoe,
    score: 0,
    matchedReasons: [] as string[],
  }));

  // 가중치 분석
  scoredShoes.forEach((shoe) => {
    if (running_place && shoe.tags.includes(running_place)) {
      shoe.score += 5;
    }

    // [단점(Cons) 보완 로직] - 유저의 불만을 해결해주는 신발에 가산점
    if (
      shoe_cons?.includes("쿠션이 부족했다") &&
      shoe.tags.includes("맥스쿠션")
    ) {
      shoe.score += 15;
      shoe.matchedReasons.push("풍부한 맥스 쿠셔닝으로 충격 완화");
    }
    if (
      shoe_cons?.includes("쿠션이 너무 말랑했다") &&
      shoe.tags.includes("단단한쿠션")
    ) {
      shoe.score += 10;
      shoe.matchedReasons.push("너무 무르지 않고 탄탄한 쿠셔닝 제공");
    }
    if (
      shoe_cons?.includes("발볼이 좁았다") &&
      shoe.tags.includes("발볼넓음")
    ) {
      shoe.score += 15;
      shoe.matchedReasons.push("여유롭고 편안한 발볼 공간 제공");
    }
    if (shoe_cons?.includes("발볼이 넓었다") && shoe.tags.includes("안정감")) {
      shoe.score += 10;
      shoe.matchedReasons.push("발을 흔들림 없이 안정적으로 잡아주는 핏");
    }
    if (
      shoe_cons?.includes("발목 안정감이 부족했다") &&
      (shoe.tags.includes("안정감") || shoe.tags.includes("발목안정"))
    ) {
      shoe.score += 15;
      shoe.matchedReasons.push("발목 무너짐을 꽉 잡아주는 뛰어난 안정성");
    }
    if (
      shoe_cons?.includes("무게가 무거웠다") &&
      (shoe.tags.includes("경량성") || shoe.tags.includes("가벼움"))
    ) {
      shoe.score += 15;
      shoe.matchedReasons.push("기존보다 훨씬 가벼워진 경량성 체감");
    }
    if (
      shoe_cons?.includes("반발력이 아쉬웠다") &&
      shoe.tags.includes("반발력")
    ) {
      shoe.score += 15;
      shoe.matchedReasons.push("통통 튀는 반발력으로 시원한 추진력 보완");
    }
    if (
      shoe_cons?.includes("착·탈이 불편했다") &&
      (shoe.tags.includes("편안함") || shoe.tags.includes("데일리"))
    ) {
      shoe.score += 5;
      shoe.matchedReasons.push("언제든 편하게 신고 벗기 좋은 데일리화 특성");
    }

    // [장점(Pros) 극대화 로직] - 유저가 만족했던 특성을 가진 신발에 가산점
    if (
      shoe_pros?.includes("쿠션감이 좋았다") &&
      (shoe.tags.includes("맥스쿠션") || shoe.tags.includes("말랑한쿠션"))
    ) {
      shoe.score += 10;
      shoe.matchedReasons.push("기존에 만족하셨던 풍성한 쿠션감 유지");
    }
    if (
      shoe_pros?.includes("안정감이 있었다") &&
      shoe.tags.includes("안정감")
    ) {
      shoe.score += 10;
      shoe.matchedReasons.push("만족하셨던 든든한 안정감과 지지력 유지");
    }
    if (
      shoe_pros?.includes("가볍게 느껴졌다") &&
      (shoe.tags.includes("경량성") || shoe.tags.includes("가벼움"))
    ) {
      shoe.score += 10;
      shoe.matchedReasons.push("만족하셨던 깃털 같은 가벼움 유지");
    }
    if (
      shoe_pros?.includes("반발력이 좋았다") &&
      shoe.tags.includes("반발력")
    ) {
      shoe.score += 10;
      shoe.matchedReasons.push("뛰어난 반발력으로 경쾌한 러닝 감각 유지");
    }
    if (
      shoe_pros?.includes("착용감이 편했다") &&
      shoe.tags.includes("편안함")
    ) {
      shoe.score += 10;
      shoe.matchedReasons.push("발을 부드럽게 감싸는 우수한 착용감 유지");
    }
    if (
      shoe_pros?.includes("장거리 러닝에 편했다") &&
      shoe.tags.includes("장거리")
    ) {
      shoe.score += 10;
      shoe.matchedReasons.push("장거리 러닝에 최적화된 편안한 설계 적용");
    }
    if (
      shoe_pros?.includes("인터벌 러닝에 편했다") &&
      shoe.tags.includes("인터벌")
    ) {
      shoe.score += 10;
      shoe.matchedReasons.push("스피드 훈련에 적합한 폭발적 퍼포먼스 발휘");
    }
    if (
      shoe_pros?.includes("통기성이 좋았다") &&
      (shoe.tags.includes("경량성") || shoe.tags.includes("인터벌"))
    ) {
      shoe.score += 5;
      shoe.matchedReasons.push("열 배출이 탁월한 쾌적한 통풍성 유지");
    }
  });

  // 점수 내림차순 정렬
  scoredShoes.sort((a, b) => b.score - a.score);

  // 결과 반환
  const bestMatch = scoredShoes[0];
  const alternatives = [scoredShoes[1], scoredShoes[2]];

  const reasonText =
    bestMatch.matchedReasons.length > 0
      ? `입력하신 러닝 스타일을 분석한 결과입니다. ${bestMatch.matchedReasons.slice(0, 3).join(", ")}해주는 느낌을 받을 수 있습니다.`
      : `입력하신 데이터 기준 해당 러닝화가 전반적으로 잘 맞을 확률이 높은 러닝화입니다.`;

  return { bestMatch, alternatives, reasonText };
}
