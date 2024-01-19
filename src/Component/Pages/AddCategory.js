// components react
import { useState, useContext } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// components native base
import { Box, Select, CheckIcon, HStack } from "native-base";

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
        bgColor: value.trim() === "" ? "Color is required" : "",
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

        const response = await API.post("/category", body, config);
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

  return (
    <SafeAreaView style={styles.containerAddCategory}>
      <ScrollView>
        <Box style={styles.categoryContainer}>
          <Text style={styles.titleCategory}>Add Category</Text>
          <Box>
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
            <Text style={styles.errorCategory}>{error.bgColor}</Text>
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
  textInputCategory: {
    width: "80%",
    height: 50,
    alignSelf: "center",
    paddingHorizontal: 15,
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
    borderRadius: 5,
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "center",
    flexWrap: "wrap",
    rowGap: 5,
    columnGap: 3,
  },
  contentCategory: {
    height: 30,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  listCategory: {
    width: "100%",
    paddingHorizontal: 15,
    borderRadius: 5,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 11,
    fontWeight: "800",
    color: "whitesmoke",
  },
});

export default AddCategory;
