import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import { useNavigation, useFocusEffect } from "expo-router";
import { Colors } from "../../constants/Colors";
import LikedTutorialCard from "./LikedTutorialCard";
import { getVideoDetails } from "../../utils/youtubeAPI";

export default function LikedTutorials() {
  const { user } = useUser();
  const [tutorialList, setTutorialList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Fetch tutorials when the page is in focus
  useFocusEffect(
    useCallback(() => {
      user && GetUserTutorial(); // Fetch data only if the user is logged in
    }, [user])
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Liked Tutorials",
    });
  }, [navigation]);

  // Fetch Tutorials Liked by the User
  const GetUserTutorial = async () => {
    setLoading(true);
    setTutorialList([]); // Reset list before fetching new data
    try {
      const q = query(
        collection(db, "Likes"),
        orderBy("createdAt", "desc"),
        where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
      );
      const querySnapShot = await getDocs(q);
      const tutorials = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTutorialList(tutorials);
      // Refresh video details for matching tutorials
      tutorials.forEach(async (tutorial) => {
        if (tutorial.website) {
          const videoDetails = await getVideoDetails(
            tutorial.website,
            tutorial.id,
            "Likes"
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
      console.error("Error fetching liked tutorials:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liked Tutorials</Text>
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
              <Text style={styles.emptyText}>
                You haven't liked any tutorials yet.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => <LikedTutorialCard likedTutorial={item} />}
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
