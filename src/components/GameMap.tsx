import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { GameMode } from '../data/foods';

interface GameMapProps {
  gameMode: GameMode;
  onMapPress: (e: any) => void;
  selectedLocation: any;
  showAnswer: boolean;
  currentFood: any;
}
const mapStyle = [
  {
    "featureType": "poi", 
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "water", 
    "elementType": "geometry",
    "stylers": [
      { "color": "#8ef5e9" }
    ]
  },
];

export default function GameMap({ gameMode, onMapPress, selectedLocation, showAnswer, currentFood }: GameMapProps) {
  
  const targetLocation = { 
    latitude: currentFood.coordinates[1], 
    longitude: currentFood.coordinates[0] 
  };

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      customMapStyle={mapStyle} 
      style={styles.map}
      onPress={onMapPress}
      onPoiClick={onMapPress} 
      initialRegion={{
        latitude: gameMode === 'europe' ? 52 : 20,
        longitude: gameMode === 'europe' ? 19 : 0,
        latitudeDelta: gameMode === 'europe' ? 40 : 100,
        longitudeDelta: gameMode === 'europe' ? 40 : 100,
      }}
      toolbarEnabled={false} 
      showsPointsOfInterest={false}
      showsCompass={false}
      showsScale={false}
      showsBuildings={false}
      showsIndoors={false}
    >
      {selectedLocation && (
        <Marker coordinate={selectedLocation} pinColor="orange" />
      )}
      {showAnswer && (
        <Marker 
          coordinate={targetLocation} 
          pinColor="green" 
        />
      )}
      {showAnswer && selectedLocation && (
        <Polyline 
          coordinates={[selectedLocation, targetLocation]}
          strokeWidth={3}
          strokeColor="black" 
          lineDashPattern={[5, 5]}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});