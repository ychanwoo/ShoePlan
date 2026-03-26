export interface Shoe {
  id: string;
  name: string;
  brand: string;
  tags: string[];
  description: string;
  image: string;
}

export const SHOES_DB: Shoe[] = [
  // ==========================================
  // 1. Nike (나이키)
  // ==========================================
  {
    id: "nike-pegasus",
    name: "Nike Pegasus",
    brand: "Nike",
    tags: ["Mixed (혼합)", "데일리", "가성비", "단단한쿠션"],
    description:
      "호불호 없는 러닝화의 국밥. 어떤 훈련이든 무난하게 소화하는 든든한 전천후 데일리 트레이너입니다.",
    image: "/preview-images/nike-pegasus.webp",
  },
  {
    id: "nike-vomero",
    name: "Nike Vomero",
    brand: "Nike",
    tags: ["Road (아스팔트)", "맥스쿠션", "장거리", "편안함"],
    description:
      "페가수스보다 한층 더 부드럽고 푹신한 쿠셔닝을 제공하여 프리미엄 조깅화로 사랑받는 모델입니다.",
    image: "/preview-images/nike-vomero.webp",
  },
  {
    id: "nike-zoomfly",
    name: "Nike Zoom Fly",
    brand: "Nike",
    tags: ["Road (아스팔트)", "훈련용", "카본플레이트", "인터벌"],
    description:
      "베이퍼플라이의 훈련용 버전. 내구성이 뛰어나며 카본화의 탄성을 훈련에서도 느끼고 싶은 러너에게 적합합니다.",
    image: "/preview-images/nike-zoomfly.webp",
  },
  {
    id: "nike-vaporfly",
    name: "Nike Vaporfly",
    brand: "Nike",
    tags: ["Road (아스팔트)", "경량성", "반발력", "레이싱", "카본화"],
    description:
      "마라톤 생태계를 바꾼 전설의 카본화. 극강의 가벼움과 반발력으로 기록 단축을 돕습니다.",
    image: "/preview-images/nike-vaporfly.webp",
  },
  {
    id: "nike-alphafly",
    name: "Nike Alphafly",
    brand: "Nike",
    tags: ["Road (아스팔트)", "에어줌", "반발력", "레이싱", "카본화"],
    description:
      "엘리트 선수들의 최애 레이싱화. 에어 줌 포드가 장착되어 차원이 다른 추진력을 제공하는 끝판왕 모델입니다.",
    image: "/preview-images/nike-alphafly.webp",
  },

  // ==========================================
  // 2. Adidas (아디다스)
  // ==========================================
  {
    id: "adidas-boston",
    name: "Adidas Adizero Boston",
    brand: "Adidas",
    tags: ["Mixed (혼합)", "단단한쿠션", "안정감", "인터벌"],
    description:
      "탄탄한 쿠셔닝과 에너지로드의 결합. 조깅부터 템포런까지 모두 커버 가능한 아디다스의 대표 훈련화입니다.",
    image: "/preview-images/adidas-boston.webp",
  },
  {
    id: "adidas-adios-pro-3",
    name: "Adidas Adizero Adios Pro 3",
    brand: "Adidas",
    tags: ["Road (아스팔트)", "반발력", "레이싱", "카본화", "장거리"],
    description:
      "수많은 세계 대회 포디움을 휩쓴 엘리트 레이싱화. 에너지 로드가 발가락 구조를 따라 설계되어 폭발적인 속도를 냅니다.",
    image: "/preview-images/adidas-adios-pro-3.webp",
  },
  {
    id: "adidas-evo-sl",
    name: "Adidas Adizero EVO SL",
    brand: "Adidas",
    tags: ["Track (트랙)", "경량성", "훈련용", "가벼움"],
    description:
      "극강의 가벼움을 자랑하는 최신 라이트웨이트 트레이너. 빠르고 경쾌한 발구름이 필요할 때 최적입니다.",
    image: "/preview-images/adidas-evo-sl.webp",
  },
  {
    id: "adidas-adios-pro-4",
    name: "Adidas Adizero Adios Pro 4",
    brand: "Adidas",
    tags: ["Road (아스팔트)", "반발력", "레이싱", "카본화", "최신형"],
    description:
      "더 가벼워지고 반발력이 개선된 아디오스 프로의 최신작. 한계를 뛰어넘으려는 러너를 위한 무기입니다.",
    image: "/preview-images/adidas-adios-pro-4.webp",
  },
  {
    id: "adidas-supernova-rise",
    name: "Adidas Supernova Rise",
    brand: "Adidas",
    tags: ["Mixed (혼합)", "데일리", "편안함", "초보자"],
    description:
      "누구나 편안하게 매일 달릴 수 있도록 설계된 데일리 러닝화. 뛰어난 착화감과 안정적인 쿠셔닝이 특징입니다.",
    image: "/preview-images/adidas-supernova-rise.webp",
  },

  // ==========================================
  // 3. Puma (퓨마)
  // ==========================================
  {
    id: "puma-velocity",
    name: "Puma Velocity Nitro",
    brand: "Puma",
    tags: ["Mixed (혼합)", "데일리", "가성비", "접지력"],
    description:
      "질소 주입 폼의 쫀득한 쿠셔닝과 퓨마그립의 압도적인 접지력을 갖춘 가성비 최고의 데일리 조깅화입니다.",
    image: "/preview-images/puma-velocity.webp",
  },
  {
    id: "puma-deviate",
    name: "Puma Deviate Nitro",
    brand: "Puma",
    tags: ["Mixed (혼합)", "카본훈련화", "반발력", "전천후"],
    description:
      "카본 플레이트가 삽입되어 훈련의 효율을 극대화해주는 모델. 조깅부터 스피드 훈련까지 아우릅니다.",
    image: "/preview-images/puma-deviate.webp",
  },
  {
    id: "puma-deviate-elite",
    name: "Puma Deviate Nitro Elite",
    brand: "Puma",
    tags: ["Road (아스팔트)", "경량성", "레이싱", "카본화"],
    description:
      "퓨마의 최상급 엘리트 마라톤화. 깃털처럼 가벼운 무게와 극대화된 추진력을 자랑합니다.",
    image: "/preview-images/puma-deviate-elite.webp",
  },
  {
    id: "puma-fast-r-elite",
    name: "Puma Fast-R Nitro Elite",
    brand: "Puma",
    tags: ["Road (아스팔트)", "독특한디자인", "레이싱", "반발력"],
    description:
      "뒤꿈치와 앞코가 분리된 파격적인 구조. 공격적인 포어풋/미드풋 러너에게 엄청난 스피드를 제공합니다.",
    image: "/preview-images/puma-fast-r-elite.webp",
  },

  // ==========================================
  // 4. New Balance (뉴발란스)
  // ==========================================
  {
    id: "nb-freshfoam",
    name: "New Balance Fresh Foam",
    brand: "New Balance",
    tags: ["Road (아스팔트)", "맥스쿠션", "발볼넓음", "데일리"],
    description:
      "구름 위를 걷는 듯한 부드러운 쿠셔닝과 넉넉한 발볼 공간으로 조깅의 질을 높여주는 모델입니다.",
    image: "/preview-images/nb-freshfoam.webp",
  },
  {
    id: "nb-sc-trainer",
    name: "New Balance FuelCell SC Trainer",
    brand: "New Balance",
    tags: ["Road (아스팔트)", "슈퍼트레이너", "맥스쿠션", "카본플레이트"],
    description:
      "엄청나게 두꺼운 퓨어셀 폼과 카본이 만난 슈퍼 트레이너. 장거리 훈련 시 데미지를 획기적으로 줄여줍니다.",
    image: "/preview-images/nb-sc-trainer.webp",
  },
  {
    id: "nb-rebel",
    name: "New Balance FuelCell Rebel",
    brand: "New Balance",
    tags: ["Track (트랙)", "말랑한쿠션", "가벼움", "인터벌"],
    description:
      "카본 없이도 극강의 가벼움과 통통 튀는 반발력을 보여주는 펀(Fun) 런의 대명사입니다.",
    image: "/preview-images/nb-rabel.webp",
  },
  {
    id: "nb-sc-elite",
    name: "New Balance FuelCell SC Elite",
    brand: "New Balance",
    tags: ["Road (아스팔트)", "레이싱", "카본화", "편안함"],
    description:
      "가장 발이 편안한 카본 레이싱화 중 하나. 마라톤 풀코스 후반부까지 부드럽게 밀어주는 느낌이 강점입니다.",
    image: "/preview-images/nb-sc-elite.webp",
  },
  {
    id: "nb-sc-pacer",
    name: "New Balance FuelCell SC Pacer",
    brand: "New Balance",
    tags: ["Track (트랙)", "단거리레이싱", "경량성", "카본화"],
    description:
      "5K, 10K 등 짧고 빠른 거리를 폭발적으로 달리기 위해 설계된 로우 프로파일 레이싱화입니다.",
    image: "/preview-images/nb-sc-pacer.webp",
  },

  // ==========================================
  // 5. Asics (아식스)
  // ==========================================
  {
    id: "asics-kayano",
    name: "Asics Gel-Kayano",
    brand: "Asics",
    tags: ["Mixed (혼합)", "안정감", "발목안정", "장거리"],
    description:
      "과내전 방지 및 안정화의 대명사. 관절을 꽉 잡아주어 초보자부터 장거리 러너의 부상을 방지합니다.",
    image: "/preview-images/asics-kayano.webp",
  },
  {
    id: "asics-novablast",
    name: "Asics Novablast",
    brand: "Asics",
    tags: ["Mixed (혼합)", "데일리", "반발력", "말랑한쿠션"],
    description:
      "트램폴린에서 영감을 받은 독특한 아웃솔. 매일 달려도 지루하지 않은 경쾌한 바운스감을 제공합니다.",
    image: "/preview-images/asics-novablast.webp",
  },
  {
    id: "asics-superblast",
    name: "Asics Superblast",
    brand: "Asics",
    tags: ["Mixed (혼합)", "슈퍼트레이너", "맥스쿠션", "경량성"],
    description:
      "압도적인 두께의 프리미엄 폼을 썼음에도 믿기 힘들 정도로 가벼운 '사기캐' 훈련화입니다.",
    image: "/preview-images/asics-superblast.webp",
  },
  {
    id: "asics-magicspeed",
    name: "Asics Magic Speed",
    brand: "Asics",
    tags: ["Track (트랙)", "가성비", "반발력", "카본훈련화"],
    description:
      "접근성 좋은 가격대에 아식스 카본화의 성능을 경험할 수 있는 뛰어난 스피드 훈련용 신발입니다.",
    image: "/preview-images/asics-magicspeed.webp",
  },
  {
    id: "asics-metaspeed",
    name: "Asics Metaspeed",
    brand: "Asics",
    tags: ["Road (아스팔트)", "레이싱", "카본화", "엘리트"],
    description:
      "스트라이드(보폭)형과 케이던스(회전수)형 주법에 맞춰 버전을 선택할 수 있는 초고성능 마라톤화입니다.",
    image: "/preview-images/asics-metaspeed.webp",
  },

  // ==========================================
  // 6. Mizuno (미즈노)
  // ==========================================
  {
    id: "mizuno-inspire",
    name: "Mizuno Wave Inspire",
    brand: "Mizuno",
    tags: ["Road (아스팔트)", "안정감", "웨이브플레이트", "데일리"],
    description:
      "미즈노 특유의 웨이브 플레이트가 발의 흔들림을 제어해주는 든든한 서포트 조깅화입니다.",
    image: "/preview-images/mizuno-inspire.webp",
  },
  {
    id: "mizuno-neo-vista",
    name: "Mizuno Neo Vista",
    brand: "Mizuno",
    tags: ["Road (아스팔트)", "슈퍼트레이너", "편안함", "일체형어퍼"],
    description:
      "양말처럼 발을 감싸는 니트 어퍼와 부드러운 미드솔의 조화가 돋보이는 최신형 장거리 훈련화입니다.",
    image: "/preview-images/mizuno-neo-vista.webp",
  },
  {
    id: "mizuno-rebellion-flash-2",
    name: "Mizuno Wave Rebellion Flash 2",
    brand: "Mizuno",
    tags: ["Track (트랙)", "스피드훈련", "글래스화이버"],
    description:
      "가벼운 무게와 유리섬유 플레이트의 탄성으로 템포런이나 트랙 훈련 시 시원한 스피드감을 제공합니다.",
    image: "/preview-images/mizuno-rebellion-flash-2.webp",
  },
  {
    id: "mizuno-rebellion-pro-2",
    name: "Mizuno Wave Rebellion Pro 2",
    brand: "Mizuno",
    tags: ["Road (아스팔트)", "레이싱", "미드풋", "카본화"],
    description:
      "뒤꿈치가 깎여 있는 파격적인 기하학적 형태. 철저히 미드풋/포어풋 스트라이크를 강제하여 극한의 효율을 뽑아냅니다.",
    image: "/preview-images/mizuno-rebellion-pro-2.webp",
  },

  // ==========================================
  // 7. Hoka (호카)
  // ==========================================
  {
    id: "hoka-bondi",
    name: "Hoka Bondi",
    brand: "Hoka",
    tags: ["Road (아스팔트)", "초맥스쿠션", "리커버리", "관절보호"],
    description:
      "가장 두껍고 가장 푹신한 호카의 상징. 부상 회복 중이거나 관절 보호가 1순위인 러너에게 필수입니다.",
    image: "/preview-images/hoka-bondi.webp",
  },
  {
    id: "hoka-clifton",
    name: "Hoka Clifton",
    brand: "Hoka",
    tags: ["Mixed (혼합)", "데일리", "경량쿠션화", "부드러움"],
    description:
      "맥스 쿠션화인데 너무나 가벼운, 호카 붐을 일으킨 장본인. 누구나 편하게 신기 좋은 데일리화입니다.",
    image: "/preview-images/hoka-clifton.webp",
  },
  {
    id: "hoka-mach-x-2",
    name: "Hoka Mach X2",
    brand: "Hoka",
    tags: ["Road (아스팔트)", "슈퍼트레이너", "Pebax플레이트", "반발력"],
    description:
      "플라스틱 플레이트가 삽입되어 푹신함과 스피드를 동시에 잡은 고성능 데일리 트레이너입니다.",
    image: "/preview-images/hoka-mach-x-2.webp",
  },
  {
    id: "hoka-skyward-x",
    name: "Hoka Skyward X",
    brand: "Hoka",
    tags: ["Road (아스팔트)", "슈퍼맥스쿠션", "장거리", "카본플레이트"],
    description:
      "합법적인 한계를 넘어서는 엄청난 미드솔 두께. 초장거리 러닝 시 다리를 완벽하게 보호해 줍니다.",
    image: "/preview-images/hoka-skyward-x.webp",
  },
  {
    id: "hoka-mach-6",
    name: "Hoka Mach 6",
    brand: "Hoka",
    tags: ["Track (트랙)", "경량성", "반발력", "템포런"],
    description:
      "플레이트 없이 오직 폼의 반발력만으로 경쾌한 스피드를 내는 매력적인 무카본 훈련화입니다.",
    image: "/preview-images/hoka-mach-6.webp",
  },
  {
    id: "hoka-rocket-x-2",
    name: "Hoka Rocket X2",
    brand: "Hoka",
    tags: ["Road (아스팔트)", "레이싱", "카본화", "엘리트"],
    description:
      "호카가 작정하고 만든 최상급 카본 레이싱화. 타 브랜드 레이싱화와 견주어도 손색없는 폭발력을 자랑합니다.",
    image: "/preview-images/hoka-rocket-x-2.webp",
  },

  // ==========================================
  // 8. Saucony (서코니)
  // ==========================================
  {
    id: "saucony-endorphin-speed-4",
    name: "Saucony Endorphin Speed 4",
    brand: "Saucony",
    tags: ["Mixed (혼합)", "나일론플레이트", "전천후", "훈련용"],
    description:
      "가장 완벽한 훈련화 중 하나. 유연한 나일론 플레이트가 삽입되어 다리에 무리를 주지 않으면서 속도를 냅니다.",
    image: "/preview-images/saucony-endorphin-speed-4.webp",
  },
  {
    id: "saucony-endorphin-pro-4",
    name: "Saucony Endorphin Pro 4",
    brand: "Saucony",
    tags: ["Road (아스팔트)", "레이싱", "카본화", "반발력"],
    description:
      "서코니의 최정상급 카본 레이싱화. 공격적인 롤링으로 앞으로 빨려 들어가는 듯한 주행감을 줍니다.",
    image: "/preview-images/saucony-endorphin-pro-4.webp",
  },
  {
    id: "saucony-endorphin-elite",
    name: "Saucony Endorphin Elite",
    brand: "Saucony",
    tags: ["Road (아스팔트)", "레이싱", "슬로티드카본", "초고성능"],
    description:
      "프로를 넘어선 엘리트. 독특하게 갈라진 포크 형태의 카본 플레이트를 사용하여 반발력을 극대화했습니다.",
    image: "/preview-images/saucony-endorphin-elite.webp",
  },

  // ==========================================
  // 9. On (온)
  // ==========================================
  {
    id: "on-cloudmonster",
    name: "On Cloudmonster",
    brand: "On",
    tags: ["Road (아스팔트)", "맥스쿠션", "데일리", "감성디자인"],
    description:
      "온 러닝 특유의 클라우드텍(구멍 뚫린 밑창)이 가장 큼직하게 적용되어, 재밌는 바운스와 쿠션을 제공합니다.",
    image: "/preview-images/on-cloudmonster.webp",
  },
  {
    id: "on-cloudmonster-hyper",
    name: "On Cloudmonster Hyper",
    brand: "On",
    tags: ["Road (아스팔트)", "슈퍼트레이너", "훈련용"],
    description:
      "클라우드몬스터에 고급 폼을 추가 적용하여, 장거리 및 스피드 훈련의 질을 높인 프리미엄 모델입니다.",
    image: "/preview-images/on-cloudmonster-hyper.webp",
  },
  {
    id: "on-cloudsurfer-max",
    name: "On Cloudsurfer Max",
    brand: "On",
    tags: ["Road (아스팔트)", "편안함", "리커버리", "초보자"],
    description:
      "밑창의 홀이 찌그러지며 도미노처럼 반응하는 구조. 스무스한 체중 이동과 극강의 부드러움을 선사합니다.",
    image: "/preview-images/on-cloudsurfer-max.webp",
  },
  {
    id: "on-cloudboom-max",
    name: "On Cloudboom Max",
    brand: "On",
    tags: ["Road (아스팔트)", "레이싱", "카본화", "장거리"],
    description:
      "스위스 기술력의 정수를 담은 엘리트 레이싱화. 마라톤 전 구간에서 빠른 페이스를 안정적으로 유지시켜 줍니다.",
    image: "/preview-images/on-cloudboom-max.webp",
  },
  {
    id: "on-cloudboom-strike",
    name: "On Cloudboom Strike",
    brand: "On",
    tags: ["Road (아스팔트)", "최상위레이싱", "혁신적구조", "카본화"],
    description:
      "양말 같은 어퍼와 미드솔 일체형 설계 등 가장 파격적이고 혁신적인 기술이 들어간 온의 최종 병기입니다.",
    image: "/preview-images/on-cloudboom-strike.webp",
  },
];
