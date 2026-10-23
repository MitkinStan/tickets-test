import { formatRub, orderTotal } from "../domain/pricing";
import { useCheckoutStore } from "../store/checkoutStore";
import { OrderSummary } from "./OrderSummary";
import shared from "./shared.module.css";
import styles from "./ReviewStep.module.css";

export function ReviewStep() {
  const participants = useCheckoutStore((state) => state.participants);
  const email = useCheckoutStore((state) => state.email);
  const submitFailed = useCheckoutStore((state) => state.submitFailed);
  const backToForm = useCheckoutStore((state) => state.backToForm);
  const submit = useCheckoutStore((state) => state.submit);

  const isSubmitting = useCheckoutStore((state) => state.step === "submitting");
  const total = orderTotal(participants.map((participant) => Number(participant.age)));

  return (
    <div className={styles.review} aria-busy={isSubmitting}>
      <div>
        <h2 className={shared.heading}>Проверьте заказ</h2>
        <p className={shared.hint}>Всё верно? Можно подтвердить или вернуться и исправить данные.</p>
      </div>

      <div className={shared.card}>
        <h3 className={shared.heading}>Состав заказа</h3>
        <OrderSummary participants={participants} showLines />
      </div>

      <div className={shared.card}>
        <h3 className={shared.heading}>Email</h3>
        <p className={styles.email}>{email.trim()}</p>
      </div>

      {submitFailed && (
        <p role="alert" className={shared.errorText}>
          Не удалось оформить заказ, попробуйте ещё раз.
        </p>
      )}

      <div className={styles.buttons}>
        <button type="button" className={shared.buttonSecondary} onClick={backToForm} disabled={isSubmitting}>
          Изменить данные
        </button>
        <button
          type="button"
          className={shared.button}
          onClick={submit}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Оформление" : `Подтвердить заказ на ${formatRub(total)}`}
        </button>
      </div>
    </div>
  );
}
