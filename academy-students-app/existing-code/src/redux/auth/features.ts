import axios from "axios";
import { Dispatch } from "@reduxjs/toolkit";
import { handleErrors } from "../../helper/helpers";
import { baseUrl } from "../../helper/baseurl";
import { setAlert } from "../utils";
import { setUser } from ".";

export const generateCode =
  (data: { email: string }) => async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(
        `${baseUrl.auth}/forgot-password`,
        data
      );
      dispatch(
        setAlert({
          msg: response.data.message,
          type: "success",
        })
      );
      return true;
    } catch (err) {
      handleErrors(err, dispatch);
      return false;
    }
  };

export const getUserProfile = () => async (dispatch: Dispatch) => {
  try {
    const url = `${baseUrl.profile}`; // Construct the URL
    console.log("Fetching user profile from: ", url); // Log the URL
    const response = await axios.get(url);
    console.log("User profile response: ", response);
    dispatch(setUser(response.data));
  } catch (err: any) {
    console.error("Error fetching user profile: ", err);
    handleErrors(err, dispatch);
  }
};

export const updateUserProfile =
  (data: {
    full_name: string;
    // email: string;
    location: string;
    tech_skills: string;
    bio: string;
    visa_of_interest: string;
  }) =>
  async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${baseUrl.profile}`, data);
      console.log("UpdateUser profile response: ", response.data);
      dispatch(
        setAlert({
          msg: response.data.message,
          type: "success",
        })
      );
      return true;
    } catch (err: any) {
      console.error("Error updating user profile: ", err);
      if (err.response) {
        console.error("Response data: ", err.response.data);
        console.error("Response status: ", err.response.status);
        console.error("Response headers: ", err.response.headers);
      } else if (err.request) {
        console.error("Request data: ", err.request);
      } else {
        console.error("Error message: ", err.message);
      }
      handleErrors(err, dispatch);
      return false;
    }
  };

//   export const updatePassword =
//   (data: {
//     current_password: string;
//     new_password: string;
//     new_password_confirmation: string;
//   }) =>
//   async (dispatch: Dispatch) => {
//     try {
//       const response = await axios.post(
//         `${baseUrl.password}`,
//         data
//       );
//       dispatch(
//         setAlert({
//           msg: response.data.message,
//           type: "success",
//         })
//       );
//       return true;
//     } catch (err: any) {
//       handleErrors(err, dispatch);
//       return false;
//     }
//   };
