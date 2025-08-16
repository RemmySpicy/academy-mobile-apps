import { StyleSheet, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import { baseUrl } from "../../helper/baseurl";
import { useEffect, useState } from "react";

const Course = ({ navigation }: any) => {
  const [courseList, setCourseList] = useState([]);
  const getCourses = async () => {
    try {
      const request = await axios.get(baseUrl.course);
      if (request.status === 200) {
        setCourseList(request.data);
      } else {
        console.log(request.data);
      }
    } catch (error) {
      console.log(error);
      console.log("Error fetching courses: ", error);
    }
  };

  console.log(courseList);

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <View className="m-10">
      <TouchableOpacity onPress={() => navigation?.navigate("Profile")}>
        <AntDesign name="back" size={24} color="black" />
      </TouchableOpacity>
      <Text className="mx-auto font-bold">Course</Text>

      <View>
        {courseList && (
          <FlatList
            data={courseList}
            keyExtractor={(item: any) => item.levels}
            renderItem={({ item }: any) => (
              <View>
                <Text>{item?.age_range}</Text>
                <Text>{item?.class_duration}</Text>
                <Text>{item?.course_length}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Course;

const styles = StyleSheet.create({});
