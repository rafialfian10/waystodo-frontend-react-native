// components react native
import { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import { StyleSheet, TextInput, SafeAreaView, ScrollView } from "react-native";
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
  Menu,
  Pressable,
  Checkbox,
} from "native-base";

// components
import { UserContext } from "./Context/UserContext";

// api
import { API } from "./Config/api";
// ------------------------------------------------------

const ListTodo = ({ navigation }) => {
  // dispatch
  const [state, dispatch] = useContext(UserContext);

  // state search & checklist
  const [search, setSearch] = useState("");
  const [checklist, setChecklist] = useState(false);

  // state category status for filter
  const [status, setStatus] = useState(false);
  const [category, setCategory] = useState("");

  // state todos & categories
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);

  // get user
  let { data: user } = useQuery("userCache", async () => {
    const response = await API.get(`/user/${state?.user?.id}`);
    return response?.data?.data;
  });

  // get todos
  let { data: allTodos, refetch: refetchAllTodos } = useQuery(
    "todosCaches",
    async () => {
      const response = await API.get(`/todos`);
      setTodos(response?.data?.data);
    }
  );

  // get categories
  let { data: allCategories, refetch: refetchAllCategories } = useQuery(
    "categoriesCache",
    async () => {
      const response = await API.get(`/categories`);
      setCategories(response?.data?.data);
    }
  );

  // handle search
  const handleSearch = (value) => {
    setSearch(value);
  };

  // handle check 
  const handleCheck = async (id, item) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Mengubah nilai item?.checklist menjadi kebalikan nilainya
      const updatedChecklist = !item?.checklist;
      console.log("data", updatedChecklist);

      const body = {
        checklist: updatedChecklist,
      };

      const response = await API.patch(`/todo/${id}`, body, config);
      if (response) {
        alert(
          updatedChecklist
            ? "Category has been checked"
            : "Category has been unchecked"
        );
        setChecklist(updatedChecklist);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // state date
  const [date, setDate] = useState(new Date(1598051730000));

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    const formattedDate = moment(currentDate).format("YYYY-MM-DD");
    // console.log("Formatted Date:", formattedDate);
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
    refetchAllTodos();
    refetchAllCategories();
  }, []);

  return (
    <SafeAreaView>
      {/* profile */}
      <Box style={styles.contentProfile1}>
        <Box style={styles.contentProfile2}>
          <Text style={styles.textUserName}>{user?.userName}</Text>
          <Text style={styles.lists}>{todos?.length} Lists</Text>
        </Box>
        <Menu
          w="190"
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps}>
                <Image
                  source={require("../assets/saitama.png")}
                  style={styles.photo}
                  alt=""
                />
              </Pressable>
            );
          }}
        >
          <Menu.Item
            onPress={() => navigation.navigate("Profile", { id: user?._id })}
          >
            Profile
          </Menu.Item>
          <Menu.Item onPress={handleLogout}>Logout</Menu.Item>
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
                style={{ fontSize: 10, height: 45 }}
                _selectedItem={{ bg: "teal.200" }}
                placeholder="Category"
                selectedValue={category}
                onValueChange={(itemValue) => {
                  setCategory(itemValue);
                }}
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
                style={{ fontSize: 10, height: 45 }}
                selectedValue={status}
                placeholder="Status"
                onValueChange={(itemValue) => {
                  setStatus(itemValue);
                }}
              >
                <Select.Item label="Checked" value="true" />
                <Select.Item label="Unchecked" value="false" />
              </Select>
            </Box>
          </Box>

          {/* todos */}
          {todos
            ?.filter((itemSearch) => {
              if (search == "") {
                return itemSearch;
              } else if (
                itemSearch.title
                  .toLowerCase()
                  .includes(search.toLocaleLowerCase())
              ) {
                return itemSearch;
              }
            })
            .map((item, i) => {
              return (
                <Box
                  style={{
                    ...styles.containerTodos,
                    backgroundColor: item?.bgColor,
                  }}
                  key={item?.id}
                >
                  <Box style={styles.contentTodo}>
                    <Text
                      style={styles.todoTitle}
                      onPress={() =>
                        navigation.push("DetailList", {
                          todos: todos[i],
                          bgColor: item?.bgColor[i],
                        })
                      }
                    >
                      {item?.title}
                    </Text>
                    <Text style={styles.todoDesc}>{item?.description}</Text>
                    <Box style={styles.contentDate}>
                      <Image
                        style={styles.imageDate}
                        source={require("../assets/calender.png")}
                        alt="calender"
                      />
                      <Text style={styles.todoDate}>{moment(item?.date).format("YYYY-MM-DD")}</Text>
                    </Box>
                  </Box>

                  <Box style={styles.contentCategories} key={item?.id}>
                    {/* {item.category?.map((cat) => {
                      {
                        if (cat?.title === "study") {
                          return (
                            <Box style={styles.contentCheckbox} key={cat?.id}>
                              <Box
                                style={{
                                  backgroundColor: "#81C8FF",
                                  borderRadius: 5,
                                  height: 35,
                                  marginBottom: 10,
                                }}
                              >
                                <Text style={styles.categoryTitle}>
                                  {cat?.title}
                                </Text>
                              </Box>
                              <Checkbox
                                padding={3}
                                rounded={"full"}
                                size="lg"
                                colorScheme="green"
                                aria-label="Label Checkbox"
                                value={item?.checklist}
                                onPress={() => handleCheck(item?.id)}
                              />
                            </Box>
                          );
                        } else if (cat?.title === "home work") {
                          return (
                            <Box style={styles.contentCheckbox} key={cat?.id}>
                              <Box
                                style={{
                                  backgroundColor: "#FF8181",
                                  borderRadius: 5,
                                  height: 35,
                                  marginBottom: 10,
                                }}
                              >
                                <Text style={styles.categoryTitle}>
                                  {cat?.title}
                                </Text>
                              </Box>
                              <Checkbox
                                padding={3}
                                rounded={"full"}
                                size="lg"
                                colorScheme="green"
                                aria-label="Label Checkbox"
                                value={item?.checklist}
                                onPress={() => handleCheck(item?.id)}
                              />
                            </Box>
                          );
                        } else if (cat?.title === "workout") {
                          return (
                            <Box style={styles.contentCheckbox} key={cat?.id}>
                              <Box
                                style={{
                                  backgroundColor: "#FFB681",
                                  borderRadius: 5,
                                  height: 35,
                                  marginBottom: 10,
                                }}
                              >
                                <Text style={styles.categoryTitle}>
                                  {cat?.title}
                                </Text>
                              </Box>
                              <Checkbox
                                padding={3}
                                rounded={"full"}
                                size="lg"
                                colorScheme="green"
                                aria-label="Label Checkbox"
                                value={item?.checklist}
                                onPress={() => handleCheck(item?.id)}
                              />
                            </Box>
                          );
                        } else {
                          return (
                            <Box style={styles.contentCheckbox} key={cat?.id}>
                              <Box
                                style={{
                                  height: 35,
                                  marginBottom: 10,
                                  backgroundColor: randomColors(),
                                  borderRadius: 5,
                                }}
                              >
                                <Text style={styles.categoryTitle}>
                                  {cat?.title}
                                </Text>
                              </Box>
                              <Checkbox
                                padding={3}
                                rounded={"full"}
                                size="lg"
                                colorScheme="green"
                                aria-label="Label Checkbox"
                                isChecked={item?.checklist}
                                value={item?.checklist}
                                onPress={() => handleCheck(item?._id, item)}
                              />
                            </Box>
                          );
                        }
                      }
                    })} */}
                  </Box>
                </Box>
              );
            })}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentProfile1: {
    width: "95%",
    height: 80,
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 40,
    padding: 10,
  },
  contentProfile2: {
    height: 80,
    display: "flex",
    justifyContent: "center",
  },
  textUserName: {
    display: "flex",
    alignItems: "center",
    color: "#565656",
    paddingVertical: 10,
    fontWeight: "800",
    fontSize: 25,
  },
  lists: {
    color: "#8a8989",
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  textSearch: {
    width: "95%",
    height: 50,
    backgroundColor: "#dcdcdc",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 11,
  },
  containerSearchFilter: {
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 200,
  },
  contentFilter: {
    width: "95%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    marginBottom: 40,
  },
  subContentFilter: {
    alignSelf: "center",
    width: "32%",
    height: 50,
    backgroundColor: "#dcdcdc",
    borderRadius: 5,
    marginBottom: 10,
    color: "#999999",
  },
  containerTodos: {
    width: "95%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "center",
  },
  contentTodo: {
    width: "60%",
  },
  todoTitle: {
    fontWeight: "800",
    fontSize: 15,
  },
  todoDesc: {
    fontSize: 12,
    marginBottom: 10,
  },
  contentDate: {
    display: "flex",
    flexDirection: "row",
  },
  imageDate: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  todoDate: {
    fontSize: 12,
    marginBottom: 10,
  },
  contentCategories: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  contentCheckbox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: "white",
    fontSize: 12,
    fontWeight: "800",
    borderRadius: 5,
  },
});

export default ListTodo;
