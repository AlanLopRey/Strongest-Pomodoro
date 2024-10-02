import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useIntervalStore } from "../../store/intervalModalStore";

const IntervalModal = () => {
  const { numInterval = "5", setNumberInterval } = useIntervalStore();
  const [inputValue, setInputValue] = useState(numInterval);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleIntervalChange = (text) => {
    const validInput = text.replace(/[^0-9]/g, "");
    let intervalValue = parseInt(validInput, 10) || ""; // Permitir un string vacío si el input no es un número válido
    if (intervalValue < 1 && intervalValue !== "") intervalValue = 1;
    if (intervalValue > 24) intervalValue = 24;
    setInputValue(intervalValue.toString()); // Actualizar el estado local
  };

  const handleFocus = () => {
    setInputValue(""); // Borrar el valor del input al tomar focus
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
        value={inputValue} // Usar el estado local
        onChangeText={handleIntervalChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
};

export default IntervalModal;
