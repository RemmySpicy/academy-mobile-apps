import {
  Entypo,
  Ionicons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  PixelRatio,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ToggleCard from "./reuseable/ToggleCard";
import People from "../../../../assets/people.svg";

const { width } = Dimensions.get("window");

const StudentCard = ({
  handleBottomNav,
  preSchool,
  setPreSchool,
  activePaymentGroup,
  activeGroup,
  setActiveSearch,
}: any) => {
  return (
    <View style={{ width: "100%" }}>
      {/* School Info Card */}
      <View className="bg-[#EFEFEF] rounded-lg p-4 mb-4">
        <View className="flex flex-row pb-1 justify-between items-center">
          <Text style={{ fontSize: PixelRatio.getFontScale() * 14 }}>
            Sachos Academy School, Magodo
          </Text>
          <Pressable className="rounded-full bg-white px-2 py-1">
            <Entypo name="dots-three-horizontal" size={12} color="black" />
          </Pressable>
        </View>

        {/* Views Section */}
        <Text
          style={{
            fontSize: PixelRatio.getFontScale() * 12,
            paddingVertical: 6,
          }}
        >
          Views
        </Text>

        {/* Filter & Search Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 6,
            marginBottom: 4,
            width: "100%",
          }}
          className="flex-row flex items-center justify-between mb-4"
        >
          <View
            style={{
              backgroundColor: "#DCD5F4",
              borderRadius: 8,
              padding: 8,
              flexDirection: "row",
              alignItems: "center",
              flex: 0.4,
              minWidth: 0,
            }}
          >
            <People width={15} height={15} />
            <TouchableOpacity onPress={handleBottomNav}>
              <Text
                style={{
                  fontSize: PixelRatio.getFontScale() * 10,
                  color: "#4F2EC9",
                }}
              >
                {""} Group: {""}
                {activeGroup === "No Groups"
                  ? "All Groups"
                  : activeGroup || activePaymentGroup}
              </Text>
            </TouchableOpacity>
          </View>

          <Pressable
            style={{
              borderWidth: 1,
              borderColor: "#DCD5F4",
              borderRadius: 8,
              padding: 8,
              flexDirection: "row",
              alignItems: "center",
              flex: 0.35, // Takes 40% of the container width
              minWidth: 0,
            }}
          >
            <Ionicons name="eye-outline" size={14} color="#696969" />
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
              All Location
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
              flex: 0.35, // Takes 28% of the container width
              minWidth: 0,
            }}
            onPress={() => setActiveSearch(true)}
          >
            <Octicons name="search" size={14} color="#696969" />
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

        {/* Quick Filters */}
        <View>
          <Text
            style={{
              fontSize: PixelRatio.getFontScale() * 12,
              color: "#696969",
            }}
          >
            Quick Filter
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 6 }}
          >
            {[
              { label: "All students:", count: 73 },
              { label: "Preschool 1 & 2:", count: 10 },
              { label: "Kindergarten:", count: 15 },
            ].map((filter, index) => (
              <Pressable
                key={index}
                className="flex-row items-center space-x-1 px-2 py-1 rounded-full border border-[#DCD5F4]"
                style={{
                  backgroundColor: index === 0 ? "#DCD5F4" : "transparent",
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: PixelRatio.getFontScale() * 10,
                    color: "#696969",
                  }}
                >
                  {filter.label}
                </Text>
                <Text
                  style={{
                    color: "#4F2EC9",
                    fontWeight: "bold",
                    fontSize: 11,
                  }}
                >
                  {filter.count}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Toggle Section */}
      <ToggleCard
        title="Preschool 1&2"
        count={10}
        initialExpanded={preSchool}
        onToggle={setPreSchool}
        widthPercentage={0.4}
      />
    </View>
  );
};

export default StudentCard;
