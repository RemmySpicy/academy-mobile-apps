import type React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { CalendarFilter } from "../../../helper/types";

type FilterBarProps = {
  filters?: CalendarFilter[];
  onFilterPress?: (filterId: string) => void;
  label?: string;
};

const FilterBar: React.FC<FilterBarProps> = ({
  filters = [],
  onFilterPress,
  label = "Views",
}) => {
  // Map icon names to Ionicons
  const getIconForFilter = (filter: CalendarFilter) => {
    if (filter.icon) return filter.icon;

    switch (filter.id) {
      case "group":
        return "people";
      case "all":
        return "eye";
      case "search":
        return "search";
      default:
        return "options";
    }
  };

  return (
    <View style={styles.filtersContainer}>
      <Text style={styles.filtersLabel}>{label}</Text>
      <View style={styles.filtersRow}>
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButton,
              filter.active && styles.activeFilterButton,
              filter.id === "search" && styles.searchButton,
            ]}
            onPress={() => onFilterPress && onFilterPress(filter.id)}
          >
            <Ionicons
              name={getIconForFilter(filter) as any}
              size={16}
              color="#6C5CE7"
              style={styles.filterIcon}
            />
            <Text
              style={[
                styles.filterText,
                filter.active && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    marginBottom: 16,
  },
  filtersLabel: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: "#EAE8FD",
  },
  searchButton: {
    paddingHorizontal: 12,
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    color: "#555",
  },
  activeFilterText: {
    color: "#6C5CE7",
    fontWeight: "500",
  },
});

export default FilterBar;
