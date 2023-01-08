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
    const [select, setSelect] = useState();
    console.log("State select:", select)

    useEffect(() => {
       category_id: select
    }, [])

    // state form for post data
    const [form, setForm] = useState({
        name: "",
        category_id: "",
        date: "",
        description: "",
    });

    // state error
    const [error, setError] = useState({
        name: '',
        category: "",
        date: "",
        description: "",
    })
    console.log("state form:", form)

    // handle change
    const handleChange = (name, value) => {
        setForm({...form,[name]: value
        })
    }

    // handle submit category
    const handleSubmit =  async () => {
        try {
            // object error message
            const messageError = {
                name: "",
                category: "",
                date: "",
                description: "",
            }

            // validasi form name
            if (form.name === "") {
                messageError.name = "Name must be filled out";
            } else {
                messageError.name = ""
            }

            // validasi form category
            if (form.category === "") {
                messageError.category = "Category must be filled out";
            } else {
                messageError.category = ""
            }

            // // validasi form date
            if (form.date === "") {
                messageError.date = "Date must be filled out";
            } else {
                messageError.date = ""
            }

            // validasi form description
            if (form.description === "") {
                messageError.description = "Description must be filled out";
            } else {
                messageError.description = ""
            }

            if (messageError.name === "" &&
                messageError.category === "" &&
                messageError.date === "" &&
                messageError.description === ""
                ) {
                 // Insert data
                const response = await API.post('/course', {
                    category_id: [],
                    date: date,
                    description: form.description,
                    name: form.name
                  });
                refetchCategory()
                alert("List has been added")
                navigation.navigate('ListTodo'); 
                } else {
                    setError(messageError)
                }
          } catch (err) {
              console.log(err)
          }
      }

    // date
    const [date, setDate] = useState(new Date(1598051730000));
    console.log("state date :", date)

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

    // get countries for list categories
    let { data: listCategory, refetch: refetchCategory} = useQuery('listCategoriesCache', async () => {
        const response = await API.get(`/category`);
        if(response.status == 200) {
            setCategories(response.data)
        }      
    });
    return (
        <>
            <Box>
                    <Text style={styles.title}>Add List</Text>
                    {/* name */}
                    <TextInput style={styles.textInput} placeholder="Name" onChangeText={(value) => handleChange("name", value)} value={form.name}/>
                    {error.name && <Text style={{width:'80%', alignSelf:'center', color:'red'}}>{error.name}</Text>}

                    {/* category */}
                    <Box style={styles.selectInput}>
                        <Select style={{fontSize:14, marginLeft: 5}} selectedValue={select} placeholder="Category" _selectedItem={{ bg: "teal.200" }} onValueChange={(select) => {setSelect(select)}} value={form.category}>
                                {/* looping categories */}
                                {categories?.map((item, i) => {
                                    return (
                                        <Select.Item label={item?.name} value={item?._id} key={i}/>   
                                    )
                                })}  
                        </Select>   
                    </Box>
                    {error.category && <Text style={{width:'80%', alignSelf:'center', color:'red'}}>{error.category}</Text>}

                    {/* date */}
                    <Box style={styles.dateInput}>
                        <Button onChangeText={(value) => handleChange("date", value)} value={form.date} style={styles.dateButton} onPress={showDatepicker}/>
                        {date.toLocaleDateString()}
                        <Image style={{width: 25, height: 25, position:'absolute', right:15}} source={require('../assets/calender.png')} alt=""/>
                    </Box>
                    {error.date && <Text style={{width:'80%', alignSelf:'center', color:'red'}}>{error.date}</Text>}

                    {/* description */}
                    <Box style={styles.textArea}>
                        <TextArea style={{fontSize:15, paddingLeft: 20}} h={40} placeholder="Description" w="100%" onChangeText={(value) => handleChange("description", value)} value={form.description} />
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