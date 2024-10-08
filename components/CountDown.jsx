import { View, Text } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import useData from "../hooks/useData";
import useTime from "../hooks/useTime";
import { useIntervalStore } from "../store/intervalModalStore";
import { useTimerStore } from "../store/timersStore";

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

  useEffect(() => {
    console.log(workTime);
    console.log("este console log esta en el decremento");
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

      intervalRef.current = setInterval(tick, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [currentIndex, data]);

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
    </View>
  );
};

export default CountDown;
