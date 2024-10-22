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
  const [showModalStop, setShowModalStop] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Nuevos estados para modales de fin de trabajo y descanso
  const [showWorkCompleteModal, setShowWorkCompleteModal] = useState(false);
  const [showRestCompleteModal, setShowRestCompleteModal] = useState(false);
  const [modalContentType, setModalContentType] = useState(null);
  const timeoutRef = useRef(null); // Agrega esta línea para definir timeoutRef

  useEffect(() => {
    decrementInterval(hours, minutes);
  }, [workTime, setIntervals]);

  useEffect(() => {
    if (data.length > 0 && currentIndex < data.length) {
      setCurrentObject(data[currentIndex]);
    }
  }, [currentIndex, data]);

  useEffect(() => {
    if (data.length > 0 && currentIndex < data.length) {
      timeDownRef.current =
        data[currentIndex]?.totalTime || data[currentIndex]?.rest || 0;
      setDisplayTime(timeDownRef.current); // Inicializa displayTime con el valor actual
    }
  }, [currentIndex, data]);

  useEffect(() => {
    const tick = () => {
      if (!isPaused && timeDownRef.current > 0) {
        timeDownRef.current -= 1;
        setDisplayTime(timeDownRef.current); // Actualiza el display
      } else if (timeDownRef.current <= 0) {
        clearInterval(intervalRef.current); // Detiene el temporizador cuando llega a cero
        // Determina qué tipo de modal mostrar
        if (currentObject?.totalTime) {
          showModalWithTimeout("totalTime");
        } else if (currentObject?.rest) {
          showModalWithTimeout("rest");
        }
        // setShowAd(true); // Muestra el anuncio
      }
    };

    if (!isPaused) {
      intervalRef.current = setInterval(tick, 10); // Actualiza cada segundo
    }

    return () => clearInterval(intervalRef.current); // Limpia el intervalo al desmontar o actualizar
  }, [isPaused, currentIndex, data, intervalRef.current]);

  // useEffect(() => {
  //   if (showAd) {
  //     const adTimer = setTimeout(() => {
  //       setShowAd(false); // Oculta el anuncio después de 2 segundos
  //       if (currentIndex < data.length - 1) {
  //         setCurrentIndex((prevIndex) => prevIndex + 1); // Cambia al siguiente intervalo solo una vez
  //       }
  //     }, 2000); // Duración del anuncio

  //     return () => clearTimeout(adTimer);
  //   }
  // }, [showAd, currentIndex, data.length]);

  const formatTime = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return `${horas}h ${minutos > 9 ? minutos : `0${minutos}`}m ${
      segundosRestantes > 9 ? segundosRestantes : `0${segundosRestantes}`
    }s`;
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleStop = () => {
    setShowModalStop(true); // Muestra el modal de confirmación
  };

  const showModalWithTimeout = (type) => {
    setModalContentType(type); // Define el tipo de modal
    setShowModal(true); // Muestra el modal
    setIsPaused(true); // Pausa el temporizador
    if (currentIndex < data.length - 1) {
      timeoutRef.current = setTimeout(() => {
        closeModal(); // Cierra el modal después de 10 segundos
      }, 10000); // 10 segundos
    } else {
      timeoutRef.current = setTimeout(() => {
        closeModal();
      }, 10000); // 10 segundos
    }
  };

  const closeModal = () => {
    setShowModalStop(false);
    setShowModal(false);
    clearTimeout(timeoutRef.current); // Limpia el timeout

    // Si no estamos en el último intervalo, avanzamos
    if (currentIndex < data.length - 1) {
      setIsPaused(false); // Reanuda el temporizador
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      return;
    }
  };

  const confirmStop = () => {
    setIsStopped(true); // Detiene el temporizador
    clearInterval(intervalRef.current); // Limpia el intervalo
    setShowModalStop(false); // Oculta el modal
    setShowModal(false);
    router.replace("/");
  };

  const cancelStop = () => {
    setShowModalStop(false); // Cancela el detener, oculta el modal
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
        visible={showModalStop}
        onRequestClose={() => setShowModalStop(false)}
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

      {/* Modal de fin de trabajo */}
      {/* <Modal
          animationType="slide"
          transparent={true}
          visible={showWorkCompleteModal}
          onRequestClose={() => setShowWorkCompleteModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>¡Has completado el tiempo de trabajo!</Text>
              <Button onPressFn={() => setShowWorkCompleteModal(false)}>
                Cerrar
              </Button>
            </View>
          </View>
        </Modal> */}

      {/* Modal de fin de descanso */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          clearTimeout(timeoutRef.current); // Limpia el timeout si el usuario cierra el modal manualmente
          setShowModal(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Mostramos contenido dinámico según modalContentType */}
            {modalContentType === "stop" ? (
              <>
                <Text>
                  ¿Estás seguro de que quieres detener el temporizador?
                </Text>
                <Button onPressFn={confirmStop}>Sí, detener</Button>
                <Button onPressFn={cancelStop} title="Cancelar">
                  Cancelar
                </Button>
              </>
            ) : modalContentType === "totalTime" ? (
              <>
                <Text>El tiempo de trabajo ha terminado.</Text>
                <Button onPressFn={closeModal}>Cerrar</Button>
              </>
            ) : modalContentType === "rest" ? (
              <>
                <Text>El tiempo de descanso ha terminado.</Text>
                <Button onPressFn={closeModal}>Cerrar</Button>
              </>
            ) : null}
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
