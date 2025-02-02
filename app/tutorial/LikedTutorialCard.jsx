import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function LikedTutorialCard({ likedTutorial }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push("/tutorialDetail/" + likedTutorial?.likeID)}
    >
      <Image source={{ uri: likedTutorial?.imageUrl }} style={styles.img} />
      <View style={styles.contTxt}>
        <Text style={styles.txt1}>{likedTutorial?.name}</Text>
        <Text style={styles.txt2}>{likedTutorial?.category}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginTop: 15,
  },
  img: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  contTxt: {
    padding: 10,
  },
  txt1: {
    fontFamily: "outfit-bold",
    fontSize: 20,
  },
  txt2: {
    fontFamily: "outfit",
    color: Colors.GRAY,
  },
});
