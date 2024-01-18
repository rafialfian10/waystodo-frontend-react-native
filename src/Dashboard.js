// components react native
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

// components native base
// import { Text, Image } from "native-base";
// ---------------------------------------------------------------

const Dashboard = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.containerDashboard}>
      <View style={styles.contentDashboard}>
        <Image
          source={require("../assets/logo-waystodo.png")}
          style={styles.logo}
          alt="logo-waystodo"
        />
        <Image
          source={require("../assets/text-waystodo.png")}
          style={styles.textLogo}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerDashboard: {
    flex: 1,
  },
  contentDashboard: {
    width: "100%",
    height: "100%",
    marginBottom: 30,
    alignSelf: "center",
    backgroundColor: "whitesmoke",
  },
  logo: {
    marginTop: 70,
    alignSelf: "center",
  },
  textLogo: {
    marginBottom: 50,
    marginBottom: 20,
    alignSelf: "center",
  },
  desc: {
    width: 300,
    marginBottom: 100,
    alignSelf: "center",
    textAlign: "center",
  },
  buttonLogin: {
    width: "80%",
    height: 50,
    marginVertical: 20,
    alignSelf: "center",
    borderRadius: 5,
    backgroundColor: "#FF5555",
  },
  buttonRegister: {
    width: "80%",
    height: 50,
    alignSelf: "center",
    borderRadius: 5,
    backgroundColor: "#C0C0C0",
  },
  textBtn: {
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "800",
    color: "white",
  },
});

export default Dashboard;
