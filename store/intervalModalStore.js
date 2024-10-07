import { create } from "zustand";

export const useIntervalStore = create((set) => ({
  numInterval: 5,
  // timeIntervalH: "01",
  // timeIntervalM: "00",

  setNumberInterval: (value) => {
    if (value < 1) {
      console.warn("El número de intervalos no puede ser menor que 1");
    }
    set({ numInterval: value });
  },

  decrementInterval: () => {
    const currentInterval = get().numInterval;

    if (currentInterval > 1) {
      set({ numInterval: currentInterval - 1 });
    }
  },

  // setTimeIntervalH: (value) => set({ timeIntervalH: value }),
  // setTimeIntervalM: (value) => set({ timeIntervalM: value }),
}));
