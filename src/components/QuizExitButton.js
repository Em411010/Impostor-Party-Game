import React from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useQuizStore from '../store/quizStore';
import { colors } from '../theme/colors';

export default function QuizExitButton({ navigation, light = false }) {
  const resetQuiz = useQuizStore((s) => s.resetQuiz);

  const handleExit = () => {
    Alert.alert('Exit Quiz?', 'Current quiz progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Exit',
        style: 'destructive',
        onPress: () => {
          resetQuiz();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        },
      },
    ]);
  };

  return (
    <Pressable
      onPress={handleExit}
      style={({ pressed }) => [
        styles.button,
        light ? styles.buttonLight : styles.buttonDark,
        pressed && styles.buttonPressed,
      ]}
      hitSlop={10}
    >
      <Ionicons
        name="close-outline"
        size={18}
        color={light ? colors.text : colors.white}
      />
      <Text style={[styles.text, { color: light ? colors.text : colors.white }]}>Exit</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  buttonDark: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonLight: {
    backgroundColor: colors.white + 'd9',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});