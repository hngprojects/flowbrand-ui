import { create } from "zustand";
import type { MockUploadedDoc } from "@/lib/dashboard-mock-data";

interface OnboardingState {
  step: number;
  businessDescription: string;
  theyAre: string[];
  whoWantTo: string[];
  locatedIn: string[];
  customCustomerInput: string;
  trafficChannel: string;
  uploadedDocuments: MockUploadedDoc[];
  sessionId: string | null;
  setStep: (step: number) => void;
  setSessionId: (id: string | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  setBusinessDescription: (val: string) => void;
  toggleTheyAre: (val: string) => void;
  toggleWhoWantTo: (val: string) => void;
  toggleLocatedIn: (val: string) => void;
  setCustomCustomerInput: (val: string) => void;
  setTrafficChannel: (val: string) => void;
  addUploadedDocument: (doc: MockUploadedDoc) => void;
  removeUploadedDocument: (id: string) => void;
  hydrateFromApiSession: (input: {
    businessDescription?: string;
    customerTags?: string[];
    trafficChannel?: string;
    step?: number;
  }) => void;
  reset: () => void;
}

const initialOnboardingState = {
  step: 1,
  businessDescription: "",
  theyAre: [] as string[],
  whoWantTo: [] as string[],
  locatedIn: [] as string[],
  customCustomerInput: "",
  trafficChannel: "",
  uploadedDocuments: [] as MockUploadedDoc[],
  sessionId: null as string | null,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialOnboardingState,
  setStep: (step) => set({ step: Math.max(1, Math.min(step, 3)) }),
  setSessionId: (id) =>
    set((state) => (state.sessionId === id ? state : { sessionId: id })),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setBusinessDescription: (val) => set({ businessDescription: val }),
  toggleTheyAre: (val) =>
    set((state) => ({
      theyAre: state.theyAre.includes(val)
        ? state.theyAre.filter((i) => i !== val)
        : [...state.theyAre, val],
    })),
  toggleWhoWantTo: (val) =>
    set((state) => ({
      whoWantTo: state.whoWantTo.includes(val)
        ? state.whoWantTo.filter((i) => i !== val)
        : [...state.whoWantTo, val],
    })),
  toggleLocatedIn: (val) =>
    set((state) => ({
      locatedIn: state.locatedIn.includes(val)
        ? state.locatedIn.filter((i) => i !== val)
        : [...state.locatedIn, val],
    })),
  setCustomCustomerInput: (val) => set({ customCustomerInput: val }),
  setTrafficChannel: (val) => set({ trafficChannel: val }),
  addUploadedDocument: (doc) =>
    set((state) => ({
      uploadedDocuments: state.uploadedDocuments.some((d) => d.id === doc.id)
        ? state.uploadedDocuments
        : [...state.uploadedDocuments, doc],
    })),
  removeUploadedDocument: (id) =>
    set((state) => ({
      uploadedDocuments: state.uploadedDocuments.filter((d) => d.id !== id),
    })),
  hydrateFromApiSession: (input) =>
    set((state) => {
      const step = Math.max(1, Math.min(input.step ?? state.step, 3));
      const businessDescription =
        input.businessDescription ?? state.businessDescription;
      const theyAre =
        input.customerTags !== undefined ? input.customerTags : state.theyAre;
      const trafficChannel = input.trafficChannel ?? state.trafficChannel;

      if (
        step === state.step &&
        businessDescription === state.businessDescription &&
        trafficChannel === state.trafficChannel &&
        theyAre.length === state.theyAre.length &&
        theyAre.every((tag, index) => tag === state.theyAre[index])
      ) {
        return state;
      }

      return {
        ...state,
        step,
        businessDescription,
        theyAre,
        trafficChannel,
      };
    }),
  reset: () => set({ ...initialOnboardingState }),
}));
