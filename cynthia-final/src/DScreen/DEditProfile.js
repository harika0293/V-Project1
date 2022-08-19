import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {PageLoader} from '../PScreen/PageLoader'
import { db } from '../../firebase';
import {
  Layout,
  Text,
  Icon,
  Divider,
  Input,
  Button,
  IndexPath,
  Select,
  SelectItem,
  Datepicker,
  Alert
} from '@ui-kitten/components';
import moment from 'moment'
import {connect, useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {login} from '../reducers';

const CalendarIcon = props => <Icon {...props} name="calendar" />;
const data = ['Other', 'Male', 'Female'];

const EditProfile = ({navigation, route}) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth);
  const user = authUser.user;

   
  const [fullname, setFullname] = useState(user.fullname);
  const [designation, setDesignation] = useState(user.designation);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState(user.gender);
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const displayValue = data[selectedIndex.row];
useEffect(() => {
  setGender(displayValue)
},[displayValue])

const handleUpdate = () => {
  setLoading(true);
  const data = {
    email: email,
    fullname: fullname,
    phone: phone,
    profile: "Updated",
    gender: gender,
    designation: designation,
    dob: moment(date).format('MM/DD/YYYY'),
  };
  const user_uid = user.id;
  console.log(data);
  db.collection('usersCollections').doc(user_uid).set(data, {merge: true});
  db.collection('usersCollections')
    .doc(user_uid)
    .get()
    .then(function (user) {
      dispatch(login(user.data()));
      if (user.exists && user.data().profile === "Updated") {
        setLoading(false);
        navigation.navigate('DoctorBottomTab', {user: user.data()});
      }
      else{
        setLoading(false);
Alert.alert('Please try again')
      }
     
     
    })
}
  const renderOption = title => <SelectItem title={title} />;
  return (
    loading ?
    <PageLoader/>
    :
    <Layout style={styles.container}>
      <Text
        style={{
          textAlign: 'center',
          top: 10,
          fontFamily: 'Recoleta-SemiBold',
          paddingBottom: 30,
          textTransform: 'uppercase',
        }}>
        Edit Your Profile
      </Text>
      <Divider />
      <Layout style={styles.mainContainer}>
        <Image
          source={require('../../assets/user.jpg')}
          style={styles.image}
        />
         <Input
          placeholder="Full Name"
          style={styles.input}
          value={fullname}
          onChangeText= {text => setFullname(text)}
          label={evaProps => (
            <Text
              {...evaProps}
              style={{fontFamily: 'GTWalsheimPro-Bold', marginBottom: 5}}>
             Full Name
            </Text>
          )}
        />
        <Input
          placeholder="Designation "
          value={designation}
          defaultValue={designation}
          onChangeText={(text) => setDesignation(text)}
          label={evaProps => (
            <Text
              {...evaProps}
              style={{fontFamily: 'GTWalsheimPro-Bold', marginBottom: 5}}>
              Designation
            </Text>
          )}
        />

        <Datepicker
          label={evaProps => (
            <Text
              {...evaProps}
              style={{fontFamily: 'GTWalsheimPro-Bold', marginBottom: 5}}>
              Date of Birth
            </Text>
          )}
          accessoryRight={CalendarIcon}
          size="large"
          date={date}
          onSelect={nextDate => setDate(nextDate)}
          style={{top: 10}}
        />
        <Select
          style={styles.input}
          label={evaProps => (
            <Text
              {...evaProps}
              style={{fontFamily: 'GTWalsheimPro-Bold', marginBottom: 5}}>
              Gender
            </Text>
          )}
          placeholder="Default"
          value={displayValue}
          onSelect={index => setSelectedIndex(index)}>
          {data.map(renderOption)}
        </Select>

        <Input
          placeholder="name@email.com"
          style={styles.input}
          value={email}
          onChangeText= {text => setEmail(text)}
          label={evaProps => (
            <Text
              {...evaProps}
              style={{fontFamily: 'GTWalsheimPro-Bold', marginBottom: 5}}>
              Email Address
            </Text>
          )}
        />
        <Input
          placeholder="Phone Number"
          value={phone}
          onChangeText={text => setPhone(text)}
          style={styles.input}
          label={evaProps => (
            <Text
              {...evaProps}
              style={{fontFamily: 'GTWalsheimPro-Bold', marginBottom: 5}}>
              Phone Number
            </Text>
          )}
        />
      </Layout>
      <Layout style={styles.bottomButton}>
        <Button style={styles.cancel} onPress={()=>{navigation.navigate('DoctorBottomTab')}}>Cancel</Button>
        <Button
          style={styles.save}
          onPress={handleUpdate}>
          Save
        </Button>
      </Layout>
    </Layout>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  Arrow: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 10,
    left: 20,
  },
  arrow: {
    height: 30,
    width: 30,
  },
  mainContainer: {
    backgroundColor: '#F9F9F9',
    marginHorizontal: 30,
    top: 30,
    padding: 30,
  },
  input: {
    marginTop: 15,
  },
  Button: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  buttontrn: {
    backgroundColor: 'white',
    borderColor: '#0F7BAB',
    color: '#0F7BAB',
  },
  button: {
    marginLeft: 10,
    borderColor: '#0F7BAB',
  },
  image: {
    width: 70,
    height: 70,
    position: 'absolute',
    top: -25,
    right: 10,
  },
  bottomButton: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 30,
    top: 50,
  },
  cancel: {
    width: 150,
    backgroundColor: '#0F7BAB',
    borderColor: '#0F7BAB',
  },
  save: {
    width: 150,
    backgroundColor: '#0F7BAB',
    borderColor: '#0F7BAB',
    left: 30,
  },
});
