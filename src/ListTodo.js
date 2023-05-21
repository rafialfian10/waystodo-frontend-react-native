import { Text, Box, Image, Button, Select, Menu, Pressable, Checkbox } from 'native-base';
import { StyleSheet, TextInput, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import  React, { useState, useEffect, useContext, useMemo } from 'react';
import { useQuery } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

// user context
import { UserContext } from './Context/UserContext';

// api
import { API } from './Config/api';

const ListTodo = ({navigation}) => {

    const [state, dispatch] = useContext(UserContext);
    
    // state search
    const [search, setSearch] = useState("");

    // state checklist
    const [checklist, setChecklist] = useState(false);

    // state select status for filter
    const [status, setStatus] = useState(false);
    
    // state select course for filter
    const [course, setCourse] = useState("");

    // state select category for filter
    const [category, setCategory] = useState("");

    // state courses
    const [courses, setCourses] = useState([]);
    
    // state select categories
    const [categories, setCategories] = useState([]);

    // get user
    let { data: user} = useQuery('userCache', async () => {
        const response = await API.get(`/auth/user`);
        return response.data
    });
    
    // get courses 
    let { data: allCourses, refetch: refetchAllCourses } = useQuery('coursesCaches', async () => {
        const response = await API.get(`/course?$lookup=*`);
        setCourses(response.data)
    });

    // get categories 
    let { data: allCategories, refetch: refetchAllCategories} = useQuery('categoriesCache', async () => {
        const response = await API.get(`/category?$lookup=*`);
        setCategories(response.data);
    });

    // handle search
    const handleSearch = (value) => {
        setSearch(value)
    } 

    // filter category
    // const filteredCourses = useMemo(() => {
    //     if (!course) {
    //         return courses;
    //     }

    //     return courses.filter((item) => {
    //         const isCourses = item.title.toLowerCase().includes(course.toLowerCase());
    //         return isCourses;
    //     });
    // }, [courses, course]);

    const handleCheck =  async (id, item) => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',         
                },
            };

            // Mengubah nilai item.checklist menjadi kebalikan nilainya
            const updatedChecklist = !item.checklist; 

            const body = {
                checklist: updatedChecklist,
            };
            // console.log("Body", body);

            const response = await API.patch(`/course/${id}`, body, config); 
            if(response) {
                alert(updatedChecklist ? "Category has been checked" : "Category has been unchecked"); 

                setChecklist(updatedChecklist);
            }      
        } catch (err) {
            console.log(err)
        }
    }
      
    // state date
    const [date, setDate] = useState(new Date(1598051730000));

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

    // handle logout
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        dispatch({
            type: 'LOGOUT',
            payload: {},
        });
        navigation.navigate('Index');
        alert("Logout successfully");
    }
    // end handle logout

    // array color
    const color = ['#CDF5F6', '#F9D8D6', '#EFF9DA', '#D6CDEA', '#D3D3D3']

    // function random color
    const randomColors = () => {
        const randomColor = Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0');
        return `#${randomColor}`;
    };

    useEffect(() => {
        refetchAllCourses();
        refetchAllCategories();
    }, [allCourses, allCategories])

    return (
        <SafeAreaView>
            {/* Content profile */}
            <Box style={styles.contentProfile1}>
                <Box style={styles.contentProfile2}>
                    <Text style={styles.text}>{user?.firstName}</Text>
                    <Text style={styles.lists}>{courses?.length} Lists</Text>
                </Box>
                <Menu w="190" trigger={triggerProps => {
                    return <Pressable {...triggerProps}>
                    <Image source={require('../assets/saitama.png')} style={styles.photo} alt=""/></Pressable>;}}>
                    <Menu.Item>Profile</Menu.Item>
                    <Menu.Item onPress={handleLogout}>Logout</Menu.Item>
                </Menu>
            </Box>
            <ScrollView>
                <Box style={styles.container}>
                    {/* search */}
                    <TextInput style={styles.textInput1} placeholder="Search List....." onChangeText={(value) => handleSearch(value)} value={search}/>
                    <Box style={styles.contentInput}>
                        {/* filter date */}
                        <Box style={styles.selectInput}>
                            <Button style={{width:'100%', backgroundColor:'transparent', height:50}} onPress={showDatepicker}>
                                <Box style={{width:'100%', display:'flex', flexDirection:'row', justifyContent: 'space-around', alignItems:'center'}}>
                                    {date ===  "" ? <Text style={{fontSize:10, marginRight:20, color:'grey'}}>{date.toLocaleDateString()}</Text> : <Text style={{fontSize:11, marginRight:20, color:'grey'}}>Date</Text>}
                                    <Image style={{width: 20, height: 20}} source={require('../assets/calender.png')} alt=""/>
                                </Box>
                            </Button>
                        </Box>
                        
                        {/* filter category */}
                        <Box style={styles.selectInput}>
                            <Select style={{fontSize:10, height:45}} _selectedItem={{ bg: "teal.200" }} placeholder="Category" selectedValue={category}onValueChange={(itemValue) => { setCategory(itemValue); }}>
                                {/* looping categories */}
                                {categories?.map((item) => {
                                    return (
                                        <Select.Item label={item.title} value={item._id} key={item._id} />
                                    )
                                })}
                            </Select>
                        </Box>

                        {/* filter status */}
                        <Box style={styles.selectInput}>
                            <Select style={{fontSize:10, height:45}} selectedValue={status} placeholder="Status" onValueChange={itemValue => {setStatus(itemValue);}}>
                                <Select.Item label="Checked" value="true" />
                                <Select.Item label="Unchecked" value="false" />
                            </Select>
                        </Box>
                    </Box>

                    {/* Content study */}
                    {courses?.filter(itemSearch => {
                        if(search == "") {
                            return itemSearch
                        } else if(itemSearch.title.toLowerCase().includes(search.toLocaleLowerCase())) {
                            return itemSearch
                        }
                    }).map((item, i) => {
                        return (
                        <Box style={{width: '95%', paddingVertical:10, paddingHorizontal:10, marginBottom: 20, backgroundColor: color[i], borderRadius: 5, display:'flex', flexDirection:'row',justifyContent:'space-evenly', alignSelf:'center'}} key={item._id}>
                            <Box style={styles.contentStudy2}>
                                <Text style={styles.studyTitle} onPress={() => navigation.push('DetailList', {courses: courses[i], bgColor:color[i]})}>{item.title}</Text>
                                <Text style={styles.studyDesc}>{item.description}</Text>
                                <Box style={styles.studyDate}>
                                    <Image style={styles.studyImage} source={require('../assets/calender.png')} alt=""/>
                                    <Text style={styles.studyDesc} >{item.date}</Text>
                                </Box>
                            </Box>

                            <Box style={styles.contentStudy3} key={item._id}>
                                {item.category?.map((cat) => {
                                    {if(cat?.title === "study") {
                                        return (
                                            <Box style={styles.contentCheckbox} key={cat?._id}>
                                                <Box style={{backgroundColor:"#81C8FF", borderRadius:5, height:35, marginBottom: 10}}>
                                                    <Text style={styles.studyStatus}>{cat?.title}</Text>
                                                </Box>
                                                <Checkbox padding={3} rounded={'full'} size="lg" colorScheme="green" aria-label="Label Checkbox" value={item.checklist} onPress={() => handleCheck(item._id)} />
                                            </Box>
                                        )
                                    } else if(cat?.title === "home work"){
                                        return (
                                            <Box style={styles.contentCheckbox} key={cat?._id}>
                                                <Box style={{backgroundColor:"#FF8181", borderRadius:5, height:35, marginBottom: 10}}>
                                                    <Text style={styles.studyStatus}>{cat?.title}</Text>
                                                </Box>
                                                <Checkbox padding={3} rounded={'full'} size="lg" colorScheme="green" aria-label="Label Checkbox" value={item.checklist} onPress={() => handleCheck(item._id)} />
                                            </Box>
                                        )
                                    } else if(cat?.title === "workout"){
                                        return (
                                            <Box style={styles.contentCheckbox} key={cat?._id}>
                                                <Box style={{backgroundColor:'#FFB681', borderRadius:5, height:35, marginBottom: 10}}>
                                                    <Text style={styles.studyStatus}>{cat?.title}</Text>
                                                </Box>
                                                <Checkbox padding={3} rounded={'full'} size="lg" colorScheme="green" aria-label="Label Checkbox" value={item.checklist} onPress={() => handleCheck(item._id)} />
                                            </Box>
                                        )
                                    } else {
                                        return (
                                            <Box style={styles.contentCheckbox} key={cat?._id}>
                                                <Box style={{height:35, marginBottom: 10, backgroundColor: randomColors(), borderRadius: 5}}>
                                                    <Text style={styles.studyStatus}>{cat?.title}</Text>
                                                </Box>
                                                <Checkbox padding={3} rounded={'full'} size="lg" colorScheme="green" aria-label="Label Checkbox" isChecked={item?.checklist} value={item?.checklist} onPress={() => handleCheck(item?._id, item)} />
                                            </Box>
                                        )
                                    }}
                                })}
                            </Box>
                        </Box>
                    )})}
                </Box>                    
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      paddingHorizontal: 10,
      marginBottom: 200
    },
    countContainer: {
        alignItems: 'center',
        padding: 10
    },
    title: {
        fontSize: 25, 
        fontWeight: 'bold', 
        marginBottom:20
    },
    lists: {
        color: '#FF5555'
    },
    contentProfile1: {
        width: '95%',
        height: 80,
        display:'flex',
        alignSelf:'center',
        alignItems:'center',
        alignContent:'center',
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop: 40,
        marginBottom: 40,
        padding: 10,
    },
    contentProfile2: {
        height: 80,
        display: 'flex',
        justifyContent: 'center',
    },
    photo:{
        width: 60,
        height: 60, 
        borderRadius: 50,
    },
    text: {
        display: 'flex',
        alignItems: 'center',
        color: 'black',
        paddingVertical: 10,
        fontWeight: '800',
        fontSize: 25,
    },
    textInput1: {
        width: '95%', 
        height: 50, 
        backgroundColor: '#dcdcdc', 
        borderRadius: 5, 
        alignSelf:'center',
        marginBottom: 10,
        paddingLeft: 10,
        fontSize: 11,
    },
    contentInput: {
        width: '95%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginBottom: 40,
    },
    textInput2: {
        width: '32%', 
        height: 50, 
        backgroundColor: '#dcdcdc', 
        borderRadius: 5, 
        alignSelf:'center',
        marginBottom: 10,
        fontSize: 11,
        textAlign: 'center',
    },
    selectInput: {
        alignSelf: 'center',
        width: '32%', 
        height: 50, 
        backgroundColor: '#dcdcdc', 
        borderRadius: 5, 
        marginBottom: 10,
        color: '#999999',
    },
    contentStudy2: {
        width: '60%',
    },
    contentStudy3: {
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    studyTitle: {
        fontWeight: '800',
        fontSize: 15,
    },
    studyDesc: {
        fontSize: 12,
        marginBottom: 10,
    },
    studyImage: {
        marginRight: 10,
        width: 20,
        height: 20,
    },
    studyDate:{
        display: 'flex',
        flexDirection: 'row',
    },
    contentCheckbox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    studyStatus: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        color: 'white',
        fontSize:12,
        fontWeight: '800',
        borderRadius: 5,
    },
    studyImageStatus: {
        width: 40,
        height: 40,
    },
});

export default ListTodo