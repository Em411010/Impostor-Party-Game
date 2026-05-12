import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useFonts, Creepster_400Regular } from '@expo-google-fonts/creepster';

export default function SplashScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ Creepster_400Regular });

  useEffect(() => {
    if (!fontsLoaded) return;
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [fontsLoaded, navigation]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/splash-icon.png')} style={styles.icon} resizeMode="contain" />
      <Text style={styles.logo}>Could you{'\n'}find one?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontFamily: 'Creepster_400Regular',
    fontSize: 56,
    color: '#cc0000',
    textAlign: 'center',
    lineHeight: 68,
    letterSpacing: 2,
  },
  icon: {
    width: 260,
    height: 260,
    marginBottom: 24,
  },
});

