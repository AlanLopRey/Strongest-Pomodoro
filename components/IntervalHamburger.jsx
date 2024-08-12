import { View, Text, Pressable } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";

const IntervalHamburger = () => {
  const goToIntervalModal = () => {
    router.push("(modal)/intervalModal");
  };

  return (
    <Pressable onPress={goToIntervalModal} testID="hamburger-btn">
      <Entypo name="menu" size={24} color="black" />
    </Pressable>
  );
};

export default IntervalHamburger;
