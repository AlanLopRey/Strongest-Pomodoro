import { View, Text } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import useData from "../hooks/useData";
import useTime from "../hooks/useTime";
import { useIntervalStore } from "../store/intervalModalStore";
import { useTimerStore } from "../store/timersStore";
import Button from "./Button";

const AdComponent = () => {
  return (
    <View>
      <Text>Anuncio</Text>
    </View>
  );
};

const CountDown = () => {
  const [timeDown, setTimeDown] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const {
    numIntervals: intervals,
    setIntervals,
    decrementInterval,
  } = useIntervalStore(); // Estado global de intervalos
  const {
    timerHours: hours,
    timerMinutes: minutes,
    restMinutes: restTime,
  } = useTimerStore();
  const { workTime } = useTime(hours, minutes, intervals); // Hook que calcula el tiempo total
  const { data } = useData(); // Hook que depende de los intervalos
  const [showAd, setShowAd] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Estado de pausa
  const [isStopped, setIsStopped] = useState(false); // Estado de detenido

  useEffect(() => {
    decrementInterval(hours, minutes);
  }, [workTime, setIntervals]);

  useEffect(() => {
    if (data.length > 0 && currentIndex < data.length) {
      setTimeDown(
        data[currentIndex]?.totalTime || data[currentIndex]?.rest || 0
      );

      const tick = () => {
        setTimeDown((prev) => {
          if (prev <= 0) {
            if (currentIndex < data.length - 1) {
              if (data[currentIndex]?.totalTime) {
                setShowAd(true);
              }
              return 0; // Resetea el tiempo mientras se muestra el anuncio
            }
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      };

      if (!isPaused) {
        intervalRef.current = setInterval(tick, 1000);
      }

      return () => clearInterval(intervalRef.current);
    }
  }, [currentIndex, data, isPaused, isStopped]);

  useEffect(() => {
    if (showAd) {
      const adTimer = setTimeout(() => {
        setShowAd(false);
        if (currentIndex < data.length - 1) {
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }
      }, 5000); // Mostrar el anuncio durante 5 segundos

      return () => clearTimeout(adTimer);
    }
  }, [showAd, currentIndex, data.length]);

  const handlePause = () => {
    setIsPaused((prev) => !prev); // Alterna entre pausar y reanudar
  };

  const handleStop = () => {
    setIsStopped(true); // Detiene completamente el temporizador
    clearInterval(intervalRef.current); // Limpia el intervalo
    setTimeDown(0); // Resetea el temporizador a cero
  };

  const formatTime = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return `${horas}h ${minutos > 9 ? minutos : `0${minutos}`}m ${
      segundosRestantes > 9 ? segundosRestantes : `0${segundosRestantes}`
    }s`;
  };

  return (
    <View>
      {showAd ? (
        <AdComponent />
      ) : (
        <View>
          <Text>
            {data[currentIndex]?.totalTime !== undefined
              ? "Tiempo de trabajo restante"
              : "Tiempo de descanso restante"}
          </Text>
          <Text>{formatTime(timeDown)}</Text>
        </View>
      )}
      <Button onPressFn={handlePause}>
        {isPaused ? "Reanudar" : "Pausar"} {/* Muestra el estado */}
      </Button>
      <Button onPressFn={handleStop}>Detener</Button>
    </View>
  );
};

export default CountDown;
