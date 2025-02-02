import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import TutorialListCard from "../../components/Explore/TutorialListCard";
import { db } from "../../configs/FirebaseConfig";
import { Colors } from "../../constants/Colors";
import { getVideoDetails } from "../../utils/youtubeAPI";

export default function TutorialsListByCategory() {
  const navigation = useNavigation();
  const { category } = useLocalSearchParams();
  const [tutorialsList, setTutorialsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getTutorialsList();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: category,
    });
  }, [navigation]);

  // Get tutorial list by category
  const getTutorialsList = async () => {
    setTutorialsList([]);
    setLoading(true);
    const q = query(
      collection(db, "CalisTutorials"),
      where("category", "==", category)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setTutorialsList((prev) => [...prev, { id: doc?.id, ...doc.data() }]);
    });

    const tutorials = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Refresh video details for each tutorial
    tutorials.forEach(async (tutorial) => {
      if (tutorial.website) {
        const videoDetails = await getVideoDetails(
          tutorial.website,
          tutorial.id,
          "CalisTutorials"
        );
        if (videoDetails) {
          setTutorialsList((prevList) =>
            prevList.map((item) =>
              item.id === tutorial.id
                ? {
                    ...item,
                    name: videoDetails.title,
                    about: videoDetails.description,
                    imageUrl: videoDetails.thumbnail,
                  }
                : item
            )
          );
        }
      }
    });

    setLoading(false);
  };
  return (
    <View style={styles.container}>
      {tutorialsList?.length > 0 && loading == false ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          onRefresh={getTutorialsList}
          refreshing={loading}
          data={tutorialsList}
          renderItem={({ item, index }) => (
            <TutorialListCard tutorial={item} key={index} />
          )}
        />
      ) : loading ? (
        <ActivityIndicator
          size={"large"}
          color={Colors.PRIMARY}
          style={styles.loading}
        />
      ) : (
        <Text style={styles.txt1}>{"No Tutorial Found :("}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  txt1: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.GRAY,
    textAlign: "center",
    marginTop: "50%",
  },
  loading: {
    marginTop: "50%",
  },
});
