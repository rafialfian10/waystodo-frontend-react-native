// components react
import { useState, useRef, useContext } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import ColorPicker from "react-native-wheel-color-picker";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  TextInput,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// componenst native base
import { Box, Button, TextArea, Select, CheckIcon } from "native-base";

// components
import { UserContext } from "../../Context/UserContext";
import { GetCategoriesUser } from "../Common/Hooks/getCategoriesUser";
import { GetUser } from "../Common/Hooks/getUser";

// api
import { API } from "../../Config/api";
// -----------------------------------------------------------

const AddTodo = ({ navigation }) => {
  // dispatch
  const [state, dispatch] = useContext(UserContext);

  // data categories & user
  const { categoriesUser, refetchCategoriesUser } = GetCategoriesUser();
  const { refetchUser } = GetUser();

  // state form & date
  const [form, setForm] = useState({
    user_id: state?.user?.id,
    title: "",
    category_id: "",
    description: "",
    bg_color: "",
    date: "",
  });

  // state error
  const [error, setError] = useState({
    title: "",
    categoryId: "",
    description: "",
    bgColor: "",
    date: "",
  });

  // state color picker
  const pickerRef = useRef(null);
  const [colorPickerVisible, setColorPickerVisibility] = useState(false);
  const [swatchesOnly, setSwatchesOnly] = useState(false);
  const [swatchesEnabled, setSwatchesEnabled] = useState(true);
  const [disc, setDisc] = useState(false);
  // const [swatchesLast, setSwatchesLast] = useState(false);

  // handle toggle color
  const handleColorToggle = () => {
    setColorPickerVisibility(!colorPickerVisible);
  };

  // handle change
  const handleChange = (data, value) => {
    setForm((prevForm) => ({ ...prevForm, [data]: value }));

    if (data === "title") {
      setError((prevError) => ({
        ...prevError,
        title: value.trim() === "" ? "Title is required" : "",
      }));
    }

    if (data === "category_id") {
      setError((prevError) => ({
        ...prevError,
        categoryId: isNaN(value) ? "Category is required" : "",
      }));
    }

    if (data === "bg_color") {
      setError((prevError) => ({
        ...prevError,
        bgColor: value.trim() === "" ? "Color is required" : "",
      }));
    }

    if (data === "date") {
      setError((prevError) => ({
        ...prevError,
        date: !value ? "Date is required" : "",
      }));
    }

    if (data === "description") {
      setError((prevError) => ({
        ...prevError,
        description: value.trim() === "" ? "Description is required" : "",
      }));
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
          refetchUser();
          refetchCategoriesUser();
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
    } catch (error) {
      console.log("todo failed to add", error);
    }
  };

  // show date
  const showDatepicker = (currentMode) => {
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

  return (
    <SafeAreaView style={styles.containerAddList}>
      <ScrollView>
        <Box style={styles.todoContainer}>
          <Text style={styles.titleTodo}>Add Todo</Text>
          <Box style={styles.contentInputTodo}>
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
              {categoriesUser?.map((category, index) => (
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
          <Box style={styles.dateInput}>
            <Button
              style={styles.dateButton}
              onPress={() => showDatepicker("date")}
            />
            <Text style={styles.textDate}>
              {form.date ? form.date.toLocaleDateString() : "Date"}
            </Text>
            <Icon name="calendar" size={20} color="black" style={styles.imgDate} />
          </Box>
          {error.date && <Text style={styles.errorTodo}>{error.date}</Text>}
          <Box style={styles.containerDescription}>
            <TextArea
              h={40}
              style={styles.contentDescription}
              placeholder="Description"
              onChangeText={(value) => handleChange("description", value)}
              value={form.description}
              focusOutlineColor={"transparent"}
            />
          </Box>
          {error.description && (
            <Text style={styles.errorTodo}>{error.description}</Text>
          )}
          <Box style={styles.contentInputTodo}>
            <TextInput
              editable={false}
              style={styles.textInputTodo}
              placeholder="Color"
              value={form.bg_color}
            />
            <TouchableOpacity
              style={styles.btnChooseColor}
              onPress={handleColorToggle}
            >
              <Text style={styles.textBtnChooseColor}> Choose Color</Text>
            </TouchableOpacity>
          </Box>
          {error.bgColor && (
            <Text style={styles.errorTodo}>{error.bgColor}</Text>
          )}
          {colorPickerVisible && (
            <Box style={styles.containerColor}>
              <ColorPicker
                ref={pickerRef}
                color={form.bg_color}
                swatchesOnly={swatchesOnly}
                // onColorChange={onColorChange}
                onColorChangeComplete={(value) =>
                  handleChange("bg_color", value)
                }
                thumbSize={40}
                sliderSize={20}
                noSnap={true}
                row={false}
                swatches={swatchesEnabled}
                discrete={disc}
                style={styles.colorPicker}
              />
              <Text style={styles.textColorPicker}>
                Hashcode: {form.bg_color.toUpperCase()}
              </Text>
            </Box>
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
  contentInputTodo: {
    width: "80%",
    alignSelf: "center",
  },
  textInputTodo: {
    width: "100%",
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#DCDCDC",
  },
  containerSelectCategory: {
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#DCDCDC",
  },
  selectCategory: {
    height: 50,
    fontSize: 14,
    color: "grey",
    overflow: "hidden",
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
    borderRadius: 10,
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
  imgDate: {
    width: 25,
    height: 25,
    position: "absolute",
    right: 10,
  },
  containerDescription: {
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#DCDCDC",
  },
  contentDescription: {
    width: "100%",
    borderRadius: 10,
    fontSize: 15,
    backgroundColor: "#DCDCDC",
  },
  btnChooseColor: {
    width: "40%",
    height: 50,
    position: "absolute",
    right: 0,
    alignSelf: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "grey",
    backgroundColor: "#DCDCDC",
  },
  textBtnChooseColor: {
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "800",
    color: "grey",
  },
  containerColor: {
    width: "80%",
    height: 400,
    alignSelf: "center",
    borderRadius: 10,
  },
  colorPicker: {
    width: "100%",
    height: "100%",
  },
  textColorPicker: {
    width: "100%",
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "800",
    color: "grey",
  },
  buttonTodo: {
    width: "80%",
    height: 50,
    marginVertical: 20,
    alignSelf: "center",
    borderRadius: 10,
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
