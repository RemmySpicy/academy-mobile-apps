import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useResponsiveDimensions } from "../../../hooks/useResponsiveDimensions";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface Phase {
  id: string;
  name: string;
  progress: number;
  color: string;
}

interface User {
  name: string;
  avatar: string;
}

interface WorkoutProps {
  workout: {
    id: string;
    title: string;
    user: User;
    phases: Phase[];
  };
}

const WorkoutCard: React.FC<WorkoutProps> = ({ workout }) => {
  const workouts = [
    {
      id: "1",
      title: "Freestyle 1 x 3",
      user: {
        name: "Roman Shvets",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      phases: [
        { id: "1", name: "Phase 1", progress: 100, color: "#4CD964" },
        { id: "2", name: "Phase 2", progress: 100, color: "#4CD964" },
        { id: "3", name: "Phase 3", progress: 100, color: "#4CD964" },
      ],
    },
    {
      id: "2",
      title: "Freestyle 1 x 3",
      user: {
        name: "Roman Shvets",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      phases: [
        { id: "1", name: "Phase 1", progress: 100, color: "#4CD964" },
        { id: "2", name: "Phase 2", progress: 50, color: "#FFCC00" },
        { id: "3", name: "Phase 3", progress: 0, color: "#EEEEEE" },
      ],
    },
    {
      id: "3",
      title: "Freestyle 1 x 3",
      user: {
        name: "Roman Shvets",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      phases: [
        { id: "1", name: "Phase 1", progress: 100, color: "#4CD964" },
        { id: "2", name: "Phase 2", progress: 0, color: "#EEEEEE" },
        { id: "3", name: "Phase 3", progress: 0, color: "#EEEEEE" },
      ],
    },
  ];

  const { width } = useResponsiveDimensions();
  const [expanded, setExpanded] = useState(false);
  const cardWidth = width > 768 ? 600 : width - 16; // Responsive width

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  // Calculate the status label based on phases completion
  const getStatusLabel = () => {
    const completedPhases = workout.phases.filter(
      (phase) => phase.progress === 100
    ).length;
    const totalPhases = workout.phases.length;

    if (completedPhases === totalPhases) {
      return "Completed";
    } else if (completedPhases === 0) {
      return "Not started";
    } else {
      return `${completedPhases}/${totalPhases} completed`;
    }
  };

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.userInfo}>
          <Image source={{ uri: workout.user.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{workout.user.name}</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{getStatusLabel()}</Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#999"
          />
        </View>
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        {workout.phases.map((phase, index) => (
          <View key={phase.id} style={styles.phaseContainer}>
            <View style={styles.phaseInfo}>
              <View style={styles.phaseLabel}>
                <Text style={styles.phaseLabelText}>{phase.name}</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${phase.progress}%`,
                    backgroundColor: phase.color,
                  },
                ]}
              />
            </View>

            <Text style={styles.progressText}>{phase.progress}%</Text>
          </View>
        ))}
      </View>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.expandedTitle}>Additional Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Started:</Text>
            <Text style={styles.detailValue}>May 15, 2023</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last activity:</Text>
            <Text style={styles.detailValue}>June 2, 2023</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total time:</Text>
            <Text style={styles.detailValue}>3h 45m</Text>
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 8,
    marginVertical: 6,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    color: "#999",
    marginRight: 8,
  },
  progressContainer: {
    padding: 16,
  },
  phaseContainer: {
    marginBottom: 12,
  },
  phaseInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  phaseLabel: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  phaseLabelText: {
    fontSize: 12,
    color: "#666",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  expandedContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  actionButton: {
    backgroundColor: "#4CD964",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 12,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default WorkoutCard;
