import { View, Text } from "react-native";
import React from "react";
import styled from "styled-components/native";
import CountDown from "../components/CountDown";
import CountDownChatGpt from "../components/CountDownChatGpt";

const Main = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* margin-top: 20px; */
`;

const CountDownScreen = () => {
  return (
    <Main testID="Count-Down-screen">
      {/* <CountDownChatGpt /> */}
      <Text>My Own CountDown</Text>
      <CountDown />
    </Main>
  );
};

export default CountDownScreen;
