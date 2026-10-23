import { create } from "zustand";
import { confirmOrder } from "../api/mockApi";
import { MAX_PARTICIPANTS } from "../domain/pricing";
import type { ConfirmedOrder, Participant } from "../domain/types";
import { hasErrors, validateOrder } from "../domain/validation";

export type Step = "form" | "review" | "submitting" | "success" | "soldOut";

type ParticipantPatch = Partial<Pick<Participant, "name" | "age">>;

type CheckoutState = {
  step: Step;
  participants: Participant[];
  email: string;
  showAllErrors: boolean;
  touchedFields: Record<string, boolean>;
  confirmedOrder: ConfirmedOrder | null;
  seatsLeft: number | null;
  submitFailed: boolean;
};

type CheckoutActions = {
  addParticipant: () => void;
  updateParticipant: (id: string, patch: ParticipantPatch) => void;
  removeParticipant: (id: string) => void;
  setEmail: (email: string) => void;
  touchField: (fieldKey: string) => void;
  continueToReview: () => void;
  backToForm: () => void;
  submit: () => Promise<void>;
  reset: () => void;
};

function createEmptyParticipant(): Participant {
  return { id: crypto.randomUUID(), name: "", age: "" };
}

function createInitialState(): CheckoutState {
  return {
    step: "form",
    participants: [createEmptyParticipant()],
    email: "",
    showAllErrors: false,
    touchedFields: {},
    confirmedOrder: null,
    seatsLeft: null,
    submitFailed: false,
  };
}

export const useCheckoutStore = create<CheckoutState & CheckoutActions>()(
  (set, get) => ({
    ...createInitialState(),

    addParticipant: () =>
      set((state) =>
        state.participants.length >= MAX_PARTICIPANTS
          ? state
          : { participants: [...state.participants, createEmptyParticipant()] },
      ),

    updateParticipant: (id, patch) =>
      set((state) => ({
        participants: state.participants.map((participant) =>
          participant.id === id ? { ...participant, ...patch } : participant,
        ),
      })),

    removeParticipant: (id) =>
      set((state) =>
        state.participants.length <= 1
          ? state
          : { participants: state.participants.filter((p) => p.id !== id) },
      ),

    setEmail: (email) => set({ email }),

    touchField: (fieldKey) =>
      set((state) => ({
        touchedFields: { ...state.touchedFields, [fieldKey]: true },
      })),

    continueToReview: () => {
      const { step, participants, email } = get();
      if (step !== "form") return;

      const formIsValid = !hasErrors(validateOrder({ participants, email }));
      set(formIsValid ? { step: "review" } : { showAllErrors: true });
    },

    backToForm: () => {
      const { step } = get();
      if (step !== "review" && step !== "soldOut") return;

      set({ step: "form", seatsLeft: null, submitFailed: false });
    },

    submit: async () => {
      if (get().step !== "review") return;

      set({ step: "submitting", submitFailed: false });

      const { participants, email } = get();
      const tickets = participants.map(({ name, age }) => ({
        name: name.trim(),
        age: Number(age),
      }));

      try {
        const result = await confirmOrder(tickets, email.trim());

        if (result.status === "ok") {
          set({ step: "success", confirmedOrder: result.order });
        } else {
          set({ step: "soldOut", seatsLeft: result.seatsLeft });
        }
      } catch {
        set({ step: "review", submitFailed: true });
      }
    },

    reset: () => set(createInitialState()),
  }),
);
