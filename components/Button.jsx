import { View, Text, Pressable } from "react-native";
import React from "react";
import styled from "styled-components/native";

const ButtonStart = styled.Pressable`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-top: 70px;
  border: 1px solid black;
  border-radius: 10px;
  height: 50px;
  width: 100px;
`;

const Button = ({ children, onPressFn }) => {
  return (
    <ButtonStart onPress={onPressFn}>
      <Text>{children}</Text>
    </ButtonStart>
  );
};

export default Button;
