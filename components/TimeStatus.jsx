import { View, Text } from "react-native";
import React from "react";
import { useIntervalStore } from "../store/intervalModalStore";
import { useTimerStore } from "../store/timersStore";
import useTimeTotal from "../hooks/useTimeTotal";
import styled from "styled-components/native";

const StatusContainer = styled.View`
  border: 1px solid black;
  height: 15%;
  display: flex;
  justify-content: center;
  margin: 0px 10px 0px 10px;
  border-radius: 15px;
  overflow: hidden;
`;

const TextStyle = styled.Text`
  text-align: center;
  font-size: 16px;
`;

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
    <StatusContainer testID="time-status-component">
      <TextStyle>Numero de intervalos: {numInterval}</TextStyle>
      <TextStyle>
        Horas efectivas: {timerHours}:{timerMinutes}:00
      </TextStyle>
      <TextStyle>Horas Totales: {totalTime}</TextStyle>
    </StatusContainer>
  );
};

export default TimeStatus;
