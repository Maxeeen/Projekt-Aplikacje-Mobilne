import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Modal, ScrollView } from 'react-native';
import { GameMode } from '../data/foods';

interface MenuScreenProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  onStartGame: () => void;
}

export default function MenuScreen({ gameMode, setGameMode, onStartGame }: MenuScreenProps) {
  const titleScale = useRef(new Animated.Value(0)).current;
  const infoB = useRef(new Animated.Value(0)).current;

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    Animated.spring(titleScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    const wobble = () => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(1000),
          Animated.sequence([
            Animated.timing(infoB, { toValue: -1, duration: 100, useNativeDriver: true }),
            Animated.timing(infoB, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(infoB, { toValue: -1, duration: 100, useNativeDriver: true }),
            Animated.timing(infoB, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(infoB, { toValue: 0, duration: 100, useNativeDriver: true }),
          ]),
          Animated.delay(3000),
        ])
      ).start();
    };

    wobble();

  }, []);

  const handleInfo = () => {
    setModalVisible(true);

  }

  const wobble = infoB.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'],
  });

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
      <View style={styles.footer}>
        <Animated.View style={{ transform: [{ rotate: wobble }] }}>
          <TouchableOpacity style={styles.infoButton} onPress={handleInfo}>
            <Text style={styles.footerText}>Jak grać?</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Jak grać?</Text>
            <View>
              <Text style={styles.modalText}>Po rozpocząciu gry będziesz miał 15 sekund aby zaznaczyć na mapie miejsce pochodzenia potrawy</Text>
              <Text style={styles.modalText}>Pamiętaj że możesz użyć podpowiedzi aby wyświetlić nazwę potrawy</Text>
              <Text style={styles.modalText}>Korzystając z podpowiedzi zdobędziesz 30% mniej punktów</Text>
              <Text style={styles.modalText}>Powodzenia</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Rozumiem!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#A0D1C1', paddingBottom: 80 },
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
  buttonText: { color: '#4A5284', fontSize: 18, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 190, paddingHorizontal: 20, alignItems: 'center' },
  footerText: { color: '#4A5284', fontSize: 16, fontWeight: 'bold' },
  infoButton: { backgroundColor: '#E8E4BC', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30, elevation: 5 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center'},
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 10, shadowColor: '#4A5284' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#4A5284', marginBottom: 15 },
  modalText: { fontSize: 16, color: '#555', marginBottom: 10, textAlign: 'center', lineHeight: 24},
  closeButton: { backgroundColor: '#4A5284', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, marginTop: 20 },
  closeButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});