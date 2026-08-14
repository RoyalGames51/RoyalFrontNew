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
    FRIENDS_LIST_SUCCESS,
    FRIENDS_INCOMING_SUCCESS,
    FRIENDS_OUTGOING_SUCCESS,
    FRIENDS_RELATIONSHIP_SUCCESS,
    FRIENDS_ACTION_ERROR,
    MESSAGES_CONVERSATIONS_SUCCESS,
    MESSAGES_THREAD_SUCCESS,
    MESSAGES_ACTION_ERROR,
    ADMIN_OVERVIEW_SUCCESS,
    ADMIN_ACTION_ERROR,
    SUPPORT_TICKETS_SUCCESS,
    SUPPORT_ALL_TICKETS_SUCCESS,
    SUPPORT_TICKET_DETAIL_SUCCESS,
    SUPPORT_ACTION_ERROR,
    BLOCKS_STATUS_SUCCESS,
    BLOCKS_LIST_SUCCESS,
    BLOCKS_ACTION_ERROR,
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
            const { data } = await axios.get(`${API_URL}/users/count`);
            dispatch({ type: PROMO1K, payload: data.count });
        } catch (error) {
            throw new Error(`Error al añadir las fichas: ${error.message}`);
        }
    };
};

// ===== Friends =====

export const fetchFriends = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/friends`);
        dispatch({ type: FRIENDS_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: FRIENDS_ACTION_ERROR, payload: error.message });
    }
};

export const fetchIncomingRequests = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/friends/requests/incoming`);
        dispatch({ type: FRIENDS_INCOMING_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: FRIENDS_ACTION_ERROR, payload: error.message });
    }
};

export const fetchOutgoingRequests = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/friends/requests/outgoing`);
        dispatch({ type: FRIENDS_OUTGOING_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: FRIENDS_ACTION_ERROR, payload: error.message });
    }
};

export const fetchRelationship = (userId) => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/friends/relationship/${userId}`);
        dispatch({ type: FRIENDS_RELATIONSHIP_SUCCESS, payload: { userId, data } });
        return data;
    } catch (error) {
        dispatch({ type: FRIENDS_ACTION_ERROR, payload: error.message });
    }
};

export const sendFriendRequest = (nick, targetUserId) => async (dispatch) => {
    try {
        await axios.post(`${API_URL}/friends/request`, { nick });
        dispatch(fetchOutgoingRequests());
        if (targetUserId) dispatch(fetchRelationship(targetUserId));
    } catch (error) {
        dispatch({ type: FRIENDS_ACTION_ERROR, payload: error.response?.data?.message || error.message });
        throw error;
    }
};

export const acceptFriendRequest = (friendshipId, otherUserId) => async (dispatch) => {
    try {
        await axios.patch(`${API_URL}/friends/${friendshipId}/accept`);
        dispatch(fetchFriends());
        dispatch(fetchIncomingRequests());
        if (otherUserId) dispatch(fetchRelationship(otherUserId));
    } catch (error) {
        dispatch({ type: FRIENDS_ACTION_ERROR, payload: error.response?.data?.message || error.message });
        throw error;
    }
};

export const declineFriendRequest = (friendshipId, otherUserId) => async (dispatch) => {
    try {
        await axios.patch(`${API_URL}/friends/${friendshipId}/decline`);
        dispatch(fetchIncomingRequests());
        if (otherUserId) dispatch(fetchRelationship(otherUserId));
    } catch (error) {
        dispatch({ type: FRIENDS_ACTION_ERROR, payload: error.response?.data?.message || error.message });
        throw error;
    }
};

export const cancelFriendRequest = (friendshipId, otherUserId) => async (dispatch) => {
    try {
        await axios.delete(`${API_URL}/friends/${friendshipId}/cancel`);
        dispatch(fetchOutgoingRequests());
        if (otherUserId) dispatch(fetchRelationship(otherUserId));
    } catch (error) {
        dispatch({ type: FRIENDS_ACTION_ERROR, payload: error.response?.data?.message || error.message });
        throw error;
    }
};

export const removeFriend = (friendshipId, otherUserId) => async (dispatch) => {
    try {
        await axios.delete(`${API_URL}/friends/${friendshipId}`);
        dispatch(fetchFriends());
        if (otherUserId) dispatch(fetchRelationship(otherUserId));
    } catch (error) {
        dispatch({ type: FRIENDS_ACTION_ERROR, payload: error.response?.data?.message || error.message });
        throw error;
    }
};

// ===== Messages =====

export const fetchConversations = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/messages/conversations`);
        dispatch({ type: MESSAGES_CONVERSATIONS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: MESSAGES_ACTION_ERROR, payload: error.message });
    }
};

export const fetchThread = (userId) => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/messages/thread/${userId}`);
        dispatch({ type: MESSAGES_THREAD_SUCCESS, payload: { userId, messages: data } });
    } catch (error) {
        dispatch({ type: MESSAGES_ACTION_ERROR, payload: error.message });
    }
};

