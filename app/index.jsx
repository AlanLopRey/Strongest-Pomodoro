import { View, Text, StyleSheet } from "react-native";
import React from "react";
import SetTimer from "../components/SetTimer";
import SetRest from "../components/SetRest";
import IntervalHamburger from "../components/IntervalHamburger";
import TimeStatus from "../components/TimeStatus";

const App = () => {
  return (
    <View style={styles.app}>
      <View>
        <SetTimer />
        <SetRest />
        <IntervalHamburger />
      </View>
      <TimeStatus />
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  // input: {
  //   height: 40,
  //   margin: 12,
  //   borderWidth: 1,
  //   padding: 10,
  // },
});

export default App;
