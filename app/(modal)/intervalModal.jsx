import React from "react";
import { View, Text, TextInput } from "react-native";
import { useIntervalStore } from "../../store/intervalModalStore";

const IntervalModal = () => {
  const {
    numInterval = "5", // Valor por defecto
    timeIntervalH = "1", // Valor por defecto
    timeIntervalM = "0", // Valor por defecto
    setNumberInterval,
    setTimeIntervalH,
    setTimeIntervalM,
  } = useIntervalStore();

  const handleIntervalChange = (text) => {
    const validInput = text.replace(/[^0-9]/g, ""); // Permitir solo números
    const intervalValue = validInput <= 24 ? validInput : "24"; // Limitar el valor a 24
    setNumberInterval(intervalValue); // Actualizar el estado
  };

  const handleTimeChangeH = (text) => {
    const validInput = text.replace(/[^0-9]/g, ""); // Permitir solo números
    setTimeIntervalH(validInput);
  };

  const handleTimeChangeM = (text) => {
    const validInput = text.replace(/[^0-9]/g, ""); // Permitir solo números
    setTimeIntervalM(validInput);
  };

  const handleBlur = (text, setFunction) => {
    if (text === "" || text === "0") {
      setFunction("5");
    }
  };

  return (
    <View testID="interval-modal">
      <Text>En cuántos intervalos te gustaría dividir tu día</Text>
      <TextInput
        testID="interval-input"
        keyboardType="numeric"
        maxLength={2}
        value={numInterval || ""} // Asegurarse de que no sea undefined
        onChangeText={handleIntervalChange}
        onBlur={() => handleBlur(numInterval, setNumberInterval)} // Aplicar handleBlur
      />
      <Text>¿En cuántas horas te gustaría trabajar por intervalo?</Text>
      <TextInput
        testID="time-interval-id-hours"
        keyboardType="numeric"
        maxLength={2}
        value={timeIntervalH || ""} // Asegurarse de que no sea undefined
        onChangeText={handleTimeChangeH}
        onBlur={() => handleBlur(timeIntervalH, setTimeIntervalH)} // Aplicar handleBlur
      />
      <Text>¿En cuántos minutos te gustaría trabajar por intervalo?</Text>
      <TextInput
        testID="time-interval-id-minutes"
        keyboardType="numeric"
        maxLength={2}
        value={timeIntervalM || ""} // Asegurarse de que no sea undefined
        onChangeText={handleTimeChangeM}
        onBlur={() => handleBlur(timeIntervalM, setTimeIntervalM)} // Aplicar handleBlur
      />
    </View>
  );
};

export default IntervalModal;
