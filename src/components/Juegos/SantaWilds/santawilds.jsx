import React from "react";
import { useSelector } from "react-redux";
import GameFrame from "../GameFrame/gameFrame";

const SantaWilds = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const jugadorID = currentUser?.id || "default-id";
  const gameURL = `https://santawilds.s3.us-east-2.amazonaws.com/SantaWilds/index.html?jugadorID=${jugadorID}`;

  return <GameFrame src={jugadorID ? gameURL : null} title="Santa Wilds" nativeWidth={1920} nativeHeight={1080} />;
};

export default SantaWilds;
