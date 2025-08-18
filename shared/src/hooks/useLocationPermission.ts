/**
 * useLocationPermission Hook
 * 
 * A React hook for managing location permissions and current location.
 * Handles both foreground and background permissions with error handling.
 */

import { useState, useEffect, useCallback } from 'react';

// Mock expo-location types for flexibility
interface LocationPermissionStatus {
  status: 'granted' | 'denied' | 'undetermined';
  canAskAgain?: boolean;
  expires?: 'never' | number;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

interface LocationObject {
  coords: LocationCoords;
  timestamp: number;
}

export interface UseLocationPermissionOptions {
  /** Request background permission */
  requestBackground?: boolean;
  /** Get current location immediately after permission granted */
  getCurrentLocation?: boolean;
  /** Watch position for continuous updates */
  watchPosition?: boolean;
  /** Location options */
  locationOptions?: {
    accuracy?: 'low' | 'balanced' | 'high' | 'highest';
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    distanceInterval?: number;
  };
}

export interface LocationPermissionState {
  /** Whether location permission is granted */
  isGranted: boolean;
  /** Whether background permission is granted */
  backgroundGranted: boolean;
  /** Whether permissions have been checked */
  isChecked: boolean;
  /** Whether permission request is in progress */
  isLoading: boolean;
  /** Current location if available */
  location: LocationObject | null;
  /** Any error that occurred */
  error: string | null;
  /** Whether user can be asked for permission again */
  canAskAgain: boolean;
}

export function useLocationPermission(options: UseLocationPermissionOptions = {}) {
  const {
    requestBackground = false,
    getCurrentLocation = false,
    watchPosition = false,
    locationOptions = {},
  } = options;

  const [state, setState] = useState<LocationPermissionState>({
    isGranted: false,
    backgroundGranted: false,
    isChecked: false,
    isLoading: false,
    location: null,
    error: null,
    canAskAgain: true,
  });

  const [watchId, setWatchId] = useState<number | null>(null);

  // Mock function to check if location services are available
  const checkLocationAvailability = useCallback(async (): Promise<boolean> => {
    try {
      // In a real implementation, this would check if location services are enabled
      // For now, we'll assume they are available
      return true;
    } catch {
      return false;
    }
  }, []);

  // Mock function to request permissions (replace with actual expo-location implementation)
  const requestLocationPermission = useCallback(async (): Promise<LocationPermissionStatus> => {
    try {
      // This would be replaced with actual expo-location permission request
      // For now, we'll simulate permission request
      return {
        status: 'granted' as const,
        canAskAgain: true,
        expires: 'never' as const,
      };
    } catch {
      return {
        status: 'denied' as const,
        canAskAgain: false,
      };
    }
  }, []);

  // Mock function to get current position (replace with actual implementation)
  const getCurrentPosition = useCallback(async (): Promise<LocationObject> => {
    try {
      // This would be replaced with actual location fetching
      // For now, we'll simulate getting location
      return {
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
          altitude: null,
          accuracy: 10,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new Error('Failed to get current location');
    }
  }, []);

  // Request permissions
  const requestPermissions = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check if location services are available
      const isAvailable = await checkLocationAvailability();
      if (!isAvailable) {
        throw new Error('Location services are not available');
      }

      // Request foreground permission
      const foregroundPermission = await requestLocationPermission();
      if (foregroundPermission.status !== 'granted') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isChecked: true,
          error: 'Foreground location permission not granted',
          canAskAgain: foregroundPermission.canAskAgain ?? false,
        }));
        return;
      }

      let backgroundGranted = false;
      if (requestBackground) {
        // Request background permission
        const backgroundPermission = await requestLocationPermission();
        backgroundGranted = backgroundPermission.status === 'granted';
        
        if (!backgroundGranted) {
          console.warn('Background location permission not granted');
        }
      }

      // Get current location if requested
      let currentLocation: LocationObject | null = null;
      if (getCurrentLocation) {
        try {
          currentLocation = await getCurrentPosition();
        } catch (error) {
          console.warn('Failed to get current location:', error);
        }
      }

      setState(prev => ({
        ...prev,
        isGranted: true,
        backgroundGranted,
        isChecked: true,
        isLoading: false,
        location: currentLocation,
        canAskAgain: true,
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isChecked: true,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  }, [requestBackground, getCurrentLocation, checkLocationAvailability, requestLocationPermission, getCurrentPosition]);

  // Start watching position
  const startWatching = useCallback(() => {
    if (!state.isGranted || watchId !== null) return;

    try {
      // This would be replaced with actual position watching
      // For now, we'll simulate with periodic updates
      const id = setInterval(() => {
        getCurrentPosition()
          .then(location => {
            setState(prev => ({ ...prev, location }));
          })
          .catch(error => {
            console.warn('Failed to get location update:', error);
          });
      }, 10000); // Update every 10 seconds

      setWatchId(id as any);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to start location watching',
      }));
    }
  }, [state.isGranted, watchId, getCurrentPosition]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      clearInterval(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // Refresh current location
  const refreshLocation = useCallback(async () => {
    if (!state.isGranted) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const location = await getCurrentPosition();
      setState(prev => ({
        ...prev,
        location,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to refresh location',
      }));
    }
  }, [state.isGranted, getCurrentPosition]);

  // Initial permission request
  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  // Start/stop watching based on options
  useEffect(() => {
    if (watchPosition && state.isGranted) {
      startWatching();
    } else {
      stopWatching();
    }

    return stopWatching;
  }, [watchPosition, state.isGranted, startWatching, stopWatching]);

  return {
    ...state,
    requestPermissions,
    refreshLocation,
    startWatching,
    stopWatching,
    isWatching: watchId !== null,
  };
}

export default useLocationPermission;