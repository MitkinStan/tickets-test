import { formatRub } from "../domain/pricing";
import { useCheckoutStore } from "../store/checkoutStore";
import shared from "./shared.module.css";
import styles from "./ResultScreen.module.css";

export function SuccessScreen() {
  const order = useCheckoutStore((state) => state.confirmedOrder);
  const reset = useCheckoutStore((state) => state.reset);

  if (!order) return null;

  return (
    <div className={`${shared.card} ${styles.screen}`}>
      <h2 className={`${styles.title} ${styles.titleSuccess}`}>Заказ оформлен</h2>
      <p>
        Номер заказа <strong>{order.id}</strong>. Билеты отправлены на <strong>{order.email}</strong>.
      </p>

      <ul className={styles.list}>
        {order.lines.map((line, index) => (
          <li key={index}>
            {line.name}, {line.age}: {line.type === "full" ? "полный" : "детский"} билет
          </li>
        ))}
      </ul>

      <p className={styles.total}>Итого: {formatRub(order.total)}</p>

      <button type="button" className={shared.buttonSecondary} onClick={reset}>
        Оформить новый заказ
      </button>
    </div>
  );
}
