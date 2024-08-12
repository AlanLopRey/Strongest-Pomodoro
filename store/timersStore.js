import { create } from "zustand";

export const useTimerStore = create((set) => ({
  timerHours: "04",
  timerMinutes: "00",
  restMinutes: "20",

  setRestMinutes: (value) => set({ restMinutes: value }),
  setTimerHours: (value) => set({ timerHours: value }),
  setTimerMinutes: (value) => set({ timerMinutes: value }),
}));
