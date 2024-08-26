import { View, Text } from "react-native";
import React, { useState, useEffect, useRef } from "react";
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
  const { numInterval: intervalos } = useIntervalStore();
  const {
    timerHours: hours,
    timerMinutes: minutes,
    restMinutes: restTime,
  } = useTimerStore();
  const intervalRef = useRef(null);

  const hoursToSec = hours * 3600;
  const minuteToSec = minutes * 60;
  const totalTimeSeconds = hoursToSec + minuteToSec;

  const objWithData = [
    { totalTime: totalTimeSeconds },
    { rest: restTime * 60 },
    { totalTime: totalTimeSeconds },
    { rest: restTime * 60 },
    { totalTime: totalTimeSeconds },
    { rest: restTime * 60 },
    { totalTime: totalTimeSeconds },
    { rest: restTime * 60 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeDown, setTimeDown] = useState(
    objWithData[currentIndex].totalTime || objWithData[currentIndex].rest
  );
  const [showAd, setShowAd] = useState(false);

  const isWorkTime = objWithData[currentIndex].totalTime !== undefined;

  useEffect(() => {
    const tick = () => {
      setTimeDown((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current);
          if (currentIndex < objWithData.length - 1) {
            // Mostrar publicidad antes de avanzar
            if (objWithData[currentIndex].totalTime) {
              setShowAd(true);
            } else {
              setCurrentIndex((prevIndex) => prevIndex + 1);
            }
          }
          return 0;
        }
        return prev - 1;
      });
    };

    intervalRef.current = setInterval(tick, 10);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [currentIndex]);

  useEffect(() => {
    setTimeDown(
      objWithData[currentIndex].totalTime || objWithData[currentIndex].rest
    );
  }, [currentIndex]);

  useEffect(() => {
    if (showAd) {
      const adTimer = setTimeout(() => {
        setShowAd(false);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 2000); // Mostrar el anuncio durante 5 segundos

      return () => clearTimeout(adTimer);
    }
  }, [showAd]);

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
            {isWorkTime
              ? "Tiempo de trabajo restante"
              : "Tiempo de descanzo restante"}
          </Text>
          <Text> {formatTime(timeDown)} </Text>
        </View>
      )}
    </View>
  );
};

export default CountDown;
