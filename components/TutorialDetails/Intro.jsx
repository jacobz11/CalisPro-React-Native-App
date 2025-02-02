import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import YoutubeIframe from "react-native-youtube-iframe";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";

export default function Intro({ tutorialDetail }) {
  useEffect(() => {
    onLike();
  }, []);

  useFocusEffect(
    useCallback(() => {
      onNumLikesCheck();
      GetAdminEmailsList();
    }, [])
  );

  const playing = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [like, setLike] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const GetAdminEmailsList = async () => {
    const q = query(
      collection(db, "Admins"),
      where("email", "==", user?.primaryEmailAddress.emailAddress)
    );
    const querySnapShot = await getDocs(q);
    const admins = querySnapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (admins.length === 0) {
      setIsAdmin(false);
    } else setIsAdmin(true);
  };

  const onDelete = () => {
    Alert.alert("Delete this tutorial?", "This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => DeleteTutorial(),
      },
    ]);
  };

  const onNumLikesCheck = async () => {
    try {
      const likesRef = collection(db, "Likes");
      const q = query(likesRef, where("likeID", "==", tutorialDetail?.id));
      const querySnapshot = await getDocs(q);
      const numLikes = querySnapshot.size;
      setLikesCount(numLikes);
      return numLikes;
    } catch (error) {
      console.error("Error counting likes:", error);
      return 0;
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000000) {
      // Billion
      return Math.floor((num / 1000000000) * 10) / 10 + "B";
    }
    if (num >= 1000000) {
      // Million
      return Math.floor((num / 1000000) * 10) / 10 + "M";
    }
    if (num >= 1000) {
      // Thousand
      return Math.floor((num / 1000) * 10) / 10 + "K";
    }
    return num.toString();
  };

  const onPressedLike = async () => {
    setLoading(true);
    if (!like) {
      // add to Likes collection the liked video
      await setDoc(doc(db, "Likes", Date.now().toString()), {
        name: tutorialDetail?.name,
        category: tutorialDetail?.category,
        videoID: tutorialDetail?.videoID,
        imageUrl: tutorialDetail?.imageUrl,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        likeID: tutorialDetail?.id,
        website: tutorialDetail?.website,
        createdAt: new Date(),
      });
      Toast.show({
        type: "success", // 'success' | 'error' | 'info'
        text1: "Saved to Liked Tutorials",
      });
    } else {
      // Query the "Likes" collection for the specific document
      const q = query(
        collection(db, "Likes"),
        where("userEmail", "==", user?.primaryEmailAddress?.emailAddress),
        where("likeID", "==", tutorialDetail?.id)
      );
      const querySnapShot = await getDocs(q);

      // Delete each matching document
      querySnapShot.forEach(async (docSnapShot) => {
        await deleteDoc(doc(db, "Likes", docSnapShot.id));
      });
    }
    // set the icon state, change to like/unlike
    onLike();
  };
  const onLike = async () => {
    setLoading(true);
    onNumLikesCheck();
    const q = query(
      collection(db, "Likes"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress),
      where("likeID", "==", tutorialDetail?.id)
    );
    const querySnapShot = await getDocs(q);
    const likes = querySnapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (likes.length === 0) {
      setLike(false);
    } else {
      setLike(true);
    }
    setLoading(false);
  };
  const DeleteTutorial = async () => {
    await deleteDoc(doc(db, "CalisTutorials", tutorialDetail?.id));
    const q = query(
      collection(db, "Likes"),
      where("likeID", "==", tutorialDetail?.id)
    );
    const querySnapshot = await getDocs(q);
    // Delete each matching liked tutorial also
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, "Likes", docSnapshot.id));
    });
    // Alert.alert("Tutorial deleted", "", [{ text: "OK" }]);
    Toast.show({
      type: "success", // 'success' | 'error' | 'info'
      text1: "Tutorial deleted",
    });
    router.back();
  };
  return (
    <View>
      <View style={styles.headerContainer}>{/* Header content */}</View>
      <View style={styles.videoCont}>
        <YoutubeIframe
          height={202.5}
          play={playing}
          videoId={tutorialDetail?.videoID}
        />
      </View>
      <View style={styles.txtCont}>
        <View style={styles.titleContainer}>
          <Text style={styles.txtName}>{tutorialDetail?.name}</Text>
          <View style={styles.likeContainer}>
            {loading ? (
              <View style={styles.likeButtonContainer}>
                <ActivityIndicator
                  style={styles.loadIcon}
                  size="small"
                  color={Colors.PRIMARY}
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => onPressedLike()}
                disabled={loading}
                style={styles.likeButtonContainer}
              >
                <MaterialIcons
                  name={like ? "favorite" : "favorite-outline"}
                  size={35}
                  color={Colors.PRIMARY}
                />
                <Text style={styles.likestxt}>{formatNumber(likesCount)}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.catWithDel}>
          <Text style={styles.txtCat}>{tutorialDetail?.category}</Text>
          {isAdmin && (
            <TouchableOpacity
              onPress={() => onDelete()}
              style={{ marginRight: 3 }}
            >
              <Ionicons name="trash" size={30} color="red" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeContainer: {
    width: 35, // Fixed width to match icon size
    height: 45, // Fixed height to accommodate icon + text
    justifyContent: "center",
    alignItems: "center",
  },
  likeButtonContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadIcon: { marginBottom: 15 },
  txtName: {
    fontSize: 25,
    fontFamily: "outfit-bold",
    flex: 1,
    marginRight: 10,
  },
  txtCat: {
    fontFamily: "outfit",
    fontSize: 18,
  },
  txtCont: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    padding: 15,
  },
  catWithDel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likestxt: {
    fontFamily: "outfit-bold",
    textAlign: "center",
    color: Colors.PRIMARY,
    fontSize: 7,
  },
  videoCont: {
    zIndex: -1,
    marginTop: -50,
  },
});
