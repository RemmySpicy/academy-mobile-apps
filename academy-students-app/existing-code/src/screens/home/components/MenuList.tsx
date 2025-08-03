import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// Define the navigation type for routes
type RootStackParamList = {
  Courses: String;
  Services: String;
};

const MenuList = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const numColumns = Math.floor(Dimensions.get("window").width / 150);

  const colorVariant = {
    lightB: "#dcf9f1",
    lightP: "#DCD5F4",
    lightPN: "#F9DCF0",
    lightY: "#F9EFDC",
  };

  const items = [
    {
      title: "Our Courses",
      color: colorVariant.lightB,
      image: require("../../../../assets/teacher.png"),
      href: "Courses",
    },
    {
      title: "Our Services",
      color: colorVariant.lightP,
      image: require("../../../../assets/bookmark.png"),
      href: "Services",
    },
    {
      title: "Achievements",
      color: colorVariant.lightPN,
      image: require("../../../../assets/medal-star.png"),
      href: "Services",
    },
    {
      title: "Store",
      color: colorVariant.lightY,
      image: require("../../../../assets/shop.png"),
      href: "Services",
    },
    {
      title: "Transaction",
      color: colorVariant.lightB,
      image: require("../../../../assets/wallet-money.png"),
      href: "Services",
    },
    {
      title: "Referrals",
      color: colorVariant.lightP,
      image: require("../../../../assets/personalcard.png"),
      href: "Services",
    },
    {
      title: "Locate Us",
      color: colorVariant.lightPN,
      image: require("../../../../assets/global.png"),
      href: "Services",
    },
    {
      title: "Contact Us",
      color: colorVariant.lightY,
      image: require("../../../../assets/message-notif.png"),
      href: "Services",
    },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.href)}
      style={[styles.card, { backgroundColor: item.color }]}
    >
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.title}
          numColumns={numColumns}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 8,
    justifyContent: "center",
    width: "100%",
    // flex: 1,
  },
  card: {
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    width: 175,
    height: 92,
    marginHorizontal: 5,
  },
  image: {
    width: 32,
    height: 32,
  },
  title: {
    fontWeight: "semibold",
    fontSize: 15,
  },
});

export default MenuList;
