import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import BigButton from '../components/BigButton';
import { defaultCategories } from '../data/categories';
import useSettingsStore from '../store/settingsStore';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function CategoryDetailScreen({ route, navigation }) {
  const { categoryId, isCustom } = route.params;
  const customCategories = useSettingsStore((s) => s.customCategories);
  const defaultCategoryAdditions = useSettingsStore((s) => s.defaultCategoryAdditions);
  const removeWordFromCategory = useSettingsStore((s) => s.removeWordFromCategory);
  const removeWordFromDefaultCategory = useSettingsStore((s) => s.removeWordFromDefaultCategory);
  const deleteCustomCategory = useSettingsStore((s) => s.deleteCustomCategory);

  const category = useMemo(() => {
    if (isCustom) {
      return customCategories.find((c) => c.id === categoryId);
    }
    const base = defaultCategories.find((c) => c.id === categoryId);
    if (!base) return null;
    const additions = defaultCategoryAdditions[categoryId] || [];
    return { ...base, words: [...base.words, ...additions], _additionsCount: additions.length };
  }, [categoryId, isCustom, customCategories, defaultCategoryAdditions]);

  if (!category) return null;

  const handleDeleteWord = (index) => {
    if (!isCustom) {
      // For default categories, only user-added words (at the end) can be deleted
      const baseWordCount = category.words.length - (category._additionsCount || 0);
      if (index < baseWordCount) return; // can't delete built-in words
      const additionIndex = index - baseWordCount;
      Alert.alert('Remove Word', `Remove "${category.words[index].word}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeWordFromDefaultCategory(categoryId, additionIndex) },
      ]);
      return;
    }
    Alert.alert('Remove Word', `Remove "${category.words[index].word}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeWordFromCategory(categoryId, index) },
    ]);
  };

  const handleDeleteCategory = () => {
    Alert.alert('Delete Category', `Delete "${category.name}" and all its words?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteCustomCategory(categoryId);
          navigation.goBack();
        },
      },
    ]);
  };

  const renderWord = ({ item, index }) => {
    const baseWordCount = isCustom ? 0 : (category.words.length - (category._additionsCount || 0));
    const canDelete = isCustom || index >= baseWordCount;
    return (
      <View style={styles.wordRow}>
        <View style={styles.wordInfo}>
          <Text style={styles.wordText}>{item.word}</Text>
          <Text style={styles.clueText}>Clue: {item.clue}</Text>
        </View>
        {canDelete && (
          <Ionicons
            name="trash-outline"
            size={18}
            color={colors.danger}
            onPress={() => handleDeleteWord(index)}
          />
        )}
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <ScreenHeader title={category.name} navigation={navigation} />
      <View style={styles.categoryInfo}>
        <Ionicons name={category.icon || 'help-circle-outline'} size={32} color={colors.primary} />
        <Text style={styles.count}>{category.words.length} words</Text>
      </View>

      <FlatList
        data={category.words}
        keyExtractor={(item, i) => `${item.word}-${i}`}
        renderItem={renderWord}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      <View style={styles.actions}>
        <BigButton
          title="+ Add Word"
          onPress={() => navigation.navigate('AddWord', { categoryId, isCustom: !!isCustom })}
          variant="primary"
          style={styles.btn}
        />
        {isCustom && (
          <BigButton
            title="Delete Category"
            onPress={handleDeleteCategory}
            variant="danger"
            style={styles.btn}
          />
        )}
      </View>
      <View style={{ height: 16 }} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  categoryInfo: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  count: {
    fontSize: 14,
    color: colors.textDim,
    marginTop: 2,
  },
  list: {
    paddingBottom: 16,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 6,
  },
  wordInfo: {
    flex: 1,
  },
  wordText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  clueText: {
    fontSize: 13,
    color: colors.textDim,
    marginTop: 2,
  },
  actions: {
    gap: 10,
  },
  btn: {
    width: '100%',
  },
});
