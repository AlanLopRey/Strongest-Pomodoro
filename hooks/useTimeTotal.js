import { useState, useEffect } from "react";

const useTimeTotal = (hours, minutes, intervals, descanso) => {
  const [totalTime, setTotalTime] = useState("");

  useEffect(() => {
    const timeToSeconds = (hours, minutes) => {
      return hours * 3600 + minutes * 60;
    };

    const calculateTotalTime = (hours, minutes, intervals, descanso) => {
      const workSeconds = timeToSeconds(hours, minutes);
      const descansoTotalSeconds = descanso * 60 * (intervals - 1); // El último intervalo no tiene descanso

      const totalSeconds = workSeconds + descansoTotalSeconds;

      const totalHours = Math.floor(totalSeconds / 3600);
      const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
      return `${totalHours} horas, ${totalMinutes} minutos`;
    };

    const result = calculateTotalTime(hours, minutes, intervals, descanso);
    setTotalTime(result);
  }, [hours, minutes, intervals, descanso]);

  return totalTime;
};

export default useTimeTotal;
