import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
} from "react-native";
import React from "react";
import SetTimer from "../components/SetTimer";
import SetRest from "../components/SetRest";
import IntervalHamburger from "../components/IntervalHamburger";
import TimeStatus from "../components/TimeStatus";
import Button from "../components/Button";
import styled from "styled-components/native";
import { router } from "expo-router";

const Wrapper = styled.View`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  margin-top: ${StatusBar.currentHeight + 15}px;
  margin-left: 20px;
  margin-right: 15px;
`;

const TimerSetApp = styled.View`
  /* display: flex; */
`;

const TimerCard = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 35%;
`;

const App = () => {
  const goToCountDown = () => {
    router.push("CountDownScreen");
  };

  return (
    <Wrapper>
      <TimerCard>
        <TimerSetApp>
          <SetTimer />
          <SetRest />
        </TimerSetApp>
        <IntervalHamburger />
      </TimerCard>
      <TimeStatus />
      <Button onPressFn={goToCountDown}>Iniciar</Button>
    </Wrapper>
  );
};

export default App;
