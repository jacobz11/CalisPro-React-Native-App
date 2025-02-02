import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function CategoryItem({ category, onCategoryPress }) {
  return (
    <TouchableOpacity onPress={() => onCategoryPress(category)}>
      <View style={styles.container}>
        <Image source={{ uri: category.icon }} style={styles.icon1} />
        <Text style={styles.txt1}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 99,
    marginLeft: 15,
  },
  icon1: {
    width: 40,
    height: 40,
  },
  txt1: {
    fontSize: 12,
    fontFamily: "outfit-medium",
    textAlign: "center",
    marginTop: 10,
  },
});
