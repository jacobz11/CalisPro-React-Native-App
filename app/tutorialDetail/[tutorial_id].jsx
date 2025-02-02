import { View, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import { Colors } from "../../constants/Colors";
import Intro from "../../components/TutorialDetails/Intro";
import Reviews from "../../components/TutorialDetails/Reviews";
import About from "../../components/TutorialDetails/About";
import { getVideoDetails } from "../../utils/youtubeAPI";

export default function TutorialId() {
  const { tutorial_id } = useLocalSearchParams();
  const [tutorialDetail, setTutorialDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTutorialDetailById = async () => {
    try {
      const docRef = doc(db, "CalisTutorials", tutorial_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching tutorial:", error);
      return null;
    }
  };

  const refreshTutorialDetails = async () => {
    try {
      setLoading(true);

      // First get the current tutorial details
      const currentDetails = await getTutorialDetailById();
      if (!currentDetails) {
        setLoading(false);
        return;
      }

      setTutorialDetail(currentDetails);

      // If there's a website URL, fetch and update video details
      if (currentDetails.website) {
        const videoDetails = await getVideoDetails(
          currentDetails.website,
          tutorial_id,
          "CalisTutorials"
        );
        if (videoDetails) {
          // Get the updated details after youtube API updates the document
          const updatedDetails = await getTutorialDetailById();
          setTutorialDetail(updatedDetails);
        }
      }
    } catch (error) {
      console.error("Error refreshing tutorial details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTutorialDetails();
  }, [tutorial_id]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.PRIMARY}
        style={{ marginTop: "50%" }}
      />
    );
  }

  if (!tutorialDetail) {
    return null;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Intro tutorialDetail={tutorialDetail} />
        <About tutorialDetail={tutorialDetail} />
        <Reviews tutorialDetail={tutorialDetail} />
      </View>
    </ScrollView>
  );
}
