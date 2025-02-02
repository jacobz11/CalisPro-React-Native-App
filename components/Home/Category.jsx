import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import CategoryItem from "./CategoryItem";
import { styles } from "./Styles";
import { useFocusEffect, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";

export default function Category({ explore = false, onCategorySelect }) {
  const [categoryList, setCategoryList] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState();

  useFocusEffect(
    useCallback(() => {
      GetCategoryList();
    }, [])
  );

  const GetCategoryList = async () => {
    setLoading(true);
    setCategoryList([]);
    const q = query(collection(db, "Category"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setCategoryList((prev) => [...prev, doc.data()]);
    });
    setLoading(false);
  };
  const onCategotyPressHandler = (item) => {
    if (!explore) {
      router.push("/tutorialsListCategory/" + item.name);
    } else {
      onCategorySelect(item.name);
    }
  };
  return (
    <View>
      {!explore && (
        <View style={styles.container}>
          <Text style={styles.txt1}>Calis Category</Text>
          {/* <Text style={styles.txt2}>View All</Text> */}
        </View>
      )}
      {loading ? (
        <ActivityIndicator
          size={"large"}
          color={Colors.PRIMARY}
          style={styles.load}
        />
      ) : (
        <FlatList
          data={categoryList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <CategoryItem
              category={item}
              key={index}
              onCategoryPress={() => onCategotyPressHandler(item)}
            />
          )}
        />
      )}
    </View>
  );
}
