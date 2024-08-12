import { View, Text } from "react-native";
import React from "react";
import { useIntervalStore } from "../store/intervalModalStore";
import { useTimerStore } from "../store/timersStore";
import useTimeTotal from "../hooks/useTimeTotal";

const TimeStatus = () => {
  const { numInterval } = useIntervalStore();
  const { timerHours, timerMinutes, restMinutes } = useTimerStore();
  const totalTime = useTimeTotal(
    timerHours,
    timerMinutes,
    numInterval,
    restMinutes
  );

  return (
    <View>
      <Text>Numero de intervalos: {numInterval}</Text>
      <Text>
        Horas efectivas: {timerHours}:{timerMinutes}:00
      </Text>
      <Text>Horas Totales: {totalTime}</Text>
    </View>
  );
};

export default TimeStatus;
