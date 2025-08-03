import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useAppDispatch } from "../redux/store";
// import { setRiderLocation } from "../redux/profile";

export const useLocationPermission = () => {
  const dispatch = useAppDispatch();
  const [locationPermissionChecked, setLocationPermissionChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== 'granted') {
          setError('Foreground location permission not granted');
          return;
        }

        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          setError('Background location permission not granted');
          return;
        }

        // const location = await Location.getCurrentPositionAsync();
        // let riderLoc = {
        //   latitude: location.coords.latitude,
        //   longitude: location.coords.longitude,
        // };
        // dispatch(setRiderLocation(riderLoc));

        setLocationPermissionChecked(true);
      } catch (err) {
        setError('An error occurred while requesting location permissions or fetching location');
        console.error(err);
      }
    };

    requestPermissions();
  }, [dispatch]);

  return { locationPermissionChecked, error };
};