import { Dimensions } from "react-native";
import { setAlert } from "../redux/utils";
import { Dispatch } from "@reduxjs/toolkit";

const { width, height } = Dimensions.get("window");

export const deviceWidth = width;
export const deviceHeight = height;

export const handleErrors = (err: any, dispatch: Dispatch) => {
  const response = err.response;
  switch (response?.status) {
    case 500:
      dispatch(
        setAlert({
          msg: response.data.message,
          type: "error",
        })
      );
      break;

    case 400:
    case 401:
    case 404:
    case 405:
    case 403:
    case 409:
    case 422:
      if (response.data.errors) {
        if (Array.isArray(response.data.errors)) {
          response.data.errors.forEach((each: any) => {
            dispatch(
              setAlert({
                msg: each.message ?? response.data.message,
                type: "error",
              })
            );
          });
        } else if (typeof response.data.errors === "object") {
          Object.keys(response.data.errors).forEach((field) => {
            const errors = response.data.errors[field];
            errors.forEach((errorMessage: any) => {
              dispatch(
                setAlert({
                  msg: errorMessage ?? response.data.message,
                  type: "error",
                })
              );
            });
          });
        }
      } else if (response.data.error) {
        dispatch(
          setAlert({
            msg: response.data.error,
            type: "error",
          })
        );
      } else {
        dispatch(
          setAlert({
            msg: response.data.message,
            type: "error",
          })
        );
      }
      break;

    default:
      dispatch(
        setAlert({
          msg: err.message,
          type: "error",
        })
      );
      break;
  }
};

export const colors = {
  faded: "#EAF4F4",
  theme: "#4F2EC9",
  gray_bg: "#F9F9F9",
  input_border_gray: "#D7D7D7",
  secondary: "#5B5F5F",
  theme_black: "#121212",
  label: "#9F9F9F",
  theme_orange: "#FEAE24",
  page_title: "#435712",
  danger: "#EE4A52",
  merchant_green: "#2A8385",
  merchant_lime: "#BFDE72",
  theme_purple: "#7B21A5",
  faded_orange: "#FFF3DD",
  white: "#ffffff",
};

export const serviceType = [
  { value: "King", label: "King" },
  { value: "Queen", label: "King" },
];
