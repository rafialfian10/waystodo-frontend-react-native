// axios
import axios from "axios";

// env
import { API_HOST } from "@env";
console.log("zzz", API_HOST);
// --------------------------------------------------

export const API = axios.create({
  baseURL: API_HOST,
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};
