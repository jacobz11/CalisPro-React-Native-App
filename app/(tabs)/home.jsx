import { View, ScrollView } from "react-native";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import Category from "../../components/Home/Category";
import CalisTutorials from "../../components/Home/CalisTutorials";

export default function Home() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Header />
      <Category />
      <CalisTutorials />
      <Slider />
      <View style={{ height: 20 }}></View>
    </ScrollView>
  );
}
