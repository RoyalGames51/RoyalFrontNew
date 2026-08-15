import React from "react";
import { useSelector } from "react-redux";
import GameFrame from "../GameFrame/gameFrame";

const Diamantes = () => {
  // Obtener el jugadorID del estado global
  const currentUser = useSelector((state) => state.currentUser);
  const jugadorID = currentUser?.id || "default-id"; // Valor por defecto si no hay usuario

  // URL del juego con el jugadorID
  const gameURL = `https://minasroyal.s3.us-east-2.amazonaws.com/minas22/index.html?jugadorID=${jugadorID}`;

  return <GameFrame src={jugadorID ? gameURL : null} title="Juego Minas" />;
};

export default Diamantes;
