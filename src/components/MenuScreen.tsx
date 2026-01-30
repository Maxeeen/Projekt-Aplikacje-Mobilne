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

      <TouchableOpacity style={styles.mainButton} onPress={onStartGame}>
        <Text style={styles.buttonText}>ROZPOCZNIJ GRĘ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#ff6b00', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 20 },
  modeContainer: { flexDirection: 'row', marginBottom: 40, backgroundColor: '#eee', borderRadius: 25, padding: 5 },
  modeButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20 },
  modeButtonActive: { backgroundColor: '#ff6b00' },
  modeText: { fontSize: 16, fontWeight: '600', color: '#666' },
  modeTextActive: { color: '#fff' },
  mainButton: { backgroundColor: '#ff6b00', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30, elevation: 5 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});