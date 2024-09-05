import { View, Text } from "react-native";
import React from "react";
import { useIntervalStore } from "../store/intervalModalStore";
import { useTimerStore } from "../store/timersStore";
import useTime from "../hooks/useTime";
import styled from "styled-components/native";
import { useState } from "react";
import { useEffect } from "react";

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
  const { totalTime, workTime } = useTime(
    timerHours,
    timerMinutes,
    numInterval,
    restMinutes
  );
  const [workSeconds, setWorkSeconds] = useState(workTime);

  useEffect(() => {
    setWorkSeconds(workTime);
  }, [workTime, numInterval, timerHours, timerMinutes]);

  const workTimeFormated = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return `${horas}h ${minutos > 9 ? minutos : `0${minutos}`}m ${
      segundosRestantes > 9 ? segundosRestantes : `0${segundosRestantes}`
    }s`;
  };

  return (
    <StatusContainer testID="time-status-component">
      <TextStyle>Numero de intervalos: {numInterval}</TextStyle>
      <TextStyle>
        Tiempo efectivo: {timerHours}:{timerMinutes}:00
      </TextStyle>
      <TextStyle>
        Tiempo por intervalo: {workTimeFormated(workSeconds)}
      </TextStyle>
      <TextStyle>Tiempo total: {totalTime}</TextStyle>
    </StatusContainer>
  );
};

export default TimeStatus;
