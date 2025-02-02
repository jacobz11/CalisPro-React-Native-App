import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import TutorialListCard from "../../components/Explore/TutorialListCard";
import { useFocusEffect, useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";
import { getVideoDetails } from "../../utils/youtubeAPI";

export default function AllTutorials() {
  const [tutorialList, setTutorialList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      GetUserTutorial();
    }, [])
  );
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Calis Tutorials Archive",
    });
  }, [navigation]);

  // Fetch Tutorials Created by the User
  const GetUserTutorial = async () => {
    setLoading(true);
    setTutorialList([]); // Reset list before fetching new data
    try {
      const q = query(
        collection(db, "CalisTutorials"),
        orderBy("createdAt", "desc") // Order by creation date, newest first
      );
      const querySnapShot = await getDocs(q);
      const tutorials = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Set initial data
      setTutorialList(tutorials);
      // Refresh video details for each tutorial
      tutorials.forEach(async (tutorial) => {
        if (tutorial.website) {
          const videoDetails = await getVideoDetails(
            tutorial.website,
            tutorial.id,
            "CalisTutorials"
          );
          if (videoDetails) {
            setTutorialList((prevList) =>
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
    } catch (error) {
      console.error("Error fetching tutorials:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calis Tutorials Archive</Text>
      <FlatList
        data={tutorialList}
        keyExtractor={(item) => item.id}
        onRefresh={GetUserTutorial}
        refreshing={loading}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          // Display message if no tutorials found
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{"No Tutorials Found :("}</Text>
            </View>
          )
        }
        renderItem={({ item }) => <TutorialListCard tutorial={item} />}
        contentContainerStyle={{
          flexGrow: 1, // Ensures list takes full available space
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontFamily: "outfit-bold",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%",
  },
  emptyText: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.GRAY,
  },
});
