import { IconButton } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addFavoriteGame, removeFavoriteGame, fetchFavoriteGames} from "../../redux/actions";

export default function FavoriteButton({  gameId, isFavorite }) {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.currentUser?.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavoriteGame(currentUserId, gameId));
    } else {
        
      dispatch(addFavoriteGame(currentUserId, gameId));
      
      
      
    }
    dispatch(fetchFavoriteGames(currentUserId));
 
  };

  return (
    <IconButton
      aria-label="Toggle favorite"
      icon={isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
      position="absolute"
      top="10px"
      right="10px"
      bg="white"
      _hover={{ bg: "gray.100" }}
      onClick={(e) => {
        e.stopPropagation();
        handleFavoriteToggle();
      }}
    />
  );
}
