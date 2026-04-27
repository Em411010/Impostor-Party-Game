import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const steps = [
  {
    icon: 'people-outline',
    title: 'Gather Players',
    desc: 'Get 3–15 players together. You only need one phone!',
  },
  {
    icon: 'settings-outline',
    title: 'Set Up the Game',
    desc: 'Choose the number of players and pick a category.',
  },
  {
    icon: 'eye-off-outline',
    title: 'View Your Role',
    desc: 'Pass the phone around. Each player privately taps to see their role. Civilians see the secret word. The Impostor does not.',
  },
  {
    icon: 'chatbubbles-outline',
    title: 'Discuss',
    desc: 'Everyone gives a one-word clue related to the word. The Impostor must bluff! Discuss who seems suspicious.',
  },
  {
    icon: 'hand-left-outline',
    title: 'Vote',
    desc: 'Vote on who you think is the Impostor.',
  },
  {
    icon: 'skull-outline',
    title: 'Impostor\'s Last Chance',
    desc: 'If caught, the Impostor gets one guess at the secret word. A correct guess means the Impostor wins anyway!',
  },
  {
    icon: 'trophy-outline',
    title: 'Result',
    desc: 'See who won, reveal the word, and play again!',
  },
];

export default function HowToPlayScreen({ navigation }) {
  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenHeader title="How to Play" navigation={navigation} />

        {steps.map((step, i) => (
          <View key={i} style={styles.step}>
            <View style={styles.stepIcon}>
              <Ionicons name={step.icon} size={24} color={colors.primary} />
              <Text style={styles.stepNumber}>{i + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}

        <View style={styles.tipBox}>
          <Ionicons name="bulb-outline" size={20} color={colors.warning} />
          <Text style={styles.tipText}>
            Tip: Civilians — give clues that prove you know the word, but don't make it too obvious for the Impostor!
          </Text>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepIcon: {
    width: 44,
    alignItems: 'center',
    paddingTop: 2,
  },
  stepNumber: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: colors.textDim,
    lineHeight: 20,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  tipText: {
    color: colors.warning,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
