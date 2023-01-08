import { Text, Box, Image, Button, Select, Menu, Pressable, Checkbox } from 'native-base';
import { StyleSheet, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import  React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

// api
import { API } from './config/api';

const ListTodo = ({navigation, CheckLogin}) => {
    
    // state search
    const [search, setSearch] = useState([])

    // state query
    const [query, setQuery] = useState("")

    useEffect(() => {

        const searchData = async () => {
            try {
                const {data: searchData, refetch: refetchSearch} = await API.get(`/course`)
                setSearch(search.results)
                console.log(searchData)
            } catch (error) {
                console.error(error)
            }
        }
        searchData()
    }, [query])

    // state select status
    const [status, setStatus] = useState();

    // state select category
    const [category, setCategory] = useState()

     // state courses
     const [courses, setCourses] = useState()
    
     // get courses 
     let { data: allCourses } = useQuery('coursesCaches', async () => {
         const response = await API.get(`/course?$lookup=*`);
         setCourses(response.data)
     });

     // state select categories for list
    const [categories, setCategories] = useState()

    // get categories 
    let { data: allCategories} = useQuery('categoryCache', async () => {
        const response = await API.get(`/category`);
        setCategories(response.data)  
    });

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
        try {
            const response = await API.post('auth/logout');
            if(response) {
                await AsyncStorage.removeItem("token")
            }
            
            CheckLogin()
        } catch (err) {
            console.log(err)
        }
    }
    // end handle logout

    // get user
    let { data: user} = useQuery('userCache', async () => {
        const response = await API.get(`/auth/user`);
        return response.data
    });

    // function color
    const generateColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0');
        return `#${randomColor}`;
    };

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

                    {/* Content input */}
                    <TextInput style={styles.textInput1} placeholder="Search List....." onChange={event => setQuery(event.target.value)}value={query}/>
                    <Box style={styles.contentInput}>
                        {/* date */}
                        <Box style={styles.selectInput}>
                            <Button style={{width:'100%', backgroundColor:'transparent', height:50}} onPress={showDatepicker}>
                                <Box style={{width:'100%', display:'flex', flexDirection:'row', justifyContent: 'space-around', alignItems:'center'}}>
                                    {date ===  "" ? <Text style={{fontSize:10, marginRight:20, color:'grey'}}>{date.toLocaleDateString()}</Text> : <Text style={{fontSize:11, marginRight:20, color:'grey'}}>Date</Text>}
                                    <Image style={{width: 20, height: 20}} source={require('../assets/calender.png')} alt=""/>
                                </Box>
                            </Button>
                        </Box>
                        
                        {/* category */}
                        <Box style={styles.selectInput}>
                            <Select style={{fontSize:10, height:45}} _selectedItem={{ bg: "teal.200" }}  selectedValue={category} placeholder="Category" onValueChange={itemValue => {setCategory(itemValue);}}>
                                {/* looping categories */}
                                {categories?.map((item, i) => {
                                    return (
                                        <Select.Item label={item.name} value={item._id} key={i} />
                                    )
                                })}
                            </Select>
                        </Box>

                        {/* status */}
                        <Box style={styles.selectInput}>
                            <Select style={{fontSize:10, height:45}} selectedValue={status} placeholder="Status" onValueChange={itemValue => {setStatus(itemValue);}}>
                                <Select.Item label="Checked" value="checked" />
                                <Select.Item label="Unchecked" value="unchecked" />
                            </Select>
                        </Box>
                    </Box>

                    {/* Content study */}
                    {courses?.map((item2, i) => {
                        return (
                            
                        <Box style={{width: '95%', paddingVertical:10, paddingHorizontal:10, marginBottom: 20, backgroundColor: generateColor(), borderRadius: 5, display:'flex', flexDirection:'row',justifyContent:'space-evenly', alignSelf:'center'}} key={i}>
                                <Box style={styles.contentStudy2}>
                                    <Text style={styles.studyTitle} onPress={() => navigation.push('DetailList', {courses: courses[i]})}>{item2.name}</Text>
                                    <Text style={styles.studyDesc}>{item2.description}</Text>
                                    <Box style={styles.studyDate}>
                                        <Image style={styles.studyImage} source={require('../assets/calender.png')} alt=""/>
                                        <Text style={styles.studyDesc} >{item2.date}</Text>
                                    </Box>
                                </Box>

                                <Box style={styles.contentStudy3}>
                                    {item2.category.map((cat, i) => {
                                        {if(cat.name === "study") {
                                            return (
                                                <Box style={{backgroundColor:"#81C8FF", borderRadius:5, height:35, marginBottom: 10}} key={i}>
                                                    <Text style={styles.studyStatus}>{cat.name}</Text>
                                                </Box>
                                            )
                                        } else if(cat.name === "home work"){
                                            return (
                                                <Box style={{backgroundColor:"#FF8181", borderRadius:5, height:35, marginBottom: 10}} key={i}>
                                                    <Text style={styles.studyStatus}>{cat.name}</Text>
                                                </Box>
                                            )
                                        } else if(cat.name === "workout"){
                                            return (
                                                <Box style={{backgroundColor:'#FFB681', borderRadius:5, height:35, marginBottom: 10}} key={i}>
                                                    <Text style={styles.studyStatus}>{cat.name}</Text>
                                                </Box>
                                            )
                                        } else {
                                            return (
                                                <Box style={{backgroundColor:'#D9D9D9', borderRadius:5, height:35, marginBottom: 10}} key={i}>
                                                    <Text style={styles.studyStatus}>{cat.name}</Text>
                                                </Box>
                                            )
                                        }}
                                    })}
                                    <Checkbox padding={3} rounded={'full'} value='value'  />
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
      paddingBottom: 150,
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
        width: 350,
        height: 80,
        display:'flex',
        alignSelf:'center',
        alignItems:'center',
        alignContent:'center',
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop: 40,
        marginBottom: 40,
    },
    contentProfile2: {
        display:'flex',
        justifyContent:'center',
        height: 80,
    },
    photo:{
        width:60,
        height:60, 
        borderRadius:50,
    },
    text: {
        display:'flex',
        alignItems:'center',
        color: 'black',
        fontWeight: '800',
        fontSize:25,
        paddingVertical:10,
    },
    textInput1: {
        width: 350, 
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
        alignSelf:'center',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
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
        width: 240,
    },
    contentStudy3: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    studyTitle: {
        fontWeight:'800',
        fontSize:15,
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