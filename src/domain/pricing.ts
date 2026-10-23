import { type TicketType } from "./types";

export const ADULT_AGE = 18;
export const FULL_TICKET_MIN_AGE = 14;
export const MAX_PARTICIPANTS = 4;
export const FULL_PRICE = 2000;
export const CHILD_PRICE = 1000;

export function ticketType(age: number): TicketType {
  return age >= FULL_TICKET_MIN_AGE ? "full" : "child";
}

export function ticketPrice(age: number): number {
  return ticketType(age) === "full" ? FULL_PRICE : CHILD_PRICE;
}

export function orderTotal(ages: number[]): number {
  return ages.reduce((acc, age) => acc + ticketPrice(age), 0);
}

export function formatRub(amount: number): string {
  return `${amount.toLocaleString("ru-RU")}\u00A0₽`;
}

export function formatAge(age: number): string {
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${age} лет`;
  if (lastDigit === 1) return `${age} год`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${age} года`;
  return `${age} лет`;
}
