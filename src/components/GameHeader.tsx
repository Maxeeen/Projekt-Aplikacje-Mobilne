import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

interface GameHeaderProps {
  currentFood: any;
  showHint: boolean;
  showAnswer: boolean;
  round: number;
  score: number;
}

export default function GameHeader({ currentFood, showHint, showAnswer, round, score }: GameHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.questionText} >Skąd pochodzi ta potrawa?</Text>
      <Image 
        source={{ uri: `https://tse2.mm.bing.net/th?q=${encodeURIComponent(currentFood.imageQuery)}&w=800&h=600` }} 
        style={styles.foodImage}
        resizeMode="cover"
      />
      
      <View style={styles.infoBox}>
        <View style={styles.textRow}>
           <Text style={styles.foodText}>
             {showHint ? `${currentFood.name}`: "" }
             {showAnswer ? ` (${currentFood.country})` : ""}
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
  questionText: { fontSize: 20, fontWeight: 'bold', color: '#4A5284', textAlign: 'center', marginVertical: 8 },
  header: { height: '48%', backgroundColor: '#E8E4BC', zIndex: 1, padding: 10 }, 
  foodImage: { width: '100%', height: '70%', backgroundColor: '#ffffff' }, 
  infoBox: { padding: 10, flex: 1, justifyContent: 'space-between' },
  textRow: { alignItems: 'center', marginBottom: 5 },
  foodText: { fontSize: 22, fontWeight: 'bold', color: '#4A5284' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  statsText: { fontSize: 16, color: '#77718C' },
  scoreText: { fontSize: 16, color: '#C1908D', fontWeight: 'bold' },
});