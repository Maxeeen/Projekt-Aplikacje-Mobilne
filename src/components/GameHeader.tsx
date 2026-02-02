import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

interface GameHeaderProps {
  currentFood: any;
  showHint: boolean;
  showAnswer: boolean;
  round: number;
  score: number;
}

export default function GameHeader({ currentFood, showHint, showAnswer, round, score }: GameHeaderProps) {
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    const startValue = displayScore;
    const endValue = score;

    if (startValue === endValue) return;

    const duration = 1000; 
    const startTime = Date.now(); 

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      const ease = 1 - Math.pow(1 - progress, 3);
      
      const current = Math.floor(startValue + (endValue - startValue) * ease);
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [score]); 

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
          <Text style={styles.scoreText}>Punkty: {displayScore}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  questionText: { fontSize: 20, fontWeight: 'bold', color: '#4A5284', textAlign: 'center', marginVertical: 8 },
  header: { height: '48%', backgroundColor: '#E8E4BC', zIndex: 1, padding: 10 }, 
  foodImage: { width: '100%', height: '70%', backgroundColor: '#ddd', borderRadius: 12 }, 
  infoBox: { padding: 10, flex: 1, justifyContent: 'space-between' },
  textRow: { alignItems: 'center', marginBottom: 5 },
  foodText: { fontSize: 22, fontWeight: 'bold', color: '#4A5284' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  statsText: { fontSize: 16, color: '#77718C' },
  scoreText: { fontSize: 20, color: '#C1908D', fontWeight: 'bold', fontVariant: ['tabular-nums'] },
});