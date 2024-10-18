import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useTimerStore } from "../store/timersStore";

const SetTimer = () => {
  const { timerHours, timerMinutes, setTimerHours, setTimerMinutes } =
    useTimerStore();
  const [seconds] = useState("00");

  // Función para validar los minutos cuando cambian las horas
  const validateMinutesWithHour = () => {
    const hours = parseInt(timerHours, 10);
    const minutes = parseInt(timerMinutes, 10);

    // Si las horas son 0 y los minutos son menores a 25, ajustamos los minutos
    if ((hours < 1 && minutes < 25) || timerMinutes === "") {
      setTimerMinutes("25");
    }
  };

  // Validación de las horas al salir del campo (blur)
  const handleBlurHour = () => {
    const validHour = timerHours.replace(/[^0-9]/g, ""); // Limitar a números
    let hourValue = parseInt(validHour, 10);

    if (isNaN(hourValue) || hourValue < 0) {
      setTimerHours("00");
    } else if (hourValue > 12) {
      setTimerHours("12");
    } else {
      setTimerHours(validHour.length === 1 ? `0${validHour}` : validHour);
    }

    // Después de cambiar la hora, validamos los minutos

    validateMinutesWithHour();
  };

  // Validación de los minutos al salir del campo (blur)
  const handleBlurMinute = () => {
    const validMinute = timerMinutes.replace(/[^0-9]/g, "");
    let minuteValue = parseInt(validMinute, 10);

    if (isNaN(minuteValue) || minuteValue < 0) {
      setTimerMinutes("00");
    } else if (minuteValue > 59) {
      setTimerMinutes("59");
    } else {
      setTimerMinutes(
        validMinute.length === 1 ? `0${validMinute}` : validMinute
      );
    }

    // Después de cambiar los minutos, validamos según las horas
    validateMinutesWithHour();
  };

  return (
    <View style={styles.wrapper}>
      {/* Input de horas */}
      <TextInput
        maxLength={2}
        keyboardType="numeric"
        style={styles.input}
        value={timerHours}
        onChangeText={(text) => {
          const validHour = text.replace(/[^0-9]/g, "");
          setTimerHours(validHour);
        }}
        onBlur={handleBlurHour}
        testID="hour-input-1"
      />
      <Text testID="hour-label-1">h</Text>

      {/* Input de minutos */}
      <TextInput
        maxLength={2}
        keyboardType="numeric"
        style={styles.input}
        value={timerMinutes}
        onChangeText={(text) => {
          const validMinutes = text.replace(/[^0-9]/g, "");
          setTimerMinutes(validMinutes);
        }}
        onBlur={handleBlurMinute}
        testID="minute-input-1"
      />
      <Text testID="minute-label-1">m</Text>

      {/* Input de segundos (no editable) */}
      <TextInput
        maxLength={2}
        keyboardType="numeric"
        style={styles.input}
        value={seconds}
        editable={false} // El campo no es editable
        testID="second-input-1"
      />
      <Text testID="second-label-1">s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 40,
    width: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default SetTimer;
