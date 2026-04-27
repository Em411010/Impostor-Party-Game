import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import BigButton from '../components/BigButton';
import useSettingsStore from '../store/settingsStore';
import { defaultCategories } from '../data/categories';
import { colors } from '../theme/colors';

export default function AddWordScreen({ route, navigation }) {
  const { categoryId, isCustom } = route.params;
  const addWordToCategory = useSettingsStore((s) => s.addWordToCategory);
  const addWordToDefaultCategory = useSettingsStore((s) => s.addWordToDefaultCategory);
  const customCategories = useSettingsStore((s) => s.customCategories);
  const defaultCategoryAdditions = useSettingsStore((s) => s.defaultCategoryAdditions);
  const [word, setWord] = useState('');
  const [clue, setClue] = useState('');

  const allWords = useMemo(() => {
    if (isCustom) {
      const cat = customCategories.find((c) => c.id === categoryId);
      return cat?.words || [];
    }
    const base = defaultCategories.find((c) => c.id === categoryId);
    const additions = defaultCategoryAdditions[categoryId] || [];
    return [...(base?.words || []), ...additions];
  }, [categoryId, isCustom, customCategories, defaultCategoryAdditions]);

  const handleAdd = () => {
    const trimmedWord = word.trim();
    const trimmedClue = clue.trim();

    if (!trimmedWord) {
      Alert.alert('Error', 'Please enter a word.');
      return;
    }
    if (!trimmedClue) {
      Alert.alert('Error', 'Please enter a one-word clue.');
      return;
    }
    if (trimmedWord.length > 40) {
      Alert.alert('Error', 'Word must be 40 characters or less.');
      return;
    }
    if (trimmedClue.length > 20) {
      Alert.alert('Error', 'Clue must be 20 characters or less.');
      return;
    }

    const duplicate = allWords.find(
      (w) => w.word.toLowerCase() === trimmedWord.toLowerCase()
    );
    if (duplicate) {
      Alert.alert('Error', 'This word already exists in this category.');
      return;
    }

    if (isCustom) {
      addWordToCategory(categoryId, { word: trimmedWord, clue: trimmedClue });
    } else {
      addWordToDefaultCategory(categoryId, { word: trimmedWord, clue: trimmedClue });
    }
    setWord('');
    setClue('');
    Alert.alert('Added', `"${trimmedWord}" added to category.`, [
      { text: 'Add Another' },
      { text: 'Done', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScreenWrapper>
      <ScreenHeader title="Add Word" navigation={navigation} />

      <Text style={styles.label}>Word</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Pizza"
        placeholderTextColor={colors.textMuted}
        value={word}
        onChangeText={setWord}
        maxLength={40}
        autoFocus
      />

      <Text style={styles.label}>One-Word Clue</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Round"
        placeholderTextColor={colors.textMuted}
        value={clue}
        onChangeText={setClue}
        maxLength={20}
      />

      <BigButton
        title="Add Word"
        onPress={handleAdd}
        variant="primary"
        style={styles.btn}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textDim,
    textAlign: 'center',
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDim,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 17,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  btn: {
    width: '100%',
    marginTop: 8,
  },
});
