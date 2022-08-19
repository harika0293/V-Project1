import { StyleSheet } from 'react-native'
import React from 'react'
import { Layout, Text, Icon, Divider } from '@ui-kitten/components';

const PHelp = ({navigation}) => {
  return (
    <Layout style={styles.container}>
      <Layout style={styles.Arrow}>
        <Icon onPress={() => navigation.navigate('DoctorBottomTab', { screen: 'DSetting' })} style={styles.arrow} fill="#0075A9" name="arrow-back" />
      </Layout>
      <Layout style={{marginTop:40,marginHorizontal:30}}>
      <Text style={styles.Heading}>Contact Us for Enquiries/Grievances – </Text>
      <Text style={styles.text}>Mail us at:  demo@vigilanceai.com </Text>

      <Text style={styles.Heading}>About Vigilance AI:  </Text>
      <Text style={styles.text}>Vigilance AI is a team of experts in computer vision and healthcare.  Our values are innovation, compassion, and reliability. </Text>

      <Text style={styles.Heading}>Innovation: </Text>
      <Text style={styles.text}>We are constantly at the forefront of new technology and never settle for the minimal viable product.</Text>
      
      <Text style={styles.Heading}>Compassion: </Text>
      <Text style={styles.text}>We do our work with compassion. Keeping older adults safe, healthy, and in their own homes has special meaning to us and is what motivates us. Our hearts are in our work.</Text>
      
      <Text style={styles.Heading}>Reliability:  </Text>
      <Text style={styles.text}>The reliability of our product is everything to us and everything to our users.</Text>
      </Layout>
      
    </Layout>
  )
}

export default PHelp

const styles = StyleSheet.create({
  container: {
    height: '100%'
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
  Heading:{
    fontSize:18,
    fontFamily:'Recoleta-Bold',
    color:'#0075A9',
    marginTop:30
  },
  text:{
    fontFamily:'GTWalsheimPro-Regular'
  }
})