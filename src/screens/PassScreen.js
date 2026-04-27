import React from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import BigButton from '../components/BigButton';
import useGameStore from '../store/gameStore';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function PassScreen({ navigation }) {
  const currentRevealIndex = useGameStore((s) => s.currentRevealIndex);
  const players = useGameStore((s) => s.players);
  const nextPlayer = players[currentRevealIndex];

  // Disable hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [])
  );

  if (!nextPlayer) return null;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Ionicons name="swap-horizontal-outline" size={48} color={colors.textDim} />

        <Text style={styles.title}>Pass the Phone</Text>
        <Text style={styles.subtitle}>
          Hand the phone to{'\n'}
          <Text style={styles.playerName}>{nextPlayer.name}</Text>
        </Text>

        <BigButton
          title="Ready"
          onPress={() => navigation.replace('RevealWait')}
          variant="dark"
          style={styles.btn}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 28,
  },
  playerName: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 22,
  },
  btn: {
    width: '70%',
    marginTop: 40,
  },
});
