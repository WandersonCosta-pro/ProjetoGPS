import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';


const { height, width } = Dimensions.get('window');

export default class App extends Component {

  state = {
    places: [
      {
        id: 1,
        title: 'Você está aqui!',
        description: 'Essa é sua localização atual',
        errorMessage: null,
        loaded: false,
        location: null,
        locationAddress: null,
        street: null,
        subregion: null,
        region: null,
        country: null,
        postalCode: null,
        district: null,
      }
    ]
  }

  componentDidMount() {
    this._getLocation();
  }


  _getLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      this.setState({
            errorMessage: 'Permissão para acessar a localização do GPS negada.',
            loaded: true
      });   
      alert(this.state.errorMessage);
    } else {
      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      this.setState({ location, loaded: true, errorMessage: null });
      const  { latitude, longitude } = this.state.location.coords;
      let locationAddress = await Location.reverseGeocodeAsync({ latitude: latitude,
      longitude: longitude, useGoogleMaps: true });
      this.setState({ locationAddress });
      const address = this.state.locationAddress;
      const [{street, subregion, region, country, postalCode, district}] = address;
      debugger
      this.setState({ street: street, subregion: subregion, region: region,
      country: country, postalCode: postalCode, district: district});
        
    }
  }



  render() {

    if (this.state.loaded) {
      if (this.state.errorMessage) {
        return (
          <View style={{marginTop: 50}}>
            <Text>{JSON.stringify(this.state.errorMessage)}</Text>
          </View>
        );

      } else if (this.state.location) {
        const { latitude, longitude } = this.state.location.coords;
        const { street, subregion, region, country, postalCode, district } = this.state;
        
        return (
          <View style={styles.container}>
            <StatusBar style='auto' />
            <MapView 
              ref={map => this.mapStyle = map}
              region={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0142,
                longitudeDelta: 0.0231,
              }}
              style={styles.mapStyle}
              rotateEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
              showsPointsOfInterest={false}
              showsBuildings={false}
              onMapReady={this._mapReady}
            >
              { this.state.places.map(place => (
                <MapView.Marker 
                  ref={mark => place.marker = mark}
                  title={place.title}
                  description={place.description}
                  key={place.id}
                    coordinate={{
                      latitude: latitude,
                      longitude: longitude,
                  }}
                />
              ))}
            </MapView>

            <ScrollView
              style={styles.placeContainer}
              horizontal>
                <View style={styles.place}>
                  <Text>{ street + ", " + district + ", " + subregion }</Text>
                  <Text>{ region + ", " + country + ", " + postalCode }</Text>

                  <Text>Latitude: { latitude }</Text>
                  <Text>Longitude: { longitude }</Text>
                </View>
            </ScrollView>
          </View>
        );

      } else {
        return (
          <View style={styles.container}>
            <Text>Espere...</Text>
          </View>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  placeContainer: {
    width: '100%',
    maxHeight: 200, 
        },
        place: {
          width: width - 40,

          maxHeight: 200,
    backgroundColor: '#fff',
    marginHorizontal: 20,
  }
}});
