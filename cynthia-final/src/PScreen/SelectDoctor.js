import {
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {login} from '../reducers';
import {useDispatch} from 'react-redux';
import React, { useEffect, useState } from 'react';
import {Layout, Text, Input, Icon, Button} from '@ui-kitten/components';
import { db } from '../../firebase';
import {PageLoader} from './PageLoader'

const SearchIcon = props => <Icon {...props} name="search" />;

const SelectDoctor = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const [myDoctor, setMyDoctor] = useState("");
  const [loading, setLoading] = React.useState(false);
  const user = route.params.user;
  console.log(user)

  const handleUpdate = (myDoctor) => {
    setLoading(true);
    const data = {
      email: user.email,
      fullname: user.fullname,
      phone: user.phone,
      profile: "Updated",
      gender: user.gender,
      myDoctor: myDoctor,
      dob: user.dob
    };
    const user_uid = user.id;
    db.collection('usersCollections').doc(user_uid).set(data, {merge: true});
    db.collection('usersCollections')
      .doc(user_uid)
      .get()
      .then(function (user) {
        dispatch(login(user.data()));
        if (user.exists && user.data().profile === "Updated") {
          setLoading(false);
          navigation.navigate('BottomNavigator', {user: user.data()});
        }
        else{
          setLoading(false);
          Alert.alert('Please try again')
        }
       
       
      })
  }
  const loadDoctors = () => {
    setLoading(true);
    db.collection("usersCollections").where("role", "==", "doctor")
    .get()
    .then((querySnapshot) => {
      const availdoctors = [];
        querySnapshot.forEach((doc) => {
          var newDoc = {
            index: doc.id,
            name: doc.data().fullname,
            designation: doc.data().designation,
            image: doc.data().image?doc.data().image:require('../../assets/user.jpg'),
          }
          availdoctors.push(newDoc);
          
        });
        setDoctors(availdoctors);
        setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
        console.log("Error getting documents: ", error);
    });
  }
  useEffect(() => {loadDoctors()} ,[])
  return (
    loading ? 
      <PageLoader/>:<Layout style={styles.Container}>
      <Layout style={styles.topHead}>
        <Text style={{fontSize: 20, marginTop: 40}}>Hello!</Text>
        <Image
          source={require('../../assets/user.jpg')}
          style={styles.userImage}
        />
      </Layout>
      <Text style={styles.DrTeaxt}>{user.fullname}</Text>
      <Layout style={styles.Search}>
        <Input
          placeholder="Search...."
          accessoryRight={SearchIcon}
          style={styles.input}
          size="large"
        />
      </Layout>
      <Text style={styles.pText}>Select Your Doctor</Text>
      <SafeAreaView>
        <FlatList
          style={styles.textStyle}
          keyExtractor={key => {
            return key.index;
          }}
          vertical
          //inverted
          extraData={doctors}
          showsVerticalScrollIndicator={false}
          data={doctors}
          renderItem={({item}) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() => handleUpdate(item.index)}>
                  <Layout style={styles.card}>
                    <Image
                      source={item.image}
                      resizeMode="cover"
                      style={{
                        height: 60,
                        width: 60,
                        borderRadius: 50,
                        marginTop: 10,
                      }}
                    />
                    <Text style={styles.text}>{item.name}</Text>
                    <Text style={styles.msg}>{item.designation}</Text>
                  </Layout>
                </TouchableOpacity>
              </>
            );
          }}
        />
      </SafeAreaView>
    </Layout>
  );
};

export default SelectDoctor;

const styles = StyleSheet.create({
  Container: {
    height: '100%',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  topHead: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 80,
    height: 80,
    marginTop: 20,
    borderRadius: 50,
  },
  DrTeaxt: {
    fontSize: 28,
    fontFamily: 'Recoleta-Bold',
    color: '#0075A9',
  },
  Search: {
    marginTop: 30,
  },
  input: {
    borderRadius: 30,
    fontFamily: 'GTWalsheimPro-Regular',
  },
  pText: {
    fontSize: 25,
    marginTop: 25,
    fontFamily: 'Recoleta-Bold',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F9F9F9',
    width: '100%',
    marginTop: 15,
    padding: 15,
    paddingBottom: 20,
  },
  text: {
    position: 'absolute',
    marginTop: 10,
    marginLeft: 90,
    fontSize: 18,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  msg: {
    position: 'absolute',
    marginTop: 40,
    marginLeft: 90,
    color: '#D5D5D5',
    fontSize: 16,
  },
  noti: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#FF6969',
    color: 'white',
    width: 30,
    height: 30,
    borderRadius: 50,
    paddingTop: 4,
    textAlign: 'center',
    fontSize: 15,
    marginTop: -10,
  },
  details: {
    marginTop: 20,
    marginHorizontal: 75,
    fontSize: 15,
    color: '#0075A9',
    fontFamily: 'GTWalsheimPro-Bold',
  },
  msgNow: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    fontSize: 15,
    fontFamily: 'GTWalsheimPro-Bold',
  },
});
