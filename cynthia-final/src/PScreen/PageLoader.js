import { StyleSheet,Image, ActivityIndicator, Layout} from 'react-native'
import React ,{useEffect}from 'react'


const PageLoader =()=>{
  return (
    
      <ActivityIndicator size= 'large' style={{ flex: 1 }}/>
    
  )
}

export {PageLoader}
const styles = StyleSheet.create({
    loadingContainer: {

        flex: 1,
    
        alignItems: 'center',
    
        justifyContent: 'center'
    
      }
})