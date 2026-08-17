import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import GameFrame from "../GameFrame/gameFrame";
import API_URL from "../../../api/rutaApi";
import { authService } from "../../../services/authService";

const Diamantes = () => {
  // Obtener el jugadorID del estado global
  const currentUser = useSelector((state) => state.currentUser);
  const jugadorID = currentUser?.id || "default-id"; // Valor por defecto si no hay usuario

  // El juego ya no confía en jugadorID solo: pide un token de sesión de corta duración
  // (backend lo firma con el JWT del usuario logueado) y se lo pasa a Unity por la URL.
  // Sin este token, /games/mines/start|reveal|cashout rechazan la llamada - ver
  // games/mines/session-token en RoyalGamesBackend.
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setSessionToken(null);

    if (!currentUser?.id) return undefined;

    const token = authService.getToken();
    if (!token) return undefined;

    axios
      .post(
        `${API_URL}/games/mines/session-token`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => {
        if (!cancelled) setSessionToken(response.data.token);
      })
      .catch((error) => {
        console.error("No se pudo obtener el token de sesión de Minas:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id]);

  // URL del juego con el jugadorID y el token de sesión
  const gameURL = `https://minasroyal.s3.us-east-2.amazonaws.com/minas22/index.html?jugadorID=${jugadorID}&sessionToken=${sessionToken}`;

  return (
    <GameFrame
      src={jugadorID && sessionToken ? gameURL : null}
      title="Juego Minas"
      nativeWidth={1920}
      nativeHeight={1080}
    />
  );
};

export default Diamantes;
