import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Station = "station1" | "station2" | "station3";

const CourseProgression = ({
  progression,
  level,
}: {
  progression: [];
  level: string;
}) => {
  const [activetabs, setActiveTabs] = useState<Station>("station1");

  // console.log(progression);

  // const progressionTab = useMemo(() => {
  //   return progression?.map((item) => item.course);
  // }, [progression]);

  // const flattenedClasses = progressionTab?.map((course) =>
  //   course.levels?.map((level: any) =>
  //     level.classes?.map((classItem: any) => classItem)
  //   )
  // );

  // console.log(flattenedClasses);

  // const [tabs, setTabs] = useState(false);
  // const handleActiveTap = (station: Station) => {
  //   setActiveTabs(station);
  // };

  const [openTabs, setOpenTabs] = useState<{ [key: string]: boolean }>({});

  const handleToggleTab = (tabKey: string) => {
    setOpenTabs((prev) => ({
      ...prev,
      [tabKey]: !prev[tabKey],
    }));
  };

  return (
    
    <>
      {level === "level1" &&
        progression?.levels[0].classes?.map(
          (classItem: any, classIndex: any) => {
            const tabKey = `${classIndex}`;
            const isTabOpen = openTabs[tabKey] || false;
            const activeTab = activetabs[tabKey as any] || "station1";

            return (
              <View key={tabKey} style={styles.card}>
                <View className="flex-row items-center justify-between">
                  <View style={{ paddingTop: 16, paddingHorizontal: 16 }}>
                    <Text style={styles.title}>Lessons:</Text>
                  </View>
                </View>

                <View
                  style={{ width: "95%" }}
                  className="flex-row justify-between"
                >
                  <View style={{ paddingHorizontal: 16 }}>
                    <Text style={styles.highlight}>{classItem.title}</Text>
                    <View className="flex-row items-center space-x-3">
                      <View className="flex-row items-center">
                        <Text style={styles.highlight}>
                          {` 0 / ${classItem.lessons_count}`}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text style={styles.highlight}>
                          {`⭐ ${classItem && classItem.achieved_stars} / ${
                            classItem.total_stars
                          }`}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View>
                    <Text>{classItem.percentage_completed}% </Text>
                  </View>
                </View>

                {/* Render sections and tabs only if the tab is open */}
                {isTabOpen && (
                  <View>
                    {/* Tabs */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 12,
                        paddingHorizontal: 20,
                      }}
                    >
                      {["station1", "station2", "station3"].map(
                        (station, index) => (
                          <View key={index}>
                            <Text
                              className={`text-[12px] ${
                                activeTab === station
                                  ? "text-black border-b-2"
                                  : "text-[#b0c1c8]"
                              } pb-1`}
                              onPress={() =>
                                setActiveTabs((prev) => ({
                                  ...prev,
                                  [tabKey]: station,
                                }))
                              }
                            >
                              {station.replace("station", "Station ")}
                            </Text>
                          </View>
                        )
                      )}
                    </View>

                    {/* Active Station Content */}
                    <View style={{ padding: 4 }}>
                      {activeTab === "station1" && (
                        <View>
                          {classItem.sections && classItem.sections[0] ? (
                            <View>
                              {classItem.sections[0].lessons.map(
                                (lesson: any, lessonIndex: any) => (
                                  <View
                                    key={`lesson-${lessonIndex}`}
                                    style={{
                                      backgroundColor: "#fff",
                                      borderRadius: 10,
                                      paddingVertical: 16,
                                      paddingHorizontal: 8,
                                      marginVertical: 6,
                                      marginHorizontal: 12,
                                      shadowColor: "#000",
                                      shadowOffset: { width: 0, height: 2 },
                                      shadowOpacity: 0.1,
                                      shadowRadius: 6,
                                      elevation: 4,
                                    }}
                                    className="flex-col"
                                  >
                                    <View>
                                      <Text className="font-semibold">
                                        {lesson.description}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text>
                                        {lesson.achievable_stars === 3
                                          ? "⭐⭐⭐"
                                          : "⭐⭐"}
                                      </Text>
                                    </View>
                                  </View>
                                )
                              )}
                            </View>
                          ) : (
                            <Text>No data available for Station 1.</Text>
                          )}
                        </View>
                      )}
                      {activeTab === "station2" && (
                        <View>
                          {classItem.sections && classItem.sections[1] ? (
                            <View>
                              {classItem.sections[1].lessons.map(
                                (lesson: any, lessonIndex: any) => (
                                  <View
                                    key={`lesson-${lessonIndex}`}
                                    style={{
                                      backgroundColor: "#fff",
                                      borderRadius: 10,
                                      paddingVertical: 16,
                                      paddingHorizontal: 8,
                                      marginVertical: 6,
                                      marginHorizontal: 12,
                                      shadowColor: "#000",
                                      shadowOffset: { width: 0, height: 2 },
                                      shadowOpacity: 0.1,
                                      shadowRadius: 6,
                                      elevation: 4,
                                    }}
                                    className="flex-col"
                                  >
                                    <View>
                                      <Text className="font-semibold">
                                        {lesson.description}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text>
                                        {lesson.achievable_stars === 3
                                          ? "⭐⭐⭐"
                                          : "⭐⭐"}
                                      </Text>
                                    </View>
                                  </View>
                                )
                              )}
                            </View>
                          ) : (
                            <Text className="mx-4">
                              No data available for Station 2.
                            </Text>
                          )}
                        </View>
                      )}
                      {activeTab === "station3" && (
                        <View>
                          {classItem.sections && classItem.sections[2] ? (
                            <View>
                              {classItem.sections[2].lessons.map(
                                (lesson: any, lessonIndex: any) => (
                                  <View
                                    key={`lesson-${lessonIndex}`}
                                    style={{
                                      backgroundColor: "#fff",
                                      borderRadius: 10,
                                      paddingVertical: 16,
                                      paddingHorizontal: 8,
                                      marginVertical: 6,
                                      marginHorizontal: 12,
                                      shadowColor: "#000",
                                      shadowOffset: { width: 0, height: 2 },
                                      shadowOpacity: 0.1,
                                      shadowRadius: 6,
                                      elevation: 4,
                                    }}
                                    className="flex-col"
                                  >
                                    <View>
                                      <Text className="font-semibold">
                                        {lesson.description}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text>
                                        {lesson.achievable_stars === 3
                                          ? "⭐⭐⭐"
                                          : "⭐⭐"}
                                      </Text>
                                    </View>
                                  </View>
                                )
                              )}
                            </View>
                          ) : (
                            <Text className="mx-4">
                              No data available for Station 3.
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Toggle Button */}
                <TouchableOpacity
                  style={styles.arrowContainer}
                  onPress={() => handleToggleTab(tabKey)}
                >
                  {isTabOpen ? (
                    <MaterialIcons
                      name="keyboard-arrow-up"
                      size={20}
                      color="gray"
                    />
                  ) : (
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={20}
                      color="gray"
                    />
                  )}
                </TouchableOpacity>
              </View>
            );
          }
        )}

      {level === "level2" &&
        progression.levels[1].classes?.map(
          (classItem: any, classIndex: any) => {
            const tabKey = `${classIndex}`;
            const isTabOpen = openTabs[tabKey] || false;
            const activeTab = activetabs[tabKey] || "station1";

            return (
              <View key={tabKey} style={styles.card}>
                <View className="flex-row items-center justify-between">
                  <View style={{ paddingTop: 16, paddingHorizontal: 16 }}>
                    <Text style={styles.title}>Lessons:</Text>
                  </View>
                </View>

                <View
                  style={{ width: "95%" }}
                  className="flex-row justify-between"
                >
                  <View style={{ paddingHorizontal: 16 }}>
                    <Text style={styles.highlight}>{classItem.title}</Text>
                    <View className="flex-row items-center space-x-3">
                      <View className="flex-row items-center">
                        <Text style={styles.highlight}>
                          {` 0 / ${classItem.lessons_count}`}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text style={styles.highlight}>
                          {`⭐ ${classItem && classItem.achieved_stars} / ${
                            classItem.total_stars
                          }`}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View>
                    <Text>{classItem.percentage_completed}% </Text>
                  </View>
                </View>

                {/* Render sections and tabs only if the tab is open */}
                {isTabOpen && (
                  <View>
                    {/* Tabs */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 12,
                        paddingHorizontal: 20,
                      }}
                    >
                      {["station1", "station2", "station3"].map(
                        (station, index) => (
                          <View key={index}>
                            <Text
                              className={`text-[12px] ${
                                activeTab === station
                                  ? "text-black border-b-2"
                                  : "text-[#b0c1c8]"
                              } pb-1`}
                              onPress={() =>
                                setActiveTabs((prev) => ({
                                  ...prev,
                                  [tabKey]: station,
                                }))
                              }
                            >
                              {station.replace("station", "Station")}
                            </Text>
                          </View>
                        )
                      )}
                    </View>

                    {/* Active Station Content */}
                    <View style={{ padding: 4 }}>
                      {activeTab === "station1" && (
                        <View>
                          {classItem.sections && classItem.sections[0] ? (
                            <View>
                              {classItem.sections[0].lessons.map(
                                (lesson: any, lessonIndex: any) => (
                                  <View
                                    key={`lesson-${lessonIndex}`}
                                    style={{
                                      backgroundColor: "#fff",
                                      borderRadius: 10,
                                      paddingVertical: 16,
                                      paddingHorizontal: 8,
                                      marginVertical: 6,
                                      marginHorizontal: 12,
                                      shadowColor: "#000",
                                      shadowOffset: { width: 0, height: 2 },
                                      shadowOpacity: 0.1,
                                      shadowRadius: 6,
                                      elevation: 4,
                                    }}
                                    className="flex-col"
                                  >
                                    <View>
                                      <Text className="font-semibold">
                                        {lesson.description}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text>
                                        {lesson.achievable_stars === 3
                                          ? "⭐⭐⭐"
                                          : "⭐⭐"}
                                      </Text>
                                    </View>
                                  </View>
                                )
                              )}
                            </View>
                          ) : (
                            <Text>No data available for Station 1.</Text>
                          )}
                        </View>
                      )}
                      {activeTab === "station2" && (
                        <View>
                          {classItem.sections && classItem.sections[1] ? (
                            <View>
                              {classItem.sections[1].lessons.map(
                                (lesson: any, lessonIndex: any) => (
                                  <View
                                    key={`lesson-${lessonIndex}`}
                                    style={{
                                      backgroundColor: "#fff",
                                      borderRadius: 10,
                                      paddingVertical: 16,
                                      paddingHorizontal: 8,
                                      marginVertical: 6,
                                      marginHorizontal: 12,
                                      shadowColor: "#000",
                                      shadowOffset: { width: 0, height: 2 },
                                      shadowOpacity: 0.1,
                                      shadowRadius: 6,
                                      elevation: 4,
                                    }}
                                    className="flex-col"
                                  >
                                    <View>
                                      <Text className="font-semibold">
                                        {lesson.description}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text>
                                        {lesson.achievable_stars === 3
                                          ? "⭐⭐⭐"
                                          : "⭐⭐"}
                                      </Text>
                                    </View>
                                  </View>
                                )
                              )}
                            </View>
                          ) : (
                            <Text className="mx-4">
                              No data available for Station 2.
                            </Text>
                          )}
                        </View>
                      )}
                      {activeTab === "station3" && (
                        <View>
                          {classItem.sections && classItem.sections[2] ? (
                            <View>
                              {classItem.sections[2].lessons.map(
                                (lesson: any, lessonIndex: any) => (
                                  <View
                                    key={`lesson-${lessonIndex}`}
                                    style={{
                                      backgroundColor: "#fff",
                                      borderRadius: 10,
                                      paddingVertical: 16,
                                      paddingHorizontal: 8,
                                      marginVertical: 6,
                                      marginHorizontal: 12,
                                      shadowColor: "#000",
                                      shadowOffset: { width: 0, height: 2 },
                                      shadowOpacity: 0.1,
                                      shadowRadius: 6,
                                      elevation: 4,
                                    }}
                                    className="flex-col"
                                  >
                                    <View>
                                      <Text className="font-semibold">
                                        {lesson.description}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text>
                                        {lesson.achievable_stars === 3
                                          ? "⭐⭐⭐"
                                          : "⭐⭐"}
                                      </Text>
                                    </View>
                                  </View>
                                )
                              )}
                            </View>
                          ) : (
                            <Text className="mx-4">
                              No data available for Station 3.
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Toggle Button */}
                <TouchableOpacity
                  style={styles.arrowContainer}
                  onPress={() => handleToggleTab(tabKey)}
                >
                  {isTabOpen ? (
                    <MaterialIcons
                      name="keyboard-arrow-up"
                      size={20}
                      color="gray"
                    />
                  ) : (
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={20}
                      color="gray"
                    />
                  )}
                </TouchableOpacity>
              </View>
            );
          }
        )}
    </>
  );
};

export default CourseProgression;

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
    marginTop: 6,
  },
});
