import { View, Text, Image, StyleSheet, TextInput } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { Colors } from "./../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Header() {
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={{ uri: user?.imageUrl }} style={styles.img1}></Image>
        <View>
          <Text style={styles.welcome}>Welcome, </Text>
          <Text style={styles.nameStyle}>{user?.fullName}</Text>
        </View>
      </View>
      <Text style={styles.logo}>CalisPro</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  logo: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "outfit-bold",
  },
  img1: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  nameStyle: {
    fontSize: 19,
    fontFamily: "outfit-medium",
    color: "#fff",
  },
  welcome: {
    color: "#fff",
  },
});
