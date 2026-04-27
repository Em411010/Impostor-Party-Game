import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function ScreenWrapper({ children, style, backgroundColor }) {
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: backgroundColor || colors.background }]}
      edges={['left', 'right']}
    >
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 44,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
