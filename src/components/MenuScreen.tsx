import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { GameMode } from '../data/foods';

interface MenuScreenProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  onStartGame: () => void;
}

export default function MenuScreen({ gameMode, setGameMode, onStartGame }: MenuScreenProps) {
  const titleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(titleScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.menu}>
      <Animated.View style={{ transform: [{ scale: titleScale }] }}>
        <Text style={styles.title}>Food Origin Game</Text>
      </Animated.View>
      
      <Text style={styles.subtitle}>Wybierz tryb gry:</Text>
      
      <View style={styles.modeContainer}>
        <TouchableOpacity 
          style={[styles.modeButton, gameMode === 'europe' && styles.modeButtonActiveEU]} 
          onPress={() => setGameMode('europe')}
        >
          <Text style={[styles.modeText, gameMode === 'europe' && styles.modeTextActiveEU]}>EUROPA</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.modeButton, gameMode === 'world' && styles.modeButtonActiveW]} 
          onPress={() => setGameMode('world')}
        >
          <Text style={[styles.modeText, gameMode === 'world' && styles.modeTextActiveW]}>ŚWIAT</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.mainButton} onPress={onStartGame}>
        <Text style={styles.buttonText}>ROZPOCZNIJ GRĘ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#A0D1C1' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#4A5284', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#679CA6', marginBottom: 20 },
  modeContainer: { flexDirection: 'row', marginBottom: 40, backgroundColor: '#E8E4BC', borderRadius: 25, padding: 5 },
  modeButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20 },
  modeButtonActiveW: { backgroundColor: '#1E4497' },
  modeButtonActiveEU: { backgroundColor: '#003399' },
  modeText: { fontSize: 16, fontWeight: '600', color: '#666' },
  modeTextActiveW: { color: '#519b01' },
  modeTextActiveEU: { color: '#FFCC00' },
  mainButton: { backgroundColor: '#E8E4BC', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30, elevation: 5 },
  buttonText: { color: '#4A5284', fontSize: 18, fontWeight: 'bold' }
});