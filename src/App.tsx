import { useEffect, useRef } from "react";
import { EVENT } from "./api/mockApi";
import { DemoPanel } from "./components/DemoPanel";
import { ParticipantForm } from "./components/ParticipantForm";
import { ReviewStep } from "./components/ReviewStep";
import { SoldOutScreen } from "./components/SoldOutScreen";
import { SuccessScreen } from "./components/SuccessScreen";
import { useCheckoutStore, type Step } from "./store/checkoutStore";
import styles from "./App.module.css";

const PROGRESS_LABELS = ["Данные", "Проверка", "Готово"];

function progressIndex(step: Step): number {
  if (step === "form") return 0;
  if (step === "success") return PROGRESS_LABELS.length;
  return 1;
}

export default function App() {
  const step = useCheckoutStore((state) => state.step);
  const mainRef = useRef<HTMLElement>(null);
  const previousScreen = useRef<string | null>(null);

  const screen = step === "submitting" ? "review" : step;
  const currentIndex = progressIndex(step);

  useEffect(() => {
    const isFirstRender = previousScreen.current === null;
    const screenChanged = previousScreen.current !== screen;
    previousScreen.current = screen;
    if (isFirstRender || !screenChanged) return;

    window.scrollTo(0, 0);
    mainRef.current?.focus();
  }, [screen]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{EVENT.title}</h1>
        <p className={styles.eventInfo}>{EVENT.date}</p>
        <p className={styles.eventInfo}>{EVENT.place}</p>

        <ol className={styles.progress} aria-label="Шаги оформления">
          {PROGRESS_LABELS.map((label, index) => {
            const isDone = index < currentIndex;
            const isActive = index === currentIndex;
            const stateClass = isDone ? styles.progressDone : isActive ? styles.progressActive : "";

            return (
              <li
                key={label}
                className={`${styles.progressItem} ${stateClass}`}
                aria-current={isActive ? "step" : undefined}
              >
                <span className={styles.progressMarker}>{index + 1}</span>
                <span>{label}</span>
              </li>
            );
          })}
        </ol>
      </header>

      <main ref={mainRef} tabIndex={-1} className={styles.main}>
        {step === "form" && <ParticipantForm />}
        {(step === "review" || step === "submitting") && <ReviewStep />}
        {step === "success" && <SuccessScreen />}
        {step === "soldOut" && <SoldOutScreen />}
      </main>

      {step === "form" && <DemoPanel />}
    </div>
  );
}
