import { View, Text, TextInput, keyboardType, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useTimerStore } from "../store/timersStore";

const SetTimer = () => {
  const { timerHours, timerMinutes, setTimerHours, setTimerMinutes } =
    useTimerStore();
  // const [timerHours, setTimerHours] = useState("00");
  // const [timerMinutes, setTimerMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  const handleHourChange = (text) => {
    if (text.leng <= 2) {
      const givenMinutes = text <= "5" ? text : 59;
      setTimerMinutes(givenMinutes.replace(/[^0-9]/g, ""));
    } else {
      setTimerHours(text.slice(0, 2));
    }
  };

  const handleMinuteChange = (text) => {
    if (text.leng <= 2) {
      setTimerMinutes(text);
    } else {
      setTimerMinutes(text.slice(0, 2));
    }
  };

  const handleBlur = (time) => {
    if (time !== "" && time !== "00") {
      if (time.length < 2) {
        time = time > 9 ? time : `0${time}`;
      }
    } else {
      time = "00";
    }
    return time;
  };
  const handleBlurHour = (time) => {
    if (time !== "" && time !== "00") {
      time = time <= 12 ? time : `12`;
    } else {
      time = "00";
    }
    return time;
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        maxLength={2}
        keyboardType="numeric"
        style={styles.input}
        value={timerHours}
        onChangeText={(text) => {
          const givenMinutes = text <= 12 ? text : "12";
          setTimerHours(givenMinutes.replace(/[^0-9]/g, ""));
        }}
        onBlur={() => {
          setTimerHours(handleBlurHour(timerHours));
        }}
        testID="hour-input-1"
      />
      <Text testID="hour-label-1">h</Text>
      <TextInput
        maxLength={2}
        keyboardType="numeric"
        style={styles.input}
        value={timerMinutes}
        onChangeText={(text) => {
          const givenMinutes = text <= 59 ? text : "59";
          setTimerMinutes(givenMinutes.replace(/[^0-9]/g, ""));
        }}
        onBlur={() => {
          setTimerMinutes(handleBlur(timerMinutes));
        }}
        testID="minute-input-1"
      />
      <Text testID="minute-label-1">m</Text>
      <TextInput
        maxLength={2}
        keyboardType="numeric"
        style={styles.input}
        value={seconds}
        editable={false}
        testID="second-input-1"
      />
      <Text testID="second-label-1">s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 40,
    width: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default SetTimer;
