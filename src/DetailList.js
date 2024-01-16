// import { Text, Box, Button, Image } from 'native-base';
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";

const DetailList = ({ route, navigation }) => {
  

  return <></>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  countContainer: {
    alignItems: "center",
    padding: 10,
  },
  contentDetail: {
    margin: 30,
    padding: 20,
    paddingBottom: 100,
    borderRadius: 5,
  },
  title: {
    paddingVertical: 5,
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 50,
    color: "black",
  },
  date: {
    marginBottom: 50,
    paddingVertical: 5,
    fontWeight: "bold",
    color: "black",
  },
});

export default DetailList;
