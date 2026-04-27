import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import BigButton from '../components/BigButton';
import { defaultCategories } from '../data/categories';
import useSettingsStore from '../store/settingsStore';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function CategoriesScreen({ navigation }) {
  const customCategories = useSettingsStore((s) => s.customCategories);

  const allCategories = useMemo(() => {
    const custom = customCategories.map((c) => ({ ...c, isCustom: true }));
    return [...defaultCategories, ...custom];
  }, [customCategories]);

  const renderCategory = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('CategoryDetail', { categoryId: item.id, isCustom: !!item.isCustom })}
    >
      <View style={styles.cardLeft}>
        <Ionicons name={item.icon || 'help-circle-outline'} size={28} color={colors.primary} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardCount}>{item.words.length} words</Text>
        </View>
      </View>
      {item.isCustom && (
        <View style={styles.customTag}>
          <Text style={styles.customTagText}>Custom</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );

  return (
    <ScreenWrapper>
      <ScreenHeader title="Categories" navigation={navigation} />

      <FlatList
        data={allCategories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      <BigButton
        title="+ Create Category"
        onPress={() => navigation.navigate('CreateCategory')}
        variant="primary"
        style={styles.createBtn}
      />
      <View style={{ height: 16 }} />
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
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardInfo: {
    marginLeft: 14,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  cardCount: {
    fontSize: 13,
    color: colors.textDim,
    marginTop: 2,
  },
  customTag: {
    backgroundColor: colors.primary + '30',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  customTagText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  createBtn: {
    width: '100%',
  },
});
