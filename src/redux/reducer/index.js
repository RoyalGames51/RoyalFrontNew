import {
    USER_BY_EMAIL, CLEAN_USER_BY_EMAIL, USER_BY_NICK, ADMINISTRAR_USER, PROMO1K, FETCH_PUBLIC_FAVORITES, REMOVE_FAVORITE_SUCCESS, ADD_FAVORITE_SUCCESS, FETCH_FAVORITES_FAILURE, FETCH_FAVORITES_SUCCESS, FETCH_USER_PROFILE,
    UPDATE_USER_PROFILE, USER_ACTION_ERROR, CREATE_GAME_REQUEST, CREATE_GAME_SUCCESS, CREATE_GAME_FAILURE, VIEW_USER_PROFILE, SET_AUTH_TOKEN, CLEAR_AUTH_TOKEN
} from "../actions/action.types";

const initialState = {
    favoriteGames: [],
    publicFavorites:[],
    games: [],
    loading: false,
    error: null,
    currentUser: null,
    viewedUserProfile: [], // Nuevo estado para perfiles públicos
    administradorUser: {},
    counterUser: {},
    authToken: localStorage.getItem('token') || null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        // Manejo de usuario actual
        case CLEAN_USER_BY_EMAIL:
            return {
                ...state,
                currentUser: null,
            };

        case USER_BY_EMAIL:
        case USER_BY_NICK:
        case FETCH_USER_PROFILE:
            return {
                ...state,
                currentUser: action.payload,
                error: null,
            };

        case UPDATE_USER_PROFILE:
            return {
                ...state,
                currentUser: action.payload,
                error: null,
            };

        case VIEW_USER_PROFILE:
            return {
                ...state,
                viewedUserProfile: action.payload,
                
            };


        case USER_ACTION_ERROR:
            return {
                ...state,
                error: action.payload,
            };

        // Manejo de juegos
        case CREATE_GAME_REQUEST:
            return { ...state, loading: true };

        case CREATE_GAME_SUCCESS:
            return { ...state, loading: false, games: [...state.games, action.payload] };

        case CREATE_GAME_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Administración de usuarios
        case ADMINISTRAR_USER:
            return {
                ...state,
                administradorUser: action.payload,
            };

        case PROMO1K:
            return {
                ...state,
                counterUser: action.payload,
            };

        // Manejo de favoritos
        case FETCH_FAVORITES_SUCCESS:
            return {
                ...state,
                favoriteGames: action.payload,
            };

        case FETCH_FAVORITES_FAILURE:
            return { ...state, error: action.payload, loading: false };
        
            case FETCH_PUBLIC_FAVORITES:
                return {
                    ...state,
                    publicFavorites: action.payload,
                };    

        case ADD_FAVORITE_SUCCESS:
            return {
                ...state,
                favoriteGames: action.payload,
            };

        case REMOVE_FAVORITE_SUCCESS:
            return {
                ...state,
                favoriteGames: state.favoriteGames.filter((game) => game.id !== action.payload),
            };

        // Manejo de token de autenticación
        case SET_AUTH_TOKEN:
            return {
                ...state,
                authToken: action.payload,
            };

        case CLEAR_AUTH_TOKEN:
            return {
                ...state,
                authToken: null,
            };

        default:
            return state;
    }
};

export default reducer;
