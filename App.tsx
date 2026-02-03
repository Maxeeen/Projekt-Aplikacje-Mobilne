import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert, Animated, Platform, Modal } from 'react-native';
import { Audio } from 'expo-av';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ChevronLeft, Lightbulb } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { getRandomFoods, GameMode } from './src/data/foods';
import { calculateDistance, calculatePoints } from './src/utils/scoring';

import MenuScreen from './src/components/MenuScreen';
import GameHeader from './src/components/GameHeader';
import GameMap from './src/components/GameMap';
import GameTimer from './src/components/Timer';

const ROUND_DURATION = 30;

const SOUND_FILES = {
  hint: require('./assets/pop-hint.mp3'),
  correct: require('./assets/fabulous_answer.mp3'),
  finish: require('./assets/Finish.mp3'),
};

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('world'); 
  const [foods, setFoods] = useState(() => getRandomFoods('world', 5));
  const [round, setRound] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  
  // Stan dla Modala wyjścia
  const [modalVisible, setModalVisible] = useState(false);
  // Stan dla Modala wyniku
  const [ScoreModalVisible, setScoreModalVisible] = useState(false);
  
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

  async function playSound(soundName) {
    try {
      const source = SOUND_FILES[soundName];

      if (!source) {
        console.warn(`Sound ${soundName} not found`);
        return;
      }

      const { sound } = await Audio.Sound.createAsync(source);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
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

  const handleTimeOut = async () => {
    let points = 0;
    
    if (selectedLocation) {
        const dist = calculateDistance(
            [selectedLocation.longitude, selectedLocation.latitude],
            currentFood.coordinates
        );
        // Ważne: Przekazujemy showHint, żeby naliczyło karę
        points = calculatePoints(dist, showHint); 
        
        if (points === 5000) {
           await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setScore(prev => prev + points);
    setShowHint(true);
    setShowAnswer(true);

    setTimeout(() => {
        nextRound(points);
    }, 2500);
  };

  const submitAnswer = async () => {
    if (!selectedLocation) return;

    const dist = calculateDistance(
      [selectedLocation.longitude, selectedLocation.latitude],
      currentFood.coordinates
    );
    // Ważne: Przekazujemy showHint, żeby naliczyło karę
    const points = calculatePoints(dist, showHint); 

    if (points === 5000) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await playSound('correct');
    }
    setScore(prev => prev + points);
    setShowHint(true);
    setShowAnswer(true);

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
      setScoreModalVisible(true);
      playSound('finish');
    }
  };


  const restartGame = () => {
    setScoreModalVisible(false);
    setRound(0);
    setScore(0);
    setShowHint(false);
    setShowAnswer(false);
    setSelectedLocation(null);
    setFoods(getRandomFoods(gameMode, 5));
  };


  const goToMenu = () => {
    setScoreModalVisible(false);
    setRound(0);
    setScore(0);
    setGameStarted(false);
    setShowHint(false);
    setShowAnswer(false);
    setSelectedLocation(null);
    setFoods(getRandomFoods(gameMode, 5));
  };


  const handleExitGame = async () => {
    setModalVisible(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const handleHintPress = async () => {
    await playSound('hint');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        
        <TouchableOpacity style={[styles.roundButton, styles.exitButton]} onPress={handleExitGame}>
          <ChevronLeft size={24} color="#4A5284" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.roundButton, styles.hintButton]} onPress={handleHintPress}>
          <Lightbulb size={24} color="#4A5284" />
        </TouchableOpacity>

        <GameTimer 
          key={round} 
          duration={ROUND_DURATION} 
          isActive={!showAnswer} 
          onTimeUp={handleTimeOut} 
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalQuestion}>Czy na pewno chcesz zakończyć grę?</Text>
              <Text style={styles.modalText}>Wszystkie postępy zostaną utracone</Text>
              
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={async () => { 
                    setModalVisible(false); 
                    goToMenu(); 
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
              >
                <Text style={styles.modalButtonText}>Tak, zakończ grę</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Anuluj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


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
      <Modal
          animationType="slide"
          transparent={true}
          visible={ScoreModalVisible}
          statusBarTranslucent={true}
          onRequestClose={() => setScoreModalVisible(false)}
        >
          <View style={styles.ScoreModalOverlay}>
            <View style={styles.ScoreModalContent}>
              <Text style={styles.modalQuestion}>Koniec Gry!</Text>
              <Text style={styles.modalText}>Twój końcowy wynik: {score} pkt</Text>
              <TouchableOpacity style={styles.ScoremodalButton} onPress={restartGame}>
                <Text style={styles.modalButtonText}>Zagraj ponownie</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ScoremodalButtonExit} onPress={async () => { goToMenu(); await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}>
                <Text style={styles.modalButtonText}>Wyjdź do menu głównego</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E4BC', paddingTop: Platform.OS === 'android' ? 30 : 0  },
  overlay: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  confirmButton: { backgroundColor: '#77718C', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
  buttonText: { color: '#F1DCC3', fontSize: 18, fontWeight: 'bold' },
  
  roundButton: {
    position: 'absolute',
    top: 60,
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
  exitButton: { left: 15 },
  hintButton: { right: 15 },
  
  
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center'}, 
  modalContent: { width: '80%', backgroundColor: '#E8E4BC', borderRadius: 20, padding: 20, alignItems: 'center', elevation: 10, shadowColor: '#4A5284' },
  modalQuestion: { fontSize: 24, color: '#4A5284', marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
  modalText: { fontSize: 14, color: '#77718C', marginBottom: 20, textAlign: 'center' },
  modalButton: { backgroundColor: '#f55151', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, marginTop: 5, width: '100%', alignItems: 'center' },
  modalCancelButton: { backgroundColor: '#4A5284', marginTop: 10 },
  modalButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  ScoreModalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  ScoreModalContent: { width: '85%', backgroundColor: '#E8E4BC', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 10, shadowColor: '#4A5284' },
  ScoremodalButton: { backgroundColor: '#4A5284', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, marginTop: 20 },
  ScoremodalButtonExit: { backgroundColor: '#f55151', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, marginTop: 10 },
});