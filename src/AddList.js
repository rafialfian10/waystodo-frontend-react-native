import { Text, Box, Image, Button, TextArea, Select } from 'native-base';
import { StyleSheet, TextInput } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import  React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import moment from 'moment';

// api
import { API } from './config/api';

const AddList = ({navigation}) => {

    // state category for query data
    const [categories, setCategories] = useState()

    // state select
    const [names, setName] = useState()
    const [categorys, setCategory] = useState();
    const [dates, setDate] = useState(new Date());
    const [descriptions, setDescription] = useState();

    // get categories for list categories
    let { data: listCategory, refetch: refetchCategories} = useQuery('categoryCache', async () => {
    const response = await API.get(`/category`);
    setCategories(response.data)
    });

    useEffect(() => {
        listCategory
    }, [])

    // state error
    const [error, setError] = useState({
        name: '',
        category: "",
        date: "",
        description: "",
    })

    // handle submit category
    const handleSubmit =  async () => {
        try {

            // config
            const config = {
                headers : {
                    "Content-type": "application/json"
                }
            }
            // object error message
            const messageError = {
                name: "",
                category: "",
                date: "",
                description: "",
            }

            // validasi form name
            if (names === "") {
                messageError.name = "Name must be filled out";
            } else {
                messageError.name = ""
            }

            // validasi form category
            if (categorys === "") {
                messageError.category = "Category must be filled out";
            } else {
                messageError.category = ""
            }

            // // validasi form date
            if (dates === "") {
                messageError.date = "Date must be filled out";
            } else {
                messageError.date = ""
            }

            // validasi form description
            if (descriptions === "") {
                messageError.description = "Description must be filled out";
            } else {
                messageError.description = ""
            }

            if (messageError.name === "" &&
                messageError.category === "" &&
                messageError.date === "" &&
                messageError.description === ""
                ) {

                const body = {
                    name: names,
                    category: categorys,
                    date: moment(dates).format("YYYY-MM-DD"),
                    description: descriptions,
                }
                
                // Insert data
                const response = await API.post('/course', body, config);
                alert("List has been added")
                refetchCategories()
                navigation.push('ListTodo'); 
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
        value: dates,
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
                    {/* name */}
                    <TextInput style={styles.textInput} placeholder="Name" onChangeText={(value) => setName(value)}/>
                    {error.name && <Text style={{width:'80%', alignSelf:'center', color:'red'}}>{error.name}</Text>}

                    {/* category */}
                    <Box style={styles.selectInput}>
                        <Select style={{ fontSize: 14, marginLeft: 5 }} placeholder="Category" _selectedItem={{ bg: "teal.200" }} onValueChange={(value) => setCategory([value])}>
                            {/* looping categories */}
                            {categories?.map((item, i) => {
                                return (
                                    <Select.Item key={i} label={item.name} value={item._id} />
                                )
                            })}
                        </Select>
                    </Box>
                    {error.category && <Text style={{width:'80%', alignSelf:'center', color:'red'}}>{error.category}</Text>}

                    {/* date */}
                    <Box style={styles.dateInput}>
                        <Button style={styles.dateButton} onPress={showDatepicker}/>
                        <Text>{dates ? dates.toLocaleDateString() : "Select"}</Text>
                        <Image style={{width: 25, height: 25, position:'absolute', right:15}} source={require('../assets/calender.png')} alt=""/>
                    </Box>
                    {error.date && <Text style={{width:'80%', alignSelf:'center', color:'red'}}>{error.date}</Text>}

                    {/* description */}
                    <Box style={styles.textArea}>
                        <TextArea style={{fontSize:15, paddingLeft: 20}} h={40} placeholder="Description" w="100%" onChangeText={(value) => setDescription(value)} />
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
        alignSelf: 'center',
        backgroundColor: '#FF5555',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: 300, 
        height: 50, 
      },
    text: {
        display:'flex',
        alignItems:'center',
        color: 'white',
        fontWeight: '800',  
    },
})

export default AddList