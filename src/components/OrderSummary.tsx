import { formatAge, formatRub, orderTotal, ticketPrice, ticketType } from "../domain/pricing";
import type { Participant } from "../domain/types";
import { parseAge } from "../domain/validation";
import styles from "./OrderSummary.module.css";

const TICKET_LABELS = { full: "Полный билет", child: "Детский билет" };

type OrderSummaryProps = {
  participants: Participant[];
  showLines: boolean;
};

export function OrderSummary({ participants, showLines }: OrderSummaryProps) {
  const pricedParticipants = participants.flatMap((participant) => {
    const age = parseAge(participant.age);
    return age === null ? [] : [{ ...participant, age }];
  });
  const total = orderTotal(pricedParticipants.map((p) => p.age));

  return (
    <div>
      {showLines && (
        <ul className={styles.list}>
          {pricedParticipants.map((participant) => (
            <li key={participant.id} className={styles.row}>
              <div>
                <div className={styles.name}>{participant.name.trim() || "Без имени"}</div>
                <div className={styles.details}>
                  {TICKET_LABELS[ticketType(participant.age)]}, {formatAge(participant.age)}
                </div>
              </div>
              <div className={styles.price}>{formatRub(ticketPrice(participant.age))}</div>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.total}>
        <span>Итого</span>
        {pricedParticipants.length === 0 ? (
          <span className={styles.empty}>Укажите возраст, чтобы увидеть сумму</span>
        ) : (
          <strong>{formatRub(total)}</strong>
        )}
      </div>
    </div>
  );
}
