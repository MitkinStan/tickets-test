import { MAX_PARTICIPANTS, ADULT_AGE, FULL_TICKET_MIN_AGE } from "./pricing";

import {
  type Participant,
  type Order,
  type ParticipantErrors,
  type OrderErrors,
} from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function parseAge(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d{1,3}$/.test(trimmed)) return null;
  const age = Number(trimmed);
  return age <= 120 ? age : null;
}

export function validateParticipant(p: Participant): ParticipantErrors {
  const errors: ParticipantErrors = {};
  if (!p.name.trim()) errors.name = "Укажите имя";
  if (!p.age.trim()) errors.age = "Укажите возраст";
  else if (parseAge(p.age) === null) {
    errors.age = "Введите целое число от 0 до 120";
  }

  return errors;
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Укажите email";
  if (!EMAIL_RE.test(email.trim())) {
    return "Проверьте формат email";
  }
  return undefined;
}

export function childrenWithoutAdult(ages: number[]): boolean {
  const hasChild = ages.some((a) => a < FULL_TICKET_MIN_AGE);
  const hasAdult = ages.some((a) => a >= ADULT_AGE);
  return hasChild && !hasAdult;
}

export function validateOrder(order: Order): OrderErrors {
  const errors: OrderErrors = { participants: {} };

  if (
    order.participants.length < 1 ||
    order.participants.length > MAX_PARTICIPANTS
  ) {
    errors.order = `В заказе должно быть от 1 до ${MAX_PARTICIPANTS} участников`;
  }

  for (const p of order.participants) {
    const e = validateParticipant(p);
    if (e.name || e.age) errors.participants[p.id] = e;
  }

  errors.email = validateEmail(order.email);

  const ages = order.participants.map((p) => parseAge(p.age));
  if (
    !errors.order &&
    ages.every((a): a is number => a !== null) &&
    childrenWithoutAdult(ages)
  ) {
    errors.order =
      "Ребёнка младше 14 лет можно купить только вместе с участником от 18 лет";
  }

  return errors;
}

export function hasErrors(errors: OrderErrors): boolean {
  return (
    Object.keys(errors.participants).length > 0 ||
    Boolean(errors.email) ||
    Boolean(errors.order)
  );
}
