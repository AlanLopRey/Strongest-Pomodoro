import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useIntervalStore } from "../store/intervalModalStore";
import { useTimerStore } from "../store/timersStore";
import { router } from "expo-router";

const LoaderScreen = () => {
  const [loading, setLoading] = useState(true);
  const { decrementInterval } = useIntervalStore();
  const { timerHours: hours, timerMinutes: minutes } = useTimerStore();

  useEffect(() => {
    const calculateWorkTime = async () => {
      await decrementInterval(hours, minutes);
      setLoading(false);
      router.replace("CountDownScreen"); // Navegar a CountDown cuando termine
    };

    calculateWorkTime(); // Iniciar el cálculo al montar el componente
  }, [hours, minutes, decrementInterval]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Calculando tiempo de trabajo...</Text>
        </>
      ) : (
        <Text>Listo!</Text>
      )}
    </View>
  );
};

export default LoaderScreen;
