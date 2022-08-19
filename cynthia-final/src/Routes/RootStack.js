import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from '../PScreen/SplashScreen';
import Loader from '../PScreen/Loader';
import Login from '../PScreen/Login';
import OTPScreen from '../PScreen/OTPScreen';
import SucessScreen from '../PScreen/SucessScreen';
import ALoader from '../PScreen/ALoader';
import BottomNavigator from './BottomNavigator';
import OnBoarding from '../PScreen/OnBoarding';
import DLogin from '../DScreen/DLogin';
import DOTPScreen from '../DScreen/DOTPScreen'
import DSuccess from '../DScreen/DSuccess'
import EditProfile from '../PScreen/EditProfile';
import SelectDoctor from '../PScreen/SelectDoctor';
import DEditProfile from '../DScreen/DEditProfile';
import AddNotes from '../DScreen/AddNotes'
import DoctorBottomTab from './DoctorBottomTab'
import DChat from "../DScreen/DChat";
import DDetails from '../DScreen/DDetails'
import DFilter from '../DScreen/DFilter';
import PatientDetail from '../DScreen/PatientDetail'
import PSetting from '../PScreen/PSetting';
import PHelp from '../PScreen/PHelp';
import PPatientDetails from '../PScreen/PPatientDetails';
import DHelp from '../DScreen/DHelp';



const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();


const AuthStack = () => (
  <Stack.Navigator>

  
        <RootStack.Screen
        name="Loader"
        component={Loader}
        options={{ headerShown: false }}
      />
        
     
    <Stack.Screen name="OnBoarding"
        component={OnBoarding}
        options={{ headerShown: false }} />
        
        <RootStack.Screen
        name="ALoader"
        component={ALoader}
        options={{ headerShown: false }}
      />
        

    <Stack.Screen name="Login"
        component={Login}
        options={{ headerShown: false }} />
    <Stack.Screen name="OTPScreen"
        component={OTPScreen}
        options={{ headerShown: false }}/>
         <Stack.Screen  name="SucessScreen"
        component={SucessScreen}
        options={{ headerShown: false }}/>
        <RootStack.Screen
        name="DLogin"
        component={DLogin}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="PEditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SelectDoctor"
        component={SelectDoctor}
        options={{ headerShown: false }}
      />
       <RootStack.Screen
        name="DEditProfile"
        component={DEditProfile}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="DOTPScreen"
        component={DOTPScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="DSuccess"
        component={DSuccess}
        options={{ headerShown: false }}
      />
    
  </Stack.Navigator>
);

const RootStackNavigator = () => {
  
  return (
    <RootStack.Navigator>
     
      {/*  <RootStack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
  */}
     
  <RootStack.Screen
        name="AuthStack"    
        component={AuthStack}
        options={{ headerShown: false }}
      />
     <RootStack.Screen
        name="BottomNavigator"
        component={BottomNavigator}
        options={{ headerShown: false }}
      />
       <RootStack.Screen
        name="DoctorBottomTab"
        component={DoctorBottomTab}
        options={{ headerShown: false }}
      />
         <RootStack.Screen
        name="Details"
        component={DDetails}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="DFilter"
        component={DFilter}
        options={{ headerShown: false }}
      />
       <RootStack.Screen
        name="DDetails"
        component={DDetails}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="PatientDetail"
        component={PatientDetail}
        options={{ headerShown: false }}

     />
     <RootStack.Screen
        name="PSetting"
        component={PSetting}
        options={{ headerShown: false }}
     />
     <RootStack.Screen
        name="PPatientDetails"
        component={PPatientDetails}
        options={{ headerShown: false }}

     />
      <RootStack.Screen
        name="PHelp"
        component={PHelp}
        options={{ headerShown: false }}
     />
       <RootStack.Screen
        name="DChat"
        component={DChat}
        options={{ headerShown: false }}
      />

<RootStack.Screen
        name="DHelp"
        component={DHelp}
        options={{ headerShown: false }}
     />
    </RootStack.Navigator>
  );
}


export default RootStackNavigator