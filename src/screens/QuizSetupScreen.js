import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  Switch,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import BigButton from '../components/BigButton';
import PlayerStepper from '../components/PlayerStepper';
import useQuizStore from '../store/quizStore';
import { quizCategories } from '../data/quizCategories';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const ALL_RANDOM_ID = 'all_random';

function buildQuizCategoryPool(categories, metadata) {
  const questions = categories.flatMap((category) =>
    category.questions.map((question) => ({
      ...question,
      categoryId: category.id,
      categoryName: category.name,
      categoryIcon: category.icon,
    }))
  );

  return {
    id: categories.map((category) => category.id).join('_'),
    name:
      metadata?.name ||
      (categories.length === 1 ? categories[0].name : `${categories.length} Categories`),
    icon: metadata?.icon || (categories.length === 1 ? categories[0].icon : 'shuffle-outline'),
    questions,
  };
}

export default function QuizSetupScreen({ navigation }) {
  const startQuiz = useQuizStore((s) => s.startQuiz);

  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [lives, setLives] = useState(2);
  const [includeGeekInRandom, setIncludeGeekInRandom] = useState(false);

  const randomEligibleCategories = useMemo(
    () =>
      quizCategories.filter(
        (category) => category.randomEnabledByDefault !== false || includeGeekInRandom
      ),
    [includeGeekInRandom]
  );

  const geekCategory = useMemo(
    () => quizCategories.find((category) => category.randomEnabledByDefault === false) || null,
    []
  );

  const categoryItems = useMemo(() => {
    const allQuestionCount = randomEligibleCategories.reduce(
      (count, category) => count + category.questions.length,
      0
    );

    return [
      {
        id: ALL_RANDOM_ID,
        name: 'All Random',
        icon: 'shuffle-outline',
        questions: Array.from({ length: allQuestionCount }),
        subtitle: 'Shuffle default categories',
      },
      ...quizCategories.map((category) => ({
        ...category,
        subtitle:
          category.randomEnabledByDefault === false
            ? 'Manual pick only by default'
            : 'Add to the mix',
      })),
    ];
  }, [randomEligibleCategories]);

  const allRandomSelected = selectedCategoryIds.includes(ALL_RANDOM_ID);
  const selectedQuestionCount = useMemo(() => {
    if (allRandomSelected) {
      return randomEligibleCategories.reduce(
        (count, category) => count + category.questions.length,
        0
      );
    }

    return quizCategories.reduce(
      (count, category) =>
        selectedCategoryIds.includes(category.id)
          ? count + category.questions.length
          : count,
      0
    );
  }, [allRandomSelected, randomEligibleCategories, selectedCategoryIds]);

  const addPlayer = useCallback(() => {
    if (playerNames.length < 8) {
      setPlayerNames((prev) => [...prev, `Player ${prev.length + 1}`]);
    }
  }, [playerNames.length]);

  const removePlayer = useCallback(
    (index) => {
      if (playerNames.length > 2) {
        setPlayerNames((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [playerNames.length]
  );

  const updateName = useCallback((index, text) => {
    setPlayerNames((prev) => {
      const arr = [...prev];
      arr[index] = text;
      return arr;
    });
  }, []);

  const toggleCategory = useCallback((categoryId) => {
    if (categoryId === ALL_RANDOM_ID) {
      setSelectedCategoryIds((prev) =>
        prev.includes(ALL_RANDOM_ID) ? [] : [ALL_RANDOM_ID]
      );
      return;
    }

    setSelectedCategoryIds((prev) => {
      const filtered = prev.filter((id) => id !== ALL_RANDOM_ID);
      return filtered.includes(categoryId)
        ? filtered.filter((id) => id !== categoryId)
        : [...filtered, categoryId];
    });
  }, []);

  const canStart = selectedCategoryIds.length > 0 && playerNames.length >= 2;

  const handleStart = () => {
    const chosenCategories = allRandomSelected
      ? randomEligibleCategories
      : quizCategories.filter((category) => selectedCategoryIds.includes(category.id));

    if (chosenCategories.length === 0) return;

    startQuiz(
      playerNames,
      buildQuizCategoryPool(
        chosenCategories,
        allRandomSelected ? { name: 'All Random', icon: 'shuffle-outline' } : undefined
      ),
      lives
    );
    navigation.navigate('QuizPass');
  };

  const selectionText = allRandomSelected
    ? `All Random uses ${randomEligibleCategories.length} categories`
    : selectedCategoryIds.length === 0
    ? 'Pick one or more categories'
    : `${selectedCategoryIds.length} ${selectedCategoryIds.length === 1 ? 'category' : 'categories'} selected`;

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Quiz Survival" navigation={navigation} />

        {/* Players */}
        <Text style={styles.sectionTitle}>Players</Text>
        {playerNames.map((name, index) => (
          <View key={index} style={styles.playerRow}>
            <TextInput
              style={styles.playerInput}
              value={name}
              onChangeText={(text) => updateName(index, text)}
              placeholder={`Player ${index + 1}`}
              placeholderTextColor={colors.textMuted}
              maxLength={20}
            />
            {playerNames.length > 2 && (
              <Pressable onPress={() => removePlayer(index)} style={styles.removeBtn} hitSlop={8}>
                <Ionicons name="close-circle" size={24} color={colors.danger} />
              </Pressable>
            )}
          </View>
        ))}
        {playerNames.length < 8 && (
          <Pressable onPress={addPlayer} style={styles.addPlayerBtn}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.addPlayerText}>Add Player</Text>
          </Pressable>
        )}

        {/* Category */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.selectionSummary}>
          <View>
            <Text style={styles.selectionTitle}>{selectionText}</Text>
            <Text style={styles.selectionHint}>
              Select multiple categories, or use All Random to shuffle the default pool.
            </Text>
          </View>
          <View style={styles.selectionBadge}>
            <Text style={styles.selectionBadgeText}>{selectedQuestionCount} Qs</Text>
          </View>
        </View>

        {geekCategory && (
          <View style={styles.randomOptionCard}>
            <View style={styles.randomOptionText}>
              <Text style={styles.randomOptionTitle}>Include {geekCategory.name} in All Random</Text>
              <Text style={styles.randomOptionHint}>
                Off by default. Turn this on only when you want Geek questions mixed into random rounds.
              </Text>
            </View>
            <Switch
              value={includeGeekInRandom}
              onValueChange={setIncludeGeekInRandom}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={includeGeekInRandom ? colors.primary : colors.neutralLight}
            />
          </View>
        )}

        <View style={styles.categoryGrid}>
          {categoryItems.map((category) => {
            const selected = selectedCategoryIds.includes(category.id);

            return (
              <Pressable
                key={category.id}
                onPress={() => toggleCategory(category.id)}
                style={({ pressed }) => [
                  styles.categoryCardWrap,
                  pressed && styles.categoryCardWrapPressed,
                ]}
              >
                <View style={[styles.categoryCard, selected && styles.categoryCardSelected]}>
                  <View style={styles.categoryCardTop}>
                    <View style={[styles.categoryIconWrap, selected && styles.categoryIconWrapSelected]}>
                      <Ionicons
                        name={category.icon}
                        size={24}
                        color={selected ? colors.primary : colors.textDim}
                      />
                    </View>
                    {selected && (
                      <View style={styles.selectedDot}>
                        <Ionicons name="checkmark" size={14} color={colors.primary} />
                      </View>
                    )}
                  </View>

                  <View style={styles.categoryCopy}>
                    <Text
                      style={[styles.categoryName, selected && styles.categoryNameSelected]}
                      numberOfLines={2}
                    >
                      {category.name}
                    </Text>
                    <Text style={styles.categorySubtitle} numberOfLines={2}>
                      {category.subtitle}
                    </Text>
                  </View>

                  <View style={[styles.questionBadge, selected && styles.questionBadgeSelected]}>
                    <Text
                      style={[styles.questionCount, selected && styles.questionCountSelected]}
                    >
                      {category.questions.length} Qs
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Lives */}
        <Text style={styles.sectionTitle}>Starting Lives</Text>
        <PlayerStepper value={lives} onChange={setLives} min={2} max={10} label="Lives" />

        <BigButton
          title="Start Quiz"
          onPress={handleStart}
          disabled={!canStart}
          style={styles.startBtn}
        />
        <View style={{ height: 24 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 10,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  playerInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  removeBtn: {
    padding: 4,
  },
  addPlayerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  addPlayerText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  selectionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  selectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  selectionHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 3,
  },
  selectionBadge: {
    backgroundColor: colors.primary + '18',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectionBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  randomOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 12,
    gap: 12,
  },
  randomOptionText: {
    flex: 1,
  },
  randomOptionTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  randomOptionHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  categoryCardWrap: {
    width: '48.5%',
    marginBottom: 12,
  },
  categoryCardWrapPressed: {
    opacity: 0.82,
  },
  categoryCard: {
    height: 184,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
  },
  categoryCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  categoryCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconWrapSelected: {
    backgroundColor: colors.primary + '16',
  },
  selectedDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary + '16',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCopy: {
    marginTop: 16,
    minHeight: 58,
  },
  categoryName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  categoryNameSelected: {
    color: colors.primary,
  },
  categorySubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 6,
    lineHeight: 17,
  },
  questionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8,
  },
  questionBadgeSelected: {
    backgroundColor: colors.primary + '16',
  },
  questionCount: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  questionCountSelected: {
    color: colors.primary,
  },
  startBtn: {
    marginTop: 28,
  },
});
