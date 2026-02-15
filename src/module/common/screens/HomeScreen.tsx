import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { RootState } from '@core/modules/store';
import { ThemeMode, useTheme } from '@core/util/Theme';
import { SCREEN_HEIGHT } from '@core/util/Theme/layout';
import { calculateDistance, MAP_PROVIDER } from '@core/util/constant/constant';
import { MOCK_RESTAURANTS, Restaurant } from '@core/util/mockData/restaurants';
import { SearchTextInput } from '@component/atom/TextInput/SearchTextInput';
import { H5, H6, H4, P } from '@component/atom/Typhography';
import { RootStackParamList, Routes } from '@core/route/routes';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import colors from '@core/util/Theme/colors';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, typeof Routes.HOME>;

type RestaurantWithDistance = Restaurant & {
    distance: number;
};

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const theme = useTheme();
    const currentCoords = useSelector((state: RootState) => {
        const common = state.common as any;
        return common.get ? common.get('currentCoods') : common.currentCoods;
    });
    const selectedLocation = useSelector((state: RootState) => {
        const common = state.common as any;
        return common.get ? common.get('selectedLocation') : common.selectedLocation;
    });

    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [restaurants, setRestaurants] = useState<RestaurantWithDistance[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [userLocation, setUserLocation] = useState({
        latitude: 25.141460,
        longitude: 55.185253,
    });
    const [mapRegion, setMapRegion] = useState({
        latitude: 25.141460,
        longitude: 55.185253,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const handleNavigateToDetail = (restaurant: Restaurant) => {
        navigation.navigate(Routes.RESTAURANT_DETAIL, { restaurant });
    };

    const handleNavigateDirection = (restaurant: Restaurant) => {
        navigation.navigate(Routes.DIRECTION, { restaurant });
    };

    const handleOpenLocationSelect = () => {
        navigation.navigate(Routes.LOCATION_SELECT);
    };

    const mapRef = useRef<MapView>(null);

    const handleZoomIn = () => {
        setMapRegion(prev => ({
            ...prev,
            latitudeDelta: prev.latitudeDelta / 2,
            longitudeDelta: prev.longitudeDelta / 2,
        }));
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                ...mapRegion,
                latitudeDelta: mapRegion.latitudeDelta / 2,
                longitudeDelta: mapRegion.longitudeDelta / 2,
            }, 300);
        }
    };

    const handleZoomOut = () => {
        setMapRegion(prev => ({
            ...prev,
            latitudeDelta: prev.latitudeDelta * 2,
            longitudeDelta: prev.longitudeDelta * 2,
        }));
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                ...mapRegion,
                latitudeDelta: mapRegion.latitudeDelta * 2,
                longitudeDelta: mapRegion.longitudeDelta * 2,
            }, 300);
        }
    };

    useEffect(() => {
        if (currentCoords && currentCoords.latitude && currentCoords.longitude) {
            const newLocation = {
                latitude: currentCoords.latitude,
                longitude: currentCoords.longitude,
            };
            setUserLocation(newLocation);

            const newRegion = {
                latitude: currentCoords.latitude,
                longitude: currentCoords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            setMapRegion(newRegion);

            // Animate map to new location
            if (mapRef.current) {
                mapRef.current.animateToRegion(newRegion, 500);
            }
        }
    }, [currentCoords]);

    useEffect(() => {
        // Calculate distances and sort
        const restaurantsWithDistance = MOCK_RESTAURANTS.map(restaurant => {
            const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                restaurant.latitude,
                restaurant.longitude,
            );
            return { ...restaurant, distance };
        })
            .filter(r => r.distance <= 5) // Only show restaurants within 5km
            .sort((a, b) => a.distance - b.distance);

        // Apply filter
        let filtered = restaurantsWithDistance;
        if (selectedFilter !== 'all') {
            filtered = filtered.filter(r => r.type === selectedFilter);
        }

        const query = searchQuery.trim().toLowerCase();
        if (query) {
            filtered = filtered.filter(r =>
                `${r.name} ${r.address} ${r.type}`.toLowerCase().includes(query),
            );
        }

        setRestaurants(filtered);
    }, [userLocation, selectedFilter, searchQuery]);

    const filters = [
        { id: 'all', label: 'All', icon: 'list' as const },
        { id: 'cafe', label: 'Cafe', icon: 'mug-hot' as const },
        { id: 'restaurant', label: 'Restaurants', icon: 'plate-wheat' as const },
        { id: 'bar', label: 'Bar', icon: 'wine-glass' as const },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background02(100) }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.background02(100) }]}>

                <TouchableOpacity style={styles.headerCenter} onPress={handleOpenLocationSelect}>
                    <H6 textAlign="left" themeShade={75}>Offers Near</H6>
                    <H5 textAlign="left" weight="600">{selectedLocation || 'Current Location'} ▼</H5>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: theme.background02(100) }]}>
                <SearchTextInput
                    placeholder="Search for Location You Want to Get Offer"
                    placeholderTextColor={theme.text01(50)}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    containerStyle={{ flex: 1, marginHorizontal: 16, borderRadius: 12 }}
                />
            </View>

            {/* Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersContainer}
                contentContainerStyle={styles.filtersContent}>
                {filters.map(filter => (
                    <TouchableOpacity
                        key={filter.id}
                        style={[
                            styles.filterChip,
                            {
                                backgroundColor:
                                    selectedFilter === filter.id
                                        ? theme.mode == ThemeMode.LIGHT ? colors.LightColors.darkText : theme.primary01(100)
                                        : theme.background02(100),
                            },
                        ]}
                        onPress={() => setSelectedFilter(filter.id)}>
                        <FontAwesome6 name={filter.icon} size={16} color={selectedFilter === filter.id ? theme.light : theme.text01(100)} iconStyle="solid" />
                        <H6 textAlign="center" color={selectedFilter === filter.id ? theme.light : theme.text01(100)} weight="500">
                            {filter.label}
                        </H6>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Map */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider={MAP_PROVIDER}
                    style={styles.map}
                    showsUserLocation
                    followsUserLocation
                    initialRegion={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}>
                    {/* User location marker */}
                    <Marker
                        coordinate={userLocation}
                        pinColor="blue"
                        title="Your Location"
                    />
                    {/* Restaurant markers */}
                    {restaurants.map(restaurant => (
                        <Marker
                            key={restaurant.id}
                            coordinate={{
                                latitude: restaurant.latitude,
                                longitude: restaurant.longitude,
                            }}
                            pinColor="purple"
                            onPress={() => handleNavigateToDetail(restaurant)}>
                            <View style={styles.markerContainer}>
                                <Image
                                    source={{ uri: restaurant.image }}
                                    style={styles.markerImage}
                                />
                                <View style={[styles.markerRatingBadge, { backgroundColor: theme.primary01(100) }]}>
                                    <FontAwesome6 name="star" size={8} color="white" iconStyle="solid" />
                                    <P textAlign="center" color="white" weight="700" size={10} style={{ marginLeft: 3 }}>
                                        {restaurant.rating}
                                    </P>
                                </View>
                                <P color={theme.primary01(100)} textAlign="center" numberOfLines={1} size={9} weight="600" style={styles.markerName}>
                                    {restaurant.name}
                                </P>
                            </View>
                        </Marker>
                    ))}
                </MapView>

                {/* Zoom Controls */}
                <View style={styles.zoomControls}>
                    <TouchableOpacity
                        style={[styles.zoomButton, { backgroundColor: theme.primary01(100) }]}
                        onPress={handleZoomIn}>
                        <P textAlign="center" color="white" weight="700" size={18}>+</P>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.zoomButton, { backgroundColor: theme.primary01(100), marginTop: 8 }]}
                        onPress={handleZoomOut}>
                        <P textAlign="center" color="white" weight="700" size={18}>−</P>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Restaurant List */}
            <ScrollView
                style={styles.restaurantList}
                showsVerticalScrollIndicator={false}>
                {restaurants.map(restaurant => (
                    <View
                        key={restaurant.id}
                        style={[
                            styles.restaurantCard,
                            { backgroundColor: theme.background02(100) },
                        ]}>
                        <Image
                            source={{ uri: restaurant.image }}
                            style={styles.restaurantImage}
                        />
                        <View style={styles.restaurantInfo}>
                            <View style={styles.restaurantHeader}>
                                <H4 textAlign="left" numberOfLines={1}>
                                    {restaurant.name}
                                </H4>
                                {restaurant.discount && (
                                    <View
                                        style={[
                                            styles.discountBadge,
                                            { backgroundColor: theme.primary01(100) },
                                        ]}>
                                        <P textAlign="center" color="white" weight="600" size={12}>
                                            {restaurant.discount}
                                        </P>
                                    </View>
                                )}
                            </View>
                            <View style={styles.restaurantMeta}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <FontAwesome6 name="star" size={14} color={theme.primary01(100)} iconStyle="solid" />
                                    <P textAlign="left" weight="600">{restaurant.rating}</P>
                                </View>
                                <P textAlign="left" themeShade={75} numberOfLines={1} size={12}>
                                    {restaurant.address}
                                </P>
                            </View>
                            <View style={styles.restaurantActions}>
                                <TouchableOpacity
                                    style={[
                                        styles.directionButton,
                                        { backgroundColor: theme.primary01(100) },
                                    ]}
                                    onPress={() => handleNavigateDirection(restaurant)}>
                                    <FontAwesome6 name="location-arrow" size={14} color={theme.mode === ThemeMode.LIGHT ? theme.dark : theme.light} iconStyle="solid" style={{ marginRight: 6 }} />
                                    <P textAlign="center" color={theme.mode === ThemeMode.LIGHT ? theme.dark : theme.light} weight="600">
                                        Direction
                                    </P>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.menuButton,
                                        { backgroundColor: theme.primary01(100) },
                                    ]}
                                    onPress={() => handleNavigateToDetail(restaurant)}>
                                    <FontAwesome6 name="bars" size={14} color="white" iconStyle="solid" style={{ marginRight: 6 }} />
                                    <P textAlign="center" color="white" weight="600">Menu</P>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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
    backButton: {
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
    filtersContainer: {
        maxHeight: 50,
    },
    filtersContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        gap: 6,
    },
    mapContainer: {
        height: SCREEN_HEIGHT * 0.3,
        marginVertical: 12,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFill,
    },
    zoomControls: {
        position: 'absolute',
        right: 12,
        top: 12,
        flexDirection: 'column',
    },
    zoomButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },
    markerContainer: {
        alignItems: 'center',
        width: 70,
    },
    markerImage: {
        width: 46,
        height: 46,
        borderRadius: 23,
        borderWidth: 2.5,
        borderColor: 'white',
    },
    markerRatingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#7C3AED',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        marginTop: -10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },
    markerName: {
        marginTop: 3,
        backgroundColor: 'white',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    restaurantList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    restaurantCard: {
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    restaurantImage: {
        width: '100%',
        height: 200,
    },
    restaurantInfo: {
        padding: 16,
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    discountBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    restaurantMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    restaurantActions: {
        flexDirection: 'row',
        gap: 12,
    },
    directionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    menuButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
});

export default HomeScreen;
