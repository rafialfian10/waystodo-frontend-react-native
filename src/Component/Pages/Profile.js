// components react
import { useContext, useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import validator from "validator";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Modal,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

// components native base
import { Box, Button, Image, Menu, Pressable } from "native-base";

// components
import { UserContext } from "../../Context/UserContext";
import { GetUser } from "../Common/Hooks/getUser";

// api
import { API } from "../../Config/api";

// env
import { PATH_FILE } from "@env";
// ---------------------------------------------------------------------

const Profile = () => {
  const route = useRoute();
  const { id } = route.params;

  // dispatch
  const [state, dispatch] = useContext(UserContext);

  // data user
  const { user, isLoading, refetchUser } = GetUser();

  // state modal & new url photo & upload photo
  const [modalVisible, setModalVisible] = useState(false);
  const [newURLPhoto, setNewURLPhoto] = useState();
  const [uploadPhoto, setUploadPhoto] = useState();

  // state form
  const [form, setForm] = useState({
    user_name: "",
    email: "",
    phone: "",
    photo: "",
  });

  // state error
  const [error, setError] = useState({
    userName: "",
    email: "",
  });

  useEffect(() => {
    setForm({
      user_name: user?.userName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      photo: user?.photo || "",
    });

    // replace http://localhost:5000 with PATH_FILE
    const updatedPhotoURL = user?.photo.replace(
      "http://localhost:5000",
      PATH_FILE
    );

    setNewURLPhoto((prevForm) => ({
      ...prevForm,
      photo: updatedPhotoURL,
    }));
  }, [user]);

  // handle change
  const handleChange = (data, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [data]: value,
    }));

    if (data === "user_name") {
      if (value.trim() === "") {
        setError((prevError) => ({
          ...prevError,
          userName: "Username is required",
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          userName: "",
        }));
      }
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
  };

  // handle update profile
  const handleUpdateProfile = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + state?.user?.token,
        },
      };

      const messageError = {
        userName: form.user_name === "" ? "Username is required" : "",
        email: form.email === "" ? "Email is required" : "",
      };

      if (!messageError.userName && !messageError.email) {
        const body = JSON.stringify(form);

        const response = await API.patch(`/user/${id}`, body, config);
        if (response?.data?.status === 200) {
          alert("Profile has been updated");
          refetchUser();
          setModalVisible(false);
        }
      } else {
        setError(messageError);
      }
    } catch (error) {
      console.log("photo failed to update", error);
    }
  };

  // handle upload photo
  const handleUploadPhoto = async (id) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // solve: Key "cancelled" in the image picker result is deprecated, use "canceled" instead,
      delete result.cancelled;

      if (!result.canceled) {
        try {
          const config = {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: "Bearer " + state?.user?.token,
            },
          };

          const formData = new FormData();
          formData.append("photo", {
            uri: result.assets[0].uri,
            type: "image/jpeg",
            name: `${state?.user?.userName}.jpg`,
          });

          const response = await API.patch(`/user/${id}`, formData, config);
          if (response?.data?.status === 200) {
            alert("Profile photo has been updated");
            refetchUser();
            setModalVisible(false);
          }
        } catch (error) {
          console.log("photo failed to upload", error);
        }
      }
    } catch (error) {
      console.log("photo failed to select", error);
    }
  };

  // handle delete photo
  const handleDeletePhoto = async (id) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + state?.user?.token,
        },
      };

      Alert.alert(
        "Delete Photo",
        "Are you sure?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              const response = await API.delete(`/user/${id}/photo`, config);

              if (response?.status === 200) {
                alert("Photo has been deleted");
                refetchUser();
                setModalVisible(false);
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.log("photo failed to delete", error);
    }
  };

  return (
    <SafeAreaView style={styles.containerDetailUser}>
      {isLoading ? (
        <ActivityIndicator style={styles.loadingProfile} />
      ) : (
        <Box style={styles.containerProfile}>
          <Box style={styles.contentProfile}>
            <Menu
              w="190"
              style={styles.contentBtnOpenModal}
              trigger={(triggerProps) => {
                return (
                  <Pressable {...triggerProps} style={styles.hamburger}>
                    <MaterialCommunityIcons
                      name="menu"
                      size={26}
                      color="grey"
                    />
                  </Pressable>
                );
              }}
            >
              <TouchableOpacity
                style={styles.btnOpenModal}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.textOpenModal}>Update profile</Text>
              </TouchableOpacity>
            </Menu>
            <Box
              colors={["#335C81", "#FFFFFF"]}
              style={styles.subContentProfile}
            >
              <Box style={styles.contentUserName}>
                <Text style={styles.userNameProfile}>{user?.userName}</Text>
              </Box>
              <Box style={styles.contentPhotoProfile}>
                {newURLPhoto?.photo &&
                newURLPhoto?.photo !== `${PATH_FILE}/uploads/photo/null` ? (
                  <Image
                    source={{ uri: newURLPhoto?.photo }}
                    style={styles.photoProfile}
                    alt="photo"
                  />
                ) : (
                  <Image
                    source={require("../../../assets/default-photo.png")}
                    style={styles.photoProfile}
                    alt="default-photo"
                  />
                )}
                <Pressable
                  style={styles.updatePhotoIcon}
                  onPress={() => handleUploadPhoto(user?.id)}
                >
                  <FontAwesome
                    name="camera"
                    size={15}
                    color="white"
                    style={styles.cameraIcon}
                  />
                </Pressable>
              </Box>
            </Box>

            <Box style={styles.contentDataProfile}>
              <Box style={styles.subContentDataProfile}>
                <Text style={styles.textKey}>Name : </Text>
                <Text style={styles.textValue}>{user?.userName}</Text>
              </Box>
              <Box style={styles.subContentDataProfile}>
                <Text style={styles.textKey}>Email : </Text>
                <Text style={styles.textValue}>{user?.email}</Text>
              </Box>
              <Box style={styles.subContentDataProfile}>
                <Text style={styles.textKey}>Phone : </Text>
                <Text style={styles.textValue}>{user?.phone}</Text>
              </Box>
            </Box>

            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Box style={styles.contentInputProfile}>
                      <TextInput
                        style={styles.textInputProfile}
                        placeholder="Username..."
                        onChangeText={(value) =>
                          handleChange("user_name", value)
                        }
                        value={form.user_name}
                      />
                      {error.userName && (
                        <Text style={styles.errorProfile}>
                          {error.userName}
                        </Text>
                      )}
                    </Box>
                    <Box style={styles.contentInputProfile}>
                      <TextInput
                        editable={false}
                        style={styles.textInputProfile}
                        placeholder="Email..."
                        onChangeText={(value) => handleChange("email", value)}
                        value={form.email}
                      />
                      {error.email && (
                        <Text style={styles.errorProfile}>{error.email}</Text>
                      )}
                    </Box>
                    <Box style={styles.contentInputProfile}>
                      <TextInput
                        style={styles.textInputProfile}
                        keyboardType="numeric"
                        placeholder="Phone..."
                        maxLength={14}
                        onChangeText={(value) => handleChange("phone", value)}
                        value={form.phone}
                      />
                      {error.phone && (
                        <Text style={styles.errorProfile}>{error.phone}</Text>
                      )}
                    </Box>
                    <Box style={styles.contentInputFileProfile}>
                      {newURLPhoto?.photo &&
                      newURLPhoto?.photo !==
                        `${PATH_FILE}/uploads/photo/null` ? (
                        <Box>
                          <TouchableOpacity
                            style={styles.deletePhoto}
                            onPress={() => handleDeletePhoto(user?.id)}
                          >
                            <MaterialIcons
                              name="cancel"
                              size={26}
                              color="red"
                            />
                          </TouchableOpacity>
                          <Image
                            source={{ uri: newURLPhoto?.photo }}
                            style={styles.selectedPhoto}
                            alt="upload-photo"
                          />
                        </Box>
                      ) : (
                        <Box></Box>
                      )}
                      {error.photo && (
                        <Text style={styles.errorProfile}>{error.photo}</Text>
                      )}
                    </Box>
                    <Box style={styles.containerBtnUpdateClose}>
                      <TouchableOpacity
                        style={styles.btnUpdate}
                        onPress={handleUpdateProfile}
                      >
                        <Text style={styles.textBtnUpdateClose}>Update</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnCancel}
                        onPress={() => setModalVisible(!modalVisible)}
                      >
                        <Text style={styles.textBtnUpdateClose}>Cancel</Text>
                      </TouchableOpacity>
                    </Box>
                  </View>
                </View>
              </Modal>
            </View>
          </Box>
        </Box>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerDetailUser: {
    flex: 1,
  },
  loadingProfile: {
    flex: 1,
  },
  containerProfile: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentProfile: {
    width: "100%",
    flex: 1,
  },
  hamburger: {
    width: 40,
    height: 40,
    position: "absolute",
    right: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  imageHamburger: {
    padding: 10,
  },
  contentBtnOpenModal: {
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  btnOpenModal: {
    alignSelf: "center",
    borderRadius: 5,
    padding: 10,
  },
  textOpenModal: {
    borderRadius: 10,
    color: "grey",
    fontWeight: "800",
    textAlign: "center",
  },
  subContentProfile: {
    width: "100%",
    height: 120,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  contentUserName: {
    width: "100%",
    marginTop: 80,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  userNameProfile: {
    fontSize: 22,
    fontWeight: "bold",
    color: "grey",
  },
  contentPhotoProfile: {
    width: 80,
    height: 80,
    position: "relative",
    left: 20,
    alignItems: "center",
    padding: 2,
    borderRadius: 40,
    borderColor: "grey",
    borderWidth: 2,
  },
  photoProfile: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  updatePhotoIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "grey",
    borderRadius: 15,
    zIndex: 5,
    padding: 5,
  },
  cameraIcon: {
    textAlign: "center",
    textAlignVertical: "center",
  },
  contentDataProfile: {
    width: "90%",
    marginTop: 70,
    alignSelf: "center",
  },
  subContentDataProfile: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    paddingVertical: 5,
    borderWidth: 2,
    borderTopColor: "white",
    borderLeftColor: "white",
    borderRightColor: "white",
    borderBottomColor: "#A9A9A9",
  },
  textKey: {
    fontSize: 14,
    fontWeight: "700",
  },
  textValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#A9A9A9",
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
    backgroundColor: "#FFFFFF",
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
  contentInputProfile: {
    width: "100%",
  },
  textInputProfile: {
    width: "100%",
    borderWidth: 2,
    borderTopColor: "white",
    borderLeftColor: "white",
    borderRightColor: "white",
    borderBottomColor: "#A9A9A9",
  },
  errorProfile: {
    width: "100%",
    height: 20,
    alignSelf: "center",
    fontSize: 11,
    color: "red",
  },
  containerBtnUpdateClose: {
    width: "100%",
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btnUpdate: {
    width: 80,
    marginHorizontal: 5,
    display: "flex",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#47A9DA",
  },
  btnCancel: {
    width: 80,
    display: "flex",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#F94449",
  },
  textBtnUpdateClose: {
    color: "white",
    fontWeight: "800",
  },
  contentInputFileProfile: {
    width: "100%",
    marginTop: 20,
  },
  choosePhotoButton: {
    width: "100%",
    backgroundColor: "#47A9DA",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  choosePhotoText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedPhoto: {
    width: "95%",
    height: 200,
    alignSelf: "center",
  },
  deletePhoto: {
    position: "absolute",
    top: -10,
    right: -5,
    zIndex: 1,
  },
});

export default Profile;
