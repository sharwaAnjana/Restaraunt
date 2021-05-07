import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  PermissionsAndroid,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import { Container, Content } from 'native-base';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';

console.disableYellowBox = true

const App = () => {
  const [response, setResponse] = useState([])
  const [search, setSearch] = useState('')
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [locationStatus, setLocationStatus] = useState('');

  const searchCall = async (val) => {
    try {
      console.log('value', 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + currentLatitude + ',' + currentLongitude + '&radius=25000&type=' + val + '&keyword=:keyword&key=AIzaSyDkGIvqAXuuOE5TUoDedazelbPdKtQxb1E')
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + currentLatitude + ',' + currentLongitude + '&radius=25000&type=' + val + '&keyword=:keyword&key=AIzaSyDkGIvqAXuuOE5TUoDedazelbPdKtQxb1E'
      );
      setResponse(response.data.results)
    } catch (error) {
      // handle error
      alert(error.message);
    }
  };

  useEffect(() => {
    requestLocationPermission()
  }, [])

  const handleSearch = (val) => {
    setSearch(val);
    searchCall(val)
  }

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          getOneTimeLocation();
          // subscribeLocationLocation();
        } else {
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        currentLongitude, currentLatitude
        console.warn(err);
      }
    }
  }

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('Got Location');
        //getting the Longitude from the location json
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude =
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
        requestLocationPermission()
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  return (
    <Container>
      <Content>
        <View>
          <View style={styles.container}>
            <TextInput
              id={"txtNumber2"}
              accessible={true}
              autoFocus={true}
              accessibilityLabel={"txtNumber2"}
              style={styles.input}
              onChangeText={val => {
                handleSearch(val)
              }}
              value={search}
              placeholder={"Search for restaraunt,cuisines..."}
              onSubmitEditing={() => {
                searchCall(search)
              }}
            />
          </View>
          <View>
            {response.length > 0 && search != '' ? <FlatList
              data={response}
              style={{ marginHorizontal: 6, marginTop: 16 }}
              ListEmptyComponent={() => {
                return (
                  <View>
                    {response != '' && response.length == 0 && <Text style={{ marginStart: 10 }}>No Results Found</Text>}
                  </View>
                )
              }}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity>
                    <View style={styles.img_parent}>
                      <Image
                        source={{ uri: item.icon }}
                        style={styles.icon}
                        resizeMode={"cover"}
                      />
                      <View>
                        <Text>{item.name}</Text>
                        <Text style={styles.vicinity}>{item.vicinity}</Text>
                        <Text style={styles.ratings}> {item.rating && item.rating != '' && item.rating !== 0 ? 'Ratings : ' + item.rating : ''}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
              :
              search != '' && <Text style={{ marginTop: 6, marginStart: 10, opacity: 0.6 }}>No Results Found</Text>
            }
          </View>
        </View>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    borderColor: "rgba(66, 76, 82, 0.56)",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    alignSelf: 'center'
  },
  img_parent: {
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    height: 30,
    width: 30,
    marginEnd: 16
  },
  vicinity: {
    opacity: 0.6,
    fontSize: 10,
    marginTop: 3,
    paddingEnd: 16,
    lineHeight: 16
  },
  ratings: {
    opacity: 0.6,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
    paddingEnd: 16,
    color: "#ed4e24"
  }
});

export default App;
