import { View, Text, TextInput } from "react-native";
import { useIntervalStore } from "../../store/intervalModalStore";
// import React, { useState } from "react";

const intervalModal = () => {
  const {
    numInterval,
    timeIntervalH,
    timeIntervalM,
    setNumberInterval,
    setTimeIntervalH,
    setTimeIntervalM,
  } = useIntervalStore();

  // const [numInterval, setNumberInterval] = useState("5");
  // const [timeInterval, setTimeInterval] = useState("5");

  const handleIntervalChange = (text) => {
    setNumberInterval(text);
  };
  const handleTimeChangeH = (text) => {
    setTimeIntervalH(text);
  };
  const handleTimeChangeM = (text) => {
    setTimeIntervalM(text);
  };

  return (
    <View testID="interval-modal">
      <Text>En cuantos intervalos te gustaria dividir tu dia</Text>
      <TextInput
        testID="interval-input"
        keyboardType="numeric"
        maxLength={2}
        value={numInterval}
        onChangeText={handleIntervalChange}
      />
      <Text>O en cuantos minutos/horas te gustaria trabajar por intervalo</Text>
      <TextInput
        testID="time-interval-id"
        keyboardType="numeric"
        maxLength={2}
        value={timeIntervalH}
        onChangeText={handleTimeChangeH}
      />
      <TextInput
        testID="time-interval-id2"
        keyboardType="numeric"
        maxLength={2}
        value={timeIntervalM}
        onChangeText={handleTimeChangeM}
      />
    </View>
  );
};

export default intervalModal;
