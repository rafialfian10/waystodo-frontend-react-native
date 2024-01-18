// components react
import { useState, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// component native base
import { Box } from "native-base";

// components
import { UserContext } from "../../Context/UserContext";

// api
import { API, setAuthToken } from "../../Config/api";
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

  // state show password
  const [showPassword, setShowPassword] = useState(false);

  // handle toggle password
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // handle change
  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });

    if (data === "email") {
      setError((prevError) => ({
        ...prevError,
        email: value.trim() === "" ? "Email is required" : "",
      }));
    }

    if (data === "password") {
      setError((prevError) => ({
        ...prevError,
        password: value.trim() === "" ? "Password is required" : "",
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const messageError = {
        email: form.email === "" ? "Email is required" : "",
        password: form.password === "" ? "Password is required" : "",
      };

      if (!messageError.email && !messageError.password) {
        const body = JSON.stringify(form);

        try {
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
        } catch (error) {
          if (error.response && error.response.status === 400) {
            alert(error.response.data.message);
          } else {
            throw error;
          }
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
    <SafeAreaView style={styles.containerLogin}>
      <ScrollView>
        <Box style={styles.contentLogin}>
          <Image
            source={require("../../../assets/login.png")}
            style={styles.imageLogin}
            alt="login"
          />
          <Text style={styles.titleLogin}>Login</Text>
          <Box style={styles.contentTextInputLogin}>
            <TextInput
              style={styles.textInputLogin}
              placeholder="Email"
              onChangeText={(value) => handleChange("email", value)}
              value={form.email}
            />
            {error.email && (
              <Text style={styles.errorLogin}>{error.email}</Text>
            )}
          </Box>
          <Box style={styles.contentTextInputLogin}>
            <TextInput
              style={styles.textInputLogin}
              secureTextEntry={!showPassword}
              placeholder="Password"
              onChangeText={(value) => handleChange("password", value)}
              value={form.password}
            />
            <TouchableOpacity
              style={styles.togglePasswordButton}
              onPress={handleTogglePassword}
            >
              <Ionicons
                name={showPassword ? "md-eye" : "md-eye-off"}
                size={20}
                color="black"
              />
            </TouchableOpacity>
            {error.password && (
              <Text style={styles.errorLogin}>{error.password}</Text>
            )}
          </Box>
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
            >
              {" "}
              Register
            </Text>
          </Text>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerLogin: {
    flex: 1,
  },
  contentLogin: {
    width: "100%",
    marginBottom: 30,
    alignSelf: "center",
    backgroundColor: "whitesmoke",
  },
  imageLogin: {
    marginTop: 50,
    marginBottom: 50,
    justifyContent: "center",
    alignSelf: "center",
  },
  titleLogin: {
    width: "80%",
    marginBottom: 20,
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "800",
  },
  contentTextInputLogin: {
    width: " 80%",
    alignSelf: "center",
  },
  textInputLogin: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#DCDCDC",
  },
  togglePasswordButton: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  errorLogin: {
    width: "100%",
    marginBottom: 15,
    alignSelf: "center",
    fontSize: 11,
    color: "red",
  },
  buttonLogin: {
    width: "80%",
    height: 50,
    marginVertical: 20,
    alignSelf: "center",
    borderRadius: 5,
    backgroundColor: "#FF5555",
  },
  textBtnLogin: {
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "800",
    color: "white",
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
