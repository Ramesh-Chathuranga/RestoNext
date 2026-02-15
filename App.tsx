import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from '@core/modules/store';
import { ThemeModeProvider, useThemeMode, readPersistedTheme, ThemeChoice } from '@core/util/Theme/ThemeModeContext';
import { ThemeProvider } from '@core/util/Theme/ThemeContext';
import { FontProvider } from '@core/util/fonts/FontContext';
import { LightTheme, DarkTheme } from '@core/util/Theme';
import { clFont } from '@core/util/fonts/Font';
import { ToastProvider } from '@core/util/ToastProvider';
import { createLogger } from '@core/util/AppUtil';
import { navigationRef } from '@core/util/NavigationService';
import { RootStack, LoadingScreen } from '@core/route';
import LocationService from '@core/service/Location.service';

const logger = createLogger('App');

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useThemeMode();
  const systemPrefersDark = useColorScheme() === 'dark';
  const activeTheme = mode === 'system' ? (systemPrefersDark ? DarkTheme : LightTheme) : (mode === 'dark' ? DarkTheme : LightTheme);
  const barStyle = mode === 'system' ? (systemPrefersDark ? 'light-content' : 'dark-content') : (mode === 'dark' ? 'light-content' : 'dark-content');

  return (
    <ThemeProvider theme={activeTheme}>
      <FontProvider font={clFont}>
        <SafeAreaProvider>
          <StatusBar barStyle={barStyle as any} />
          {children}
        </SafeAreaProvider>
      </FontProvider>
    </ThemeProvider>
  );
};

function App() {
  const [themeChoice, setThemeChoice] = useState<ThemeChoice | null>(null);
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const persisted = await readPersistedTheme();
      setThemeChoice(persisted ?? 'system');
      // TODO: Initialize i18n here when ready
      setI18nReady(true);

      // Initialize LocationService with store dispatch
      LocationService.init(store.dispatch);

      // Get initial position
      LocationService.getCurrentPosition(
        (position) => {
          logger.log('Initial location:', position.coords);
        },
        (error) => {
          logger.warn('Location error:', error.message);
        },
      );
    };
    init();
  }, []);

  return (
    <Provider store={store}>
      <ThemeModeProvider initialMode={themeChoice ?? 'system'}>
        <ThemeWrapper>
          <ToastProvider>
            <NavigationContainer ref={navigationRef}>
              {!i18nReady || themeChoice === null ? (
                <LoadingScreen />
              ) : (
                <RootStack />
              )}
            </NavigationContainer>
          </ToastProvider>
        </ThemeWrapper>
      </ThemeModeProvider>
    </Provider>
  );
}

export default App;
