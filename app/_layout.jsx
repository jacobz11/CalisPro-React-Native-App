import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import LoginScreen from "../components/LoginScreen";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { Platform, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  useFonts({
    outfit: require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <SignedIn>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SignedIn>
      <SignedOut>
        <LoginScreen />
      </SignedOut>
      <Toast
        position="bottom"
        config={{
          success: ({ text1 }) => (
            <View
              style={{
                backgroundColor: Colors.PRIMARY, // Black background with transparency
                borderRadius: 10,
                padding: 12,
                marginHorizontal: 20, // Margin on the sides
                marginBottom: Platform.OS === "android" ? 50 : 80, // Adjust for platform
                alignItems: "center",
                animation: "fade", // Apply fade effect
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 15,
                  textAlign: "center",
                  fontFamily: "outfit",
                }}
              >
                {text1}
              </Text>
            </View>
          ),
        }}
        // You can control the animation duration and show/hide behavior here
        visibilityTime={3000} // Duration the toast will be visible
        animationDuration={500} // Fade-in and fade-out duration (in ms)
      />
    </ClerkProvider>
  );
}
