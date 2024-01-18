// components react native
import { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
  StyleSheet,
  TextInput,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// componenst native base
import { Box, Image, Button, TextArea, Select, CheckIcon } from "native-base";

// components
import { UserContext } from "./Context/UserContext";

// api
import { API } from "./Config/api";
// -----------------------------------------------------------

const AddTodo = ({ navigation }) => {
  // dispatch
  const [state, dispatch] = useContext(UserContext);

  // state category
  const [categories, setCategories] = useState();

  // state form & date
  const [form, setForm] = useState({
    user_id: state?.user?.id,
    title: "",
    category_id: "",
    description: "",
    bg_color: "",
    date: "",
  });

  // get categories user
  let { data: todoCategoriesUser, refetch: refetchTodoCategoriesUser } =
    useQuery("todoCategoriesUserCache", async () => {
      const response = await API.get(`/categories-user`);
      setCategories(response.data.data);
    });

  // state error
  const [error, setError] = useState({
    title: "",
    categoryId: "",
    description: "",
    bgColor: "",
    date: "",
  });

  // handle change
  const handleChange = (data, value) => {
    setForm((prevForm) => ({ ...prevForm, [data]: value }));

    if (data === "title") {
      setError((prevError) => ({ ...prevError, title: value.trim() === "" ? "Title is required" : "" }));
    }

    if (data === "category_id") {
      setError((prevError) => ({ ...prevError, categoryId: isNaN(value) ? "Category is required" : "" }));
    }

    if (data === "bg_color") {
      setError((prevError) => ({ ...prevError, bgColor: value.trim() === "" ? "Color is required" : "" }));
    }

    if (data === "date") {
      setError((prevError) => ({ ...prevError, date: !value ? "Date is required" : "" }));
    }

    if (data === "description") {
      setError((prevError) => ({ ...prevError, description: value.trim() === "" ? "Description is required" : "" }));
    }
  };

  // handle submit
  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + state?.user?.token,
        },
      };

      const messageError = {
        title: form.title === "" ? "Title is required" : "",
        categoryId: form.category_id === "" ? "Category is required" : "",
        bgColor: form.bg_color === "" ? "Color is required" : "",
        date: form.date === "" ? "Date is required" : "",
        description: form.description === "" ? "Description is required" : "",
      };

      // Set user_id in the form only if it's not already set
      setForm({ ...form, user_id: state?.user?.id });

      if (
        !messageError.title &&
        !messageError.categoryId &&
        !messageError.bgColor &&
        !messageError.date &&
        !messageError.description
      ) {
        const body = JSON.stringify(form);

        const response = await API.post("/todo", body, config);
        if (response?.data?.status) {
          alert("List has been added");
          refetchTodoCategoriesUser();
          setForm({
            user_id: state?.user?.id,
            title: "",
            category_id: "",
            description: "",
            bg_color: "",
            date: "",
          });
          navigation.navigate("ListTodo");
        }
      } else {
        setError(messageError);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // date
  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: form.date || new Date(), // use form.date or default to new Date()
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate || form.date || new Date();
        setForm({ ...form, date: currentDate });
        handleChange("date", currentDate);
      },
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  // colors
  const colorOptions = [
    { label: "Red", value: "#FFA0A0" },
    { label: "Green", value: "#A0FFA0" },
    { label: "Blue", value: "#A0A0FF" },
    { label: "Yellow", value: "#FFFFA0" },
    { label: "Purple", value: "#FFA0FF" },
    { label: "Cyan", value: "#A0FFFF" },
    { label: "Pink", value: "#FFC0CB" },
    { label: "Lime", value: "#DFFF00" },
    { label: "Sky Blue", value: "#87CEEB" },
    { label: "Lavender", value: "#E6E6FA" },
  ];

  useEffect(() => {
    refetchTodoCategoriesUser();

    // Check if user_id is not already set in the form, then set it
    if (!form.user_id && state?.user?.id) {
      setForm((prevForm) => ({
        ...prevForm,
        user_id: state.user.id,
      }));
    }
  }, [state, form.user_id]);

  return (
    <SafeAreaView style={styles.containerAddList}>
      <ScrollView>
        <Box style={styles.todoContainer}>
          <Text style={styles.titleTodo}>Add Todo</Text>
          <Box>
            <TextInput
              style={styles.textInputTodo}
              placeholder="Title"
              onChangeText={(value) => handleChange("title", value)}
              value={form.title}
            />
          </Box>
          {error.title && <Text style={styles.errorTodo}>{error.title}</Text>}

          <Box style={styles.containerSelectCategory}>
            <Select
              selectedValue={form.category_id}
              onValueChange={(value) => handleChange("category_id", value)}
              style={styles.selectCategory}
              _selectedItem={{
                bg: "#7AC1E4",
                endIcon: <CheckIcon size="5" />,
              }}
              placeholder="Select category"
            >
              {categories?.map((category, index) => (
                <Select.Item
                  key={index}
                  label={category.categoryName}
                  value={category.id}
                />
              ))}
            </Select>
          </Box>
          {error.categoryId && (
            <Text style={styles.errorTodo}>{error.categoryId}</Text>
          )}

          <Box style={styles.containerSelectCategory}>
            <Select
              selectedValue={form.bg_color}
              onValueChange={(value) => handleChange("bg_color", value)}
              style={styles.selectCategory}
              _selectedItem={{
                bg: "#7AC1E4",
                endIcon: <CheckIcon size="5" />,
              }}
              placeholder="Select color"
            >
              {colorOptions.map((color, index) => (
                <Select.Item
                  key={index}
                  label={color.label}
                  value={color.value}
                />
              ))}
            </Select>
          </Box>
          {error.bgColor && (
            <Text style={styles.errorTodo}>{error.bgColor}</Text>
          )}

          <Box style={styles.dateInput}>
            <Button style={styles.dateButton} onPress={showDatepicker} />
            <Text style={styles.textDate}>
              {form.date ? form.date.toLocaleDateString() : "Date"}
            </Text>
            <Image
              style={styles.imageDate}
              source={require("../assets/calender.png")}
              alt="calender"
            />
          </Box>
          {error.date && <Text style={styles.errorTodo}>{error.date}</Text>}

          <Box style={styles.containerDescription}>
            <TextArea
              h={40}
              style={styles.contentDescription}
              placeholder="Description"
              onChangeText={(value) => handleChange("description", value)}
              value={form.description}
            />
          </Box>
          {error.description && (
            <Text style={styles.errorTodo}>{error.description}</Text>
          )}
          <TouchableOpacity style={styles.buttonTodo} onPress={handleSubmit}>
            <Text style={styles.textBtnTodo}>Add List</Text>
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerAddList: {
    flex: 1,
  },
  todoContainer: {
    width: "100%",
  },
  titleTodo: {
    width: "80%",
    marginTop: 50,
    marginBottom: 20,
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "800",
  },
  textInputTodo: {
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
    paddingLeft: 20,
    borderRadius: 5,
    backgroundColor: "#DCDCDC",
  },
  containerSelectCategory: {
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#DCDCDC",
  },
  selectCategory: {
    height: 50,
    fontSize: 14,
    color: "grey",
    borderRadius: 5,
  },
  errorTodo: {
    width: "80%",
    marginBottom: 15,
    alignSelf: "center",
    fontSize: 11,
    color: "red",
  },
  dateInput: {
    width: "80%",
    height: 50,
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 5,
    color: "red",
    backgroundColor: "#DCDCDC",
  },
  dateButton: {
    width: "100%",
    height: 50,
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    zIndex: 10,
  },
  textDate: {
    width: "100%",
    paddingHorizontal: 15,
    color: "grey",
  },
  imageDate: {
    width: 25,
    height: 25,
    position: "absolute",
    right: 15,
  },
  containerDescription: {
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#DCDCDC",
  },
  contentDescription: {
    width: "100%",
    fontSize: 15,
    paddingHorizontal: 20,
  },
  buttonTodo: {
    width: "80%",
    height: 50,
    marginVertical: 20,
    alignSelf: "center",
    borderRadius: 5,
    backgroundColor: "#FF5555",
  },
  textBtnTodo: {
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "800",
    color: "white",
  },
});

export default AddTodo;
