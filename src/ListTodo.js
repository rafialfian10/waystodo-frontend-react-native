// components react native
import { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import {
  StyleSheet,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

// components native base
import {
  Text,
  Box,
  Image,
  Button,
  Select,
  CheckIcon,
  Menu,
  Pressable,
  Checkbox,
} from "native-base";

// components
import { UserContext } from "./Context/UserContext";

// api
import { API } from "./Config/api";

// env
import { PATH_FILE_PHOTO } from "@env";
// ------------------------------------------------------

const ListTodo = ({ navigation }) => {
  // dispatch
  const [state, dispatch] = useContext(UserContext);

  // state categories
  const [categories, setCategories] = useState([]);

  // state search & checked & photo
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(false);
  const [photo, setPhoto] = useState([]);
  
  // state category status for filter
  const [status, setStatus] = useState(false);
  const [category, setCategory] = useState("");

  // get user
  let { data: user, refetch: refetchUser } = useQuery("userCache", async () => {
    const response = await API.get(`/user/${state?.user?.id}`);
    return response?.data?.data;
  });

  // get categories
  let { data: categoriesUser, refetch: refetchCategoriesUser } = useQuery(
    "categoriesUserCach, catee",
    async () => {
      const response = await API.get(`/categories-user`);
      setCategories(response?.data?.data);
    }
  );

  // handle search
  const handleSearch = (value) => {
    setSearch(value);
  };

  // handle checked
  const handleChecked = async (id, todo) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + state?.user?.token,
        },
      };

      // Mengubah nilai todo?.isDone menjadi kebalikan nilainya
      const updatedChecklist = !todo?.isDone;
      // console.log("checked", updatedChecklist);

      const body = {
        is_done: updatedChecklist,
      };

      const response = await API.patch(`/todo/${id}`, body, config);
      if (response.data.status === 200) {
        alert(
          updatedChecklist
            ? "Category has been checked"
            : "Category has been unchecked"
        );
        setChecked(updatedChecklist);
        refetchUser();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // handle delete
  const handleDelete = async (id) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + state?.user?.token,
        },
      };

      const response = await API.delete(`/todo/${id}`, config);
      if (response?.status === 200) {
        alert("Todo has been deleted");
        refetchUser();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // handle logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch({
      type: "LOGOUT",
      payload: {},
    });
    navigation.navigate("Index");
    alert("Logout successfully");
  };

  // state date
  const [date, setDate] = useState(new Date(1598051730000));

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    const formattedDate = moment(currentDate).format("YYYY-MM-DD");
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  useEffect(() => {
    refetchUser();

    const updatedPhotoURL = user?.photo.replace("http://localhost:5000", PATH_FILE_PHOTO);

    setPhoto((prevForm) => ({
      ...prevForm,
      photo: updatedPhotoURL,
    }));
  }, [checked, user]);

  return (
    <SafeAreaView style={styles.containerListTodo}>
      {/* profile */}
      <Box style={styles.contentProfile1}>
        <Box style={styles.contentProfile2}>
          <Text style={styles.textUserName}>{user?.userName}</Text>
          <Text style={styles.lists}>{user?.todos?.length} Lists</Text>
        </Box>
        <Menu
          w="190"
          style={styles.contentBtnProfile}
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps}>
                {user?.photo &&
                user?.photo !== "http://localhost:5000/uploads/photo/null" ? (
                  <Image
                    source={{uri: photo?.photo}}
                    style={styles.photo}
                    alt="photo"
                  />
                ) : (
                  <Image
                    source={require("../assets/default-photo.png")}
                    style={styles.photo}
                    alt="default-photo"
                  />
                )}
              </Pressable>
            );
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile", { id: user?.id })}
            style={{ ...styles.BtnProfile, activeBackgroundColor: "#47A9DA" }}
          >
            <Text style={styles.textBtn}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.BtnProfile}>
          <Text style={styles.textBtn}>Logout</Text>
          </TouchableOpacity>
        </Menu>
      </Box>

      <ScrollView>
        <Box style={styles.containerSearchFilter}>
          {/* search */}
          <TextInput
            style={styles.textSearch}
            placeholder="Search List....."
            onChangeText={(value) => handleSearch(value)}
            value={search}
          />
          <Box style={styles.contentFilter}>
            {/* filter date */}
            <Box style={styles.subContentFilter}>
              <Button
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  height: 50,
                }}
                onPress={showDatepicker}
              >
                <Box
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {date === "" ? (
                    <Text
                      style={{ fontSize: 10, marginRight: 20, color: "grey" }}
                    >
                      {date.toLocaleDateString()}
                    </Text>
                  ) : (
                    <Text
                      style={{ fontSize: 11, marginRight: 20, color: "grey" }}
                    >
                      Date
                    </Text>
                  )}
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={require("../assets/calender.png")}
                    alt="calender"
                  />
                </Box>
              </Button>
            </Box>

            {/* filter category */}
            <Box style={styles.subContentFilter}>
              <Select
                selectedValue={category}
                onValueChange={(itemValue) => {
                  setCategory(itemValue);
                }}
                style={{ fontSize: 10, height: 45 }}
                _selectedItem={{
                  bg: "#7AC1E4",
                  endIcon: <CheckIcon size="5" />,
                }}
                placeholder="Category"
              >
                {categories?.map((item) => {
                  return (
                    <Select.Item
                      label={item?.categoryName}
                      value={item?.id}
                      key={item?.id}
                    />
                  );
                })}
              </Select>
            </Box>

            {/* filter status */}
            <Box style={styles.subContentFilter}>
              <Select
                selectedValue={status}
                onValueChange={(itemValue) => {
                  setStatus(itemValue);
                }}
                style={{ fontSize: 10, height: 45 }}
                _selectedItem={{
                  bg: "#7AC1E4",
                  endIcon: <CheckIcon size="5" />,
                }}
                placeholder="Status"
              >
                <Select.Item label="Checked" value="true" />
                <Select.Item label="Unchecked" value="false" />
              </Select>
            </Box>
          </Box>

          {/* todos */}
          {user?.todos
            ?.filter((todoSearch) => {
              if (search == "") {
                return todoSearch;
              } else if (
                todoSearch?.title
                  .toLowerCase()
                  .includes(search.toLocaleLowerCase())
              ) {
                return todoSearch;
              }
            })
            .map((todo, i) => {
              const titleLength =
                todo?.title.length > 20
                  ? todo?.title.slice(0, 20) + "..."
                  : todo?.title;
              const descriptionLength =
                todo?.description.length > 35
                  ? todo?.description.slice(0, 35) + "..."
                  : todo?.description;

              return (
                <TouchableOpacity
                  key={i}
                  onLongPress={() => {
                    Alert.alert("Delete Todo", `Are you sure?`, [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: () => handleDelete(todo?.id),
                      },
                    ]);
                  }}
                >
                  <Box
                    style={{
                      ...styles.containerTodos,
                      backgroundColor: todo?.bgColor,
                    }}
                    key={i}
                  >
                    <Box style={styles.contentTodo}>
                      <Text
                        style={styles.todoTitle}
                        onPress={() =>
                          navigation.push("DetailList", {
                            id: todo?.id,
                            todo: todo,
                          })
                        }
                      >
                        {titleLength}
                      </Text>
                      <Text style={styles.todoDesc}>{descriptionLength}</Text>
                      <Box style={styles.contentDate}>
                        <Image
                          style={styles.imageDate}
                          source={require("../assets/calender.png")}
                          alt="calender"
                        />
                        <Text style={styles.todoDate}>
                          {moment(todo?.date).format("YYYY-MM-DD")}
                        </Text>
                      </Box>
                    </Box>

                    <Box style={styles.containerCategories}>
                      <Box style={styles.contentCheckbox}>
                        <Box
                          style={{
                            ...styles.contentCategory,
                            backgroundColor: todo?.category?.bgColor,
                          }}
                        >
                          <Text style={styles.categoryTitle}>
                            {todo?.category?.categoryName}
                          </Text>
                        </Box>
                        <Box style={styles.checkbox}>
                          <Checkbox
                            padding={3}
                            rounded={"full"}
                            size="lg"
                            colorScheme="green"
                            aria-label="Label Checkbox"
                            isChecked={todo?.isDone}
                            onPress={() => handleChecked(todo?.id, todo)}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </TouchableOpacity>
              );
            })}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerListTodo: {
    flex: 0,
  },
  contentProfile1: {
    width: "90%",
    height: 80,
    marginVertical: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
  },
  contentProfile2: {
    height: 80,
    display: "flex",
    justifyContent: "center",
  },
  contentBtnProfile: {
    top: 5,
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  BtnProfile: {
    width: "100%",
    height: 40,
    alignSelf: "center",
    paddingHorizontal:20,
  },
  textBtn: {
    width: "100%",
    padding: 5,
    textAlign: "center",
    color: "grey",
    fontWeight: "800",
    borderWidth: 1,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "grey"
  },
  textUserName: {
    display: "flex",
    alignItems: "center",
    paddingVertical: 10,
    fontSize: 25,
    fontWeight: "800",
    color: "#565656",
  },
  lists: {
    color: "#8a8989",
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderColor: "grey",
    borderWidth: 1,
  },
  textSearch: {
    width: "95%",
    height: 50,
    marginBottom: 10,
    alignSelf: "center",
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 11,
    backgroundColor: "#DCDCDC",
  },
  containerSearchFilter: {
    marginBottom: 200,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  contentFilter: {
    width: "95%",
    marginBottom: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  subContentFilter: {
    width: "32%",
    height: 50,
    marginBottom: 10,
    alignSelf: "center",
    borderRadius: 5,
    color: "#999999",
    backgroundColor: "#DCDCDC",
  },
  containerTodos: {
    width: "95%",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "center",
    padding: 10,
    borderRadius: 5,
  },
  contentTodo: {
    width: "70%",
  },
  todoTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  todoDesc: {
    marginBottom: 10,
    fontSize: 12,
  },
  contentDate: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  imageDate: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  todoDate: {
    fontSize: 12,
  },
  containerCategories: {
    width: "30%",
  },
  contentCheckbox: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  contentCategory: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 5,
  },
  categoryTitle: {
    padding: 0,
    height: 30,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
    color: "white",
  },
  checkbox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
});

export default ListTodo;
