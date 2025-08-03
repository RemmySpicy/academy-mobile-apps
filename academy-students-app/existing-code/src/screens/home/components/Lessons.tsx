import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Stations from "./Stations";
interface Props {
  completion: string;
  rating: string;
  image: string;
  lesson: string;
  title: string;
  imageCompletion: string;
  starClass: string;
  disabled?: boolean;
}

type Station = "station1" | "station2" | "station3";

const Lessons = ({
  completion,
  rating,
  image,
  lesson,
  title,
  imageCompletion,
  starClass,
  disabled,
  ...progression
}: Props) => {
  const [activetabs, setActiveTabs] = useState<Station>("station1");
  const [tabs, setTabs] = useState(false);
  const handleActiveTap = (station: Station) => {
    setActiveTabs(station);
  };

  const textVariant = {
    primary: "#1E1E1E",
    gray: "#44444",
    button: "#4F2EC9",
    yellow: "#FFC107",
    buttonText: "#FFFFFF",
    outlineTheme: "#E6EBEC",
    outlineText: "#596367",
  };
  return (
    <View style={styles.card}>
      <View className="flex-row items-center justify-between">
        <View style={{ paddingTop: 16, paddingHorizontal: 16 }}>
          <Text style={styles.title}>{lesson}</Text>
          <Text style={styles.classTitle}>
            <Text style={styles.highlight}>{title}</Text>
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Image
                // source={require({"../../../assets/swim.png"})}
                source={image}
                style={{ width: 20, height: 20 }}
              />
              <Text style={styles.statText}>{completion}</Text>
            </View>
            <View style={styles.stat}>
              <MaterialIcons name="star" size={19} color={starClass} />
              <Text style={styles.statText}>{rating}</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Image source={imageCompletion} style={{ width: 80, height: 80 }} />
          {/* <Text style={styles.completeText}>Complete</Text> */}
        </View>
      </View>

      <View style={{ paddingTop: 16, paddingHorizontal: 16 }}>
        {tabs && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 12,
              paddingHorizontal: 20,
            }}
          >
            <View>
              <Text
                className={`text-[12px] ${
                  activetabs === "station1"
                    ? "text-black border-b-2"
                    : "text-[#b0c1c8]"
                } pb-1`}
                onPress={() => handleActiveTap("station1")}
              >
                station 1
              </Text>
            </View>
            <View>
              <Text
                className={`text-[12px] ${
                  activetabs === "station2"
                    ? "text-black border-b-2"
                    : "text-[#b0c1c8]"
                } pb-1`}
                onPress={() => handleActiveTap("station2")}
              >
                station 2
              </Text>
            </View>
            <View>
              <Text
                className={`text-[12px] ${
                  activetabs === "station3"
                    ? "text-black border-b-2"
                    : "text-[#b0c1c8]"
                } pb-1`}
                onPress={() => handleActiveTap("station3")}
              >
                station 3
              </Text>
            </View>
          </View>
        )}

        {activetabs && tabs && (
          <>
            <Stations
              title="Frog Kick In Motion"
              rating="7/9"
              starRating={textVariant.yellow}
              heading="Max distance without a noodle and kickboard"
              iconName1="star"
              iconColor1={textVariant.yellow}
              iconName2="star"
              iconColor2={textVariant.yellow}
              iconName3="star"
              iconColor3={textVariant.yellow}
            />
            <Stations
              heading="Kicking without a noodle"
              iconName1="star"
              iconColor1={textVariant.yellow}
              iconName2="star"
              iconColor2={textVariant.yellow}
              iconName3="star-outline"
              iconColor3={textVariant.yellow}
            />
            <Stations
              heading="Kicking using a noodle and kickboard"
              iconName1="star"
              iconColor1={textVariant.yellow}
              iconName2="star"
              iconColor2={textVariant.yellow}
              iconName3="star-outline"
              iconColor3={textVariant.yellow}
              marginBottom={"5"}
            />
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.arrowContainer}
        onPress={() => setTabs((tabs) => !tabs)}
        disabled={disabled}
      >
        {tabs === false ? (
          <MaterialIcons name="keyboard-arrow-down" size={20} color="gray" />
        ) : (
          <MaterialIcons name="keyboard-arrow-up" size={20} color="gray" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Lessons;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    // padding: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 12,
    color: "gray",
    marginBottom: 4,
  },
  classTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  highlight: {
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
    color: "#555",
  },
  progressContainer: {
    // alignItems: "center",
    // marginLeft: "auto",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  completeText: {
    fontSize: 12,
    color: "gray",
  },
  arrowContainer: {
    alignItems: "center",
    paddingVertical: 4,
    borderTopColor: "#E6EBEC",
    borderTopWidth: 1,
  },
});
