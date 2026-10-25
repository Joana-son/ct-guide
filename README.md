# CT검사 가이드

삼성서울병원 CT검사를 앞둔 환자가 검사 전 과정과 준비사항을 모바일에서 쉽게 확인할 수 있도록 만든 안내 웹앱입니다.

검사의 기본 원리부터 접수, 탈의, 검사 준비, 실제 검사 과정과 주의사항까지 순서대로 안내합니다. 일반 조영검사·비조영검사·소아검사는 각각 전용 URL로 제공됩니다.

## 검사별 주소

- 일반 조영검사: `https://ct-guide.smcradiology.workers.dev/contrast`
- 비조영검사: `https://ct-guide.smcradiology.workers.dev/noncontrast`
- 소아검사: `https://ct-guide.smcradiology.workers.dev/pediatric`
- 기존 기본 주소(`/`)는 일반 조영검사 안내를 유지합니다.

## 주요 기능

- CT검사의 원리와 검사 목적 안내
- 일반 CT와 조영증강 CT 관련 도움말 제공
- 접수부터 검사 완료까지 단계별 검사 순서 안내
- 상의·하의 선택형 탈의 안내와 금속 포함 복장 예시 제공
- 조영제 동의서 작성과 혈관 확보 등 검사 준비사항 안내
- 검사 중 자세와 호흡 안내를 포함한 CT검사 과정 설명
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

- Node.js `24.22.1` 권장 (`.node-version`, `.nvmrc`에 지정)
- 지원하는 보안 수정 버전: 22.23.4 이상인 22.x, 24.22.1 이상인 24.x, 26.12.1 이상인 26.x
- npm

### 설치 및 실행

```bash
npm ci
npm run dev
```

개발 서버가 시작되면 터미널에 표시되는 로컬 주소로 접속합니다.

### 빌드와 코드 검사

```bash
npm run build
npm run lint
```

### 보안 업데이트 (2026-10-25)

- 2026-10-21 Node.js 보안 공지를 반영하여 개발·빌드용 Node.js 기준을 올렸습니다. 이전 보안 취약 버전에서는 의존성 설치를 중단하도록 설정했습니다.
- React와 서버 컴포넌트 패키지, Vinext, Vite, Cloudflare 빌드 도구를 보안 수정 버전으로 갱신했습니다. 재현 가능한 설치를 위해 `package-lock.json`도 함께 관리합니다.
- Cloudflare 빌드 환경에서 `NODE_VERSION`을 별도로 지정했다면 `24.22.1`로 맞춰야 합니다. `.node-version`보다 우선하는 별도 설정은 파일 수정만으로 바뀌지 않습니다.
- 운영 CT 가이드는 Cloudflare Workers 런타임에서 실행됩니다. 로컬 PC의 Node.js 버전과 운영 런타임은 별개이며, Cloudflare 런타임의 보안 수정은 Cloudflare가 관리합니다.
- `small-bowel-ct/index.html`은 정적 HTML·이미지 카드뉴스로, Node.js 서버나 서버 컴포넌트를 실행하지 않습니다.

업데이트 시 `npm audit`, `npm run build`, `npm test`를 실행하고 조영·비조영·소아 안내를 확인합니다. Node.js 설치 자체는 `.node-version` 수정으로 교체되지 않으므로 로컬 실행에도 지정 버전을 사용해야 합니다.

공식 공지: [Node.js 2026-10-21 보안 업데이트](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)

## 프로젝트 구조

```text
ct-guide/
├─ app/
│  ├─ page.tsx        # 7단계 안내 화면과 사용자 상호작용
│  ├─ contrast/       # 일반 조영검사 전용 URL
│  ├─ noncontrast/    # 비조영검사 전용 URL
│  ├─ pediatric/      # 소아검사 전용 URL
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

## 이미지 출처

- 비조영검사 axial CT GIF: Wikimedia Commons의 정상 비조영 두부 CT 연속 단면을 환자 안내 화면에 맞게 편집해 사용했습니다. 원본: Mikael Häggström, M.D., CC0 1.0.

## 배포

- GitHub 저장소: [Joana-son/ct-guide](https://github.com/Joana-son/ct-guide)
- 배포 주소: [ct-guide.smcradiology.workers.dev](https://ct-guide.smcradiology.workers.dev)

## 운영 전 확인사항

검사 운영 시간, 조영제 관련 설명과 환자 주의사항은 실제 운영 부서 및 의료진의 검토를 거쳐 최신 내용으로 유지해야 합니다. 이 웹앱은 환자 안내를 돕기 위한 자료이며 의료진의 개별 안내를 대신하지 않습니다.
