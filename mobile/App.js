import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/lib/store';
import RootNavigator from './src/navigation/RootNavigator';
import AnimatedSplash from './src/components/AnimatedSplash';

// Empêche le splash natif de disparaître : notre splash animé prend le relais.
SplashScreen.preventAutoHideAsync().catch(() => {});

function Shell() {
  const { booting } = useApp();
  const [splashDone, setSplashDone] = useState(false);

  // Masque le splash natif dès que le JS est prêt (notre overlay animé le remplace sans coupure).
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <RootNavigator />
      {!splashDone && <AnimatedSplash ready={!booting} onFinish={() => setSplashDone(true)} />}
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <Shell />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
