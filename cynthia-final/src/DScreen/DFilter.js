import {
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Layout, Text, Icon, Button, Divider, ButtonGroup, Modal, Input, Datepicker, View } from '@ui-kitten/components';
import { BarChart, LineChart } from "react-native-gifted-charts";
import { useNavigation } from "@react-navigation/native";
import DatePicker from 'react-native-date-picker'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import axios from "axios";
import { auth, db } from '../../firebase'
import {PageLoader} from '../PScreen/PageLoader'
import { VictoryScatter, VictoryChart, VictoryTheme } from 'victory-native';

const ClockIcon = props => <Icon {...props} name="clock-outline" />;
const CalendarIcon = props => <Icon {...props} name="calendar" />;

const DFilter = ({ route }) => {
  const {width, height} = Dimensions.get('window');
  const { patient } = route.params;
  const [description, setDescription] = useState("");
  const [text, setText] = React.useState('');
  const [tab, setTab] = React.useState('');
  const navigation = useNavigation();
  const [chartData, setChartData] = React.useState([])
  const [date, setDate] = useState(new Date(Date.now()));
  const [open, setOpen] = React.useState(false)
  const [visible, setVisible] = React.useState(false);
  const [notes, SetNotes] = React.useState([])
  const [loading, setLoading] = React.useState(true);
  const barData1 = [
    { value: 250, label: 'M' },
    { value: 500, label: 'T', frontColor: '#177AD5' },
    { value: 745, label: 'W', frontColor: '#177AD5' },
    { value: 320, label: 'T' },
    { value: 600, label: 'F', frontColor: '#177AD5' },
  ];



  const handleAlert = () => {
    db.collection('usersCollections').doc(patient.index).collection('alerts').add({
      title: 'Alert',
      body: 'Alert Sent',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
    }).then(() => {
      alert('Alert Sent')
    })

  }
  const handleNotes = () => {
    db.collection('usersCollections').doc(patient.index).collection('notes').add({
      description: description,
      date: moment().format('YYYY-MM-DD')
    }).then(() => {
      alert('Notes Added')
    })

  }
 //current date code
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };
  

  // const getFilter1 = (date) => {
  //   setLoading(true)
  //   setTab("")
  //   date = moment(date).format('MM/DD/YYYY')
  //   axios.post('https://data-api-obpornrv3a-uc.a.run.app/activities_api', {
  //     date: date
  //   })
  //     .then(function (response) {
  //       setChartData(response?.data)
  //       setTab("cough")
  //       cleanData(tab, chartData?.x_cough, chartData?.y_cough)
  //       setLoading(false)

  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  //   }

      useEffect(() => {
        var date = moment(date).format('MM/DD/YYYY')
        setLoading(true)
        const getData = db.collection('usersCollections').doc(patient.index).collection('chart_analysis').where("date", "==", date)
        .get()
        .then(function (doc) {
          if(doc.empty){
            setChartData([])
          }
          else{
            setChartData(doc.data())
          }
          setTab("cough")
          cleanData(tab, chartData?.x_cough, chartData?.y_cough)
          setLoading(false)
            
          }).catch((error) => {
          setLoading(false);
            console.log("Error getting documents: ", error);
        });
      }, [date])
  
  useLayoutEffect(() => {
    const unsubscribe = db.collection('usersCollections').doc(patient.index).collection('notes').orderBy("date", "desc").onSnapshot(snapshot =>
      SetNotes(snapshot.docs.map((doc, index) => ({
        index: index.toString(),
        description: doc.data().description,
        date: moment(doc.data().date).format('LL'),
      })))
    )
    return unsubscribe;
  }, [])
  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true
    })
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const handleGraph = (value, data) => {
    switch (value) {
      case "cough":
      case "drink":
        var chart = <BarChart
          width={width-100}
          height={220}
          barWidth={20}
          barBorderRadius={5}
          frontColor="#177AD5"
          data={data}
          yAxisThickness={1}
          xAxisThickness={1}
          onPress={()=>navigation.navigate('PatientDetail', {patient: patient, text:text})}
        />
        setText(chart)
        break;
      case "fall":
        
        var chart = <LineChart data={data} width={width-100} onPress={()=>navigation.navigate('PatientDetail',{patient: patient, text:text})} />
        setText(chart)
        break;
      case "scatter":
        
          var chart = <VictoryChart
          theme={VictoryTheme.material}
          domain={{ y: [1, 7] }}
          domainPadding={1}>
          <VictoryScatter
            style={{ data: { fill: '#c43a31' } }}
            size={5}
            data={data} 
          onPress={()=>navigation.navigate('PatientDetail', {patient: patient, text:text})}
          />
        </VictoryChart>
          setText(chart)
        break;
  

    }
  }


  // useEffect(() => {
  //   getFilter1(date);
  // }, [date])

  const cleanScatterData = (tab,sleeping_x,sleeping_y) => {
    var h = {};
    if(sleeping_x){

      sleeping_x.forEach(function (v, i) {
        if (h.hasOwnProperty(v.split(':')[0] + v.slice(-2))) {
          h[v.split(':')[0] + v.slice(-2)] = h[v.split(':')[0] + v.slice(-2)] = sleeping_y[i]
  
        }
        else {
          h[v.split(':')[0] + v.slice(-2)] = sleeping_y[i]
        }
      })
      let data = Object.keys(h).map((date) => {
        var day = date.replace(/^0+/, '')
        return {
          x: day,
          y: h[date]
        };
      })
    handleGraph(tab, data)
  }}
  const cleanData = (tab, hours, count) => {
    var h = {};
    if(hours){

      hours.forEach(function (v, i) {
        if (h.hasOwnProperty(v.split(':')[0] + v.slice(-2))) {
          h[v.split(':')[0] + v.slice(-2)] = h[v.split(':')[0] + v.slice(-2)] += count[i]
  
        }
        else {
          h[v.split(':')[0] + v.slice(-2)] = count[i]
        }
      })
      let data = Object.keys(h).map((date) => {
        var day = date.replace(/^0+/, '')
        return {
          label: day,
          value: h[date]
        };
      })
      handleGraph(tab, data)
    }
    else{
      handleGraph(tab, [])
    }
  }
  useEffect(() => {
    let hours;
    let count;
    switch (tab) {
      case "cough":
        hours = chartData?.x_cough;
        count = chartData?.y_cough;
        cleanData(tab, hours, count)
        break;
      case "drink":
        hours = chartData?.x_drink;
        count = chartData?.y_drink;
        cleanData(tab, hours, count)
        break;
      case "fall":
        hours = chartData?.fall_x_cord;
        count = chartData?.fall_y_cord;
        cleanData(tab, hours, count)
        break;
      case "scatter":
        hours = chartData?.sleeping_x;
        count = chartData?.sleeping_y;
        cleanScatterData(tab, hours, count)
        break;

    }
  }, [tab])

  return (
    loading ? 
      <PageLoader/>
      :
      <Layout style={styles.Container}>
        <ScrollView>
          <Image source={require('../../assets/colored-bg.jpeg')} />
          <Layout style={styles.Arrow}>
            <Icon style={styles.arrow} fill="#fff" name="arrow-back" onPress={() => navigation.navigate('DHome')} />
          </Layout>
          <Layout style={styles.imgTop}>
            <Icon style={styles.icon1} fill="#fff" name="email-outline" />
            <Icon style={styles.icon2} fill="#fff" name="bookmark-outline" />
          </Layout>
          <Image
            style={styles.UserImg}
            source={require('../../assets/user.jpg')}
            resizeMode="contain"
          />
          <Text
            style={{
              marginTop: 60,
              textAlign: 'center',
              fontSize: 20,
              fontFamily: 'GTWalsheimPro-Bold',
            }}>
           {patient.name}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 15,
              marginTop: 3,
              paddingBottom: 20,
            }}>
           {patient.address?patient.address:'N/A'}
          </Text>
          <Layout style={styles.Button} level="1">
            <Button style={styles.buttontrn} appearance="outline" onPress={handleAlert}>
              {evaProps => (
                <Text
                  {...evaProps}
                  style={{ color: '#0F7BAB', fontFamily: 'GTWalsheimPro-Bold' }}>
                  Alert Now
                </Text>
              )}
            </Button>
            <Button style={styles.button} appearance="filled" onPress={() => navigation.navigate('DChat', { thread: patient })}>
              Message Now
            </Button>
            <Button style={styles.buttontrn} appearance="outline" onPress={() => navigation.navigate('DDetails', {patient:patient})}>
              {evaProps => (
                <Text
                  {...evaProps}
                  style={{ color: '#0F7BAB', fontFamily: 'GTWalsheimPro-Bold' }}>
                  More
                </Text>
              )}
            </Button>
          </Layout>
          <Divider />

          <Layout style={styles.Details}>
            <Text style={{ fontSize: 22, fontFamily: 'Recoleta-Bold' }}>
              Filter Details
            </Text>
            <TouchableOpacity style={{ marginTop: 5, flexDirection: 'row' }} onPress={() => showDatepicker()}>
              <Icon
                style={{ height: 25, width: 25, left: 30 }}
                fill='#0075A9'
                name='calendar' />
              <Text style={{ color: "#C1C1C1", fontSize: 18, fontFamily: "Recoleta-Bold", left: 50 }}>{moment(date).format('DD-MM-YYYY')}</Text>
            </TouchableOpacity>
            <ButtonGroup style={styles.btngroup}>
              <Button style={styles.btn} onPress={() => setTab("cough")}>Cough</Button>
              <Button style={styles.btn} onPress={() => setTab("drink")}>Drink</Button>
              <Button style={styles.btn} onPress={() => setTab("fall")}>Fall</Button>
              <Button style={styles.btn} onPress={() => setTab("scatter")}>Sleep/Awake</Button>
            </ButtonGroup>
            <Text

              style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: "uppercase",
                marginBottom: 10

              }}>

              {`${tab} data graph`}

            </Text>
            {text}



          </Layout>
          <Layout style={styles.Notes}>
            <Text style={{ fontSize: 20, fontFamily: 'GTWalsheimPro-Bold' }}>
              Recent
              <Text
                style={{
                  fontSize: 20,
                  color: '#0075A9',
                  fontFamily: 'GTWalsheimPro-Bold',
                }}>
                {' '}
                Notes
              </Text>
            </Text>
            {notes.length === 0 ?<Text>No notes</Text> :
            <FlatList
              style={styles.listStyle}
              keyExtractor={key => {
                return key.index;
              }}
              horizontal
              //inverted
              showsHorizontalScrollIndicator={false}
              data={notes}
              renderItem={({ item }) => {
                return (
                  <>
                    <Layout style={styles.textStyle}>
                      <Layout style={styles.circle}></Layout>
                      <Text
                        style={{
                          fontSize: 13,
                          marginLeft: 12,
                          fontFamily: 'GTWalsheimPro-Bold',
                        }}>
                        Date:{item.date}
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          paddingTop: 10,
                          fontFamily: 'GTWalsheimPro-Regular',
                        }}>
                        {item.description}
                      </Text>
                    </Layout>
                  </>
                );
              }}
            />}
           
            <TouchableOpacity onPress={() => setVisible(true)}>
              <Layout style={styles.add}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'GTWalsheimPro-Regular',
                    color: '#0075A9',
                  }}>
                  + Add New
                </Text>
              </Layout>
            </TouchableOpacity>
          </Layout>
          {/* Modal Start*/}
          <Modal
            style={styles.model}
            visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => setVisible(false)}>
            <Layout style={styles.mainContainer}>
              <Layout style={styles.Head}>
                <DatePicker
                  modal
                  open={open}
                  date={date}
                  onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                  }}
                  onCancel={() => {
                    setOpen(false)
                  }}
                />
                <Icon
                  style={styles.icon}
                  fill='#0F7BAB'
                  name='file-add-outline' />
                <Text style={{ fontSize: 25, fontFamily: "Recoleta-Bold", marginLeft: 60 }}>Add Notes</Text>
                <Icon
                  onPress={() => setVisible(false)}
                  style={styles.icon1}
                  fill='#8F9BB3'
                  name="close-outline" />
              </Layout>
              <Layout style={styles.notes}>
                {/* <Input
                  label={evaProps => <Text {...evaProps} style={{ fontFamily: "GTWalsheimPro-Bold", marginBottom: 5 }}>Time</Text>}
                  accessoryRight={ClockIcon}
                  placeholder="hy"
                  multiline={true}
                  textStyle={{ minHeight: 40 }}
                  date={date}
                />
                <TouchableOpacity style={{ backgroundColor: "transparent", height: 50, width: "100%", position: "absolute", top: 25 }} onPress={() => setOpen(true)}></TouchableOpacity> */}

                {/* <Datepicker
                  label={evaProps => <Text {...evaProps} style={{ fontFamily: "GTWalsheimPro-Bold", marginBottom: 5 }}>Date</Text>}
                  accessoryRight={CalendarIcon}
                  size="large"
                  date={date}
                  onSelect={nextDate => setDate(nextDate)}
                  style={styles.date}
                /> */}
                <Input
                  multiline={true}
                  value={description}
                  textStyle={{ minHeight: 70 }}
                  onChangeText={text => setDescription(text)}
                  label={evaProps => <Text {...evaProps} style={{ fontFamily: "GTWalsheimPro-Bold", marginBottom: 5 }}>Text Note</Text>}
                  style={{ marginTop: 30, marginBottom: 30 }}
                />
                <Button
                  onPress={handleNotes}
                  style={styles.button} size="giant">
                  Add Note
                </Button>
              </Layout>
            </Layout>
          </Modal>
          {/* Modal End*/}
        </ScrollView>
      </Layout>
  )
}


