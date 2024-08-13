import { View, Text } from "react-native";
import React from "react";
import styled from "styled-components/native";

const Main = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const countDownScreen = () => {
  return (
    <Main>
      <Text>countDownScreen</Text>
    </Main>
  );
};

export default countDownScreen;
