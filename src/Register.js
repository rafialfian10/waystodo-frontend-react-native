// componenets react native
import { useState } from "react";
import validator from "validator";
import {
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  ScrollView,
} from "react-native";

// components native base
import { Box } from "native-base";

// api
import { API } from "./Config/api";
// ------------------------------------------

const Register = ({ navigation }) => {
  // state form
  const [form, setForm] = useState({
    user_name: "",
    email: "",
    password: "",
  });

  // state error
  const [error, setError] = useState({
    userName: "",
    email: "",
    password: "",
  });

  // handle change
  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });

    if (data === "user_name") {
      setError((prevError) => ({
        ...prevError,
        userName: value.trim() === "" ? "Username is required" : "",
      }));
    }

    if (data === "email") {
      if (value.trim() === "") {
        setError((prevError) => ({
          ...prevError,
          email: "Email is required",
        }));
      } else if (!validator.isEmail(value)) {
        setError((prevError) => ({
          ...prevError,
          email: "Please enter a valid email address",
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          email: "",
        }));
      }
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
          "Content-type": "application/json",
        },
      };

      const messageError = {
        userName: form.user_name === "" ? "Username is required" : "",
        email: form.email === "" ? "Email is required" : "",
        password: form.password === "" ? "Password is required" : "",
      };

      if (
        !messageError.userName &&
        !messageError.email &&
        !messageError.password
      ) {
        const body = JSON.stringify(form);

        try {
          const response = await API.post("/register", body, config);
          if (response?.data?.status === 200) {
            alert("Register successfully");
            navigation.navigate("Login");
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
      console.log(err);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.contentRegister}>
          <Image
            source={require("../assets/login.png")}
            style={styles.imageRegister}
            alt="register"
          />
          <Text style={styles.titleRegister}>Register</Text>

          <Box style={styles.contentTextInputRegister}>
            <TextInput
              style={styles.textInputRegister}
              placeholder="Email"
              onChangeText={(value) => handleChange("email", value)}
              value={form.email}
            />
            {error.email && (
              <Text style={styles.errorRegister}>{error.email}</Text>
            )}
          </Box>
          <Box style={styles.contentTextInputRegister}>
            <TextInput
              style={styles.textInputRegister}
              placeholder="Username"
              onChangeText={(value) => handleChange("user_name", value)}
              value={form.user_name}
            />
            {error.userName && (
              <Text style={styles.errorRegister}>{error.userName}</Text>
            )}
          </Box>
          <Box style={styles.contentTextInputRegister}>
            <TextInput
              style={styles.textInputRegister}
              secureTextEntry={true}
              placeholder="Password"
              onChangeText={(value) => handleChange("password", value)}
              value={form.password}
            />
            {error.password && (
              <Text style={styles.errorRegister}>{error.password}</Text>
            )}
          </Box>
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.buttonRegister}
          >
            <Text style={styles.textBtnRegister}>Register</Text>
          </TouchableOpacity>
          <Text style={styles.textRegister}>
            Joined us before?
            <Text
              onPress={() => navigation.navigate("Login")}
              style={styles.linkRegister}
            >
              {" "}
              Login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentRegister: {
    width: "100%",
    alignSelf: "center",
  },
  imageRegister: {
    marginTop: 100,
    marginBottom: 50,
    justifyContent: "center",
    alignSelf: "center",
  },
  titleRegister: {
    width: "80%",
    marginBottom: 20,
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "800",
  },
  contentTextInputRegister: {
    width: " 80%",
    alignSelf: "center",
  },
  textInputRegister: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#dcdcdc",
  },
  errorRegister: {
    width: "100%",
    marginBottom: 15,
    alignSelf: "center",
    fontSize: 11,
    color: "red",
  },
  buttonRegister: {
    width: "80%",
    height: 50,
    marginVertical: 20,
    alignSelf: "center",
    borderRadius: 5,
    backgroundColor: "#FF5555",
  },
  textBtnRegister: {
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "800",
    color: "white",
  },
  textRegister: {
    textAlign: "center",
  },
  linkRegister: {
    color: "#FF5555",
    fontWeight: "800",
  },
});

export default Register;
