# D-CODE Web

대전을 해석하다 D-CODE의 웹 버전입니다.

## 특징

- 모바일 최적화된 반응형 디자인
- 네이티브 앱과 동일한 사용자 경험
- 터치 친화적인 인터페이스
- PWA 지원

## 기술 스택

- React 19
- TypeScript
- Vite
- CSS3

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── icons/          # SVG 아이콘 컴포넌트
│   ├── SplashScreen1.tsx
│   ├── SplashScreen2.tsx
│   ├── MainScreen.tsx
│   ├── RecommendedModal.tsx
│   ├── RecommendedModalWithDetail.tsx
│   └── JourneyPlanningScreen.tsx
├── assets/             # 이미지, 폰트 등 정적 파일
└── App.tsx            # 메인 앱 컴포넌트
```

## 모바일 최적화

- 터치 이벤트 최적화
- 반응형 디자인 (768px, 480px 브레이크포인트)
- 모바일 브라우저 호환성
- PWA 메타데이터 설정

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
