import { EVENT } from "./api/mockApi";
import { DemoPanel } from "./components/DemoPanel";
import { ParticipantForm } from "./components/ParticipantForm";
import { ReviewStep } from "./components/ReviewStep";
import { SoldOutScreen } from "./components/SoldOutScreen";
import { SuccessScreen } from "./components/SuccessScreen";
import { useCheckoutStore } from "./store/checkoutStore";
import styles from "./App.module.css";

export default function App() {
  const step = useCheckoutStore((state) => state.step);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{EVENT.title}</h1>
        <p className={styles.eventInfo}>{EVENT.date}</p>
        <p className={styles.eventInfo}>{EVENT.place}</p>
      </header>

      <main>
        {step === "form" && <ParticipantForm />}
        {(step === "review" || step === "submitting") && <ReviewStep />}
        {step === "success" && <SuccessScreen />}
        {step === "soldOut" && <SoldOutScreen />}
      </main>

      {step === "form" && <DemoPanel />}
    </div>
  );
}
