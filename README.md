# CT검사 가이드

삼성서울병원 CT검사를 앞둔 환자가 검사 전 과정과 준비사항을 모바일에서 쉽게 확인할 수 있도록 만든 안내 웹앱입니다.

검사의 기본 원리부터 접수, 탈의, 조영제 검사 준비, 실제 촬영 과정과 주의사항까지 순서대로 안내합니다.

## 주요 기능

- CT검사의 원리와 검사 목적 안내
- 일반 CT와 조영증강 CT 관련 도움말 제공
- 접수부터 검사 완료까지 단계별 검사 순서 안내
- 상의·하의 선택형 탈의 안내와 금속 포함 복장 예시 제공
- 조영제 동의서 작성과 혈관 확보 등 검사 준비사항 안내
- 촬영 중 자세와 호흡 안내를 포함한 CT검사 과정 설명
- 검사 전·중·후 주의사항 구분
- 상단 진행 메뉴를 이용한 단계별 바로가기
- 모바일 화면과 접근성 설정을 고려한 반응형 UI 및 모션 감소 지원

## 안내 흐름

1. 검사 가이드 시작
2. CT검사란?
3. 검사 순서
4. 탈의 안내
5. 검사 준비
6. CT검사
7. 주의사항

## 기술 구성

- React 19
- TypeScript
- Vinext
- Vite
- CSS
- OpenAI Sites / Cloudflare Workers 호환 빌드

현재 별도의 데이터베이스나 로그인 기능은 사용하지 않습니다.

## 로컬 실행

### 요구사항

- Node.js `22.13.0` 이상
- npm

### 설치 및 실행

```bash
npm install
npm run dev
```

개발 서버가 시작되면 터미널에 표시되는 로컬 주소로 접속합니다.

### 빌드와 코드 검사

```bash
npm run build
npm run lint
```

## 프로젝트 구조

```text
ct-guide/
├─ app/
│  ├─ page.tsx        # 7단계 안내 화면과 사용자 상호작용
│  ├─ globals.css     # 전체 디자인, 반응형 레이아웃과 애니메이션
│  └─ layout.tsx      # 문서 구조와 검색·공유용 메타데이터
├─ public/            # 로고, CT 장비·검사 이미지와 안내 이미지
├─ .openai/
│  └─ hosting.json    # Sites 배포 설정
├─ package.json
└─ README.md
```

## 콘텐츠 수정 위치

- 안내 문구와 단계 구성: `app/page.tsx`
- 색상, 간격, 글꼴과 모바일 레이아웃: `app/globals.css`
- 페이지 제목, 설명과 공유 미리보기: `app/layout.tsx`
- 로고와 안내 이미지: `public/`

## 배포

- GitHub 저장소: [Joana-son/ct-guide](https://github.com/Joana-son/ct-guide)
- 배포 주소: [ct-guide.smcradiology.workers.dev](https://ct-guide.smcradiology.workers.dev)

## 운영 전 확인사항

검사 운영 시간, 조영제 관련 설명과 환자 주의사항은 실제 운영 부서 및 의료진의 검토를 거쳐 최신 내용으로 유지해야 합니다. 이 웹앱은 환자 안내를 돕기 위한 자료이며 의료진의 개별 안내를 대신하지 않습니다.
