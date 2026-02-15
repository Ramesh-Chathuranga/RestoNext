import { Restaurant } from '@core/util/mockData/restaurants';

export const Routes = {
  HOME: 'Home',
  RESTAURANT_DETAIL: 'RestaurantDetail',
  DIRECTION: 'Direction',
  LOCATION_SELECT: 'LocationSelect',
} as const;

export type RootStackParamList = {
  [Routes.HOME]: undefined;
  [Routes.RESTAURANT_DETAIL]: { restaurant: Restaurant };
  [Routes.DIRECTION]: { restaurant: Restaurant };
  [Routes.LOCATION_SELECT]: undefined;
};
