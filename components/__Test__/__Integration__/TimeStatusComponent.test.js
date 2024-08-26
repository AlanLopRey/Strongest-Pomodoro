import React from "react";
import { render } from "@testing-library/react-native";

import SetTimer from "../../SetTimer";
import SetRest from "../../SetRest";
import IntervalHamburger from "../../IntervalHamburger";
import TimeStatus from "../../TimeStatus";
import IntervalModal from "../../../app/(modal)/intervalModal";
import { View } from "react-native-web";

import { useIntervalStore } from "../../../store/intervalModalStore";
import { useTimerStore } from "../../../store/timersStore";

jest.mock("../../../store/intervalModalStore");
jest.mock("../../../store/timersStore");
it("debería calcular el tiempo total correctamente", () => {
  useIntervalStore.mockReturnValue({
    numInterval: "05",
    timeIntervalH: "01",
    timeIntervalM: "00",
    setNumberInterval: jest.fn(),
    setTimeIntervalH: jest.fn(),
    setTimeIntervalM: jest.fn(),
  });

  useTimerStore.mockReturnValue({
    timerHours: "04",
    timerMinutes: "00",
    restMinutes: "20",
    setRestMinutes: jest.fn(),
    setTimerHours: jest.fn(),
    setTimerMinutes: jest.fn(),
  });

  const { getByText, debug } = render(
    <View>
      <SetTimer />
      <SetRest />
      <IntervalModal />
      <TimeStatus />
    </View>
  );

  // Imprimir el contenido renderizado para depuración
  // debug();

  // Usar expresión regular para verificar el formato del texto
  const totalHoursText = getByText(
    /Horas\s+Totales:\s*5\s*horas\s*20\s*minutos/
  );
  expect(totalHoursText).toBeTruthy();
});
