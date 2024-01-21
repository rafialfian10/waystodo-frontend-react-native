// components react
import { useState, useEffect, useContext } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import {
  StyleSheet,
  TextInput,
  Text,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

// components native base
import {
  Box,
  Button,
  Select,
  CheckIcon,
  Menu,
  Pressable,
  Checkbox,
} from "native-base";

// components
import { UserContext } from "../../Context/UserContext";
import { GetUser } from "../Common/Hooks/getUser";
import { GetCategoriesUser } from "../Common/Hooks/getCategoriesUser";

// api
import { API } from "../../Config/api";

// env
import { PATH_FILE } from "@env";
// ------------------------------------------------------

const ListTodo = ({ navigation }) => {
  // dispatch
  const [state, dispatch] = useContext(UserContext);

  // data user & data categories
  const { user, isLoading, refetchUser } = GetUser();
  const { categoriesUser, refetchCategoriesUser } = GetCategoriesUser();

  // state search & checked & photo
  const [checked, setChecked] = useState(false);
  const [newURLPhoto, setNewURLPhoto] = useState();

  // state search, date, category, status
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState();
  const [filterCategory, setFilterCategory] = useState();
  const [filterStatus, setFilterStatus] = useState(false);

  // handle search
  const handleSearch = (value) => {
    setSearch(value);
    setFilterDate("");
    setFilterStatus("");
    setFilterCategory("");
  };

  // handle filter date
  const handleFilterDate = (value) => {
    setFilterDate(value);
    setSearch("");
    setFilterStatus("");
    setFilterCategory("");
  };

  // handle filter category
  const handleFilterCategory = (value) => {
    setFilterCategory(value);
    setSearch("");
    setFilterDate("");
    setFilterStatus("");
  };

  // handle filter status
  const handleFilterStatus = (value) => {
    setFilterStatus(value);
    setSearch("");
    setFilterDate("");
    setFilterCategory("");
  };

  // show date
  const showDatepicker = (currentMode) => {
    DateTimePickerAndroid.open({
      value: filterDate || new Date(),
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setFilterDate(currentDate);
      },
      mode: currentMode,
      is24Hour: true,
    });
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
          updatedChecklist ? "Todo has been checked" : "Todo has been unchecked"
        );
        setChecked(updatedChecklist);
        refetchUser();
        refetchCategoriesUser();
      }
    } catch (error) {
      console.log("todo failed to checked", error);
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
        refetchCategoriesUser();
      }
    } catch (error) {
      console.log("todo failed to delete ", error);
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

  useEffect(() => {
    refetchUser();
    refetchCategoriesUser();

    if (user && user?.photo) {
      const updatedPhotoURL = user?.photo.replace(
        "http://localhost:5000",
        PATH_FILE
      );

      setNewURLPhoto((prevForm) => ({
        ...prevForm,
        photo: updatedPhotoURL,
      }));
    }
  }, [checked, user, categoriesUser]);

  return (
    <SafeAreaView style={styles.containerListTodo}>
      {isLoading ? (
        <ActivityIndicator style={styles.loadingUser} />
      ) : (
        <Box>
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
                    {newURLPhoto?.photo &&
                    newURLPhoto?.photo !== `${PATH_FILE}/uploads/photo/null` ? (
                      <Image
                        source={{ uri: newURLPhoto?.photo }}
                        style={styles.photo}
                        alt="photo"
                      />
                    ) : (
                      <Image
                        source={require("../../../assets/default-photo.png")}
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
                style={{
                  ...styles.BtnProfile,
                  activeBackgroundColor: "#47A9DA",
                }}
              >
                <Text style={styles.textBtn}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.BtnProfile}
              >
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
                    style={styles.btnDate}
                    onPress={() => {
                      showDatepicker("date");
                      handleFilterDate();
                    }}
                  >
                    <Box style={styles.date}>
                      <Text style={styles.textDate}>
                        {filterDate
                          ? moment(filterDate).format("YYYY-MM-DD")
                          : "Date"}
                      </Text>
                      <Icon
                        name="calendar"
                        size={20}
                        color="black"
                        style={styles.imgDate}
                      />
                    </Box>
                  </Button>
                </Box>
                {/* filter category */}
                <Box style={styles.subContentFilter}>
                  <Select
                    style={{ fontSize: 10, height: 45 }}
                    placeholder="Category"
                    _selectedItem={{
                      bg: "#7AC1E4",
                      endIcon: <CheckIcon size="5" />,
                    }}
                    selectedValue={filterCategory}
                    onValueChange={handleFilterCategory}
                  >
                    {categoriesUser?.map((item) => {
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
                    style={{ fontSize: 10, height: 45 }}
                    placeholder="Status"
                    _selectedItem={{
                      bg: "#7AC1E4",
                      endIcon: <CheckIcon size="5" />,
                    }}
                    selectedValue={filterStatus}
                    onValueChange={handleFilterStatus}
                  >
                    <Select.Item label="Checked" value="1" />
                    <Select.Item label="Unchecked" value="0" />
                  </Select>
                </Box>
              </Box>
              {/* todos */}
              {user?.todos
                ?.filter((todo) => {
                  if (search == "") {
                    return todo;
                  } else if (
                    todo?.title
                      .toLowerCase()
                      .includes(search.toLocaleLowerCase())
                  ) {
                    return todo;
                  }
                })
                .filter((todo) => {
                  if (filterDate) {
                    return moment(todo.date).isSame(filterDate, "day");
                  } else {
                    return true;
                  }
                })
                .filter((todo) => {
                  if (filterCategory) {
                    return todo.category.id === filterCategory;
                  } else {
                    return true;
                  }
                })
                .filter((todo) => {
                  if (filterStatus === "0") {
                    return !todo?.isDone;
                  } else if (filterStatus === "1") {
                    return todo?.isDone;
                  } else {
                    return todo;
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
                              navigation.push("DetailTodo", {
                                id: todo?.id,
                                todo: todo,
                              })
                            }
                          >
                            {titleLength}
                          </Text>
                          <Text style={styles.todoDesc}>
                            {descriptionLength}
                          </Text>
                          <Box style={styles.contentDate}>
                            <Icon
                              name="calendar"
                              size={20}
                              color="black"
                              style={styles.imgDate}
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
        </Box>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerListTodo: {
    flex: 1,
  },
  loadingUser: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    paddingHorizontal: 20,
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
    borderBottomColor: "grey",
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
    borderRadius: 10,
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
    borderRadius: 10,
    overflow: "hidden",
    color: "#999999",
    backgroundColor: "#DCDCDC",
  },
  btnDate: {
    width: "100%",
    height: 50,
    backgroundColor: "transparent",
  },
  date: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  textDate: {
    fontSize: 10,
    marginRight: 20,
    color: "grey",
  },
  containerTodos: {
    width: "95%",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "center",
    padding: 10,
    borderRadius: 10,
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
  imgDate: {
    width: 20,
    height: 20,
  },
  todoDate: {
    marginLeft: 10,
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
    height: 30,
    padding: 0,
    textAlign: "center",
    textAlignVertical: "center",
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
