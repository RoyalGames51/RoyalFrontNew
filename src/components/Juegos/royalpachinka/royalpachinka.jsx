import React from "react";
import { useSelector } from "react-redux";
import GameFrame from "../GameFrame/gameFrame";

const RoyalPachinka = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const jugadorID = currentUser?.id || "default-id";
  const gameURL = `https://royalpachinka.s3.us-east-2.amazonaws.com/pachinka/index.html?jugadorID=${jugadorID}`;

  return <GameFrame src={jugadorID ? gameURL : null} title="Royal Pachinka" nativeWidth={1920} nativeHeight={1080} />;
};

export default RoyalPachinka;
