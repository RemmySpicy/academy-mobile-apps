import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, TOKEN_KEY } from '../helper/baseurl';

const setAuthToken = (token: string | null) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};

export const refreshAuthToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem(`${TOKEN_KEY}_refresh`);
        
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await axios.post(baseUrl.token, {
            refresh: refreshToken
        });

        const { access } = response.data;
        
        await AsyncStorage.setItem(`${TOKEN_KEY}_access`, access);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        
        return access;
    } catch (error) {
        await AsyncStorage.multiRemove([`${TOKEN_KEY}_access`, `${TOKEN_KEY}_refresh`]);
        throw error;
    }
};

export default setAuthToken;