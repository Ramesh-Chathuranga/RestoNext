import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from "@module/index";
import RestaurantDetailScreen from '../../module/common/screens/RestaurantDetailScreen';
import DirectionScreen from '../../module/common/screens/DirectionScreen';
import LocationSelectScreen from '../../module/common/screens/LocationSelectScreen';
import { RootStackParamList, Routes } from './routes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
    return (
        <Stack.Navigator
            initialRouteName={Routes.HOME}
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name={Routes.HOME}
                component={HomeScreen}
            />
            <Stack.Screen
                name={Routes.RESTAURANT_DETAIL}
                component={RestaurantDetailScreen}
                options={{
                    presentation: 'modal',
                    animationTypeForReplace: 'push',
                    gestureEnabled: true,
                    animation: 'flip',
                }}
            />
            <Stack.Screen
                name={Routes.DIRECTION}
                component={DirectionScreen}
                options={{
                    presentation: 'modal',
                    animationTypeForReplace: 'push',
                    gestureEnabled: true,
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name={Routes.LOCATION_SELECT}
                component={LocationSelectScreen}
                options={{
                    presentation: 'modal',
                    animationTypeForReplace: 'push',
                    gestureEnabled: true,
                    animation: 'slide_from_bottom',
                }}
            />
        </Stack.Navigator>
    );
};

export default RootStack;
