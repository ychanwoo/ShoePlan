// src/data/shoesDB.ts

export interface Shoe {
  id: string;
  name: string;
  brand: string;
  tags: string[];
  description: string;
  image: string;
}

export const SHOES_DB: Shoe[] = [
  {
    id: "nike-pegasus",
    name: "Nike Pegasus",
    brand: "Nike",
    tags: ["혼합", "Road (아스팔트)", "데일리", "가성비", "단단한쿠션"],
    description:
      "호불호 없는 러닝화의 국밥. 어떤 훈련이든 무난하게 소화하는 든든한 데일리 트레이너입니다.",
    image: "/preview-images/nike-pegasus.webp",
  },
  {
    id: "nike-vaporfly",
    name: "Nike Vaporfly",
    brand: "Nike",
    tags: ["Road (아스팔트)", "경량성", "반발력", "인터벌", "카본화"],
    description:
      "압도적인 스피드를 위한 최고의 선택. 극강의 가벼움과 반발력으로 기록 단축을 돕습니다.",
    image: "/preview-images/nike-vaporfly.webp",
  },
  {
    id: "nike-zoomx",
    name: "Nike ZoomX Invincible",
    brand: "Nike",
    tags: ["Road (아스팔트)", "맥스쿠션", "장거리", "편안함"],
    description:
      "구름 위를 달리는 듯한 엄청난 쿠셔닝. 다리의 피로도를 최소화해주는 리커버리 및 장거리용 러닝화입니다.",
    image: "/preview-images/nike-zoomx.webp",
  },
  {
    id: "adidas-adiospro",
    name: "Adidas Adios Pro",
    brand: "Adidas",
    tags: ["Road (아스팔트)", "경량성", "반발력", "인터벌"],
    description:
      "에너지 손실을 최소화하는 카본 로드. 엘리트 러너들을 위한 초경량 레이싱화입니다.",
    image: "/preview-images/adidas-adiospro.webp",
  },
  {
    id: "adidas-boston",
    name: "Adidas Boston",
    brand: "Adidas",
    tags: ["Road (아스팔트)", "단단한쿠션", "안정감", "인터벌"],
    description:
      "탄탄한 쿠셔닝과 안정성. 조깅부터 템포런까지 커버 가능한 전천후 훈련화입니다.",
    image: "/preview-images/adidas-boston.webp",
  },
  {
    id: "asics-kayano",
    name: "Asics Gel-Kayano",
    brand: "Asics",
    tags: ["Road (아스팔트)", "안정감", "발목안정", "장거리"],
    description:
      "안정화의 대명사. 발목이 무너지지 않도록 꽉 잡아주어 부상 방지에 탁월합니다.",
    image: "/preview-images/asics-kayano.webp",
  },
  {
    id: "asics-magicspeed",
    name: "Asics Magic Speed",
    brand: "Asics",
    tags: ["Track (트랙)", "Road (아스팔트)", "가성비", "반발력", "가벼움"],
    description:
      "합리적인 가격에 즐기는 카본화의 맛. 가볍고 통통 튀는 반발력이 매력적입니다.",
    image: "/preview-images/asics-magicspeed.webp",
  },
  {
    id: "asics-metaspeed",
    name: "Asics Metaspeed",
    brand: "Asics",
    tags: ["Road (아스팔트)", "반발력", "경량성", "인터벌"],
    description:
      "주법에 맞춰 설계된 최고급 레이싱화. 폭발적인 추진력을 제공합니다.",
    image: "/preview-images/asics-metaspeed.webp",
  },
  {
    id: "asics-nimbus",
    name: "Asics Gel-Nimbus",
    brand: "Asics",
    tags: ["Road (아스팔트)", "맥스쿠션", "장거리", "편안함"],
    description:
      "부드러운 쿠셔닝과 포근한 착화감. 발을 감싸는 듯한 편안함으로 장거리 러닝에 최적화되었습니다.",
    image: "/preview-images/asics-nimbus.webp",
  },
  {
    id: "nb-1080",
    name: "New Balance 1080",
    brand: "New Balance",
    tags: ["Road (아스팔트)", "맥스쿠션", "발볼넓음", "장거리"],
    description:
      "발볼러들의 구세주. 풍부한 폼과 넉넉한 공간으로 누구에게나 편안한 러닝을 선사합니다.",
    image: "/preview-images/nb-1080.webp",
  },
  {
    id: "nb-fuelcell",
    name: "New Balance FuelCell",
    brand: "New Balance",
    tags: ["Track (트랙)", "혼합", "말랑한쿠션", "가벼움", "인터벌"],
    description:
      "극도로 푹신하고 통통 튀는 폼. 가벼운 무게로 경쾌한 발구름을 만들어줍니다.",
    image: "/preview-images/nb-fuelcell.webp",
  },
];
