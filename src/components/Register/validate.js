import axios from "axios";
import API_URL from "../../api/rutaApi";

export const validateNickFormat = (nick) => {
    if (!nick) {
        return "El nombre de usuario es obligatorio.";
    }
    if (nick.length < 3) {
        return "El nombre de usuario debe tener al menos 3 caracteres.";
    }
    if (nick.length > 20) {
        return "El nombre de usuario no puede tener más de 20 caracteres.";
    }
    return null; // Indica que no hay error
};

export const validateEmailFormat = (email) => {
    // Expresión regular para validar un correo electrónico básico
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email) {
        return "El correo electrónico es obligatorio.";
    }
    if (!regex.test(email)) {
        return "El correo electrónico no es válido.";
    }
    return null;
};

// El texto antes del @ no puede ser exactamente igual al nombre de usuario
// (ej. nick "badbunny" no puede usar "badbunny@..." pero sí "badbunny33@...").
export const validateNickEmailMatch = (nick, email) => {
    if (!nick || !email) return null;
    const localPart = email.split("@")[0];
    if (localPart.toLowerCase() === nick.toLowerCase()) {
        return "El correo no puede ser igual a tu nombre de usuario.";
    }
    return null;
};

export const checkNickAvailability = async (nick) => {
    try {
        const { data } = await axios.get(`${API_URL}/check-availability`, { params: { nick } });
        return !!data?.nickTaken;
    } catch (error) {
        // Un fallo de red/servidor no debe bloquear el registro: el backend igual
        // rechaza el alta si el nick termina estando duplicado.
        return false;
    }
};

export const checkEmailAvailability = async (email) => {
    try {
        const { data } = await axios.get(`${API_URL}/check-availability`, { params: { email } });
        return !!data?.emailTaken;
    } catch (error) {
        return false;
    }
};

export const validateNick = async (nick) => {
    const formatError = validateNickFormat(nick);
    if (formatError) return formatError;
    const taken = await checkNickAvailability(nick);
    if (taken) return "Ese nombre de usuario ya está en uso.";
    return null;
};

export const validateEmail = async (email, nick) => {
    const formatError = validateEmailFormat(email);
    if (formatError) return formatError;
    const matchError = validateNickEmailMatch(nick, email);
    if (matchError) return matchError;
    const taken = await checkEmailAvailability(email);
    if (taken) return "Este correo electrónico ya está registrado.";
    return null;
};

export const validatePassword = (password) => {
    if (!password) {
        return "La contraseña es obligatoria.";
    }
    if (password.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres.";
    }
    if (password.length > 15) {
        return "La contraseña debe tener menos de 15 caracteres.";
    }
    return null;
};
