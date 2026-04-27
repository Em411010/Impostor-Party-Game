import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import SetupScreen from '../screens/SetupScreen';
import RevealWaitScreen from '../screens/RevealWaitScreen';
import RoleRevealScreen from '../screens/RoleRevealScreen';
import PassScreen from '../screens/PassScreen';
import DiscussionScreen from '../screens/DiscussionScreen';
import VoteScreen from '../screens/VoteScreen';
import ImpostorGuessScreen from '../screens/ImpostorGuessScreen';
import ResultScreen from '../screens/ResultScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import CreateCategoryScreen from '../screens/CreateCategoryScreen';
import AddWordScreen from '../screens/AddWordScreen';
import HowToPlayScreen from '../screens/HowToPlayScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ModesScreen from '../screens/ModesScreen';
import QuizSetupScreen from '../screens/QuizSetupScreen';
import QuizPassScreen from '../screens/QuizPassScreen';
import QuizQuestionScreen from '../screens/QuizQuestionScreen';
import QuizAnswerResultScreen from '../screens/QuizAnswerResultScreen';
import QuizEliminationScreen from '../screens/QuizEliminationScreen';
import QuizLivesSummaryScreen from '../screens/QuizLivesSummaryScreen';
import QuizWinnerScreen from '../screens/QuizWinnerScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700' },
  contentStyle: { backgroundColor: colors.background },
  animation: 'fade',
};

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Setup"
        component={SetupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RevealWait"
        component={RevealWaitScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="RoleReveal"
        component={RoleRevealScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Pass"
        component={PassScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Discussion"
        component={DiscussionScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Vote"
        component={VoteScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="ImpostorGuess"
        component={ImpostorGuessScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryDetail"
        component={CategoryDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateCategory"
        component={CreateCategoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddWord"
        component={AddWordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HowToPlay"
        component={HowToPlayScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Modes"
        component={ModesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuizSetup"
        component={QuizSetupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuizPass"
        component={QuizPassScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="QuizQuestion"
        component={QuizQuestionScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="QuizAnswerResult"
        component={QuizAnswerResultScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="QuizElimination"
        component={QuizEliminationScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="QuizLivesSummary"
        component={QuizLivesSummaryScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="QuizWinner"
        component={QuizWinnerScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
