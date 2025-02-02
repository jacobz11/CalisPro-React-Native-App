import { doc, updateDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "../configs/FirebaseConfig";

export const getVideoDetails = async (videoUrl, tutorial_id, colecName) => {
  try {
    const videoID = extractVideoID(videoUrl);
    if (!videoID) {
      Alert.alert("Error", "Invalid YouTube URL!");
      return null;
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${process.env.EXPO_PUBLIC_YOUTUBE_API_KEY}&part=snippet,status`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const videoStatus = data.items[0];
      const video = data.items[0].snippet;
      const privacyStatus = videoStatus.status?.privacyStatus;

      if (!privacyStatus) {
        Alert.alert("Error", "Unable to retrieve video privacy status!");
        return null;
      }

      // if (privacyStatus !== "unlisted") {
      //   Alert.alert("Error", "The video must be unlisted in YouTube!", [
      //     { text: "OK" },
      //   ]);
      //   return null;
      // }

      let thumbnailUrl =
        video.thumbnails.maxres?.url ||
        video.thumbnails.high?.url ||
        video.thumbnails.medium?.url ||
        video.thumbnails.default?.url;

      // Add timestamp to thumbnail URL to force refresh
      const timestamp = new Date().getTime();
      const thumbnailWithTimestamp = `${thumbnailUrl}?t=${timestamp}`;

      if (colecName !== "" && tutorial_id !== "") {
        const tutorialRef = doc(db, colecName, tutorial_id);
        // Update Firestore document
        await updateDoc(tutorialRef, {
          name: video.title,
          about: video.description,
          imageUrl: thumbnailWithTimestamp,
        });
      }
      return {
        title: video.title,
        description: video.description,
        thumbnail: thumbnailWithTimestamp,
        privacyStatus: privacyStatus,
        videoID: videoID,
      };
    } else {
      Alert.alert("Error", "Video not found!");
      return null;
    }
  } catch (error) {
    Alert.alert("Error", "An error occurred while fetching video details.");
    return null;
  }
};

export const extractVideoID = (url) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
