# ShoePlan

러닝화의 누적 주행거리와 아웃솔 마모 패턴을 함께 관리하는 러닝화 케어 서비스입니다.

ShoePlan은 사용자가 등록한 러닝화 정보를 기반으로 교체 시점과 남은 주행거리를 안내하고, 왼발/오른발 아웃솔 이미지를 AI 모델로 분석해 마모 유형과 러닝화 유형 피드백을 제공합니다.

## 주요 기능

- 소셜 로그인 기반 사용자 인증
- 러닝화 브랜드, 모델, 사용 기간, 주행거리 등록
- 누적 주행거리 기반 ShoePlan Insight 제공
- 러닝화 추천 결과 및 대체 추천 모델 제공
- 왼발/오른발 아웃솔 이미지 업로드
- YOLO26s 기반 아웃솔 마모 패턴 분석
- 분석 결과 confidence 표시
- 마모 유형별 러닝화 유형 피드백 제공
- Supabase Storage 이미지 저장
- Supabase DB 사용자별 최신 분석 결과 저장
- 카카오 공유 기능

## 아웃솔 분석 클래스

| Class          | Meaning     |
| -------------- | ----------- |
| `inside`       | 과회내 경향 |
| `outside`      | 과회외 경향 |
| `neutral`      | 중립        |
| `insufficient` | 마모 부족   |

## 서비스 구조

```text
Next.js Web
  -> Next.js API Routes
  -> Render FastAPI Model Server
  -> ONNX Runtime
  -> Supabase DB / Storage
```

- Frontend: Next.js
- Backend API: Next.js API Routes
- Model Server: FastAPI
- Model Runtime: ONNX Runtime
- Database / Storage: Supabase
- Deployment: Vercel, Render

## 기술 스택

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Supabase
- FastAPI
- ONNX Runtime
- Sharp
- Kakao Share SDK

## 프로젝트 구조

```text
src/
  app/
    api/
      outsole/analyze/      # 아웃솔 이미지 분석 API
      updateStats/          # 사용자 러닝화 정보 저장/조회 API
    shoe/
      outsole/              # 아웃솔 업로드 및 결과 페이지
      recommend/            # 러닝화 추천 페이지
    home/                   # ShoePlan Insight 화면
  components/
    common/                 # 공통 UI 컴포넌트
    step-before-login/      # 초기 사용자 정보 입력 단계
    recommend-step/         # 추천 설문 단계
  lib/
    outsoleAnalysis.ts      # 아웃솔 분석 결과 문구 및 타입
    outsoleModel.ts         # 로컬 ONNX 추론 fallback
  utils/
    calculateShoeLife.ts    # 러닝화 수명 계산
    recommendAlgorithm.ts   # 러닝화 추천 로직

model-server/
  app.py                    # FastAPI 모델 서버
  Dockerfile
  requirements.txt

models/
  best.onnx                 # 아웃솔 분석 ONNX 모델
```

## 배포

- 웹 서비스는 Vercel에 배포합니다.
- 모델 추론 서버는 Render에 FastAPI 서버로 배포합니다.
- 학습된 YOLO26s 모델은 ONNX로 변환해 `best.onnx` 형태로 사용합니다.

## 핵심 목표

ShoePlan은 러닝화의 누적 거리만 기록하는 서비스가 아니라, 실제 밑창 마모 패턴을 분석해 러닝화 상태와 러닝 습관을 이해할 수 있도록 돕는 서비스입니다.
