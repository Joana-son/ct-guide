"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardPenLine, ScanSearch, Shirt, TicketCheck } from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type GuideMode = "general" | "noncontrast" | "pediatric";

const guideModeLabels: Record<GuideMode, string> = {
  general: "조영",
  noncontrast: "비조영",
  pediatric: "소아",
};

const guideModeSubtitles: Record<GuideMode, string> = {
  general: "조영검사",
  noncontrast: "비조영검사",
  pediatric: "소아검사",
};

const mainGuideSections = [
  { label: "CT검사란?", step: 2 },
  { label: "검사순서", step: 3 },
  { label: "주의사항", step: 7 },
] as const;

const examSubSections = [
  { label: "탈의안내", step: 4 },
  { label: "검사준비", step: 5 },
  { label: "CT검사", step: 6 },
] as const;

const introLine1 = "CT검사의 전 과정을 이해하고 준비할 수 있도록";
const introLine2 = "안내해드립니다.";
const introMessage = `${introLine1} ${introLine2}`;
const introTypingText = `${introLine1}${introLine2}`;

const getScanImage = (mode: GuideMode) => mode === "general" ? "/ct-scan.gif" : "/noncontrast-ct.gif";
const getMonitoringImage = (mode: GuideMode) => mode === "pediatric"
  ? "/ct-monitoring-scene-pediatric.webp"
  : "/ct-monitoring-scene-korean.webp";

// 화면을 넘긴 직후 큰 이미지가 처음 로드되면서 끊기지 않도록 다음 화면의 이미지를 미리 준비합니다.
function preloadImages(sources: string[]) {
  sources.forEach((source) => {
    const image = new Image();
    image.decoding = "async";
    image.src = source;
    void image.decode().catch(() => undefined);
  });
}

