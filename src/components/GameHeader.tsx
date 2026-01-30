import React from 'react';
import { StyleSheet, View, Text, Image, Platform } from 'react-native';

interface GameHeaderProps {
  currentFood: any;
  showAnswer: boolean;
  round: number;
  score: number;
}

export default function GameHeader({ currentFood, showAnswer, round, score }: GameHeaderProps) {
  return (
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
  );
}

const styles = StyleSheet.create({
  header: { height: '38%', backgroundColor: '#fff', zIndex: 1, marginTop: Platform.OS === 'android' ? 25 : 0, }, 
  foodImage: { width: '100%', height: '70%', backgroundColor: '#ddd' }, 
  infoBox: { padding: 10, flex: 1, justifyContent: 'space-between' },
  textRow: { alignItems: 'center', marginBottom: 5 },
  foodText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  statsText: { fontSize: 16, color: '#666' },
  scoreText: { fontSize: 16, color: '#ff6b00', fontWeight: 'bold' },
});