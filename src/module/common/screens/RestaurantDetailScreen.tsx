import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '@core/util/Theme';
import { H4, P } from '@component/atom/Typhography';
import { RootStackParamList, Routes } from '../../../core/route/routes';

type RestaurantDetailScreenRouteProp = RouteProp<RootStackParamList, typeof Routes.RESTAURANT_DETAIL>;
type RestaurantDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, typeof Routes.RESTAURANT_DETAIL>;

const RestaurantDetailScreen: React.FC = () => {
    const route = useRoute<RestaurantDetailScreenRouteProp>();
    const navigation = useNavigation<RestaurantDetailScreenNavigationProp>();
    const theme = useTheme();
    const { restaurant } = route.params;

    const handleDirections = () => {
        navigation.navigate(Routes.DIRECTION, { restaurant });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background02(100) }]}>
            {/* Header with back button */}
            <View style={[styles.header, { backgroundColor: theme.background02(100) }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <H4 textAlign="center" color={theme.text01(100)}>←</H4>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <H4 textAlign="left" numberOfLines={1}>{restaurant.name}</H4>
                </View>
            </View>

            {/* Restaurant Image */}
            <Image
                source={{ uri: restaurant.image }}
                style={styles.restaurantImage}
                resizeMode="cover"
            />

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: theme.background01(100) }]}>
                    <H4 textAlign="left" style={styles.spacing}>Directions</H4>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.primary01(100) }]}
                        onPress={handleDirections}>
                        <View style={styles.buttonContent}>
                            <FontAwesome6 name="map" size={18} color="white" style={styles.buttonIcon} />
                            <P textAlign="center" color="white" weight="600">
                                Get Directions
                            </P>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { backgroundColor: theme.background01(100) }]}>
                    <H4 textAlign="left">Restaurant Details</H4>
                    <P textAlign="left" themeShade={75} style={styles.spacing}>
                        Name: {restaurant.name}
                    </P>
                    <P textAlign="left" themeShade={75} style={styles.spacing}>
                        <FontAwesome6 name="star" size={14} color={theme.primary01(100)} /> {restaurant.rating}
                    </P>
                    <P textAlign="left" themeShade={75} style={styles.spacing}>
                        Address: {restaurant.address}
                    </P>
                    <P textAlign="left" themeShade={75} style={styles.spacing}>
                        Type: {restaurant.type.charAt(0).toUpperCase() + restaurant.type.slice(1)}
                    </P>
                    {restaurant.discount && (
                        <P textAlign="left" color={theme.primary01(100)} weight="600" style={styles.spacing}>
                            {restaurant.discount}
                        </P>
                    )}
                </View>

                <View style={[styles.card, { backgroundColor: theme.background01(100) }]}>
                    <H4 textAlign="left" style={styles.spacing}>Menu</H4>
                    <P textAlign="left" themeShade={75}>
                        Menu items will be displayed here
                    </P>
                </View>

                <View style={[styles.card, { backgroundColor: theme.background01(100) }]}>
                    <H4 textAlign="left" style={styles.spacing}>Location</H4>
                    <P textAlign="left" themeShade={75}>
                        Latitude: {restaurant.latitude.toFixed(6)}
                    </P>
                    <P textAlign="left" themeShade={75}>
                        Longitude: {restaurant.longitude.toFixed(6)}
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
    backButton: {
        padding: 8,
    },
    headerCenter: {
        flex: 1,
        marginLeft: 12,
    },
    restaurantImage: {
        width: '100%',
        height: 250,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    card: {
        borderRadius: 12,
        padding: 16,
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
    actionButton: {
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 12,
        alignItems: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
});

export default RestaurantDetailScreen;
