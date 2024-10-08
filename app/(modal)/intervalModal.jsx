import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useIntervalStore } from "../../store/intervalModalStore";

const IntervalModal = () => {
  const { numInterval, setNumberInterval } = useIntervalStore();
  const [inputValue, setInputValue] = useState(numInterval);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleIntervalChange = (text) => {
    const validInput = text.replace(/[^0-9]/g, "");
    let intervalValue = parseInt(validInput, 10) || ""; // Permitir un string vacío si el input no es un número válido
    if (intervalValue === 0) intervalValue = 1;
    if (intervalValue > 24) intervalValue = 24;
    setInputValue(intervalValue); // Actualizar el estado local
  };

  const handleBlur = () => {
    if (inputValue === "" || inputValue === "0") {
      setInputValue("5"); // Restablecer a 5 si el input está vacío o es 0
      setNumberInterval("5");
    } else {
      setNumberInterval(inputValue); // Actualizar el estado global cuando el input pierde focus
    }
  };

  return (
    <View testID="interval-modal">
      <Text>¿En cuántos intervalos te gustaría dividir tu día?</Text>
      <TextInput
        testID="interval-input"
        keyboardType="numeric"
        maxLength={2}
        placeholder="Agrega el numero de Intervalos"
        blurOnSubmit={true}
        value={inputValue}
        onChangeText={(val) => handleIntervalChange(val)}
        onBlur={handleBlur}
      />
    </View>
  );
};

export default IntervalModal;
