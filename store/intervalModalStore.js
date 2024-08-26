import { create } from "zustand";

export const useIntervalStore = create((set) => ({
  numInterval: "05",
  timeIntervalH: "01",
  timeIntervalM: "00",

  setNumberInterval: (value) => set({ numInterval: value }),
  setTimeIntervalH: (value) => set({ timeIntervalH: value }),
  setTimeIntervalM: (value) => set({ timeIntervalM: value }),
}));
