import axios from "axios";
import { baseUrl } from "../../helper/baseurl";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM3ODkxMDEzLCJpYXQiOjE3Mzc4ODc0MTMsImp0aSI6Ijc2MTMyNjk5ZDVmZjQ1MzliNTljNTNlZDc1MjJiNmRlIiwidXNlcl9pZCI6Mn0.JDa6THobwdy-yueny5vj-kt-Bx1nNxomrnhr1mUAjZc";
export const getProgression = async () => {
  try {
    const response = await axios.get(`${baseUrl.progress}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e);
    console.error("Error fetching progression data");
    return null;
  }
};

export const getActionMetrics = async () => {
  try {
    const request = await axios.get(`${baseUrl.actionMetrics}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (request.status === 200) {
      return request.data;
    } else {
      console.log(request.data);
    }
  } catch (error) {
    console.log(error);
    console.error("Error fetching action metrics");
    return null;
  }
};

export const getTimeMetrics = async () => {
  try {
    const request = await axios.get(`${baseUrl.timeMetrics}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (request.status === 200) {
      return request.data;
    } else {
      console.log(request.data);
    }
  } catch (error) {
    console.log(error);
    console.error("Error fetching action metrics");
    return null;
  }
};
import { Dispatch } from "@reduxjs/toolkit";
import { handleErrors } from "../../helper/helpers";
import { setProgress } from "./index";

// export const getProgression =
//   (course_id: string) => async (dispatch: Dispatch) => {
//     try {
//       const response = await axios.get(`${baseUrl.progress}/${course_id}/`);

//       dispatch(setProgress(response.data.data));
//     } catch (err) {
//       console.log(err, "err from getSingleLogisticsOrder");
//       handleErrors(err, dispatch);
//     }
//   };
