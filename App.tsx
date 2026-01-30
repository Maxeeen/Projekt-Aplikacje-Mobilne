import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import { getRandomFoods, GameMode } from './src/data/foods';
import { calculateDistance, calculatePoints } from './src/utils/scoring';

import MenuScreen from './src/components/MenuScreen';
import GameHeader from './src/components/GameHeader';
import GameMap from './src/components/GameMap';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('world'); 
  const [foods, setFoods] = useState(() => getRandomFoods('world', 5));
  const [round, setRound] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  
  const buttonOpacity = useRef(new Animated.Value(0)).current; 
  const currentFood = foods[round];

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

  const handleExitGame = () => {
    Alert.alert(
      "Wyjście z gry",
      "Czy na pewno chcesz wrócić do menu? Stracisz obecny wynik.",
      [
        { text: "Anuluj", style: "cancel" },
        { 
          text: "Wychodzę", 
          style: "destructive", 
          onPress: resetGame 
        }
      ]
    );
  };

  // ekran menu
  if (!gameStarted) {
    return (
      <MenuScreen 
        gameMode={gameMode} 
        setGameMode={setGameMode} 
        onStartGame={startGame} 
      />
    );
  }

  // ekran gry
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.exitButton} onPress={handleExitGame}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <GameHeader 
          currentFood={currentFood}
          showAnswer={showAnswer}
          round={round}
          score={score}
        />

        <GameMap 
          gameMode={gameMode}
          onMapPress={handleMapPress}
          selectedLocation={selectedLocation}
          showAnswer={showAnswer}
          currentFood={currentFood}
        />

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
  overlay: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  confirmButton: { backgroundColor: '#000', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  exitButton: {
    position: 'absolute',
    top: 50, 
    left: 20,
    zIndex: 100, 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 10,
    borderRadius: 20,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});