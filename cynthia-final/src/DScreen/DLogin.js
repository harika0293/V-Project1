import {StyleSheet, Image, TouchableOpacity,Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Layout, Text, Input, Button, Icon} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import { db } from '../../firebase';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {login} from '../reducers';
// import firebase from 'firebase/compat/app';
import {PageLoader} from '../PScreen/PageLoader';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyBEaodLg-dWm-Hp_izwzhCn_ndP0WKZa7A",

  authDomain: "vigilanceai.firebaseapp.com",

  projectId: "vigilanceai",

  storageBucket: "vigilanceai.appspot.com",

  messagingSenderId: "745944856196",

  appId: "1:745944856196:web:68d5d90a2307f4ed2634d1"

};




let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const DLogin = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:'745944856196-j93km6d0o582pa875fl5s0m1vv3m72ev.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);
  const onPressLogin = () => {
    setLoading(true);
    if (email.length <= 0 || password.length <= 0) {
      setLoading(false);
      Alert.alert('Please fill out the required fields.');
      return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((response) => {
        const user_uid = response.user.uid;
        db.collection('usersCollections')
          .doc(user_uid)
          .get()
          .then(function (user) {
            if (user.exists) {
              AsyncStorage.setItem('@loggedInUserID:id', user_uid);
              AsyncStorage.setItem('@loggedInUserID:key', email);
              AsyncStorage.setItem('@loggedInUserID:password', password);
              AsyncStorage.setItem('@loggedInUserID:role', user.data().role);
              AsyncStorage.setItem('@loggedInUserID:profile', user.data().profile);
               AsyncStorage.setItem('@loggedInUserID:onboarded', "true");
               user.data().id = user_uid
              dispatch(login(user.data()));
              user.data().profile === 'Updated'?navigation.navigate('DoctorBottomTab'):navigation.navigate('AuthStack', { screen: 'DEditProfile'});
            } else {
              Alert.alert('User does not exist. Please try again.');
            }
          })
          .catch(function (error) {
            setLoading(false);
            const {message} = error;
            Alert.alert(message);
          });
      })
      .catch((error) => {
        setLoading(false);
        const {message} = error;
        Alert.alert(message);
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
      });
  };
  const onPressGoogle = () => {
    GoogleSignin.signIn()
      .then((data) => {
        // Create a new Firebase credential with the token
        const credential = firebase.auth.GoogleAuthProvider.credential(
          data.idToken,
        );
        // Login with the credential
        const accessToken = data.idToken;
        AsyncStorage.setItem(
          '@loggedInUserID:googleCredentialAccessToken',
          accessToken,
        );
        return firebase.auth().signInWithCredential(credential);
      })
      .then((result) => {
        var user = result.user;
        AsyncStorage.setItem('@loggedInUserID:id', user.uid);
        var userDict = {
          id: user.uid,
          fullname: user.displayName,
          email: user.email,
          role: 'doctor',
          profile: 'Not Updated',
          photoURL: user.photoURL,
          phone: user.phoneNumber
        };
        var data = {
          ...userDict,
          appIdentifier: 'rn-android-universal-listings',
        };
        db.collection('usersCollections').doc(user.uid).set(data);
        dispatch(login(userDict));
        data.profile === 'Updated'?navigation.navigate('DoctorBottomTab', {user}):navigation.navigate('AuthStack', { screen: 'DEditProfile'});
       
      })
      .catch((error) => {
        const {message} = error;
        setLoading(false);
        Alert.alert(message);
      });
  };
  return (
    loading ? <PageLoader /> : 
    <Layout style={styles.Container}>
      <Layout style={styles.headMain}>
        <Image
          style={styles.image}
          source={require('../../assets/VigilanceAI_logo.png')}
          resizeMode="contain"
        />
        <Text style={styles.heading}>
          Get Started as{' '}
          <Text
            style={{
              fontFamily: 'Recoleta-Bold',
              color: '#0075A9',
              fontSize: 22,
            }}>
            DOCTOR
          </Text>
        </Text>
        <Text style={styles.paragraph}>
          With our innovative technology,we're making the world safer for
          elderly people
        </Text>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={nextValue => setEmail(nextValue)}
          size="large"
          style={styles.input}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={nextValue => setPassword(nextValue)}
          size="large"
          style={styles.input}
        />

        <Button
         onPress={() => onPressLogin()}
          style={styles.button}
          size="giant">
          Sign In With Email
        </Button>

        <Layout
          style={{
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Layout style={styles.line}></Layout>
          <Text
            style={{
              marginHorizontal: 15,
              color: 'grey',
              fontSize: 19,
              fontFamily: 'GTWalsheimPro-Regular',
            }}>
            {' '}
            OR{' '}
          </Text>
          <Layout style={styles.line}></Layout>
        </Layout>
        <TouchableOpacity onPress={onPressGoogle}>
          <Layout style={styles.btnSecondary}>
            <Layout style={styles.social_btn}>
              <Image
                style={styles.btnImage}
                source={require('../../assets/google.png')}
              />
              <Text style={styles.btnText}>Continue With Google</Text>
            </Layout>
          </Layout>
        </TouchableOpacity>

        <Layout style={styles.signin}>
          <Text style={{fontSize: 15, color: '#818181'}}>
            New to Vigilance AI?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('DOTPScreen')}>
            <Text style={{fontSize: 17, color: '#0075A9', fontWeight: 'bold'}}>
              {' '}
              Create Your Account As A Doctor
            </Text>
          </TouchableOpacity>
        </Layout>
        <Layout style={styles.signin}>
          <Text style={{fontSize: 15, color: '#818181'}}>
            Are you a Patient?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{fontSize: 17, color: '#0075A9', fontWeight: 'bold'}}>
              {' '}
              Sign in As A Patient
            </Text>
          </TouchableOpacity>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DLogin;

const styles = StyleSheet.create({
  Container: {
    height: '100%',
  },
  headMain: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 20,
  },
  image: {
    height: 130,
    width: 100,
    aspectRatio: 1,
    marginTop: 30,
  },
  heading: {
    marginTop: 20,
    fontSize: 22,
    fontFamily: 'Recoleta-Bold',
  },
  paragraph: {
    fontSize: 16,
    marginTop: 20,
    color: '#C1C1C1',
    fontFamily: 'GTWalsheimPro-Regular',
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonText: {
    color: '#eee',
    fontSize: 16,
  },
  input: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0075A9',
    width: 330,
    borderColor: 'transparent',
  },
  line: {
    height: 1,
    width: 120,
    backgroundColor: '#0075A9',
  },
  button1: {
    backgroundColor: 'grey',
    width: 330,
  },
  btnSecondary: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '95%',
  },
  social_btn: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  btnImage: {
    width: 25,
    height: 25,
    marginLeft: 15,
  },
  btnText: {
    width: '80%',
    textAlign: 'center',
    fontSize: 16,
  },
  signin: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    marginTop: 20,
  },
});