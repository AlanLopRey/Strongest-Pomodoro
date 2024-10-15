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
  const [displayTime, setDisplayTime] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const timeDownRef = useRef(0); // Mantenemos el tiempo restante aquí
  const {
    numIntervals: intervals,
    setIntervals,
    decrementInterval,
  } = useIntervalStore();
  const {
    timerHours: hours,
    timerMinutes: minutes,
    restMinutes: restTime,
  } = useTimerStore();
  const { workTime } = useTime(hours, minutes, intervals); // Hook para calcular el tiempo
  const { data } = useData();
  const [showAd, setShowAd] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Estado para pausar/reanudar
  const [isStopped, setIsStopped] = useState(false); // Estado para detener

  useEffect(() => {
    decrementInterval(hours, minutes);
  }, [workTime, setIntervals]);

  // Actualiza el tiempo restante en función del intervalo actual
  useEffect(() => {
    if (data.length > 0 && currentIndex < data.length) {
      timeDownRef.current =
        data[currentIndex]?.totalTime || data[currentIndex]?.rest || 0;
      setDisplayTime(timeDownRef.current); // Inicializa displayTime con el valor actual
    }
  }, [currentIndex, data]);

  // Efecto que maneja el intervalo del temporizador
  useEffect(() => {
    const tick = () => {
      if (!isPaused && timeDownRef.current > 0) {
        timeDownRef.current -= 1;
        setDisplayTime(timeDownRef.current); // Actualiza el display
      } else if (timeDownRef.current <= 0) {
        clearInterval(intervalRef.current); // Detiene el temporizador cuando llega a cero
        if (currentIndex < data.length - 1) {
          setShowAd(true); // Muestra el anuncio
          setCurrentIndex((prevIndex) => prevIndex + 1); // Cambia al siguiente intervalo
        }
      }
    };

    if (!isPaused) {
      intervalRef.current = setInterval(tick, 1); // Actualiza cada segundo
    }

    return () => clearInterval(intervalRef.current); // Limpia el intervalo al desmontar o actualizar
  }, [isPaused, currentIndex, data]);

  // Maneja el anuncio
  useEffect(() => {
    if (showAd) {
      const adTimer = setTimeout(() => {
        setShowAd(false); // Oculta el anuncio después de 5 segundos
        if (currentIndex < data.length - 1) {
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }
      }, 5000); // Dura 5 segundos

      return () => clearTimeout(adTimer);
    }
  }, [showAd, currentIndex, data.length]);

  // Formatear el tiempo para mostrarlo en formato legible
  const formatTime = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return `${horas}h ${minutos > 9 ? minutos : `0${minutos}`}m ${
      segundosRestantes > 9 ? segundosRestantes : `0${segundosRestantes}`
    }s`;
  };

  // Alterna entre pausar y reanudar el temporizador
  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <View>
      {showAd ? (
        <AdComponent />
      ) : (
        <View>
          <Text>
            {data[currentIndex]?.totalTime != null
              ? "Tiempo de trabajo restante"
              : "Tiempo de descanso restante"}
          </Text>
          <Text>{formatTime(displayTime)}</Text>
        </View>
      )}
      <Button onPressFn={togglePause}>
        {isPaused ? "Reanudar" : "Pausar"}
      </Button>
    </View>
  );
};

export default CountDown;
