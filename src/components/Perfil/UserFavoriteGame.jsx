import React from "react";
import { Box, Image, Grid, IconButton } from "@chakra-ui/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const UserFavoriteGame = ({ games, onToggleFavorite }) => {
  const navigate = useNavigate();

  const handleGameClick = (path) => {
    navigate(path); // Redirige al juego seleccionado
  };

  return (
    <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
      {games?.map((game, index) => (
        <Box
          key={index}
          bg="gray.200"
          p="10px"
          borderRadius="10px"
          cursor="pointer"
          _hover={{ bg: "gray.300" }}
          position="relative"
        >
          <Image
            src={game.image}
            alt={game.name}
            w="100%"
            h="150px"
            borderRadius="5px"
            objectFit="cover"
            onClick={() => handleGameClick(game.path)}
          />
          {/* Ícono de corazón para marcar/desmarcar favoritos */}
          <IconButton
            icon={game.isFavorite ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
            position="absolute"
            top="5px"
            right="5px"
            size="sm"
            bg="transparent"
            _hover={{ bg: "transparent" }}
            aria-label={game.isFavorite ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => {
              e.stopPropagation(); // Evitar que se active el click del juego
              onToggleFavorite(game.id); // Notificar al padre para actualizar el estado
            }}
          />
        </Box>
      ))}
    </Grid>
  );
};

export default UserFavoriteGame;
