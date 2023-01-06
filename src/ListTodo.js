import { Text, Box, Image, Button, Select } from 'native-base';
import { StyleSheet, TextInput, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import  React, { useState, useEffect } from 'react';

const ListTodo = ({navigation}) => {
    const [text, setText] = useState('');

    // state select category
    const [course, setCourse] = useState()

    useEffect(() => {
        (async () => {
            const response = await API.get(`/course`);
            setCategory(response.data);
        })()
    }, [])

     // state select status
     const [status, setStatus] = React.useState("");

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
  
    const showTimepicker = () => {
      showMode('time');
    };

    const handleDetailList = () => {
        navigation.navigate("DetailList")
    }
    return (
        <SafeAreaView>
            <ScrollView>
                <Box style={styles.container}>
                    {/* Content profile */}
                    <Box style={styles.contentProfile1}>
                        <Box style={styles.contentProfile2}>
                            <Text style={styles.text}>Hi Rafi</Text>
                            <Text style={styles.lists}>200 Lists</Text>
                        </Box>
                        <Image source={require('../assets/saitama.png')} style={styles.photo} alt=""/>
                    </Box>

                    {/* Content input */}
                    <TextInput style={styles.textInput1} placeholder="Search List....." onChangeText={newText => setText(newText)}defaultValue={text}/>
                    <Box style={styles.contentInput}>
                        {/* date */}
                        <Box style={styles.selectInput}>
                            <Button style={{width:'100%', backgroundColor:'transparent', height:50}} onPress={showDatepicker}>
                                <Box style={{width:'100%', display:'flex', flexDirection:'row', justifyContent: 'space-around', alignItems:'center'}}>
                                    {!date ===  "" ? <Text style={{fontSize:11, marginRight:20, color:'grey'}}>{date.toLocaleDateString()}</Text> : <Text style={{fontSize:11, marginRight:20, color:'grey'}}>Date</Text>}
                                    <Image style={{width: 20, height: 20}} source={require('../assets/calender.png')} alt=""/>
                                </Box>
                            </Button>
                        </Box>
                        
                        {/* category */}
                        <Box style={styles.selectInput}>
                            <Select style={{fontSize:11, height:45}} selectedValue={category} placeholder="Category" onValueChange={itemValue => {setCategory(itemValue);}}>
                                 {/* looping course */}
                                {/* <FlatList data={category ? category : null} renderItem={({ item }) => {
                                    return (
                                        <Box>
                                            <Text style={styles.studyStatus}>{item.name}</Text>
                                        </Box>
                                    )
                                }} keyExtractor={(item, index) => index} /> */}
                                <Select.Item label="Study" value="study" />
                                <Select.Item label="Home Work" value="homework" />
                                <Select.Item label="Workout" value="workout" />
                            </Select>
                        </Box>

                        {/* status */}
                        <Box style={styles.selectInput}>
                            <Select style={{fontSize:11, height:45}} selectedValue={status} placeholder="Status" onValueChange={itemValue => {setStatus(itemValue);}}>
                                <Select.Item label="Checked" value="checked" />
                                <Select.Item label="Unchecked" value="unchecked" />
                            </Select>
                        </Box>
                    </Box>

                    {/* Content study 1 */}
                    <Box style={{width: 350, paddingVertical:10, paddingHorizontal:10, marginBottom: 20, backgroundColor: '#DAEFFF', borderRadius: 5, display:'flex', flexDirection:'row',justifyContent:'space-evenly', alignSelf:'center'}}>
                        <Box style={styles.contentStudy2}>
                            <Text style={styles.studyTitle}>Study - Golang</Text>
                            <Text style={styles.studyDesc}>Learn Golang to improve fundamentals and familiarize with coding</Text>
                            <Box style={styles.studyDate}>
                                <Image style={styles.studyImage} source={require('../assets/calender.png')} alt=""/>
                                <Text style={styles.studyDesc} >19 July 2022</Text>
                            </Box>
                        </Box>

                        <Box style={styles.contentStudy3}>
                            <Text onPress={handleDetailList} style={styles.studyStatus}>Study</Text>
                            <Image style={styles.studyImageStatus} source={require('../assets/ellipse.png')} alt=""/>
                        </Box>
                    </Box>

                    {/* Content study 2 */}
                    <Box style={{width: 350, paddingVertical:10, paddingHorizontal:10, marginBottom: 20, backgroundColor: '#F1FFEF', borderRadius: 5, display:'flex', flexDirection:'row',justifyContent:'space-evenly', alignSelf:'center'}}>
                        <Box style={styles.contentStudy2}>
                            <Text style={styles.studyTitle}>Home Work - Mathemathics</Text>
                            <Text style={styles.studyDesc}>Do home work math probability</Text>
                            <Box style={styles.studyDate}>
                                <Image style={styles.studyImage} source={require('../assets/calender.png')} alt=""/>
                                <Text style={styles.studyDesc} >19 July 2022</Text>              
                            </Box>
                        </Box>

                        <Box style={styles.contentStudy3}>
                            <Text onPress={handleDetailList} style={styles.studyStatus}>Home Work</Text>
                            <Image style={styles.studyImageStatus} source={require('../assets/check.png')} alt=""/>
                        </Box>
                    </Box>
                   
                    {/* Content study 3 */}
                    <Box style={{width: 350, paddingVertical:10, paddingHorizontal:10, marginBottom: 20, backgroundColor: '#FFEFEF', borderRadius: 5, display:'flex', flexDirection:'row',justifyContent:'space-evenly', alignSelf:'center'}}>
                        <Box style={styles.contentStudy2}>
                            <Text style={styles.studyTitle}>Study - HTML</Text>
                            <Text style={styles.studyDesc}>Learn HTML to improve fundamentals and familiarize with coding</Text>
                            <Box style={styles.studyDate}>
                                <Image style={styles.studyImage} source={require('../assets/calender.png')} alt=""/>
                                <Text style={styles.studyDesc} >19 July 2022</Text>
                            </Box>
                        </Box>

                        <Box style={styles.contentStudy3}>
                            <Text onPress={handleDetailList} style={styles.studyStatus}>Study</Text>
                            <Image style={styles.studyImageStatus} source={require('../assets/check.png')} alt=""/>
                        </Box>
                    </Box>

                    {/* Content study 4 */}
                    <Box style={{width: 350, paddingVertical:10, paddingHorizontal:10, marginBottom: 20, backgroundColor: '#FEFFDA', borderRadius: 5, display:'flex', flexDirection:'row',justifyContent:'space-evenly', alignSelf:'center'}}>
                        <Box style={styles.contentStudy2}>
                            <Text style={styles.studyTitle}>Study - JavaScript</Text>
                            <Text style={styles.studyDesc}>Learn JavaScript to improve fundamentals and familiarize with coding</Text>
                            <Box style={styles.studyDate}>
                                <Image style={styles.studyImage} source={require('../assets/calender.png')} alt=""/>
                                <Text style={styles.studyDesc} >19 July 2022</Text>
                            </Box>
                        </Box>

                        <Box style={styles.contentStudy3}>
                            <Text onPress={handleDetailList} style={styles.studyStatus}>Study</Text>
                            <Image style={styles.studyImageStatus} source={require('../assets/ellipse.png')} alt=""/>
                        </Box>
                    </Box>
                </Box>         
                         
            </ScrollView>
            <Box style={styles.navbar}>
                <Button onPress={() => navigation.navigate("ListTodo")} style={styles.navbarButton}>
                <Image style={styles.navbarImage} source={require('../assets/red-clipboard-list.png')} alt=""/>
                </Button>
                <Button onPress={() => navigation.navigate("AddList")} style={styles.navbarButton}>
                    <Image style={styles.navbarImage} source={require('../assets/white-task-list-add.png')} alt=""/>
                </Button>
                <Button onPress={() => navigation.navigate("AddCategory")} style={styles.navbarButton}>
                    <Image style={styles.navbarImage} source={require('../assets/white-category.png')} alt=""/>
                </Button>
            </Box>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingBottom: 60,
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
    // contentStudy: {
    //     width: 350,
    //     paddingVertical:10,
    //     paddingHorizontal:10,
    //     marginBottom: 20,
    //     backgroundColor: '#DAEFFF',
    //     borderRadius: 5,
    //     display:'flex',
    //     flexDirection:'row',
    //     justifyContent:'space-evenly',
    //     alignSelf:'center',
    // },
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
        backgroundColor: '#81C8FF',
        color: 'white',
        fontSize:12,
        fontWeight: '800',
        borderRadius: 5,
        marginBottom: 10,
    },
    studyImageStatus: {
        width: 40,
        height: 40,
    },
    navbar: {
        position:'absolute',
        width: '100%',
        height: 60,
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#FFFFFF',
    },
    navbarButton: {
        backgroundColor:'transparent',
    },
    navbarImage: {
        width: 30,
        height: 30,
    }
  });

export default ListTodo