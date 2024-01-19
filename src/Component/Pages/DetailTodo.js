// components react
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from "react-native";
import moment from "moment";
// --------------------------------------------------------------

const DetailTodo = ({ route, navigation }) => {
  const { id, todo } = route.params;

  return (
    <SafeAreaView
      style={{
        ...styles.containerDetail,
        backgroundColor: todo?.bgColor,
      }}
    >
      <ScrollView>
        <View style={styles.contentDetail}>
          <Text style={styles.tiTodo}>{todo?.title}</Text>
          <Text style={styles.dateDetailList}>
            {moment(todo?.date).format("YYYY-MM-DD")}
          </Text>
          <Text style={styles.descDetailList}>{todo?.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerDetail: {
    flex: 1,
    padding: 20,
  },
  contentDetail: {
    width: "100%",
    marginTop: 30,
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "whitesmoke",
  },
  titleDetailList: {
    fontSize: 25,
    fontWeight: "800",
    color: "black",
  },
  dateDetailList: {
    marginBottom: 20,
    paddingVertical: 5,
    color: "black",
  },
  descDetailList: {
    textAlign: "justify",
    fontSize: 16,
    color: "black",
  },
});

export default DetailTodo;
