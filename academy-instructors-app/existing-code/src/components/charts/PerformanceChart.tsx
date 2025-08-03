import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

import { View, Text, Dimensions } from "react-native";
import React from "react";

const PerformanceChart = () => {
  return (
    <View>
      <View>
        <LineChart
          data={{
            labels: ["", "", "", "", "", ""],
            datasets: [
              {
                data: [
                  //   Math.random() * 100,
                  //   Math.random() * 100,
                  //   Math.random() * 100,
                  //   Math.random() * 100,
                  //   Math.random() * 100,
                  //   Math.random() * 100,
                  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60,
                ],
              },
            ],
          }}
          //   width={Dimensions.get("window").width} // from react-native
          width={Dimensions.get("window").width - 40} // Adjusting for padding
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#8A74DB",
            backgroundGradientFrom: "#f5f5f5",
            backgroundGradientTo: "#f5f5f5",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(143, 143, 143, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(143, 143, 143, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "2",
              strokeWidth: "2",
              stroke: "#8A74DB",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
};

export default PerformanceChart;

//

// import React from "react";
// import { View, Text, Dimensions } from "react-native";
// import { LineChart } from "react-native-chart-kit";

// const PerformanceChart = () => {
//   return (
//     <View>
//       <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
//         MT Performance
//       </Text>
//       <LineChart
//         data={{
//           labels: [
//             "1",
//             "2",
//             "3",
//             "4",
//             "5",
//             "6",
//             "7",
//             "8",
//             "9",
//             "10",
//             "11",
//             "12",
//           ],
//           datasets: [
//             {
//               data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
//               color: (opacity = 1) => `rgba(138, 43, 226, ${opacity})`, // Purple color
//               strokeWidth: 3,
//             },
//           ],
//         }}
//         width={Dimensions.get("window").width - 20} // Adjusting for padding
//         height={250}
//         yAxisLabel=""
//         yAxisSuffix=""
//         chartConfig={{
//           backgroundGradientFrom: "#f5f5f5",
//           backgroundGradientTo: "#f5f5f5",
//           decimalPlaces: 0,
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           style: {
//             borderRadius: 10,
//           },
//           propsForDots: {
//             r: "5",
//             strokeWidth: "2",
//             stroke: "#8A2BE2", // Purple stroke
//           },
//         }}
//         bezier
//         style={{
//           marginVertical: 8,
//           borderRadius: 10,
//         }}
//       />
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-between",
//           paddingHorizontal: 20,
//           marginTop: 10,
//         }}
//       >
//         <Text>Your Goal: 00:26.30</Text>
//         <Text style={{ color: "red" }}>Missed by: +00:26.30</Text>
//       </View>
//     </View>
//   );
// };

// export default PerformanceChart;

//
