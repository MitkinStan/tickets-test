import { orderTotal, ticketType } from "../domain/pricing";
import { type ConfirmResult } from "../domain/types";

export const EVENT = {
  title: "Фестиваль «Летняя ночь»",
  date: "15 августа 2026, 19:00",
  place: "Парк Горького, Москва",
};

let seatsLeft = 10;
let sellOutOnConfirm = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function getSeatsLeft(): number {
  return seatsLeft;
}

export function setSeatsLeft(value: number): void {
  seatsLeft = Math.max(0, Math.floor(value));
}

export function setSellOutOnConfirm(value: boolean): void {
  sellOutOnConfirm = value;
}

export function isSellOutOnConfirm(): boolean {
  return sellOutOnConfirm;
}

export async function confirmOrder(
  participants: { name: string; age: number }[],
  email: string,
): Promise<ConfirmResult> {
  await delay(900);

  if (sellOutOnConfirm) {
    seatsLeft = 0;
    sellOutOnConfirm = false;
  }

  if (participants.length > seatsLeft) {
    return { status: "soldOut", seatsLeft };
  }

  seatsLeft -= participants.length;

  return {
    status: "ok",
    order: {
      id: `ORDER-${Math.floor(100000 + Math.random() * 900000)}`,
      email,
      lines: participants.map((p) => ({
        name: p.name,
        age: p.age,
        type: ticketType(p.age),
      })),
      total: orderTotal(participants.map((p) => p.age)),
    },
  };
}
