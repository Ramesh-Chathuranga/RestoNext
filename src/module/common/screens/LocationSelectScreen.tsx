import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { useTheme } from '@core/util/Theme';
import { SearchTextInput } from '@component/atom/TextInput/SearchTextInput';
import { H4, P } from '@component/atom/Typhography';
import { RootStackParamList, Routes } from '@core/route/routes';
import { Actions } from '@core/modules/Actions';

type LocationOption = {
    name: string;
    latitude: number;
    longitude: number;
};

const SUGGESTED_LOCATIONS: LocationOption[] = [
    {
        name: 'Jumeirah St - Umm - 74147 - Dubai',
        latitude: 25.2048,
        longitude: 55.2708,
    },
    {
        name: 'Dubai Marina - 12345 - Dubai',
        latitude: 25.0805,
        longitude: 55.1410,
    },
    {
        name: 'Downtown Dubai - 54321 - Dubai',
        latitude: 25.1972,
        longitude: 55.2744,
    },
    {
        name: 'Business Bay - 67890 - Dubai',
        latitude: 25.1867,
        longitude: 55.2631,
    },
    {
        name: 'Palm Jumeirah - 24680 - Dubai',
        latitude: 25.1124,
        longitude: 55.1390,
    },
    {
        name: 'Al Barsha - 13579 - Dubai',
        latitude: 25.1138,
        longitude: 55.1956,
    },
];

type LocationSelectScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    typeof Routes.LOCATION_SELECT
>;

const LocationSelectScreen: React.FC = () => {
    const navigation = useNavigation<LocationSelectScreenNavigationProp>();
    const dispatch = useDispatch();
    const theme = useTheme();
    const [query, setQuery] = useState('');

    const filteredLocations = useMemo(() => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) {
            return SUGGESTED_LOCATIONS;
        }
        return SUGGESTED_LOCATIONS.filter(location =>
            location.name.toLowerCase().includes(trimmed),
        );
    }, [query]);

    const handleSelectLocation = (location: LocationOption | string) => {
        if (typeof location === 'string') {
            dispatch(Actions.common.updateSelectedLocation(location));
        } else {
            dispatch(Actions.common.updateSelectedLocation(location.name));
            dispatch(Actions.common.updateCurrentUserCoordinates(location.latitude, location.longitude));
        }
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background02(100) }]}>
            <View style={[styles.header, { backgroundColor: theme.background02(100) }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <H4 textAlign="center" color={theme.text01(100)}>✕</H4>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <H4 textAlign="left" numberOfLines={1}>Select Location</H4>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <SearchTextInput
                    placeholder="Search location"
                    placeholderTextColor={theme.text01(50)}
                    value={query}
                    onChangeText={setQuery}
                    containerStyle={{ flex: 1, marginHorizontal: 16, borderRadius: 12 }}
                />
            </View>

            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    style={[styles.option, { backgroundColor: theme.background01(100) }]}
                    onPress={() => handleSelectLocation('Current Location')}>
                    <P textAlign="left" weight="600">Use Current Location</P>
                </TouchableOpacity>

                {filteredLocations.map(location => (
                    <TouchableOpacity
                        key={location.name}
                        style={[styles.option, { backgroundColor: theme.background01(100) }]}
                        onPress={() => handleSelectLocation(location)}>
                        <P textAlign="left" themeShade={75}>{location.name}</P>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 12,
    },
    closeButton: {
        padding: 8,
    },
    headerCenter: {
        flex: 1,
        marginLeft: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    list: {
        flex: 1,
        paddingHorizontal: 16,
    },
    option: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
});

export default LocationSelectScreen;
