import API_URL from "../../api/rutaApi";
import {
    ADMINISTRAR_USER,
    CLEAN_USER_BY_EMAIL,
    PROMO1K,
    USER_BY_EMAIL,
    USER_BY_NICK,
    FETCH_USER_PROFILE,
    UPDATE_USER_PROFILE,
    USER_ACTION_ERROR,
    VIEW_USER_PROFILE,
    REMOVE_FAVORITE_SUCCESS,
    ADD_FAVORITE_SUCCESS,
    FETCH_FAVORITES_FAILURE,
    FETCH_FAVORITES_SUCCESS,
    FETCH_PUBLIC_FAVORITES,
    SET_AUTH_TOKEN,
    CLEAR_AUTH_TOKEN,
    CREATE_GAME_REQUEST,
    CREATE_GAME_SUCCESS,
    CREATE_GAME_FAILURE,
} from "./action.types";
import axios from 'axios';

export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

const token = localStorage.getItem('token');
if (token) {
    setAuthToken(token);
}

export const cleanCurrentUser = () => ({
    type: CLEAN_USER_BY_EMAIL,
});

export const logout = () => (dispatch) => {
    setAuthToken(null);
    dispatch({ type: CLEAR_AUTH_TOKEN });
    dispatch(cleanCurrentUser());
};

export const signupAndLogin = (userData) => {
    return async (dispatch) => {
        try {
            const signupResponse = await axios.post(`${API_URL}/signup`, userData);
            const loginResponse = await axios.post(`${API_URL}/auth/login`, {
                email: userData.email,
                password: userData.password,
            });

            const { access_token, user } = loginResponse.data;
            setAuthToken(access_token);

            dispatch({ type: USER_BY_EMAIL, payload: user });
            dispatch({ type: SET_AUTH_TOKEN, payload: access_token });

            return signupResponse.data;
        } catch (error) {
            dispatch({ type: USER_ACTION_ERROR, payload: error.message });
            throw error;
        }
    };
};

export const getUserByEmail = (email) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`${API_URL}/user-email?email=${email}`);
            if (data.banned) return data;
            dispatch({ type: USER_BY_EMAIL, payload: data });
            return data;
        } catch (error) {
            throw new Error(`Error de sesion: ${error.message}`);
        }
    };
};

export const getUserByNick = (nick) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`${API_URL}/user-nick?nick=${nick}`);
            if (data.banned) throw new Error("El usuario se encuentra bloqueado.");
            dispatch({ type: USER_BY_NICK, payload: data });
            return data;
        } catch (error) {
            throw new Error(`Error al buscar usuario: ${error.message}`);
        }
    };
};

export const viewedUserProfile = (nick) => async (dispatch) => {
    try {
        const response = await axios.get(`${API_URL}/user-nick?nick=${nick}`);
        dispatch({ type: VIEW_USER_PROFILE, payload: response.data });
    } catch (error) {
        throw new Error(`Usuario no encontrado: ${error.message}`);
    }
};

export const fetchUserProfile = () => async (dispatch) => {
    try {
        const response = await axios.get(`${API_URL}/getUsers`);
        const user = response.data[0];
        dispatch({ type: FETCH_USER_PROFILE, payload: user });
    } catch (error) {
        dispatch({ type: USER_ACTION_ERROR, payload: error.message });
    }
};

export const updateUserProfile = (userId, updatedData) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No se pudo obtener el token de autenticación");

        const response = await axios.patch(`${API_URL}/actualizar-usuario/${userId}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        dispatch({ type: UPDATE_USER_PROFILE, payload: response.data });
    } catch (error) {
        dispatch({ type: USER_ACTION_ERROR, payload: error.message });
        throw error;
    }
};

export const administrarUser = (nick) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`${API_URL}/user-nick?nick=${nick}`);
            dispatch({ type: ADMINISTRAR_USER, payload: data });
        } catch (error) {
            throw new Error(`Error de sesion: ${error.message}`);
        }
    };
};

export const fetchFavoriteGames = (userId) => async (dispatch) => {
    try {
        const response = await axios.get(`${API_URL}/favorites/${userId}`);
        dispatch({ type: FETCH_FAVORITES_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_FAVORITES_FAILURE, payload: error.message });
    }
};

export const fetchPublicFavorites = (userId) => async (dispatch) => {
    try {
        const response = await axios.get(`${API_URL}/favorites/${userId}`);
        dispatch({ type: FETCH_PUBLIC_FAVORITES, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_FAVORITES_FAILURE, payload: error.message });
    }
};

export const addFavoriteGame = (userId, gameId) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_URL}/favorites`, { userId, gameId });
        dispatch({ type: ADD_FAVORITE_SUCCESS, payload: response.data });
        dispatch(fetchFavoriteGames(userId));
    } catch (error) {
        dispatch({ type: FETCH_FAVORITES_FAILURE, payload: error.message });
    }
};

export const removeFavoriteGame = (userId, gameId) => async (dispatch) => {
    try {
        await axios.delete(`${API_URL}/favorites/${userId}/${gameId}`);
        dispatch({ type: REMOVE_FAVORITE_SUCCESS, payload: gameId });
        dispatch(fetchFavoriteGames(userId));
    } catch (error) {
        dispatch({ type: FETCH_FAVORITES_FAILURE, payload: error.message });
    }
};

export const createGame = (gameData) => async (dispatch) => {
    dispatch({ type: CREATE_GAME_REQUEST });
    try {
        const response = await axios.post(`${API_URL}/game/create`, gameData);
        dispatch({ type: CREATE_GAME_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: CREATE_GAME_FAILURE, payload: error.message });
    }
};

export const promo1millon = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`${API_URL}/getUsers`);
            const userCount = Array.isArray(data) ? data.length : data.count;
            dispatch({ type: PROMO1K, payload: userCount });
        } catch (error) {
            throw new Error(`Error al añadir las fichas: ${error.message}`);
        }
    };
};
