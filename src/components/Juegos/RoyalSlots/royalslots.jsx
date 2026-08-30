import React from "react";
import { useSelector } from "react-redux";
import GameFrame from "../GameFrame/gameFrame";

const RoyalSlots = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const jugadorID = currentUser?.id || "default-id";
  const gameURL = `https://royalslots.s3.us-east-2.amazonaws.com/RoyalSlots/index.html?jugadorID=${jugadorID}`;

  return <GameFrame src={jugadorID ? gameURL : null} title="Royal Slots" nativeWidth={1920} nativeHeight={1080} />;
};

export default RoyalSlots;
