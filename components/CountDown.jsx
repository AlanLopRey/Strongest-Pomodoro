import { View, Text } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useIntervalStore } from "../store/intervalModalStore";
import { useTimerStore } from "../store/timersStore";
import { Audio, InterruptionModeAndroid } from "expo-av";
import { Sound } from "expo-av/build/Audio/Sound";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: true,
    });
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playAudio = async (soundFile) => {
    // Set and play the sound
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: soundFile,
    });
    setSound(newSound);

    setIsPlaying(true);
    await newSound.playAsync();

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        if (status.positionMillis < 5000) {
          newSound.replayAsync(); // Repite el sonido
        } else {
          setIsPlaying(false);
          newSound.unloadAsync(); // Detener y liberar el sonido después de 5 segundos
        }
      }
    });

    setTimeout(async () => {
      await newSound.stopAsync(); // Detiene el sonido
      await newSound.unloadAsync(); // Libera el sonido de la memoria
      setIsPlaying(false);
    }, 5000);
  };

  useEffect(() => {
    const tick = () => {
      setTimeDown((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current);
          if (currentIndex < objWithData.length - 1) {
            if (objWithData[currentIndex].totalTime) {
              playAudio("assets/sounds/work_end.wav"); // Llama a la función cuando termina `totalTime`
              setShowAd(true);
            } else {
              playAudio("assets/sounds/rest_end.wav"); // Llama a la función cuando termina `rest`
              setCurrentIndex((prevIndex) => prevIndex + 1);
            }
          }
          return 0;
        }
        return prev - 1;
      });
    };

    intervalRef.current = setInterval(tick, 1);

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
      }, 5000);

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
        <Text>CountDown {formatTime(timeDown)} </Text>
      )}
    </View>
  );
};

export default CountDown;
