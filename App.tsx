import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, Alert, Animated } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Audio } from 'expo-av';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getRandomFoods, GameMode } from './data/foods';
import { calculateDistance, calculatePoints } from './utils/scoring';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('world'); 
  const [foods, setFoods] = useState(() => getRandomFoods('world', 5));
  const [round, setRound] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const titleScale = useRef(new Animated.Value(0)).current; 
  const buttonOpacity = useRef(new Animated.Value(0)).current; 

  const currentFood = foods[round];

  useEffect(() => {
    if (!gameStarted) {
      Animated.spring(titleScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [gameStarted]);
  useEffect(() => {
    if (!showAnswer && selectedLocation) {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      buttonOpacity.setValue(0);
    }
  }, [selectedLocation, showAnswer]);

  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/success.mp3')
      );
      await sound.playAsync();
    } catch (e) {
    }
  }

  const startGame = () => {
    setFoods(getRandomFoods(gameMode, 5));
    setGameStarted(true);
  };

  const handleMapPress = (e: any) => {
    if (showAnswer) return;
    setSelectedLocation(e.nativeEvent.coordinate);
  };

  const submitAnswer = async () => {
    if (!selectedLocation) return;

    const dist = calculateDistance(
      [selectedLocation.longitude, selectedLocation.latitude],
      currentFood.coordinates
    );
    const points = calculatePoints(dist, false);
    
    setScore(prev => prev + points);
    setShowAnswer(true);
    await playSound();

    setTimeout(() => {
      if (round < 4) {
        setRound(r => r + 1);
        setSelectedLocation(null);
        setShowAnswer(false);
      } else {
        Alert.alert("Koniec Gry!", `Twój końcowy wynik: ${score + points} pkt`, [
          { text: "Zagraj ponownie", onPress: resetGame }
        ]);
      }
    }, 2500);
  };

  const resetGame = () => {
    setRound(0);
    setScore(0);
    setGameStarted(false);
    setShowAnswer(false);
    setSelectedLocation(null);
    setFoods(getRandomFoods(gameMode, 5));
  };

  if (!gameStarted) {
    return (
      <View style={styles.menu}>
        <Animated.View style={{ transform: [{ scale: titleScale }] }}>
          <Text style={styles.title}>Food Origin Game</Text>
        </Animated.View>
        
        <Text style={styles.subtitle}>Wybierz tryb gry:</Text>
        
        <View style={styles.modeContainer}>
          <TouchableOpacity 
            style={[styles.modeButton, gameMode === 'europe' && styles.modeButtonActive]} 
            onPress={() => setGameMode('europe')}
          >
            <Text style={[styles.modeText, gameMode === 'europe' && styles.modeTextActive]}>EUROPA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modeButton, gameMode === 'world' && styles.modeButtonActive]} 
            onPress={() => setGameMode('world')}
          >
            <Text style={[styles.modeText, gameMode === 'world' && styles.modeTextActive]}>ŚWIAT</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.mainButton} onPress={startGame}>
          <Text style={styles.buttonText}>ROZPOCZNIJ GRĘ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={{ uri: `https://tse2.mm.bing.net/th?q=${encodeURIComponent(currentFood.imageQuery)}&w=800&h=600` }} 
            style={styles.foodImage}
            resizeMode="cover"
          />
          
          <View style={styles.infoBox}>
            <View style={styles.textRow}>
               <Text style={styles.foodText}>
                 {showAnswer ? `${currentFood.name} (${currentFood.country})` : "Co to za potrawa?"}
               </Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsText}>Runda: {round + 1}/5</Text>
              <Text style={styles.scoreText}>Punkty: {score}</Text>
            </View>
          </View>
        </View>

        <MapView
          style={styles.map}
          onPress={handleMapPress}
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

        {!showAnswer && selectedLocation && (
          <Animated.View style={[styles.overlay, { opacity: buttonOpacity }]}>
            <TouchableOpacity style={styles.confirmButton} onPress={submitAnswer}>
              <Text style={styles.buttonText}>POTWIERDŹ</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  menu: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#ff6b00', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 20 },
  modeContainer: { flexDirection: 'row', marginBottom: 40, backgroundColor: '#eee', borderRadius: 25, padding: 5 },
  modeButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20 },
  modeButtonActive: { backgroundColor: '#ff6b00' },
  modeText: { fontSize: 16, fontWeight: '600', color: '#666' },
  modeTextActive: { color: '#fff' },

  header: { height: '38%', backgroundColor: '#fff', elevation: 4, zIndex: 1 },
  foodImage: { width: '100%', height: '70%', backgroundColor: '#ddd' }, 
  
  infoBox: { padding: 10, flex: 1, justifyContent: 'space-between' },
  textRow: { alignItems: 'center', marginBottom: 5 },
  foodText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  statsText: { fontSize: 16, color: '#666' },
  scoreText: { fontSize: 16, color: '#ff6b00', fontWeight: 'bold' },
  
  map: { flex: 1 },
  overlay: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  
  mainButton: { backgroundColor: '#ff6b00', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30, elevation: 5 },
  confirmButton: { backgroundColor: '#000', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});