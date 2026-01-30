import {Timer} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform } from 'react-native';

interface TimerProps {
    duration: number;
    onTimeUp: () => void;
    isActive: boolean;
}

export default function GameTimer({ duration, onTimeUp, isActive }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (!isActive) return;

        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, timeLeft, onTimeUp]);

    const percentage = (timeLeft / duration) * 100;
    const isLow = timeLeft <=10;

    return (
    <View style={styles.container}>
      <View style={styles.textColumn}>
        <Text style={styles.label}>Czas</Text>
        <Text style={[styles.timeText, isLow && { color: '#dc2626' }]}>
          {timeLeft}s
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
                width: `${percentage}%`,
                backgroundColor: isLow ? '#dc2626' : '#10b981',
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'android' ? 25 : 0,
    flexDirection: 'row', 
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 12,
  },
  textColumn: {
    flexDirection: 'column', 
    gap: 2,
  },
  label: {
    fontSize: 12, 
    color: '#4b5563', 
  },
  timeText: {
    fontSize: 24, 
    fontWeight: 'bold', 
    fontVariant: ['tabular-nums'], 
  },
  progressBarContainer: {
    height: 8,
    width: 120,
    backgroundColor: '#e5e7eb', 
    borderRadius: 4,
    overflow: 'hidden',
    marginLeft: 10, 
  },
  progressBarFill: {
    height: '100%',
  }
});