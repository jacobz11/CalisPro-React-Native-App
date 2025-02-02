import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../constants/Colors";

export default function About({ tutorialDetail }) {
  const [expanded, setExpanded] = useState(false); // State to toggle "See More"

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txtTitle}>About</Text>
      <Text
        style={styles.txtAbout}
        numberOfLines={expanded ? undefined : 4} // Dynamically control lines
        ellipsizeMode="tail" // Add ellipsis when text is truncated
      >
        {tutorialDetail?.about}
      </Text>
      {tutorialDetail?.about &&
        tutorialDetail?.about.split("\n").length > 4 && (
          <TouchableOpacity onPress={toggleExpanded} style={styles.btn}>
            <Text style={styles.btnText}>
              {expanded ? "See Less" : "See More"}
            </Text>
          </TouchableOpacity>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 10,
  },
  txtTitle: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    marginBottom: 10,
  },
  txtAbout: {
    fontFamily: "outfit",
    fontSize: 16,
    lineHeight: 22, // Adjust line spacing for better readability
  },
  btn: {
    marginTop: 10,
  },
  btnText: {
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    fontSize: 16,
  },
});
