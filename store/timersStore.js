import { create } from "zustand";

export const useTimerStore = create((set) => ({
  timerHours: "4",
  timerMinutes: "00",
  restMinutes: "10",

  setRestMinutes: (value) => set({ restMinutes: value }),
  setTimerHours: (value) => set({ timerHours: value }),
  setTimerMinutes: (value) => set({ timerMinutes: value }),
}));
