import { View } from "react-native";
import SelectOptions from "./reuseable/SelectOptions";

const ScheduleType = () => {
  const options = {
    session: ["Group", "Private"],
    skill: ["Beginner", "Intermediate", "Advanced", "Swim Team"],
    schedule: ["One Time", "Recurring"],
  };

  return (
    <View className="z-50">
      {/* Session Type */}
      <SelectOptions title="Session Type" options={options.session} />

      {/* Skill Level */}
      <SelectOptions title="Skill Level" options={options.skill} />

      {/* Schedule Type */}
      <SelectOptions title="Schedule Type" options={options.schedule} />
    </View>
  );
};

export default ScheduleType;
