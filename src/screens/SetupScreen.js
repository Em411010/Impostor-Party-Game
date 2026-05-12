import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, TextInput, StyleSheet, Pressable } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import BigButton from '../components/BigButton';
import PlayerStepper from '../components/PlayerStepper';
import CategoryCard from '../components/CategoryCard';
import useGameStore from '../store/gameStore';
import useSettingsStore from '../store/settingsStore';
import { defaultCategories } from '../data/categories';
import { getModeRule } from '../engine/modeRules';
import { pickRandom } from '../utils/random';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function SetupScreen({ navigation, route }) {
  const playerCount = useGameStore((s) => s.playerCount);
  const setPlayerCount = useGameStore((s) => s.setPlayerCount);
  const mode = useGameStore((s) => s.mode);
  const targetRoleCount = useGameStore((s) => s.targetRoleCount);
  const setTargetRoleCount = useGameStore((s) => s.setTargetRoleCount);
  const startGame = useGameStore((s) => s.startGame);
  const savedPlayerNames = useGameStore((s) => s.playerNames);
  const customCategories = useSettingsStore((s) => s.customCategories);
  const defaultCategoryAdditions = useSettingsStore((s) => s.defaultCategoryAdditions);
  const activeMode = route?.params?.mode || mode;
  const modeRule = getModeRule(activeMode);

  // Merge default categories with user-added words
  const allCategories = useMemo(() => {
    const defaults = defaultCategories.map((c) => {
      const additions = defaultCategoryAdditions[c.id] || [];
      return additions.length > 0 ? { ...c, words: [...c.words, ...additions] } : c;
    });
    const custom = customCategories
      .filter((c) => c.words.length >= 3)
      .map((c) => ({ ...c, isCustom: true }));
    return [...defaults, ...custom];
  }, [customCategories, defaultCategoryAdditions]);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [playerNames, setPlayerNames] = useState(() =>
    Array.from({ length: playerCount }, (_, i) => savedPlayerNames[i] || `Player ${i + 1}`)
  );

  // Keep playerNames in sync with playerCount
  const handlePlayerCountChange = useCallback((count) => {
    setPlayerCount(count);
    setPlayerNames((prev) => {
      const arr = [...prev];
      while (arr.length < count) arr.push(savedPlayerNames[arr.length] || `Player ${arr.length + 1}`);
      return arr.slice(0, count);
    });
    if (targetRoleCount >= count) {
      setTargetRoleCount(Math.max(1, count - 1));
    }
  }, [targetRoleCount, setPlayerCount, setTargetRoleCount]);

  const handleNameChange = useCallback((index, name) => {
    setPlayerNames((prev) => {
      const arr = [...prev];
      arr[index] = name;
      return arr;
    });
  }, []);

  const handleDeletePlayer = useCallback((index) => {
    const newCount = playerCount - 1;
    setPlayerCount(newCount);
    setPlayerNames((prev) => prev.filter((_, i) => i !== index));
    if (targetRoleCount >= newCount) {
      setTargetRoleCount(Math.max(1, newCount - 1));
    }
  }, [playerCount, targetRoleCount, setPlayerCount, setTargetRoleCount]);

  const toggleCategory = useCallback((id) => {
    if (id === 'random') {
      setSelectedCategoryIds((prev) =>
        prev.includes('random') ? prev.filter((x) => x !== 'random') : ['random']
      );
      return;
    }
    setSelectedCategoryIds((prev) => {
      const filtered = prev.filter((x) => x !== 'random');
      return filtered.includes(id) ? filtered.filter((x) => x !== id) : [...filtered, id];
    });
  }, []);

  const maxTargetRoles = Math.max(1, playerCount - 1);
  const canStart = selectedCategoryIds.length > 0;

  const handleStart = () => {
    let categories;
    if (selectedCategoryIds.includes('random')) {
      categories = [pickRandom(allCategories)];
    } else {
      categories = allCategories.filter((c) => selectedCategoryIds.includes(c.id));
    }
    if (categories.length === 0) return;
    // Ensure names are not empty
    const names = playerNames.map((n, i) => n.trim() || `Player ${i + 1}`);
    startGame(categories, names, activeMode);
    navigation.replace('RevealWait');
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenHeader title={modeRule.setupTitle} navigation={navigation} />

        <Text style={styles.sectionTitle}>Number of Players</Text>
        <PlayerStepper value={playerCount} onChange={handlePlayerCountChange} />

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Player Names</Text>
        {Array.from({ length: playerCount }, (_, i) => (
          <View key={i} style={styles.nameRow}>
            <TextInput
              style={styles.nameInput}
              value={playerNames[i] || ''}
              onChangeText={(text) => handleNameChange(i, text)}
              placeholder={`Player ${i + 1}`}
              placeholderTextColor={colors.textMuted}
              maxLength={20}
            />
            {playerCount > 3 && (
              <Pressable onPress={() => handleDeletePlayer(i)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color="#e53935" />
              </Pressable>
            )}
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{`Number of ${modeRule.countLabel}`}</Text>
        <PlayerStepper value={targetRoleCount} onChange={setTargetRoleCount} min={1} max={maxTargetRoles} label={modeRule.countLabel} />

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Choose Categories</Text>
        <Text style={styles.hint}>Select one or more categories (words will be merged)</Text>

        <FlatList
          data={[{ id: 'random', name: 'Random', icon: 'shuffle-outline', words: [] }, ...allCategories]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              selected={selectedCategoryIds.includes(item.id)}
              onPress={() => toggleCategory(item.id)}
            />
          )}
          style={styles.categoryList}
        />

        <View style={styles.startSection}>
          <BigButton
            title="Start Game"
            onPress={handleStart}
            variant="primary"
            disabled={!canStart}
          />
        </View>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDim,
    marginBottom: 12,
    marginLeft: 4,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 10,
    marginLeft: 4,
    marginTop: -8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    marginBottom: 8,
    paddingRight: 4,
  },
  nameInput: {
    flex: 1,
    padding: 12,
    color: colors.text,
    fontSize: 15,
  },
  deleteBtn: {
    padding: 10,
  },
  categoryList: {
    marginBottom: 20,
  },
  startSection: {
    marginTop: 16,
    marginBottom: 30,
  },
});
