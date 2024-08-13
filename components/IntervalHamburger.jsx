import { View, Text, Pressable, StatusBar } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import styled from "styled-components/native";

const HamburgerBtn = styled.Pressable`
  display: flex;
  align-self: flex-start;
  margin-left: 20%;
  margin-top: ${StatusBar.currentHeight + 8}px;
`;

const IntervalHamburger = () => {
  const goToIntervalModal = () => {
    router.push("(modal)/intervalModal");
  };

  return (
    <HamburgerBtn onPress={goToIntervalModal} testID="hamburger-btn">
      <Entypo name="menu" size={24} color="black" />
    </HamburgerBtn>
  );
};

export default IntervalHamburger;
