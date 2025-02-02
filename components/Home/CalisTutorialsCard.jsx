import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
// import { MaterialIcons } from "@expo/vector-icons"; TODO

export default function CalisTutorialsCard({ tutorial }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push("/tutorialDetail/" + tutorial?.id)}
    >
      <View style={styles.container}>
        <Image
          source={{ uri: tutorial?.imageUrl, cache: "reload" }}
          style={styles.img1}
        />
        <View style={styles.contTxt}>
          <Text style={styles.txtName} numberOfLines={1} ellipsizeMode="tail">
            {tutorial.name}
          </Text>
          {/* <MaterialIcons name={"favorite"} size={22} color={Colors.PRIMARY} /> */}
        </View>
        <View style={styles.contCatLike}>
          <Text style={styles.txt2}>{tutorial?.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  img1: {
    width: 200,
    height: 140,
    borderRadius: 15,
    resizeMode: "stretch",
  },
  txt2: {
    fontFamily: "outfit",
    color: Colors.GRAY,
  },
  contTxt: {
    marginTop: 5,
    gap: 5,
    width: 200,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 5,
  },
  contCatLike: {
    alignItems: "flex-start",
    paddingLeft: 5,
  },
  txtName: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    flex: 1,
  },
  category1: {
    fontFamily: "outfit",
    backgroundColor: Colors.PRIMARY,
    color: "#fff",
    padding: 5,
    fontSize: 13,
    borderRadius: 5,
  },
});
