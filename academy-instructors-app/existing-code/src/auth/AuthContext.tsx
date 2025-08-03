import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import setAuthToken from "./setAuthToken";
import { refreshAuthToken } from "./setAuthToken";

import { handleErrors } from "../helper/helpers";
import { useAppDispatch } from "../redux/store";
import { setAlert } from "../redux/utils";
import React from "react";
import { TOKEN_KEY, baseUrl } from "../helper/baseurl";
import { setUser } from "../redux/auth";

interface RegisterData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  gender: string;
  parent_email: string;
  date_of_birth: string;
  password: boolean;
  confirm_password: boolean;
  user_type: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface VerifyData {
  email: string;
}

interface ForgetData {
  email: string;
}

interface ResetData {
  password: string;
}

interface AuthProps {
  authState: {
    isAuthenticated: boolean;
    token: string | null;
  } | null;
  register: (data: RegisterData) => Promise<boolean>;
  logIn: (data: LoginData) => Promise<boolean>;
  verify: (data: VerifyData) => Promise<boolean>;
  forget: (data: ForgetData) => Promise<boolean>;
  reset: (data: ResetData) => Promise<boolean>;
  logOut?: () => void;
}

const AuthContext = createContext<AuthProps>({
  register: async () => false,
  logIn: async () => false,
  verify: async () => false,
  forget: async () => false,
  reset: async () => false,
  authState: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const dispatch = useAppDispatch();
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    token: string | null;
  } | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        setAuthToken(token);
        setAuthState({
          isAuthenticated: true,
          token,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          token: null,
        });
      }
    };

    loadToken();
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAuthToken();

            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            onLogOut();
            throw refreshError;
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const onRegister = async (data: RegisterData) => {
    try {
      console.log("Registration data: ", data);

      const response = await axios.post(`${baseUrl.base}/register/`, data);

      console.log("Registration response: ", response);

      dispatch(
        setAlert({
          msg: "Registration Successful! Please log in.",
          type: "success",
        })
      );

      return true;
    } catch (err) {
      console.log("Registration Error:", err); // Log the error
      if (axios.isAxiosError(err)) {
        console.log("Axios Error Details:", {
          message: err.message,
          response: err.response,
          config: err.config,
        });
      }
      handleErrors(err, dispatch);
      return false;
    }
  };

  const onLogIn = async (data: LoginData) => {
    let response;
    try {
      console.log("Login data: ", data);
      response = await axios.post(`${baseUrl.base}/login/`, data);

      const { access, refresh } = response.data;
      console.log("Access Token: ", access);
      console.log("Refresh Token: ", refresh);

      setAuthState({
        isAuthenticated: true,
        token: access,
      });

      await SecureStore.setItemAsync(TOKEN_KEY, access);
      await AsyncStorage.setItem(`${TOKEN_KEY}_refresh`, refresh);

      setAuthToken(access);

      dispatch(
        setAlert({
          msg: "Login Successful",
          type: "success",
        })
      );

      return true;
    } catch (err) {
      console.log("Login Error:", err);
      if (axios.isAxiosError(err)) {
        console.log("Axios Error Details:", {
          message: err.message,
          response: err.response,
          config: err.config,
        });
      }
      handleErrors(err, dispatch);
      return false;
    }
  };

  const onVerify = async (data: VerifyData) => {
    try {
      const response = await axios.post(`${baseUrl.auth}/verify-email`, data);

      dispatch(
        setAlert({
          msg: "Email successfully verified",
          type: "success",
        })
      );

      return true;
    } catch (err) {
      handleErrors(err, dispatch);
      return false;
    }
  };

  const onReset = async (data: ResetData) => {
    try {
      const response = await axios.post(`${baseUrl.auth}/reset-password`, data);
      dispatch(
        setAlert({
          msg: "Password has been reset successfully!.",
          type: "success",
        })
      );

      return true;
    } catch (err) {
      handleErrors(err, dispatch);
      return false;
    }
  };

  const onForget = async (data: ForgetData) => {
    try {
      const response = await axios.post(
        `${baseUrl.auth}/forgot-password`,
        data
      );

      dispatch(
        setAlert({
          msg: "Password reset otp send",
          type: "success",
        })
      );

      return true;
    } catch (err) {
      handleErrors(err, dispatch);
      return false;
    }
  };

  const onLogOut = async () => {
    try {
        // Clear the access token from SecureStore
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        console.log("Access token cleared from SecureStore.");

        // Clear both access and refresh tokens from AsyncStorage
        await AsyncStorage.multiRemove([`${TOKEN_KEY}_access`, `${TOKEN_KEY}_refresh`]);
        console.log("Access and refresh tokens cleared from AsyncStorage.");

        // Remove the auth token from axios headers
        setAuthToken(null);
        console.log("Authorization header removed from axios.");

        // Clear user data from Redux
        dispatch(setUser(null));
        console.log("User data cleared from Redux.");

        // Update the authentication state
        setAuthState({
            isAuthenticated: false,
            token: null,
        });
        console.log("Auth state updated to unauthenticated.");

        // Navigate to the login screen
        // Assuming you have a navigation prop or hook available
        // navigation.navigate('Login'); // Uncomment and adjust this line based on your navigation setup

    } catch (error) {
        console.error("Error during logout:", error);
    }
  };

  const value = {
    register: onRegister,
    logIn: onLogIn,
    logOut: onLogOut,
    verify: onVerify,
    forget: onForget,
    reset: onReset,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
