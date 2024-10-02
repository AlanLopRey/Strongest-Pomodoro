import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useIntervalStore } from "../../store/intervalModalStore";

const IntervalModal = () => {
  const { numInterval = "5", setNumberInterval } = useIntervalStore();
  const [inputValue, setInputValue] = useState(numInterval);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleIntervalChange = (text) => {
    // Eliminar cualquier caracter que no sea número
    const validInput = text.replace(/[^0-9]/g, "");

    // Si el input está vacío, actualizamos el estado local para reflejarlo
    if (validInput === "") {
      setInputValue("");
      return;
    }

    // Convertir el texto a número para validación
    const number = parseInt(validInput, 10);

    // Validar que el número esté entre 1 y 24
    if (number >= 1 && number <= 24) {
      setInputValue(validInput); // Actualizar el valor del input
      setNumberInterval(validInput); // Actualizar el estado global
    } else {
      setIsInvalid(true);
    }
  };

  return (
    <View testID="interval-modal">
      <Text>¿En cuántos intervalos te gustaría dividir tu día?</Text>
      <TextInput
        testID="interval-input"
        keyboardType="numeric"
        maxLength={2}
        value={inputValue}
        onChangeText={handleIntervalChange}
        placeholder="Ingrese un número entre 1 y 24"
      />
    </View>
  );
};

export default IntervalModal;
