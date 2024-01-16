// import { Text, Box, Image, View, Menu, Pressable } from 'native-base';
import {
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "react-query";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./Context/UserContext";
import { useRoute } from "@react-navigation/native";

// api
import { API } from "./Config/api";

const Profile = () => {
  

  return <></>;
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
  },
  hamburger: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    right: 20,
    height: 40,
    zIndex: 100,
  },
  profileContainer: {
    width: "100%",
  },
  contentProfile: {
    width: "100%",
    height: 120,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#40FEE4",
  },
  contentName: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 80,
  },
  firstName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
    margin: 5,
  },
  contentPhoto: {
    width: 80,
    height: 80,
    position: "relative",
    left: 20,
    borderRadius: 40,
    backgroundColor: "black",
    overflow: "hidden",
    backgroundColor: "#87cefa",
  },
  contentDataProfile: {
    width: "90%",
    alignSelf: "center",
    marginTop: 70,
  },
  subContentDataProfile: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 15,
    borderColor: "white",
    borderBottomColor: "#a9a9a9",
    borderWidth: 2,
  },
  textKey: {
    fontSize: 14,
    fontWeight: "700",
  },
  textvalue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#a9a9a9",
  },
  // Modal
  contentModalProfile: {
    width: "50%",
    height: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  centeredView: {
    width: "80%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  modalView: {
    width: "100%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "flex-end",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: 160,
    alignSelf: "center",
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 5,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#00FCD9",
  },
  buttonClose: {
    backgroundColor: "#00FCD9",
  },
  buttonModal: {
    width: 80,
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    marginHorizontal: 5,
    elevation: 2,
    backgroundColor: "#00FCD9",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  textInput: {
    width: "100%",
    height: 50,
    paddingLeft: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "white",
    borderBottomColor: "#00FCD9",
  },
  btn: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
});

export default Profile;
