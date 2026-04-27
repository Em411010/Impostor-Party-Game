import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import useSettingsStore from '../store/settingsStore';
import { colors } from '../theme/colors';

export default function SettingsScreen({ navigation }) {
  const showCategoryToAll = useSettingsStore((s) => s.showCategoryToAll);
  const allowCategoryRepeat = useSettingsStore((s) => s.allowCategoryRepeat);
  const showClue = useSettingsStore((s) => s.showClue);
  const updateSetting = useSettingsStore((s) => s.updateSetting);

  return (
    <ScreenWrapper>
      <ScreenHeader title="Settings" navigation={navigation} />

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Show Category to All</Text>
            <Text style={styles.rowDesc}>
              Show the category name to the Impostor on their reveal screen
            </Text>
          </View>
          <Switch
            value={showCategoryToAll}
            onValueChange={(v) => updateSetting('showCategoryToAll', v)}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
            thumbColor={showCategoryToAll ? colors.primary : colors.neutralLight}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Allow Category Repeat</Text>
            <Text style={styles.rowDesc}>
              Allow the same category to be selected in consecutive rounds
            </Text>
          </View>
          <Switch
            value={allowCategoryRepeat}
            onValueChange={(v) => updateSetting('allowCategoryRepeat', v)}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
            thumbColor={allowCategoryRepeat ? colors.primary : colors.neutralLight}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Show Clue</Text>
            <Text style={styles.rowDesc}>
              Show the suggested clue to the Impostor on their reveal screen
            </Text>
          </View>
          <Switch
            value={showClue}
            onValueChange={(v) => updateSetting('showClue', v)}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
            thumbColor={showClue ? colors.primary : colors.neutralLight}
          />
        </View>
      </View>

      <View style={styles.about}>
        <Text style={styles.aboutTitle}>Impostor v1.0.0</Text>
        <Text style={styles.aboutText}>Offline Party Game</Text>
      </View>
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowText: {
    flex: 1,
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  rowDesc: {
    fontSize: 13,
    color: colors.textDim,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  about: {
    alignItems: 'center',
    marginTop: 40,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDim,
  },
  aboutText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
});
