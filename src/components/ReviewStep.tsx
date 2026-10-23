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

  return (
    <div className={styles.review}>
      <div className={shared.card}>
        <h2 className={shared.heading}>Состав заказа</h2>
        <OrderSummary participants={participants} showLines />
      </div>

      <div className={shared.card}>
        <h2 className={shared.heading}>Email</h2>
        <p className={styles.email}>{email.trim()}</p>
      </div>

      {submitFailed && (
        <p className={shared.errorText}>
          Не удалось оформить заказ, попробуйте ещё раз.
        </p>
      )}

      <div className={styles.buttons}>
        <button
          type="button"
          className={shared.buttonSecondary}
          onClick={backToForm}
          disabled={isSubmitting}
        >
          Изменить данные
        </button>
        <button
          type="button"
          className={shared.button}
          onClick={submit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Оформление..." : "Подтвердить заказ"}
        </button>
      </div>
    </div>
  );
}
