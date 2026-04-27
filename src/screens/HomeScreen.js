import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import BigButton from '../components/BigButton';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.logo}>IMPOSTOR</Text>
        <Text style={styles.tagline}>Offline Party Game</Text>
      </View>

      <View style={styles.buttons}>
        <BigButton
          title="Play Now"
          onPress={() => navigation.navigate('Setup', { mode: 'normal' })}
          variant="primary"
          style={styles.btn}
        />
        <BigButton
          title="Categories"
          onPress={() => navigation.navigate('Categories')}
          variant="dark"
          style={styles.btn}
        />
        <BigButton
          title="How to Play"
          onPress={() => navigation.navigate('HowToPlay')}
          variant="dark"
          style={styles.btn}
        />
        <BigButton
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
          variant="dark"
          style={styles.btn}
        />
      </View>

      <View style={styles.modesSection}>
        <BigButton
          title="Game Modes"
          onPress={() => navigation.navigate('Modes')}
          variant="outline"
          style={styles.btn}
        />
      </View>

      <View style={styles.footer}>
        <Ionicons name="wifi-outline" size={16} color={colors.textMuted} style={{ opacity: 0.5 }} />
        <Text style={styles.footerText}>Offline • Pass the Phone to Play</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 5,
  },
  tagline: {
    fontSize: 14,
    color: colors.textDim,
    marginTop: 6,
    letterSpacing: 1,
  },
  buttons: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  btn: {
    width: '100%',
  },
  modesSection: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    gap: 6,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
