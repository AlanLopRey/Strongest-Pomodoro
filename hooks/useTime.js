import { useState, useEffect } from "react";
// import { useIntervalStore } from "../store/intervalModalStore";
// import { useTimerStore } from "../store/timersStore";

export const calculateWorkTime = (hours, minutes, intervals) => {
  const totalTimeSeconds = hours * 3600 + minutes * 60;
  // prttier/ignore
  const timeSesion = Math.floor(totalTimeSeconds / intervals);
  return timeSesion;
};

const useTime = (hours, minutes, intervals, rest = 20) => {
  const [totalTime, setTotalTime] = useState(0);
  const [workTime, setWorkTime] = useState(0);

  useEffect(() => {
    // prettier-ignore
    const timeToSeconds = (hours, minutes) => {
      return hours * 3600 + minutes * 60;
    };

    const calculateTotalTime = (hours, minutes, intervals, rest) => {
      const workSeconds = timeToSeconds(hours, minutes);
      const descansoTotalSeconds = rest * 60 * (intervals - 1); // El último intervalo no tiene rest

      const totalSeconds = workSeconds + descansoTotalSeconds;

      const totalHours = Math.floor(totalSeconds / 3600);
      const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
      return `${totalHours} horas ${totalMinutes} minutos`;
    };

    const result = calculateTotalTime(hours, minutes, intervals, rest);
    const time = calculateWorkTime(hours, minutes, intervals);
    setTotalTime(result);
    setWorkTime(time);
  }, [hours, minutes, intervals, rest]);

  return { totalTime, workTime };
};

export default useTime;
