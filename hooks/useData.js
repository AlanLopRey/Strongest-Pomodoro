import { useEffect, useState } from "react";

import useTime from "./useTime";
import { useIntervalStore } from "../store/intervalModalStore";
import { useTimerStore } from "../store/timersStore";

const useData = () => {
  const [data, setData] = useState([]);

  const { numInterval: intervals } = useIntervalStore();
  const {
    timerHours: hours,
    timerMinutes: minutes,
    restMinutes: restTime,
  } = useTimerStore();
  const { workTime } = useTime(hours, minutes, intervals);

  useEffect(() => {
    let tempData = [];

    for (let i = 0; i < intervals; i++) {
      // Agrega el tiempo total de trabajo
      tempData.push({ totalTime: workTime });

      // Agrega el tiempo de descanso si no es el último ciclo
      if (i < intervals - 1) {
        tempData.push({ rest: restTime * 60 }); // Convierte minutos a segundos
      }
    }

    setData(tempData);
  }, [intervals, restTime, workTime]);

  return { data };
};

export default useData;
