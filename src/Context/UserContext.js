// components react native
import { createContext, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();
// -------------------------------------------------------

const initialState = {
  isLogin: false,
  user: {},
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "USER_SUCCESS":
    case "LOGIN_SUCCESS":
      return {
        isLogin: true,
        user: payload,
      };
    case "AUTH_ERROR":
    case "LOGOUT":
      return {
        isLogin: false,
        user: {},
      };
    default:
      throw new Error();
  }
};

// function userContextProvider berfungsi akses state secara global
export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

// status auth
// export const loginSuccess = (payload) => {
//   return {
//     type: "LOGIN_SUCCESS",
//     payload: payload,
//   };
// };

// export const authSuccess = (payload) => {
//   return {
//     type: "AUTH_SUCCESS",
//     payload: payload,
//   };
// };

// export const authError = () => {
//   return {
//     type: "AUTH_ERROR",
//   };
// };

// export const logout = () => {
//   return {
//     type: "LOGOUT",
//   };
// };

// token
// const storeToken = async (value) => {
//   try {
//     if (value) {
//       await AsyncStorage.setItem("token", value);
//       console.log("Store Token Done.");
//     } else {
//       console.warn("Cannot store undefined token.");
//     }
//   } catch (e) {
//     // saving error
//     console.error("Error storing token:", e);
//   }
// };

// const removeToken = async () => {
//   try {
//     await AsyncStorage.removeItem("token");
//     console.log("Remove Token Done.");
//   } catch (e) {
//     // remove error
//     console.error("Error removing token:", e);
//   }
// };
