import {
    USER_BY_EMAIL, CLEAN_USER_BY_EMAIL, USER_BY_NICK, ADMINISTRAR_USER, PROMO1K,
    FETCH_PUBLIC_FAVORITES, REMOVE_FAVORITE_SUCCESS, ADD_FAVORITE_SUCCESS,
    FETCH_FAVORITES_FAILURE, FETCH_FAVORITES_SUCCESS, FETCH_USER_PROFILE,
    UPDATE_USER_PROFILE, USER_ACTION_ERROR, CREATE_GAME_REQUEST, CREATE_GAME_SUCCESS,
    CREATE_GAME_FAILURE, VIEW_USER_PROFILE, SET_AUTH_TOKEN, CLEAR_AUTH_TOKEN,
    FRIENDS_LIST_SUCCESS, FRIENDS_INCOMING_SUCCESS, FRIENDS_OUTGOING_SUCCESS,
    FRIENDS_RELATIONSHIP_SUCCESS, FRIENDS_ACTION_ERROR,
    MESSAGES_CONVERSATIONS_SUCCESS, MESSAGES_THREAD_SUCCESS, MESSAGES_ACTION_ERROR,
    ADMIN_OVERVIEW_SUCCESS, ADMIN_ACTION_ERROR,
    SUPPORT_TICKETS_SUCCESS, SUPPORT_ALL_TICKETS_SUCCESS, SUPPORT_TICKET_DETAIL_SUCCESS, SUPPORT_ACTION_ERROR,
    BLOCKS_STATUS_SUCCESS, BLOCKS_LIST_SUCCESS, BLOCKS_ACTION_ERROR,
    SITE_CONTENT_SUCCESS, SITE_CONTENT_ACTION_ERROR,
    NEWS_LIST_SUCCESS, NEWS_ACTION_ERROR,
} from "../actions/action.types";

const initialState = {
    favoriteGames: [],
    publicFavorites: [],
    games: [],
    loading: false,
    error: null,
    currentUser: null,
    viewedUserProfile: [],
    administradorUser: {},
    counterUser: {},
    authToken: localStorage.getItem('token') || null,
    friends: {
        list: [],
        incoming: [],
        outgoing: [],
        relationship: {},
        error: null,
    },
    messages: {
        conversations: [],
        threads: {},
        error: null,
    },
    adminOverview: null,
    support: {
        myTickets: [],
        allTickets: [],
        ticketDetail: null,
        error: null,
    },
    blocks: {
        status: {},
        list: [],
        error: null,
    },
    siteContent: {},
    news: {
        list: [],
        error: null,
    },
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

        // Manejo de amigos
        case FRIENDS_LIST_SUCCESS:
            return { ...state, friends: { ...state.friends, list: action.payload } };

        case FRIENDS_INCOMING_SUCCESS:
            return { ...state, friends: { ...state.friends, incoming: action.payload } };

        case FRIENDS_OUTGOING_SUCCESS:
            return { ...state, friends: { ...state.friends, outgoing: action.payload } };

        case FRIENDS_RELATIONSHIP_SUCCESS:
            return {
                ...state,
                friends: {
                    ...state.friends,
                    relationship: {
                        ...state.friends.relationship,
                        [action.payload.userId]: action.payload.data,
                    },
                },
            };

        case FRIENDS_ACTION_ERROR:
            return { ...state, friends: { ...state.friends, error: action.payload } };

        // Manejo de mensajes
        case MESSAGES_CONVERSATIONS_SUCCESS:
            return { ...state, messages: { ...state.messages, conversations: action.payload } };

        case MESSAGES_THREAD_SUCCESS:
            return {
                ...state,
                messages: {
                    ...state.messages,
                    threads: {
                        ...state.messages.threads,
                        [action.payload.userId]: action.payload.messages,
                    },
                },
            };

        case MESSAGES_ACTION_ERROR:
            return { ...state, messages: { ...state.messages, error: action.payload } };

        // Manejo de administración
        case ADMIN_OVERVIEW_SUCCESS:
            return { ...state, adminOverview: action.payload };

        case ADMIN_ACTION_ERROR:
            return { ...state, error: action.payload };

        // Manejo de tickets de soporte
        case SUPPORT_TICKETS_SUCCESS:
            return { ...state, support: { ...state.support, myTickets: action.payload } };

        case SUPPORT_ALL_TICKETS_SUCCESS:
            return { ...state, support: { ...state.support, allTickets: action.payload } };

        case SUPPORT_TICKET_DETAIL_SUCCESS:
            return { ...state, support: { ...state.support, ticketDetail: action.payload } };

        case SUPPORT_ACTION_ERROR:
            return { ...state, support: { ...state.support, error: action.payload } };

        // Manejo de bloqueos
        case BLOCKS_STATUS_SUCCESS:
            return {
                ...state,
                blocks: {
                    ...state.blocks,
                    status: {
                        ...state.blocks.status,
                        [action.payload.userId]: action.payload.data,
                    },
                },
            };

        case BLOCKS_LIST_SUCCESS:
            return { ...state, blocks: { ...state.blocks, list: action.payload } };

        case BLOCKS_ACTION_ERROR:
            return { ...state, blocks: { ...state.blocks, error: action.payload } };

        // Manejo de contenido editable del sitio
        case SITE_CONTENT_SUCCESS:
            return { ...state, siteContent: { ...state.siteContent, ...action.payload } };

        case SITE_CONTENT_ACTION_ERROR:
            return state;

        // Manejo de noticias
        case NEWS_LIST_SUCCESS:
            return { ...state, news: { ...state.news, list: action.payload, error: null } };

        case NEWS_ACTION_ERROR:
            return { ...state, news: { ...state.news, error: action.payload } };

        default:
            return state;
    }
};

export default reducer;
