import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { EvilIcons } from "@expo/vector-icons";
import { useState } from "react";

const { width, height } = Dimensions.get("window");
const ScheduleInput = () => {
  const [classTitle, setClassTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  return (
    <View className="space-y-4">
      {/* Class Title Input */}
      <View>
        <Text className="text-sm text-gray-600">Class Title</Text>
        <TextInput
          className="text-xs text-gray-600 w-full bg-gray-200 py-3 px-2 rounded-md"
          placeholder="Enter class title"
          value={classTitle}
          onChangeText={setClassTitle}
        />
      </View>

      {/* Date Picker */}
      <View>
        <Text className="text-sm text-gray-600">Select Date</Text>
        <TouchableOpacity
          className="flex flex-row justify-between bg-gray-200 py-3 px-2 rounded-md"
          onPress={() => setShowDatePicker(true)}
        >
          <Text className="text-xs text-gray-600">{date.toDateString()}</Text>
          <EvilIcons name="calendar" size={24} color="black" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
      </View>

      {/* Time Picker */}
      <View>
        <Text className="text-sm text-gray-600">Set Time</Text>
        <View className="flex flex-row items-center justify-between">
          <TouchableOpacity
            style={{
              width: width * 0.35,
            }}
            className="bg-gray-200 py-3 px-6 rounded-md"
            onPress={() => setShowStartPicker(true)}
          >
            <Text className="text-xs text-center text-gray-600">
              {startTime
                ? startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Start Time"}
            </Text>
          </TouchableOpacity>

          <Text className="px-4">To</Text>

          <TouchableOpacity
            style={{
              width: width * 0.35,
            }}
            className="bg-gray-200 py-3 px-6 rounded-md"
            onPress={() => setShowEndPicker(true)}
          >
            <Text className="text-xs text-center text-gray-600">
              {endTime
                ? endTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "End Time"}
            </Text>
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowStartPicker(false);
              if (selectedTime) setStartTime(selectedTime);
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowEndPicker(false);
              if (selectedTime) setEndTime(selectedTime);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default ScheduleInput;
