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
  // Nuevo juego: Royal Pachinka
  { id: "d9c2b8f0-7e6a-4c9a-9a2b-1f3e5a2b6c7d", src: juego1, path: "/play/royalpachinka", alt: "Royal Pachinka" },
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
    try {
      if (typeof gamePath === 'string' && (gamePath.startsWith('http://') || gamePath.startsWith('https://'))) {
        // Abrir enlaces externos en nueva pestaña
        window.open(gamePath, '_blank', 'noopener,noreferrer');
      } else {
        navigate(gamePath);
      }
    } catch (err) {
      console.error('Error navigating to game:', err);
    }
  };



  return (
    <Box w={{ base: "95%", sm: "90%", md: "85%", lg: "80%" }} m="0 auto" p={{ base: "12px", sm: "16px", md: "20px" }}>
      <Text 
        fontSize={{ base: "lg", sm: "xl", md: "2xl" }} 
        fontWeight="bold" 
        textAlign="center" 
        mb={{ base: "16px", md: "20px" }} 
        bgColor="gray.200" 
        borderTopRadius="15px"
        py={{ base: "10px", md: "12px" }}
      >
        {onlyFavorites ? "Juegos Favoritos" : "Todos los Juegos"}
      </Text>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minH="300px">
          <Spinner size={{ base: "md", md: "xl" }} />
        </Box>
      ) : filteredGames.length > 0 ? (
        <Grid 
          templateColumns={{
            base: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={{ base: "12px", sm: "16px", md: "20px", lg: "30px" }}
        >
          {filteredGames.map((game) => (
            <Box
              key={game.id}
              position="relative"
              overflow="hidden"
              borderRadius={{ base: "10px", md: "15px" }}
              boxShadow="0 4px 10px rgba(0, 0, 0, 0.2)"
              cursor="pointer"
              transition="transform 0.3s, box-shadow 0.3s"
              _hover={{ transform: "scale(1.05)", boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)" }}
              aspectRatio="1/1"
            >
              <Image
                src={game.src}
                alt={game.alt}
                objectFit="contain"
                w="100%"
                h="100%"
                onClick={() => handleGameClick(game.path)}
              />
              <Box 
                position="absolute" 
                bottom="0" 
                w="100%" 
                bg="rgba(0, 0, 0, 0.5)" 
                color="white" 
                textAlign="center" 
                py={{ base: "8px", md: "10px" }}
                fontSize={{ base: "12px", md: "14px" }}
                fontWeight="500"
              >
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
