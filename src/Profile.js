import { Text, Box, Image, View, Menu, Pressable } from 'native-base';
import { StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from './Context/UserContext';
import { useRoute } from '@react-navigation/native';

// api
import { API } from './Config/api';

const Profile = () => {

    const route = useRoute();
    const { id } = route.params;

    const [state, dispatch] = useContext(UserContext);

    // state modal
    const [modalVisible, setModalVisible] = useState(false);

    // state form 
    const [form, setForm] = useState({
        firstName: '',
        email: '',
    });

    // state error
    const [error, setError] = useState({
        firstName: "",
        email: "",
    })

    // get detail profile
    let { data: getDetailProfile, isLoading: profileLoading, refetch: refetchProfile} = useQuery('getDetailProfileCache', async () => {
        const response = await API.get(`/Users/${id}`);
        return response.data;
    });

    // form update profile
    useEffect(() => {
        setForm({
          firstName: getDetailProfile?.firstName || "",
          email: getDetailProfile?.email || "",
        });
    }, [getDetailProfile]);
  
    // handle change
    const handleChange = (name, value) => {
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));

        setError((prevError) => ({
            ...prevError,
            [name]: '',
        }));
    };
  
    // handle update profile
    const handleUpdateProfile = async () => {
        // Validasi input
        let valid = true;
        const messageError = {
            firstName: "",
            email: "",
        };

        if (form.firstName.trim() === "") {
            messageError.firstName = "Name is required";
            valid = false;
        }

        if (form.email.trim() === "") {
            messageError.email = "Email is required";
            valid = false;
        }

        if (!valid) {
            setError(messageError);
            return;
        }

        try {
            const config = {
                headers: {
                  'Content-type': 'application/json',
                },
            };
  
            if (messageError.firstName === "" && messageError.email === "") {
                const body = JSON.stringify(form);
                const updatedProfile = {
                    firstName: form.firstName.trim(),
                    email: form.email.trim(),
                };
  
                const response = await API.patch(`/Users/${id}`, updatedProfile, config);
                console.log(response.data)
                if(response) {
                    alert("Profile has been updated");
                    setModalVisible(false);
                    refetchProfile();
                }
                
            } else {
                setError(messageError);
            }
        } catch (err) {
          console.log(err);
        }
    }

    if (profileLoading) {
        return (
            <View>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                <Box style={styles.profileContainer}>
                    <Menu w="190" trigger={triggerProps => { return <Pressable {...triggerProps} style={styles.hamburger}>
                        <Image source={require('../assets/hamburger.png')} style={styles.imgHamburger} alt=""/></Pressable>;}}>
                        <TouchableOpacity style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
                            <Text style={styles.textStyle}>Update profile</Text>
                        </TouchableOpacity>
                    </Menu>
                    <Box style={styles.contentProfile}>
                        <Box style={styles.contentName}>
                            <Text style={styles.firstName}>{getDetailProfile?.firstName}</Text>
                        </Box>
                        <Box style={styles.contentPhoto}>
                            <Image source={require('../assets/admin.png')} style={{width: '100%', height: '100%'}}  alt=''/>
                        </Box>
                    </Box>
                
                    <Box style={styles.contentDataProfile}>
                        <Box style={styles.subContentDataProfile}>
                            <Text style={styles.textKey}>Name : </Text>
                            <Text style={styles.textvalue}>{getDetailProfile?.firstName}</Text>
                        </Box>
                        <Box style={styles.subContentDataProfile}>
                            <Text style={styles.textKey}>Email : </Text>
                            <Text style={styles.textvalue}>{getDetailProfile?.email}</Text>
                        </Box>
                    </Box>
                    {/* Modal */}
                    <Box style={styles.contentModalProfile}>
                        <View style={styles.centeredView}>
                            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { Alert.alert('Modal has been closed.'); setModalVisible(!modalVisible);}}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                    
                                        <TextInput style={styles.textInput} onChangeText={(value) => handleChange("firstName", value)} value={form.firstName}/>
                                        {error.firstName && <Text style={{ width: '100%', alignSelf: 'center', color: 'red' }}>{error.firstName}</Text>}

                                        <TextInput style={styles.textInput} onChangeText={(value) => handleChange("email", value)} value={form.email}/>
                                        {error.email && <Text style={{ width: '100%', alignSelf: 'center', color: 'red' }}>{error.email}</Text>}

                                        <Box style={styles.btn}>
                                            <TouchableOpacity style={[styles.buttonModal, styles.buttonClose]} onPress={handleUpdateProfile}>
                                                <Text style={styles.textStyle}>Update</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={[styles.buttonModal, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                                                <Text style={styles.textStyle}>Cancel</Text>
                                            </TouchableOpacity>
                                        </Box>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </Box>
                </Box>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'white',
    },
    hamburger: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        right: 20,
        height: 40,
        zIndex: 100,
    },
    profileContainer: {
        width: '100%',
    },
    contentProfile: {
        width: '100%',
        height: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#40FEE4',
    },
    contentName: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 80,
    },
    firstName:{
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        margin: 5,
    },
    contentPhoto: {
        width: 80,
        height: 80,
        position: 'relative',
        left: 20,
        borderRadius: 40,
        backgroundColor: 'black',
        overflow: 'hidden',
        backgroundColor: '#87cefa',
    },
    contentDataProfile: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 70,
    },
    subContentDataProfile: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 15,
        borderColor: 'white',
        borderBottomColor: '#a9a9a9',
        borderWidth: 2,
    },
    textKey: {
        fontSize: 14,
        fontWeight: '700'
    },
    textvalue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#a9a9a9',
    },
    // Modal
    contentModalProfile: {
        width: '50%',
        height: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    centeredView: {
        width: '80%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    modalView: {
        width: '100%',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'flex-end',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        width: 160,
        alignSelf: 'center',
        borderRadius: 15,
        padding: 10,
        marginHorizontal: 5,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#00FCD9',
    },
    buttonClose: {
        backgroundColor: '#00FCD9',
    },
    buttonModal: {
        width: 80,
        borderRadius: 10,
        marginTop:10,
        padding: 10,
        marginHorizontal: 5,
        elevation: 2,
        backgroundColor: '#00FCD9',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    textInput: {
        width: '100%',
        height: 50,
        paddingLeft: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'white',
        borderBottomColor: '#00FCD9',
    },
    btn: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    }
})

export default Profile