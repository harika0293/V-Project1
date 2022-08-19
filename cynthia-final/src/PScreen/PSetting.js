import { StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Layout, Text, Divider, Icon,Button } from '@ui-kitten/components';
import { useNavigation } from "@react-navigation/native";
import {connect, useSelector} from 'react-redux'
import {useDispatch} from 'react-redux';
import {auth} from '../../firebase';
import {logout} from '../reducers';
const PSetting = () => {
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth);
    const navigation = useNavigation();
    const signout = () => {
        auth.signOut()
          .then(() => {
            dispatch(logout());
            navigation.navigate('AuthStack', { screen: 'Login' });
          }); //logout on redux
      }
    return (
        <Layout style={styles.Container}>
        <Layout style={styles.topHead}>
        <Icon
        style={styles.arrow}
        fill="#0075A9"
        name='arrow-back'
        onPress={() => navigation.navigate('BottomNavigator')}
        />
        <Text style={{fontSize:20,fontFamily:"Recoleta-Bold",marginLeft:10}}>Settings</Text>
        </Layout>
        <Text style={{fontSize:15,color:"#DDDDDD",fontFamily:"GTWalsheimPro-Bold",marginLeft:60}}>View and set your profile details</Text>
            <Layout style={styles.topHeader}>
                <Icon 
                name="person-outline"
                fill='#8F9BB3'
                style={styles.image} />
                <Text style={{ fontSize: 22, marginLeft: 20, fontFamily: "GTWalsheimPro-Bold" }}>{authUser.user.fullname}</Text>
                <Text style={styles.headText}>{authUser.user.role}</Text>
            </Layout>
            <Divider />
            <Layout style={styles.profile}>
                <Icon
                    style={styles.icon}
                    fill='#8F9BB3'
                    name='person-outline' />
                    <TouchableOpacity onPress={()=> navigation.navigate('PPatientDetails' )}>
                <Text style={styles.text} >Account</Text>
                </TouchableOpacity>
                <Text style={styles.desc}>Lorem ipsum dolor sit amet, consecture</Text>
            </Layout>
            <TouchableOpacity onPress={()=>navigation.navigate('BottomNavigator', { screen: 'Chat' })}>
            <Layout style={styles.profile}>
                <Icon
                    style={styles.icon}
                    fill='#8F9BB3'
                    name='message-square-outline' />
                <Text style={styles.text} >Chats</Text>
                <Text style={styles.desc}>Lorem ipsum dolor sit amet, consecture</Text>
            </Layout>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={()=>navigation.navigate('BottomNavigator', { screen: 'Notification' })}>
            <Layout style={styles.profile}>
            <Icon
                style={styles.icon}
                fill='#8F9BB3'
                name='bell-outline' />
            <Text style={styles.text} >Notification</Text>
            <Text style={styles.desc}>Lorem ipsum dolor sit amet, consecture</Text>
        </Layout>
            </TouchableOpacity>
         
            <TouchableOpacity onPress={()=>navigation.navigate('PHelp')}>
            <Layout style={styles.profile}>
            <Icon
                    style={styles.icon}
                    fill='#8F9BB3'
                    name='question-mark-circle-outline' />
            <Text style={styles.text} >Help</Text>
            <Text style={styles.desc}>Lorem ipsum dolor sit amet, consecture</Text>
        </Layout>
            </TouchableOpacity>

            <Layout style={styles.profile}>
            <Button
          onPress={() => signout()}
          style={styles.button}
          size="giant">
          Sign Out
        </Button>
            </Layout>

            
        </Layout>
    )
}

export default PSetting

const styles = StyleSheet.create({
    Container: {
        height: "100%",
        backgroundColor: "#fff",
    },
    topHead:{
        display:"flex",
        flexDirection:"row",
        marginTop:20,
        marginHorizontal:20
    },
    arrow:{
        width:30,
        height:30
    },
    topHeader: {
        display: "flex",
        flexDirection: "row",
        marginTop: 40,
        paddingBottom: 40,
        paddingHorizontal: 30,
    },
    image: {
        height: 60,
        width: 60,
        borderRadius: 50
    },
    headText: {
        position: "absolute",
        margin: 40,
        left: 70,
        color: "#D5D5D5",
        fontSize: 15
    },
    profile: {
        display: "flex",
        flexDirection: 'row',
        marginTop: 50,
        marginHorizontal: 30
    },
    icon: {
        height: 30,
        width: 30,
        top: 10
    },
    button: {
        marginTop: 20,
        backgroundColor: '#0075A9',
        width: 330,
        borderColor: 'transparent',
      },
    desc: {
        position: "absolute",
        marginTop: 30,
        left: 60,
        color: "#D5D5D5",
        fontSize: 16,
        fontFamily: "GTWalsheimPro-Regular",

    },
    text: {
        fontSize: 20,
        marginLeft: 30,
        fontFamily: "GTWalsheimPro-Bold"
    }
})