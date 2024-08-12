import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useTimerStore } from "../store/timersStore";

const SetRest = () => {
  const { restMinutes, setRestMinutes } = useTimerStore();
  // const [restMinutes, setRestMinutes] = useState("00");

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

  return (
    <View style={styles.wrapper}>
      <TextInput
        testID="hour-input-2"
        value="00"
        maxLength={2}
        keyboardType="numeric"
        style={styles.input}
        editable={false}
      />
      <Text testID="hour-label-2">h</Text>
      <TextInput
        testID="minute-input-2"
        value={restMinutes}
        maxLength={2}
        keyboardType="numeric"
        style={styles.input}
        onChangeText={(text) => {
          const givenMinutes = text <= 30 ? text : "30";
          setRestMinutes(givenMinutes.replace(/[^0-9]/g, ""));
        }}
        onBlur={() => {
          setRestMinutes(handleBlur(restMinutes));
        }}
      />
      <Text testID="minute-label-2">m</Text>
      <TextInput
        testID="second-input-2"
        value="00"
        maxLength={2}
        keyboardType="numeric"
        style={styles.input}
        editable={false}
      />
      <Text testID="second-label-2">s</Text>
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

export default SetRest;
