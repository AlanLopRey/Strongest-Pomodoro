import { View, Text, Modal } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import useData from "../hooks/useData";
import useTime from "../hooks/useTime";
import { useIntervalStore } from "../store/intervalModalStore";
import { useTimerStore } from "../store/timersStore";
import Button from "./Button";
import { router } from "expo-router/build";
import AdComponent from "./AdComponent";

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
  const [currentObject, setCurrentObject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    decrementInterval(hours, minutes);
  }, [workTime, setIntervals]);

  //efecto para actualizar el currentObject
  useEffect(() => {
    // Actualizamos currentObject cuando currentIndex cambia
    if (data.length > 0 && currentIndex < data.length) {
      setCurrentObject(data[currentIndex]);
    }
  }, [currentIndex, data]);
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
        setShowAd(true); // Muestra el anuncio
      }
    };

    if (!isPaused) {
      intervalRef.current = setInterval(tick, 10); // Actualiza cada segundo
    }

    return () => clearInterval(intervalRef.current); // Limpia el intervalo al desmontar o actualizar
  }, [isPaused, currentIndex, data]);

  // Maneja el anuncio
  useEffect(() => {
    if (showAd) {
      const adTimer = setTimeout(() => {
        setShowAd(false); // Oculta el anuncio después de 2 segundos
        if (currentIndex < data.length - 1) {
          setCurrentIndex((prevIndex) => prevIndex + 1); // Cambia al siguiente intervalo solo una vez
        }
      }, 2000); // Duración del anuncio

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

  const handleStop = () => {
    setShowModal(true); // Muestra el modal de confirmación
  };

  // Lógica para detener y regresar a la pantalla principal
  const confirmStop = () => {
    setIsStopped(true); // Detiene el temporizador
    clearInterval(intervalRef.current); // Limpia el intervalo
    setShowModal(false); // Oculta el modal
    router.replace("/");
  };

  const cancelStop = () => {
    setShowModal(false); // Cancela el detener, oculta el modal
  };
  return (
    <View>
      {showAd ? (
        <AdComponent />
      ) : (
        <View>
          <Text>
            {currentObject &&
              (currentObject.totalTime
                ? "Tiempo de trabajo restante"
                : currentObject.rest
                ? "Tiempo de descanso restante"
                : null)}
          </Text>
          <Text>{formatTime(displayTime)}</Text>
        </View>
      )}
      <Button onPressFn={togglePause}>
        {isPaused ? "Reanudar" : "Pausar"}
      </Button>

      <Button onPressFn={handleStop}>Detener</Button>

      {/* Modal de confirmación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)} // Manejo para cerrar modal
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>¿Estás seguro de que quieres detener el temporizador?</Text>
            <Button onPressFn={confirmStop}>Sí, detener</Button>
            <Button onPressFn={cancelStop} title="Cancelar">
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
};

export default CountDown;
