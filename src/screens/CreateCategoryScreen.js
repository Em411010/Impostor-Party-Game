import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import BigButton from '../components/BigButton';
import useSettingsStore from '../store/settingsStore';
import { colors } from '../theme/colors';

const ICON_OPTIONS = [
  'help-circle-outline',
  'star-outline',
  'heart-outline',
  'flame-outline',
  'musical-notes-outline',
  'color-palette-outline',
  'planet-outline',
  'leaf-outline',
  'pizza-outline',
  'car-outline',
  'book-outline',
  'football-outline',
  'build-outline',
  'diamond-outline',
  'school-outline',
];

export default function CreateCategoryScreen({ navigation }) {
  const addCustomCategory = useSettingsStore((s) => s.addCustomCategory);
  const customCategories = useSettingsStore((s) => s.customCategories);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Please enter a category name.');
      return;
    }
    if (trimmed.length > 30) {
      Alert.alert('Error', 'Category name must be 30 characters or less.');
      return;
    }
    const id = 'custom_' + trimmed.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    const existing = customCategories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      Alert.alert('Error', 'A custom category with this name already exists.');
      return;
    }

    addCustomCategory({
      id,
      name: trimmed,
      icon,
      words: [],
      isCustom: true,
    });

    navigation.replace('CategoryDetail', { categoryId: id, isCustom: true });
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenHeader title="New Category" navigation={navigation} />

        <Text style={styles.label}>Category Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Food, Movies, etc."
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          maxLength={30}
          autoFocus
        />

        <Text style={styles.label}>Choose Icon</Text>
        <View style={styles.iconGrid}>
          {ICON_OPTIONS.map((ic) => {
            const Ionicons = require('@expo/vector-icons').Ionicons;
            const selected = icon === ic;
            return (
              <View
                key={ic}
                style={[styles.iconOption, selected && styles.iconSelected]}
              >
                <Ionicons
                  name={ic}
                  size={26}
                  color={selected ? colors.primary : colors.textDim}
                  onPress={() => setIcon(ic)}
                />
              </View>
            );
          })}
        </View>

        <BigButton
          title="Create Category"
          onPress={handleCreate}
          variant="primary"
          style={styles.btn}
        />
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
    marginTop: 20,
    marginBottom: 24,
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
    marginBottom: 24,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  btn: {
    width: '100%',
    marginBottom: 20,
  },
});
