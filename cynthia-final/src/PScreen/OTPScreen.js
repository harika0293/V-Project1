import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Layout, Text, Input, Button, Icon, Alert} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {login} from '../reducers';
import { db } from '../../firebase';
import firebase from 'firebase/compat/app';
import {PageLoader} from './PageLoader'

const OTPScreen = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const onRegister = () => {
    setLoading(true);
    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const data = {
          email: email,
          fullname: fullname,
          phone: phone,
          role: "patient",
          profile: "Not Updated",
          appIdentifier: 'rn-android-universal-listings',
        };
        const user_uid = response.user.uid;
        db.collection('usersCollections').doc(user_uid).set(data);
        db.collection('usersCollections')
          .doc(user_uid)
          .get()
          .then(function (user) {
            user.data().id = user_uid
            dispatch(login(user.data()));
            navigation.navigate('AuthStack', { screen: 'PEditProfile',  });
          })
          .catch(function (error) {
            setLoading(false);
            const {code, message} = error;
            Alert.alert(message);
          });
      })
      .catch((error) => {
        setLoading(false);
        const {code, message} = error;
        Alert.alert(message);
      });
  };
  return (
    loading ?
    <PageLoader/>:
    <Layout style={styles.Container}>
      <Layout style={styles.headMain}>
        <Image
          style={styles.image}
          source={require('../../assets/VigilanceAI_logo.png')}
          resizeMode="contain"
        />
        <Text style={styles.heading}>
          Create your{' '}
          <Text
            style={{
              fontFamily: 'Recoleta-Bold',
              color: '#0075A9',
              fontSize: 22,
            }}>
            ACCOUNT
          </Text>
        </Text>
        <Text style={styles.paragraph}>
          With our innovative technology,we're making the world safer for
          elderly people
        </Text>
        <Input
          placeholder="Full Name"
          value={fullname}
          onChangeText={nextValue => setFullname(nextValue)}
          size="large"
          style={styles.input}
        />
        <Input
          placeholder="Phone Number"
          value={phone}
          onChangeText={nextValue => setPhone(nextValue)}
          size="large"
          style={styles.input}
        />
        <Input
          placeholder="Email Address"
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
          onPress={onRegister}
          style={styles.button}
          size="giant">
          Sign Up
        </Button>
      </Layout>
      <Layout style={styles.signin}>
          <Text style={{fontSize: 15, color: '#818181'}}>
           Already Have An Account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{fontSize: 17, color: '#0075A9', fontWeight: 'bold'}}>
              {' '}
              Sign in
            </Text>
          </TouchableOpacity>
        </Layout>
    </Layout>
  );
};

export default OTPScreen;

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
    height: 55,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
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
