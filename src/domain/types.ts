export type Participant = {
  id: string;
  name: string;
  age: string;
};

export type Order = {
  participants: Participant[];
  email: string;
};

export type ParticipantErrors = {
  name?: string;
  age?: string;
};

export type OrderErrors = {
  participants: Record<string, ParticipantErrors>;
  email?: string;
  order?: string;
};

export type OrderLine = {
  name: string;
  age: number;
  type: TicketType;
};

export type ConfirmedOrder = {
  id: string;
  email: string;
  lines: OrderLine[];
  total: number;
};

export type ConfirmResult =
  | { status: "ok"; order: ConfirmedOrder }
  | { status: "soldOut"; seatsLeft: number };

export type TicketType = "full" | "child";
