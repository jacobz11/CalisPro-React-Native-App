import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import { Colors } from "../../constants/Colors";

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetSliderList = async () => {
    setLoading(true);
    setSliderList([]);
    const q = query(collection(db, "Sliders"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setSliderList((prev) => [...prev, doc.data()]);
    });
    setLoading(false);
  };

  useEffect(() => {
    GetSliderList();
  }, []);

  return (
    <View>
      <Text style={styles.txt1}>#Special for you</Text>
      {loading ? (
        <ActivityIndicator
          size={"large"}
          color={Colors.PRIMARY}
          style={styles.load}
        />
      ) : (
        <FlatList
          showsHorizontalScrollIndicator={false}
          style={styles.flat1}
          data={sliderList}
          horizontal={true}
          renderItem={({ item, index }) => (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.img1}
              key={index}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  txt1: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    paddingLeft: 15,
    paddingTop: 20,
    marginBottom: 5,
  },
  img1: {
    width: 240,
    height: 180,
    borderRadius: 15,
    marginRight: 15,
    resizeMode: "stretch",
  },
  flat1: {
    paddingLeft: 15,
  },
  load: {
    marginTop: 20,
    marginLeft: 10,
  },
});
