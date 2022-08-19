import { StyleSheet, Image,Alert, ActivityIndicator} from "react-native";
import React,{useEffect, useState} from "react";
import { Layout, Text } from "@ui-kitten/components";
import { db,auth } from '../../firebase';
import firebase from 'firebase/compat/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {login} from '../reducers';
import Loader from "./Loader";

const SplashScreen = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        tryToLoginFirst();
      }, []);
    
      async function tryToLoginFirst() {
        const email = await AsyncStorage.getItem('@loggedInUserID:key');
        const password = await AsyncStorage.getItem('@loggedInUserID:password');
        const id = await AsyncStorage.getItem('@loggedInUserID:id');
        const role = await AsyncStorage.getItem('@loggedInUserID:role');
        const profile = await AsyncStorage.getItem('@loggedInUserID:profile');
        if (
          id != null &&
          id.length > 0 &&
          password != null &&
          password.length > 0
        ) {
         auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
           db.collection('usersCollections')
                .doc(id)
                .get()
                .then(function (doc) {
                  var userDict = {
                    id: id,
                    email: email,
                    profileURL: doc.photoURL,
                    fullname: doc.data().fullname,
                    role: role,
                    profile: doc.data().profile,
                    dob: doc.data().dob,
                    phone: doc.data().phone,
                    designation: doc.data().designation,
                    gender: doc.data().gender
                  };
                  if (doc.exists) {
                    dispatch(login(userDict));
                    if(role == 'patient'){
                      if(doc.data().profile == 'Updated'){
                        navigation.navigate('BottomNavigator', {user: userDict});
                      }else{
                        navigation.navigate('AuthStack', { screen: 'PEditProfile', params: { user: userDict } });
                      }

                    }else if(role == 'doctor'){
                      if(doc.data().profile == 'Updated'){
                        navigation.navigate('DoctorBottomTab', {user: userDict});
                      }else{
                        navigation.navigate('AuthStack', { screen: 'DEditProfile', params: { user: userDict } });
                      }
                    }
                  } 
                  else {
                    setIsLoading(false);
                  }
                })
                .catch(function (error) {
                  setIsLoading(false);
                  const {code, message} = error;
                  Alert.alert(message);
                });
            })
            .catch((error) => {
              const {code, message} = error;
              setIsLoading(false);
              Alert.alert(message);
            });
          return;
        }
        const googleToken = await AsyncStorage.getItem(
            '@loggedInUserID:googleCredentialAccessToken',
        );
        if (id != null && id.length > 0 && googleToken != null && googleToken.length > 0) {
            const credential = firebase.auth.GoogleAuthProvider.credential(googleToken);
            firebase.auth().signInWithCredential(credential).then((result) => {
              var user = result.user;
              var userDict = {
                id: user.uid,
                fullname: user.displayName,
                email: user.email,
                role: role,
                photoURL: user.photoURL,
                profile: profile,
                gender: gender,
                dob: dob,
                phone: phone,
                designation: designation,
              };
              dispatch(login(userDict));
              (role == 'patient' && profile == 'updated')?navigation.navigate('PatientBottomTab', {user:userDict}):navigation.navigate('PatientEditProfile', {user:userDict})
                    (role == 'doctor' && profile == 'updated')?navigation.navigate('DoctorBottomTab', {user:userDict}):navigation.navigate('DoctorEditProfile', {user:userDict})
            })
            .catch((error) => {
                setIsLoading(false);
              });
            return;
          }
          setIsLoading(false);
        }
      if (isLoading == true) {
        return (
         <Loader/>
        );
      }
    return (
        <Layout style={styles.Container}>
            <Image
                style={styles.avatar}
                source={require("../../assets/VigilanceAI_logo.png")}
                resizeMode="contain"
            />
            <Layout style={styles.mainHeader}>
                <Text style={styles.text }>ALERT</Text>
                <Layout style={styles.cicle}></Layout>
                <Text style={styles.text}>ACT</Text>
                <Layout style={styles.cicle}></Layout>
                <Text style={styles.text}>PREVENT</Text>
            </Layout>
        </Layout>
    );
};

export default SplashScreen;
const styles = StyleSheet.create({
    Container: {
        height:"100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        padding: 8,
    },
    avatar: {
        height: 200,
        width: 200,
        aspectRatio: 1,
        marginTop: 230,
    },
    mainHeader: {
        display: "flex",
        flexDirection: "row",
        marginTop: 20,
    },
    text:{
        color: "#0075A9",
        fontSize: 18, 
        fontFamily:'GTWalsheimPro-Bold'
    },
    cicle: {
        marginTop: 10,
        width: 6,
        height: 6,
        borderRadius: 10,
        backgroundColor: "grey",
        marginLeft: 5,
        marginRight: 5,
    },
});
