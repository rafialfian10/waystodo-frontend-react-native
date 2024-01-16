// import { Text, Box, Image, Button, TextArea, Select } from 'native-base';
import { StyleSheet, TextInput } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import moment from "moment";

// api
import { API } from "./Config/api";

const AddList = ({ navigation }) => {
 

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
    justifyContent: "center",
  },
  selectInput: {
    alignSelf: "center",
    width: "80%",
    height: 50,
    backgroundColor: "#dcdcdc",
    borderRadius: 5,
    marginTop: 10,
    color: "#999999",
  },
  dateInput: {
    position: "relative",
    alignSelf: "center",
    width: "80%",
    height: 50,
    backgroundColor: "#dcdcdc",
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 17,
    color: "#999999",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  dateButton: {
    width: "100%",
    backgroundColor: "transparent",
    height: 50,
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textArea: {
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#dcdcdc",
  },
  button: {
    width: "80%",
    height: 50,
    marginTop: 20,
    padding: 10,
    alignSelf: "center",
    backgroundColor: "#FF5555",
    borderRadius: 5,
  },
  text: {
    display: "flex",
    alignItems: "center",
    color: "white",
    fontWeight: "800",
  },
});

export default AddList;
