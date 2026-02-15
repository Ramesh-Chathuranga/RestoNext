import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { RootState } from '@core/modules/store';
import { useTheme } from '@core/util/Theme';
import { SCREEN_HEIGHT } from '@core/util/Theme/layout';
import { H4, P } from '@component/atom/Typhography';
import { RootStackParamList, Routes } from '../../../core/route/routes';
import { MAP_PROVIDER } from '@core/util/constant/constant';

type DirectionScreenRouteProp = RouteProp<RootStackParamList, typeof Routes.DIRECTION>;

const DirectionScreen: React.FC = () => {
    const route = useRoute<DirectionScreenRouteProp>();
    const navigation = useNavigation();
    const theme = useTheme();
    const { restaurant } = route.params;
    const mapRef = useRef<MapView>(null);

    const currentCoords = useSelector((state: RootState) => {
        const common = state.common as any;
        return common.get ? common.get('currentCoods') : common.currentCoods;
    });

    const [userLocation] = useState({
        latitude: currentCoords?.latitude || 25.141460,
        longitude: currentCoords?.longitude || 55.185253,
    });

    const [mapRegion, setMapRegion] = useState({
        latitude: ((currentCoords?.latitude || 25.141460) + restaurant.latitude) / 2,
        longitude: ((currentCoords?.longitude || 55.185253) + restaurant.longitude) / 2,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

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

    return (
        <View style={[styles.container, { backgroundColor: theme.background02(100) }]}>
            {/* Header with close button */}
            <View style={[styles.header, { backgroundColor: theme.background02(100) }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <H4 textAlign="center" color={theme.text01(100)}>✕</H4>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <H4 textAlign="left" numberOfLines={1}>Directions</H4>
                </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Map Container */}
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        provider={MAP_PROVIDER}
                        style={styles.map}
                        showsUserLocation
                        followsUserLocation
                        initialRegion={{
                            latitude: (userLocation.latitude + restaurant.latitude) / 2,
                            longitude: (userLocation.longitude + restaurant.longitude) / 2,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}>
                        {/* Path Line */}
                        <Polyline
                            coordinates={[
                                {
                                    latitude: userLocation.latitude,
                                    longitude: userLocation.longitude,
                                },
                                {
                                    latitude: restaurant.latitude,
                                    longitude: restaurant.longitude,
                                },
                            ]}
                            strokeColor={theme.primary01(100)}
                            strokeWidth={3}
                            lineDashPattern={[10]}
                        />

                        {/* User Location Marker */}
                        <Marker
                            coordinate={userLocation}
                            pinColor="blue"
                            title="Your Location">
                            <View style={styles.userMarker}>
                                <P textAlign="center" color="white" weight="700" size={12}>📍</P>
                            </View>
                        </Marker>

                        {/* Restaurant Marker */}
                        <Marker
                            coordinate={{
                                latitude: restaurant.latitude,
                                longitude: restaurant.longitude,
                            }}
                            pinColor="red"
                            title={restaurant.name}>
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
                                <P textAlign="center" numberOfLines={1} size={9} weight="600" style={styles.markerName}>
                                    {restaurant.name}
                                </P>
                            </View>
                        </Marker>
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

                    {/* Open in Google Maps Button */}
                    <TouchableOpacity
                        style={[styles.googleMapsButton, { backgroundColor: theme.primary01(100) }]}
                        onPress={() => {
                            Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${restaurant.latitude},${restaurant.longitude}&travelmode=driving`);
                        }}>
                        <View style={styles.googleMapsButtonContent}>
                            <FontAwesome6 name="map" size={14} color="white" style={styles.googleMapsIcon} />
                            <P textAlign="center" color="white" weight="600" size={12}>
                                Google Maps
                            </P>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Restaurant Info Card */}
                <View style={[styles.card, { backgroundColor: theme.background01(100) }]}>
                    <H4 textAlign="left" style={styles.spacing}>{restaurant.name}</H4>
                    <P textAlign="left" themeShade={75} style={styles.spacing}>
                        <FontAwesome6 name="map" size={14} color={theme.primary01(100)} /> {restaurant.address}
                    </P>
                    <P textAlign="left" themeShade={75} style={styles.spacing}>
                        <FontAwesome6 name="star" size={14} color={theme.primary01(100)} /> Rating: {restaurant.rating}
                    </P>
                </View>

                {/* Coordinates Info Card */}
                <View style={[styles.card, { backgroundColor: theme.background01(100) }]}>
                    <H4 textAlign="left" style={styles.spacing}>Coordinates</H4>
                    <P textAlign="left" themeShade={75} style={styles.spacing} size={11}>
                        Restaurant Lat: {restaurant.latitude.toFixed(6)}
                    </P>
                    <P textAlign="left" themeShade={75} style={styles.spacing} size={11}>
                        Restaurant Lon: {restaurant.longitude.toFixed(6)}
                    </P>
                    <P textAlign="left" themeShade={75} style={styles.spacing} size={11}>
                        Your Lat: {userLocation.latitude.toFixed(6)}
                    </P>
                    <P textAlign="left" themeShade={75} size={11}>
                        Your Lon: {userLocation.longitude.toFixed(6)}
                    </P>
                </View>

                {/* Directions Info Card */}
                <View style={[styles.card, { backgroundColor: theme.background01(100) }]}>
                    <H4 textAlign="left" style={styles.spacing}>How to Get There</H4>
                    <P textAlign="left" themeShade={75}>
                        Tap the map to view detailed directions or open in Google Maps for turn-by-turn navigation.
                    </P>
                </View>
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
    content: {
        flex: 1,
    },
    mapContainer: {
        height: SCREEN_HEIGHT * 0.4,
        marginBottom: 16,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFill,
    },
    userMarker: {
        backgroundColor: '#3B82F6',
        borderRadius: 20,
        padding: 6,
        borderWidth: 2,
        borderColor: 'white',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    googleMapsButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },
    zoomControls: {
        position: 'absolute',
        left: 12,
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
    card: {
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    spacing: {
        marginVertical: 8,
    },
    mapButton: {
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 12,
        alignItems: 'center',
    },
    googleMapsButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleMapsIcon: {
        marginRight: 6,
    },
});

export default DirectionScreen;
