// components react native
import { StyleSheet, Text, Image, TouchableOpacity, SafeAreaView } from "react-native";

// components native base
// import { Text, Image } from "native-base";
// ---------------------------------------------------------------

const Dashboard = ({ navigation }) => {
  return (
    <SafeAreaView>
      <Image
        source={require("../assets/logo-waystodo.png")}
        style={styles.logo}
        alt="logo-waystodo"
      />
      <Image
        source={require("../assets/text-waystodo.png")}
        style={{ marginBottom: 50, alignSelf: "center", marginBottom: 20 }}
        alt="waystodo"
      />
      <Text style={styles.desc}>
        Write your activity and finish your activity. Fast, Simple and Easy to
        use
      </Text>
      <TouchableOpacity
        style={styles.buttonLogin}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.textBtn}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonRegister}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.textBtn}>Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: 70,
    alignSelf: "center",
  },
  desc: {
    width: 300,
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 100,
  },
  buttonLogin: {
    width: 320,
    alignSelf: "center",
    backgroundColor: "#FF5555",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    height: 50,
  },
  buttonRegister: {
    width: 320,
    alignSelf: "center",
    backgroundColor: "#c0c0c0",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    height: 50,
  },
  textBtn: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
  },
});

export default Dashboard;
