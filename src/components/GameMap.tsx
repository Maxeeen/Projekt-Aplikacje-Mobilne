import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { GameMode } from '../data/foods';

interface GameMapProps {
  gameMode: GameMode;
  onMapPress: (e: any) => void;
  selectedLocation: any;
  showAnswer: boolean;
  currentFood: any;
}

export default function GameMap({ gameMode, onMapPress, selectedLocation, showAnswer, currentFood }: GameMapProps) {
  return (
    <MapView
      style={styles.map}
      onPress={onMapPress}
      initialRegion={{
        latitude: gameMode === 'europe' ? 52 : 20,
        longitude: gameMode === 'europe' ? 19 : 0,
        latitudeDelta: gameMode === 'europe' ? 40 : 100,
        longitudeDelta: gameMode === 'europe' ? 40 : 100,
      }}
    >
      {selectedLocation && <Marker coordinate={selectedLocation} pinColor="orange" />}
      {showAnswer && (
        <>
          <Marker 
            coordinate={{ latitude: currentFood.coordinates[1], longitude: currentFood.coordinates[0] }} 
            pinColor="green" 
          />
          <Polyline 
            coordinates={[
              selectedLocation,
              { latitude: currentFood.coordinates[1], longitude: currentFood.coordinates[0] }
            ]}
            strokeWidth={3}
            strokeColor="black"
          />
        </>
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});