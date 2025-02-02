import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import UserIntro from "../../components/Profile/UserIntro";
import MenuList from "../../components/Profile/MenuList";

export default function profile() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Profile</Text>
        <UserIntro />
        <MenuList />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  container: {
    flex: 1,
  },
  headerText: {
    fontFamily: "outfit-bold",
    fontSize: 30,
    marginTop: 10,
  },
});
