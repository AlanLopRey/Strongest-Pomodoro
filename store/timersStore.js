import { create } from "zustand";

export const useTimerStore = create((set) => ({
  timerHours: "00",
  timerMinutes: "10",
  restMinutes: "10",

  setRestMinutes: (value) => set({ restMinutes: value }),
  setTimerHours: (value) => set({ timerHours: value }),
  setTimerMinutes: (value) => set({ timerMinutes: value }),
}));
