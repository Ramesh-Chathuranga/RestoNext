import Geolocation from '@react-native-community/geolocation';
import { Dispatch } from 'redux';
import { Actions } from '@core/modules/Actions';
import { createLogger } from '@core/util/AppUtil';

const logger = createLogger('LocationService');

type Position = {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
};

type PositionError = {
  code: number;
  message: string;
  PERMISSION_DENIED: number;
  POSITION_UNAVAILABLE: number;
  TIMEOUT: number;
};

class LocationService {
  private watchId: number | null = null;
  private dispatch: Dispatch | null = null;

  /**
   * Initialize the service with Redux dispatch
   */
  init(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  /**
   * Get current position once
   */
  getCurrentPosition(
    onSuccess?: (position: Position) => void,
    onError?: (error: PositionError) => void,
  ) {
    Geolocation.getCurrentPosition(
      (position: Position) => {
        logger.log('Current position:', position.coords);
        this.updateReduxCoordinates(
          position.coords.latitude,
          position.coords.longitude,
        );
        onSuccess?.(position);
      },
      (error: PositionError) => {
        logger.error('Position error:', error.message);
        onError?.(error);
      },
      {
        timeout: 15000,
        maximumAge: 10000,
        enableHighAccuracy: true,
      },
    );
  }

  /**
   * Start watching position changes
   */
  startWatchingPosition(
    onSuccess?: (position: Position) => void,
    onError?: (error: PositionError) => void,
  ) {
    if (this.watchId !== null) {
      logger.warn('Already watching position');
      return;
    }

    this.watchId = Geolocation.watchPosition(
      (position: Position) => {
        logger.log('Position updated:', position.coords);
        this.updateReduxCoordinates(
          position.coords.latitude,
          position.coords.longitude,
        );
        onSuccess?.(position);
      },
      (error: PositionError) => {
        logger.error('Watch position error:', error.message);
        onError?.(error);
      },
      {
        interval: 10000, // 10 seconds
        fastestInterval: 5000, // 5 seconds
        timeout: 15000,
        maximumAge: 10000,
        enableHighAccuracy: true,
        distanceFilter: 10, // meters
        useSignificantChanges: false,
      },
    );

    logger.log('Started watching position with ID:', this.watchId);
  }

  /**
   * Stop watching position changes
   */
  stopWatchingPosition() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      logger.log('Stopped watching position with ID:', this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Update coordinates in Redux store
   */
  private updateReduxCoordinates(latitude: number, longitude: number) {
    if (this.dispatch) {
      this.dispatch(
        Actions.common.updateCurrentUserCoordinates(latitude, longitude),
      );
      this.dispatch(Actions.common.updateSelectedLocation('Current Location'));
    } else {
      logger.warn('Dispatch not initialized');
    }
  }

  /**
   * Check if currently watching position
   */
  isWatching(): boolean {
    return this.watchId !== null;
  }
}

export default new LocationService();
