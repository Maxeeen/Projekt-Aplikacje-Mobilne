import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Timer } from 'lucide-react-native'; 

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
        if (timeLeft === 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalId);
                    onTimeUp(); 
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isActive, onTimeUp]); 

    const percentage = (timeLeft / duration) * 100;
    
    const isLow = timeLeft <= 10;
    const barColor = isLow ? '#ef4444' : '#10b981'; 

    return (
        <View style={styles.container}>
            <View style={styles.textRow}>
                <Timer size={20} color="#4b5563" />
                <Text style={[styles.timeText, isLow && { color: '#ef4444' }]}>
                    {timeLeft}s
                </Text>
            </View>

            <View style={styles.progressBarContainer}>
                <View 
                    style={[
                        styles.progressBarFill, 
                        { 
                            width: `${percentage}%`,
                            backgroundColor: barColor,
                        }
                    ]} 
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 10,
        flexDirection: 'column', 
        gap: 5,
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
    },
    timeText: {
        fontSize: 18, 
        fontWeight: 'bold', 
        fontVariant: ['tabular-nums'],
        color: '#4b5563',
    },
    progressBarContainer: {
        height: 6,
        width: '100%',
        backgroundColor: '#e5e7eb', 
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
    }
});