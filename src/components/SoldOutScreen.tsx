import { useCheckoutStore } from "../store/checkoutStore";
import shared from "./shared.module.css";
import styles from "./ResultScreen.module.css";

export function SoldOutScreen() {
  const participantCount = useCheckoutStore((state) => state.participants.length);
  const seatsLeft = useCheckoutStore((state) => state.seatsLeft);
  const backToForm = useCheckoutStore((state) => state.backToForm);

  return (
    <div className={`${shared.card} ${styles.screen}`}>
      <h2 className={`${styles.title} ${styles.titleWarning}`}>Места закончились</h2>
      <p>
        Пока вы проверяли заказ, места разобрали. Нужно мест: {participantCount}, осталось: {seatsLeft}.
      </p>
      <p>Введённые данные сохранены, можно изменить заказ.</p>

      <button type="button" className={shared.button} onClick={backToForm}>
        Изменить заказ
      </button>
    </div>
  );
}
