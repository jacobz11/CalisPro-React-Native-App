import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import RNPickerSelect from "react-native-picker-select";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { db } from "./../../configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import { getVideoDetails } from "../../utils/youtubeAPI";

export default function AddTutorial() {
  const navigation = useNavigation();
  const [categoryList, setCategoryList] = useState([]);
  const { user } = useUser();
  const [yutUrl, setYutUrl] = useState("");
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Tutorial",
      headerShown: true,
    });
    GetCategoryList();
  }, []);

  const GetCategoryList = async () => {
    setCategoryList([]);
    const q = query(collection(db, "Category"));
    const snapShot = await getDocs(q);
    snapShot.forEach((doc) => {
      setCategoryList((prev) => [
        ...prev,
        {
          label: doc.data().name,
          value: doc.data().name,
        },
      ]);
    });
  };

  const AddNewTutorial = async () => {
    if (!yutUrl || !category) {
      Alert.alert("Error", "Please fill all the fields!", [{ text: "OK" }]);
      return;
    }

    setLoading(true);
    try {
      const videoDetails = await getVideoDetails(yutUrl, "", "");
      if (videoDetails) {
        // Only proceed if we got valid details
        await setDoc(doc(db, "CalisTutorials", Date.now().toString()), {
          name: videoDetails.title,
          about: videoDetails.description,
          website: yutUrl,
          category: category,
          videoID: videoDetails.videoID,
          imageUrl: videoDetails.thumbnail,
          username: user?.fullName,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userImage: user?.imageUrl,
          createdAt: new Date(),
        });

        Toast.show({
          type: "success",
          text1: "New tutorial added!",
        });
        router.push("/(tabs)/profile");
      }
    } catch (error) {
      console.error("Error adding tutorial:", error);
      Alert.alert("Error", "Failed to add tutorial. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={15}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.txt}>Add New Tutorial</Text>
        <Text style={styles.txtFill}>
          Fill all the details to add a new tutorial
        </Text>
        {/*Text inputs for a new tutorial*/}
        <View style={styles.contFields}>
          <TextInput
            placeholder="YouTube Video Url"
            style={styles.txtInput}
            onChangeText={(v) => setYutUrl(v)}
          />
        </View>
        <View style={styles.contSelect}>
          <RNPickerSelect
            onValueChange={(value) => setCategory(value)}
            items={categoryList}
            placeholder={{
              label: "Select Calis Category",
              value: null,
              color: Colors.PRIMARY,
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => AddNewTutorial()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color={"#fff"} />
          ) : (
            <Text style={styles.txtBtn}>Add New Tutorial</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  contFields: {
    marginTop: 10,
  },
  txt: {
    fontFamily: "outfit-bold",
    fontSize: 25,
  },
  txtFill: {
    fontFamily: "outfit",
    color: Colors.GRAY,
  },
  txtInput: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 17,
    fontFamily: "outfit",
    backgroundColor: "#fff",
    marginTop: 15,
    textAlignVertical: "top",
    borderColor: Colors.PRIMARY,
  },
  contSelect: {
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginTop: 10,
    borderColor: Colors.PRIMARY,
  },
  btn: {
    padding: 12,
    borderRadius: 5,
    marginTop: 30,
    backgroundColor: Colors.PRIMARY,
  },
  txtBtn: {
    textAlign: "center",
    fontFamily: "outfit",
    color: "#fff",
    fontSize: 17,
  },
});
