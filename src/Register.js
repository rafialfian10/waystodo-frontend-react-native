// componenets react native
import { useState } from "react";
import {
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

// components native base
// import { Text, Image } from "native-base";

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
          "Content-type": "application/json",
        },
      };

      const messageError = {
        userName: "",
        email: "",
        password: "",
      };

      if (form.user_name === "") {
        messageError.userName = "Username must be filled out";
      } else {
        messageError.userName = "";
      }

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

      if (
        messageError.userName === "" &&
        messageError.email === "" &&
        messageError.password === ""
      ) {
        const body = JSON.stringify(form);

        try {
          const response = await API.post("/register", body, config);
          console.log(response.data);
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
      <Image
        source={require("../assets/login.png")}
        style={styles.imageRegister}
        alt="register"
      />
      <Text style={styles.titleRegister}>Register</Text>
      <TextInput
        style={styles.textInputRegister}
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
        style={styles.textInputRegister}
        placeholder="Username"
        onChangeText={(value) => handleChange("user_name", value)}
        value={form.user_name}
      />
      {error.userName && (
        <Text style={{ width: "75%", alignSelf: "center", color: "red" }}>
          {error.userName}
        </Text>
      )}
      <TextInput
        style={styles.textInputRegister}
        secureTextEntry={true}
        placeholder="Password"
        onChangeText={(value) => handleChange("password", value)}
        value={form.password}
      />
      {error.password && (
        <Text style={{ width: "75%", alignSelf: "center", color: "red" }}>
          {error.password}
        </Text>
      )}
      <TouchableOpacity onPress={handleSubmit} style={styles.buttonRegister}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageRegister: {
    justifyContent: "center",
    marginTop: 100,
    marginBottom: 50,
    alignSelf: "center",
  },
  titleRegister: {
    paddingHorizontal: 40,
    paddingVertical: 5,
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textInputRegister: {
    alignSelf: "center",
    width: 300,
    height: 50,
    backgroundColor: "#dcdcdc",
    borderRadius: 5,
    paddingLeft: 20,
    marginTop: 10,
    justifyContent: "center",
  },
  buttonRegister: {
    alignSelf: "center",
    backgroundColor: "#FF5555",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
    width: 300,
    height: 50,
  },
  textBtnRegister: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
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
