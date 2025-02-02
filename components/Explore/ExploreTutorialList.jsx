import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import TutorialListCard from "./TutorialListCard";
import { Colors } from "../../constants/Colors";

export default function ExploreTutorialList({ tutorialList }) {
  return (
    <View>
      {tutorialList?.length > 0 ? (
        <FlatList
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          data={tutorialList}
          renderItem={({ item }) => <TutorialListCard tutorial={item} />}
          contentContainerStyle={{
            flexGrow: 1, // Ensures list takes full available space
          }}
        />
      ) : (
        <View style={styles.contNotFnd}>
          <Text style={styles.txtNotFound}>{"No Tutorials Found :("}</Text>
          <Text style={styles.txtNotFound}>
            {"Search tutorial or pick a category."}
          </Text>
        </View>
      )}
      <View style={styles.secCont}></View>
    </View>
  );
}
const styles = StyleSheet.create({
  secCont: {
    height: 200,
  },
  contNotFnd: {
    alignItems: "center",
    marginTop: 40,
  },
  txtNotFound: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.GRAY,
  },
});
