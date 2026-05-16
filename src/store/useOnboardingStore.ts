import { create } from "zustand";

interface OnboardingState {
  step: number;
  businessDescription: string;
  theyAre: string[];
  whoWantTo: string[];
  locatedIn: string[];
  customCustomerInput: string;
  trafficChannel: string;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setBusinessDescription: (val: string) => void;
  toggleTheyAre: (val: string) => void;
  toggleWhoWantTo: (val: string) => void;
  toggleLocatedIn: (val: string) => void;
  setCustomCustomerInput: (val: string) => void;
  setTrafficChannel: (val: string) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  businessDescription: "",
  theyAre: [],
  whoWantTo: [],
  locatedIn: [],
  customCustomerInput: "",
  trafficChannel: "",
  // Safely clamp direct manual updates
  setStep: (step) => set({ step: Math.max(1, Math.min(step, 3)) }),
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
}));
