import { MaterialIcons } from "@expo/vector-icons";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { selectIsLoading, setProgress } from "../../redux/progression";
import {
  getActionMetrics,
  getProgression,
} from "../../redux/progression/features";
import { useAppDispatch } from "../../redux/store";
import CourseProgression from "./components/CourseProgression";
import {
  MetricPoolRender,
  MetricsTime,
  ScoreStatistics,
} from "./components/MetricPoolRender";

interface variables {
  variants: string;
}

export default function Progression() {
  const [lesson, setLesson] = useState("firstLesson");
  const [level, setLevel] = useState("level1");
  const [progression, setProgression] = useState<any>(null);
  const [courseActionMetrics, setCourseActionMetrics] = useState<any>();
  const [courseTimeMetrics, setCourseTimeMetrics] = useState<any>();
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useAppDispatch();

  const handleActiveLesson = (lesson: string) => {
    setLesson(lesson);
  };
  const handleActiveLevel = (level: string) => {
    setLevel(level);
  };

  const courseProgress = async () => {
    try {
      dispatch(setProgress(true));
      const request = await getProgression();
      setProgression(request);
    } catch (error) {
      console.error("Error fetching progression:", error);
    } finally {
      dispatch(setProgress(false));
    }
  };

  const getCourseActionMetrics = async () => {
    try {
      const request = await getActionMetrics();
      if (request) {
        setCourseActionMetrics(request);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getCourseTimeMetrics = async () => {
    try {
      const request = await getActionMetrics();
      if (request) {
        setCourseTimeMetrics(request);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    courseProgress();
    getCourseActionMetrics();
    getCourseTimeMetrics();
  }, []);

  return (
    <SafeAreaView style={{ marginTop: 60, marginBottom: 5, flex: 1 }}>
      <ExpoStatusBar style="dark" />
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            borderBottomColor: "#E6EBEC",
            borderBottomWidth: 1,
            paddingVertical: 15,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 25, color: "#1E1E1E" }}>
            Your Progression
          </Text>
          <MaterialIcons name="filter-list" size={24} color="#596367" />
        </View>

        <View style={{ margin: 24 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", color: "#7f7f7f" }}>
            Swimming Course
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 5 }}
          >
            <TouchableOpacity
              onPress={() => {
                handleActiveLesson("firstLesson");
                handleActiveLevel("level1");
              }}
              style={[
                styles.tabContainer,
                level === "level1" ? styles.activeTab : styles.inActiveTab,
                styles.neut,
              ]}
            >
              <Text
                style={[
                  styles.textStyle,
                  level === "level1" ? styles.activeText : styles.inActiveText,
                ]}
              >
                Level 1
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleActiveLesson("secondLesson");
                handleActiveLevel("level2");
              }}
              style={[
                styles.tabContainer,
                level === "level2" ? styles.activeTab : styles.inActiveTab,
              ]}
            >
              <Text
                style={[
                  styles.textStyle,
                  level === "level2" ? styles.activeText : styles.inActiveText,
                ]}
              >
                Level 2
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleActiveLesson("thirdLesson");
                handleActiveLevel("level3");
              }}
              style={[
                styles.tabContainer,
                level === "level3" ? styles.activeTab : styles.inActiveTab,
              ]}
            >
              <Text
                style={[
                  styles.textStyle,
                  level === "level3" ? styles.activeText : styles.inActiveText,
                ]}
              >
                Level 3
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tabContainer, styles.inActiveTab]}>
              <Text style={[styles.textStyle, styles.inActiveText]}>
                Level 4
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {lesson && (
            <CourseProgression level={level} progression={progression} />
          )}

          <MetricPoolRender courseActionMetrics={courseActionMetrics} />
          <MetricsTime courseTimeMetrics={courseTimeMetrics} />
          <ScoreStatistics />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    width: 88,
    height: 41,
    marginTop: 18,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  neut: {
    marginLeft: 0,
  },
  activeTab: {
    backgroundColor: "#4F2EC9",
  },

  inActiveTab: {
    backgroundColor: "#E6EBEC",
  },

  textStyle: {
    fontSize: 14,
    padding: 10,
  },

  activeText: {
    color: "#FFFFFF",
  },

  inActiveText: {
    color: "#596367",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
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
    fontSize: 14,
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
    alignItems: "center",
    marginLeft: "auto",
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
    marginTop: 16,
    borderTopColor: "#E6EBEC",
    borderTopWidth: 1,
  },
});
