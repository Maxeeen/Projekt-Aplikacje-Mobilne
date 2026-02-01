import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert, Animated, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ChevronLeft, Lightbulb } from 'lucide-react-native';

import { getRandomFoods, GameMode } from './src/data/foods';
import { calculateDistance, calculatePoints } from './src/utils/scoring';

import MenuScreen from './src/components/MenuScreen';
import GameHeader from './src/components/GameHeader';
import GameMap from './src/components/GameMap';
import GameTimer from './src/components/Timer';

const ROUND_DURATION = 15;

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('world'); 
  const [foods, setFoods] = useState(() => getRandomFoods('world', 5));
  const [round, setRound] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
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

 
  const handleTimeOut = () => {
    setShowAnswer(true);
    setTimeout(() => {
        nextRound(0);
    }, 2500);
  };

 
  const submitAnswer = async () => {
    if (!selectedLocation) return;

    const dist = calculateDistance(
      [selectedLocation.longitude, selectedLocation.latitude],
      currentFood.coordinates
    );
    const points = calculatePoints(dist, false);
    
    setScore(prev => prev + points);
    setShowHint(true);
    setShowAnswer(true);
    //await playSound();

    setTimeout(() => {
        nextRound(points);
    }, 2500);
  };

  const nextRound = (pointsLastRound: number) => {
    if (round < 4) {
      setRound(r => r + 1);
      setSelectedLocation(null);
      setShowHint(false);
      setShowAnswer(false);
    } else {
      Alert.alert("Koniec Gry!", `Twój końcowy wynik: ${score + pointsLastRound} pkt`, [
        { text: "Zagraj ponownie", onPress: resetGame }
      ]);
    }
  };

  const resetGame = () => {
    setRound(0);
    setScore(0);
    setGameStarted(false);
    setShowHint(false);
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
  const handleHintPress = () => {
    // jakoś rozdzielić ShowAnswer żeby pokazywał tylko nazwę potrawy, albo dodać nową funkcję?
   //Alert.alert("Podpowiedź", `Ta potrawa nazwya się: ${currentFood.name}`);
    setShowHint(true);
  }

  if (!gameStarted) {
    return (
      <MenuScreen 
        gameMode={gameMode} 
        setGameMode={setGameMode} 
        onStartGame={startGame} 
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        
        <TouchableOpacity style={styles.exitButton} onPress={handleExitGame}>
          <ChevronLeft size={24} color="#4A5284" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.hintButton} onPress={handleHintPress}>
          <Lightbulb size={24} color="#4A5284" />
        </TouchableOpacity>

     
        <GameTimer 
          key={round} 
          duration={ROUND_DURATION} 
          isActive={!showAnswer} 
          onTimeUp={handleTimeOut} 
        />

        <GameHeader 
          currentFood={currentFood}
          showHint={showHint}
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

// Jak zmienić kolor tła obrazkaヾ(•ω•`)o?
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E4BC', paddingTop: Platform.OS === 'android' ? 30 : 0  },
  overlay: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  confirmButton: { backgroundColor: '#77718C', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
  buttonText: { color: '#F1DCC3', fontSize: 18, fontWeight: 'bold' },
  exitButton: {
    position: 'absolute',
    top: 60,
    left: 15,
    zIndex: 100, 
    backgroundColor: '#CFA282', 
    padding: 10,
    borderRadius: 30,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // czy dałoby się zamiast duplikować i zmieniać tylko left na right to jakoś uprościć?
  hintButton: {
    position: 'absolute',
    top: 60,
    right: 15,
    zIndex: 100, 
    backgroundColor: '#CFA282',
    padding: 10,
    borderRadius: 30,
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});