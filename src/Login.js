// components react native
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// components native base
// import { Text, Image } from 'native-base';

// components
import { UserContext } from "./Context/UserContext";

// api
import { API, setAuthToken } from "./Config/api";
// ------------------------------------------------------------

const Login = ({ navigation }) => {
  const [state, dispatch] = useContext(UserContext);

  // state form
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // state error
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  // handle change
  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const messageError = {
        email: "",
        password: "",
      };

      if (form.email === "") {
        messageError.email = "Email must be filled out";
      } else {
        messageError.email = "";
      }

      if (form.password === "") {
        messageError.password = "Password must be filled out";
      } else {
        messageError.password = "";
      }

      if (messageError.email === "" && messageError.password === "") {
        const body = JSON.stringify(form);

        const response = await API.post("/login", body, config);

        if (response.data.status === 200) {
          if (response.data.data.token) {
            await AsyncStorage.setItem("token", response.data.data.token);
            setAuthToken(response.data.data.token);
          }
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: response.data.data,
          });
          alert("Login successfully");
        } 
      } else {
        setError(messageError);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed (unexpected error)");
    }
  };
  return (
    <SafeAreaView>
      <Image
        source={require("../assets/login.png")}
        style={styles.imageLogin}
        alt="login"
      />
      <Text style={styles.titleLogin}>Login</Text>
      <TextInput
        style={styles.textInputLogin}
        placeholder="Email"
        onChangeText={(value) => handleChange("email", value)}
        value={form.email}
      />
       {error.email && (
        <Text style={{ width: "75%", alignSelf: "center", color: "red" }}>
          {error.email}
        </Text>
      )}
      <TextInput
        style={styles.textInputLogin}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(value) => handleChange("password", value)}
        value={form.password}
      />
       {error.password && (
        <Text style={{ width: "75%", alignSelf: "center", color: "red" }}>
          {error.password}
        </Text>
      )}
      <TouchableOpacity style={styles.buttonLogin}>
        <Text style={styles.textBtnLogin} onPress={handleSubmit}>
          Login
        </Text>
      </TouchableOpacity>
      <Text style={styles.textLogin}>
        New Users?
        <Text
          onPress={() => navigation.navigate("Register")}
          style={styles.linkLogin}
        > Register
        </Text>
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageLogin: {
    justifyContent: "center",
    marginTop: 100,
    marginBottom: 70,
    alignSelf: "center",
  },
  titleLogin: {
    paddingHorizontal: 40,
    paddingVertical: 5,
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textInputLogin: {
    alignSelf: "center",
    width: 300,
    height: 50,
    backgroundColor: "#dcdcdc",
    borderRadius: 5,
    paddingLeft: 20,
    marginBottom: 10,
    justifyContent: "center",
  },
  buttonLogin: {
    alignSelf: "center",
    backgroundColor: "#FF5555",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: 300,
    height: 50,
    marginBottom: 10,
  },
  textBtnLogin: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
  },
  textLogin: {
    textAlign: "center",
  },
  linkLogin: {
    color: "#FF5555",
    fontWeight: "800",
  },
});

export default Login;
