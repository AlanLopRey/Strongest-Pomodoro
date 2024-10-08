import { create } from "zustand";
import { calculateWorkTime } from "../hooks/useTime";
export const useIntervalStore = create((set, get) => ({
  numInterval: 5,
  workTime: 0,

  // Validar y establecer el número de intervalos
  setNumberInterval: (value) => {
    if (value < 1) {
      console.warn("El número de intervalos no puede ser menor que 1");
    }
    set({ numInterval: value });
  },

  // Función para decrementar los intervalos
  decrementInterval: async (hours, minutes) => {
    let currentInterval = get().numInterval; // Obtener el número de intervalos actual
    let workTime = calculateWorkTime(hours, minutes, currentInterval); // Calcular el workTime usando horas y minutos

    // Mientras workTime sea menor a 1500 segundos y los intervalos sean mayores a 1
    while (workTime < 1500 && currentInterval > 1) {
      console.log(
        `workTime actual: ${workTime}, numInterval actual: ${currentInterval}`
      );
      currentInterval -= 1; // Reducir un intervalo
      set({ numInterval: currentInterval }); // Actualizar el estado

      // Recalcular workTime basado en el nuevo número de intervalos
      workTime = calculateWorkTime(hours, minutes, currentInterval);

      // Espera pequeña para no sobrecargar el bucle
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    if (currentInterval === 1 && workTime < 1500) {
      console.warn(
        "No se pueden reducir más los intervalos, workTime sigue siendo bajo."
      );
    } else {
      console.log(
        `Se alcanzó un workTime válido: ${workTime} con numInterval: ${currentInterval}`
      );
      return;
    }
  },
}));
