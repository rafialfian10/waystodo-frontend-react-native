import { Text, Box, Image, Button, TextArea, Select } from 'native-base';
import { StyleSheet, TextInput } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import  React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import moment from 'moment';

// api
import { API } from './Config/api';

const AddList = ({navigation}) => {

    // state category for query data
    const [categories, setCategories] = useState()

    // state
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(null);
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState("");

    // get categories for list categories
    let { data: listCategory, refetch: refetchCategories} = useQuery('categoryCache', async () => {
        const response = await API.get(`/category?$lookup=*`);
        setCategories(response.data)
    });

    useEffect(() => {
        refetchCategories();
    }, [])

    // state error
    const [error, setError] = useState({
        title: "",
        category: "",
        date: "",
        description: "",
    })

    // handle submit category
    const handleSubmit =  async () => {
        try {
            const config = {
                headers : {
                    "Content-type": "application/json"
                }
            }
            
            // object error message
            const messageError = {
                title: "",
                category: "",
                date: "",
                description: "",
            }

            // validasi form title
            if (title === "") {
                messageError.title = "Title must be filled out";
            } else {
                messageError.title = ""
            }

            // validasi form category
            if (category === "") {
                messageError.category = "Category must be filled out";
            } else {
                messageError.category = ""
            }

            // validasi form date
            if (date === "") {
                messageError.date = "Date must be filled out";
            } else {
                messageError.date = ""
            }

            // validasi form description
            if (description === "") {
                messageError.description = "Description must be filled out";
            } else {
                messageError.description = ""
            }

            if (messageError.title === "" &&
                messageError.category === "" &&
                messageError.date === "" &&
                messageError.description === ""
                ) {

                const data = {
                    title: title,
                    category: category,
                    date: moment(date).format("YYYY-MM-DD"),
                    description: description,
                }

                const resetForm = () => {
                    setTitle("");
                    setCategory(null);
                    setDate(new Date());
                    setDescription("");
                };
                
                // Insert data
                const response = await API.post('/course', data, config);
                if(response) {
                    resetForm();
                    refetchCategories();
                    alert("List has been added");
                    navigation.navigate('ListTodo'); 
                }
            } else {
                setError(messageError)
            }
          } catch (err) {
              console.log(err)
          }
      }

    // date
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setDate(currentDate);
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
      showMode('date');
    };
    // end date

    return (
        <>
            <Box>
                <Text style={styles.title}>Add List</Text>
                {/* title */}
                <Box style={styles.textInput}>
                    <TextInput placeholder="Title" onChangeText={(value) => setTitle(value)} value={title}/>
                </Box>
                {error.title && <Text style={{width:'80%', alignSelf:'center', color:'red'}}>{error.title}</Text>}

                {/* category */}
                <Box style={styles.selectInput}>
                    <Select style={{ fontSize: 14, marginLeft: 5 }} placeholder="Category" _selectedItem={{ bg: "teal.200" }} onValueChange={(value) => setCategory([value])}>
                        {categories?.map((item) => {
                            return (
                                <Select.Item key={item._id} label={item.title} value={!item._id ? category : item._id} />
                            )
                        })}
                    </Select>
                </Box>
                {error.category && <Text style={{width:'80%', alignSelf:'center', color:'red'}}>{error.category}</Text>}

                {/* date */}
                <Box style={styles.dateInput}>
                    <Button style={styles.dateButton} onPress={showDatepicker}/>
                    <Text>{date ? date.toLocaleDateString() : "Date"}</Text>
                    <Image style={{width: 25, height: 25, position:'absolute', right:15}} source={require('../assets/calender.png')} alt=""/>
                </Box>
                {error.date && <Text style={{width:'80%', alignSelf:'center', color:'red'}}>{error.date}</Text>}

                {/* description */}
                <Box style={styles.textArea}>
                    <TextArea style={{fontSize:15, paddingLeft: 20}} h={40} placeholder="Description" w="100%" onChangeText={(value) => setDescription(value)} value={description} />
                </Box>
                {error.description && <Text style={{width:'80%', alignSelf:'center', color:'red'}}>{error.description}</Text>}
                <Button style={styles.button} onPress={handleSubmit}><Text style={styles.text}>Add List</Text></Button>
            </Box>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10
    },
    countContainer: {
        alignItems: 'center',
        padding: 10
    },
    title: {
        paddingHorizontal: 40,
        paddingVertical: 5,
        fontSize: 25, 
        fontWeight: 'bold', 
        marginTop: 70,
        marginBottom:20,
    },
    textInput: {
        alignSelf: 'center',
        width: '80%', 
        height: 50, 
        backgroundColor: '#dcdcdc', 
        borderRadius: 5, 
        paddingLeft: 20, 
        justifyContent: 'center',
    },
    selectInput: {
        alignSelf: 'center',
        width: '80%', 
        height: 50, 
        backgroundColor: '#dcdcdc', 
        borderRadius: 5, 
        marginTop: 10,
        color: '#999999',
    },
    dateInput: {
        position:'relative',
        alignSelf: 'center',
        width: '80%', 
        height: 50, 
        backgroundColor: '#dcdcdc', 
        borderRadius: 5, 
        marginTop: 10,
        paddingHorizontal:17,
        color: '#999999',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
    },
    dateButton: {
        width:'100%', 
        backgroundColor:'transparent', 
        height:50, 
        position:'absolute', 
        display:'flex', 
        flexDirection:'row', 
        justifyContent:'space-around'
    },
    textArea: {
        width: '80%',
        alignSelf: 'center',
        backgroundColor: '#dcdcdc',
    },
    button: {
        width: '80%', 
        height: 50, 
        marginTop: 20,
        padding: 10,
        alignSelf: 'center',
        backgroundColor: '#FF5555',
        borderRadius: 5,
      },
    text: {
        display:'flex',
        alignItems:'center',
        color: 'white',
        fontWeight: '800',  
    },
})

export default AddList