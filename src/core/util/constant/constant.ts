import { getLocales } from 'react-native-localize';
import {
  // PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';

export const DEFAULT_LOCALE = getLocales()[0].languageCode || 'en';
export const DEFAULT_COUNTRY_CODE = getLocales()[0].countryCode || 'US';
export const DEFAULT_LANGUAGE_TAG = getLocales()[0].languageTag || 'en-US';
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const PHONE_REGEX =
  /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/;

export const EMAIL_REGEX =
  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIME_FORMAT = 'HH:mm';

// Map provider
export const MAP_PROVIDER = PROVIDER_DEFAULT;
export const GOOGLE_MAPS_API_KEY = 'AIzaSyD1VLLxNZBDGmBu-jFwLhR7SPQnO0S0g4Y';

// Location utils
export const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Radius of earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
