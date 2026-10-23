import { useCheckoutStore } from "../store/checkoutStore";
import shared from "./shared.module.css";
import styles from "./ResultScreen.module.css";

export function SoldOutScreen() {
  const participantCount = useCheckoutStore((state) => state.participants.length);
  const seatsLeft = useCheckoutStore((state) => state.seatsLeft) ?? 0;
  const backToForm = useCheckoutStore((state) => state.backToForm);
  const reset = useCheckoutStore((state) => state.reset);

  const noSeatsAtAll = seatsLeft === 0;

  return (
    <div role="alert" className={`${shared.card} ${styles.screen}`}>
      <h2 className={`${styles.title} ${styles.titleWarning}`}>Места закончились</h2>
      <p>
        Пока вы проверяли заказ, места разобрали. Нужно мест: {participantCount}, осталось: {seatsLeft}.
      </p>
      <p>
        {noSeatsAtAll
          ? "Свободных мест больше нет. Введённые данные сохранены, можно попробовать позже."
          : "Введённые данные сохранены, можно уменьшить заказ."}
      </p>

      <div className={styles.actions}>
        <button type="button" className={shared.button} onClick={backToForm}>
          Изменить заказ
        </button>
        {noSeatsAtAll && (
          <button type="button" className={shared.buttonSecondary} onClick={reset}>
            Начать заново
          </button>
        )}
      </div>
    </div>
  );
}
