import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Share,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Colors } from "../../constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";

export default function MenuList() {
  useFocusEffect(
    useCallback(() => {
      GetAdminEmailsList();
    }, [])
  );

  const { signOut } = useAuth();
  const menuListAdmin = [
    {
      id: 1,
      name: "Add Tutorial",
      nameLogo: "library-add",
      color: "#38b000",
      path: "/tutorial/AddTutorial",
    },
    {
      id: 2,
      name: "My Tutorials",
      nameLogo: "video-library",
      color: "#efbf04",
      path: "/tutorial/MyTutorials",
    },
    {
      id: 3,
      name: "Share App",
      nameLogo: "share",
      color: "#0496ff",
      path: "share",
    },
    {
      id: 4,
      name: "Liked Tutorials",
      nameLogo: "favorite",
      color: "#d90429",
      path: "/tutorial/LikedTutorials",
    },
  ];
  const menuListUser = [
    {
      id: 1,
      name: "Liked Tutorials",
      nameLogo: "favorite",
      color: "#d90429",
      path: "/tutorial/LikedTutorials",
    },
    {
      id: 2,
      name: "Share App",
      nameLogo: "share",
      color: "#0496ff",
      path: "share",
    },
  ];
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();

  const GetAdminEmailsList = async () => {
    try {
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
    } catch (error) {
      console.error("admin fetch problem");
    }
  };

  const onMenuClick = (item) => {
    if (item.path === "share") {
      Share.share({ message: "Download the CalisPro app now from here: " });
      return;
    }
    router.push(item.path);
  };

  return (
    <View>
      {isAdmin ? (
        <View style={styles.containerAdmin}>
          <FlatList
            data={menuListAdmin}
            numColumns={2}
            key={1}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.menuItemAdmin}
                onPress={() => onMenuClick(item)}
              >
                <MaterialIcons
                  name={item.nameLogo}
                  size={48}
                  color={item.color}
                />
                <Text style={styles.menuText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => signOut()}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.containerUser}>
          <FlatList
            data={menuListUser}
            numColumns={1}
            key={2}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.menuItemUser}
                onPress={() => onMenuClick(item)}
              >
                <View style={styles.menuContentContainerUser}>
                  <MaterialIcons
                    name={item.nameLogo}
                    size={48}
                    color={item.color}
                  />
                  <Text style={styles.menuTextUser}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[styles.logoutButtonUser, styles.logoutButton]}
            onPress={() => signOut()}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerAdmin: {
    marginTop: 20,
  },
  containerUser: {
    marginTop: 20,
    maxWidth: 500,
    alignSelf: "center",
    width: "65%",
  },
  menuItemAdmin: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    margin: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  menuItemUser: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  menuContentContainerUser: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  menuText: {
    fontFamily: "outfit-medium",
    fontSize: 15,
    marginLeft: 8,
    flex: 1,
  },
  menuTextUser: {
    fontFamily: "outfit-medium",
    fontSize: 15,
  },
  logoutButton: {
    backgroundColor: "#d90429",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  logoutButtonUser: {
    marginHorizontal: 8,
  },
  logoutText: {
    color: "#fff",
    fontFamily: "outfit-bold",
    fontSize: 18,
    textAlign: "center",
  },
});
