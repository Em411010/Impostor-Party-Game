import React from 'react';
import { View, StyleSheet, Platform, StatusBar, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const DEFAULT_BG = require('../../assets/game-bg.png');

export default function ScreenWrapper({ children, style, backgroundColor, backgroundImage }) {
  // backgroundImage={false} → solid color only; undefined → default game-bg; image source → use that
  const imgSource = backgroundImage === false
    ? null
    : (backgroundImage !== undefined ? backgroundImage : DEFAULT_BG);

  const inner = (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: imgSource ? 'transparent' : (backgroundColor || colors.background) }]}
      edges={['left', 'right']}
    >
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );

  if (imgSource) {
    return (
      <ImageBackground
        source={imgSource}
        style={[styles.fullScreen, { backgroundColor: backgroundColor || colors.background }]}
        resizeMode="cover"
      >
        {inner}
      </ImageBackground>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 44,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