export default DFilter;

const styles = StyleSheet.create({
  Container: {
    height: '100%',
  },
  imgTop: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    right: 40,
    top: 20,
    backgroundColor: 'transparent',
  },
  Arrow: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 20,
    left: 20,
  },
  arrow: {
    height: 30,
    width: 30,
  },
  icon1: {
    height: 30,
    width: 30,
  },
  icon2: {
    height: 30,
    width: 30,
    marginLeft: 10,
  },
  UserImg: {
    height: 100,
    width: 100,
    position: 'absolute',
    marginTop: 50,
    left: 140,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#0F7BAB',
  },
  Button: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  buttontrn: {
    marginLeft: 20,
    backgroundColor: 'white',
    borderColor: '#0F7BAB',
    color: '#0F7BAB',
  },
  button: {
    marginLeft: 20,
    backgroundColor: '#0F7BAB',
    borderColor: 'transparent',
  },
  Details: {
    marginHorizontal: 30,
    marginTop: 20,
  },
  btngroup: {
    marginTop: 20,
    marginBottom: 40,
  },
  btn: {
    backgroundColor: '#0F7BAB',
    borderColor: 'transparent',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  Notes: {
    marginHorizontal: 30,
  },
  textStyle: {
    backgroundColor: '#FFF3CE',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 30,
    width: 200,
  },
  circle: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    position: 'absolute',
    marginTop: 15,
    marginLeft: 10,
  },
  add: {
    marginTop: 20,
    left: 250,
    marginBottom: 30,
  },
  model: {
    height: "95%",
    width: "90%",

  },
  mainContainer: {
    height: "100%",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
  },
  Head: {
    marginTop: 40,
    display: "flex",
    flexDirection: "row"
  },
  icon: {
    width: 32,
    height: 32,
  },
  icon1: {
    width: 32,
    height: 32,
    marginLeft: 60
  },
  notes: {
    marginTop: 40
  },
  date: {
    marginTop: 30
  },
  cale: {
    heigth: 25,
    width: 25
  },
  


});
