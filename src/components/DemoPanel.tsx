import { useState } from "react";
import { getSeatsLeft, isSellOutOnConfirm, setSeatsLeft, setSellOutOnConfirm } from "../api/mockApi";
import styles from "./DemoPanel.module.css";

export function DemoPanel() {
  const [seatsText, setSeatsText] = useState(() => String(getSeatsLeft()));
  const [sellOutArmed, setSellOutArmed] = useState(isSellOutOnConfirm);

  function handleSeatsChange(text: string) {
    setSeatsText(text);
    if (/^\d+$/.test(text)) setSeatsLeft(Number(text));
  }

  function handleSellOutChange(checked: boolean) {
    setSellOutArmed(checked);
    setSellOutOnConfirm(checked);
  }

  return (
    <details className={styles.panel}>
      <summary>Демо-панель (мок-сервер)</summary>

      <label className={styles.row}>
        Свободных мест
        <input
          className={styles.seatsInput}
          inputMode="numeric"
          value={seatsText}
          onChange={(e) => handleSeatsChange(e.target.value)}
        />
      </label>

      <label className={styles.row}>
        <input type="checkbox" checked={sellOutArmed} onChange={(e) => handleSellOutChange(e.target.checked)} />
        Места закончатся перед подтверждением
      </label>
    </details>
  );
}