function Header({
  step,
  mode,
  onNavigate,
  onModeChange,
}: {
  step: Step;
  mode: GuideMode;
  onNavigate: (step: Step) => void;
  onModeChange: (mode: GuideMode) => void;
}) {
  const subToolbarRef = useRef<HTMLElement>(null);
  const isExamProcess = step >= 3 && step <= 6;
  const visibleExamSubSections = mode !== "general"
    ? examSubSections.filter((section) => section.step !== 5)
    : examSubSections;

  useEffect(() => {
    const activeItem = subToolbarRef.current?.querySelector<HTMLElement>(".sub-progress-item.active");
    if (!activeItem) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    activeItem.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [step]);

  return (
    <header className={`site-header${isExamProcess ? " has-subtoolbar" : ""}`}>
      <div className="header-brand-row">
        <label className="guide-mode-selector">
          <span className="sr-only">검사 안내 버전 선택</span>
          <select
            value={mode}
            aria-label="검사 안내 버전 선택"
            onChange={(event) => onModeChange(event.target.value as GuideMode)}
          >
            {(Object.keys(guideModeLabels) as GuideMode[]).map((modeKey) => (
              <option key={modeKey} value={modeKey}>
                {guideModeLabels[modeKey]}
              </option>
            ))}
          </select>
        </label>
        <span className="site-title">CT 검사 가이드</span>
        <img className="smc-logo" src="/smc-logo.png?v=2" alt="SMC 삼성서울병원" />
      </div>

      <nav className="progress-toolbar" aria-label="CT검사 주요 안내 메뉴">
        <ol>
          {mainGuideSections.map((section, index) => {
            const isActive = section.step === 3 ? isExamProcess : section.step === step;

            return (
              <li key={section.label}>
                {index > 0 && <span className="step-separator" aria-hidden="true">›</span>}
                <button
                  className={`progress-item${isActive ? " active" : ""}`}
                  type="button"
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => onNavigate(section.step)}
                >
                  {section.label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {isExamProcess && (
        <nav ref={subToolbarRef} className="process-subtoolbar" aria-label="검사순서 세부 안내 메뉴">
          <ol className={visibleExamSubSections.length === 2 ? "two-items" : undefined}>
          {visibleExamSubSections.map((section) => {
              const isActive = section.step === step;

              return (
                <li key={section.label}>
                  <button
                    className={`sub-progress-item${isActive ? " active" : ""}`}
                    type="button"
                    aria-current={isActive ? "step" : undefined}
                    onClick={() => onNavigate(section.step)}
                  >
                    {section.label}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </header>
  );
}

function IntroScreen({ mode, onStart }: { mode: GuideMode; onStart: () => void }) {
  const [typedMessage, setTypedMessage] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedMessage(introTypingText);
      setIsTypingDone(true);
      return;
    }

    let characterIndex = 0;
    let typingTimer: number | undefined;
    const startTimer = window.setTimeout(() => {
      typingTimer = window.setInterval(() => {
        characterIndex += 1;
        setTypedMessage(introTypingText.slice(0, characterIndex));

        if (characterIndex >= introTypingText.length) {
          window.clearInterval(typingTimer);
          setIsTypingDone(true);
        }
      }, 52);
    }, 220);

    return () => {
      window.clearTimeout(startTimer);
      if (typingTimer !== undefined) window.clearInterval(typingTimer);
    };
  }, []);

  return (
    <section className="screen intro-screen" aria-labelledby="intro-title">
      <main className="screen-content intro-content">
        <div className="intro-copy">
          <h1 id="intro-title">CT 검사 가이드</h1>
          <p className="intro-mode-label">{guideModeSubtitles[mode]}</p>
          <p className="intro-description" aria-label={introMessage}>
            <span aria-hidden="true">
              {typedMessage.slice(0, introLine1.length)}
              {typedMessage.length > introLine1.length && (
                <>
                  <br />
                  {typedMessage.slice(introLine1.length)}
                </>
              )}
            </span>
            {!isTypingDone && <span className="typing-caret" aria-hidden="true" />}
          </p>
          <figure className={`hero-machine${isTypingDone ? " is-visible" : ""}`}>
            <img src="/ct-guide-machine.jpg" alt="CT 검사 장비" />
          </figure>
        </div>
      </main>

      <nav className="bottom-actions" aria-label="검사 가이드 시작">
        <button className="primary-button" type="button" onClick={onStart}>
          시작하기
        </button>
      </nav>
    </section>
  );
}

function CtScanStory({ mode }: { mode: GuideMode }) {
  const [scannerReady, setScannerReady] = useState(false);
  const [scanReady, setScanReady] = useState(false);
  const scanImage = getScanImage(mode);
  const scanImageAlt = mode !== "general"
    ? "연속으로 펼쳐지는 비조영 두부 CT axial 단면 영상"
    : "연속으로 펼쳐지는 CT 단면 영상";
  const isReady = scannerReady && scanReady;

  return (
    <figure className={`scan-story${isReady ? " is-ready" : ""}`} aria-label="CT 장비가 한 바퀴 회전해 단면 영상을 만드는 과정">
      <div className="scanner-panel">
        <img src="/siemens-ct.webp" alt="Siemens CT 장비" decoding="async" onLoad={() => setScannerReady(true)} />
        <div className="gantry-orbit" aria-hidden="true">
          <span />
        </div>
      </div>
      <div className="scan-connector" aria-hidden="true">
        <span />
      </div>
      <div className="scan-result">
        <div className="scan-result-frame">
          <img src={scanImage} alt={scanImageAlt} decoding="async" onLoad={() => setScanReady(true)} />
        </div>
      </div>
    </figure>
  );
}

// 이 목록에는 조영제에 대한 '기본 설명'만 담습니다.
// 이상반응(부작용) 증상이나 과거 부작용 안내는 뒤쪽 '주의사항' 화면에서 다루므로
// 여기서는 내용을 중복해서 추가하지 마세요.
const contrastInfoLines = [
  "조영제는 CT 영상에서 혈관과 장기, 병변을 더 잘 구분할 수 있도록 돕는 약제입니다.",
  "검사 목적에 따라 정맥으로 주입하며, 모든 CT 검사에 사용하는 것은 아닙니다.",
  "주입하는 동안 몸이 따뜻해지거나 소변이 마려운 느낌이 들 수 있으며 대부분 곧 사라집니다.",
] as const;

function AboutScreen({
  mode,
  onBack,
  onNext,
}: {
  mode: GuideMode;
  onBack: () => void;
  onNext: () => void;
}) {
  const [isContrastInfoOpen, setIsContrastInfoOpen] = useState(false);

  useEffect(() => {
    if (!isContrastInfoOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsContrastInfoOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isContrastInfoOpen]);

  return (
    <section className="screen about-screen" aria-labelledby="about-title">
      <main className="screen-content about-content">
        <div className="section-heading">
          <h1 id="about-title">CT검사란?</h1>
          <p>CT검사의 원리와 검사 전 준비사항을 알려드립니다.</p>
        </div>

        <CtScanStory mode={mode} />

        <div className="info-blocks">
          <article className="info-block">
            {mode === "pediatric" ? (
              <>소아 CT검사는 X선을 이용해 신체 내부를 단면 영상으로 확인하는 검사입니다. 환자의 연령과 체격, 검사 부위에 따라 검사 범위와 조건을 조정하여 진단에 필요한 최소한의 방사선량으로 검사를 시행합니다.</>
            ) : (
              <>CT검사는 X-ray를 이용해 몸 안을 여러 각도에서 검사하고, 그 데이터를 단면 영상처럼 재구성해서 장기와 혈관, 뼈와 같은 내부 구조를 선명하게 확인할 수 있는 영상 검사입니다.</>
            )}
          </article>
          {mode === "pediatric" && (
            <article className="info-block emphasis-block">
              검사 처방에 따라 조영제를 사용하거나 별도의 준비가 필요할 수 있습니다.
            </article>
          )}
          {mode === "general" && (
            <article className="info-block emphasis-block">
              검사 목적에 따라{" "}
              <span className="contrast-term-wrap">
                <button
                  className="contrast-term"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={isContrastInfoOpen}
                  onClick={() => setIsContrastInfoOpen(true)}
                >
                  조영제
                </button>
                <span className="contrast-hover-hint" aria-hidden="true">클릭해보세요</span>
              </span>
              를 사용하거나 별도의 준비가 필요할 수 있습니다.
            </article>
          )}
        </div>
      </main>

      {isContrastInfoOpen && (
        <div className="contrast-modal-backdrop" onMouseDown={() => setIsContrastInfoOpen(false)}>
          <section
            className="contrast-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contrast-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="contrast-modal-close"
              type="button"
              aria-label="조영제 설명 닫기"
              onClick={() => setIsContrastInfoOpen(false)}
            >
              ×
            </button>
            <figure className="contrast-modal-media">
              <img
                src="/contrast-ct-comparison.png"
                alt="조영제 사용에 따른 CT 영상 차이 비교"
              />
              <figcaption>조영제 사용에 따른 CT 영상 차이 예시</figcaption>
            </figure>
            <p className="contrast-modal-label">CT검사 도움말</p>
            <h2 id="contrast-modal-title">조영제란?</h2>
            <ol className="contrast-info-list">
              {contrastInfoLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
            <button
              className="contrast-modal-confirm"
              type="button"
              onClick={() => setIsContrastInfoOpen(false)}
            >
              확인했어요
            </button>
          </section>
        </div>
      )}

      <nav className="bottom-actions" aria-label="검사 가이드 이동">
        <button className="primary-button" type="button" onClick={onNext}>
          다음 단계
        </button>
        <button className="back-button" type="button" onClick={onBack}>
          이전
        </button>
      </nav>
    </section>
  );
}

// 선택한 버전에 맞춰 검사 순서의 설명만 바꾸고 아이콘과 화면 구조는 동일하게 유지합니다.
function getExamSteps(mode: GuideMode) {
  if (mode === "noncontrast") {
    return [
      { title: "접수", description: "예약 시간 1시간 전부터 접수가 가능합니다.", Icon: TicketCheck },
      { title: "탈의", description: "금속이 없는 옷을 입은 경우 별도 탈의 없이 진행하며, 필요한 경우 근무자의 안내에 따라 탈의합니다.", Icon: Shirt },
      { title: "CT검사", description: "예약 순서에 따라 검사실로 들어가 비조영 검사를 진행합니다.", Icon: ScanSearch },
    ] as const;
  }

  if (mode === "pediatric") {
    return [
      { title: "접수", description: "예약 시간 1시간 전부터 접수가 가능합니다.", Icon: TicketCheck },
      { title: "탈의", description: "금속이 없는 편안한 옷을 준비하고, 필요한 경우 직원의 안내에 따라 검사복으로 갈아입습니다.", Icon: Shirt },
      { title: "CT검사", description: "검사에 대한 설명을 들은 뒤 검사 테이블에 누워 CT검사를 진행합니다. 필요한 경우 근무자의 안내에 따라 보호자가 함께할 수 있습니다.", Icon: ScanSearch },
    ] as const;
  }

  return [
    { title: "접수", description: "예약 시간 1시간 전부터 접수가 가능합니다.", Icon: TicketCheck },
    { title: "탈의", description: "금속이 없는 옷을 입은 경우 별도 탈의 없이 진행하며, 필요한 경우 근무자의 안내에 따라 탈의합니다.", Icon: Shirt },
    { title: "검사준비", description: "처치실에서 동의서 작성 후 조영제 주입을 위한 혈관을 확보합니다.", Icon: ClipboardPenLine },
    { title: "CT검사", description: "예약 순서에 따라 검사실로 들어가 검사를 진행합니다.", Icon: ScanSearch },
  ] as const;
}

function ExamProcessScreen({
  mode,
  onBack,
  onNext,
}: {
  mode: GuideMode;
  onBack: () => void;
  onNext: () => void;
}) {
  // '검사실별 운영 시간' 문구를 누르면 아래쪽 운영 시간 영역으로 화면을 이동시킵니다.
  // 동작 최소화(prefers-reduced-motion) 설정을 쓰는 사용자에게는 애니메이션 없이 즉시 이동합니다.
  const handleJumpToOperationHours = () => {
    const target = document.getElementById("operation-hours");
    if (!target) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  };

  const examSteps = getExamSteps(mode);

  return (
    <section className="screen process-screen" aria-labelledby="process-title">
      <main className="screen-content process-content">
        <div className="section-heading">
          <h1 id="process-title">검사 순서</h1>
          <p>접수부터 검사까지 순서대로 진행됩니다.</p>
        </div>

        <ol className="exam-timeline">
          {examSteps.map((item) => (
            <li className="timeline-item" key={item.title}>
              <div className="timeline-label">
                <item.Icon className="timeline-label-icon" aria-hidden="true" />
                <span>{item.title}</span>
              </div>
              <div className="timeline-rail" aria-hidden="true">
                <span />
              </div>
              <article className="timeline-card">
                {item.description}
                {item.title === "접수" && (
                  <>
                    {" "}
                    <button
                      type="button"
                      className="hours-jump-link"
                      onClick={handleJumpToOperationHours}
                      aria-label="검사실별 운영 시간으로 이동"
                    >
                      검사실별 운영 시간
                      <span className="hours-jump-icon" aria-hidden="true">
                        👇
                      </span>
                    </button>
                  </>
                )}
              </article>
            </li>
          ))}
        </ol>

        {/* 위 '검사실별 운영 시간' 버튼이 스크롤로 이동하는 목적지입니다.
            id와 scroll-margin-top(전역 CSS)으로 상단 고정 메뉴에 가려지지 않게 합니다. */}
        <section className="operation-hours" id="operation-hours" aria-labelledby="operation-hours-title">
          <h2 id="operation-hours-title">검사 운영 시간</h2>
          <div className="operation-hours-grid">
            <article className="operation-hours-card">
              <strong>본관 · 암병원</strong>
              <dl>
                <div>
                  <dt>평일</dt>
                  <dd>07:00~20:00</dd>
                </div>
                <div>
                  <dt>주말 및 공휴일</dt>
                  <dd>08:00~16:30</dd>
                </div>
              </dl>
            </article>
            <article className="operation-hours-card">
              <strong>양성자센터</strong>
              <dl>
                <div>
                  <dt>평일</dt>
                  <dd>08:00~16:30</dd>
                </div>
              </dl>
            </article>
          </div>
        </section>
      </main>

      <nav className="bottom-actions" aria-label="검사 가이드 이동">
        <button className="primary-button" type="button" onClick={onNext}>
          다음 단계
        </button>
        <button className="back-button" type="button" onClick={onBack}>
          이전
        </button>
      </nav>
    </section>
  );
}

function ChangingScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [selectedGarment, setSelectedGarment] = useState<"top" | "bottom" | null>(null);
  const [topImageReady, setTopImageReady] = useState(false);
  const [bottomImageReady, setBottomImageReady] = useState(false);
  const [detailImageReady, setDetailImageReady] = useState(false);
  const selectedDetails = selectedGarment === "top"
    ? {
        title: "상의에서 확인할 항목",
        src: "/changing-upper-details.webp",
        alt: "상의 탈의 안내: 금속 단추, 지퍼, 금속 장식, 금속 로고 상표, 여성 속옷, 목걸이",
      }
    : selectedGarment === "bottom"
      ? {
          title: "하의에서 확인할 항목",
          src: "/changing-lower-details.webp",
          alt: "하의 탈의 안내: 금속 단추, 지퍼, 금속 장식, 금속 로고 상표",
        }
      : null;

  const toggleGarment = (garment: "top" | "bottom") => {
    setDetailImageReady(false);
    setSelectedGarment((current) => (current === garment ? null : garment));
  };

  return (
    <section className="screen changing-screen" aria-labelledby="changing-title">
      <main className="screen-content changing-content">
        <div className="section-heading">
          <h1 id="changing-title">탈의 안내</h1>
          <p><strong>검사 부위에 따라</strong> 금속이 포함된 복장은 영상에 영향을 줄 수 있습니다.</p>
        </div>

        <div className={`garment-selectors${topImageReady && bottomImageReady ? " is-ready" : ""}`} aria-label="탈의 복장 종류 선택">
          <button
            className={`garment-selector ${selectedGarment === "top" ? "active" : ""}`}
            type="button"
            aria-expanded={selectedGarment === "top"}
            onClick={() => toggleGarment("top")}
          >
            <span className="garment-label">상의</span>
            <span className="garment-icon-wrap" aria-hidden="true">
              <img src="/plain-shirt.webp" alt="" decoding="async" onLoad={() => setTopImageReady(true)} />
            </span>
            <span className="garment-hint">눌러서 확인해보세요</span>
          </button>

          <button
            className={`garment-selector ${selectedGarment === "bottom" ? "active" : ""}`}
            type="button"
            aria-expanded={selectedGarment === "bottom"}
            onClick={() => toggleGarment("bottom")}
          >
            <span className="garment-label">하의</span>
            <span className="garment-icon-wrap" aria-hidden="true">
              <img src="/plain-pants.webp" alt="" decoding="async" onLoad={() => setBottomImageReady(true)} />
            </span>
            <span className="garment-hint">눌러서 확인해보세요</span>
          </button>
        </div>

        <div className="garment-details-region" aria-live="polite">
          {selectedDetails && (
            <div className={`garment-details${detailImageReady ? " is-ready" : ""}`} key={selectedGarment}>
              <strong className="garment-detail-title">{selectedDetails.title}</strong>
              <img src={selectedDetails.src} alt={selectedDetails.alt} decoding="async" onLoad={() => setDetailImageReady(true)} />
            </div>
          )}
        </div>

        {selectedDetails && (
          <article className="changing-guide-card changing-guide-note garment-note">
            금속이 없는 옷을 입은 경우 별도 탈의 없이 진행하며, 검사에 따라 필요한 경우 근무자의
            안내에 따라 탈의합니다.
          </article>
        )}
      </main>

      <nav className="bottom-actions" aria-label="검사 가이드 이동">
        <button className="primary-button" type="button" onClick={onNext}>
          다음 단계
        </button>
        <button className="back-button" type="button" onClick={onBack}>
          이전
        </button>
      </nav>
    </section>
  );
}

function getPreparationContent(mode: GuideMode) {
  if (mode === "noncontrast") {
    return {
      title: "비조영 검사 준비",
      subtitle: "조영제를 사용하지 않고 검사를 준비합니다.",
      messages: [
        "조영제 주입을 위한 동의서 작성이나 혈관 확보 없이 진행합니다.",
        "검사 부위에 있는 금속 물품은 직원의 안내에 따라 제거합니다.",
        "검사 종류에 따라 별도 준비사항이 있을 수 있으므로 예약 안내를 확인해주세요.",
      ],
      warning: "임신 중이거나 임신 가능성이 있다면 검사 전에 직원에게 알려주세요.",
    };
  }

  if (mode === "pediatric") {
    return {
      title: "소아 검사 준비",
      subtitle: "아이가 편안하게 검사받을 수 있도록 함께 준비합니다.",
      messages: [
        "보호자는 아이에게 CT 장비와 검사 과정을 쉽고 편안한 말로 설명해주세요.",
        "최근 감기나 발열, 복용 중인 약, 알레르기가 있다면 직원에게 알려주세요.",
        "조영제나 진정이 필요한 경우 금식 등 별도 준비사항을 안내받게 됩니다.",
      ],
      warning: "병원에서 안내받은 금식·복약 지침이 있다면 반드시 지켜주세요.",
    };
  }

  return {
    title: "검사 준비",
    subtitle: "조영제 검사를 위한 준비를 진행합니다.",
    messages: [
      "처치실에서 조영제 주입에 대한 안내와 동의서를 작성합니다.",
      "조영제를 넣기 위해 혈관 확보를 합니다.",
      "부작용 이력이 있는 경우, 별도 준비과정 및 대기시간이 발생할 수 있습니다.",
    ],
    warning: "이전에 조영제 부작용이 있었다면 꼭! 직원에게 말해주세요.",
  };
}

function PreparationScreen({
  mode,
  onBack,
  onNext,
}: {
  mode: GuideMode;
  onBack: () => void;
  onNext: () => void;
}) {
  const preparationContent = getPreparationContent(mode);

  return (
    <section className="screen preparation-screen" aria-labelledby="preparation-title">
      <main className="screen-content preparation-content">
        <div className="section-heading">
          <h1 id="preparation-title">{preparationContent.title}</h1>
          <p>{preparationContent.subtitle}</p>
        </div>

        <div className="preparation-layout">
          <div
            className={`preparation-visual${mode === "noncontrast" ? " noncontrast-visual" : ""}`}
            role="img"
            aria-label={mode === "noncontrast" ? "조영제 주입 없이 진행하는 CT 검사" : "검사 안내와 동의서 그림"}
          >
            {mode === "noncontrast" ? (
              <ScanSearch className="preparation-mode-icon" aria-hidden="true" />
            ) : (
              <>
                <div className="consent-document" aria-hidden="true">
                  <span className="document-fold" />
                  <span className="document-heading" />
                  <span className="document-line line-long" />
                  <span className="document-line line-medium" />
                  <span className="document-line line-long" />
                  <span className="document-check"><i /> <b /></span>
                  <span className="document-check"><i /> <b /></span>
                  <span className="document-signature" />
                </div>
                <span className="document-pen" aria-hidden="true" />
              </>
            )}
          </div>

          <div className="preparation-messages">
            {preparationContent.messages.map((message) => (
              <article className="preparation-message" key={message}>
                {message}
              </article>
            ))}
            <blockquote className="preparation-warning">
              {preparationContent.warning}
            </blockquote>
          </div>
        </div>
      </main>

      <nav className="bottom-actions" aria-label="검사 가이드 이동">
        <button className="primary-button" type="button" onClick={onNext}>
          다음 단계
        </button>
        <button className="back-button" type="button" onClick={onBack}>
          이전
        </button>
      </nav>
    </section>
  );
}

function getCtExamStages(mode: GuideMode) {
  const basicStages = [
    { title: "자세 잡기", description: "검사 테이블에 누운 후 검사 부위에 맞춰 자세를 잡습니다." },
    { title: "검사 시작", description: "검사 테이블이 CT 장비 안으로 이동하며 검사가 진행됩니다." },
    { title: "움직임·호흡 안내", description: "정확한 검사를 위해 움직이지 말고, 안내 방송에 따라 숨을 잠시 참아주세요.", breathing: true },
  ] as const;

  if (mode !== "general") {
    return [
      { title: "검사 준비", description: "검사 테이블에 누운 후 안내에 따라 자세를 잡습니다." },
      { title: "검사 시작", description: "검사 테이블이 CT 장비 안으로 이동하며 검사가 진행됩니다." },
      { title: "자세 유지", description: "정확한 검사를 위해 움직이지 않고 자세를 그대로 유지해주세요." },
    ] as const;
  }

  return [
    ...basicStages,
    { title: "조영제 주입 시", description: "몸이 따뜻해지면서 어지럽고 소변이 마려운 느낌이 들 수 있습니다. 이러한 느낌은 대부분 빠르게 사라집니다." },
  ] as const;
}

function CtExamScreen({
  mode,
  onBack,
  onNext,
}: {
  mode: GuideMode;
  onBack: () => void;
  onNext: () => void;
}) {
  const [breathingPhase, setBreathingPhase] = useState<"idle" | "hold" | "breathe">("idle");
  const [monitoringImageReady, setMonitoringImageReady] = useState(false);
  const ctExamStages = getCtExamStages(mode);
  const monitoringImage = getMonitoringImage(mode);

  useEffect(() => {
    if (breathingPhase !== "hold") return;

    const timer = window.setTimeout(() => setBreathingPhase("breathe"), 2000);
    return () => window.clearTimeout(timer);
  }, [breathingPhase]);

  return (
    <section className="screen ct-exam-screen" aria-labelledby="ct-exam-title">
      <main className="screen-content ct-exam-content">
        <div className="section-heading">
          <h1 id="ct-exam-title">CT검사</h1>
          <p>검사실 직원의 안내에 따라주세요.</p>
        </div>

        <ol className="ct-exam-flow">
          {ctExamStages.map((stage, index) => (
            <li className="ct-stage" key={stage.title}>
              <span className="ct-stage-number" aria-hidden="true">{index + 1}</span>
              <div className="ct-stage-copy">
                <strong>{stage.title}</strong>
                <p>{stage.description}</p>
              </div>
              {"breathing" in stage && stage.breathing && (
                <button
                  className={`breathing-guide breathing-${breathingPhase}`}
                  type="button"
                  disabled={breathingPhase === "hold"}
                  onClick={() => setBreathingPhase("hold")}
                  aria-label={breathingPhase === "idle" ? "호흡 연습 시작" : "호흡 연습 다시 시작"}
                >
                  <span className="breathing-ring" aria-hidden="true" />
                  <b aria-live="polite">
                    {breathingPhase === "idle" && "호흡 연습"}
                    {breathingPhase === "hold" && <>숨 들이마시고<br />참으세요</>}
                    {breathingPhase === "breathe" && "숨 쉬세요"}
                  </b>
                </button>
              )}
            </li>
          ))}
        </ol>

        <div className={`ct-monitoring-panel${monitoringImageReady ? " is-ready" : ""}`}>
          <figure className="ct-monitoring-visual">
            <img
              src={monitoringImage}
              alt={mode === "pediatric" ? "보호자가 곁에서 지켜보는 가운데 안전벨트를 착용하고 CT검사를 받는 소아 환자" : "조정실에서 검사자가 CT 영상을 확인하며 유리창 너머 검사 중인 환자를 관찰하는 모습"}
              decoding="async"
              onLoad={() => setMonitoringImageReady(true)}
            />
          </figure>
          <p className="ct-monitor-note">
            안전한 검사를 위해 검사 중에도 환자분을 보고 들을 수 있습니다. 문제가 있다면 언제든 알려주세요.
          </p>
        </div>
      </main>

      <nav className="bottom-actions" aria-label="검사 가이드 이동">
        <button className="primary-button" type="button" onClick={onNext}>
          주의사항 확인하기
        </button>
        <button className="back-button" type="button" onClick={onBack}>
          이전
        </button>
      </nav>
    </section>
  );
}

function getCautionSections(mode: GuideMode) {
  if (mode === "noncontrast") {
    return [
      { title: "검사 전에 알려주세요", tone: "before", items: ["임신 중이거나 임신 가능성이 있는 경우", "검사 부위의 금속 물품을 제거하기 어려운 경우"] },
      { title: "검사 후 확인해주세요", tone: "after", items: ["직원의 별도 안내가 없다면 일상생활로 돌아가도 됩니다.", "검사와 관련해 궁금한 점이 있다면 직원에게 문의해주세요."] },
    ];
  }

  if (mode === "pediatric") {
    return [
      { title: "검사 전에 알려주세요", tone: "before", items: ["검사 중 자세를 유지하기 어렵거나 불안이 큰 경우", "검사실에 동반할 보호자가 임신 중이거나 임신 가능성이 있는 경우"] },
      { title: "검사 중 안전하게 지켜주세요", tone: "safety", items: ["검사 테이블은 바닥에서 높게 위치하므로 안전벨트를 착용한 뒤 검사를 진행합니다.", "낙상 위험이 있으므로 환자가 임의로 움직이거나 일어나지 않도록 해주세요.", "보호자가 함께 있는 동안에는 특히 어린 환자의 움직임을 항상 살펴주세요."] },
      { title: "검사 후 확인해주세요", tone: "after", items: ["직원의 별도 안내가 없다면 일상생활로 돌아가도 됩니다.", "귀가 후 불편한 증상이 생기거나 계속되면 병원에 문의해주세요."] },
    ];
  }

  return [
    { title: "검사 전에 알려주세요", tone: "before", items: ["임신 중이거나 임신 가능성이 있는 경우", "이전에 조영제 부작용이 있었던 경우", "천식이 있는 경우"] },
    { title: "검사 중 즉시 알려주세요", tone: "urgent", items: ["주사 부위에 심한 통증이나 붓기가 있는 경우", "두드러기, 가려움 또는 피부 발진이 생기는 경우", "얼굴이나 목이 붓는 느낌이 드는 경우", "호흡곤란, 심한 어지러움 또는 불편감이 있는 경우"] },
    { title: "검사 후 확인해주세요", tone: "after", items: ["수분 제한이 없다면 물을 충분히 섭취해주세요.", "귀가 후 수시간에서 수일 사이 피부 발진이 생기거나 증상이 지속되면 병원에 문의해주세요."] },
  ];
}

function PrecautionsScreen({
  mode,
  onBack,
  onFinish,
}: {
  mode: GuideMode;
  onBack: () => void;
  onFinish: () => void;
}) {
  const cautionSections = getCautionSections(mode);

  return (
    <section className="screen precautions-screen" aria-labelledby="precautions-title">
      <main className="screen-content precautions-content">
        <div className="section-heading precautions-heading">
          <h1 id="precautions-title">주의사항</h1>
          <p>불편한 증상이 있으면 참지 말고 바로 알려주세요.</p>
        </div>

        <div className="caution-sections">
          {cautionSections.map((section) => (
            <section className={`caution-card caution-${section.tone}`} key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </main>

      <nav className="bottom-actions" aria-label="검사 가이드 이동">
        <button className="primary-button" type="button" onClick={onFinish}>
          처음으로 돌아가기
        </button>
        <button className="back-button" type="button" onClick={onBack}>
          이전
        </button>
      </nav>
    </section>
  );
}

export function GuideApp({ mode }: { mode: GuideMode }) {
  const [step, setStep] = useState<Step>(1);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [step]);

  useEffect(() => {
    const assets = step === 1
      ? ["/siemens-ct.webp", getScanImage(mode)]
      : step <= 3
        ? ["/plain-shirt.webp", "/plain-pants.webp", "/changing-upper-details.webp", "/changing-lower-details.webp"]
        : step <= 5
          ? [getMonitoringImage(mode)]
          : [];
    const timer = window.setTimeout(() => preloadImages(assets), 80);
    return () => window.clearTimeout(timer);
  }, [mode, step]);

  const handleModeChange = (nextMode: GuideMode) => {
    const modePaths: Record<GuideMode, string> = {
      general: "/contrast",
      noncontrast: "/noncontrast",
      pediatric: "/pediatric",
    };
    window.location.assign(modePaths[nextMode]);
  };

  return (
    <div className="site-shell">
      <Header step={step} mode={mode} onNavigate={setStep} onModeChange={handleModeChange} />
      {step === 1 ? (
        <IntroScreen mode={mode} onStart={() => setStep(2)} />
      ) : step === 2 ? (
        <AboutScreen mode={mode} onBack={() => setStep(1)} onNext={() => setStep(3)} />
      ) : step === 3 ? (
        <ExamProcessScreen mode={mode} onBack={() => setStep(2)} onNext={() => setStep(4)} />
      ) : step === 4 ? (
        <ChangingScreen onBack={() => setStep(3)} onNext={() => setStep(mode === "general" ? 5 : 6)} />
      ) : step === 5 ? (
        <PreparationScreen mode={mode} onBack={() => setStep(4)} onNext={() => setStep(6)} />
      ) : step === 6 ? (
        <CtExamScreen mode={mode} onBack={() => setStep(mode === "general" ? 5 : 4)} onNext={() => setStep(7)} />
      ) : (
        <PrecautionsScreen mode={mode} onBack={() => setStep(6)} onFinish={() => setStep(1)} />
      )}
    </div>
  );
}

// 기존 기본 주소를 사용 중인 안내지나 QR코드가 끊기지 않도록 일반 조영검사를 표시합니다.
export default function Home() {
  return <GuideApp mode="general" />;
}
