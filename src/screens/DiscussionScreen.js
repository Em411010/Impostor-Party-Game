import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import BigButton from '../components/BigButton';
import useGameStore from '../store/gameStore';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function DiscussionScreen({ navigation }) {
  const goToVoting = useGameStore((s) => s.goToVoting);
  const playerCount = useGameStore((s) => s.playerCount);
  const discussionFirstPlayer = useGameStore((s) => s.discussionFirstPlayer);
  const discussionDirection = useGameStore((s) => s.discussionDirection);

  const handleProceed = () => {
    goToVoting();
    navigation.replace('Vote');
  };

  const directionIcon = discussionDirection === 'clockwise' ? 'arrow-forward-circle-outline' : 'arrow-back-circle-outline';

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Ionicons name="chatbubbles-outline" size={56} color={colors.primary} />

        <Text style={styles.title}>Discussion Time</Text>
        <Text style={styles.subtitle}>Everyone has viewed their role</Text>

        <View style={styles.orderBox}>
          <Ionicons name="person-outline" size={22} color={colors.warning} />
          <Text style={styles.orderText}>
            <Text style={styles.orderBold}>{discussionFirstPlayer?.name ?? '...'}</Text> starts
          </Text>
          <Ionicons name={directionIcon} size={22} color={colors.primary} style={{ marginLeft: 8 }} />
          <Text style={styles.orderText}>{discussionDirection === 'clockwise' ? 'Clockwise' : 'Counter-clockwise'}</Text>
        </View>

        <View style={styles.rules}>
          <View style={styles.ruleRow}>
            <Ionicons name="mic-outline" size={20} color={colors.civilian} />
            <Text style={styles.ruleText}>Each player gives a one-word clue</Text>
          </View>
          <View style={styles.ruleRow}>
            <Ionicons name="refresh-outline" size={20} color={colors.primary} />
            <Text style={styles.ruleText}>Do <Text style={styles.ruleBold}>2 full rotations</Text> before voting</Text>
          </View>
          <View style={styles.ruleRow}>
            <Ionicons name="search-outline" size={20} color={colors.warning} />
            <Text style={styles.ruleText}>Discuss who seems suspicious</Text>
          </View>
          <View style={styles.ruleRow}>
            <Ionicons name="people-outline" size={20} color={colors.textDim} />
            <Text style={styles.ruleText}>{playerCount} players in this round</Text>
          </View>
        </View>

        <BigButton
          title="Proceed to Vote"
          onPress={handleProceed}
          variant="primary"
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
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textDim,
    marginTop: 6,
    marginBottom: 20,
  },
  orderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 6,
  },
  orderText: {
    color: colors.text,
    fontSize: 15,
  },
  orderBold: {
    fontWeight: '700',
    color: colors.warning,
  },
  rules: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 36,
    gap: 14,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ruleText: {
    color: colors.text,
    fontSize: 15,
    flex: 1,
  },
  ruleBold: {
    fontWeight: '700',
    color: colors.primary,
  },
  btn: {
    width: '80%',
  },
});
