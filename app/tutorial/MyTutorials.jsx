import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import TutorialListCard from "../../components/Explore/TutorialListCard";
import { useFocusEffect, useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";
import { getVideoDetails } from "../../utils/youtubeAPI";

export default function MyTutorials() {
  const { user } = useUser();
  const [tutorialList, setTutorialList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      user && GetUserTutorial();
    }, [user])
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "My Tutorials",
    });
  }, [user, navigation]);

  // Fetch Tutorials Created by the User
  const GetUserTutorial = async () => {
    setLoading(true);
    setTutorialList([]); // Reset list before fetching new data
    try {
      const q = query(
        collection(db, "CalisTutorials"),
        where("userEmail", "==", user?.primaryEmailAddress?.emailAddress),
        orderBy("createdAt", "desc") // Order by creation date, newest first
      );

      const querySnapShot = await getDocs(q);

      const tutorials = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
      console.error("Error fetching tutorials:", error.message);
      Alert.alert("Error", "Failed to load tutorials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tutorials</Text>
      <FlatList
        data={tutorialList}
        keyExtractor={(item) => item.id} // Use unique `id` as the key
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
    flex: 1, // Ensures the container takes the full screen height
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
