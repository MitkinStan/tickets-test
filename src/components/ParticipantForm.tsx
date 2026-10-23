import type { FormEvent } from "react";
import { MAX_PARTICIPANTS } from "../domain/pricing";
import { validateOrder } from "../domain/validation";
import { useCheckoutStore } from "../store/checkoutStore";
import { OrderSummary } from "./OrderSummary";
import shared from "./shared.module.css";
import styles from "./ParticipantForm.module.css";

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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    continueToReview();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <h2 className={shared.heading}>Участники ({participants.length} из {MAX_PARTICIPANTS})</h2>

      {participants.map((participant, index) => {
        const nameKey = `${participant.id}:name`;
        const ageKey = `${participant.id}:age`;
        const participantErrors = errors.participants[participant.id] ?? {};
        const nameError = isVisible(nameKey) ? participantErrors.name : undefined;
        const ageError = isVisible(ageKey) ? participantErrors.age : undefined;

        return (
          <fieldset key={participant.id} className={`${shared.card} ${styles.participant}`}>
            <legend>Участник {index + 1}</legend>

            <div className={styles.fields}>
              <div className={styles.nameField}>
                <label htmlFor={nameKey}>Имя</label>
                <input
                  id={nameKey}
                  className={`${shared.input} ${nameError ? shared.inputInvalid : ""}`}
                  value={participant.name}
                  onChange={(e) => updateParticipant(participant.id, { name: e.target.value })}
                  onBlur={() => touchField(nameKey)}
                />
                {nameError && <p className={shared.errorText}>{nameError}</p>}
              </div>

              <div className={styles.ageField}>
                <label htmlFor={ageKey}>Возраст</label>
                <input
                  id={ageKey}
                  inputMode="numeric"
                  className={`${shared.input} ${ageError ? shared.inputInvalid : ""}`}
                  value={participant.age}
                  onChange={(e) => updateParticipant(participant.id, { age: e.target.value })}
                  onBlur={() => touchField(ageKey)}
                />
                {ageError && <p className={shared.errorText}>{ageError}</p>}
              </div>
            </div>

            {participants.length > 1 && (
              <button type="button" className={styles.removeButton} onClick={() => removeParticipant(participant.id)}>
                Удалить участника
              </button>
            )}
          </fieldset>
        );
      })}

      {participants.length < MAX_PARTICIPANTS && (
        <button type="button" className={shared.buttonSecondary} onClick={addParticipant}>
          Добавить участника
        </button>
      )}

      {showAllErrors && errors.order && <p className={`${shared.errorText} ${styles.orderError}`}>{errors.order}</p>}

      <div className={shared.card}>
        <label htmlFor="email">Email для билетов (один на заказ)</label>
        <input
          id="email"
          type="email"
          className={`${shared.input} ${isVisible("email") && errors.email ? shared.inputInvalid : ""}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => touchField("email")}
        />
        {isVisible("email") && errors.email && <p className={shared.errorText}>{errors.email}</p>}
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