export const sendMessage = (recipientNick, content, recipientId) => async (dispatch) => {
    try {
        await axios.post(`${API_URL}/messages`, { recipientNick, content });
        dispatch(fetchConversations());
        if (recipientId) dispatch(fetchThread(recipientId));
    } catch (error) {
        dispatch({ type: MESSAGES_ACTION_ERROR, payload: error.response?.data?.message || error.message });
        throw error;
    }
};

export const markThreadRead = (userId) => async (dispatch) => {
    try {
        await axios.patch(`${API_URL}/messages/thread/${userId}/read`);
        dispatch(fetchConversations());
    } catch (error) {
        dispatch({ type: MESSAGES_ACTION_ERROR, payload: error.message });
    }
};

// ===== Blocks =====

export const fetchBlockStatus = (userId) => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/blocks/status/${userId}`);
        dispatch({ type: BLOCKS_STATUS_SUCCESS, payload: { userId, data } });
        return data;
    } catch (error) {
        dispatch({ type: BLOCKS_ACTION_ERROR, payload: error.message });
    }
};

export const fetchBlockedUsers = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/blocks`);
        dispatch({ type: BLOCKS_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: BLOCKS_ACTION_ERROR, payload: error.message });
    }
};

export const blockUser = (userId) => async (dispatch) => {
    try {
        await axios.post(`${API_URL}/blocks/${userId}`);
        dispatch(fetchBlockStatus(userId));
    } catch (error) {
        dispatch({ type: BLOCKS_ACTION_ERROR, payload: error.response?.data?.message || error.message });
        throw error;
    }
};

export const unblockUser = (userId) => async (dispatch) => {
    try {
        await axios.delete(`${API_URL}/blocks/${userId}`);
        dispatch(fetchBlockStatus(userId));
    } catch (error) {
        dispatch({ type: BLOCKS_ACTION_ERROR, payload: error.response?.data?.message || error.message });
        throw error;
    }
};

// ===== Chips (gift) =====

export const giftChips = (toUserId, amount) => async (dispatch, getState) => {
    try {
        await axios.post(`${API_URL}/chips/gift`, { toUserId, amount });
        const nick = getState().currentUser?.nick;
        if (nick) dispatch(getUserByNick(nick));
    } catch (error) {
        throw error;
    }
};

// ===== Admin =====

export const fetchAdminOverview = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/admin/overview`);
        dispatch({ type: ADMIN_OVERVIEW_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: ADMIN_ACTION_ERROR, payload: error.message });
    }
};

export const addUserChips = (userId, amount) => async () => {
    await axios.put(`${API_URL}/add/chips`, { userId, amount });
};

export const removeUserChips = (userId, amount) => async () => {
    await axios.put(`${API_URL}/remove/chips`, { userId, amount });
};

export const setUserRole = (userId, role) => async () => {
    await axios.put(`${API_URL}/admin`, { userId, role });
};

export const setUserBanStatus = (userId, status) => async () => {
    await axios.put(`${API_URL}/user-ban`, { userId, status });
};

export const setUserInactiveStatus = (userId, status) => async () => {
    await axios.put(`${API_URL}/inactivar-user`, { userId, status });
};

export const deleteUserAccount = (userId) => async () => {
    await axios.delete(`${API_URL}/user-delete/${userId}`);
};

// ===== Support Tickets =====

export const fetchMyTickets = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/support/tickets`);
        dispatch({ type: SUPPORT_TICKETS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: SUPPORT_ACTION_ERROR, payload: error.message });
    }
};

export const fetchAllTickets = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/support/tickets/all`);
        dispatch({ type: SUPPORT_ALL_TICKETS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: SUPPORT_ACTION_ERROR, payload: error.message });
    }
};

export const fetchTicketDetail = (ticketId) => async (dispatch) => {
    try {
        const { data } = await axios.get(`${API_URL}/support/tickets/${ticketId}`);
        dispatch({ type: SUPPORT_TICKET_DETAIL_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: SUPPORT_ACTION_ERROR, payload: error.message });
    }
};

export const createTicket = (subject, message) => async (dispatch) => {
    const { data } = await axios.post(`${API_URL}/support/tickets`, { subject, message });
    dispatch({ type: SUPPORT_TICKET_DETAIL_SUCCESS, payload: data });
    dispatch(fetchMyTickets());
    return data;
};

export const addTicketMessage = (ticketId, content, isAdmin) => async (dispatch) => {
    const { data } = await axios.post(`${API_URL}/support/tickets/${ticketId}/messages`, { content });
    dispatch({ type: SUPPORT_TICKET_DETAIL_SUCCESS, payload: data });
    dispatch(isAdmin ? fetchAllTickets() : fetchMyTickets());
};

export const updateTicketStatus = (ticketId, status) => async (dispatch) => {
    await axios.patch(`${API_URL}/support/tickets/${ticketId}/status`, { status });
    dispatch(fetchTicketDetail(ticketId));
    dispatch(fetchAllTickets());
};
