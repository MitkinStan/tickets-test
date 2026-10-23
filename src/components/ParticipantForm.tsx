import type { FormEvent } from "react";
import {
  ADULT_AGE,
  CHILD_PRICE,
  FULL_PRICE,
  FULL_TICKET_MIN_AGE,
  MAX_PARTICIPANTS,
  formatRub,
  ticketPrice,
  ticketType,
} from "../domain/pricing";
import { parseAge, validateOrder } from "../domain/validation";
import { useCheckoutStore } from "../store/checkoutStore";
import { OrderSummary } from "./OrderSummary";
import shared from "./shared.module.css";
import styles from "./ParticipantForm.module.css";

const TICKET_LABELS = { full: "Полный билет", child: "Детский билет" };

export function ParticipantForm() {
  const participants = useCheckoutStore((state) => state.participants);
  const email = useCheckoutStore((state) => state.email);
  const showAllErrors = useCheckoutStore((state) => state.showAllErrors);
  const touchedFields = useCheckoutStore((state) => state.touchedFields);

  const addParticipant = useCheckoutStore((state) => state.addParticipant);
  const updateParticipant = useCheckoutStore((state) => state.updateParticipant);
  const removeParticipant = useCheckoutStore((state) => state.removeParticipant);
  const setEmail = useCheckoutStore((state) => state.setEmail);
  const touchField = useCheckoutStore((state) => state.touchField);
  const continueToReview = useCheckoutStore((state) => state.continueToReview);

  const errors = validateOrder({ participants, email });

  const isVisible = (fieldKey: string) => showAllErrors || touchedFields[fieldKey];
  const allAgesTouched = participants.every((p) => touchedFields[`${p.id}:age`]);
  const orderErrorVisible = Boolean(errors.order) && (showAllErrors || allAgesTouched);
  const emailError = isVisible("email") ? errors.email : undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    continueToReview();
    requestAnimationFrame(() => {
      form.querySelector<HTMLElement>('[aria-invalid="true"], [data-order-error]')?.focus();
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <div>
        <h2 className={shared.heading}>
          Участники ({participants.length} из {MAX_PARTICIPANTS})
        </h2>
        <p className={shared.hint}>
          От {FULL_TICKET_MIN_AGE} лет: {formatRub(FULL_PRICE)}. Младше {FULL_TICKET_MIN_AGE}: {formatRub(CHILD_PRICE)},
          только вместе с участником от {ADULT_AGE} лет.
        </p>
      </div>

      {participants.map((participant, index) => {
        const nameKey = `${participant.id}:name`;
        const ageKey = `${participant.id}:age`;
        const participantErrors = errors.participants[participant.id] ?? {};
        const nameError = isVisible(nameKey) ? participantErrors.name : undefined;
        const ageError = isVisible(ageKey) ? participantErrors.age : undefined;
        const age = parseAge(participant.age);

        return (
          <fieldset key={participant.id} className={`${shared.card} ${styles.participant}`}>
            <legend>Участник {index + 1}</legend>

            <div className={styles.fields}>
              <div className={styles.nameField}>
                <label htmlFor={nameKey} className={shared.label}>
                  Имя
                </label>
                <input
                  id={nameKey}
                  className={`${shared.input} ${nameError ? shared.inputInvalid : ""}`}
                  value={participant.name}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? `${nameKey}-error` : undefined}
                  onChange={(e) => updateParticipant(participant.id, { name: e.target.value })}
                  onBlur={() => touchField(nameKey)}
                />
                {nameError && (
                  <p id={`${nameKey}-error`} className={shared.errorText}>
                    {nameError}
                  </p>
                )}
              </div>

              <div className={styles.ageField}>
                <label htmlFor={ageKey} className={shared.label}>
                  Возраст
                </label>
                <input
                  id={ageKey}
                  inputMode="numeric"
                  maxLength={3}
                  className={`${shared.input} ${ageError ? shared.inputInvalid : ""}`}
                  value={participant.age}
                  aria-invalid={Boolean(ageError)}
                  aria-describedby={ageError ? `${ageKey}-error` : undefined}
                  onChange={(e) => updateParticipant(participant.id, { age: e.target.value })}
                  onBlur={() => touchField(ageKey)}
                />
                {ageError && (
                  <p id={`${ageKey}-error`} className={shared.errorText}>
                    {ageError}
                  </p>
                )}
              </div>
            </div>

            {age !== null && (
              <p className={styles.ticketHint}>
                {TICKET_LABELS[ticketType(age)]}, {formatRub(ticketPrice(age))}
              </p>
            )}

            {participants.length > 1 && (
              <button
                type="button"
                className={styles.removeButton}
                aria-label={`Удалить участника ${index + 1}`}
                onClick={() => removeParticipant(participant.id)}
              >
                Удалить участника
              </button>
            )}
          </fieldset>
        );
      })}

      <button
        type="button"
        className={shared.buttonSecondary}
        disabled={participants.length >= MAX_PARTICIPANTS}
        onClick={addParticipant}
      >
        {participants.length >= MAX_PARTICIPANTS
          ? `Добавить участника (максимум ${MAX_PARTICIPANTS})`
          : "Добавить участника"}
      </button>

      {orderErrorVisible && (
        <p role="alert" tabIndex={-1} data-order-error className={`${shared.errorText} ${styles.orderError}`}>
          {errors.order}
        </p>
      )}

      <div className={shared.card}>
        <label htmlFor="email" className={shared.label}>
          Email для билетов (один на заказ)
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className={`${shared.input} ${emailError ? shared.inputInvalid : ""}`}
          value={email}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "email-error" : undefined}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => touchField("email")}
        />
        {emailError && (
          <p id="email-error" className={shared.errorText}>
            {emailError}
          </p>
        )}
      </div>

      <div className={shared.card}>
        <OrderSummary participants={participants} showLines={false} />
      </div>

      <button type="submit" className={shared.button}>
        Продолжить
      </button>
    </form>
  );
}
