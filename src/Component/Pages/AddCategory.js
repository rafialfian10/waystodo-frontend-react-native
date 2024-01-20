// components react
import { useState, useContext, useRef } from "react";
import ColorPicker from "react-native-wheel-color-picker";
import {
  StyleSheet,
  TextInput,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";

// components native base
import { Box, HStack } from "native-base";

// components
import { UserContext } from "../../Context/UserContext";
import { GetCategoriesUser } from "../Common/Hooks/getCategoriesUser";

// api
import { API } from "../../Config/api";
// ----------------------------------------------

const AddCategory = ({ navigation }) => {
  // dispatch
  const [state, dispatch] = useContext(UserContext);

  // data categories
  const { categoriesUser, refetchCategoriesUser } = GetCategoriesUser();

  // state form
  const [form, setForm] = useState({
    user_id: state?.user?.id,
    category_name: "",
    bg_color: "",
  });

  const [error, setError] = useState({
    categoryName: "",
    bgColor: "",
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

  // const onColorChange = (color) => {
  //   setForm((prevForm) => ({ ...prevForm, bg_color: color }));
  // };

  // handle change
  const handleChange = (data, value) => {
    setForm((prevForm) => ({ ...prevForm, [data]: value }));

    if (data === "category_name") {
      setError((prevError) => ({
        ...prevError,
        categoryName: value.trim() === "" ? "Category is required" : "",
      }));
    }

    if (data === "bg_color") {
      setError((prevError) => ({
        ...prevError,
        bgColor: value === "" ? "Color is required" : "",
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
        categoryName: form.category_name === "" ? "Category is required" : "",
        bgColor: form.bg_color === "" ? "Color is required" : "",
      };

      if (!messageError.categoryName && !messageError.bgColor) {
        const body = JSON.stringify(form);
        console.log(body);

        const response = await API.post("/category", body, config);
        console.log(response.data);
        if (response.data.status === 201) {
          alert("Category has been added");
          refetchCategoriesUser();
          setForm({
            user_id: state?.user?.id,
            category_name: "",
            bg_color: "",
          });
          navigation.navigate("AddCategory");
        }
      } else {
        setError(messageError);
      }
    } catch (error) {
      console.log("category failed to add", error);
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

      const response = await API.delete(`/category/${id}`, config);

      if (response?.status === 200) {
        alert("Category has been deleted");
        refetchCategoriesUser();
      }
    } catch (error) {
      console.log("category failed to delete", error);
    }
  }; 

  return (
    <SafeAreaView style={styles.containerAddCategory}>
      <ScrollView>
        <Box style={styles.categoryContainer}>
          <Text style={styles.titleCategory}>Add Category</Text>
          <Box style={styles.contentInputCategory}>
            <TextInput
              style={styles.textInputCategory}
              placeholder="Category"
              maxLength={15}
              onChangeText={(value) => handleChange("category_name", value)}
              value={form.category_name}
            />
          </Box>
          {error.categoryName && (
            <Text style={styles.errorCategory}>{error.categoryName}</Text>
          )}
          <Box style={styles.contentInputCategory}>
            <TextInput
              editable={false}
              style={styles.textInputCategory}
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
            <Text style={styles.errorCategory}>{error.bgColor}</Text>
          )}
          {colorPickerVisible && (
            <Box style={styles.containerColor}>
              <ColorPicker
                ref={pickerRef}
                color={form.bg_color}
                swatchesOnly={swatchesOnly}
                // onColorChange={onColorChange}
                onColorChangeComplete={(value) => handleChange("bg_color", value)}
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
          <TouchableOpacity
            style={styles.buttonCategory}
            onPress={handleSubmit}
          >
            <Text style={styles.textBtnCategory}>Add category</Text>
          </TouchableOpacity>
          <Text style={styles.titleCategory}>List Category</Text>
          <HStack style={styles.containerCategory}>
            {categoriesUser?.map((category, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onLongPress={() => {
                    Alert.alert("Delete Category", `Are you sure?`, [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: () => handleDelete(category.id),
                      },
                    ]);
                  }}
                >
                  <Box
                    key={i}
                    style={{
                      ...styles.contentCategory,
                      backgroundColor: category?.bgColor,
                    }}
                  >
                    <Text style={styles.listCategory}>
                      {category?.categoryName}
                    </Text>
                  </Box>
                </TouchableOpacity>
              );
            })}
          </HStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerAddCategory: {
    flex: 1,
  },
  categoryContainer: {
    width: "100%",
  },
  titleCategory: {
    width: "80%",
    marginTop: 50,
    marginBottom: 20,
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "800",
  },
  contentInputCategory: {
    width: "80%",
    alignSelf: "center",
  },
  textInputCategory: {
    width: "100%",
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 10,
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
  errorCategory: {
    width: "80%",
    marginBottom: 15,
    alignSelf: "center",
    fontSize: 11,
    color: "red",
  },
  buttonCategory: {
    width: "80%",
    height: 50,
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "#FF5555",
  },
  textBtnCategory: {
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "800",
    color: "white",
  },
  containerCategory: {
    width: "80%",
    marginBottom: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "center",
    flexWrap: "wrap",
    rowGap: 10,
    columnGap: 3,
  },
  contentCategory: {
    height: 30,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  listCategory: {
    width: "100%",
    paddingHorizontal: 15,
    borderRadius: 10,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 11,
    fontWeight: "800",
    color: "whitesmoke",
  },
});

export default AddCategory;
