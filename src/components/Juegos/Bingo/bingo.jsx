import React from "react";
import { useSelector } from "react-redux";
import GameFrame from "../GameFrame/gameFrame";

const Bingo = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const userId = currentUser?.id || "default-id";
  const gameURL = `https://bingoroyal.s3.us-east-2.amazonaws.com/Bingo/index.html?userId=${userId}`;

  return <GameFrame src={userId ? gameURL : null} title="Bingo" />;
};

export default Bingo;
