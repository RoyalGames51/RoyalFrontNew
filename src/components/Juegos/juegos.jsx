import { Box, Grid, Text, Image, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import juego1 from "../../assets/IMG_4119.png";
import juego2 from "../../assets/ruleta.png";
import juego3 from "../../assets/bingoproxi.png";
import juego4 from "../../assets/minas.png";
import { useSelector, useDispatch } from "react-redux";


// Lista de juegos disponibles
const GAMES = [
  { id: "40cf64b9-35a2-4953-beee-ca764135337b", src: juego1, path: "/loteria-instantanea", alt: "Lotería" },
  { id: "a438f824-2f97-492d-89ba-73e213930ecb", src: juego2, path: "/ruleta", alt: "Ruleta" },
  { id: "02814291-c075-4b77-8105-10b912f9dd31", src: juego3, path: "/bingo", alt: "Bingo" },
  { id: "501ffe04-71e2-44c9-a06a-f97df1babd0a", src: juego4, path: "/play/minas", alt: "Minas" },
];

export default function GameGrid({ onlyFavorites = false, isPublicProfile = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteGames = useSelector((state) =>
    isPublicProfile ? state.publicFavorites : state.favoriteGames
  );

  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  // Cargar favoritos públicos si es un perfil público
 

  // Actualizar juegos favoritos en base al estado
  useEffect(() => {
    if (favoriteGames) {
      const newFilteredGames = onlyFavorites
        ? GAMES.filter((game) => favoriteGames.includes(game.id))
        : GAMES;
      setFilteredGames(newFilteredGames);
      setIsLoading(false); // Detener el spinner una vez que los datos estén listos
    } else {
      setFilteredGames([]);
    }
  }, [favoriteGames, onlyFavorites]);

  const handleGameClick = (gamePath) => {
    navigate(gamePath);
  };



  return (
    <Box w="90%" m="0 auto" p="20px">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="20px" bgColor="gray.200" borderTopRadius="15px">
        {onlyFavorites ? "Juegos Favoritos" : "Todos los Juegos"}
      </Text>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minH="300px">
          <Spinner size="xl" />
        </Box>
      ) : filteredGames.length > 0 ? (
        <Grid templateColumns="repeat(auto-fit, minmax(230px, 1fr))" gap="30px">
          {filteredGames.map((game) => (
            <Box
              key={game.id}
              position="relative"
              overflow="hidden"
              borderRadius="15px"
              boxShadow="0 4px 10px rgba(0, 0, 0, 0.2)"
              cursor="pointer"
              transition="transform 0.3s, box-shadow 0.3s"
              _hover={{ transform: "scale(1.05)", boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)" }}
            >
              <Image
                src={game.src}
                alt={game.alt}
                objectFit="contain"
                w="100%"
                h="225px"
                onClick={() => handleGameClick(game.path)}
              />
              <Box position="absolute" bottom="0" w="100%" bg="rgba(0, 0, 0, 0.5)" color="white" textAlign="center" py="10px">
                {game.alt}
              </Box>

              {!isPublicProfile && <FavoriteButton gameId={game.id} isFavorite={favoriteGames.includes(game.id)} />}
            </Box>
          ))}
        </Grid>
      ) : (
        <Text textAlign="center" fontSize="lg" color="gray.500">
          No hay juegos favoritos aún.
        </Text>
      )}
    </Box>
  );
}
