/**
 * App.tsx — Root component for Dare or Drop
 *
 * Responsibilities:
 *  - Load custom fonts (Inter family from Google Fonts)
 *  - Wrap the app in the GameProvider context
 *  - Route between screens based on game state
 *  - Configure status bar and safe area
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { GameProvider, useGame } from './src/context/GameContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { COLORS } from './src/constants/theme';

/** Screen router — renders the current screen based on game state */
function ScreenRouter() {
  const { state } = useGame();

  switch (state.screen) {
    case 'home':
      return <HomeScreen />;
    case 'game':
      return <GameScreen />;
    case 'gameOver':
      return <GameOverScreen />;
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  // Show a loading spinner while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.neonBlue} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <GameProvider>
      <ScreenRouter />
      <StatusBar style="light" />
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
