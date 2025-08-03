import { Octicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Eye from "../../../../assets/eye.svg";
import People from "../../../../assets/people.svg";
import Search from "../../../../assets/search.svg";

const FilterComponent = ({
  groups,
  groupName,
  allNames,
  setActiveSearch,
}: any) => {
  const [activeGroup, setActiveGroup] = useState(groupName);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSheetChanges = useCallback(
    (index: number) => {
      Animated.timing(fadeAnim, {
        toValue: index === -1 ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [fadeAnim]
  );

  const handleBottomNav = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <>
      <View
        className="gap-[10px]"
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
          width: "100%",
        }}
      >
        {/* Group Filter */}
        <Pressable
          style={{
            backgroundColor: "#DCD5F4",
            borderRadius: 8,
            padding: 8,
            flexDirection: "row",
            alignItems: "center",
            flex: 0.5,
            minWidth: 0,
          }}
          onPress={handleBottomNav}
        >
          <People width={15} height={15} />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: PixelRatio.getFontScale() * 10,
              color: "#4F2EC9",
              marginLeft: 4,
              flexShrink: 1,
              fontWeight: 600,
            }}
          >
            Group: {groupName}
          </Text>
        </Pressable>

        {/* Student Filter */}
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: "#DCD5F4",
            borderRadius: 8,
            padding: 8,
            flexDirection: "row",
            alignItems: "center",
            flex: 0.4,
            minWidth: 0,
          }}
        >
          <Eye width={15} height={15} />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: PixelRatio.getFontScale() * 10,
              color: "#696969",
              marginLeft: 4,
              flexShrink: 1,
            }}
          >
            {allNames}
          </Text>
        </Pressable>

        {/* Search */}
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: "#DCD5F4",
            borderRadius: 8,
            padding: 8,
            flexDirection: "row",
            alignItems: "center",
            flex: 0.35,
            minWidth: 0,
          }}
          onPress={() => setActiveSearch(true)}
        >
          <Search width={15} height={15} />
          <Text
            style={{
              fontSize: PixelRatio.getFontScale() * 10,
              color: "#696969",
              marginLeft: 4,
            }}
          >
            Search
          </Text>
        </Pressable>
      </View>

      {/* <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["25%"]}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        index={-1}
        backgroundStyle={styles.bottomSheet}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View className="px-4">
            <Text className="pb-3 text-[#696969]">Group By:</Text>
            {groups?.map(({ group, i }: any) => (
              <Pressable
                key={i}
                onTouchStart={() => {
                  setActiveGroup(group);
                  if (group === "Payment") {
                    // handlePaymentBottomNav();
                  }
                  bottomSheetRef.current?.close();
                }}
                style={styles.smallCard}
                className="flex flex-row justify-between items-center"
              >
                <Text className="font-semibold">{group}</Text>
                {activeGroup === group && (
                  <Ionicons
                    name="checkmark-circle-sharp"
                    size={18}
                    color="#6C51D2"
                  />
                )}
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet> */}
    </>
  );
};

export default FilterComponent;

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "rgb(243, 245, 249)",
    borderRadius: 30,
  },
  bottomSheetContainer: {
    flex: 1,
    // padding: width * 0.04,
    padding: 5,
  },
  smallCard: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
