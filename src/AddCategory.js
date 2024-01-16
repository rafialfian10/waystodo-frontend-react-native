// import { Text, Box, Button, HStack } from 'native-base';
import { StyleSheet, TextInput, SafeAreaView, ScrollView } from "react-native";
import React, { useState } from "react";
import { useQuery } from "react-query";

// api
import { API } from "./Config/api";

const AddCategory = ({ navigation }) => {

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
  title: {
    paddingHorizontal: 40,
    paddingVertical: 5,
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 70,
    marginBottom: 20,
  },
  textInput: {
    alignSelf: "center",
    width: "80%",
    height: 50,
    backgroundColor: "#dcdcdc",
    borderRadius: 5,
    paddingLeft: 20,
    marginBottom: 10,
    justifyContent: "center",
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#FF5555",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "80%",
    height: 50,
  },
  text: {
    display: "flex",
    alignItems: "center",
    color: "white",
    fontWeight: "800",
  },
  listCategory: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    justifyContent: "flex-start",
  },
  studyStatus: {
    width: "100%",
    textAlign: "center",
    lineHeight: 15,
    color: "white",
    fontSize: 11,
    fontWeight: "800",
    borderRadius: 5,
  },
});

export default AddCategory;
