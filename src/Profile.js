// components react native
import { useContext, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useRoute } from "@react-navigation/native";
import validator from "validator";
// import ImagePicker from "react-native-image-picker";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

// components native base
import { Box, Image, Menu, Pressable } from "native-base";

// components
import { UserContext } from "./Context/UserContext";

// api
import { API } from "./Config/api";

// env
import { PATH_FILE_PHOTO } from "@env";
// ---------------------------------------------------------------------

const Profile = () => {
  const route = useRoute();
  const { id } = route.params;

  // dispatch
  const [state, dispatch] = useContext(UserContext);

  // state modal
  const [modalVisible, setModalVisible] = useState(false);

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

  // get user
  let {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery("getDetailuserCache", async () => {
    const response = await API.get(`/User/${id}`);
    return response.data.data;
  });

  useEffect(() => {
    setForm({
      user_name: profile?.userName || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      photo: profile?.photo || "",
    });

    // Ganti http://localhost:5000 dengan PATH_FILE_PHOTO
    const updatedPhotoURL = profile?.photo.replace("http://localhost:5000", PATH_FILE_PHOTO);

    // Setel form dengan URL yang sudah diganti
    setForm((prevForm) => ({
      ...prevForm,
      photo: updatedPhotoURL,
    }));
  }, [profile]);

  // handle upload image
  const handleImagePicker = async () => {
    // ImagePicker.showImagePicker({ mediaType: "photo" }, (response) => {
    //   if (!response.didCancel && !response.error) {
    //     // Update the 'photo' state with the selected image URI
    //     setForm((prevForm) => ({
    //       ...prevForm,
    //       photo: response.uri,
    //     }));
    //     // Clear any previous photo-related errors
    //     setError((prevError) => ({
    //       ...prevError,
    //       photo: "",
    //     }));
    //   }
    // });
  };

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
          refetchProfile();
          setModalVisible(false);
        }
      } else {
        setError(messageError);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.containerDetailUser}>
      {profileLoading ? (
        <ActivityIndicator style={styles.loadingProfile} />
      ) : (
        <View style={styles.containerProfile}>
          <Box style={styles.contentProfile}>
            <Menu
              w="190"
              style={styles.contentBtnOpenModal}
              trigger={(triggerProps) => {
                return (
                  <Pressable {...triggerProps} style={styles.hamburger}>
                    <Image
                      source={require("../assets/hamburger.png")}
                      style={styles.imageHamburger}
                      alt="hamburger"
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
                <Text style={styles.userNameProfile}>{profile?.userName}</Text>
              </Box>
              <Box style={styles.contentPhotoProfile}>
                {profile?.photo &&
                profile?.photo !==
                  "http://localhost:5000/uploads/photo/null" ? (
                  <Image
                    source={{ uri: form?.photo }} 
                    style={styles.photoProfile}
                    alt="photo"
                  />
                ) : (
                  <Image
                    source={require("../assets/default-photo.png")}
                    style={styles.photoProfile}
                    alt="default-photo"
                  />
                )}
              </Box>
            </Box>

            <Box style={styles.contentDataProfile}>
              <Box style={styles.subContentDataProfile}>
                <Text style={styles.textKey}>Name : </Text>
                <Text style={styles.textValue}>{profile?.userName}</Text>
              </Box>
              <Box style={styles.subContentDataProfile}>
                <Text style={styles.textKey}>Email : </Text>
                <Text style={styles.textValue}>{profile?.email}</Text>
              </Box>
              <Box style={styles.subContentDataProfile}>
                <Text style={styles.textKey}>Phone : </Text>
                <Text style={styles.textValue}>{profile?.phone}</Text>
              </Box>
            </Box>

            {/* Modal */}
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
                        style={styles.textInputProfile}
                        placeholder="Email..."
                        onChangeText={(value) => handleChange("email", value)}
                        value={form.email}
                      />
                      {error.email ? (
                        <Text style={styles.errorProfile}>{error.email}</Text>
                      ) : (
                        ""
                      )}
                    </Box>

                    <Box style={styles.contentInputProfile}>
                      <TextInput
                        style={styles.textInputProfile}
                        keyboardType="numeric"
                        placeholder="Phone..."
                        onChangeText={(value) => handleChange("phone", value)}
                        value={form.phone}
                      />
                      {error.phone && (
                        <Text style={styles.errorProfile}>{error.phone}</Text>
                      )}
                    </Box>

                    <Box style={styles.contentInputFileProfile}>
                      <TouchableOpacity
                        style={styles.choosePhotoButton}
                        onPress={handleImagePicker}
                      >
                        <Text style={styles.choosePhotoText}>Choose Photo</Text>
                      </TouchableOpacity>
                      {/* {form.photo ? (
                        <Image
                          source={{ uri: form.photo }}
                          style={styles.selectedPhoto}
                          alt="select-photo"
                        />
                      ) : null} */}
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
        </View>
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
    overflow: "hidden",
    borderColor: "grey",
    borderWidth: 2,
  },
  photoProfile: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
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

  // -------------
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
    marginVertical: 10,
  },
  choosePhotoText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedPhoto: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default Profile;
