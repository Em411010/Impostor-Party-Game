import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@impostor_settings';
const CUSTOM_CATEGORIES_KEY = '@impostor_custom_categories';
const DEFAULT_CAT_ADDITIONS_KEY = '@impostor_default_cat_additions';

const useSettingsStore = create((set, get) => ({
  showCategoryToAll: true,
  allowCategoryRepeat: true,
  showClue: true,
  customCategories: [],
  defaultCategoryAdditions: {}, // { [categoryId]: [{word, clue}, ...] }
  loaded: false,

  loadSettings: async () => {
    try {
      const [settingsJson, categoriesJson, additionsJson] = await Promise.all([
        AsyncStorage.getItem(SETTINGS_KEY),
        AsyncStorage.getItem(CUSTOM_CATEGORIES_KEY),
        AsyncStorage.getItem(DEFAULT_CAT_ADDITIONS_KEY),
      ]);
      const settings = settingsJson ? JSON.parse(settingsJson) : {};
      const customCategories = categoriesJson ? JSON.parse(categoriesJson) : [];
      const defaultCategoryAdditions = additionsJson ? JSON.parse(additionsJson) : {};
      set({
        showCategoryToAll: settings.showCategoryToAll ?? true,
        allowCategoryRepeat: settings.allowCategoryRepeat ?? true,
        showClue: settings.showClue ?? true,
        customCategories,
        defaultCategoryAdditions,
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },

  updateSetting: async (key, value) => {
    set({ [key]: value });
    const { showCategoryToAll, allowCategoryRepeat, showClue } = get();
    const settings = { showCategoryToAll, allowCategoryRepeat, showClue, [key]: value };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  addCustomCategory: async (category) => {
    const { customCategories } = get();
    const updated = [...customCategories, category];
    set({ customCategories: updated });
    await AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(updated));
  },

  updateCustomCategory: async (categoryId, updatedCategory) => {
    const { customCategories } = get();
    const updated = customCategories.map((c) =>
      c.id === categoryId ? { ...c, ...updatedCategory } : c
    );
    set({ customCategories: updated });
    await AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(updated));
  },

  deleteCustomCategory: async (categoryId) => {
    const { customCategories } = get();
    const updated = customCategories.filter((c) => c.id !== categoryId);
    set({ customCategories: updated });
    await AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(updated));
  },

  addWordToCategory: async (categoryId, wordObj) => {
    const { customCategories } = get();
    const updated = customCategories.map((c) => {
      if (c.id === categoryId) {
        return { ...c, words: [...c.words, wordObj] };
      }
      return c;
    });
    set({ customCategories: updated });
    await AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(updated));
  },

  addWordToDefaultCategory: async (categoryId, wordObj) => {
    const { defaultCategoryAdditions } = get();
    const existing = defaultCategoryAdditions[categoryId] || [];
    const updated = { ...defaultCategoryAdditions, [categoryId]: [...existing, wordObj] };
    set({ defaultCategoryAdditions: updated });
    await AsyncStorage.setItem(DEFAULT_CAT_ADDITIONS_KEY, JSON.stringify(updated));
  },

  removeWordFromDefaultCategory: async (categoryId, wordIndex) => {
    const { defaultCategoryAdditions } = get();
    const existing = defaultCategoryAdditions[categoryId] || [];
    const updated = { ...defaultCategoryAdditions, [categoryId]: existing.filter((_, i) => i !== wordIndex) };
    set({ defaultCategoryAdditions: updated });
    await AsyncStorage.setItem(DEFAULT_CAT_ADDITIONS_KEY, JSON.stringify(updated));
  },

  removeWordFromCategory: async (categoryId, wordIndex) => {
    const { customCategories } = get();
    const updated = customCategories.map((c) => {
      if (c.id === categoryId) {
        const newWords = c.words.filter((_, i) => i !== wordIndex);
        return { ...c, words: newWords };
      }
      return c;
    });
    set({ customCategories: updated });
    await AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(updated));
  },
}));

export default useSettingsStore;
