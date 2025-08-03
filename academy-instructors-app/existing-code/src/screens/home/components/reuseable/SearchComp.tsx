import { Entypo, Octicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const SearchComp = ({ setQueryText, toggleSearch }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Octicons
          name="search"
          size={14}
          color="#696969"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Something Something"
          style={styles.input}
          onChangeText={(text) => setQueryText(text)}
          placeholderTextColor="#696969"
        />
      </View>

      <Pressable onPress={toggleSearch} style={styles.doneButton}>
        <Text style={styles.doneText}>Done</Text>
      </Pressable>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 8,
//     width: "100%",
//   },
//   searchContainer: {
//     flex: 1, // Takes most of the available space
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#DCD5F4",
//     borderRadius: 10,
//     paddingVertical: 4,
//     paddingHorizontal: 12,
//     marginRight: 8, // Space between search and done button
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   input: {
//     flex: 1,
//     fontSize: 12,
//     paddingVertical: 4,
//     color: "#000",
//   },
//   doneButton: {
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//   },
//   doneText: {
//     color: "#8A74DB",
//     fontSize: 12,
//     fontWeight: "500",
//   },
// });

const StacticSearchComp = ({ setQueryText, toggleSearch }: any) => {
  return (
    <View>
      <View className="bg-[#EFEFEF] rounded-[10px] p-4 mt-2">
        <View className="flex flex-row pb-1 justify-between items-center">
          <Text>Sachos Academy School, Magodo</Text>
          <Pressable className="rounded-full bg-white px-2 py-1">
            <Entypo name="dots-three-horizontal" size={12} color="black" />
          </Pressable>
        </View>
        <Text className="text-[12px] mt-1 text-[#1E1E1E]">Views</Text>

        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Octicons
              name="search"
              size={14}
              color="#696969"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Something Something"
              style={styles.input}
              onChangeText={(text) => setQueryText(text)}
              placeholderTextColor="#696969"
            />
          </View>

          <Pressable onPress={toggleSearch} style={styles.doneButton}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    width: "100%",
  },
  searchContainer: {
    flex: 1, // Takes most of the available space
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCD5F4",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8, // Space between search and done button
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 4,
    color: "#000",
  },
  doneButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  doneText: {
    color: "#8A74DB",
    fontSize: 12,
    fontWeight: "500",
  },
});

export { SearchComp, StacticSearchComp };
